---
title: "P25 25_能力篇_外置记忆提供商"
date: "2026-09-24"
summary: >-
  P25 · 25_能力篇_外置记忆提供商（6:05）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P25"
series: "shangguigu-hermes"
seriesOrder: 25
---

## 课时概要

能力篇 · 外置记忆提供商。除内置持久记忆外，Hermes 支持外置记忆 provider（如 Honcho），官方 README 提到 **Honcho dialectic user modeling**，文档还有独立的 Memory providers 页。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档（Memory / Memory providers / Honcho 三页）与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[25_能力篇_外置记忆提供商](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=25) ｜ 时长 6:05 ｜ P25

## 本节要点

- **外置记忆提供商是「叠加」而非「替换」**（官方原文）：内置 memory（MEMORY.md / USER.md）继续**完全照旧工作**，外置 provider 只是附加。
- **三种启用方式**：`hermes memory setup`（交互式 picker + 配置）｜ `hermes plugins` → Provider Plugins → Memory Provider ｜ 手动改 `~/.hermes/config.yaml` 的 `memory.provider: <名字>`。配套命令：`hermes memory status`（看当前激活的是什么）/ `hermes memory off`（关掉外置）。
- **provider 激活后 Hermes 自动做六件事**：① 把 provider 上下文（它知道的关于你的东西）注入 system prompt ② **每轮回答前预取相关记忆**（后台、非阻塞）③ 每轮回答后把对话同步给 provider ④ 会话结束时抽取记忆（provider 支持的话）⑤ **把内置记忆的写入镜像到外置** ⑥ 加上 provider 专属工具（让 agent 能搜索/存储/管理记忆）。
- **可选 provider**（官方页）：**Honcho**（AI 原生跨会话用户建模 + 辩证推理）｜**OpenViking** ｜**Mem0** ｜**Hindsight**（在 plugin catalog，需先 `hermes plugins install hindsight`）｜**Holographic** ｜**RetainDB** ｜**ByteRover** ｜**Supermemory**。配置形态以 env key 为主（如 `OPENVIKING_API_KEY` + `OPENVIKING_ACCOUNT` / `OPENVIKING_USER`；Supermemory 需 API key；ByteRover 要先装它的 CLI）。
- **Honcho 是官方写得最深的一个**（独立专页）。它带来的是**辩证推理（dialectic reasoning）**：每轮对话之后（受 `dialecticCadence` 门控）分析这次交流，**推导出关于用户偏好、习惯、目标的洞察并累积** —— 得到的是**超出用户明说内容**的理解，而不是照抄用户原话。
- **Honcho 的两层上下文注入**：**base 层**（会话摘要 + 用户表征 + peer card + AI 自我表征 + AI 身份卡，按 `contextCadence` 刷新）= 「这个用户是谁」｜**dialectic 补充层**（LLM 合成的、关于用户当下状态与需求的推理，按 `dialecticCadence` 刷新）= 「此刻什么重要」。两层拼起来后按 `contextTokens` 预算截断。
- **冷 / 暖提示自动选择**：还没有 base 上下文时走 **cold start**（问「这个人是谁？他的偏好、目标、工作方式？」）；有 base 上下文时走 **warm**（问「鉴于本次会话已经讨论的内容，哪些关于这个用户的上下文最相关？」）。**自动切换**，不需要你配。
- **Honcho 的三个正交旋钮**（成本与深度独立控制）：`contextCadence`（base 层刷新间隔，默认 **1** 轮）｜`dialecticCadence`（dialectic 的 LLM 调用间隔，默认 **2**，官方推荐 1–5）｜`dialecticDepth`（每次 dialectic 跑几个 `.chat()` pass，**1–3**，默认 1）。官方举例：`contextCadence: 1, dialecticCadence: 5, dialecticDepth: 2` = 每轮刷 base、每 5 轮跑一次 dialectic、每次两遍推理。
- **多 agent profile 隔离**：当多个 Hermes 实例服务同一个用户（比如一个编码助手 + 一个私人助手），Honcho 为**每个实例维护独立的 peer 档案**，各 peer 只看到自己的观察与结论 → **防止上下文串味**。
- **Honcho 的 5 个工具**：`honcho_profile`（读/更新 peer card）｜`honcho_search`（语义搜索）｜`honcho_context`（会话上下文：摘要 / 表征 / card / 消息）｜`honcho_reasoning`（LLM 合成的推理）｜`honcho_conclude`（创建 / 删除结论）。
- **内置 vs Honcho 对照**（官方表）：跨会话持久 = 文件 vs 服务端 API ｜ 用户画像 = 手工策展 vs **自动辩证推理** ｜ 会话摘要 = 无 vs **有（会话范围上下文注入）** ｜ 多 agent 隔离 = 无 vs **per-peer** ｜ 观察模式 = 无 vs **unified / directional** ｜ 派生结论 = 无 vs **服务端推理** ｜ 历史检索 = FTS5 全文 vs **对结论的语义搜索**。
- **Honcho 的前置**：`pip install honcho-ai` + API key（honcho.dev）或**自建实例**（数据落在 Honcho Cloud 或你自己的机器上）。

