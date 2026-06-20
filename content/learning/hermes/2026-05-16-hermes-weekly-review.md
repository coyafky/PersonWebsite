---
title: "Hermes 学习阶段复盘与下一周计划"
date: "2026-05-16"
summary: "Hermes 阶段性学习复盘：已掌握（基础使用 4 分 / 云部署 3 分 / 飞书 Gateway 3 分 / Skill 使用 3 分）vs 模糊理解（核心定位 / 执行链路 / Skill 机制 / Memory vs Session vs Context / Gateway 故障定位 / Cron/Delegation/Hooks）。5 个误区（把能用当理解 / 当单一聊天工具 / 过早追复杂 / Skill 当提示词 / 排错无分层）。3 大知识漏洞 + Day 1-7 完整学习计划 + 每日 5 分钟复盘机制 + 9 模块当前估计分。"
tags:
  - hermes
  - 学习复盘
  - 学习计划
  - 排错
  - 架构
status: draft
lang: zh
topic: hermes
englishSummary: "Hermes staged learning review: mastered (basic usage 4 / cloud deployment 3 / Feishu Gateway 3 / Skill usage 3) vs vaguely understood (core positioning / execution loop / Skill mechanism / Memory vs Session vs Context / Gateway fault localization / Cron/Delegation/Hooks). Five misconceptions (mistaking usable for understood / treating as single chat tool / chasing complexity too early / treating Skills as prompts / unlayered debugging). Three major knowledge gaps + complete Day 1-7 plan + 5-min daily review mechanism + 9-module current scores."
---

# Hermes 学习阶段复盘与下一周计划

依据：主任务已有学习方案、资料策展人输出、项目导师输出、苏格拉底教练里 Coya 的自述，以及官方 Learning Path / Quickstart。

## 1. 本阶段你学了什么

你已经不是"刚开始学 Hermes"。你已经完成了实操层的入门：

- 经常使用 Hermes。
- 已经把 Hermes 部署到云服务器。
- 有 Skill 使用经验。
- 已经连接并使用飞书场景。
- 能借助 AI 解决 Hermes 使用中出现的问题。

这说明你掌握的是"可用性经验"，不是"系统性理解"。目前学习成果主要集中在：安装、部署、日常使用、具体问题排错、飞书集成、Skill 使用。

## 2. 已经掌握的内容

掌握程度较高：

| 模块 | 判断 |
| --- | --- |
| 基础使用 | 已掌握。你已经能长期使用，不需要再按零基础路线反复看 Quickstart。 |
| 云服务器部署 | 已掌握到"能跑起来"的程度，但未必掌握稳定性、安全和故障定位。 |
| 飞书连接 | 已掌握操作路径，但需要补足 Gateway / adapter / webhook / 权限模型背后的机制。 |
| Skill 使用 | 已掌握使用层，但还没证明理解 Skill 如何被发现、加载、触发、执行。 |
| 借 AI 排错 | 已形成工作流，但这也是当前学习瓶颈：你依赖 AI 给答案，而不是用架构模型定位问题。 |

## 3. 只是模糊理解的内容

这些不要再假装"我大概知道"：

| 模块 | 当前问题 |
| --- | --- |
| Hermes 核心定位 | 你知道它能做什么，但未必能说清它与普通 CLI Agent、Bot 框架、LangChain/CrewAI 类工具的根本差异。 |
| Agent 执行链路 | 从用户输入到模型选择、上下文构建、tool/skill 调用、memory/session 写入，链路没有形成图。 |
| Skill 机制 | 你会用 Skill，但需要搞清 SKILL.md、激活条件、渐进加载、工具注册和实际执行边界。 |
| Memory vs Session vs Context | 这三个很容易混在一起。跨会话记忆、当前会话、项目上下文不是一回事。 |
| Gateway / 飞书集成 | 目前更像"按步骤接上了"，但对事件流、鉴权、回调、消息路由、部署依赖的理解不足。 |
| Cron / Delegation / Hooks | 这些是从"会用工具"到"搭自动化系统"的关键，但当前明显不熟。 |
| 安全与生产化 | 云服务器部署后，权限、token、工具执行边界、日志、故障恢复都需要补。 |

## 4. 可能存在的误区

1. 把"能用"误判为"理解"。
   你现在最危险的不是不会用，而是出问题时只会问 AI，而无法判断 AI 的修复方向是否合理。

2. 把 Hermes 当成单一聊天工具。
   Hermes 的重点不只是 CLI 对话，而是 Agent + Tools + Skills + Memory + Gateway + Cron + Delegation 组成的运行系统。

3. 过早追复杂功能。
   如果基础执行链路没画清楚，直接看插件、MCP、RL Training，会变成名词收集。

