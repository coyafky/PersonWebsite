---
title: "【2026/Agent】一期讲透！理论+代码从 ToolCall 到 Harness、Claw"
date: "2026-09-20"
summary: >-
  木乔_Mokio 的 Agent 长课，一个视频 20 个分P、总时长 2 小时 50 分。前半程是理论篇：从 ToolCall 讲起，依次过 ReAct、Reflection、Plan & Execute、MultiAgent 五种范式，再往上是 Context Engineer、Harness Engineer、Claw 三层工程化；后半程是项目篇：按官方仓库的规划文稿，从零手搓一个 mini Claude Code（MokioClaw），用六个阶段六次进化把前面的理论全部落地。理论篇有配套代码，项目篇有完整源码与分阶段文稿。
status: published
platform: "Bilibili"
instructor: "木乔_Mokio"
url: "https://www.bilibili.com/video/BV1dw526tEMA/"
tags:
  - "AI Agent"
  - "ToolCall"
  - "ReAct"
  - "多 Agent"
  - "Context Engineering"
lang: zh
englishSummary: >-
  A 20-part Agent course by Mokio. The theory half walks from ToolCall through ReAct, Reflection, Plan & Execute and MultiAgent, then Context Engineering, Harness Engineering and the Claw interaction layer. The project half builds MokioClaw, a mini Claude Code, across six documented evolution stages. ~2h51m total.
---

## 这个课程讲了什么

一句话：**先把 Agent 的五种范式和三层工程化讲透，再用一个项目把它们全部落地。**

官方把整个课程切成**理论篇（P3–P13）**与**项目篇（P14–P20）**两大块；下面模块 2 / 模块 3 就是照这个切的，模块名沿用官方叫法。理论篇的五个范式（ToolCall → ReAct → Reflection → Plan & Execute → MultiAgent）与三层工程化（Context Engineer → Harness Engineer → Claw）都能在分P 标题里逐条对上。

课程自带一条贯穿全片的主线：理论篇每讲一个范式就配一段代码（`theory` 分支）；项目篇则围绕 MokioClaw 这个 mini Claude Code 展开，官方文稿给的定位是「从零到一，手搓一个 Code Agent —— 六个阶段，六次进化」，并明确说重点不是功能对齐，而是循序渐进地增加复杂度。

### 项目篇的六次进化（出自官方 `项目篇规划.md`）

| 阶段 | 分P | 这一阶段要解决什么 |
| --- | --- | --- |
| 一 · ReAct 实现基础功能 | P15 | 用最简单的 ReAct 循环，让 Agent 能听懂指令、创建文件、执行代码 —— 整个项目的地基 |
| 二 · 改为 LangGraph | P16 | ReAct「想到哪做到哪」，没有规划没有验证 → 引入计划 → 执行 → 检查的结构化循环 |
| 三 · MultiAgent | P17 | 一个 Actor 既写代码又查资料、能力边界模糊 → 拆成 codeAgent + searchAgent，由 Planner 做 Supervisor |
| 四 · Context Engineer | P18 | 长程任务消息历史撑爆上下文 → 压缩 + Notepad 持久笔记 + 分层 Memory |
| 五 · Harness Engineer | P19 | 生产环境需要安全网与可观测性 → 人类在环审批 + Checkpoint + Trace |
| 六 · Claw 交互层 | P20 | 终端文本不够直观 → 用 Textual 做 TUI，并接入多轮对话与飞书 API |

## 我学到了什么

*（跟课过程中逐节补。）*

## 我会怎么用

*（跟课过程中逐节补。）*

## 课时清单

**共 3 个模块 · 20 个分P · 总时长约 2:50:54**

分P 编号、标题、时长与链接均逐条取自 B 站视频接口，核对日期 2026-09-20。⚠️ 「讲了什么」一列是我按官方文稿与仓库结构写的**定位**，不是内容摘要；本视频没有逐分P 的官方简介。**理论篇与项目篇的切分沿用官方叫法。**

### 模块 1 · 开场与准备（2 分P）