## 关键概念

- **外置记忆提供商**：通过 `memory.provider` 接入的第三方记忆后端，与内置两文件**叠加**共存。
- **预取（prefetch）**：每轮回答前在后台非阻塞地取回相关记忆。
- **镜像写入**：内置 MEMORY.md/USER.md 的写入会同步到外置 provider。
- **辩证推理（dialectic reasoning）**：Honcho 对每轮交流做推理、累积关于用户的洞察（而非照抄原话）。
- **peer**：Honcho 里每个 agent 实例独立的一份用户档案（多 agent 隔离的基础）。
- **两层上下文**：base（我是谁对面的这个人）+ dialectic（此刻什么重要）。
- **三个 cadence 旋钮**：`contextCadence` / `dialecticCadence` / `dialecticDepth` —— 独立控制 API 调用频率、LLM 调用频率与推理深度。
- **冷 / 暖提示**：无 base 上下文用 cold、有 base 用 warm，自动选择。

## 代码 / 实操

```bash
hermes memory setup      # 交互式：选 provider + 配置
hermes memory status     # 当前激活的是谁
hermes memory off        # 关掉外置 provider
# 或者：hermes plugins → Provider Plugins → Memory Provider
```

```yaml
# ~/.hermes/config.yaml（官方原文）
memory:
  provider: openviking   # honcho | mem0 | holographic | retaindb | byterover | supermemory
                         # | hindsight（需先 hermes plugins install hindsight）
```

```bash
# Honcho 的前置与启用（官方原文）
hermes memory setup                 # 在 provider 列表里选 honcho
# 或手动：config.yaml 写 memory.provider: honcho
echo 'HONCHO_API_KEY=***' >> ~/.hermes/.env
```

Honcho 三个旋钮的实战组合（官方示例）：
```yaml
# contextCadence: 1  → 每轮刷新 base 层
# dialecticCadence: 5 → 每 5 轮跑一次 dialectic LLM
# dialecticDepth: 2   → 每次 dialectic 跑 2 个 pass
```

**本机实测**（2026-09-25）`hermes memory status`：
```
Built-in (MEMORY.md / USER.md):
  Memory injection:   enabled ✓
  User profile:       enabled ✓
  Memory tool:        enabled ✓
Provider:  (none — built-in only)
Installed plugins:
  byterover ｜ holographic ｜ honcho ｜ mem0 ｜ memtensor ｜ openviking ｜ retaindb ｜ supermemory
```

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25）：

- 本机实测 Provider = **(none — built-in only)** → 目前**纯内置记忆模式**，外置那一套装好了但没开。
- **已装 8 个 provider 插件**：byterover / holographic / honcho / mem0 / **memtensor** / openviking / retaindb / supermemory —— 也就是说 `hermes memory setup` 里能直接选的比官方文档注释里列的多一个（文档列的是 honcho/openviking/mem0/holographic/retaindb/byterover/supermemory/hindsight）。
- **`hindsight` 确实不在**已装列表里 —— 实测印证官方那句「需先 `hermes plugins install hindsight`」。
- **`honcho-ai` Python 包本机未安装**（`import honcho_ai` 直接 ImportError）→ 正好印证官方 Honcho 的前置「`pip install honcho-ai` + API key 或自建实例」。想启用 Honcho 得先补这一步。
- config 里 `memory.provider: ''`（空字符串）与 status 显示 none 一致 —— 也就是说「关掉外置」在本机的表现就是 provider 留空。
- 💡 对本机的一个判断：内置记忆 **2,200 + 1,375 字符**的预算对小规模偏好够用，但**跨会话「越来越懂你」这类需求**（自动推理、语义搜索、多 agent 隔离）内置层给不了 —— 这正是本机已预装 8 个 provider 插件的意义，缺的只是选一个 + 配 key。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
