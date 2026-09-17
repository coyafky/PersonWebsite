#!/usr/bin/env node
/**
 * 日记脱敏扫描器
 *
 * 用途：把工作日志/周记/记忆笔记整理成公开日记时，扫出不该外泄的内容。
 *
 * 设计原则：**只报告，不自动改**。
 * 自动改容易把语义改坏（比如把「宝凡方案」改成「方案」可能丢信息），
 * 所以这个脚本的产出是一份人工可核对的命中清单。
 *
 * 用法：
 *   node scripts/diary-sanitize.mjs content/inbox/logs/       # 扫目录
 *   node scripts/diary-sanitize.mjs content/diary/2026-08-22.md  # 扫单文件
 *   node scripts/diary-sanitize.mjs --all                      # 扫全部三个源
 */

import fs from "node:fs/promises";
import path from "node:path";

/** 供应商与第三方品牌名：按 Coya 已确认口径，属内部信息，不得对外展示 */
const SUPPLIERS = [
  "宝凡", "普朗克", "鼎仕力", "百粤", "横泓", "添驭",
  "CMST", "BSKT", "AMXT", "TEI Racing", "teiracing", "TIERACING",
  "昆仑", "雅泛迪", "BSKT—Design",
];

/** 被监控/对标的账号名：属第三方信息，公开日记里不点名 */
const MONITORED_ACCOUNTS = ["承美车居", "我和酷酷猫", "膜洛哥", "十拇指", "小红玩问界", "群群的极氪", "粤电社", "唐山十拇指"];

/** 规则表：[标签, 正则, 说明, 建议动作] */
const RULES = [
  ...MONITORED_ACCOUNTS.map((s) => [
    "对标账号",
    new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    `被监控/对标的第三方账号：${s}`,
    "泛化为「竞品账号」或「某同行」",
  ]),

  ...SUPPLIERS.map((s) => [
    "供应商",
    new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    `第三方供应商名：${s}`,
    "移除或泛化为「某供应商」",
  ]),

  ["报价", /(?<![\d.])\d{4,6}\s*(元|块)(?![\d])/g, "价格数字", "移除具体金额"],
  ["报价", /\b(9[0-9]{3}|1[0-9]{4})\b(?=[^%]*?(?:元|价|报价))/g, "疑似报价四位/五位数", "人工确认后移除"],

  ["内部ID", /\btbl[A-Za-z0-9]{8,}\b/g, "飞书多维表格 table id", "移除"],
  ["内部ID", /\b(?:bas|app|Q6VQ)[A-Za-z0-9]{10,}={0,2}\b/g, "飞书 base/app token", "移除"],
  ["内部ID", /\bcli_[a-z0-9]{12,}\b/g, "飞书应用 app id", "移除"],
  ["内部ID", /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/g, "UUID（可能是 job/thread id）", "泛化或移除"],
  ["内部ID", /\b\d{2}-\d{2}-\d{2}-[a-z]{8,}\b/g, "内部交付编号", "泛化"],

  ["本机路径", /\/Users\/fkycoya[A-Za-z0-9/._\-]*/g, "本机绝对路径", "泛化为 ~/ 或省略"],
  ["本机路径", /\/Volumes\/usb[A-Za-z0-9/._\-]*/g, "外置盘路径", "泛化"],

  ["凭据", /gh[pousr]_[A-Za-z0-9]{20,}/g, "GitHub token", "立即移除并轮换"],
  ["凭据", /\bsk-[A-Za-z0-9_-]{20,}/g, "OpenAI 风格 key", "立即移除并轮换"],
  ["凭据", /\bAIza[0-9A-Za-z_-]{30,}/g, "Google API key", "立即移除并轮换"],
  ["凭据", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g, "AWS access key", "立即移除并轮换"],
  ["凭据", /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, "JWT", "立即移除并轮换"],
  ["凭据", /\bbearer\s+[A-Za-z0-9._~+/-]{20,}=*/gi, "Bearer token", "立即移除并轮换"],

  ["客户信息", /1[3-9]\d{9}/g, "疑似手机号", "移除或掩码"],
  ["客户信息", /[\w.+-]+@(?:qq|163|126|gmail|outlook)\.com/g, "疑似邮箱", "确认后移除"],
];

/** 允许保留的：Coya 自有品牌与项目名（官网已公开使用） */
const ALLOWLIST = ["蓝辉轻改", "蓝小辉", "lanhuiqinggai", "coyafky", "PersonWebsite"];

function stripAllowlist(text) {
  let out = text;
  for (const a of ALLOWLIST) out = out.split(a).join("«" + "·".repeat(a.length) + "»");
  return out;
}

async function collectFiles(target) {
  const stat = await fs.stat(target);
  if (stat.isFile()) return [target];
  const entries = await fs.readdir(target, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.(md|mdx)$/.test(e.name))
    .map((e) => path.join(target, e.name))
    .sort();
}

function scanOne(file, raw) {
  const lines = raw.split("\n");
  const hits = [];
  // 记录代码围栏区间——围栏内的示例命令通常无害，但仍标注出来供人工判断
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    const probe = stripAllowlist(line);
    for (const [tag, re, desc, action] of RULES) {
      re.lastIndex = 0;
      const m = probe.match(re);
      if (m) {
        hits.push({
          line: i + 1,
          tag,
          desc,
          action,
          matches: [...new Set(m)].slice(0, 4),
          context: line.trim().slice(0, 92),
          inFence,
        });
      }
    }
  }
  return hits;
}

async function main() {
  const args = process.argv.slice(2);
  const targets =
    args.length === 0 || args.includes("--all")
      ? ["content/inbox/logs", "content/weekly", "content/diary"]
      : args.filter((a) => !a.startsWith("--"));

  let totalHits = 0;
  let filesWithHits = 0;
  const files = [];

  for (const t of targets) {
    try {
      files.push(...(await collectFiles(t)));
    } catch {
      console.error(`跳过（不存在）：${t}`);
    }
  }

  const byTag = new Map();

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const hits = scanOne(file, raw);
    if (hits.length === 0) continue;
    filesWithHits++;
    totalHits += hits.length;

    console.log(`\n${file}  — ${hits.length} 处`);
    for (const h of hits) {
      byTag.set(h.tag, (byTag.get(h.tag) ?? 0) + 1);
      const fence = h.inFence ? " [围栏内]" : "";
      console.log(`  L${h.line} [${h.tag}] ${h.desc}${fence}`);
      console.log(`       → ${h.matches.join(" / ")}`);
      console.log(`       → ${h.action}`);
    }
  }

  console.log("\n" + "=".repeat(72));
  console.log(`扫描 ${files.length} 个文件；${filesWithHits} 个有命中；共 ${totalHits} 处`);
  if (byTag.size) {
    console.log("按类别：" + [...byTag.entries()].map(([k, v]) => `${k}=${v}`).join("  "));
  }
  if (totalHits > 0) {
    console.log("\n⚠️ 本脚本只报告不自动改。请逐条人工确认后再落笔。");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
