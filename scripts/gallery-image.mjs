#!/usr/bin/env node
/**
 * gallery-image.mjs —— /gallery 的配图工作流
 *
 * 为什么单独写一个：已有的 scripts/content-images.mjs 是给博客正文图用的
 * （它管 public/images/ 和正文里的 ![](...) 引用），gallery 走的是另一套
 * —— 配图路径写在每篇的 frontmatter `image:` 字段上。两者不通用。
 *
 * 用法：
 *   node scripts/gallery-image.mjs add <slug> <源图路径> [--quality 82]
 *       把源图转成 WebP 放进 public/gallery/<slug>.webp，
 *       并把 content/gallery/<slug>.md 的 image 字段改成 /gallery/<slug>.webp
 *
 *   node scripts/gallery-image.mjs check
 *       校验每篇 gallery 的 image 指向的文件真实存在且是 webp。
 *       作为构建门禁跑（见 package.json 的 prebuild）。
 *
 * 为什么强制 webp：生图出来是 PNG，这次 4 张合计 9.6MB，转 webp 后 726KB，
 * 压掉 92%。PNG 直进 public/ 会让画廊首屏拖到几秒。
 *
 * 依赖：cwebp（brew install webp）
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const GALLERY_CONTENT = join(ROOT, "content/gallery");
const GALLERY_PUBLIC = join(ROOT, "public/gallery");

const args = process.argv.slice(2);
const command = args[0];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function galleryEntries() {
  if (!existsSync(GALLERY_CONTENT)) fail(`找不到 ${GALLERY_CONTENT}`);
  return readdirSync(GALLERY_CONTENT)
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((name) => ({ slug: name.replace(/\.mdx?$/, ""), file: join(GALLERY_CONTENT, name) }));
}

function imageFieldOf(file) {
  const text = readFileSync(file, "utf8");
  const match = text.match(/^image:\s*"([^"]+)"/m);
  return { text, image: match ? match[1] : null };
}

function requireCwebp() {
  try {
    execFileSync("cwebp", ["-version"], { stdio: "ignore" });
  } catch {
    fail("找不到 cwebp。安装：brew install webp");
  }
}

// ── add：装图 ──────────────────────────────────────────────────────
function add(slug, source, quality) {
  if (!slug) fail("用法：gallery-image.mjs add <slug> <源图路径> [--quality 82]");
  const entry = galleryEntries().find((it) => it.slug === slug);
  if (!entry) fail(`content/gallery/ 里没有 ${slug}`);
  if (!source || !existsSync(source)) fail(`源图不存在：${source}`);
  requireCwebp();

  const webp = join(GALLERY_PUBLIC, `${slug}.webp`);
  execFileSync("cwebp", ["-q", String(quality), "-m", "6", "-metadata", "none", source, "-o", webp], {
    stdio: "inherit",
  });

  const { text, image } = imageFieldOf(entry.file);
  const wanted = `/gallery/${slug}.webp`;
  if (image === wanted) {
    console.log(`   frontmatter 已是 ${wanted}，无需改`);
  } else {
    const next = text.replace(/^image:\s*"[^"]+"/m, `image: "${wanted}"`);
    if (next === text) fail(`${entry.file} 里找不到 image: 字段`);
    writeFileSync(entry.file, next);
    console.log(`   已把 image 改为 ${wanted}（原：${image ?? "无"}）`);
  }

  const srcSize = statSync(source).size;
  const outSize = statSync(webp).size;
  console.log(
    `✅ ${basename(source)} → public/gallery/${slug}.webp  ` +
      `${(srcSize / 1024).toFixed(0)}KB → ${(outSize / 1024).toFixed(0)}KB ` +
      `(压掉 ${(100 - (outSize / srcSize) * 100).toFixed(0)}%)`,
  );
}

// ── check：门禁 ────────────────────────────────────────────────────
function check() {
  const entries = galleryEntries();
  const errors = [];
  const warnings = [];

  for (const entry of entries) {
    const { image } = imageFieldOf(entry.file);
    if (!image) {
      errors.push(`${entry.slug}: frontmatter 缺 image 字段`);
      continue;
    }
    if (!image.startsWith("/gallery/")) {
      warnings.push(`${entry.slug}: image 不在 /gallery/ 下（${image}）`);
    }
    if (!/\.webp$/.test(image)) {
      errors.push(`${entry.slug}: image 必须是 webp（当前 ${image}）—— PNG/SVG 会拖慢首屏`);
    }
    const onDisk = join(ROOT, "public", image.replace(/^\//, ""));
    if (!existsSync(onDisk)) {
      errors.push(`${entry.slug}: 找不到文件 public${image}`);
      continue;
    }
    const kb = statSync(onDisk).size / 1024;
    if (kb > 600) warnings.push(`${entry.slug}: ${kb.toFixed(0)}KB 偏大，考虑降质量`);
  }

  // 反向：public/gallery 里有图但没有任何内容引用（孤儿文件）
  if (existsSync(GALLERY_PUBLIC)) {
    const referenced = new Set(
      entries.map((e) => imageFieldOf(e.file).image).filter(Boolean),
    );
    for (const name of readdirSync(GALLERY_PUBLIC)) {
      if (!referenced.has(`/gallery/${name}`)) {
        warnings.push(`public/gallery/${name} 没有任何内容引用（孤儿文件）`);
      }
    }
  }

  console.log(
    `Checked ${entries.length} gallery entries: ${errors.length} error(s), ${warnings.length} warning(s).`,
  );
  for (const w of warnings) console.log(`  ⚠ ${w}`);
  for (const e of errors) console.error(`  ✖ ${e}`);
  if (errors.length) process.exit(1);
}

if (command === "add") {
  const rest = args.slice(1).filter((a) => !a.startsWith("--"));
  const qIndex = args.indexOf("--quality");
  add(rest[0], rest[1], qIndex > -1 ? Number(args[qIndex + 1]) : 82);
} else if (command === "check") {
  check();
} else {
  console.log("用法：gallery-image.mjs <add|check> ...");
  process.exit(command ? 1 : 0);
}
