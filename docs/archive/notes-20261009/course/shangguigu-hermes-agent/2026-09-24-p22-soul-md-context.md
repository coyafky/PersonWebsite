---
title: "P22 22_能力篇_上下文文件Soul_md"
date: "2026-09-24"
summary: >-
  P22 · 22_能力篇_上下文文件Soul_md（11:01）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P22"
series: "shangguigu-hermes"
seriesOrder: 22
---

## 课时概要

能力篇 · 上下文文件 SOUL.md。SOUL.md 是 Hermes 的人格/上下文文件，官方文档有专门指南 **Use SOUL with Hermes**；仓库根自带 `SOUL.md` 与 `hermes_cli/default_soul.py`（首次初始化时写入）。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档（Use SOUL with Hermes / Personality / Context files 三页）与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[22_能力篇_上下文文件Soul_md](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=22) ｜ 时长 11:01 ｜ P22

## 本节要点

- **SOUL.md 是该 Hermes 实例的首要身份**（官方 Use SOUL with Hermes）：它是 system prompt 里的**第一段（slot #1）** —— 定义 agent 是谁、怎么说话、规避什么。
- **位置**：`~/.hermes/SOUL.md`，用自定义 home 时是 `$HERMES_HOME/SOUL.md`。⚠️ **Hermes 只从 HERMES_HOME 读 SOUL.md，不会去当前工作目录找** —— 所以你的语气不会因为你 `cd` 到别的项目而意外变化。
- **首次运行行为**：Hermes 会自动 seed 一份 starter `SOUL.md`（没有才写）；**已存在的文件绝不被覆盖**；文件存在但为空时，**不会往 prompt 里加任何东西**。
- **该放什么**：tone ｜ personality ｜ 沟通风格 ｜ 该多直接或多温和 ｜ 风格上要避免什么 ｜ 如何面对不确定、分歧与模糊。
- **不该放什么**：repo 专属的编码约定、文件路径、命令、服务端口、架构笔记、项目工作流 —— **那些属于 `AGENTS.md`**。官方给的判断法：**「到哪都该生效 → SOUL.md；只属于某一个项目 → AGENTS.md」**。
- **注入方式**：内容是**逐字注入**（verbatim），官方明确说 **不会在文件外面加任何 wrapper 语言** —— 「内容本身就是重点，按你希望 agent 思考和说话的方式去写」。注入前会过 prompt-injection 扫描与超长截断。
- **缺失时的回落**：如果 SOUL.md 为空、全空白或读不到，Hermes 回落到内置默认身份（官方给出的默认文案开头：*You are Hermes Agent, built by Nous Research. Be direct: match the length of your reply to the weight of the ask…*）。设置 `skip_context_files` 时（例如子代理/委派场景）同样走这个回落到默认身份。
- **SOUL.md 在扫描上有特殊待遇**：它被当作**你自己写的文件**（对它做文件工具写入需要你批准，项目 checkout 也永远不会提供它），所以**扫描命中不会阻断它** —— Hermes 只记一条警告、照常加载，并在 `/context` 里标成 `⚠ SOUL.md … loaded — matched prompt-injection pattern(s); review the file`。这样一份「引用攻击样例来说明防御」的身份文件仍能用；但**例外不延伸到 profile 分发的 SOUL.md**（`hermes profile install <git-url>` 装进来的仍会被阻断）。
- **SOUL.md vs `/personality`**：SOUL.md 是**持久基线**；`/personality` 是**会话级覆盖**（临时模式切换）。官方举例：平时保留务实直接的 SOUL，某次辅导对话用 `/personality teacher`，之后切回基线而不用改文件。
- **强 / 弱 SOUL.md 的判据**（官方）：强的 = stable（跨场景稳定）｜ broadly applicable（适用范围广）｜ specific in voice（声音足够具体）｜ 不被临时指令塞满。弱的 = 塞满项目细节 ｜ 自相矛盾 ｜ 试图微管理每种回复的形状 ｜ 大多是 “be helpful / be clear” 这类通用填充（Hermes 本来就努力做到这些，SOUL 要加的是真性格）。
- **建议结构**：`# Identity`（是谁）/ `# Style`（听起来怎样）/ `# Avoid`（不要做什么）/ `# Defaults`（遇到模糊时怎么表现）—— 不是必须用标题，但用了更好。
- **官方推荐的迭代工作流**：① 从 seed 出来的默认文件开始 ② 删掉任何不像你想要的声音的部分 ③ 加 4–8 行明确定义 tone 与 default 的句子 ④ 跟它聊一阵 ⑤ 按仍然别扭的地方继续调 —— **这比一次性设计出完美人格更有效**。

