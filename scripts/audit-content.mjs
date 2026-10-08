#!/usr/bin/env node
/**
 * 内容审计器 —— 面向「求职作品集」的博客体检
 *
 * 与已有的两套东西刻意分工：
 *   - docs/agent/optimization-audit-2026-09-18.md → 仓库卫生 / 代码 / 渲染策略
 *   - scripts/verify-learning-frontmatter.mjs     → learning 目录的 frontmatter
 *   本脚本只查「内容可信度 + 阅读连通性 + 作品集可检索性」三类，其它不碰。
 *
 * 用法：
 *   node scripts/audit-content.mjs            # 人类可读
 *   node scripts/audit-content.mjs --json     # 机器可读
 *   node scripts/audit-content.mjs --only=links,claims
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const PUBLIC = path.join(ROOT, "public");
const args = process.argv.slice(2);
const AS_JSON = args.includes("--json");
const onlyArg = args.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? new Set(onlyArg.slice(7).split(",")) : null;
const want = (k) => !ONLY || ONLY.has(k);

const norm = (p) => p.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/* ---------- 收集内容 ---------- */
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (/\.mdx?$/i.test(e.name)) acc.push(full);
  }
  return acc;
}

const files = walk(CONTENT);
const docs = files.map((full) => {
  const raw = fs.readFileSync(full, "utf8");
  let data = {}, body = raw;
  try {
    const parsed = matter(raw);
    data = parsed.data || {};
    body = parsed.content || "";
  } catch {
    /* 解析失败会在下面作为 issue 报出 */
  }
  const rel = path.relative(ROOT, full);
  const relSegs = path.relative(CONTENT, full).split(path.sep);
  const kindDir = relSegs[0];
  // content/notes/<topic|book|course>/<collection>/… —— 二级目录才是「内容类型」
  const noteKind = kindDir === "notes" && relSegs.length > 2 ? relSegs[1] : null;
  return {
    rel,
    full,
    kindDir,
    noteKind,
    slug: path.basename(full).replace(/\.mdx?$/i, ""),
    data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v])),
    body,
    raw,
    lines: raw.split("\n"),
  };
});

/** 集合：可被链接命中的 slug，按 kind 分组（含子目录层级） */
const slugsByKind = new Map();
for (const d of docs) {
  const segs = path.relative(CONTENT, d.full).split(path.sep);
  const kind = segs[0];
  const sub = segs.slice(1, -1).join("/");
  if (!slugsByKind.has(kind)) slugsByKind.set(kind, new Map());
  const m = slugsByKind.get(kind);
  if (!m.has(sub)) m.set(sub, new Set());
  m.get(sub).add(d.slug);
}

/**
 * `/notes` 的 URL 是**扁平**的（`/notes/<collection>/<slug>`），而内容在磁盘上是
 * 三层（`content/notes/<topic|book|course>/<collection>/<slug>.md`）—— 两者差一层，
 * 走不了上面按「一级目录 = URL kind」建的索引，所以单独建一张
 * 「集合 id → slug 集合」的表。
 */
const noteSlugsByCollection = new Map();
for (const d of docs) {
  const segs = path.relative(CONTENT, d.full).split(path.sep);
  if (segs[0] !== "notes" || segs.length < 3) continue;
  const collection = segs[2];
  if (!noteSlugsByCollection.has(collection)) noteSlugsByCollection.set(collection, new Set());
  noteSlugsByCollection.get(collection).add(d.slug);
}

/** app/(site) 下的静态路由，用于验证非内容链接 */
const routeDir = path.join(ROOT, "app", "(site)");
const staticRoutes = new Set();
if (fs.existsSync(routeDir)) {
  for (const e of fs.readdirSync(routeDir, { withFileTypes: true })) {
    if (e.isDirectory()) staticRoutes.add("/" + e.name);
  }
}

const publicFiles = new Set();
function walkPublic(dir, base = "") {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".DS_Store") continue;
    const rel = base + "/" + e.name;
    if (e.isDirectory()) walkPublic(path.join(dir, e.name), rel);
    else publicFiles.add(rel);
  }
}
walkPublic(PUBLIC);

