import fs from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";

const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);
const LARGE_IMAGE_BYTES = 3 * 1024 * 1024;

function usage() {
  return `Blog image management

Usage:
  npm run images:add -- --post <blog-slug> --file <source> [--name <name>] [--alt <text>]
  npm run images:check

Examples:
  npm run images:add -- --post 2026-08-23-example --file ~/Desktop/chart.png --name architecture --alt "系统架构图"
  npm run images:check`;
}

function parseFlags(tokens) {
  const flags = new Map();
  const allowedFlags = new Set(["alt", "file", "name", "post"]);

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    const key = token.slice(2);
    if (!allowedFlags.has(key)) {
      throw new Error(`Unknown option: --${key}`);
    }
    const value = tokens[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }

    flags.set(key, value);
    index += 1;
  }

  return flags;
}

async function isFile(filePath) {
  try {
    return (await fs.stat(filePath)).isFile();
  } catch {
    return false;
  }
}

function stripFencedCode(markdown) {
  const lines = markdown.split("\n");
  const output = [];
  let closingFence = null;

  for (const line of lines) {
    const trimmed = line.trimStart();

    if (closingFence) {
      if (trimmed.startsWith(closingFence)) {
        closingFence = null;
      }
      output.push("");
      continue;
    }

    const match = trimmed.match(/^(`{3,}|~{3,})/);
    if (match) {
      closingFence = match[1];
      output.push("");
      continue;
    }

    output.push(line);
  }

  return output.join("\n");
}

function lineNumberAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

function extractImageReferences(markdown) {
  const source = stripFencedCode(markdown);
  const references = [];
  const markdownImage = /!\[([^\]]*)\]\(\s*(?:<([^>\n]+)>|([^\s)\n]+))(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g;
  const htmlImage = /<img\b([^>]*)>/gi;
  let match;

  while ((match = markdownImage.exec(source)) !== null) {
    references.push({
      alt: match[1].trim(),
      line: lineNumberAt(source, match.index),
      src: (match[2] ?? match[3]).trim(),
    });
  }

  while ((match = htmlImage.exec(source)) !== null) {
    const attributes = match[1];
    const src = attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!src) continue;

    references.push({
      alt: attributes.match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1]?.trim() ?? "",
      line: lineNumberAt(source, match.index),
      src: src.trim(),
    });
  }

  return references.toSorted((a, b) => a.line - b.line);
}

function isRemoteOrEmbedded(src) {
  return /^(?:https?:)?\/\//i.test(src) || /^(?:data|blob):/i.test(src);
}

function normalizePublicUrl(src) {
  if (!src.startsWith("/") || src.startsWith("//")) return null;

  const withoutQuery = src.split(/[?#]/, 1)[0];
  return path.posix.normalize(decodeURIComponent(withoutQuery));
}

/**
 * 校验 frontmatter 里的封面引用（`cover` / `coverAlt`）。
 *
 * **纯函数**：只做字符串判定，不碰文件系统 —— 因此可以直接被
 * lib/content 下的单元测试调用（见 lib/content/cover.test.ts）。
 * 「文件是否真实存在」「是否超过 3 MB」由调用方在拿到 publicUrl 后补验，
 * 与正文图片走同一条路径（这里给不出，因为那两步需要磁盘）。
 *
 * 规则与正文图片一致：
 *   · 必须是根相对路径（拒绝 http(s) / data: / blob: 等远程或内嵌地址）；
 *   · 必须落在文章自己的托管目录 `/images/blog/<slug>/`（封面是新字段，一律要求托管）；
 *   · 扩展名必须在白名单内；
 *   · 有 cover 就必须有非空 coverAlt。
 *
 * @param {object} input
 * @param {unknown} input.cover           frontmatter.cover 原值
 * @param {unknown} input.coverAlt        frontmatter.coverAlt 原值
 * @param {string}  input.expectedPrefix  该文章的托管目录，形如 `/images/blog/<slug>/`
 * @param {string}  input.location        报错前缀，形如 `content/blog/foo.md`
 * @returns {{ publicUrl: string | null, errors: string[], warnings: string[] }}
 */
export function validateCoverReference({ cover, coverAlt, expectedPrefix, location }) {
  const errors = [];
  const warnings = [];
  const hasCoverAlt = typeof coverAlt === "string" && coverAlt.trim() !== "";

  // 没写 cover：什么都没有就静默通过；只写了 coverAlt 多半是笔误，给 warning。
  if (cover === undefined || cover === null || cover === "") {
    if (hasCoverAlt) {
      warnings.push(`${location} declares coverAlt without a cover; it will be ignored`);
    }
    return { publicUrl: null, errors, warnings };
  }

  if (typeof cover !== "string") {
    errors.push(`${location} cover must be a string path (got ${typeof cover})`);
    return { publicUrl: null, errors, warnings };
  }

  const src = cover.trim();

  if (!hasCoverAlt) {
    errors.push(`${location} cover is missing useful coverAlt text (${src})`);
  }

  if (isRemoteOrEmbedded(src)) {
    errors.push(`${location} cover must be a managed local asset, not a remote or embedded URL (${src})`);
    return { publicUrl: null, errors, warnings };
  }

  let publicUrl;
  try {
    publicUrl = normalizePublicUrl(src);
  } catch {
    errors.push(`${location} contains an invalid URL-encoded cover path (${src})`);
    return { publicUrl: null, errors, warnings };
  }

  if (!publicUrl) {
    errors.push(`${location} cover must use a root-relative ${expectedPrefix}... path (${src})`);
    return { publicUrl: null, errors, warnings };
  }

  if (!publicUrl.startsWith(expectedPrefix)) {
    errors.push(`${location} cover must keep this post's image under ${expectedPrefix} (${src})`);
  }

  const extension = path.posix.extname(publicUrl).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(extension)) {
    errors.push(`${location} cover uses an unsupported image extension (${src})`);
  }

  return { publicUrl, errors, warnings };
}

async function readBlogPosts(projectRoot) {
  const contentRoot = path.join(projectRoot, "content", "blog");
  const entries = await fs.readdir(contentRoot, { withFileTypes: true });
  const posts = [];

  for (const entry of entries) {
    const extension = path.extname(entry.name).toLowerCase();
    if (!entry.isFile() || !new Set([".md", ".mdx"]).has(extension)) continue;

    const filePath = path.join(contentRoot, entry.name);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const bodyStart = raw.indexOf(parsed.content);
    const lineOffset = bodyStart < 0
      ? 0
      : raw.slice(0, bodyStart).split("\n").length - 1;
    posts.push({
      body: parsed.content,
      // frontmatter 封面：原样传出（可能是非字符串），交给 validateCoverReference 判定
      cover: parsed.data?.cover,
      coverAlt: parsed.data?.coverAlt,
      filePath,
      lineOffset,
      relativePath: path.relative(projectRoot, filePath),
      slug: path.basename(entry.name, extension),
    });
  }

  return posts;
}

async function walkImageAssets(directory) {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") return [];
    throw error;
  }

  const assets = [];
  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      assets.push(...(await walkImageAssets(filePath)));
    } else if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      assets.push(filePath);
    }
  }

  return assets;
}

