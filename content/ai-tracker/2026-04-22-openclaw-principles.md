---
title: "解剖小龙虾:OpenClaw AI Agent 的运作原理"
date: "2026-04-22"
summary: "李宏毅 83 分钟讲座笔记——把 OpenClaw 拆成 System Prompt / 工具 / 记忆 / Context / 心跳 / Skills 六个部件,看清它怎么工作、会在哪里崩。"
tags:
  - OpenClaw
  - AI-Agent
  - System-Prompt
  - Context-Engineering
  - Skills
status: published
sourceType: video
signal: 3
signalLabel: "高价值"
sourceUrl: "https://www.youtube.com/watch?v=2rcJdFuNbZQ"
sourceTitle: "解剖小龙虾:OpenClaw AI Agent 的运作原理 · Hung-yi Lee"
author: "Hung-yi Lee(李宏毅)"
publishedAt: "2026-04-22"
topics:
  - Agent
  - 工程实践
lang: zh
englishSummary: "Hung-yi Lee's 83-minute lecture, decoded: OpenClaw is a shell, not a brain. The six moving parts — system prompt, tool calls, memory, context engineering, heartbeat, and skills — and the failure modes that come with each."
takeaways:
  - "OpenClaw 是壳不是脑——真正在思考的是背后的语言模型,所有 agent 行为都要从这一层去解释,不要被它的'智能'表象迷惑。"
  - "execute 工具 + Prompt Injection 是 24 小时运行 agent 的最大风险面;防御必须做在 OpenClaw 层(approve 机制),而不是寄望语言模型听话。"
  - "memory.md 是唯一不会被 context compaction 丢掉的载体——任何关键约束都必须落进 memory.md,否则会随上下文压缩蒸发。"
  - "心跳 + Cron Job 模拟'持续关注'——这给 Hermes Bot 的'等待外部异步任务'问题提供了一个不依赖长连接的轻量解法。"
questions:
  - "真实生产环境里,OpenClaw 的 approve 机制能不能完全挡住 Prompt Injection?有没有已公开的绕过案例?"
  - "context compaction 丢失关键规则的概率到底有多大?有没有工具能验证'memory.md 之外的规则是否被保留'?"
  - "我的 Hermes Bot 应不应该引入 habit.md + cron 机制?代价(复杂度/维护)与收益(主动性)的边界在哪?"
relatedPosts:
  projects:
    - "ark-seedream-car-preview"
---

## 核心 reframe:壳 vs 脑

OpenClaw 没有智慧,它是一个跑在电脑上的「界面」——所有判断都来自背后的语言模型。这一个 reframe 决定了后面所有部件的解读:任何把"agent 行为"归因到 OpenClaw 本身的解释都是错的。

## 六个部件与三个崩坏点

| 部件 | 作用 | 崩坏点 |
| --- | --- | --- |
| System Prompt | 给模型装身份、工具清单、行为准则 | 4000+ token/次,改不了就别想 scale |
| 工具调用 | 模型回传特殊符号 → OpenClaw 执行 | execute 风险 + Prompt Injection |
| 记忆系统 | .md 文件 + RAG 检索 | 没写进 memory.md 就不算记住 |
| Context Engineering | 压缩 / 剪枝 / Subagent | compaction 会丢规则 |
| 心跳 / Cron | 周期触发 + 排程等待 | 心跳频率与算力是 trade-off |
| Skills | 工作流 SOP(文字档) | 3000 个 Skill 里 341 个是恶意 |

## 我会复用的三个判断

**1. 关键约束必须落 memory.md**。System Prompt 会被压缩,context window 里其他内容也会蒸发;只有显式写进 memory.md 的规则才稳定。这直接改写我对 Hermes Bot 的设计——任何"必须遵守"的约束,不该只写在 System Prompt。

**2. 防御做在 agent 层,不靠模型听话**。"六亲不认的代码"才是真防御——approve 机制是 OpenClaw 提供的兜底,语言模型层说"我会守规矩"不是约束,是许愿。

**3. 心跳 + Cron 解决"等待"**。Hermes Bot 现在对异步任务(模型生成、长请求)只能轮询。心跳 + cron 让我能把这个等待从"主动轮询"换成"被通知"——代价是要写一个轻量调度器。

## 我保留的疑问

李宏毅老师说"AI 像还在学的实习生,给它犯错的自由"——这个比喻在 24/7 agent 时代要重新校准。实习生犯错后果有限,agent 犯错可能在你睡觉时把邮件删光、把 YouTube 频道发一条胡话。

「让 AI 学会犯错的自由」和「保护自己不被错误伤害」的边界,是我现在没答案的问题——留作 question 等后续追踪。