4. 把 Skill 当"提示词模板"。
   Skill 更接近可复用的程序化经验包，涉及触发、加载、工具、上下文和执行边界。只把它当提示词会低估它的价值。

5. 排错没有分层。
   飞书或云部署出问题时，应该先分层：平台权限、网络回调、Gateway、Hermes 配置、模型 provider、工具权限、日志。现在更可能是拿错误信息直接问 AI。

## 5. 对你最有效的资料

优先级如下：

1. 官方 Learning Path
   用途：确定学习顺序，不要全量乱读。
   重点：你应走"custom tools/skills""automation""messaging bot"三条路径，不需要重复 beginner 路线。
   https://hermes-agent.nousresearch.com/docs/getting-started/learning-path

2. 官方 Quickstart
   用途：只用来校准基础验证标准，不要反复学。
   重点：官方强调先跑通正常 chat，再叠加 gateway、cron、skills、voice、routing。
   https://hermes-agent.nousresearch.com/docs/getting-started/quickstart

3. Skills / Memory / Tools / MCP 官方章节
   用途：补核心机制。
   产出要求：每章学完必须画出"输入 -> 处理 -> 输出 -> 失败点"。

4. 自己现有 Hermes 云服务器和飞书部署
   用途：最有价值的实验环境。不要只读文档，要拿真实配置和日志反推架构。

5. 项目导师给的三个项目
   用途：用项目验证理解，不要只做阅读笔记。
   第一优先级：个人知识管理 CLI 助手；第二优先级：飞书/Telegram Gateway Bot；第三优先级：自定义 RSS Skill。

## 6. 低效学习方式

停止这些方式：

- 从头到尾通读所有文档，不做结构图。
- 遇到问题直接丢给 AI，让 AI 给命令，然后复制执行。
- 一次学太多模块：Gateway、Skill、MCP、Cron、Memory 混在一起看。
- 只收藏资料，不产出可验证物。
- 看完文档不写"我能解释什么、我还不能解释什么"。

## 7. 当前最大的 3 个知识漏洞

### 漏洞 1：Hermes 的整体执行架构

你需要能解释：用户输入后，Hermes 如何选择 provider、构建上下文、调用工具、加载 Skill、写入 session/memory、返回结果。

验收标准：不用查资料，能画出一张从输入到输出的链路图，并标出至少 8 个可能失败点。

### 漏洞 2：Skill / Memory / Context / Session 的边界

你需要能解释：

- Skill 解决什么问题？
- Memory 解决什么问题？
- Context file 解决什么问题？
- Session 解决什么问题？
- 它们什么时候互相替代，什么时候必须组合？

验收标准：能用自己的 Hermes 使用经历各举 1 个例子。

### 漏洞 3：生产化部署与 Gateway 故障定位

你已经部署过、接过飞书，所以问题不在"会不会接"，而在稳定运行和定位问题。

验收标准：能写出飞书消息从用户发送到 Hermes 回复的链路，并给每一层配一个检查命令、配置项或日志位置。

## 8. 下一阶段：继续、停止、加强

继续：

- 继续使用真实 Hermes 环境学习，不要转成纯理论学习。
- 继续保留 AI 辅助排错，但每次排错后必须补一段"为什么这个修复有效"。
- 继续围绕飞书和 Skill 做主线，因为这是你已有经验最多的场景。

停止：

- 停止零基础式学习路径，不要再把时间花在安装和普通对话上。
- 停止"遇到问题 -> 复制给 AI -> 运行命令 -> 问题消失就结束"。这会让你永远停留在工具使用者。
- 停止同一天同时学 4 个 Hermes 模块。

加强：

- 加强架构图训练：每学一个模块，都要画链路图。
- 加强反例训练：每学一个功能，都要写它什么时候不适用、会怎么失败。
- 加强最小项目验证：每 2 天至少有一个可运行或可解释的产出。

## 9. 调整后的学习计划

目标从"学习 Hermes"调整为：

> 建立 Hermes 的系统心智模型，并能用它解释、调试、扩展自己现有的云服务器 + 飞书 + Skill 工作流。

学习顺序改成：

1. 第 1 层：整体架构
   Architecture、CLI Usage、Configuration、Sessions。

2. 第 2 层：核心机制
   Tools、Skills、Memory、Context Files。

3. 第 3 层：你已有场景的深化
   Messaging / Gateway / 飞书、Security、日志与部署稳定性。

4. 第 4 层：自动化与扩展
   Cron、Delegation、Hooks、MCP、Plugin / Creating Skills。

5. 第 5 层：作品化项目
   先做"个人知识管理 CLI 助手"，再做"飞书 Gateway Bot 稳定化"，最后做"自定义 RSS Skill"。

