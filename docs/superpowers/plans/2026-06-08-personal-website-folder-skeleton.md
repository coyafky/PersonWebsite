# Personal Website Folder Skeleton 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 创建 Personal Website 的第一版目录骨架，让 Next.js 页面、Markdown/MDX 内容、Hermes agent 文档和后续实现计划都有稳定落点。

**架构：** 先建立文件系统边界，不实现完整网站逻辑。`app/` 承载未来 App Router 页面，`content/` 承载 Markdown/MDX 源内容，`lib/content/` 承载未来解析和校验代码，`docs/agent/` 承载 Hermes 写作协议。

**技术栈：** Next.js App Router、TypeScript、Markdown、MDX、Vercel、Hermes agent 文档协议。

---

## 文件结构

- 创建：`README.md`，说明项目定位和目录入口。
- 创建：`app/README.md`，说明未来页面路由职责。
- 创建：`app/(site)/README.md`，说明公开站点路由分组。
- 创建：`components/README.md`，说明组件边界。
- 创建：`content/README.md`，说明内容发布规则。
- 创建：`content/blog/2026-06-08-first-note.md`，Blog 示例草稿。
- 创建：`content/weekly/2026-W24.md`，Weekly 示例草稿。
- 创建：`content/projects/personal-website.mdx`，Project 示例草稿。
- 创建：`content/career/profile.md`，Career profile 示例草稿。
- 创建：`content/career/bullets.md`，英文 bullet 示例草稿。
- 创建：`content/career/star-stories.md`，STAR story 示例草稿。
- 创建：`docs/agent/hermes-content-workflow.md`，Hermes 工作流协议。
- 创建：`docs/agent/content-style-guide.md`，内容风格指南。
- 创建：`docs/agent/weekly-template.md`，周记模板。
- 创建：`docs/agent/project-template.md`，项目模板。
- 创建：`lib/content/README.md`，内容解析层职责说明。
- 创建：`public/README.md`，静态资源约定。

### 任务 1：创建骨架文件

**文件：**
- 创建：上方文件结构中列出的全部文件。

- [ ] **步骤 1：写入 README 和目录说明**

使用 `apply_patch` 创建项目说明、目录说明和发布规则文档。所有说明都要明确：第一版使用文件系统内容源，不引入 CMS 或数据库。

- [ ] **步骤 2：写入内容示例草稿**

使用 `status: draft` 创建 Blog、Weekly、Project、Career 示例内容。示例内容要覆盖设计规格中定义的关键 frontmatter 字段。

- [ ] **步骤 3：写入 Hermes agent 文档**

创建 Hermes 内容工作流、风格指南、周记模板和项目模板。文档要说明 Hermes 默认只能创建草稿，不能自动发布。

- [ ] **步骤 4：验证文件结构**

运行：

```bash
rg --files -g '!*node_modules*' -g '!*.next*' -g '!dist' -g '!build' | sort
```

预期：能看到 `app/`、`components/`、`content/`、`docs/agent/`、`lib/content/`、`public/` 下的骨架文件。

- [ ] **步骤 5：提交骨架**

运行：

```bash
git add README.md app components content docs/agent docs/superpowers/plans lib public
git commit -m "chore: add personal website folder skeleton"
```

预期：提交成功，工作区干净。
