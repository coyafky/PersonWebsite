---
title: "抖音封面生成工作流"
date: "2026-08-23"
summary: "一个给拍摄剪辑同事使用的封面生成工作流：草稿图和一句话需求进入后，经过提示词整理、图生图和飞书回传，形成可复用的交付链路。"
status: published
englishSummary: "An internal Douyin cover workflow that turns a draft image and a short brief into image-to-image outputs and a Feishu delivery."
contribution: original
origin: "内部开发：douyin-cover-entry / gbro-cover-design"
scenario: "视觉生成 / 内容生产"
input: "当前消息中的草稿图、封面标题和主题要求"
process: "按消息绑定归档草稿，生成双比例提示词，固定走图生图，回传飞书"
output: "竖 3:4 与横 4:3 两种封面，以及发布标题、简介和标签"
contributionSummary: "我负责流程设计、并发隔离、提示词结构和回传闭环。"
changes:
  - "只使用当前消息上下文中的图片，不查历史消息取图"
  - "以 message_id 建立任务目录，后续步骤引用归档后的稳定路径"
  - "把纯文生图排除在执行电路之外，固定走图加文的图生图流程"
evidence:
  - "已有文章记录了状态机、消息绑定、双比例交付和失败处理边界"
  - "对外记录隐藏了内部资产与 token，当前页面只展示方法和证据"
cover: /images/blog/2026-08-23-douyin-cover-skill/cover.webp
coverAlt: 一排几乎相同的卡片中，只有一张被一小段蓝线标记出来
tags:
  - "AI Skill"
  - "抖音"
  - "视觉生成"
lang: zh
relatedBlogPosts:
  - "2026-08-23-douyin-cover-skill"
---

## 业务问题

拍摄剪辑同事需要反复制作抖音封面。输入通常是一张草稿图、一句标题和一个主题要求。问题不在于模型能不能生成，而在于多个需求同时到来时，流程容易拿错图，生成步骤也容易偏离设计。

## 原始流程

原始需求由飞书消息进入。图片已经属于当前消息，但如果流程再去查历史消息，就会重新引入混图风险。因此这套工作流把消息绑定当作并发隔离的基础。

## 我的设计

我把工作流拆成两个关键约束。第一，只认当前消息上下文中的草稿图，并以 `message_id` 建立任务目录。第二，生图节点固定走图加文的图生图，纯文生图不在执行电路内。

## 输入 → 处理 → 输出

```mermaid
flowchart LR
  A[草稿图 + 一句话需求] --> B[消息绑定与归档]
  B --> C[提示词整理与双比例]
  C --> D[图生图]
  D --> E[飞书回传]
```

## 验证和边界

已有实践记录验证了状态机、并发隔离、双比例输出和飞书回传。内部资产与 token 不在此公开。当前条目不展示未测量的节省时长或成功率。

## 关联材料

完整的过程记录见[我给剪辑做了个抖音封面 Skill，顺手写了几条禁令](/blog/2026-08-23-douyin-cover-skill/)。