async function checkImages(projectRoot) {
  const publicRoot = path.join(projectRoot, "public");
  const managedRoot = path.join(publicRoot, "images", "blog");
  const posts = await readBlogPosts(projectRoot);
  const referencedManagedAssets = new Set();
  const errors = [];
  const warnings = [];
  let referenceCount = 0;
  let coverCount = 0;

  for (const post of posts) {
    const references = extractImageReferences(post.body);
    referenceCount += references.length;

    // frontmatter 封面：与正文图片共用同一套「受管理引用」登记 —— 不登记的话
    // public/images/blog/<slug>/cover.webp 会被下面的 unused managed image 误报。
    if (post.cover !== undefined || post.coverAlt !== undefined) {
      const expectedPrefix = `/images/blog/${post.slug}/`;
      const location = `${post.relativePath} (frontmatter cover)`;
      const coverResult = validateCoverReference({
        cover: post.cover,
        coverAlt: post.coverAlt,
        expectedPrefix,
        location,
      });

      errors.push(...coverResult.errors);
      warnings.push(...coverResult.warnings);

      if (coverResult.publicUrl) {
        coverCount += 1;
        const assetPath = path.resolve(publicRoot, `.${coverResult.publicUrl}`);
        const insidePublicRoot = assetPath.startsWith(`${publicRoot}${path.sep}`);
        if (!insidePublicRoot || !(await isFile(assetPath))) {
          errors.push(`${location} references a missing public asset (${coverResult.publicUrl})`);
        } else {
          referencedManagedAssets.add(assetPath);
        }
      }
    }

    for (const reference of references) {
      const location = `${post.relativePath}:${reference.line + post.lineOffset}`;

      if (!reference.alt) {
        errors.push(`${location} image is missing useful alt text (${reference.src})`);
      }

      if (isRemoteOrEmbedded(reference.src)) {
        warnings.push(`${location} uses a remote or embedded image; prefer a managed local asset (${reference.src})`);
        continue;
      }

      let publicUrl;
      try {
        publicUrl = normalizePublicUrl(reference.src);
      } catch {
        errors.push(`${location} contains an invalid URL-encoded image path (${reference.src})`);
        continue;
      }

      if (!publicUrl) {
        errors.push(`${location} must use a root-relative /images/blog/... path (${reference.src})`);
        continue;
      }

      const expectedPrefix = `/images/blog/${post.slug}/`;
      const managed = publicUrl.startsWith("/images/blog/");
      if (managed && !publicUrl.startsWith(expectedPrefix)) {
        errors.push(`${location} must keep this post's image under ${expectedPrefix} (${reference.src})`);
      } else if (!managed) {
        warnings.push(`${location} is a legacy asset outside ${expectedPrefix} (${reference.src})`);
      }

      const extension = path.posix.extname(publicUrl).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(extension)) {
        errors.push(`${location} uses an unsupported image extension (${reference.src})`);
      }

      const assetPath = path.resolve(publicRoot, `.${publicUrl}`);
      const insidePublicRoot = assetPath.startsWith(`${publicRoot}${path.sep}`);
      if (!insidePublicRoot || !(await isFile(assetPath))) {
        errors.push(`${location} references a missing public asset (${reference.src})`);
        continue;
      }

      if (managed) referencedManagedAssets.add(assetPath);
    }
  }

  const managedAssets = await walkImageAssets(managedRoot);
  for (const assetPath of managedAssets) {
    const stats = await fs.stat(assetPath);
    const publicUrl = `/${path.relative(publicRoot, assetPath).split(path.sep).join("/")}`;

    if (!referencedManagedAssets.has(assetPath)) {
      warnings.push(`unused managed image: ${publicUrl}`);
    }

    if (stats.size > LARGE_IMAGE_BYTES) {
      warnings.push(`large managed image (${(stats.size / 1024 / 1024).toFixed(1)} MB): ${publicUrl}`);
    }
  }

  for (const error of errors) console.error(`ERROR ${error}`);
  for (const warning of warnings) console.warn(`WARN  ${warning}`);

  console.log(
    `Checked ${posts.length} blog posts, ${referenceCount} body image references, ${coverCount} covers, and ${managedAssets.length} managed assets: ${errors.length} error(s), ${warnings.length} warning(s).`,
  );

  return errors.length === 0;
}

