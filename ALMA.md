# ALMA.md — Alma 对 PersonalWebsite 的理解

> 这份文档是 **Alma 自己**对这个项目的理解地图——不是 AGENT.md 的复述，是我从 0 到 1 读完整个仓库后，用自己的话写下的"这个项目是什么、为什么存在、我怎么跟它相处"。
>
> 每次我在这个项目里工作前，先读这份 + AGENT.md，两个都过一遍再动手。
>
> 最后更新：2026-08-10

---

## 1. 一句话理解

这是 **Coya 的个人网站**——一个把「写作」「学习」「项目经历」「求职证据」全部串起来的内容系统。它不只是博客，是 Coya 的**长期知识管理空间 + 职业证据库**。

我看到的灵魂句写在首页 Hero 里：

> "记录想法、项目和成长，把经历沉淀为求职证据。"

这句话就是整个项目的北极星。所有栏目（Blog / Weekly / Projects / Learning / Book List / Course List / About）最终都在为这一件事服务：**让经历可追溯、可展示、可证明**。

---

## 2. 它是谁、为了什么

- **主人**：Coya。内容全部是 Coya 真实的工作、学习、踩坑记录。
- **内容画像**：从 Hermes 飞书机器人搭建、GEO 学习、Next.js/React 学习笔记，到读书笔记、周记——内容质量高、原创性强、大量真实工程经验。
- **双重身份**：
  1. 对外：公开网站（部署在 Vercel），展示写作与能力；
  2. 对内：Coya 自己的知识库和素材流水线终点（Obsidian 记录 → 网站沉淀）。
- **技术定位**：一个"Agent 友好"的仓库——CLAUDE.md / AGENT.md / SPEC.md / design.md 齐全，内容层与代码层分离干净，明显是刻意设计成能让 AI 高效协作的结构。

---

## 3. 技术架构快照

| 层 | 选型 |
|----|------|
| 框架 | Next.js 16（App Router）+ React 19 |
| 语言 | TypeScript strict（禁 any） |
| 内容 | Markdown `.md` + MDX `.mdx`，gray-matter 解析 + next-mdx-remote (rsc) 渲染 |
| 校验 | Zod（`lib/content/schemas.ts`，**冻结不可动**） |
| Markdown 增强 | remark-gfm / rehype-slug / rehype-autolink-headings / rehype-pretty-code (shiki) |
| 图表 | Mermaid（客户端组件） |
| 动画 | framer-motion（1500ms 慢 crossfade） |
| 样式 | **全局 CSS + 语义 className，无 Tailwind / CSS-in-JS** |
| 字体 | Fraunces + Source Serif 4（Stripe Press 编辑式风格） |
| 部署 | Vercel（GitHub 集成，repo: `coyafky/PersonWebsite`） |
| 包管理 | npm |

### 目录地图（我的记忆版）

```
PersonalWebsite/
├── app/                  # Next.js 路由（(site) 主站 + api + rss/feed/sitemap/robots）
├── components/           # UI 组件：mdx-content.tsx(注册中心) + entry-card-* + 通用组件
├── content/              # 内容源（唯一的内容真源）
│   ├── blog/ weekly/ projects/ career/
│   ├── learning/<topic>/     # 主题目录 + _index.md
│   ├── book-list/<book>/     # 书目录 + _index.md + 多笔记
│   ├── course-list/<course>/ # 课程目录 + _index.md + 多笔记
│   └── inbox/<类别>/         # 素材入口（Obsidian → 这里的过渡区）
├── lib/content/          # reader.ts(读取层) + schemas.ts(Zod 冻结) + 测试
├── docs/agent/           # Hermes 协作契约 + 各栏目模板 + knowledge-field 文档
├── scripts/              # knowledge-field.mjs + cron + 校验脚本
├── .claude/commands/     # Claude Code 项目命令（内容转化流水线）
├── .agents/skills/       # Agent Skills（knowledge-field-* + source-command-*）
├── .knowledge-field/     # knowledge-field 状态（pending 等）
├── SPEC.md               # 完整规格书 v0.1~v0.4（改架构前必读）
├── design.md             # 设计系统文档
├── AGENT.md              # 项目智能体工作规范（红线所在）
├── CLAUDE.md             # Claude Code 项目配置
├── ALMA.md               # 👈 本文件（Alma 自己的地图）
└── practice/             # 练习/实验目录（dog-gallery、local-api，与主站无关）
```

