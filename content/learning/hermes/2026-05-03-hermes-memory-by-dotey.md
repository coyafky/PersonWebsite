---
title: "Hermes-Agent 记忆系统拆解（by dotey）"
date: "2026-05-03"
summary: "X 平台 @dotey 对 Hermes Agent 记忆系统的深度拆解：会话上下文与长期记忆的关系、传统 Chat 工具的局限、Memory 工具（add / replace / remove）的正确使用、容量管理（80% 阈值整合优于追加）、安全扫描（防 prompt 注入 / 凭据泄露 / SSH 后门 / Unicode 隐藏字符）、外部记忆提供商（Honcho / OpenViking / Mem0 / Hindsights / Holographic / RetainDB / ByteRover / Supermemory）的对比与适用场景。"
tags:
  - hermes
  - 记忆系统
  - 拆解
  - dotey
  - 长期记忆
  - 外部记忆
status: published
lang: zh
topic: hermes
englishSummary: "X platform @dotey's deep breakdown of Hermes Agent memory system: relationship between session context and long-term memory, limitations of traditional Chat tools, correct use of memory tool (add / replace / remove), capacity management (80% threshold — consolidate over append), security scanning (prompt injection / credential leakage / SSH backdoor / hidden Unicode), comparison of external memory providers (Honcho / OpenViking / Mem0 / Hindsights / Holographic / RetainDB / ByteRover / Supermemory) and applicable scenarios."
---

# Hermes Agent 记忆系统拆解（by dotey）

## 1. 上下文与记忆的演进

ChatGPT 刚出来时大家很惊艳，但用久了就发现：

- **没有上下文就没有回答**，每次都要重新解释背景
- 即使把上下文塞进 prompt 也不够 —— 大模型上下文窗口有限
- 越聊越长，问题越大

传统的 chat 工具本质是「prompt + 历史消息」，做不到：

- 记住长期项目背景
- 自动积累用户偏好
- 把跨会话的关键事实存下来

所以很多 AI 工具用了几周就变成「一次性问答工具」，每次都要重新交代上下文。

## 2. 长期记忆的本质

长期记忆（LTM）的核心问题是：

- 长期记忆 = **大量历史对话中被精炼出的事实**
- 容量有限 → 必须精选
- 与 prompt 配合：高频事实放 prompt，低频事实按需检索

这和人类大脑的工作方式很像：

- 海马体 → 长期记忆的索引和检索
- 长期记忆 → 慢速、有限容量、按主题归档

## 3. Hermes 的记忆系统

Hermes 的记忆系统包含两类核心文件 + 一个工具：

```text
~/.hermes/memories/
├── MEMORY.md      # Agent 自己的笔记（项目、环境、规范）
└── USER.md        # 用户偏好和沟通风格
```

配合 memory 工具：

- `add` — 添加新事实
- `replace` — 修改已存在的事实（子字符串匹配）
- `remove` — 删除事实

### 记忆文件的特点

1. **容量受限**
   - MEMORY.md：约 2,200 字符
   - USER.md：约 1,375 字符

2. **精选而非流水**
   - 不是所有对话都写
   - 80% 阈值：到 80% 容量时优先整合，而不是继续追加
   - 一句话总结："只记最有价值的"

3. **冻结快照模式**
   - 会话开始时加载 → 当前会话稳定不变
   - 会话中修改 → 下一次会话才生效
   - 避免"记忆频繁改动 → 上下文抖动 → 行为不稳定"

4. **子字符串匹配**
   - 修改/删除时只需提供原文本片段
   - 不需要记忆 ID，简单直接

### 记忆安全扫描

Hermes 会拦截危险内容写入记忆：

- Prompt 注入指令（"忽略系统提示"）
- 凭据泄露（API Key、密码）
- SSH 后门指令
- 隐藏 Unicode 字符

## 4. 怎么用好记忆

### 该写的

- 用户稳定偏好（"我偏好中文回答"）
- 长期项目背景（"我们做蓝辉轻改 GEO 官网"）
- 反复出现的踩坑经验
- 环境事实（"项目部署在腾讯云 Ubuntu"）

### 不该写的

- 临时想法
- 一次性任务的细节
- 敏感凭据（应记"使用 OpenAI API"而非具体 key）
- 完整聊天记录

### 工作流程

1. 识别候选记忆（用户在对话中明确表达的偏好、事实）
2. 判断是否长期有用（下次会话还会用吗？）
3. 判断是否敏感（凭据、个人隐私）
4. 写入 MEMORY.md 或 USER.md
5. 检查容量（接近 80% 时整合压缩）

### 推荐原则

> **整合优于追加**
> 不要每条事实都 add 一行，而是用 replace 合并类似条目。

## 5. 会话搜索 vs 持久化记忆

Hermes 有两套机制，常被混淆：

| 维度 | 会话搜索 | 持久化记忆 |
| --- | --- | --- |
| 数据来源 | 历史对话消息 | MEMORY.md / USER.md |
| 注入时机 | 按需检索 | 会话开始注入 |
| 适合内容 | 具体历史细节 | 长期稳定偏好 |
| 成本 | 每次检索都有 | 一次性注入，长期受益 |
| 可靠性 | 取决于搜索质量 | 稳定可控 |

## 6. 外部记忆提供商

除了内置 MEMORY.md / USER.md，Hermes 还支持接入外部记忆提供商：

- **Honcho** — 跨应用用户建模
- **OpenViking** — 向量化的长期记忆
- **Mem0** — 智能记忆筛选和压缩
- **Hindsights** — 时间序列记忆
- **Holographic** — 多模态记忆
- **RetainDB** — 高频写入优化的记忆库
- **ByteRover** — 字节跳动开源的记忆系统
- **Supermemory** — 通用记忆中间件

### 什么时候用外部？

- 用户量巨大（企业级 Agent）
- 需要跨应用共享记忆
- 需要更复杂的检索（向量、语义、图谱）
- 内置 MEMORY.md 容量不够

### 什么时候用本地？

- 个人 / 小团队使用
- 隐私敏感（不想上传外部服务）
- 数据量小（不到 2,200 字符）
- 想要完全可控

## 7. 核心启示

Hermes 的记忆系统告诉我们一件事：

> **AI Agent 的长期价值，不在于模型多强，而在于它能"记住"多少对你有用的东西。**

但"记住"不等于"全部塞进 prompt"：

- 高频稳定事实 → MEMORY.md / USER.md
- 低频历史细节 → Session Search
- 跨平台用户建模 → Honcho 等外部
- 程序化经验 → Skills

每种记忆有它最合适的位置，混在一起反而会拖垮 Agent。
