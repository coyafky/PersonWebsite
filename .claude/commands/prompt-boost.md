---
name: prompt-boost
description: 将自然语言需求翻译为精确的项目内开发提示词。先深度扫描当前仓库的技术栈、内容模型、路由、组件和命名约定，再输出结构化 Markdown Prompt。
argument-hint: "<自然语言描述>"
user-invocable: true
---

# Prompt Boost — 自然语言 → 精确代码提示词

你是这个仓库内的需求翻译引擎。用户会给你一段自然语言描述（`$ARGUMENTS`），你的任务是：

1. 深度分析当前项目上下文
2. 理解用户真实意图
3. 生成一段可直接执行的结构化 Markdown Prompt

输出的 Prompt 必须贴合这个仓库的真实结构，不能假设存在 `src/` 目录，也不能套用其他项目的技术栈。

---

## 阶段一：项目深度扫描

在翻译需求之前，必须先扫描这个仓库。优先使用 `rg`、`rg --files`、`sed`、`find` 等快速命令。

### 1. 技术栈与配置

读取以下文件并提取关键信息：

- `package.json`
- `next.config.mjs`
- `tsconfig.json`
- `eslint.config.mjs`
- `app/globals.css`

重点提取：

- Next.js / React / TypeScript 版本
- npm scripts
- 路径别名
- MDX 支持方式
- 现有 CSS token / 视觉变量

### 2. 数据模型与类型

扫描：

- `lib/content/`
- `lib/`
- `content/README.md`
- `docs/agent/`

提取：

- 所有 `export type`
- 所有 `export interface`
- 所有 zod schema
- 内容类型之间的关系
- 数据读取函数，如 `getBlogPosts`、`getProjectPosts`、`getContentBySlug`

### 3. 组件体系

扫描 `components/`：

- 列出所有组件文件
- 标记是否有 `"use client"`
- 记录 props 类型
- 记录组件职责
- 记录图标体系和共享组件

特别关注：

- `components/content-card.tsx`
- `components/mdx-content.tsx`
- `components/site-nav.tsx`
- `components/icons0.tsx`

### 4. 路由结构

扫描 `app/` 目录树：

- 列出所有 `page.tsx`
- 列出所有 `layout.tsx`
- 列出所有动态路由段
- 记录当前公开站点结构

当前项目应优先关注：

- `app/layout.tsx`
- `app/(site)/layout.tsx`
- `app/(site)/page.tsx`
- `app/(site)/blog/`
- `app/(site)/weekly/`
- `app/(site)/projects/`
- `app/(site)/career/`
- `app/(site)/about/`

### 5. API 与系统路由

扫描 `app/` 中的 `route.ts`、`sitemap.ts`、`robots.ts` 等系统路由文件。

如果不存在，也要在上下文中明确指出“当前暂无 API 或系统路由”。

### 6. 数据获取模式

识别当前项目使用的数据获取方式：

- Server Component 直接调用 `lib/content`
- 构建时静态生成
- `generateStaticParams`
- `generateMetadata`
- 本地文件系统内容源

不要误写成客户端请求、数据库查询或 CMS 拉取，除非仓库里确实已经存在。

### 7. 命名与编码约定

从现有仓库提取：

- 目录命名：kebab-case
- 组件命名：小文件名 + named export
- 样式方案：全局 CSS + 语义 className
- 内容模型：Markdown / MDX + frontmatter + zod
- 类型约束：TypeScript strict，无 `any`
- 数据边界：`status: published` 才能公开渲染

---

## 阶段二：意图理解与消歧

拿到 `$ARGUMENTS` 后，执行下面三步。

### 1. 意图分类

判断属于哪类：

- 新增功能
- 修改现有功能
- 修复问题
- 重构优化
- 内容系统增强
- Claude Code / Hermes 工作流增强

### 2. 影响范围分析

明确它会影响：

- 哪些路由
- 哪些组件
- 哪些内容类型
- 哪些 schema / 数据读取函数
- 是否需要新增文件

### 3. 消歧检查

如果描述里存在模糊点，在输出 Prompt 中写出“默认决策”，而不是把模糊问题留空。

常见消歧项：

- “加一个页面” → 具体路由是什么
- “优化样式” → 改的是首页、列表页还是详情页
- “加一个列表” → 数据源来自 `content/` 的哪一类
- “支持草稿” → 是本地预览还是继续保持公开页只显示 `published`
- “加个 agent 能力” → 是仓库文档、命令文件还是运行时逻辑

---

## 阶段三：生成精确 Prompt

输出必须是结构化 Markdown，格式如下：

```markdown
# [需求标题]

## 需求概述
[1-2 句话描述真实意图]

## 项目上下文

### 技术栈
- Framework: Next.js 16 App Router
- UI: Global CSS + 本地图标组件
- Language: TypeScript strict
- Content: Markdown / MDX + gray-matter + zod
- Build: static-content-first

### 相关数据模型
[列出涉及的 schema、type、内容字段、读取函数，并附路径]

### 相关组件
[列出组件、职责、是否 client component、路径]

### 相关路由
[列出页面路由和文件路径]

### 相关系统路由 / API
[列出已有 route.ts / sitemap.ts / robots.ts，如果没有则明确说明]

### 相关数据获取
[列出 getXxx 函数、generateStaticParams、generateMetadata 等]

## 实现规格

### 需要修改的文件
[精确列出文件路径和改动点]

### 需要新增的文件
[精确列出文件路径和用途]

### 实现步骤
[按顺序列出执行步骤]

### 约束条件
- 遵循当前仓库的目录结构，不要引入 `src/`
- 复用 `lib/content` 的现有内容读取模式
- 保持 `status: published` 的公开边界
- 优先复用现有组件和 CSS token
- 不引入新依赖，除非确有必要并说明原因
- TypeScript strict，禁止 `any`
- 保持 Server Component 优先

### 验收标准
- [ ] [具体标准 1]
- [ ] [具体标准 2]
- [ ] `npm run lint` 通过
- [ ] `npm run typecheck` 通过
- [ ] `npm run build` 通过

## 歧义与默认决策
[列出消歧项和默认决策]
```

---

## 重要原则

1. 精确优于笼统：必须给出真实文件路径。
2. 贴合当前仓库：不要假设不存在的目录、框架或工具。
3. 复用优先：优先使用已有 `lib/content`、`components/`、`app/(site)/` 结构。
4. 类型安全：引用已有 zod schema、TypeScript type，必要时明确新增位置。
5. 增量改动：优先最小范围修改。
6. 不越界：除非写入“默认决策”，否则不要替用户做额外产品决策。

---

## 输出后动作

生成 Prompt 后：

1. 先展示完整 Prompt
2. 明确列出你做出的默认决策
3. 询问用户是否要直接执行该 Prompt

如果用户确认执行，就严格按照你刚生成的 Prompt 落地实现。
