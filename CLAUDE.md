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
│       ├── weekly/             # 周记列表 + 详情
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
│   ├── weekly/                 # 周记（.md + .mdx）
│   ├── projects/               # 项目档案（.mdx）← 需要嵌入组件时用 MDX
│   ├── career/                 # 求职材料（.md）
│   └── inbox/                  # 素材入口（碎片丢这里 → Hermes 整理）
│       ├── ideas/              # 灵感 → blog
│       ├── logs/               # 每日记录 → weekly
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
│   ├── content-style-guide.md         # 写作风格规范
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

---

## 当前开发状态

- ✅ 站点骨架完成：首页 / blog / weekly / projects / career / about 路由
- ✅ 内容系统完成：inbox 素材入口 + 四条转化链路 + 4 个 Claude Code 命令
- ✅ MDX 组件体系：Callout / Timeline / Tabs / Mermaid
- 🟡 组件样式待完善（CSS 细节）
- 🟡 内容持续填充中（Obsidian → Website 同步）
- 🟡 projects 页面展示待优化

---

## 注意事项

- `.env` 文件不要提交到 Git
- `node_modules/` 和 `.next/` 已在 `.gitignore`
- 新增内容默认 `status: draft`——Hermes 不会自动发布，由 Coya 手动改为 `published`
- 修改 `lib/content/schemas.ts` 的 frontmatter 校验规则时，要同步更新 `docs/agent/` 中的模板
- `components/mdx-content.tsx` 是 MDX 渲染的入口，新增组件必须在此注册