/* ---------- 检查 1：内部链接 ---------- */
const linkIssues = [];
const linkStats = { total: 0, distinct: new Set() };
if (want("links")) {
  const linkRe = /(!?)\]\((\/[^)\s]+)\)/g;
  for (const d of docs) {
    const seenHere = new Set();
    let m;
    while ((m = linkRe.exec(d.body))) {
      if (m[1] === "!") continue; // 图片走 images 检查，不按路由校验
      const href = m[2].split("#")[0].split("?")[0];
      if (!href || href === "/") continue;
      // 命中 public/ 下的静态资源 → 合法，交给 images 检查
      if (publicFiles.has(norm(href))) continue;
      linkStats.total++;
      linkStats.distinct.add(href);
      if (seenHere.has(href)) continue;
      seenHere.add(href);
      const segs = href.split("/").filter(Boolean);
      const kind = segs[0];
      // 栏目首页（单段路径且 app/(site) 下有同名路由目录）→ 合法
      if (segs.length === 1 && staticRoutes.has("/" + kind)) continue;
      const lineNo = d.lines.findIndex((l) => l.includes(`](${m[2]}`)) + 1;
      if (kind === "notes") {
        // /notes/<collection>（简介页）或 /notes/<collection>/<slug>（笔记）
        const collection = segs[1];
        const slugs = noteSlugsByCollection.get(collection);
        if (segs.length === 2) {
          if (!slugs) linkIssues.push({ file: d.rel, line: lineNo, href, reason: "无此内容集合" });
          continue;
        }
        const target = segs[2];
        if (!slugs?.has(target)) {
          const cands = [];
          for (const [coll, set] of noteSlugsByCollection.entries())
            for (const x of set) if (x.endsWith(target)) cands.push(`/notes/${coll}/${x}`);
          linkIssues.push({
            file: d.rel,
            line: lineNo,
            href,
            reason: "解析不到文件",
            suggestion: cands.length === 1 ? cands[0] : cands.length ? `多候选:${cands.join(",")}` : "无候选",
          });
        }
      } else if (["blog", "weekly", "projects", "diary", "career", "gallery", "inbox"].includes(kind)) {
        const m2 = slugsByKind.get(kind);
        if (!m2) {
          linkIssues.push({ file: d.rel, line: lineNo, href, reason: "无此内容集合" });
          continue;
        }
        // 目标 slug 是「最后一段」，允许 /kind/<sub>/<slug> 与 /kind/<slug>
        const target = segs[segs.length - 1];
        const sub = segs.slice(1, -1).join("/");
        const hit =
          (sub && m2.get(sub)?.has(target)) ||
          (!sub && [...m2.values()].some((s) => s.has(target)));
        if (!hit) {
          // 找唯一候选做「可机械修复」提示
          // 找唯一候选做「可机械修复」提示；学习/课程类需要保留二级主题段
          const cands = [];
          for (const [sub2, set2] of m2.entries())
            for (const x of set2) if (x.endsWith(target)) cands.push(sub2 ? `/${kind}/${sub2}/${x}` : `/${kind}/${x}`);
          linkIssues.push({
            file: d.rel,
            line: lineNo,
            href,
            reason: "解析不到文件",
            suggestion: cands.length === 1 ? cands[0] : cands.length ? `多候选:${cands.join(",")}` : "无候选",
          });
        }
      } else if (!staticRoutes.has("/" + kind)) {
        linkIssues.push({ file: d.rel, line: lineNo, href, reason: "无对应路由目录" });
      }
    }
  }
}

/* ---------- 检查 2：frontmatter ---------- */
const fmIssues = [];
const fmStats = { missingEnglishSummary: [], noSeries: 0, statusCounts: {}, shortSummary: [] };
if (want("frontmatter")) {
  // 按各集合自身的 schema 判定必填，避免把「本就不需要」的字段报成缺失
  const FM_BY_COLLECTION = {
    blog: ["title", "date", "summary", "status", "tags", "lang"],
    weekly: ["title", "date", "summary", "status", "week", "highlights", "tags"],
    projects: ["title", "date", "summary", "status", "role", "stack", "impact", "resumeBullets"],
    career: ["title", "date", "summary", "status"],
    "notes/topic": ["title", "date", "summary", "status", "tags", "topic"],
    "notes/book": ["title", "date", "summary", "status"],
    "notes/course": ["title", "date", "summary", "status"],
  };
  for (const d of docs) {
    const FM_REQUIRED = FM_BY_COLLECTION[d.noteKind ? `notes/${d.noteKind}` : d.kindDir];
    if (!FM_REQUIRED) continue;
    if (/^(README|_index)\.mdx?$/i.test(path.basename(d.full))) continue;
    for (const k of FM_REQUIRED) {
      const v = d.data[k];
      if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
        fmIssues.push({ file: d.rel, field: k, reason: "必填缺失" });
      }
    }
    if (d.kindDir !== "blog") continue;
    const st = d.data.status || "(无)";
    fmStats.statusCounts[st] = (fmStats.statusCounts[st] || 0) + 1;
    if (!d.data.series) fmStats.noSeries++;
    if (!d.data.englishSummary) fmStats.missingEnglishSummary.push(d.slug);
    const s = String(d.data.summary || "");
    if (s && s.length < 40) fmStats.shortSummary.push({ file: d.rel, len: s.length });
  }
}

