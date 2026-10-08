# Personal Website — 项目概述

> 项目级 CLAUDE.md — Claude Code 打开这个项目时自动加载。
> 写清楚项目是什么、用什么技术、怎么组织的，让 Claude Code 不需要每次重新探索。

---

## 一句话描述

Coya 的个人网站——基于 Next.js App Router + Markdown/MDX 的内容系统，用于写博客、记周记、维护项目档案、准备求职材料。

---

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 16 App Router |
| 语言 | TypeScript (strict) |
| 内容格式 | Markdown (`.md`) + MDX (`.mdx`) |
| 内容解析 | gray-matter + next-mdx-remote (rsc) |
| Markdown 扩展 | remark-gfm |
| 部署 | Vercel |
| 样式 | 全局 CSS + 语义 className |

---

## 项目结构

```
PersonalWebsite/
├── app/                        # Next.js App Router 路由
│   ├── layout.tsx              # 根布局
│   ├── globals.css             # 全局样式
│   └── (site)/                 # 主站点路由组
│       ├── page.tsx            # 首页
│       ├── blog/               # 博客列表 + 详情
│       ├── notes/              # 统一笔记（主题/读书/课程）
│       │   ├── page.tsx        # 集合总览（15 个集合）
│       │   └── [collection]/   # 集合首页 + 笔记详情
│       ├── diary/ weekly/      # ⚠️ 已下架：仅剩 308 → /blog 的重定向桩
│       ├── projects/           # 项目列表 + 详情
│       ├── career/             # 求职材料
│       └── about/              # 关于页
│
├── components/                 # UI 组件
│   ├── callout.tsx             # Callout 提示卡片（info/warning/danger/tip/success）
│   ├── timeline.tsx            # Timeline 时间线组件
│   ├── tabs.tsx                # Tabs 标签切换（"use client"）
│   ├── mermaid.tsx             # Mermaid 图表渲染
│   ├── mdx-content.tsx         # MDX 渲染器（注册所有可用组件）
│   ├── content-card.tsx        # 内容卡片
│   ├── site-nav.tsx            # 站点导航
│   └── icons0.tsx              # 图标体系
│
├── content/                    # 内容层（Markdown/MDX 源文件）
│   ├── blog/                   # 博客文章（.md）
│   ├── notes/                  # 统一笔记：topic（主题）/ book（读书）/ course（课程）
│   │   └── <kind>/<collection>/  # 每个集合一个子目录
│   │       ├── _index.md       # 集合介绍（status: published 才会被列出）
│   │       └── *.md            # 笔记
│   ├── diary/ weekly/          # ⚠️ 已下架（内容归档，路由 308 → /blog）
│   ├── projects/               # 项目档案（.mdx）← 需要嵌入组件时用 MDX
│   ├── career/                 # 求职材料（.md）
│   └── inbox/                  # 素材入口（碎片丢这里 → Hermes 整理）
│       ├── ideas/              # 灵感 → blog
│       ├── logs/               # 每日记录（原 → weekly，该模块已下架）
│       ├── project-notes/      # 项目笔记 → projects
│       └── career-notes/       # 求职素材 → career
│
├── lib/                        # 工具库
│   └── content/                # 内容读取层
│       ├── reader.ts           # 统一读取 .md 和 .mdx
│       ├── schemas.ts          # Zod schema 校验
│       └── index.ts            # 导出
│
├── docs/agent/                 # Hermes 协作文档
│   ├── hermes-content-workflow.md     # Hermes 内容工作流契约
│   ├── inbox-to-content-workflow.md   # 四条转化链路
│   ├── content-style-guide.md         # 内容写作规范（权威：阮一峰规范 + 图例判断逻辑）
│   ├── weekly-template.md             # 周记模板
│   ├── project-template.md            # 项目模板
│   └── hermes-usage-guide.md          # Coya 使用指南
│
├── .claude/commands/           # Claude Code 项目命令
│   ├── prompt-boost.md         # 自然语言 → 精确开发提示词
│   ├── dispatch.md             # 专家团流水线编排引擎
│   ├── weekly-from-inbox.md    # 从 inbox/logs/ 生成周记
│   ├── blog-from-notes.md      # 从 inbox/ideas/ 生成博客
│   ├── project-to-career.md    # 项目 → 简历材料
│   └── draft-audit.md          # 草稿质量审计
│
├── CLAUDE.md                   # 本文件
├── next.config.mjs
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

---

## 编码规范（借鉴 Next.js / Vercel 官方）

- **Server Component 优先**：除非需要 `useState`/`useEffect`/事件处理，否则保持 Server Component
- **目录命名**：kebab-case（`content-card.tsx` 不是 `ContentCard.tsx`）
- **内容边界**：`status: published` 的内容才能公开渲染；`status: draft` 仅本地可见
- **不要引入 `src/` 目录**——保持当前 `app/` 顶层结构
- **TypeScript strict**，禁止 `any`
- **样式**：全局 CSS + 语义 className，不引入 Tailwind 或 CSS-in-JS（除非讨论决定）
- **MDX 组件**：新增的 MDX 可用组件必须在 `components/mdx-content.tsx` 的 `components` 对象中注册
- **内容格式**：所有内容文件 frontmatter 必须包含 `title` `date` `summary` `tags` `status` `englishSummary`
- **中文内容写作规范**：写任何面向站点的中文内容（blog/notes/projects/gallery/career）前，先读 [`docs/agent/content-style-guide.md`](docs/agent/content-style-guide.md)。它以阮一峰《中文技术文档的写作规范》为上游标准，并规定图表使用（mermaid / HTML 转 PNG / AI 生图的选档与判断逻辑）。该文件是**唯一权威**

---

## Available Skills

通过 `.claude/skills/` 接入 Anthropic Agent Skills，给 Claude Code 等工具注入结构化领域能力。

| Skill | 来源 | 触发场景 | 详细文档 |
|------|------|---------|---------|
| `web-design-engineer` v1.2.2 | `ConardLi/garden-skills` | 新做/重做页面、视觉组件、动效、数据可视化 | [`docs/agent/skills-usage.md`](docs/agent/skills-usage.md) |

**通用规则**：

- 触发 `web-design-engineer` 的任务（"画在屏幕上的新作品或重做"）先读 `.claude/skills/web-design-engineer/SKILL.md`，再选 design anchor（`references/style-recipes/INDEX.md`），最后宣告设计系统再动笔
- **不要改 `SKILL.md` 本体**——定制写在 `docs/agent/skills-usage.md`
- 新增 skill：复制到 `.claude/skills/<name>/` + 更新本表 + 更新 `skills-usage.md`

---

## Notes 栏目

统一笔记模块（与 blog 区分：blog 写观点，notes 记结构化学习）。三种来源共用一个实现：

- `kind` = `topic`（主题学习）/ `book`（读书笔记）/ `course`（课程笔记）
- 路由：`/notes/<collection>` + `/notes/<collection>/<slug>`（扁平 URL，不带 kind）
- 内容目录：`content/notes/<kind>/<collection>/`，每个集合下有 `_index.md`（集合介绍）+ `*.md`（笔记）
- 文件名约定：以 `_` 开头的文件被识别为索引页，不出现在文章列表
- 索引页正文也会作为 MDX 渲染 → **正文里不能再出现 `#` 一级标题**（页面已渲染 `<h1>{title}</h1>`），也不要用 HTML 注释（MDX 只认 `{/* */}`）
- 文章 frontmatter 默认 `status: draft`，owner 改 `published` 后才会公开
- reader 函数：`getNoteCollections` / `findNoteCollection` / `getNoteCollectionIndex` / `getNoteCollectionNotes` / `getNoteBySlug`
- 加新集合只需：建子目录 + 写 `_index.md` + 写笔记，无需改代码
- 旧路由 `/learning`、`/book-list`、`/course-list` 已 308 永久重定向到 `/notes`

