#!/usr/bin/env node
/**
 * 生成文章/卡片图片的「尺寸 + 模糊占位」清单 → lib/image-manifest.ts
 *
 * 为什么需要它：
 *   MdxImage 用的是 `<Image width={0} height={0} sizes=...>` 的响应式写法，
 *   浏览器因此**无法推断宽高比** —— 图片加载前高度是 0，加载后突然撑开。
 *   实测（2026-09-20）：`.markdown-image` 从 0px 变成 450px = 视口的 58%，
 *   这是真实的 CLS，也正是 design.md 里被点名反对的「视觉抖动」。
 *
 *   拿到真实宽高后：
 *     ① 渲染出的 img 带正确 width/height → 加载前就预留好高度 → CLS 归零
 *     ② 24px 宽的 webp 缩略图当 blurDataURL → 加载期是模糊占位而不是空白
 *
 * 用法：
 *   node scripts/image-manifest.mjs   # 全量生成（已挂在 npm run prebuild）
 *
 * 刻意不做增量、不做 --check：
 *   · 它挂在 prebuild 上，每次构建前必跑，不存在「忘了重新生成」
 *   · 全量只要 ~1.5s（16 张图），增量省下的时间不如它带来的解析复杂度
 *     （第一版把指纹存在生成文件里，抠 JSON 时第一个 `{` 落在
 *     `export type ImageMeta = {`，增量判定永远失败、--check 永远误报）
 */

import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUTPUT = path.join(ROOT, "lib", "image-manifest.ts");

// 位图才需要占位；SVG 是矢量，交给浏览器缩放
const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

// public/image-assept/ 是页面快照归档（含别人的 CSS/HTML），不是站点资产
const SKIP_DIRS = new Set(["image-assept"]);

/** 缩略图宽度。24px 在 800px 宽的容器里放大 33 倍，够糊也够小。 */
const THUMB_WIDTH = 24;

async function walkRaster(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walkRaster(full, out);
      continue;
    }
    if (RASTER.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out.sort();
}

/** sips 读真实像素尺寸。失败返回 null（该图退化成无占位，而不是让构建挂掉）。 */
async function readSize(file) {
  try {
    const { stdout } = await run("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file]);
    const w = /pixelWidth:\s*(\d+)/.exec(stdout);
    const h = /pixelHeight:\s*(\d+)/.exec(stdout);
    if (!w || !h) return null;
    return { width: Number(w[1]), height: Number(h[1]) };
  } catch {
    return null;
  }
}

/** 24px 宽 webp → base64 data URI。 */
async function makeBlurDataURL(file, tempDir, index) {
  const out = path.join(tempDir, `t${index}.webp`);
  try {
    await run("cwebp", ["-quiet", "-q", "45", "-resize", String(THUMB_WIDTH), "0", file, "-o", out]);
    const buf = await readFile(out);
    return `data:image/webp;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function publicUrl(file) {
  return "/" + path.relative(PUBLIC_DIR, file).split(path.sep).join("/");
}

async function main() {
  const files = await walkRaster(PUBLIC_DIR);
  const tempDir = await mkdtemp(path.join(tmpdir(), "img-manifest-"));

  const manifest = {};
  let skipped = 0;

  try {
    for (const [i, file] of files.entries()) {
      const url = publicUrl(file);
      const size = await readSize(file);
      if (!size) {
        skipped += 1;
        console.warn(`  ⚠ 读不到尺寸，跳过：${url}`);
        continue;
      }

      const blurDataURL = await makeBlurDataURL(file, tempDir, i);
      if (!blurDataURL) {
        skipped += 1;
        console.warn(`  ⚠ 缩略图生成失败，跳过：${url}`);
        continue;
      }

      manifest[url] = { width: size.width, height: size.height, blurDataURL };
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }

  const keys = Object.keys(manifest).sort();
  const sorted = {};
  for (const k of keys) sorted[k] = manifest[k];

  const bytes = Object.values(sorted).reduce((n, m) => n + m.blurDataURL.length, 0);
  console.log(
    `image-manifest: ${keys.length} 张（跳过 ${skipped}）` +
      `｜占位数据合计 ${(bytes / 1024).toFixed(1)} KB`,
  );

  const body = `/**
 * 自动生成 —— 不要手改。
 *   生成：node scripts/image-manifest.mjs   （已挂在 npm run prebuild）
 *
 * 用途见 scripts/image-manifest.mjs 顶部注释：
 * 给 next/image 提供真实宽高（消除图片加载前的 0 高度 = CLS）与 24px 模糊占位。
 * 没有条目 = 该图退化成现在的行为，不会报错。
 */

export type ImageMeta = {
  width: number;
  height: number;
  blurDataURL: string;
};

export const IMAGE_MANIFEST: Record<string, ImageMeta> = ${JSON.stringify(sorted, null, 2)};

/** 拿不到元数据时返回 undefined —— 调用方据此退回无占位行为。 */
export function getImageMeta(src: string): ImageMeta | undefined {
  return IMAGE_MANIFEST[src];
}
`;

  await writeFile(OUTPUT, body, "utf8");
  console.log(`✅ 写出 ${path.relative(ROOT, OUTPUT)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