/* ---------- 检查 3：风险语言（可信度） ---------- */
const PATTERNS = [
  { id: "percent", label: "百分比断言", re: /(?:^|[^0-9.])\d{1,3}(?:\.\d+)?\s*%/, hint: "百分比需有来源/样本/时间条件" },
  { id: "multiple", label: "倍数断言", re: /\d+(?:\.\d+)?\s*倍|[一二三四五六七八九十]倍|翻[倍番]/, hint: "倍数需说明基线" },
  { id: "absolute", label: "绝对化措辞", re: /彻底|100%|一定(?:能|会|不)|必然|绝不会|永远(?:不|都)|毫无|完全(?:解决|替代|避免)|零(?:成本|维护)/, hint: "绝对化表达建议收紧" },
  { id: "temporal", label: "上线/发布状态声明", re: /已上线|已发布|已投入(?:使用|生产)|正式上线|待发布|尚未上线|准备上线|即将发布/, hint: "状态声明须与项目阶段一致" },
  { id: "result", label: "结果承诺", re: /(?:提升|提高|节省|降低|减少|缩短)[^。\n]{0,6}\d+\s*(?:%|倍|分钟|小时|天|人)/, hint: "结果数字需注明测量方法与样本" },
  { id: "firstperson", label: "第一人称经历声明", re: /我(?:实测|测了|跑了|跑过|查了源码|调试|试过|自己(?:搭|做|写)了)|同事(?:反馈|说)|客户(?:反馈|说)|门店反馈|使用者反馈/, hint: "面试须能追溯；建议留证据或改写" },
  { id: "dialog", label: "对话残留", re: /跟我说|告诉我一声|你手上|你的日常|帮你把|如需(?:要)?我|欢迎(?:找我|咨询)|咱俩/, hint: "面向读者的公开文不该有私聊口吻" },
  { id: "star", label: "陈旧/易变的外部数据", re: /\d+(?:\.\d+)?\s*k?\s*stars?\b|stars?\s*数|Star 数|fork\s*\/\s*star|⭐\s*\d/, hint: "外部计数需注明记录日期" },
];
const claimHits = [];
if (want("claims")) {
  for (const d of docs) {
    if (!["blog", "projects", "career", "notes"].includes(d.kindDir)) continue;
    // 标记代码围栏内的行（代码里的 100% 不是"论断"）
    let inFence = false;
    const inCode = d.lines.map((l) => {
      if (/^\s*(```|~~~)/.test(l)) { inFence = !inFence; return true; }
      return inFence;
    });
    for (const p of PATTERNS) {
      d.lines.forEach((line, i) => {
        if (inCode[i]) return;
        // 去掉行内代码后再判定
        const stripped = line.replace(/`[^`]*`/g, "");
        if (!p.re.test(line)) return;
        if (p.re.test(stripped)) {
          claimHits.push({ file: d.rel, line: i + 1, kind: p.id, label: p.label, text: line.trim().slice(0, 160) });
        }
      });
    }
  }
}

/* ---------- 检查 4：图片与静态资源 ---------- */
const imgIssues = [];
if (want("images")) {
  for (const d of docs) {
    const re = /!\[[^\]]*\]\((\/[^)\s]+)\)/g;
    let m;
    while ((m = re.exec(d.body))) {
      const p = m[1].split("?")[0];
      if (!publicFiles.has(norm(p))) {
        imgIssues.push({ file: d.rel, src: p, reason: "public 下不存在" });
      }
    }
  }
}

/* ---------- 检查 5：标签长尾 ---------- */
const tagCount = new Map();
for (const d of docs) {
  const tags = Array.isArray(d.data.tags) ? d.data.tags : [];
  for (const t of tags) tagCount.set(t, (tagCount.get(t) || 0) + 1);
}
const singletonTags = [...tagCount.entries()].filter(([, n]) => n === 1).map(([t]) => t);

