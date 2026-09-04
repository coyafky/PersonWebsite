# Knowledge Field Workflow

这份文档把架构图落成可执行的工作流：Obsidian 负责第一存储，Hermes/Lucas 负责飞书与个人节奏，Codex/CLI 负责仓库内加工，PersonalWebsite 负责公开内容、项目证据和简历材料。

## 核心目标

- 所有原始想法先保存在 `/Users/fkycoya/Documents/CoyaPersonal`。
- 只有明确打标的 Obsidian 笔记会复制进本仓库的 `content/inbox/`。
- 即使笔记已经打标，也只有 Coya 通过 Hermes/Lucas 明确下达同步指令时才真正复制。
- 进入 `content/inbox/` 的素材仍然是草稿素材，不自动发布。
- 成熟内容经过已有命令转成 `blog`、`weekly`、`projects`、`career`、`book-list`。
- 简历更新必须能追溯到项目、周记或确认过的经历。

## 机器入口

配置文件：

```txt
knowledge-field.config.json
```

本地命令：

```bash
npm run knowledge:doctor
npm run knowledge:sync
npm run knowledge:sync:apply
npm run knowledge:draft-blog
npm run knowledge:confirm-publish
npm run knowledge:deploy-production
npm run knowledge:report
```

默认同步是保守模式：`knowledge:sync` 只预览；`knowledge:sync:apply` 是底层执行命令，只应由 Hermes/Lucas 在收到 Coya 明确同步指令后调用。

## Obsidian 打标规则

在想同步到网站仓库的笔记中放任意一个标记：

```md
#to-personal-website
#to-blog
#to-weekly
#to-project
#to-career
#to-book-list

publish: website
website: true
```

建议最常用的是细分标记：

| 标记 | 进入 | 后续命令 |
| --- | --- | --- |
| `#to-blog` | `content/inbox/ideas/` | `/blog-from-notes` |
| `#to-weekly` | `content/inbox/logs/` | `/weekly-from-inbox` |
| `#to-project` | `content/inbox/project-notes/` | 手动更新项目页 |
| `#to-career` | `content/inbox/career-notes/` | `/project-to-career` |
| `#to-book-list` | `content/inbox/book-notes/` | `/book-list-from-inbox` |

同步脚本只复制，不移动、不删除 Obsidian 原文。复制出的文件会带 provenance 注释，记录来源路径、同步时间和下一步命令。

注意：打标只是“允许被纳入同步候选”，不是自动同步许可。真正复制必须由 Coya 对 Hermes/Lucas 发出明确指令，例如“Lucas，把今天标记的 Obsidian 笔记同步到网站 inbox”。

## Hermes / Lucas 的位置

Hermes 不直接发布内容。Lucas profile 适合做三件事：

1. 从飞书/日程/任务里沉淀复盘材料，再写入 Obsidian 或 `content/inbox/logs/`。
2. 每周提醒运行 `knowledge:report` 和 `/weekly-from-inbox`。
3. 每月提醒运行 `/project-to-career`，把项目证据变成简历素材。

Hermes 仍然遵守 `docs/agent/hermes-content-workflow.md`：生成内容默认 `status: draft`，不主动改成 `published`。

## Hook / Skill 接法

本仓库提供项目 skill：

```txt
.agents/skills/knowledge-field-orchestrator/SKILL.md
```

当你对 agent 说“串联知识场域”或“做本周知识场域巡检”时，agent 应先运行：

```bash
npm run knowledge:doctor
npm run knowledge:sync
npm run knowledge:report
```

只有当 Coya 明确说“同步”“执行同步”“把标记笔记同步到网站 inbox”时，Hermes/Lucas 才能运行：

```bash
npm run knowledge:sync:apply
```

然后根据进入的 inbox 路由调用对应内容命令。

## 双入口博客写作

知识场域现在有两个等价入口：

1. **飞书 / Hermes / Lucas**：使用 Lucas profile 中的 `personal-knowledge-field` skill。
2. **PersonalWebsite / Claude Code**：使用仓库命令 `/write-blog-from-source` 或 `knowledge-field-blog-writer` skill。

两条入口都调用同一套 CLI：

```bash
npm run knowledge:draft-blog -- --source "<url|path|stdin>" --actor "<claude|hermes-lucas>" --instruction "<Coya request>"
npm run knowledge:confirm-publish -- --pending <id>
npm run knowledge:deploy-production -- --pending <id>
```

### 支持的来源

| 来源 | 入口行为 |
| --- | --- |
| URL | 抓取页面文本，生成 draft，并标记外部事实需确认 |
| Obsidian / 本地 Markdown | 保留正文为主，只换 PersonalWebsite frontmatter |
| `content/inbox/*` | 作为素材文件生成 blog draft |
| 飞书 doc/wiki | Lucas 先用 lark skill 导出 Markdown，再调用 `draft-blog` |
| 粘贴文本 | 通过 `--source stdin` 传入 |

### Pending 确认门

`draft-blog` 会生成两份内容：

- `content/blog/<date-slug>.md`
- `.knowledge-field/pending/<id>.json`

`.knowledge-field/` 是本地状态目录，不提交。发布和部署都必须通过 pending id 精确确认：

```bash
npm run knowledge:confirm-publish -- --pending <id>
npm run knowledge:deploy-production -- --pending <id>
```

`deploy-production` 只接受已经 `published` 的 pending，并会先跑 `typecheck`、`lint`、`build`，再调用 Claude Code 执行提交和生产部署。

## Cron 接法

推荐 macOS/Linux cron：

```cron
17 21 * * * cd /Users/fkycoya/Documents/Code/PersonalWebsite && npm run knowledge:cron >> /tmp/personal-website-knowledge-field.log 2>&1
```

这条 cron 每天 21:17 做三件事：

1. 检查 Obsidian、博客仓库、图和命令是否存在。
2. 预览带同步标记的 Obsidian 笔记，但不复制。
3. 更新 `docs/agent/knowledge-field-report.md`。

cron 永远不做 `knowledge:sync:apply`。同步只能来自 Coya 对 Hermes/Lucas 的明确指令。

## 每周节奏

```txt
周一到周五
  Obsidian 捕获想法、项目、阅读、飞书复盘
  需要进入网站系统的笔记加 #to-* 标记

每天晚上
  cron 只做巡检、预览和报告
  如果 Coya 对 Hermes/Lucas 说“同步”，才复制标记笔记到 content/inbox/*

周末
  /weekly-from-inbox 生成周记草稿
  /draft-audit 检查草稿完整度
  /project-to-career 更新简历证据

月末
  knowledge:report 盘点内容账本
  选择成熟草稿手动改为 published
```

## 不变量

- 不把未打标 Obsidian 笔记同步进仓库。
- 不通过 cron 自动同步；只有 Coya 通过 Hermes/Lucas 明确指令时才同步。
- 不通过 cron 自动发布或部署；发布和部署都必须带 pending id。
- 不自动发布，所有内容默认 `status: draft`。
- 不删除原始素材。
- 简历材料必须有证据来源。
- 图、配置、报告、内容文件保持互相可追溯。
