# Next MDX Foundation 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将现有内容骨架升级为可运行的 Next.js App Router 网站，支持 Markdown/MDX 内容读取、公开列表页、详情页和基础求职入口。

**架构：** 使用 `content/` 作为文件系统内容源，`lib/content/` 负责 frontmatter 解析、zod 校验、slug 生成和 published 过滤，`app/(site)/` 渲染公开页面。MDX 正文通过服务器端组件渲染，页面保持静态内容优先，适合部署到 Vercel。

**技术栈：** Next.js 16、React 19、TypeScript、`@next/mdx`、`next-mdx-remote/rsc`、`gray-matter`、`zod`、CSS。

---

## 文件结构

- 创建：`package.json`，定义依赖和脚本。
- 创建：`next.config.mjs`，启用 MDX 扩展。
- 创建：`tsconfig.json`，配置 TypeScript 和 `@/*` 路径别名。
- 创建：`next-env.d.ts`，Next.js 类型入口。
- 创建：`eslint.config.mjs`，Next.js ESLint 配置。
- 创建：`app/layout.tsx`，根布局和 metadata。
- 创建：`app/globals.css`，全站样式。
- 创建：`app/(site)/layout.tsx`，公开站点壳。
- 创建：`app/(site)/page.tsx`，首页。
- 创建：`app/(site)/blog/page.tsx`，Blog 列表。
- 创建：`app/(site)/blog/[slug]/page.tsx`，Blog 详情。
- 创建：`app/(site)/weekly/page.tsx`，Weekly 列表。
- 创建：`app/(site)/weekly/[slug]/page.tsx`，Weekly 详情。
- 创建：`app/(site)/projects/page.tsx`，Project 列表。
- 创建：`app/(site)/projects/[slug]/page.tsx`，Project 详情。
- 创建：`app/(site)/career/page.tsx`，Career 聚合页。
- 创建：`app/(site)/about/page.tsx`，About 页。
- 创建：`components/site-nav.tsx`，主导航。
- 创建：`components/content-card.tsx`，内容卡片。
- 创建：`components/mdx-content.tsx`，MDX 正文渲染。
- 创建：`lib/content/schemas.ts`，内容 schema。
- 创建：`lib/content/reader.ts`，文件读取和查询函数。
- 创建：`lib/content/index.ts`，内容库导出。
- 创建：`public/site-mark.svg`，站点视觉标记。

### 任务 1：工程配置

- [ ] 添加 Next.js、React、MDX、zod、gray-matter、lucide-react 和 TypeScript/ESLint 配置。
- [ ] 确认脚本包含 `dev`、`build`、`start`、`typecheck`、`lint`。

### 任务 2：内容层

- [ ] 实现 Blog、Weekly、Project、Career schema。
- [ ] 实现读取 `content/`、解析 frontmatter、过滤 `published`、按日期排序、按 slug 查询。
- [ ] published 内容字段错误时抛出构建错误，draft 内容字段错误时跳过公开输出。

### 任务 3：页面层

- [ ] 实现首页、列表页、详情页、Career、About。
- [ ] 详情页使用 `generateStaticParams` 和 `generateMetadata`。
- [ ] 正文使用服务器端 MDX 渲染。

### 任务 4：样式和验证

- [ ] 添加响应式基础样式。
- [ ] 运行 `npm install`。
- [ ] 运行 `npm run typecheck` 和 `npm run build`。
- [ ] 启动本地 dev server 并在浏览器检查首页、列表页、详情页。
