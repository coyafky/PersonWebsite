---
title: "Harness Engineering：造一台能驭风的 AI 风车"
date: "2026-05-23"
summary: "解读 Anthropic 工程团队两篇博客，梳理 Harness Engineering 的两套方案——Initializer+Coding Agent 两角色分工、Planner+Generator+Evaluator 三 agent 分工，以及可直接上手的行动清单。"
tags:
  - Harness-Engineering
  - Anthropic
  - Agent
  - 上下文管理
  - 评审
status: published
sourceType: article
signal: 3
signalLabel: "高价值"
sourceUrl: "https://www.youtube.com/watch?v=Jxk1_n16Qn4"
sourceTitle: "Harness Engineering是什么？ — 小木头"
author: "小木头（解读）/ Anthropic（原文）"
publishedAt: "2026-05-23"
topics:
  - Agent
  - 工程方法
lang: zh
englishSummary: "A reading of Anthropic's two engineering blog posts on Harness Engineering — the scaffolding around an AI model that turns raw capability into reliable, sustained output. Covers two role-split patterns (Initializer+Coding Agent, Planner+Generator+Evaluator), state externalization, and a ready-to-use action checklist."
takeaways:
  - "长时运行 agent 真正的难点不在写代码，而在跨会话的交接——状态必须外化到文件，不靠对话记忆传。"
  - "生产者和评判者必须是两个 agent，没有人能批改自己的卷子（Planner+Generator+Evaluator）。"
  - "上下文处理选「重置」而非「压缩」——别让模型背着一整车历史跑，让它轻装上阵。"
  - "Harness 是和模型一起进化的：模型升级后要回头拆掉不再承重的部件，先找最简单方案，需要时才加复杂度。"
questions:
  - "功能清单（JSON、只翻状态不删）的维护成本在大型项目里会不会失控？"
  - "Evaluator 的评分标准如何避免「和人类不一致」的漂移？"
relatedLinks:
  - title: "Harness Engineering是什么？（原视频）"
    url: "https://www.youtube.com/watch?v=Jxk1_n16Qn4"
relatedPosts:
  projects:
    - "openclaw-business-agent"
---

## 核心隐喻：风与风车

模型就是那阵风——它越来越强，但一阵再强的风，本身也干不了一个复杂的项目。真正决定它能不能干成事的，是你给它造的那台**风车**。

> Harness Engineering，说白了就是：驾驭 AI 系统里的各种元素，让这个系统稳定地、持续地输出价值。

为什么现在重要？因为模型已经够强，但**一个上下文窗口装不下打造一个完整应用这种活**。真正需要工程的，不再是模型，而是模型外面那一层支撑结构——Harness：提示词、文件约定、agent 角色分工、反馈循环、工具接入。它不是通用框架，而是你为这个具体项目亲手搭起来的脚手架。

## 四种典型翻车模式

Anthropic 总结了长时运行 agent 的四种翻车：

| # | 翻车类型 | 表现 | 根本原因 |
|---|---------|------|---------|
| 1 | **一次性硬干** | 想一口气写完整个 app，context 跑到一半耗光 | 没有边界感 |
| 2 | **提前收工** | 明明只做了一部分，就宣布完成 | 没有验收标准 |
| 3 | **上下文焦虑** | 快到上限时慌了，草草下结论收尾 | 没有状态外化 |
| 4 | **自我感觉良好** | 让它评价自己产出，总说干得不错 | 自己批改自己卷子 |

前两种靠方案一解决，后两种靠方案二解决。

## 方案一：Initializer + Coding Agent 两角色分工

**把「开局」和「干活」拆成两个角色。**

- **Initializer**：只在第一个会话跑一次，布置现场
- **Coding Agent**：之后的每个会话都是它，一点一点往前推进

衔接物是四份结构化工件——直接在项目里放文件，能进 git、纯文本、agent 用普通工具就能读写：

1. `init.sh` — 一键启动开发环境 + 冒烟测试
2. `claude-progress.txt` — 进度日志，记录上一班干到哪
3. Git 仓库 — 每一步可回滚的痕迹
4. **功能清单（JSON）** — 穷举所有功能的验收清单，`passes: false` → `true`，**不许删、不许改**