---

## 当前开发状态

- ✅ 站点骨架完成：首页 / blog / weekly / projects / career / about 路由
- ✅ 内容系统完成：inbox 素材入口 + 四条转化链路 + 4 个 Claude Code 命令
- ✅ MDX 组件体系：Callout / Timeline / Tabs / Mermaid
- ✅ **Design system: Stripe Press (2026.06)** — Fraunces + Source Serif 4 衬线编辑式 / oklch 暖调 / 全局 0 圆角 / 1500ms 慢 crossfade。详见 `docs/agent/skills-usage.md` 和 `docs/agent/stripe-press-critique.md`
- ✅ **信息架构升级 v1 (2026.06)** — 9 个 vertical slice 落地：portal 首页 / 6 栏目差异化呈现 / 通用列表骨架 / tags+archive 索引 / footer 3 列。详见 `SPEC.md` + `tasks/plan.md` + `tasks/todo.md`，git log `27dc7f1..8691a22`
- ✅ **信息架构升级 v2 (2026.06)** — 4 个 vertical slice 落地：About 去冗（9→6 section, 305→233 行）/ Tags 跨 6 collection 聚合（`getContentByTag` reader + 3 单测）/ 词云页 `/tags/cloud`（font-size 4 档）/ tag 详情页分页架构预留。详见 `SPEC.md` §0–§17 + `tasks/plan.md` + `tasks/todo.md`，git log `027a337..94590ce`
- ✅ **Book List 新栏目 v0.3 (2026.06)** — 6 个 vertical slice 落地：第 7 个 collection `book-list`（schema + reader + Icons0Book）/ 列表 card 网格（`.book-list-grid` + `EntryCardBookList`）/ 详情页（book 元信息 + MDX + ShareButtons）/ Header 第 5 项 + 首页 portal + footer 3 列 / 跨集合接入（tags 7 集合聚合 + search + sitemap + 测试）/ Hermes 工作流（inbox/book-notes + template + `/book-list-from-inbox` 命令）。详见 `SPEC.md` §18–§26 + `tasks/plan.md` + `tasks/todo.md`
- ✅ **Book List 重构 v0.4 (2026.07)** — 7 个 vertical slice：book-list 从扁平 1 书 1 文件重构为「书籍子目录 + `_index.md` + 多笔记」模式，对标 learning 栏目。Schema 拆分 `book-index` / `book-note` 两套，reader 新增 4 个函数，路由 3 层（`/book-list` → `/[book]` → `/[book]/[slug]`），组件 `EntryCardBookList` → `EntryCardBookTopic`，跨集合（sitemap/search/tags/footer/tests）全量更新，Hermes 命令适配子目录结构。详见 `SPEC.md` §27 + `tasks/plan.md` + `tasks/todo.md`
- 🟡 组件样式微调（off-scale 间距值 12/18/22/28 仍残留，可做 rhythm pass）
- 🟡 内容持续填充中（Obsidian → Website 同步）
- 🟡 projects 页面展示待优化

---

## 注意事项

- `.env` 文件不要提交到 Git
- `node_modules/` 和 `.next/` 已在 `.gitignore`
- 新增内容默认 `status: draft`——Hermes 不会自动发布，由 Coya 手动改为 `published`
- 修改 `lib/content/schemas.ts` 的 frontmatter 校验规则时，要同步更新 `docs/agent/` 中的模板
- `components/mdx-content.tsx` 是 MDX 渲染的入口，新增组件必须在此注册
