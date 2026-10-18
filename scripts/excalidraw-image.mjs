#!/usr/bin/env node
/**
 * excalidraw-image.mjs — 把 Excalidraw 图导成符合本站博客图片规范的 WebP。
 *
 * 为什么需要它：Excalidraw 只能导出 PNG，而本站博客图片规范要求
 *   ① 落到 public/images/blog/<slug>/   ② 优先 WebP   ③ 登记进 manifest
 * 手工做要四步（render → cwebp → images:add → images:manifest），容易漏。
 *
 * 这条命令把四步串起来，并且复用已有的两个脚本（不做重复实现）：
 *   - scripts/webp-batch.sh    cwebp 转换（含方向归正、体积回退保护）
 *   - scripts/content-images.mjs add   落库（含 slug 校验、拒绝覆盖、输出引用）
 *
 * 用法：
 *   npm run excalidraw:add -- \
 *     --diagram docs/diagrams/stack-frame-lifecycle.excalidraw \
 *     --post 2026-10-17-multi-bot-specialized-workflow \
 *     --name stack-frames \
 *     --alt "外层调用内层时栈帧的四个阶段"
 *
 * 选项：
 *   --diagram <path>   .excalidraw 源文件（用 MCP 的 headless renderer 出图）
 *   --png <path>       已渲染好的 PNG，跳过渲染步骤
 *   --post <slug>      目标博客 slug（必须已存在）
 *   --name <name>      图片基名，英文 kebab-case
 *   --alt <text>       alt 文本（必填，描述图片传达的信息）
 *   --scale <1-4>      渲染倍率，默认 2（图表要清晰）
 *   --mode <m>         lossless | lossy，默认 lossless（图表是线条图，无损更小）
 *   --quality <N>      有损质量，默认沿用 webp-batch.sh 的 82
 *   --keep-temp        保留中间产物（排查用）
 *   -h, --help         帮助
 */
import { execFileSync } from "node:child_process";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const HELP = `用法：npm run excalidraw:add -- --diagram <x.excalidraw> --post <slug> --name <name> --alt "..."

把 Excalidraw 图导出为符合本站规范的博客配图（WebP，落在 public/images/blog/<slug>/）。

选项：
  --diagram <path>   .excalidraw 源文件（headless 渲染）
  --png <path>       已渲染好的 PNG（跳过渲染）
  --post <slug>      目标博客 slug
  --name <name>      图片基名，英文 kebab-case
  --alt <text>       alt 文本（必填）
  --scale <1-4>      渲染倍率，默认 2
  --mode <m>         lossless | lossy，默认 lossless
  --quality <N>      有损质量，默认 82
  --keep-temp        保留中间产物
`;

function parseFlags(argv) {
  const flags = new Map();
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) throw new Error(`未知参数：${token}`);
    const key = token.slice(2);
    if (key === "keep-temp" || key === "help") {
      flags.set(key, true);
      continue;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`--${key} 需要一个值`);
    }
    flags.set(key, value);
    i += 1;
  }
  return flags;
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    ...options,
  });
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** cwebp 在 homebrew 下但可能不在 PATH —— 本机踩过这个坑，提前给出可执行的提示。 */
function ensureCwebp() {
  const finder = process.platform === "win32" ? "where" : "which";
  try {
    run(finder, ["cwebp"], { capture: true });
    return;
  } catch {
    const hint = ["/opt/homebrew/bin/cwebp", "/usr/local/bin/cwebp"].find((p) => {
      try {
        fsSync.accessSync(p);
        return true;
      } catch {
        return false;
      }
    });
    if (hint) {
      throw new Error(
        `找不到 cwebp，但它在 ${hint}。把 homebrew 的 bin 加进 PATH：\n` +
        `  export PATH="/opt/homebrew/bin:$PATH"`,
      );
    }
    throw new Error("找不到 cwebp。安装：brew install webp");
  }
}