那份功能清单是合同不是草稿。Anthropic 案例里列了 200 多条，铁律是编码 agent 只能把 `false` 翻成 `true`，绝对不许删除或修改条目。用 JSON 而不是 Markdown——因为模型对着 JSON 更不容易手痒去改。

每个新会话开工前走固定五步：`pwd` → 读 git log + 进度日志 → 读功能清单挑一条 → 启动开发服务器 → 跑端到端测试。**先进入状态，再写代码，一次只干一件事。**

验收要像用户一样验——用浏览器自动化点进去操作、截图留证。测试通过必须意味着功能真的能用。

## 方案二：Planner + Generator + Evaluator 三 agent 分工

**核心动作：把生产和评判交给不同的人。**

| Agent | 职责 | 关键点 |
|-------|------|--------|
| **Planner** | 简短想法 → 完整产品规格 | 只管范围和高层设计，不碰太细的技术决策 |
| **Generator** | 按规格迭代实现 | 动手前先和 Evaluator 谈好 **sprint contract**（这一轮做完是什么样、用什么验证） |
| **Evaluator** | 像 QA 一样打分 | **整个设计最关键的角色——专治自我感觉良好** |

Evaluator 用 Playwright MCP 像真实用户一样点 UI、调 API、查数据库，按多维度打分。硬指标不达标就判定失败并给详细反馈。

> 开箱即用的 Claude 当 QA 其实很差——它会接受次品，测试也表面。你必须拿错误日志反复打磨它的提示词。

设计精髓：**生产者和评判者必须是两个 agent。没有人能够批改自己的卷子。**

Evaluator 按什么打分（以前端设计为例）：设计质量（连贯整体 vs 拼盘）、原创性（自定义决策 vs 套模板）、工艺（排版/间距/颜色/对比）、功能性（抛开美观好不好用）。还要用少量带详细评分的范例去校准，让判断和人类一致。

### 上下文处理：重置而非压缩

上下文快满时两种做法：压缩（总结历史，但噪音还在）vs **重置**（清空对话，干净开局）。Anthropic 选后者——状态不靠对话记忆传，靠结构化文件（规格/契约/评估报告）。别让模型背着一整车历史跑，让它轻装上阵。

## 值不值？用数字说话

| 场景 | 裸跑 | 完整 Harness |
|-----|------|-------------|
| Dungeon Agent（复古游戏制作器） | 20 分钟 / $9 | 6 小时 / $200 |
| 音频应用 | — | 3 小时 50 分 / $125 |
| 结果 | 核心玩法是坏的 | 多功能、物理正确、真正能玩 |

Harness 把成本抬高一个量级——但它就是**能用和不能用之间的那条分界线**。

## Harness 随模型一起进化

Opus 4.5 时上下文焦虑严重，必须拆 sprint、必须重置上下文。到 Opus 4.6 规划能力和上下文都变强，Anthropic 直接把 sprint 这个构件砍掉，Harness 反而更简单，质量没降。

原则：**先找最简单的方案，需要的时候才加复杂度。** 每个 Harness 部件都是对模型当前短板的一个假设——模型一升级，就要回头拆掉不再承重的部件。

## 可直接上手的清单

| # | 原则 | 具体做法 |
|---|------|---------|
| 1 | **状态** | 进度文件 + 干净的 git 历史，让 agent 能接班 |
| 2 | **边界** | 穷举的功能/验收清单，只读、只翻状态，不删除 |
| 3 | **仪式** | 定一套开工仪式——先读上下文再动手 |
| 4 | **评审** | 把评审拆给另一个 agent，别让它自己判自己 |
| 5 | **验收** | 端到端地验、像用户一样地验，不只跑单元测试 |

最后提醒：**不是所有任务都要上 Harness。** 琐碎小活、一个会话能搞定的——Harness 反而是负债，直接上手就行。

## 和我现有工作的关联

这套方法论和我正在做的事情方向一致：

- **OpenClaw 业务 Agent** 里的多机器人 + 多 Agent 配置，本质就是方案二的简化版——客服/线索/内容拆给不同 agent，互不干扰
- **Claude Code CLI 的工程化设计** 里「权限做在 tool 层而非 agent 层」和 Harness「状态外化到文件」是同一类思路：把容易出问题的责任从模型身上挪到外部结构上
