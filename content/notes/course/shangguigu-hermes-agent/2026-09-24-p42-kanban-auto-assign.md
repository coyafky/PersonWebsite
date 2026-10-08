---
title: "P42 42_协作篇_Kanban任务一键分配"
date: "2026-09-24"
summary: >-
  P42 · 42_协作篇_Kanban任务一键分配（9:03）
status: published
tags:
  - "Hermes"
  - "Kanban"
lang: zh
chapter: "P42"
series: "shangguigu-hermes"
seriesOrder: 42
---

## 课时概要

协作篇 · Kanban 任务一键分配。Kanban 能把任务分配给空闲 worker / 子代理执行，仓库有停止与编排实现。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档（Delegation 页 / Kanban 页 / Kanban tutorial / Kanban worker lanes / Kanban multi-gateway / Delegation patterns 六页）与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑/实读得到的真实状态。

**视频**：[42_协作篇_Kanban任务一键分配](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=42) ｜ 时长 9:03 ｜ P42

## 本节要点

- ⭐ **「一键分配」的官方名字叫 Orchestration（编排），而且有 Auto / Manual 两种模式** —— 决定的是：**你丢进 Triage 列的一张卡，是怎么被拆开并派给专家的**。
- **Auto（默认）**：`kanban.auto_decompose: true` → **gateway 内嵌的 dispatcher 每个 tick 对落在 triage 的任务跑一次 decomposer**，并被 `kanban.auto_decompose_per_tick`（**默认每 tick 3 个任务**）封顶 —— 这样**一次批量倒入的 triage 任务不会爆发式烧掉辅助 LLM**。
  · decomposer 用内置的分解提示词 + **`auxiliary.kanban_decomposer`** 模型路径，**读取你安装的 profile 与它们的描述**，然后让 LLM 产出一个 **JSON 任务图**：要 spawn 哪些任务、各给谁、以及谁依赖谁。
  · ⭐ **原来那张 triage 任务成为图里每个叶子的父**，所以它**一直活着直到整张图完成** —— 然后**被提升回 `ready`**，好让它的 assignee（**`kanban.orchestrator_profile`，否则任务本来就有的 assignee，否则活动的 default profile**）**来判断是否完成、以及在活没干完时再加任务**。
  · 官方对这套流程的定位很直白：**这是那种「丢一句一句话、然后走开」的流程（the drop-a-one-liner, walk away flow）**。
- **Manual**：`kanban.auto_decompose: false` → triage 任务**就待在 triage 直到你动手**：点卡上的 **⚗ Decompose** 按钮、跑 `hermes kanban decompose <id>`（或 `--all`）、或从聊天里用 `/kanban decompose <id>`。这对应 decomposer 出现之前的行为，**适合你想完全控制什么在什么时候跑**。
- ⚠️ **Manual 模式的重要边界（官方专门澄清）**：Manual **只关掉内置的 Triage decomposer**。它**不阻止**一个 profile 调用 `kanban_create`，**也不禁用创建者会话的唤醒**。配合 `kanban.auto_subscribe_on_create: true`（默认），一个任务的**终态事件会用一个合成的状态轮次唤醒发起它的 agent**，好让它检查交接、决定是否真的需要新的后续工作。**要让任务完成保持被动，就设 `auto_subscribe_on_create: false`。**
  · 溯源信息：**内置 decomposer 产出的子任务 `created_by=auto-decomposer`**；被唤醒的 profile 创建的任务则带那个 profile 的名字。
