---
name: ai-tracker-from-inbox
description: 从 content/inbox/ai-notes/ 的 AI 跟踪碎片生成 ai-tracker 草稿
argument-hint: "<素材文件名或目录路径>"
user-invocable: true
---

# AI Tracker From Inbox — 从碎片生成 AI 跟踪卡片

你是内容协作助手。用户给了你一段或多段 AI 跟踪碎片笔记(论文/产品/文章/播客/视频/讨论),你要生成一篇 AI Tracker 草稿。

## 步骤

### 1. 读取素材

读取 `content/inbox/ai-notes/` 或用户通过参数指定的文件。

### 2. 提取核心信息

从素材中识别:
- 这是什么来源类型(paper / product / model / agent / tool / article / video / podcast / discussion / other)?
- 核心 takeaway 是什么(3-5 条)?
- 我读完之后还有哪些未解问题(2-3 条)?
- 这个 source 对我的工作有多重要(1=存档 / 2=参考 / 3=高价值)?

### 3. 选 sourceType

从以下枚举中选一个:
- `paper` — 论文 / 技术报告
- `product` — AI 产品
- `model` — 模型发布 / 能力更新
- `agent` — Agent 框架 / 协议
- `tool` — 工具 / 库 / SDK
- `article` — 博客 / 深度文章
- `video` — 视频 / 演讲
- `podcast` — 播客
- `discussion` — 论坛 / Twitter / 对话
- `other` — 其他

不确定时标记 `[待确认]`,由 Coya 决定。

### 4. 选 signal 与 signalLabel

- `3` — 高价值
- `2` — 参考
- `1` — 存档

可选 `signalLabel`:`"高价值" / "参考" / "存档"` 或自定义短标签。

### 5. 选 topics

粗分类,2-4 个(参考 `content/ai-tracker/` 现有条目,保持风格一致)。

### 6. 提取 tags

细标签,2-5 个(如 `["GPT-5", "OpenAI", "evaluation"]`)。

### 7. 写 takeaways

- 用 Coya 第一人称
- 每条 1-2 句
- 来自素材的事实直接写
- Hermes 推断的事实标 `[待确认]`
- 3-5 条

### 8. 写 questions

- 我还**没**搞清楚的事
- 2-3 条

### 9. 写 frontmatter 与正文

frontmatter 必填:
- `title` / `date` / `summary` / `status: draft` / `tags` / `sourceType` / `signal` / `takeaways` / `questions`

可选:`englishSummary` / `sourceUrl` / `sourceTitle` / `author` / `publishedAt` / `signalLabel` / `topics` / `relatedLinks` / `relatedPosts`

正文模板参见 `docs/agent/ai-tracker-template.md`。

### 10. 自动填 englishSummary

- 1-2 句英文摘要
- 与 `summary` 语义一致,但用英文表达
- 风格保持 Coya 口吻

### 11. 生成文件

- 路径:`content/ai-tracker/<YYYY-MM-DD-slug>.md`
- `status: draft` 永远默认
- 模板:`docs/agent/ai-tracker-template.md`

### 12. 输出

展示生成的 ai-tracker 卡片,标注:
- 素材来源文件
- 哪些字段是 Hermes 推断的(应标 `[待确认]`)
- 待 Coya 确认/补全的项
- 建议的 `topics` 取值(对齐已有分类)

## 约束

- ❌ 不编造素材里没有的事实
- ❌ 不设为 `published`
- ❌ 不擅自把 `signal` 设为 `3` — 拿不准时用 `2` 并标 `[待确认]`
- ✅ 不确定的字段标 `[待确认]`
- ✅ 用 Coya 第一人称
- ✅ 禁用 AI 腔("在当今时代" / "值得注意的是" / "总而言之")
- ✅ 字段缺失时提示用户补全,不要硬猜
- ✅ 完成后让 Coya 手动审阅 frontmatter 与 `relatedPosts` 候选