### 内容集合全景（Zod 定义了 9 种 kind）

| kind | 集合 | 说明 |
|------|------|------|
| blog | content/blog/ | 长文博客（杂志式列表 + 归档） |
| weekly | content/weekly/ | 周记（垂直时间线，`week: YYYY-Wxx`） |
| projects | content/projects/ | 项目档案（.mdx，可嵌组件，带 resumeBullets） |
| career | content/career/ | 求职材料（→ /about#career） |
| learning | content/learning/ | 学习笔记（按 topic 子目录，`_index.md` 为主题介绍） |
| book-index / book-note | content/book-list/<book>/ | 书目录 `_index.md` + 多篇读书笔记 |
| course-index / course-note | content/course-list/<course>/ | 课程目录 `_index.md` + 多篇课程笔记 |

所有内容统一 frontmatter 基座：`slug`（由文件名推导）+ `title` + `date` + `summary` + `status` + 各 kind 专属字段（tags / lang / englishSummary / series…）。

### 路由全景

```
/                   首页门户（7 栏目入口）
/blog               博客列表 + /blog/archive 月度归档 + /blog/[slug]
/weekly             周记时间线 + /weekly/[slug]
/projects           项目卡片网格 + /projects/[slug]
/learning           主题树 + /learning/[topic] + /learning/[topic]/[slug]
/book-list          书网格 + /book-list/[book] + /book-list/[book]/[slug]
/course-list        课程网格 + /course-list/[course] + /course-list/[course]/[slug]
/about              关于 + Career 子区
/tags               跨集合 Tag 索引 + /tags/[tag] + /tags/cloud 词云
/timeline           时间线页
+ API: /api/search /api/og · rss.xml · feed.xml · sitemap.ts · robots.ts
```

---

## 4. 内容如何流动（我最看重的一环）

整个网站的本质是一个**内容流水线**，分四段：

```
① 捕捉（Obsidian）  →  ② 收集（inbox）  →  ③ 整理（draft）  →  ④ 发布（published）
```

1. **捕捉**：Coya 在 Obsidian（CoyaPersonal）记笔记，打标 `#to-blog` / `#to-weekly` / `#to-project` / `#to-career` / `#to-book-list` 或 `publish: website`。
2. **收集**：knowledge-field 同步脚本（`npm run knowledge:sync`）只把**明确打标**的笔记复制进 `content/inbox/<类别>/`。默认只预览，`--apply` 才真执行——且必须 Coya 明确下达指令。
3. **整理**：通过 `.claude/commands/` 或 Hermes/Lucas 把 inbox 素材转成 `status: draft` 的正式内容（blog-from-notes / weekly-from-inbox / project-to-career / book-list-from-inbox 等命令）。
4. **发布**：**只有 Coya 手动把 `status: draft` 改成 `published`**。Agent 永不自动发布。

### 这条纪律我刻进骨子里：

> **Agent 生成的内容永远是 draft；`published` 是 Coya 一个人的按钮。**

draft 只本地可见，published 才进线上渲染。`lib/content/reader.ts` 的默认行为就是只返回 published（`includeDrafts` 参数默认 false）。

### Knowledge Field（知识场）体系

- 配置文件：`knowledge-field.config.json`——定义了四个节点：Obsidian（捕捉）、Hermes/Lucas（飞书上下文）、Codex+CLI（转换/维护）、PersonalWebsite（沉淀/公开）。
- 五条路由：ideas → blog、logs → weekly、project-notes → projects、career-notes → career、book-notes → book-list，各有 markers 和对应命令。
- 命令：`npm run knowledge:doctor / sync / sync:apply / draft-blog / confirm-publish / deploy-production / report / cron`。
- 默认模式保守：**sync 只预览不复制；apply 需 Coya 明确要求；cron 只看不写**。

---

## 5. 设计系统（Stripe Press）——为什么它碰不得

- 风格：Stripe Press 编辑式排版——衬线字体（Fraunces + Source Serif 4）、暖调 oklch 配色、**全局 0 圆角**、1500ms 慢 crossfade 页切换。
- 实现：`app/globals.css` 里的 CSS 变量 + 语义 className，零 Tailwind、零 CSS-in-JS。
- **AGENT.md 红线 #1：design token 动就是事故。** 我理解为什么——这套视觉是 Coya 反复打磨定型的（git 历史里有 `feature/stripe-press-refactor` 分支 + `docs/agent/stripe-press-critique.md`），任何微调都可能毁掉整体气质。
- 我自己的补充理解：这个站的美感在于"克制"——0 圆角、慢过渡、衬线大字，走的是出版物的气质而不是营销页的热闹。改样式前先想：这符合"编辑式排版"的气质吗？