- ⭐⭐ **decomposer 的路由质量取决于 profile 描述（这是「一键分配」能不能分准的关键）**：官方原话 —— **分解器的路由决策依赖 profile 描述**，那是一个 per-profile 的标注原语，用这几条设置：`hermes profile create --description "..."` ｜ `hermes profile describe <name> --text "..."` ｜ **`hermes profile describe <name> --auto`（从该 profile 已安装的技能 + 模型由 LLM 生成）** ｜ 或仪表盘里展开的 Orchestration 设置面板里的 per-profile 编辑器。
  · ⚠️ **没有描述的 profile 仍会出现在名单里** —— 它们**可以按名字被路由，只是不够精确**。
  · ⭐ **decomposer 永远不会让一个子任务落在 `assignee=None`**：当 LLM 挑了一个不存在的 profile 时，子任务会被路由到 **`kanban.default_assignee`**，否则回落到**根任务的 assignee**（若它指向一个存在的 profile），否则回落到**活动的 default profile**。
- ⚠️ **一个容易误解的点**：`kanban.orchestrator_profile` **不会把那个 profile 的 prompt、技能或自定义逻辑加载进分解调用**。它控制的是**fan out 之后谁拥有那张根/编排任务**。要改 decomposer 的模型/provider 就配 **`auxiliary.kanban_decomposer`**；**要用某个 profile 自己的自定义拆任务逻辑**（而不是内置 decomposer），就切到 **Manual 模式**、由那个 profile 显式创建或分解任务。
- **配置旋钮全表**（都在 `~/.hermes/config.yaml` 的 `kanban:` 下）：
  · **`auto_decompose`**（默认 **true**）：dispatcher 每 tick 对 Triage 任务跑内置 decomposer。⚠️ **它不门控 profile 驱动的 `kanban_create` 调用，也不门控创建者唤醒轮次**。
  · **`auto_decompose_per_tick`**（默认 **3**）：每 tick 分解数上限，超出的延到下一个 tick。
  · **`orchestrator_profile`**（默认 `""`）：分解后分配给根/编排任务的 profile。空 = 根任务保留自己的 assignee，否则用活动的 default profile。
  · **`default_assignee`**（默认 `""`）：LLM 挑到未知 profile 时子任务的落点。空 = 回落到根任务的 assignee，否则活动 default。
  · **`auto_subscribe_on_create`**（默认 **true**）：当 `kanban_create` 在一个持久的 gateway/TUI 会话里跑时，终态事件会用一个合成的状态轮次唤醒发起它的 agent。设 false = 被动完成，或要求显式 `kanban_notify-subscribe`。**独立于 `auto_decompose`。**
  · **`notify_in_gateway`**（默认 **true**）：从这个 gateway 轮询并投递 Kanban 订阅。**在没有通知订阅的 profile 上设 false，可以停掉那个空闲的 5 秒轮询。独立于 `dispatch_in_gateway`** —— 非 dispatch 的 gateway 仍可能拥有自己 profile 的投递适配器。
  · **`done_sub_retention_days`**（默认 **30**）：通知订阅**能活过 `done`**（重开安全），在 `archived` 时被移除。notifier 的 GC 会清掉那些任务已 `done` 或 `blocked` 且**这么多天没有新事件**的订阅 —— 给那些永不归档的板封住订阅表的增长。**`0` 关闭这个清扫。**
  · 两个辅助 LLM 槽：**`auxiliary.kanban_decomposer`**（产生任务图的模型）与 **`auxiliary.profile_describer`**（`hermes profile describe --auto` 用的模型）。
- **另外一个「一键」：批量操作**。仪表盘上 **shift/ctrl 点卡或勾复选框** 加入选择 → 顶部弹**批量操作条**，含 **批量状态转换、归档、以及按 profile 下拉重新分配（或 unassign）**；破坏性批次先确认；⭐ **per-id 的部分失败会被报告而不中止其余**。
  · CLI 侧也有对应能力：**所有生命周期动词都接受多个 id**，例如 `hermes kanban complete t_abc t_def t_hij --result "batch wrap"`。
