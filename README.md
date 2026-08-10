# Coya 的个人网站

> 基于 Next.js 16 + TypeScript + Markdown/MDX 的内容驱动型个人网站。
> 博客 · 周记 · 项目 · 学习笔记 · AI 信号追踪 · 读书笔记
> 部署在 [Vercel](https://vercel.com)。

---

## 概览

这个网站是 Coya 的长期写作和知识管理空间，涵盖 7 个内容栏目：

| 栏目 | 路由 | 内容类型 |
|------|------|---------|
| 📝 Blog | `/blog` | 长文博客，技术/思考/经验 |
| 📅 Weekly | `/weekly` | 周记，垂直时间线 |
| 🛠 Projects | `/projects` | 项目档案，案例卡片 |
| 📚 Learning | `/learning` | 结构化学习笔记（按主题） |
| 🤖 AI Tracker | `/ai-tracker` | AI 行业信号追踪 |
| 📖 Book List | `/book-list` | 读书笔记 |
| 👤 About | `/about` | 关于 + 求职材料 |

此外还有 Tag 全集索引、词云可视化、全文搜索等功能。

---

## 技术栈

| 层 | 选型 |
|----|------|
| **框架** | Next.js 16 App Router |
| **语言** | TypeScript (strict) |
| **内容** | Markdown `.md` + MDX `.mdx` |
| **内容解析** | gray-matter + next-mdx-remote (rsc) |
| **Markdown 增强** | remark-gfm, rehype-slug, rehype-pretty-code (shiki), rehype-autolink-headings |
| **图表** | Mermaid |
| **动画** | framer-motion |
| **图标** | Carbon Design SVG 图标 |
| **样式** | 全局 CSS + 语义 className（❌ 无 Tailwind） |
| **部署** | Vercel |
| **包管理** | npm |

---

## 设计系统

基于 **Stripe Press** 风格：
- 衬线字体（Fraunces + Source Serif 4）
- 暖调 oklch 配色
- 全局 0 圆角（`--radius: 0`）
- 1500ms 慢 crossfade 页切换动画
- 编辑式排版，内容优先

---

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 测试
npm test

# 构建
npm run build
```

---

## 项目结构

```
PersonalWebsite/
├── app/                # Next.js App Router 路由
├── components/         # UI 组件
├── content/            # Markdown/MDX 源文件
│   ├── blog/           # 博客文章
│   ├── weekly/         # 周记
│   ├── projects/       # 项目档案
│   ├── learning/       # 学习笔记（按 topic 分组）
│   ├── career/         # 求职材料
│   ├── ai-tracker/     # AI 信号追踪
│   ├── book-list/      # 读书笔记（按书分组）
│   └── inbox/          # 素材入口（→ Hermes 工作流）
├── lib/                # 工具库
│   └── content/        # 内容读取层
├── docs/               # 文档
│   ├── agent/          # Hermes 工作流文档
│   └── superpowers/    # 设计规格
├── public/             # 静态资产
└── .claude/            # Claude Code 项目命令
```

---

## 内容工作流

网站采用「Inbox → 草稿 → 发布」的工作流：

1. **收集**：碎片想法丢进 `content/inbox/` 对应子目录
2. **整理**：Hermes Agent（或手动）从 inbox 生成 `status: draft` 的内容
3. **审核**：Coya 审查草稿，确认质量
4. **发布**：Coya 手动将 `status: draft` 改为 `status: published`

> 所有公开页面的内容必须为 `status: published`，Agent 永不自动发布。

---

## 发布规则

- 内容默认 `status: draft`，仅本地可见
- `status: published` 才会在线上公开渲染
- Agent 生成的内容永远是 draft，Coya 手动改为 published
- 部署到 Vercel 前跑 `npm run build` 验证

---

## 许可证

私有项目 — Coya 个人所有。
