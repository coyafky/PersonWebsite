---
title: "Agent 框架现状速览"
date: "2026-06-10"
summary: "把 LangGraph / CrewAI / AutoGen 摆在一起,看它们对状态、记忆、工具调用的取舍。"
tags:
  - LangGraph
  - CrewAI
  - AutoGen
status: draft
sourceType: article
signal: 2
topics:
  - Agent
lang: zh
---

## 三个框架的差异

| 框架 | 状态管理 | 记忆 | 工具调用 |
| --- | --- | --- | --- |
| LangGraph | 显式图 | 外挂 | 函数签名 |
| CrewAI | 角色驱动 | 角色内 | 角色绑定 |
| AutoGen | 消息流 | 对话历史 | 工具注册 |

## 个人倾向

显式图最适合"我希望每个分支都可观测"的项目,角色驱动最适合"我想快速搭一个多 agent demo"。