async function resolvePost(projectRoot, slug) {
  for (const ext of [".md", ".mdx"]) {
    const p = path.join(projectRoot, "content", "blog", `${slug}${ext}`);
    if (await exists(p)) return p;
  }
  throw new Error(`找不到博客文章：content/blog/${slug}.md 或 .mdx`);
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));
  if (flags.get("help")) {
    console.log(HELP);
    return;
  }

  const projectRoot = process.cwd();
  const diagram = flags.get("diagram");
  const png = flags.get("png");
  const post = flags.get("post");
  const name = flags.get("name");
  const alt = flags.get("alt");
  const scale = flags.get("scale") ?? "2";
  const mode = flags.get("mode") ?? "lossless";
  const quality = flags.get("quality");
  const keepTemp = flags.get("keep-temp") === true;

  if (!post) throw new Error("缺少 --post（目标博客 slug）");
  if (!name) throw new Error("缺少 --name（图片基名）");
  if (!alt) throw new Error("缺少 --alt（alt 文本，不能留空）");
  if (!diagram && !png) throw new Error("需要 --diagram 或 --png 之一");
  if (diagram && png) throw new Error("--diagram 与 --png 只能给一个");
  if (!["lossless", "lossy"].includes(mode)) {
    throw new Error("--mode 只能是 lossless 或 lossy");
  }
  if (!["1", "2", "3", "4"].includes(scale)) {
    throw new Error("--scale 只能是 1-4");
  }

  await resolvePost(projectRoot, post);
  ensureCwebp();

  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "excalidraw-img-"));
  const tmpPng = path.join(tmpRoot, `${name}.png`);
  const tmpWebpDir = path.join(tmpRoot, "webp");

  try {
    // ── 1. 渲染 PNG ────────────────────────────────────────────
    let pngPath = png;
    if (diagram) {
      const diagramPath = path.resolve(diagram);
      if (!(await exists(diagramPath))) {
        throw new Error(`找不到源文件：${diagramPath}`);
      }
      console.log(`▸ 渲染 ${path.relative(projectRoot, diagramPath)} (scale ${scale}) …`);
      // render 是离线渲染，不需要启动 canvas server，因此不占 3000 端口
      run("npx", [
        "-y", "mcp-excalidraw-server", "render", diagramPath,
        "--out", tmpPng, "--scale", scale,
      ]);
      pngPath = tmpPng;
    } else {
      pngPath = path.resolve(png);
      if (!(await exists(pngPath))) {
        throw new Error(`找不到 PNG：${pngPath}`);
      }
    }

    // ── 2. 转 WebP ─────────────────────────────────────────────
    console.log(`▸ cwebp 转换（${mode}）…`);
    const webpArgs = [path.join(projectRoot, "scripts", "webp-batch.sh"),
      pngPath, "-m", mode, "-o", tmpWebpDir];
    if (quality) webpArgs.push("-q", quality);
    run("bash", webpArgs);

    const base = path.basename(pngPath, path.extname(pngPath));
    const webpPath = path.join(tmpWebpDir, `${base}.webp`);
    if (!(await exists(webpPath))) {
      throw new Error(
        `cwebp 没有产出 ${webpPath}。\n` +
        `webp-batch.sh 在「WebP 比原图更大」时会跳过写出；` +
        `可改用 --mode lossy 或直接调 webp-batch.sh 加 --force 排查。`,
      );
    }

    // 体积提醒（images:check 的阈值是 3 MB）
    const bytes = (await fs.stat(webpPath)).size;
    if (bytes > 3 * 1024 * 1024) {
      console.warn(
        `⚠️  产物 ${(bytes / 1024 / 1024).toFixed(2)} MB，超过 3 MB 会被 images:check 警告。` +
        `\n   可降低 --scale，或改 --mode lossy。`,
      );
    }

    // ── 3. 落库 ────────────────────────────────────────────────
    console.log("▸ 写入博客图片目录 …");
    run("node", [
      path.join(projectRoot, "scripts", "content-images.mjs"), "add",
      "--post", post,
      "--file", webpPath,
      "--name", name,
      "--alt", alt,
    ]);

    // ── 4. 登记 manifest（宽高 + 模糊占位）──────────────────────
    console.log("▸ 更新图片清单 …");
    // manifest 依赖 sips / cwebp，只在本地跑；服务器上不跑（见部署文档）
    run("npm", ["run", "images:manifest", "--silent"]);

    console.log("\n✅ 完成。别忘了：图里的关键数字，正文要有文字表述。");
  } finally {
    if (keepTemp) {
      console.log(`\n中间产物保留在：${tmpRoot}`);
    } else {
      await fs.rm(tmpRoot, { recursive: true, force: true });
    }
  }
}

main().catch((error) => {
  console.error(`\n❌ ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