- **还有第三种「一键」：Goal-mode 卡片（`--goal`）** —— 官方文档有专节（`Goal-mode cards`），给的是「用目标而不是步骤来描述一张卡」的形态；配合 decomposer 就是「写一句目标、让它自己拆」。
- **Per-task 模型覆盖（官方专节）**：可以把某张卡的 worker 钉到特定模型（可选 provider），**独立于该 assignee profile 的默认** —— 这正是 P38 里提到的那个关键差异：**`delegate_task` 的模型 pin 是全局的、没有 per-task 覆盖，而 kanban 板支持 per-task 覆盖**。
  · 与它配对的还有官方的 **成本策略：前沿模型做编排者、便宜模型做 worker**（`Cost strategy: frontier orchestrator, inexpensive workers` 专节）。
- **成本与节流（官方给的几个防爆点）**：`auto_decompose_per_tick` 默认 3（防一次倒入爆烧）；`dispatch_stale_timeout_seconds` 默认 4h（防僵尸 worker 占卡）；`failure_limit` 默认 2（防对坏任务捶打）；`_PROTOCOL_VIOLATION_FAILURE_LIMIT` 默认 3（防「只叙述不交卡」反复重 spawn）。**每个都是「不让小错变成大钱」的那种上限。**

## 关键概念

- **Orchestration：Auto / Manual**：谁决定 triage 卡怎么被拆开派给专家。
- **decomposer**：读 profile 名单 + 描述，产出 JSON 任务图的 LLM（`auxiliary.kanban_decomposer`）。
- **根任务即编排者**：原 triage 卡成为所有叶子的父，全部完成后回到 `ready` 让编排者判断。
- **`⚗ Decompose` / `✨ Specify`**：仪表盘上 Triage 卡的两颗 LLM 按钮（也可 CLI / API / 聊天）。
- **profile 描述 = 路由质量**：`--description` / `describe --text` / `describe --auto`。
- **`default_assignee` 兜底**：decomposer 永不让子任务 `assignee=None`。
- **`auto_subscribe_on_create`**：终态事件是否用合成状态轮次唤醒创建者。
- **批量操作**：批量状态转换 / 归档 / 按 profile 重新分配。
- **per-task 模型覆盖**：kanban 有、`delegate_task` 没有。
- **节流四上限**：`auto_decompose_per_tick` / `dispatch_stale_timeout_seconds` / `failure_limit` / `_PROTOCOL_VIOLATION_FAILURE_LIMIT`。

## 代码 / 实操

```yaml
# ~/.hermes/config.yaml —— 一键分配的全部旋钮（官方原文）
kanban:
  auto_decompose: true            # 默认：dispatcher 每 tick 对 Triage 任务跑内置 decomposer
  auto_decompose_per_tick: 3      # 每 tick 分解数上限，超出延到下一个 tick
  orchestrator_profile: ""        # 分解后分配给根/编排任务的 profile；空 = 沿用原 assignee
  default_assignee: ""            # LLM 挑到未知 profile 时子任务的落点
  auto_subscribe_on_create: true  # 终态事件唤醒创建者 agent（设 false = 被动完成）
  notify_in_gateway: true         # 从本 gateway 轮询并投递订阅
  done_sub_retention_days: 30     # 订阅能活过 done；到期无事件则被 GC（0 = 关闭）

auxiliary:
  kanban_decomposer:              # 产生任务图的模型
    provider: auto
    model: ""
    timeout: 180
  profile_describer:              # hermes profile describe --auto 用的模型
    provider: auto
```

```bash
# 让 profile 描述准确（= 让一键分配分得准）
hermes profile create researcher --description "Reads source code and external docs, writes findings."
hermes profile describe researcher --text "…"
hermes profile describe researcher --auto    # 从已装技能 + 模型让 LLM 生成

# Manual 模式下手动触发分解
hermes kanban decompose <id>          # 单张
hermes kanban decompose --all         # 全部 Triage
hermes kanban specify <id>            # 只做单任务 spec 改写，不 fan out

# 批量（CLI 侧的一键）
hermes kanban complete t_abc t_def t_hij --result "batch wrap"
```