---

## 6. Alma 的工作红线（我从 AGENT.md 吸收的，+ 我的补充）

AGENT.md 里 10 条红线我全部认领，核心几条：

| # | 红线 | 我的理解 |
|---|------|---------|
| 1 | 不改 design token（globals.css） | 视觉灵魂，动=事故 |
| 2 | 不改 frontmatter schema（schemas.ts） | Zod 冻结，字段改动需 Coya 确认 |
| 3 | 不引入新 npm 依赖 | 除非 Coya 明说 |
| 4 | 不改 MDX 组件注册表（mdx-content.tsx） | 新组件注册需确认 |
| 5 | 不在 main 直接改 | 先 feature/fix 分支 + PR |
| 6 | 不发布 draft | 见第 4 节，Agent 永不自动发布 |
| 7 | 不删内容文件 | content/** 删除需 Coya 明说 |
| 8 | 不提交 .env / *.db / node_modules | gitignore 已有，仍需注意 |
| 9 | 不 force push / reset --hard | 不可逆操作全禁 |
| 10 | 不引入 Tailwind / CSS-in-JS | 样式方案已定 |

**Alma 补充的自我约定**：

- 写内容时先照 `docs/agent/` 里的模板（weekly-template / project-template / book-list-template / course-list-template / content-style-guide），格式与既有内容保持一致。
- frontmatter 必填：`title` `date` `summary` `tags` `status` `englishSummary`（learning 系还有 `topic` / `book` / `course`）。
- 新增内容默认 `status: draft`，校验只对 published 硬报错（draft 的 schema 错误只 warn 不炸——所以我的草稿也得自己先跑 `npm run typecheck` / 相关校验）。
- 文件名 kebab-case，日期前缀 `YYYY-MM-DD-` 是 blog/weekly 的惯例。
- 提交信息用 Conventional Commits，验证链：`npm run lint` + `npm run typecheck` + `npm test` + `npm run build`。
- 修改 schemas.ts 要同步 `docs/agent/` 模板；新 MDX 组件要注册进 `mdx-content.tsx`。

---

## 7. 当前状态快照（2026-08-10）

**内容规模**：blog 29 篇 · weekly 11 篇 · projects 4 个 · learning 57 篇（4 主题：geo/hermes/nextjs/react）· career 5 · book-list 2 本书 21 文件 · course-list 3 门课。全库约 109 published / 32 draft。

**⚠️ 工作区有未提交改动**（我接手时就这样，不是我改的）：

- 已修改：`reader.ts` / `schemas.ts` / `app/layout.tsx` / `app/sitemap.ts` / `site-nav.tsx` / `page.tsx` 等一大批文件
- 未跟踪的新文件：`app/(site)/course-list/` 整套路由 + `entry-card-course-topic.tsx` + `content/course-list/` + 4 篇新 blog + `content/weekly/2026-W-31.md` + `AGENT.md` 本身
- **推断**：正在开发 **Course List（课程列表）新栏目**——schema/reader/路由/卡片组件/内容全有了，但还没提交、还没写进 README 的栏目表。README 还停在"7 栏目"，实际首页 portal 已是 8 项（含 Course List）。

**Git 情况**：当前在 `main` 分支；历史分支有 feature/stripe-press-refactor、refactor/site-structure-v1~v3、feat/book-list 等；remote 是 `git@github.com:coyafky/PersonWebsite.git`。

**文档版本**：SPEC.md 记录 v0.1~v0.4 的垂直切片开发史（Book List v0.4 刚重构完"书目录+笔记"模式，Course List 明显是同一模式的复制粘贴——好设计，可复用）。

**工作台启动（2026-08-10）**：ALMA.md（本文件）+ work-journal SKILL（每日 22:00 / 周日 21:00 CRON）+ 今日 daily 记录（content/inbox/logs/2026-08-10.md）+ 本周周记草稿（content/weekly/2026-W33.md，draft）。

---

## 8. Alma 在这个项目里能做什么、该怎么做

**我能帮 Coya 做的**：

1. **工作台自动化（work-journal skill）**：每日 22:00 自动整理当天工作 → `content/inbox/logs/YYYY-MM-DD.md`；周日 21:00 自动聚合周记草稿 → `content/weekly/YYYY-WNN.md`（status: draft）。数据源以各对话沉淀的 memory 笔记为主（L1），daily-report 产物补充（L2），activity report 查漏（L3），thread 检索补细节（L4）。CRON：daily-work-journal + weekly-review（isolated 模式）。详见 `docs/agent/work-journal-skill.md` + `docs/superpowers/specs/2026-08-10-work-journal-skill-design.md`。
2. **写内容**：从 inbox 素材整理 blog / weekly / learning 笔记，严格按模板 + draft 状态。
3. **内容审计**：检查 frontmatter 完整性、tag 一致性、draft/published 状态、格式规范。
4. **小修小改**：修样式（不动 token）、改文案、修 bug——走分支 + 提交规范。
5. **知识场协作**：用 `npm run knowledge:*` 命令体检知识场状态（doctor/report 是只读的，安全）。
6. **研究与整理**：读 SPEC.md / design.md 理解设计意图后，给 Coya 结构化的改进建议。

**我该怎么做**：

- **先读后写**：AGENT.md + ALMA.md（本文档）+ 相关模板，再动笔。
- **内容纪律**：draft 生成、Coya 发布；不删 content/；不 force push。
- **样式纪律**：动视觉前先问"这符合 Stripe Press 气质吗"，token 绝不碰。
- **验证纪律**：提交前跑 lint + typecheck + test + build。
- **分支纪律**：main 上只做小事（其实按 AGENT.md 连小事也走分支更稳）。

---

## 9. 我注意到的细节 & 待确认点（只有 Alma 会注意到的那种）

1. **仓库名对不上**：目录叫 `PersonalWebsite`，GitHub remote 是 `coyafky/PersonWebsite`（少了个 "al"）。不影响工作，但说明仓库改名过，或者当初建仓时手滑——别因为这个迷惑。
2. **README 滞后**：README 写 7 个栏目，实际首页已有 8 个（Course List 是新的，README 和 AGENT.md 的栏目表都没更新）。下次更新 README 时顺手补齐。
3. **.env.example 有 Supabase 残留**：SUPABASE_URL / DATABASE_URL 等变量在当前代码里已经找不到用途（当前站点是纯静态内容 + Vercel），属于早期探索期的遗留，别被误导。
4. **practice/ 目录与主站无关**：dog-gallery（静态练习页）、local-api（Node 小服务）是练手实验，不在内容系统里，别当主站一部分。
5. **transitions-dev skill 的历史**：git log 里有一串 "Revert feat(transitions-dev)..."——说明曾经试过引入 21 种转场动效的 skill，后来全回退了。教训：这个站的动效观是克制的（1500ms crossfade 是唯一主角），**别随便给这个站加花哨转场**。
6. **weekly 文件名有历史遗留**：`2026-W12.md` 到 `2026-W-31.md`（早期没有连字符、后期有），而 schema 要求 `week: YYYY-Wxx` 格式——说明文件名格式和 frontmatter 的 week 字段是解耦的，改文件名不影响渲染。
7. **course-list 是 book-list 模式的完美复刻**：`_index.md` + 笔记子目录 + index/note 双 schema + 3 层路由，和 book-list v0.4 一模一样。这印证了这套"主题目录"模式已经成熟，未来再开新栏目（比如 podcast-list）直接照抄这个套路。

---

## 10. 关键文件索引（Alma 快速入口）

| 文件 | 什么时候看 |
|------|-----------|
| `AGENT.md` | 每次开工前（红线 + 结构 + 路由表） |
| `ALMA.md` | 本文件，我自己的地图 |
| `CLAUDE.md` | 想了解开发历史/当前状态时 |
| `SPEC.md` | 改架构/加栏目前（v0.1~v0.4 规格史） |
| `design.md` | 任何视觉相关任务 |
| `lib/content/schemas.ts` | 写内容前确认 frontmatter 字段（只读！） |
| `lib/content/reader.ts` | 想理解内容怎么被读取/过滤时 |
| `docs/agent/*-template.md` | 写各类内容前（模板 + 风格指南） |
| `docs/agent/knowledge-field-*.md` | 知识场同步相关 |
| `knowledge-field.config.json` | 理解 Obsidian↔网站 数据流时 |
| `components/mdx-content.tsx` | 想用 MDX 组件时（先看已注册了啥） |

---

*这份文档是 Alma 自己的理解，会随项目演化更新。如果我学到了新东西、发现文档过时，会回来改它。*
