# AI Tracker 模板

> Hermes 在 `/ai-tracker-from-inbox` 时使用此模板生成 `content/ai-tracker/<date-slug>.md`。

## 模板

```markdown
---
title: ""
date: ""
summary: ""
status: draft        # ⚠️ 永远默认 draft
tags:
  - ""
sourceType: ""       # paper | product | model | agent | tool | article | video | podcast | discussion | other
signal: 3            # 1=存档 / 2=参考 / 3=高价值
signalLabel: "高价值"  # 可选
sourceUrl: ""        # 可选
sourceTitle: ""      # 可选
author: ""           # 可选
publishedAt: ""      # 可选 (YYYY-MM-DD)
topics:              # 2-4 个粗分类
  - "模型"
  - "研究方法"
lang: zh
englishSummary: ""
takeaways:           # 3-5 条要点
  - ""
questions:           # 2-3 条未解
  - ""
relatedLinks:        # 可选
  - title: ""
    url: ""
relatedPosts:        # 可选,跨集合 slug
  blog: []
  weekly: []
  projects: []
  career: []
---

## 关键内容
```

## 字段语义

### 必填

- `title` — 一句话标题(从素材核心观点提取)
- `date` — 生成日期(YYYY-MM-DD)
- `summary` — 1-2 句中文摘要
- `status` — **必须 `draft`**,由 Coya 手动改为 `published`
- `tags` — 细粒度标签(2-5 个,如 `["GPT-5", "OpenAI", "evaluation"]`)
- `sourceType` — 素材类型枚举,见下
- `signal` — 1(存档)/ 2(参考)/ 3(高价值)
- `takeaways` — Coya 自己提炼的 3-5 条结论
- `questions` — 2-3 条未解问题

### 可选

- `signalLabel` — 短标签,如 `"高价值" / "参考" / "存档"`
- `sourceUrl` / `sourceTitle` — 外部来源
- `author` — 作者
- `publishedAt` — 原始来源发布日期(若不同于 `date`)
- `relatedLinks` — `[{ title, url }]`
- `relatedPosts` — `{ blog?, weekly?, projects?, career? }`,跨集合 slug
- `lang` — 默认 `zh`
- `englishSummary` — 1-2 句英文摘要(自动生成)

## `sourceType` 枚举

| 值 | 含义 |
|----|------|
| `paper` | 论文 / 技术报告 |
| `product` | AI 产品(应用层) |
| `model` | 模型发布 / 能力更新 |
| `agent` | Agent 框架 / 协议 |
| `tool` | 工具 / 库 / SDK |
| `article` | 博客 / 深度文章 |
| `video` | 视频 / 演讲 |
| `podcast` | 播客 |
| `discussion` | 论坛 / Twitter / 对话 |
| `other` | 其他 |

## `signal` 数字含义

- `3` — **高价值**:影响我后续工作 / 关键判断 / 长期记忆
- `2` — **参考**:值得保留以便回看
- `1` — **存档**:留个痕迹即可,不重要

## `takeaways` 写法

- 用 Coya 第一人称("我观察到…"、"我倾向于…")
- 每条 1-2 句,具体、可执行
- 避免空泛("很重要" / "值得关注")
- 来自素材的事实可直接写;Hermes 补充的推断标 `[待确认]`

## `questions` 写法

- 我读完之后**还**想搞清楚的事
- 可指向验证方法(读什么、做个实验)
- 2-3 条,不要凑数
