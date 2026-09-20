/**
 * 标签归一化表 —— 让标签真的可用。
 *
 * 背景（2026-09-20 实测）：全站 247 篇内容用了 **512 个不同标签**，
 * 其中 **379 个只用过 1 次（74%）**，用 ≤2 次的占约 92%。
 * 换句话说只有约 40 个标签具备"导航"价值，其余是关键词伪装成标签。
 * 更糟的是高频标签被大小写劈开了 —— `hermes(30)` 与 `Hermes(10)`
 * 是站内第 2 高频标签，实际 40 次被计成了两个。
 *
 * 这个模块只做一件事：**把变体收敛到规范名**。
 * 它在 schema 层（lib/content/schemas.ts 的 tagArraySchema）被调用，
 * 所以读入即归一 —— getAllTags / getContentByTag / 页面上的标签 chip 全部自动受益。
 *
 * 设计原则：**宁可少合，不可错合**。只收大小写/空白变体和明确同义；
 * 拿不准的一律不动（例如 React 库 与 ReAct 提示策略是两个概念，绝不能合）。
 */

/**
 * 变体 → 规范名。
 * 键一律**小写**，因为匹配前会先做 toLowerCase + 空白压缩，做到大小写无关。
 */
const ALIASES: Record<string, string> = {
  // ── 大小写 / 连字符 / 空白变体（无歧义）─────────────────────────
  hermes: "Hermes",
  "ai-agent": "AI Agent",
  "ai agent": "AI Agent",
  "ai 生图": "AI 生图",
  ai生图: "AI 生图",
  多agent: "多 Agent",
  "多 agent": "多 Agent",
  profile: "Profile",
  profiles: "Profile",
  props: "Props",
  // ⚠️ 这里刻意**不登记** `react: "React"`。
  // 归一化是小写匹配的，一旦登记，"ReAct"（提示策略）会被小写化成 "react"
  // 然后被错合进 "React"（前端库）—— 两个完全不同的概念。
  // 实测本库没有全小写的 react 标签，所以不登记没有代价。
  // 这条是 tag-aliases.test.ts 里那条"绝不把不同概念合在一起"抓出来的。
  geo: "GEO",
  "claude code": "Claude Code",
  mcp: "MCP",
  llm: "LLM",
  typescript: "TypeScript",
  "next.js": "Next.js",
  nextjs: "Next.js",
  nodejs: "Node.js",
  "node.js": "Node.js",
  webp: "WebP",
  jSX: "JSX",
  mdx: "MDX",
  ssh: "SSH",
  dns: "DNS",
  "tcp/ip": "TCP/IP",
  api: "API",
  rest: "REST",
  git: "Git",
  github: "GitHub",
  npm: "npm",
  vite: "Vite",
  vue: "Vue",
  docker: "Docker",
  nginx: "Nginx",
  linux: "Linux",
  macos: "macOS",
  css: "CSS",
  dom: "DOM",
  fetch: "fetch",
  seedream: "Seedream",
  midjourney: "Midjourney",
  "claude": "Claude Code",

  // ── 明确同义（语义合并）────────────────────────────────────────
  // Prompt 家族：原来被拆成 6 种写法，实测合计 ~17 次
  prompt: "Prompt 工程",
  提示词: "Prompt 工程",
  提示词工程: "Prompt 工程",
  提示工程: "Prompt 工程",
  "prompt 工程": "Prompt 工程",
  "prompt engineering": "Prompt 工程",
  "prompt 工程学": "Prompt 工程",

  // Skill 家族
  skill: "Skill",
  skills: "Skill",

  // Agent 家族：AI Agent 是站内第 4 高频（24 次），别让它被拆
  // （注意 "ai agent" 已在上面的连字符组登记过，这里不要重复 —— 对象字面量
  //   重复 key 会让 TS 报 TS1117，而且后写的会静默覆盖前面的）
  aiagents: "AI Agent",
  "ai 代理": "AI Agent",
  "ai agents": "AI Agent",

  // AI 搜索 / GEO 家族
  "ai搜索": "AI 搜索",
  "ai 搜索": "AI 搜索",
  aeo: "GEO",
  aio: "GEO",
};

/** 空白压缩 + 去首尾，便于比较（不改动规范名本身） */
function canonicalKey(tag: string): string {
  return tag.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * 归一化单个标签。命中别名表返回规范名，否则返回**去首尾空白的原名**
 * （不做任何猜测性改写 —— 这样没登记的标签原样保留，可审计）。
 */
export function normalizeTag(tag: string): string {
  const key = canonicalKey(tag);
  return ALIASES[key] ?? tag.trim();
}

/**
 * 归一化一组标签，并**去掉归一后产生的重复**
 * （例如一篇同时写了 `hermes` 和 `Hermes`，合并后只应出现一次）。
 */
export function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of tags) {
    const normalized = normalizeTag(tag);
    if (normalized === "" || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}
