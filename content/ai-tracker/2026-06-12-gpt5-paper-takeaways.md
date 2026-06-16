---
title: "GPT-5 论文速读与我的判断"
date: "2026-06-12"
summary: "速读 GPT-5 技术报告,梳理我关注的几个核心变化,以及它对 agent 路线意味着什么。"
tags:
  - GPT-5
  - OpenAI
  - reasoning
  - evaluation
status: published
sourceType: paper
signal: 3
signalLabel: "高价值"
sourceUrl: "https://arxiv.org/abs/2026.00000"
sourceTitle: "GPT-5 Technical Report"
author: "OpenAI"
publishedAt: "2026-06-10"
topics:
  - 模型
  - 研究方法
lang: zh
englishSummary: "A quick read of the GPT-5 technical report — what actually changed, and what it implies for the agent stack."
takeaways:
  - "报告里关于 reasoning 与 tool-use 的拆解比我预想清晰:它们不再被塞进同一个 RL loop,而是分层训练再拼接。"
  - "评估体系被显著扩大,从单轮 QA 扩展到 long-horizon agentic tasks,这是论文最大的方法学贡献。"
  - "对 inference 成本的公开讨论仍然模糊——只在 appendix 给出大致区间。"
questions:
  - "分层训练后的拼接是否能保住端到端 RL 的 emergent 行为?"
  - "long-horizon 评估在多大程度上能预测真实部署表现?"
relatedLinks:
  - title: "OpenAI 官方报告页"
    url: "https://openai.com/research/gpt-5"
  - title: "Simon Willison 的解读"
    url: "https://simonwillison.net/2026/jun/12/gpt-5/"
relatedPosts:
  blog:
    - "2026-06-12-hermes-feishu-bot-config"
  weekly:
    - "2026-W20"
---

## 关键变化

我最关注的不是参数数字,而是训练范式。报告把 reasoning 单独拆出来训练,再与基础模型拼接,这与过去一锅炖的 RL 路线有明显差别。

| 维度 | GPT-4 路线 | GPT-5 路线 |
| --- | --- | --- |
| reasoning | 隐式 | 分层 + 显式 |
| tool-use | 在 RL 里学 | 独立训练再拼接 |
| 评估 | 单轮 QA | long-horizon agentic |

## 我对 agent 路线的判断

如果分层范式站得住,agent framework 的设计可以从"模型 + 工具调用兜底"转向"基础模型 + 专用 reasoning head + 工具 head"。

这与 Hermes 这边正在做的事情方向一致——把规划、调用、反思拆成可插拔的模块,而不是绑死在一次模型调用里。
