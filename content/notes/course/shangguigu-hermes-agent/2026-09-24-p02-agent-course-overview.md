---
title: "P2 02_Hermes Agent课程介绍"
date: "2026-09-24"
summary: >-
  P2 · 02_Hermes Agent课程介绍（6:32）
status: published
tags:
  - "Hermes"
  - "AI Agent"
lang: zh
chapter: "P2"
series: "shangguigu-hermes"
seriesOrder: 2
---

## 课时概要

开场 · Hermes Agent 课程介绍 —— 课程大纲与学习路径。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[02_Hermes Agent课程介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=2) ｜ 时长 6:32 ｜ P2

## 本节要点

- 官方文档 [Getting Started / Learning Path](https://hermes-agent.nousresearch.com/docs/getting-started/learning-path) 提供了一条官方学习路径；本课的分P 结构（能力篇/进化篇/协作篇/实战篇）与官方功能分组大体对应。
- 官方文档 [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart) 给出一条零到可用的最短路径：安装 → 选 provider → 跑通一次对话 → 验证会话恢复 → 再叠加功能。
- 核心方法论（官方 Quickstart）：**「如果 Hermes 连一次正常对话都跑不通，先不要加更多功能」**——先跑通一条干净对话，再逐层加 gateway、cron、技能、语音、路由。

## 关键概念

- **Provider**：Hermes 使用的模型后端（Nous Portal / OpenRouter / OpenAI / DeepSeek / 本地端点等），决定用哪家的模型。
- **能力篇/进化篇/协作篇/实战篇**：本课的四个官方篇章，分别对应单 Agent 能力、自我进化、多 Agent 协作、端到端案例。

## 代码 / 实操

无实操。建议先读官方 Quickstart 全文：**[Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)**

## 我的收获

**用户此前已完成本模块的学习与配置**；以下是本机实测状态（2026-09-24）：

- 本机已跑通（用户已于此前完成学习与配置）：`hermes doctor` 全绿，Python 3.11.15，Config v46，`Up to date`。
- 官方 Quickstart 的建议顺序与我的实际使用路径一致：先 CLI 跑通，再加 gateway 与自动化。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