/* ---------- 检查 6：重复段落 ---------- */
const paraMap = new Map();
if (want("dupes")) {
  for (const d of docs) {
    if (!["blog", "projects", "notes"].includes(d.kindDir)) continue;
    const paras = d.body
      .split(/\n{2,}/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter((p) => p.length >= 60 && !p.startsWith("|") && !p.startsWith("```") && !p.startsWith("!"));
    for (const p of new Set(paras)) {
      if (!paraMap.has(p)) paraMap.set(p, []);
      paraMap.get(p).push(d.slug);
    }
  }
}
const dupParas = [...paraMap.entries()].filter(([, v]) => v.length >= 2);

/* ---------- 检查 7：作品集可检索性（业务案例该有的 8 项） ---------- */
const CASE_KEYS = [
  { id: "problem", label: "业务问题", re: /问题|痛点|现状|原来|手工|重复劳动/ },
  { id: "goal", label: "目标与约束", re: /目标|约束|限制|预算|时间|成本|不能|不允许/ },
  { id: "role", label: "我的贡献", re: /我(?:负责|做|设计|搭建|写|定|改)|我的(?:判断|贡献|职责)|分工/ },
  { id: "choice", label: "方案取舍", re: /为什么(?:选|用)|放弃|对比|备选|权衡|取舍/ },
  { id: "flow", label: "工作流程", re: /流程|步骤|链路|输入|输出|调用链/ },
  { id: "verify", label: "验证结果", re: /验证|测试|样本|实测|回归|核对|复现/ },
  { id: "fail", label: "失败与改进", re: /失败|出错|踩坑|翻车|异常|不适用|已知问题|局限/ },
  { id: "metric", label: "量化证据", re: /耗时|用时|分钟|秒|字符|条数|篇数|错误率|准确率|样本量/ },
];
const caseScores = [];
if (want("cases")) {
  for (const d of docs) {
    if (d.kindDir !== "blog" && d.kindDir !== "projects") continue;
    const score = {};
    for (const c of CASE_KEYS) score[c.id] = c.re.test(d.body);
    caseScores.push({
      file: d.rel,
      slug: d.slug,
      title: String(d.data.title || ""),
      hit: Object.values(score).filter(Boolean).length,
      missing: CASE_KEYS.filter((c) => !score[c.id]).map((c) => c.label),
    });
  }
  caseScores.sort((a, b) => b.hit - a.hit);
}

/* ---------- 输出 ---------- */
const out = {
  generatedAt: new Date().toISOString(),
  counts: {
    contentFiles: docs.length,
    byKind: Object.fromEntries([...new Set(docs.map((d) => d.kindDir))].map((k) => [k, docs.filter((d) => d.kindDir === k).length])),
    internalLinks: linkStats.total,
    distinctInternalLinks: linkStats.distinct.size,
    tags: tagCount.size,
    singletonTags: singletonTags.length,
  },
  linkIssues,
  fmIssues,
  fmStats,
  claimHits,
  imgIssues,
  singletonTags,
  dupParas: dupParas.map(([p, files]) => ({ text: p.slice(0, 120), files })),
  caseScores,
};

if (AS_JSON) {
  console.log(JSON.stringify(out, null, 2));
} else {
  const L = (s = "") => console.log(s);
  L(`\n# 内容审计 · ${out.generatedAt.slice(0, 10)}`);
  L(`\n内容文件 ${out.counts.contentFiles} ｜ ` + Object.entries(out.counts.byKind).map(([k, v]) => `${k} ${v}`).join(" ｜ "));
  L(`内链 ${out.counts.internalLinks} 处 / ${out.counts.distinctInternalLinks} 个目标 ｜ 标签 ${out.counts.tags} 个（只用 1 次的 ${out.counts.singletonTags} 个）`);

  L(`\n## 1. 死链（${linkIssues.length}）`);
  for (const i of linkIssues) L(`- ${i.file}:${i.line} → ${i.href} ｜ ${i.reason} ｜ ${i.suggestion || ""}`);

  L(`\n## 2. frontmatter 缺失（${fmIssues.length}）`);
  for (const i of fmIssues) L(`- ${i.file} ｜ ${i.field} ｜ ${i.reason}`);
  L(`- 状态分布：${JSON.stringify(fmStats.statusCounts)}`);
  L(`- 无 series：${fmStats.noSeries}`);
  L(`- blog 缺 englishSummary：${fmStats.missingEnglishSummary.length} 篇`);
  if (fmStats.shortSummary.length) L(`- summary 短于 40 字：${fmStats.shortSummary.map((x) => x.file).join(", ")}`);

  L(`\n## 3. 风险语言命中（${claimHits.length}）`);
  const byKind = {};
  for (const h of claimHits) (byKind[h.kind] ||= []).push(h);
  for (const arr of Object.values(byKind)) {
    L(`\n### ${arr[0].label} (${arr.length})`);
    for (const h of arr.slice(0, 40)) L(`- ${h.file}:${h.line} ｜ ${h.text}`);
    if (arr.length > 40) L(`- …另有 ${arr.length - 40} 处（用 --json 取全量）`);
  }

  L(`\n## 4. 图片缺失（${imgIssues.length}）`);
  for (const i of imgIssues) L(`- ${i.file} → ${i.src}`);

  L(`\n## 5. 重复段落（跨文重复 ${dupParas.length} 段）`);
  for (const [p, f] of dupParas.slice(0, 25)) L(`- ${f.length} 篇：${f.join(", ")} ｜ ${p.slice(0, 80)}…`);

  L(`\n## 6. 业务案例完整度（0–8）`);
  for (const c of caseScores) L(`- ${c.hit}/8 ｜ ${c.slug} ｜ 缺：${c.missing.join("、") || "无"}`);
  L();
}