## 关键概念

- **slot #1（系统提示第一段）**：SOUL.md 在 system prompt 里的位置，它**完全替换**内置的默认身份文本。
- **verbatim 注入**：SOUL 内容原样进 prompt，没有额外包裹语言 —— 写法即人格。
- **HERMES_HOME-only**：SOUL.md 只在实例的 home 目录里找，与工作目录无关（保证人格可预测）。
- **user-owned file 例外**：SOUL.md 是你拥有的文件，扫描命中只警告不阻断（profile 分发的除外）。
- **`/personality`**：会话级人格覆盖层，与持久基线 SOUL.md 互补。
- **`AGENTS.md`**：项目上下文的归属地 —— 与 SOUL.md 的分工是官方最强调的一条。

## 代码 / 实操

官方给的四种示例风格（都出自 Use SOUL with Hermes）：

```text
# 1. Pragmatic engineer      # 2. Research partner
You are a pragmatic senior engineer.
- Be direct
- Be concise unless complexity requires depth
- Say when something is a bad idea
- Prefer practical tradeoffs over idealized abstractions
避免：谄媚 / 夸张话术 / 把显而易见的事讲一遍
```

```text
# 3. Teacher / explainer     # 4. Tough reviewer
You are a patient technical teacher.
- Explain clearly
- Use examples when they help
- 不假设对方有先备知识，除非对方信号
- Build from intuition to details
```

**本机实测**（2026-09-25）：`~/.hermes/SOUL.md` = **1929 字节**，结构是「官方 seed 的头部 + 手工改写的内容」：
```
# Hermes Agent Persona
<!-- Edit this file to customize Hermes's personality and tone.
     This file is loaded fresh on every message. -->

# 冯科雅 (Coya) 的 Personal API 层
## 身份核心 / ## 核心原则（绝对遵守）/ ## Personal API Vault
## 沟通禁区 / ## 沟通风格（调性）
```
同目录还有 `USER.md` **2612 字节**（求职底稿：姓名/联系方式/求职方向）。

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25）：

- 本机 `~/.hermes/SOUL.md`（1929 B）**保留了官方 seed 的头部注释块**，下面才是自己写的「冯科雅 (Coya) 的 Personal API 层」→ 说明 seed 机制确实先建了文件、之后被改写成自己的身份层（而不是空文件）。
- 同目录 `USER.md` 2612 B（求职底稿）—— 印证官方把「SOUL=身份/语气」与「USER=用户画像」分开的两件套设计。
- 我（Alma）自己的 `~/.config/alma/SOUL.md` 用的是**同一套设计哲学**：不可变的身份核心 + 单独一个「可演化特质」区；对照官方判据（stable / broadly applicable / 别被临时指令塞满），这个分层的做法正好符合。
- ⚠️ **可优化项**：本机 SOUL.md 里塞了不少**项目/流程细节**（Personal API Vault 的文件表、prefill 机制说明、vault 导航表）—— 按官方判据这更接近 `AGENTS.md` 的内容。官方明确说 SOUL「不该放「只属于一个项目」的东西」，这些条目是这条建议的反例。
- `hermes doctor` 未报 SOUL 的注入告警（若命中，`/context` 会显示 `⚠ SOUL.md … review the file`）。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