每个模块的固定学习闭环：

1. 读官方文档 20-30 分钟。
2. 写 5 行"这个模块解决什么问题"。
3. 画一张链路图。
4. 在现有环境里做一个最小验证。
5. 写 3 个失败场景。
6. 回答苏格拉底教练的问题。

## 10. 下一周具体任务清单

假设每天可投入 60-90 分钟；如果当天只有 30 分钟，只做"读文档 + 写 5 行总结"，不要开新坑。

### Day 1：建立总图

学习块 A（30 分钟）：读官方 Learning Path，只看与你相关的三条路径：messaging bot、automation、custom tools/skills。

学习块 B（45 分钟）：画一张 Hermes 总架构图，至少包含 CLI、Provider、Tools、Skills、Memory、Sessions、Gateway、Cron、MCP。

交付物：一张总图 + 200 字说明"Hermes 解决的核心问题是什么"。

### Day 2：梳理你现有部署

学习块 A（30 分钟）：整理当前云服务器上的 Hermes 配置：provider、gateway、memory、terminal backend、日志位置。

学习块 B（45 分钟）：画"飞书消息 -> Hermes -> 模型/工具 -> 飞书回复"的链路。

交付物：飞书链路图 + 每一层的排错检查点。

### Day 3：Skills 深挖

学习块 A（30 分钟）：读 Skills 官方章节，重点看 SKILL.md、激活条件、渐进加载。

学习块 B（45 分钟）：选一个你用过的 Skill，拆解它的结构：触发条件、输入、输出、依赖、失败点。

交付物：Skill 拆解表，不少于 8 行。

### Day 4：Memory / Session / Context 边界

学习块 A（30 分钟）：读 Memory、Sessions、Context Files 章节。

学习块 B（45 分钟）：写一张对比表：三者分别存什么、何时生效、何时失效、如何调试。

交付物：对比表 + 3 个你自己的使用案例。

### Day 5：Tools 与执行链路

学习块 A（30 分钟）：读 Tools / Code Execution 章节。

学习块 B（45 分钟）：让 Hermes 在一个测试目录中完成一个小任务，记录它调用了哪些工具、哪里可能失败。

交付物：一次工具调用观察记录，包括输入、工具、输出、失败点。

### Day 6：做一个最小项目验证

项目：个人知识管理 CLI 助手 MVP。

学习块 A（30 分钟）：准备 5 条学习笔记，放进一个测试目录或会话。

学习块 B（60 分钟）：验证 Hermes 是否能读取、总结、跨会话继续追问。不要追求完美，目标是验证 Memory / Session / Context 的边界。

交付物：MVP 记录，包括成功项、失败项、下一步修复。

### Day 7：复盘与考试

学习块 A（30 分钟）：回答苏格拉底教练提出的 4 个问题，不查资料。

学习块 B（45 分钟）：按以下模板复盘：

- 本周真正理解的 3 件事
- 仍然说不清的 3 件事
- 一个最容易出错的旧认知
- 下周要做的一个项目
- 下周停止做的一种低效学习行为

交付物：一篇 500-800 字复盘 + 更新后的 Hermes 总架构图。

## 复盘机制

每日 5 分钟：

- 今天学了哪个模块？
- 我能不能用一句话解释它解决什么问题？
- 今天有没有可验证产出？没有的话，为什么？
- 今天是否只是复制 AI 答案？如果是，补写"原理解释"。

每两天 20 分钟：

- 更新一次架构图。
- 新增至少 3 个失败点。
- 把一个"模糊词"改写成可执行解释，例如把"Gateway 出问题"拆成 webhook、鉴权、adapter、网络、日志、provider。

每周 45 分钟：

- 用 1-5 分给每个模块打分：Architecture、Skills、Memory、Gateway、Tools、Cron、MCP。
- 低于 3 分的模块下周只能选 1 个重点补，不允许同时补多个。
- 必须保留一个项目型交付物，不接受只有阅读笔记。

当前建议的评分基线：

| 模块 | 当前估计分 |
| --- | ---: |
| 基础使用 | 4 |
| 云部署 | 3 |
| 飞书 Gateway | 3 |
| Skill 使用 | 3 |
| Skill 机制 | 2 |
| Memory / Session / Context | 2 |
| 整体架构 | 2 |
| Cron / Delegation / Hooks | 1-2 |
| MCP / Plugin 开发 | 1-2 |

结论：你下一周不需要"更多资料"，需要的是把已有经验结构化。核心任务不是学会更多命令，而是能解释 Hermes 为什么这样工作、哪里会坏、怎么分层排错。
