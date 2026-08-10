---
title: Agent Rules — Personal Website
version: 1.0.0
last_updated: 2026-07-30
---

# AGENT.md — 项目智能体工作规范

> 本文件定义了 AI Agent（如 Claude Code、Cursor 等）在 PersonalWebsite 项目中应遵守的规则、约束和工作流。任何 Agent 在修改此项目代码前必须先读取本文件。

---

## 1. 项目一句话

Coya 的个人网站——基于 Next.js 16 App Router + TypeScript + Markdown/MDX 的内容系统，用于写博客、记周记、维护项目档案、准备求职材料、读书笔记和 AI 信号追踪。部署在 Vercel。

---

## 2. 技术栈

| 层 | 技术 |
|----|------|
| 框架 | **Next.js 16** App Router |
| 语言 | **TypeScript** strict 模式 |
| 内容 | Markdown `.md` + MDX `.mdx` |
| 内容解析 | gray-matter + next-mdx-remote (rsc) |
| Markdown 扩展 | remark-gfm, rehype-slug, rehype-autolink-headings, rehype-pretty-code (shiki) |
| 代码高亮 | shiki |
| 图表 | mermaid |
| 动画 | framer-motion |
| 部署 | Vercel |
| 样式 | **全局 CSS** + 语义 className（❌ 无 Tailwind / CSS-in-JS） |
| 包管理器 | npm |

---

## 3. ⚠️ 红线（绝对禁止）

