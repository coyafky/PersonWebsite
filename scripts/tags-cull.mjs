#!/usr/bin/env node
/**
 * tags-cull.mjs —— 标签精简：每篇只保留 1~2 个内容标签
 *
 * 为什么需要它（2026-09-20 实测）：
 *   全站 247 篇内容用了 512 个不同标签，其中 379 个（74%）只用过 1 次。
 *   点一个标签只看到 1 篇文章，标签就失去了"导航"的意义。
 *   根因不是"没合并"，是**标注太多** —— 平均每篇 4.3 个标签，
 *   第 3 个往后基本都是一次性关键词。
 *
 * 规则（用户 2026-09-20 确认）：
 *   1. **栏目标签原样保留**（工作日记 / 博客 / weekly）—— 不计入配额
 *   2. 内容标签最多 2 个：
 *      - 第 1 个 = 作者写在最前面的那个（作者认定的主标签）
 *      - 第 2 个 = 其余中**词频最高**的核心词（核心词表 = 内容标签出现 >= 3 次）
 *        ⚠️ 不是"顺序上第一个核心词" —— 那会弃掉 AI Agent(27次) 这种最重要的，
 *        只因 LLM(6次) 排在它前面。导航价值跟词频走，不跟书写顺序走。
 *
 * 写回时用的是**归一化后**的标签（见 lib/content/tag-aliases.ts），
 * 所以 frontmatter 本身就是规范写法，别名表退化成兜底网。
 *
 * 用法：
 *   node scripts/tags-cull.mjs             # dry-run，只报告不写
 *   node scripts/tags-cull.mjs --apply     # 真正写入
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { normalizeTags } from "../lib/content/tag-aliases.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const KINDS = ["blog","diary","weekly","learning","projects","career","book-list","course-list","gallery"];
const COLLECTION = new Set(["工作日记", "博客", "weekly"]);
const MIN_CORE_FREQ = 3;
const APPLY = process.argv.includes("--apply");

function walk(dir, kind, out) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p, kind, out); continue; }
    if (!/\.mdx?$/.test(e.name)) continue;
    out.push({ file: p, kind, rel: path.relative(ROOT, p) });
  }
}

const files = [];
for (const k of KINDS) walk(path.join(ROOT, "content", k), k, files);

// ── 第一遍：读全部，算词频与核心词表 ──
const entries = [];
for (const f of files) {
  const raw = fs.readFileSync(f.file, "utf8");
  let tags = [];
  try { const d = matter(raw).data; tags = normalizeTags(Array.isArray(d.tags) ? d.tags.map(String) : []); }
  catch { continue; }
  entries.push({ ...f, raw, tags });
}

const isCollection = (t) => COLLECTION.has(t);
const freq = new Map();
for (const e of entries) for (const t of e.tags) if (!isCollection(t)) freq.set(t, (freq.get(t) || 0) + 1);
const CORE = new Set([...freq.entries()].filter(([, n]) => n >= MIN_CORE_FREQ).map(([t]) => t));

function keepTags(tags) {
  const col = tags.filter(isCollection);
  const con = tags.filter((t) => !isCollection(t));
  if (con.length === 0) return col;
  const kept = [con[0]];
  let best = null;
  for (let i = 1; i < con.length; i++) {
    const t = con[i];
    if (!CORE.has(t)) continue;
    if (best === null || (freq.get(t) || 0) > (freq.get(best) || 0)) best = t;
  }
  if (best) kept.push(best);
  return [...col, ...kept];
}

// ── 第二遍：改写 tags 块（保住原有写法）──
const yamlStr = (s) => '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
const BLOCK_RE = /^tags:[ \t]*\n((?:[ \t]+-[ \t]+.*\n)+)/m;
const INLINE_RE = /^tags:[ \t]*\[[^\]]*\][ \t]*$/m;

let changed = 0, skippedFormat = 0;
const before = new Set(), after = new Set();
const rows = [];

for (const e of entries) {
  e.tags.forEach((t) => before.add(t));
  const kept = keepTags(e.tags);
  kept.forEach((t) => after.add(t));

  const sameAsBefore = kept.length === e.tags.length && kept.every((t, i) => t === e.tags[i]);
  rows.push({ rel: e.rel, kind: e.kind, before: e.tags, after: kept });
  if (sameAsBefore) continue;

  const blockReplacement = "tags:\n" + kept.map((t) => "  - " + yamlStr(t)).join("\n") + "\n";
  const inlineReplacement = "tags: [" + kept.map(yamlStr).join(", ") + "]";

  let next = null;
  if (BLOCK_RE.test(e.raw)) next = e.raw.replace(BLOCK_RE, blockReplacement);
  else if (INLINE_RE.test(e.raw)) next = e.raw.replace(INLINE_RE, inlineReplacement);
  else { skippedFormat++; continue; }

  if (next === e.raw) continue;
  changed++;
  if (APPLY) fs.writeFileSync(e.file, next);
}

console.log((APPLY ? "已应用" : "DRY-RUN（未写入任何文件）"));
console.log("  内容文件数        " + entries.length);
console.log("  需要改动的篇数     " + changed);
console.log("  因格式未识别跳过   " + skippedFormat);
console.log("  不同标签数        " + before.size + " -> " + after.size);
const refsBefore = entries.reduce((a, e) => a + e.tags.length, 0);
const refsAfter = rows.reduce((a, r) => a + r.after.length, 0);
console.log("  引用总数          " + refsBefore + " -> " + refsAfter);
const afterFreq = new Map();
for (const r of rows) for (const t of r.after) afterFreq.set(t, (afterFreq.get(t) || 0) + 1);
console.log("  精简后一次性标签   " + [...afterFreq.values()].filter((n) => n === 1).length);
console.log("  精简后可导航(>=3)  " + [...afterFreq.values()].filter((n) => n >= 3).length);
console.log();
console.log("  内容标签核心词表    " + CORE.size + " 个");

if (!APPLY) {
  console.log();
  console.log("  前 8 篇对照：");
  for (const r of rows.filter((x) => x.before.join("|") !== x.after.join("|")).slice(0, 8)) {
    console.log("    " + r.rel.replace("content/", ""));
    console.log("      留: " + JSON.stringify(r.after));
    console.log("      弃: " + JSON.stringify(r.before.filter((t) => !r.after.includes(t))));
  }
}
