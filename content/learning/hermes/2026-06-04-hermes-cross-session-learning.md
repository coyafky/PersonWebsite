---
title: "Hermes 的跨会话学习"
date: "2026-06-04"
summary: >-
  Hermes 跨会话学习的 4 层架构：Working Memory（当前会话）→ Curated Memory（MEMORY.md/USER.md 提炼事实）→ Session Search（SQLite + FTS5 全文检索）→ Skills/Playbooks（程序化经验沉淀）。包含完整工作流程图、用蓝辉轻改 GEO 项目 3 次会话举例，以及「记什么 / 怎么找回来 / 怎么注入当前任务」三个核心设计问题。
tags:
  - hermes
  - 跨会话学习
  - 记忆
  - Memory
  - Session Search
  - Skills
status: draft
lang: zh
topic: hermes
englishSummary: >-
  Hermes cross-session learning 4-layer architecture: Working Memory (current session) → Curated Memory (MEMORY.md/USER.md distilled facts) → Session Search (SQLite + FTS5 full-text retrieval) → Skills/Playbooks (procedural experience accumulation). Includes full workflow diagram, three-session example with 蓝辉轻改 GEO project, and three core design questions — what to remember / how to retrieve / how to inject into current task.
---

# Hermes 的跨会话学习

Hermes 的**跨会话学习**，本质上不是"模型自己变聪明了"，而是通过一套 **记忆系统 + 会话检索 + 技能沉淀 + 上下文注入** 来实现。

可以理解成 4 层：

---

## 1. 当前会话记忆：Working Memory

这是正在聊天时的上下文。

例如你今天说：

> 蓝辉轻改官网要做 GEO 友好
> 内容要围绕窗膜、车衣、改色膜、电动踏板、轮毂
> 目标是中国大陆本地生活搜索

Hermes 在当前会话里可以直接使用这些信息。

但如果只靠这一层，换一个会话就容易忘。

---

## 2. 长期记忆：Curated Memory

Hermes 会把重要信息写入长期记忆文件或记忆模块。

比如：

```md
User is building a GEO-friendly website for 蓝辉轻改.
Brand services include window film, PPF, color-change film, electric side steps, and wheels.
The website should emphasize local service, credibility, cases, FAQ, and AI-search-friendly content.
```

这类记忆不是完整聊天记录，而是**提炼后的重要事实**。

它的作用是：

下次你再开启新会话时，Agent 不需要你从头解释品牌背景。

---

## 3. 会话搜索：Session Search

长期记忆适合存"重要结论"，但它容量有限，不能把所有对话都存进去。

所以 Hermes 还会把过往会话存进数据库，例如 SQLite，然后用 FTS5 做全文检索。也就是说，它可以在过去聊天记录里搜索相关内容。

比如新会话里你说：

> 帮我继续上次那个 GEO 官网 Agent 的 Profile。

Hermes 可能会去搜索：

```txt
GEO 官网 Agent Profile
蓝辉轻改
Hermes Profile
Soul Agent.md
```

然后把找到的旧会话片段重新塞回当前上下文。

这就是"跨会话召回"。

---

## 4. 技能沉淀：Skills / Playbooks

真正高级的跨会话学习，不只是记住事实，而是把反复出现的做法沉淀成技能。

比如你多次让它做 GEO 项目，它会逐渐沉淀出：

```md
Skill: GEO Brand Baseline Testing

Steps:
1. Extract brand facts.
2. Build keyword matrix.
3. Generate natural user prompts.
4. Run AI-search sampling.
5. Record citations and domains.
6. Analyze visibility gaps.
7. Produce content improvement plan.
```

以后你再说：

> 给蓝辉轻改做 GEO 基线测试。

它不需要重新设计流程，而是调用这套 Skill。

这就像从"记得你说过什么"，升级成"学会你怎么做项目"。

---

# 它的实际工作流程

可以这样理解：

```text
用户发起新会话
   ↓
Hermes 识别任务意图
   ↓
读取 USER.md / MEMORY.md 等长期记忆
   ↓
根据关键词搜索历史会话数据库
   ↓
召回相关旧对话、项目状态、偏好、决策
   ↓
把这些内容注入当前 Prompt
   ↓
Agent 基于旧经验继续工作
   ↓
会话结束后，提炼新的事实、规则、技能
   ↓
写回 Memory / Skill / Session DB
```

它不是直接"训练模型参数"，而是通过 **RAG 式记忆召回** 来模拟学习。

---

# 用蓝辉轻改举例

第一次你说：

> 我们要做蓝辉轻改官网，目标是 GEO 友好。

Hermes 记录：

```md
Project: 蓝辉轻改 GEO 官网
Goal: 面向 AI 搜索、传统搜索、本地生活转化
Services: 车膜、车衣、改色膜、电动踏板、轮毂
Tone: 专业、可信、实体门店感
```

第二次你说：

> 继续做官网首页。

Hermes 就应该知道：

首页不能只是"漂亮页面"，还要包含：
品牌事实
服务项目
城市/门店信息
案例证据
FAQ
结构化数据
AI 可引用内容块
本地服务信任信号

第三次你说：

> 搭建一个前端 Agent。

它就会把前两次经验转成 Agent Profile / Soul / Skills / Output Contract。

这就是跨会话学习。

---

# Hermes 跨会话学习的核心不是"记忆越多越好"

关键是三件事：

## 1. 记什么

不是所有聊天都要存。

应该存：
品牌事实
项目目标
用户偏好
长期规则
流程方法
重要决策
可复用模板
踩坑经验

不该存：
临时想法
一次性闲聊
已经过期的信息
没有价值的中间过程

## 2. 怎么找回来

只存不检索没有意义。

所以需要：
关键词搜索
向量搜索
时间检索
项目标签
用户标签
文件标签
任务标签

例如：

```txt
project: 蓝辉轻改
topic: GEO 官网
type: decision
date: recent
```

这样 Agent 才能精准找回旧信息。

## 3. 怎么注入当前任务

召回的信息不能一股脑塞进 Prompt。

更好的方式是：

```xml
<memory-context>
用户正在做蓝辉轻改 × 有膜有漾项目。
当前重点是 GEO 友好官网与本地生活内容工程。
之前确定服务包括窗膜、车衣、改色膜、电动踏板、轮毂。
用户偏好用 Agent 工作流、Profile、Soul、Skills 的方式组织项目。
</memory-context>
```

这样模型能快速理解背景，又不会被大量旧聊天干扰。

---

# 一句话总结

Hermes 的跨会话学习，本质是：

> 把每次会话中的重要事实、决策、流程和技能沉淀下来；
> 下次任务开始时，通过记忆文件、数据库检索和上下文注入重新召回；
> 让 Agent 看起来像"记得过去、理解项目、持续成长"。

更直白地说：

**它不是在训练大模型，而是在给 Agent 建一个"项目大脑"。**