function safeAssetName(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function addImage(projectRoot, flags) {
  const post = flags.get("post");
  const sourceArgument = flags.get("file");
  if (!post || !sourceArgument) {
    throw new Error("images:add requires both --post and --file");
  }

  if (!/^[a-z0-9][a-z0-9-]*$/.test(post)) {
    throw new Error(`Invalid blog slug: ${post}`);
  }

  const postExists = await Promise.any([
    isFile(path.join(projectRoot, "content", "blog", `${post}.md`)).then((found) => found ? true : Promise.reject()),
    isFile(path.join(projectRoot, "content", "blog", `${post}.mdx`)).then((found) => found ? true : Promise.reject()),
  ]).catch(() => false);
  if (!postExists) {
    throw new Error(`Blog post not found: content/blog/${post}.md or .mdx`);
  }

  const sourcePath = path.resolve(sourceArgument);
  if (!(await isFile(sourcePath))) {
    throw new Error(`Source image not found: ${sourcePath}`);
  }

  const extension = path.extname(sourcePath).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(extension)) {
    throw new Error(`Unsupported image extension: ${extension || "(none)"}`);
  }

  const requestedName = flags.get("name");
  const rawName = requestedName
    ? path.basename(requestedName, path.extname(requestedName))
    : path.basename(sourcePath, extension);
  const assetName = safeAssetName(rawName);
  if (!assetName) {
    throw new Error("Could not create an ASCII filename; pass --name with a short descriptive English name");
  }

  const targetDirectory = path.join(projectRoot, "public", "images", "blog", post);
  const targetPath = path.join(targetDirectory, `${assetName}${extension}`);
  await fs.mkdir(targetDirectory, { recursive: true });
  try {
    await fs.copyFile(sourcePath, targetPath, fsConstants.COPYFILE_EXCL);
  } catch (error) {
    if (error && error.code === "EEXIST") {
      throw new Error(`Target already exists; choose another --name: ${targetPath}`);
    }
    throw error;
  }

  const alt = flags.get("alt") ?? "请填写有意义的替代文本";
  const publicUrl = `/images/blog/${post}/${assetName}${extension}`;
  console.log(`Added ${path.relative(projectRoot, targetPath)}`);
  console.log(`\n![${alt}](${publicUrl})`);
}

async function main() {
  const projectRoot = process.cwd();
  const command = process.argv[2];

  if (command === "check") {
    if (!(await checkImages(projectRoot))) process.exitCode = 1;
    return;
  }

  if (command === "add") {
    await addImage(projectRoot, parseFlags(process.argv.slice(3)));
    return;
  }

  console.log(usage());
  if (command && command !== "help" && command !== "--help") process.exitCode = 1;
}

// 仅在被当作 CLI 直接执行时跑 main()。这样 lib/content 的单元测试可以
// `import { validateCoverReference } from "../../scripts/content-images.mjs"`
// 而不触发一次真实的检查（否则测试进程会被塞进 process.argv 的杂项参数、
// 打印 usage 并把 exitCode 置 1）。
const isEntryPoint =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isEntryPoint) {
  main().catch((error) => {
    console.error(`ERROR ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
