# Inbox — Hermes 素材入口

> 这是你往个人网站丢素材的地方。碎片丢进来，Hermes 帮你整理成正式内容。

## 目录职责

| 目录 | 放什么 | 粒度 | 最终产出 |
|------|--------|------|---------|
| `ideas/` | 灵感、想法、想写的主题 | 1-5 句碎片即可 | `content/blog/` |
| `logs/` | 每日/每周碎片记录、做了什么事 | 每条约 3-10 句 | `content/weekly/` |
| `project-notes/` | 项目进展、踩坑记录、成果、技术决策 | 每次推进一个文件 | `content/projects/` |
| `career-notes/` | 面试准备、技能复盘、成就记录 | 每条事实/故事一段 | `content/career/` |
| `book-notes/` | 读书摘录、章节笔记、阅读收获 | 单本书或单章节碎片 | `content/book-list/` |

## 使用原则

1. **不追求格式** — 碎片不需要 frontmatter，不需要结构。一句话也行。
2. **不分类过细** — 不确定放哪？扔 `ideas/`，Hermes 会归类。
3. **写完就不用管** — 你负责丢，Hermes 负责整理成草稿。
4. **时间戳自动** — 文件名建议带日期，如 `2026-06-11-想法.md`。

## 素材粒度示例

### ✅ 好的素材

```md
# ideas/2026-06-11-轮毂学习.md

今天花了 3 小时系统学习了轮毂知识。
从零到能跟改装店老板聊了。
感觉可以写一篇「零基础轮毂入门」。
用购物车解释 Scrub Radius 效果不错。
```

### ❌ 太详细（直接写正式文章就好）

```md
# 不要在这里写 3000 字结构完整的文章
# 那是 content/blog/ 的事
```

### ✅ 好的日志

```md
# logs/2026-06-11.md

- 上午：轮毂知识学习，整理了术语表和概念
- 下午：优化了 agent team 的工作流
- 晚上：思考怎么把学习成果输出到个人网站
```

## Hermes 转化规则

| 素材目录 | 触发条件 | 转化目标 | 命令 |
|---------|---------|---------|------|
| `ideas/` 有新文件 | 你要求或素材 ≥ 3 条 | `content/blog/<slug>.md` | `/blog-from-notes` |
| `logs/` 积累一周 | 每周日或你要求 | `content/weekly/YYYY-WNN.md` | `/weekly-from-inbox` |
| `project-notes/` 有更新 | 你要求 | `content/projects/<slug>.mdx` | 手动触发 |
| `career-notes/` 有新素材 | 你要求 | `content/career/bullets.md` 等 | `/project-to-career` |
| `book-notes/` 有新素材 | 你要求整理一本书 | `content/book-list/<slug>.md` | `/book-list-from-inbox` |

## Obsidian → Inbox 同步

知识场域配置在仓库根目录：

```txt
knowledge-field.config.json
```

常用命令：

```bash
npm run knowledge:doctor
npm run knowledge:sync
npm run knowledge:sync:apply
npm run knowledge:report
```

`knowledge:sync` 默认只预览；`knowledge:sync:apply` 才会复制文件。`knowledge:sync:apply` 只能由 Coya 通过 Hermes/Lucas 明确下达同步指令后执行，不能放进 cron 或后台 hook。

同步只处理带有标记的 Obsidian 笔记，例如：

```md
#to-blog
#to-weekly
#to-project
#to-career
#to-book-list
#to-personal-website
```

完整工作流见 `docs/agent/knowledge-field-workflow.md`。

## 直接写 Blog 的入口

如果素材已经足够明确，也可以绕过 inbox，直接生成一篇 blog 草稿：

```bash
npm run knowledge:draft-blog -- --source "<url|path|stdin>" --actor claude --instruction "<Coya request>"
```

这会写入 `content/blog/<date-slug>.md`，并生成本地 pending id。后续仍然需要 Coya 明确确认：

```bash
npm run knowledge:confirm-publish -- --pending <id>
npm run knowledge:deploy-production -- --pending <id>
```

飞书入口由 Lucas profile 的 `personal-knowledge-field` skill 调用同一套命令。

## Hermes 不会做的事

- ❌ 不会删除你的素材文件（读完归档到 `inbox/archive/`）
- ❌ 不会把草稿直接发布（默认 `status: draft`）
- ❌ 不会编造你素材里没有的事实
- ❌ 不会修改你已发布的文章
