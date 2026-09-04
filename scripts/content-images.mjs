import fs from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import process from "node:process";
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

  for (const post of posts) {
    const references = extractImageReferences(post.body);
    referenceCount += references.length;

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
    `Checked ${posts.length} blog posts, ${referenceCount} image references, and ${managedAssets.length} managed assets: ${errors.length} error(s), ${warnings.length} warning(s).`,
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

main().catch((error) => {
  console.error(`ERROR ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
