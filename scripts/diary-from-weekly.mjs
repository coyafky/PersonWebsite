#!/usr/bin/env node
/**
 * 从周记时间轴生成日记
 *
 * 背景：周记里有一段 `## 🕒 Time Log`，本身就是「一天一行」：
 *     | **周一 08-17** | Hermes 改造（…） | `#CRM #内容管线` |
 * 这是把周记拆成日记的唯一可靠来源 —— 周记的正文是按主题组织的，
 * 无法归属到具体某一天，所以正文只作为「本周整体」参照，不冒充当日内容。
 *
 * 诚实性纪律：
 *   - 标 source: weekly（读者可分辨这是重建的，不是当日实记）
 *   - 正文只有一行就写一行，不注水
 *   - 缺口行（原文写「数据缺口」）跳过，不生成
 *   - 已有日记（content/diary/<date>.md 存在）不覆盖 —— 当日日志优先
 *
 * 用法：
 *   node scripts/diary-from-weekly.mjs            # 试运行，只打印计划
 *   node scripts/diary-from-weekly.mjs --write    # 实际写盘
 */

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const WEEKLY_DIR = path.join(ROOT, "content/weekly");
const DIARY_DIR = path.join(ROOT, "content/diary");
const WRITE = process.argv.includes("--write");
const YEAR = "2026";

const WEEKDAY_CN = { 一: "周一", 二: "周二", 三: "周三", 四: "周四", 五: "周五", 六: "周六", 日: "周日" };

/** 从 week 字段（2026-W34）算出该周的日期范围，用于把 MM-DD 补全年份 */
function weekRange(weekKey) {
  const m = /^(\d{4})-W(\d{1,2})$/.exec(weekKey);
  if (!m) return null;
  const [, y, w] = m;
  // ISO 周：该周周四所在日期
  const jan4 = new Date(Date.UTC(Number(y), 0, 4));
  const day = jan4.getUTCDay() || 7;
  const week1Mon = new Date(jan4);
  week1Mon.setUTCDate(jan4.getUTCDate() - day + 1);
  const monday = new Date(week1Mon);
  monday.setUTCDate(week1Mon.getUTCDate() + (Number(w) - 1) * 7);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return { monday, sunday };
}

/** 把 "Hermes 改造（CRM 群/触发手册）；dsh 品牌插件开发" 拆成要点 */
function splitPoints(text) {
  return text
    .split(/[；;]/)
    .map((s) => s.trim().replace(/^[·•\-]\s*/, ""))
    .filter(Boolean);
}

/** 取标题：去掉标签与括号补充，取第一段，控制在 ~34 字内 */
function makeTitle(dateStr, content) {
  const clean = content
    .replace(/`#[^`]*`/g, "")
    .replace(/[（(][^）)]*[）)]/g, "")
    .split(/[；;、,，]/)[0]
    .trim();
  const base = clean.length > 34 ? `${clean.slice(0, 33)}…` : clean;
  return `${dateStr.slice(5)} · ${base || "当日记录"}`;
}

/** 抽取一行里的 #标签 */
function extractTags(text) {
  const tags = [...text.matchAll(/#([\w\u4e00-\u9fa5-]+)/g)].map((m) => m[1]);
  return [...new Set(tags)];
}

async function main() {
  // 注意：文件名有 2026-W34.mdx 与 2026-W-31.mdx 两种写法（后者带横杠）
  const files = (await fs.readdir(WEEKLY_DIR)).filter((f) => /^2026-W-?\d+\.(md|mdx)$/.test(f)).sort();
  const existing = new Set(
    (await fs.readdir(DIARY_DIR)).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")),
  );

  const planned = [];
  const skipped = { gap: [], dup: [], outofrange: [] };

  for (const file of files) {
    const raw = await fs.readFile(path.join(WEEKLY_DIR, file), "utf8");
    const fm = /^---\n([\s\S]*?)---/.exec(raw)?.[1] ?? "";
    const weekKey = /week:\s*"([^"]+)"/.exec(fm)?.[1] ?? "";
    const summary = /summary:\s*"((?:[^"\\]|\\.)*)"/.exec(fm)?.[1] ?? "";
    const range = weekRange(weekKey);
    if (!range) continue;

    const seg = /##[^\n]*Time Log([\s\S]*?)(?=\n## |\Z)/.exec(raw)?.[1] ?? "";
    const rows = [
      ...seg.matchAll(/^\|\s*\*\*周([一二三四五六日])\s*(\d{2})-(\d{2})\*\*\s*\|(.*?)\|(.*?)\|/gm),
    ];

    for (const [, , mm, dd, cell, tagCell] of rows) {
      const body = cell.trim();
      if (!body || /缺口|无当日记忆/.test(body)) {
        skipped.gap.push(`${weekKey} ${mm}-${dd}`);
        continue;
      }
      const dateStr = `${YEAR}-${mm}-${dd}`;
      const d = new Date(`${dateStr}T00:00:00Z`);
      if (d < range.monday || d > range.sunday) {
        skipped.outofrange.push(`${weekKey} ${dateStr}`);
        continue;
      }
      if (existing.has(dateStr)) {
        skipped.dup.push(dateStr);
        continue;
      }
      // 链接必须用文件名派生的 slug（如 2026-W-31），week 字段不带横杠，两者不一致
      const weekSlug = file.replace(/\.(md|mdx)$/, "");
      planned.push({ weekKey, weekSlug, dateStr, body, tagCell: tagCell.trim(), weekSummary: summary });
    }
  }

  console.log(`周记文件 ${files.length} 个 → 抽取到 ${planned.length} 个待生成日期`);
  console.log(`跳过：缺口 ${skipped.gap.length} / 已有日记 ${skipped.dup.length} / 越界 ${skipped.outofrange.length}`);
  if (skipped.dup.length) console.log(`  （已有日记，当日日志优先）: ${skipped.dup.join(", ")}`);
  console.log();

  for (const p of planned) {
    const points = splitPoints(p.body);
    const inlineTags = extractTags(`${p.body} ${p.tagCell}`);
    const tags = ["工作日记", ...inlineTags];

    const bodyLines = [
      `# ${points[0] ?? "当日记录"}`,
      "",
      `> 📌 本篇由 [${p.weekKey} 周记](/weekly/${p.weekSlug}) 的时间轴重建，非当日实记。周记正文按主题组织、无法逐条归属到某一天，因此这里只保留当日可考的内容。`,
      "",
      ...points.map((x) => `- ${x}`),
      "",
      `**本周整体**：${p.weekSummary}`,
      "",
    ];

    const fmLines = [
      "---",
      `title: "${makeTitle(p.dateStr, p.body)}"`,
      `date: "${p.dateStr}"`,
      `updated: "${p.dateStr}"`,
      `summary: "据周记时间轴重建：${points.join("；").replace(/"/g, "'").slice(0, 170)}"`,
      "tags:",
      ...tags.map((t) => `  - "${t}"`),
      "lang: zh",
      "source: weekly",
      "status: published",
      "---",
      "",
    ];

    const content = [...fmLines, ...bodyLines].join("\n");
    console.log(`  ${p.dateStr}  ${makeTitle(p.dateStr, p.body)}`);

    if (WRITE) {
      await fs.writeFile(path.join(DIARY_DIR, `${p.dateStr}.md`), content, "utf8");
    }
  }

  console.log();
  console.log(WRITE ? "✅ 已写盘" : "（试运行，加 --write 实际写盘）");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