**本机实测**（2026-09-25，`config.yaml` 的 `kanban:` 段落）：
```yaml
kanban:
  auto_decompose: false          # ⚠️ 本机是 Manual 模式（官方默认是 true）
  auto_decompose_per_tick: 3     # = 官方默认
  default_assignee: ''           # 兜底未设
  dispatch_in_gateway: true      # = 官方默认
  dispatch_interval_seconds: 60  # = 官方默认
  dispatch_stale_timeout_seconds: 14400   # = 官方默认（4 小时）
  failure_limit: 2               # = 官方默认
  orchestrator_profile: ''       # 编排者未指定 → 沿用原 assignee
  worker_log_backup_count: 1
  worker_log_rotate_bytes: 2097152

auxiliary.kanban_decomposer: { provider: auto, timeout: 180 }   # 模型继承主模型
```

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25）：

- ⭐ **本机的 Orchestration 是 Manual 模式**：`config.yaml` 实录 **`auto_decompose: false`**（官方默认是 `true`）。所以本机**不会**自动把 triage 卡拆成任务图 —— 要拆得手动 `hermes kanban decompose <id>` 或点仪表盘那颗 ⚗ 按钮。这与本机那次真实执行的形态吻合：**三张卡都是人直接建、直接指定 assignee 的（`dev` / `researcher`），不是被 decomposer 拆出来的**。
- 📌 **本机 `auxiliary.kanban_decomposer` 存在但 `model: ''` + `provider: auto`** → 按官方说明这表示**分解用的模型继承主模型**。也就是说**本机其实已经把 decomposer 的槽位配好了**，只要把 `auto_decompose` 打开（或手动触发一次 decompose），这套「一句话目标 → 自动拆成专家任务图」的能力**立刻可用**。
- ⚠️ **本机 `orchestrator_profile: ''` 与 `default_assignee: ''` 都是空** → 按官方语义：编排者**回落到根任务自己的 assignee**（否则活动 default profile）；而 decomposer 挑到未知 profile 时**也回落到根任务的 assignee**。**两个都空意味着「兜底靠根任务」** —— 在只有一个 `default` profile 的本机上，这会让所有路由最终都指向 default（因为没有别的 profile 可路由）。
- 💡 **这条解释了一个本机现象**：本机现在 `~/.hermes/profiles/` 下**只剩 `default` 一个 profile**（09-24 瘦身后）—— 而 kanban 的 assignee **必须是一个 profile 名**。所以**本机此刻的 kanban 派发能力实际上是空的**（没有 `dev`、没有 `researcher` 可 spawn）。那次 6 月的成功执行发生在本地还有多个 profile 的时期；**要重新用 kanban，得先在本地重建 worker profile**（`hermes profile create dev --description "..."` 之类），否则卡片会停在 `ready` 并被 `failure_limit` 自动 block。
- ⭐ **官方给了一个能立刻用上的验证命令**：新增 profile 后跑 **`hermes profile describe <name> --auto`**（用 `auxiliary.profile_describer` 从已装技能+模型自动生成描述）—— 描述直接决定 decomposer 的路由精度。本机 `auxiliary.profile_describer` 槽也已存在（官方配置块里有），属于「配好待用」状态。
- 📌 **本机的节流参数全是官方默认**（`auto_decompose_per_tick: 3`、`failure_limit: 2`、`dispatch_stale_timeout_seconds: 14400`、`dispatch_interval_seconds: 60`），只有 `auto_decompose` 被显式关了、以及多了两个日志滚动键（`worker_log_backup_count: 1` / `worker_log_rotate_bytes: 2097152`）→ 说明**本机当初是有意识地选了 Manual**，而不是没配过。
- 💡 一条给以后自己的提醒：官方说 Manual 模式**只关内置 Triage decomposer**，**不阻止 profile 调 `kanban_create`**，也**不禁用创建者唤醒**（`auto_subscribe_on_create` 仍默认 true）。所以本机就算保持 Manual，**一个 profile 仍然可以自己 fan out 出子任务、并且任务终态仍会唤醒发起它的会话** —— 这跟「一键分配」是两条不同的路径。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