| 分P | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| P1 | [前言](https://www.bilibili.com/video/BV1dw526tEMA/?p=1) | 5:24 | 开场 |
| P2 | [LangChain&LangGraph简介](https://www.bilibili.com/video/BV1dw526tEMA/?p=2) | 5:04 | 开场第二讲，介绍 LangChain 与 LangGraph —— 后面理论篇的代码基本都建在这两个库上 |

### 模块 2 · 理论篇：五种范式与三层工程化（11 分P）

| 分P | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| P3 | [ToolCall：理论](https://www.bilibili.com/video/BV1dw526tEMA/?p=3) | 4:37 | 理论篇 · ToolCall 的理论部分 |
| P4 | [ToolCall：代码](https://www.bilibili.com/video/BV1dw526tEMA/?p=4) | 12:18 | 理论篇 · ToolCall 的代码部分 |
| P5 | [ReAct：理论](https://www.bilibili.com/video/BV1dw526tEMA/?p=5) | 4:36 | 理论篇 · ReAct 的理论部分 |
| P6 | [ReAct：代码](https://www.bilibili.com/video/BV1dw526tEMA/?p=6) | 10:00 | 理论篇 · ReAct 的代码部分 |
| P7 | [Reflection：理论+代码](https://www.bilibili.com/video/BV1dw526tEMA/?p=7) | 14:33 | 理论篇 · Reflection，理论与代码合一的一节 |
| P8 | [Plan&Execute：理论+代码](https://www.bilibili.com/video/BV1dw526tEMA/?p=8) | 7:24 | 理论篇 · Plan & Execute，理论与代码合一的一节 |
| P9 | [MultiAgent：理论+代码](https://www.bilibili.com/video/BV1dw526tEMA/?p=9) | 15:53 | 理论篇 · MultiAgent，理论与代码合一的一节 |
| P10 | [ContextEngineer：理论](https://www.bilibili.com/video/BV1dw526tEMA/?p=10) | 17:22 | 理论篇 · Context Engineer（只有理论） |
| P11 | [HarnessEngineer：理论](https://www.bilibili.com/video/BV1dw526tEMA/?p=11) | 15:52 | 理论篇 · Harness Engineer（只有理论） |
| P12 | [Claw：理论](https://www.bilibili.com/video/BV1dw526tEMA/?p=12) | 3:37 | 理论篇 · Claw（只有理论） |
| P13 | [总结](https://www.bilibili.com/video/BV1dw526tEMA/?p=13) | 4:30 | 理论篇收尾 · 总结 |

### 模块 3 · 项目篇：手搓 MokioClaw 的六次进化（7 分P）

| 分P | 标题 | 时长 | 讲了什么 |
| --- | --- | --- | --- |
| P14 | [项目篇前言](https://www.bilibili.com/video/BV1dw526tEMA/?p=14) | 3:34 | 项目篇前言 |
| P15 | [项目篇：ReAct](https://www.bilibili.com/video/BV1dw526tEMA/?p=15) | 7:56 | 项目篇 · 阶段一：ReAct 实现基础功能 |
| P16 | [项目篇：Plan&Execute](https://www.bilibili.com/video/BV1dw526tEMA/?p=16) | 7:51 | 项目篇 · 阶段二：改为 LangGraph —— Plan → Execute → Verify |
| P17 | [项目篇：MultiAgent](https://www.bilibili.com/video/BV1dw526tEMA/?p=17) | 6:34 | 项目篇 · 阶段三：MultiAgent —— 专家分工协作 |
| P18 | [项目篇：Context Engineer](https://www.bilibili.com/video/BV1dw526tEMA/?p=18) | 9:29 | 项目篇 · 阶段四：引入 Context Engineer |
| P19 | [项目篇：Harness](https://www.bilibili.com/video/BV1dw526tEMA/?p=19) | 10:46 | 项目篇 · 阶段五：引入 Harness Engineer |
| P20 | [项目篇：交互层](https://www.bilibili.com/video/BV1dw526tEMA/?p=20) | 3:34 | 项目篇 · 阶段六：引入 Claw 交互层 |

### 配套资料

- 官方代码仓库：[Wood-Q/MokioAgent](https://github.com/Wood-Q/MokioAgent)（272 stars）——三个分支：`master`（完整项目 MokioClaw）、`project`（项目分支）、`theory`（理论篇代码 + PPT）
- 官方理论源码：[`theory` 分支](https://github.com/Wood-Q/MokioAgent/tree/theory) ——`1. Toolcall/`、`2. AgentLoop/`、`3. MultiAgent/` + `Agent指南.pptx`
- 官方项目文稿：[`项目篇规划.md`](https://github.com/Wood-Q/MokioAgent/blob/master/项目篇规划.md) ——六个阶段的视频文稿（含设计目标、架构、Prompt 设计要点、核心代码）
- 官方 Notion 笔记：[ToolCall→Claw](https://www.notion.so/ToolCall-Claw-334747825dae800bbf46c8eb0008e5b2?pvs=74)