| # | 红线 | 说明 |
|---|------|------|
| 1 | ❌ **不改 design token** | `app/globals.css` 中的所有 CSS 变量、字体、圆角（`--radius: 0`）、阴影、动效曲线（1500ms crossfade）—— 动就是事故 |
| 2 | ❌ **不改 frontmatter schema** | `lib/content/schemas.ts` 中的 Zod schema 冻结，任何字段改动需 Coya 确认 |
| 3 | ❌ **不引入新 npm 依赖** | 除非 Coya 明确说"加一个 xxx 包" |
| 4 | ❌ **不改 MDX 组件注册表** | `components/mdx-content.tsx` 的新组件注册需确认 |
| 5 | ❌ **不在 main 分支直接改** | 必须先建 feature/fix 分支，提交后提 PR |
| 6 | ❌ **不发布 draft 内容** | 永远不改 `status: draft` → `published`，Coya 手动操作 |
| 7 | ❌ **不删内容文件** | `content/**` 的文件不能删除，除非 Coya 明确说删 |
| 8 | ❌ **不提交 .env / *.db / node_modules/** | .gitignore 已有但需注意 |
| 9 | ❌ **不限 git push --force / reset --hard** | 不可逆操作一律禁止 |
| 10 | ❌ **不引入 Tailwind / CSS-in-JS** | 样式方案已定，不换 |

---

## 4. 项目结构

```
PersonalWebsite/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根布局
│   ├── globals.css              # 全局样式（DESIGN TOKEN — 不动！）
│   ├── sitemap.ts               # 动态 sitemap
│   ├── (site)/                  # 主站点路由组
│   │   ├── page.tsx             # 首页（编辑式封面，7 栏目入口）
│   │   ├── about/               # 关于页（含 Career 子区）
│   │   ├── blog/                # 博客（杂志式列表 + 详情）
│   │   ├── weekly/              # 周记（垂直 timeline + 详情）
│   │   ├── projects/            # 项目（卡片网格 + 详情）
│   │   ├── learning/            # 学习笔记（主题树 + 详情）
│   │   ├── ai-tracker/          # AI 信号流（按信号强度 + 详情）
│   │   ├── book-list/           # 读书笔记（按书分组 + 笔记详情）
│   │   ├── tags/                # Tag 索引（全集 / 详情 / 词云）
│   │   └── career/              # （已重定向到 /about#career）
│   ├── (admin)/                 # 管理路由（保留）
│   └── api/                     # API 路由（search / 其他）
│
├── components/                  # UI 组件
│   ├── mdx-content.tsx          # MDX 渲染器（组件注册中心）
│   ├── content-card.tsx         # 通用内容卡片
│   ├── site-nav.tsx             # 站点导航（7 栏目）
│   ├── section-footer.tsx       # 3 列 footer
│   ├── collection-list.tsx      # 列表页通用骨架
│   ├── entry-card-blog.tsx      # Blog 专用卡片（杂志式）
│   ├── entry-card-weekly.tsx    # Weekly 专用卡片（timeline）
│   ├── entry-card-project.tsx   # Project 专用卡片（案例网格）
│   ├── entry-card-learning.tsx  # Learning 专用卡片（主题树）
│   ├── entry-card-ai-tracker.tsx# AI Tracker 专用卡片（信号流）
│   ├── entry-card-book-list.tsx # Book List 专用卡片
│   ├── icons0.tsx              # Carbon SVG 图标库
│   ├── callout.tsx              # Callout 提示卡片
│   ├── timeline.tsx             # Timeline 时间线
│   ├── tabs.tsx                 # Tabs 标签切换 ("use client")
│   ├── mermaid.tsx              # Mermaid 图表 ("use client")
│   └── ...其他
│
├── content/                     # 内容层（Markdown/MDX 源文件）
│   ├── blog/                    # 博客文章
│   ├── weekly/                  # 周记
│   ├── learning/                # 学习笔记（按 topic 分组）
│   │   └── <topic>/
│   │       ├── _index.md        # 主题介绍
│   │       └── *.md             # 文章
│   ├── projects/                # 项目档案 → .mdx
│   ├── career/                  # 求职材料
│   ├── book-list/               # 读书笔记（按书目录分组）
│   │   └── <book>/
│   │       ├── _index.md        # 书籍信息
│   │       └── *.md             # 笔记
│   ├── ai-tracker/              # AI 信号追踪
│   └── inbox/                   # 素材入口
│       ├── ideas/               # → blog
│       ├── logs/                # → weekly
│       ├── project-notes/       # → projects
│       ├── career-notes/        # → career
│       ├── ai-notes/            # → ai-tracker
│       └── book-notes/          # → book-list
│
├── lib/                         # 工具库
│   └── content/
│       ├── reader.ts            # 内容读取（getContentByTag 等）
│       ├── schemas.ts           # Zod schema（❌ 不动！）
│       ├── reader.test.ts       # 读取器测试
│       └── index.ts             # 导出
│
├── public/                      # 静态资产
│
├── docs/agent/                  # Hermes 协作文档
│   ├── hermes-content-workflow.md
│   ├── inbox-to-content-workflow.md
│   ├── content-style-guide.md
│   ├── skills-usage.md
│   ├── weekly-template.md
│   ├── project-template.md
│   ├── book-list-template.md
│   └── hermes-usage-guide.md
│
├── .claude/
│   ├── commands/               # Claude Code 项目命令
│   │   ├── prompt-boost.md
│   │   ├── dispatch.md
│   │   ├── weekly-from-inbox.md
│   │   ├── blog-from-notes.md
│   │   ├── project-to-career.md
│   │   ├── book-list-from-inbox.md
│   │   ├── draft-audit.md
│   │   └── md-to-mdx.md
│   └── skills/                 # Agent Skills
│       └── web-design-engineer/
│
├── SPEC.md                      # 完整项目规格书
├── design.md                    # 设计系统文档
├── CLAUDE.md                    # 项目级配置
├── AGENT.md                     # 👈 本文件
├── README.md                    # 项目说明
├── package.json
├── tsconfig.json
├── next.config.mjs
└── eslint.config.mjs
```

---

## 5. 编码规范

### 5.1 Server Component 优先
- 默认 Server Component，除非需要 `useState` / `useEffect` / 事件处理 / `useTheme` / `useScroll`
- entry-card-* 默认 Server Component
- 需要 Client 的加 `"use client"` 并注明理由

### 5.2 命名约定
- **文件/目录**：kebab-case（`entry-card-blog.tsx` ✅, `EntryCardBlog.tsx` ❌）
- **组件**：PascalCase（`SiteNav` ✅）
- **类型**：PascalCase（`BlogPost` ✅）
- **函数**：camelCase（`getBlogPosts` ✅）
- **CSS 类名**：kebab-case 语义名（`.book-list-grid` ✅）
- **不要引入 `src/` 目录**

### 5.3 样式系统
- 全局 CSS（`app/globals.css`）+ 语义 className
- 使用已有的 CSS 变量（`--space-*` / `--accent-*` / `--gold` / `--radius: 0`）
- 禁止硬编码值——所有间距/颜色/字体通过 CSS 变量引用
- 新 className 遵循 `globals.css` 的 kebab-case 语义命名

### 5.4 内容边界
- `status: published` = 公开渲染
- `status: draft` = 仅本地可见
- Agent 永远生成 `status: draft`，Coya 手动改 `published`

### 5.5 TypeScript
- strict 模式
- 禁止 `any`
- 导出类型需有明确命名

---

## 6. 内容路由表

| 路由 | 类型 | 说明 |
|------|------|------|
| `/` | 门户 | 编辑式封面 + 7 栏目入口 |
| `/blog` | 列表 | 杂志式列表 |
| `/blog/archive` | 索引 | 月度归档 |
| `/blog/[slug]` | 详情 | 文章详情 |
| `/weekly` | 列表 | 垂直 timeline |
| `/weekly/[slug]` | 详情 | 周记详情 |
| `/projects` | 列表 | 案例卡片网格 |
| `/projects/[slug]` | 详情 | 项目详情 |
| `/learning` | 列表 | 主题树 |
| `/learning/[topic]` | 列表 | 主题文章列表 |
| `/learning/[topic]/[slug]` | 详情 | 学习笔记详情 |
| `/ai-tracker` | 列表 | 信号流 |
| `/ai-tracker/[slug]` | 详情 | 信号详情 |
| `/book-list` | 列表 | 读书卡片网格 |
| `/book-list/[book]` | 列表 | 单书笔记列表 |
| `/book-list/[book]/[slug]` | 详情 | 读书笔记详情 |
| `/about` | 单页 | 关于 + Career |
| `/tags` | 索引 | Tag 全集 |
| `/tags/[tag]` | 列表 | 单 tag 跨集合聚合 |
| `/tags/cloud` | 可视化 | 词云 |

---

## 7. 提交规范

### 7.1 Git 分支
- 新功能：`feat/<name>`（如 `feat/book-list`）
- 重构：`refactor/<name>`（如 `refactor/site-structure-v1`）
- 修复：`fix/<name>`
- **不在 main 直接改**

### 7.2 Commit 信息
遵循 Conventional Commits：
```
feat(blog): add archive page with monthly grouping
fix(reader): handle missing tags gracefully
refactor(site-nav): extract navItems to constant
```

### 7.3 合并前验证
```bash
npm run lint        # ESLint 0 errors
npm run typecheck   # tsc --noEmit 0 errors
npm run build       # Next.js production build 通过
npm test            # 所有测试通过
```

---

## 8. 重要参考文件

| 文件 | 用途 | Agent 必读 |
|------|------|-----------|
| `SPEC.md` | 完整项目规格书（v0.1~v0.4） | ✅ 修改架构前必读 |
| `CLAUDE.md` | 项目级 Claude Code 配置 | ✅ |
| `design.md` | Stripe Press 设计系统 | ⚠️ 设计相关任务 |
| `docs/agent/skills-usage.md` | 技能使用说明 | ⚠️ 涉及设计 skill |
| `docs/agent/*.md` | Hermes 工作流 | ⚠️ 内容相关工作 |
| `lib/content/schemas.ts` | Zod 校验（❌ 不动） | ⚠️ 了解但不改 |
| `app/globals.css` | 全局样式（❌ 不动 token） | ⚠️ 了解 token |
| `components/mdx-content.tsx` | MDX 组件注册 | ⚠️ 组件相关 |

---

## 9. 当前状态

- ✅ 站点骨架 + 7 个内容栏目
- ✅ 信息架构升级 v1 + v2
- ✅ Book List v0.3 + v0.4（子目录模式）
- 🟡 内容持续填充中
- 🟡 组件样式微调待做
- 🟡 Projects 页面展示待优化
