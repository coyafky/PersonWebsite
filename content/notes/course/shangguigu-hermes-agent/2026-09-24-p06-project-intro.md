---
title: "P6 06_Hermes Agent项目介绍"
date: "2026-09-24"
summary: >-
  P6 · 06_Hermes Agent项目介绍（7:51）
status: published
tags:
  - "Hermes"
  - "AI Agent"
lang: zh
chapter: "P6"
series: "shangguigu-hermes"
seriesOrder: 6
---

## 课时概要

开场 · Hermes Agent 项目介绍。官方 README 的自我定位：**The self-improving AI agent built by Nous Research** —— 唯一内置学习回路的 agent：从经验里创建技能、使用中自我改进、主动沉淀知识、搜索自己的历史对话、跨会话建立对你的模型。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[06_Hermes Agent项目介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=6) ｜ 时长 7:51 ｜ P6

## 本节要点

- 官方 README 定位：**The self-improving AI agent built by Nous Research**——只有它内置学习回路：从经验创建技能、使用中自我改进、主动沉淀知识、搜索自己的历史对话、跨会话建立对你的模型。
- 官方 README 功能表：真实终端界面（TUI）｜多平台消息（Telegram/Discord/Slack/WhatsApp/Signal/CLI 单 gateway）｜闭环学习（记忆 + 技能 + FTS5 会话搜索 + Honcho）｜定时自动化（内置 cron）｜委派与并行（隔离子代理）｜七种终端后端（local/Docker/SSH/Singularity/Modal/Daytona/Vercel Sandbox）｜研究就绪（批量轨迹生成）。
- 官方 Features Overview：核心 = 工具与工具集 / 技能体系 / 持久记忆 / 上下文文件 / 检查点；自动化 = Cron / 子代理委派 / 代码执行 / 事件钩子；媒体与 Web = 语音 / 唤醒词 / 浏览器自动化 / 生图 / TTS；集成 = MCP / 路由 / 备用 provider / 记忆提供商 / API Server / ACP。

## 关键概念

- **学习回路（learning loop）**：Hermes 的标志性能力——任务结束后按需沉淀技能、记忆与人格模型，让 Agent 越用越懂你。
- **TUI / CLI / Gateway**：三种交互形态——CLI 交互对话、TUI 增强终端界面、Gateway 连接消息平台。

## 代码 / 实操

本分P 是项目介绍，无实操命令。功能对照表见官方 [Features Overview](https://hermes-agent.nousresearch.com/docs/user-guide/features/overview)。

## 我的收获

**用户此前已完成本模块的学习与配置**；以下是本机实测状态（2026-09-24）：

- 本机功能验证过：skills（技能体系）、cron（定时）、kanban、profiles（多实例）都是真实存在且在用的能力。
- 本机 `~/.hermes/` 顶层能看到这些功能的实体：`skills/` `cron/` `kanban.db` `profiles/` `memories/` `hooks/` `plugins/`——与官方 Overview 一一对应。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
