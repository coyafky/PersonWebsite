---
title: "P40 40_协作篇_Kanban核心概念介绍"
date: "2026-09-24"
summary: >-
  P40 · 40_协作篇_Kanban核心概念介绍（8:25）
status: published
tags:
  - "Hermes"
  - "Kanban"
lang: zh
chapter: "P40"
series: "shangguigu-hermes"
seriesOrder: 40
---

## 课时概要

协作篇 · Kanban 核心概念介绍。官方文档有 **Kanban tutorial** 教程页与 **Kanban worker lanes**（worker 泳道）页。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档（Delegation 页 / Kanban 页 / Kanban tutorial / Kanban worker lanes / Kanban multi-gateway / Delegation patterns 六页）与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑/实读得到的真实状态。

**视频**：[40_协作篇_Kanban核心概念介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=40) ｜ 时长 8:25 ｜ P40

## 本节要点

- 初始概念：**每个做 kanban 任务的 profile 都自动获得「worker 生命周期」** —— 它在 spawn 时被注入 worker 的 system prompt（就是那个 **`KANBAN_GUIDANCE`** 块），**没有任何要安装或配置的东西**。它教 worker 用**工具调用**走完整条生命周期，而不是 CLI 命令。
- **worker 生命周期的四步**（官方原文顺序）：① spawn 时调 **`kanban_show()`** 读标题 + body + 父的交接 + 先前的尝试 + 整条评论线程 ② 通过 terminal 工具 **`cd $HERMES_KANBAN_WORKSPACE`** 并在那里干活 ③ 长操作期间每几分钟调 **`kanban_heartbeat(note="...")`** —— ⚠️ **如果你的活可能跑超过 1 小时，至少要每小时调一次 heartbeat** ④ 以 `kanban_complete(summary=..., metadata={...})` / `kanban_request_review(summary=...)` / `kanban_block(reason=...)` 收尾。
- ⭐ **为什么心跳这么要紧（reclaim 机制）**：**dispatcher 会回收那些运行超过 `kanban.dispatch_stale_timeout_seconds`（默认 4 小时）且最后一小时内没有心跳的任务** —— 它的假设是 **worker 崩了但没清理干净**。⚠️ 官方明说 **reclaim 本身是良性的**（任务回到 `ready` 等待重新派发，**并且不计一次失败计数**），但**你当前这一轮的进展会丢**。
- **普通工具活动也会自动延长认领**：worker 会把自己的进程内存活状态**大约每分钟**镜像到板上。⚠️ 但**这座桥只对 dispatcher 自己 spawn 的进程有效**：一个同时带着 `HERMES_DELEGATED_CHILD_CONTEXT` 和 `HERMES_KANBAN_TASK` 的进程（= `delegate_task` 的后代，或手工用 worker 环境启动的副本）**被隔离在板之外** —— 它的自动心跳会记一条 `kanban auto-heartbeat for task … refused` 警告，且 `kanban_complete` / `kanban_request_review` **都会被拒**。**修法是修启动方式**（让 dispatcher 去 spawn worker），**而不是把那个标记导出掉**。
- **worker 用的 12 个工具**（官方表格，读改板直接走 Python `kanban_db` 层，与 CLI 同源）：
  · **`kanban_show`** —— 读当前任务（标题、body、先前尝试、父的交接、评论、**预格式好的完整 `worker_context`**）；默认用环境里的 task id
  · **`kanban_list`**（编排者）—— 按 assignee / status / tenant / 归档可见性 / limit 列任务摘要
  · **`kanban_complete`** —— 以 `summary` + `metadata` 做结构化收尾（至少给 summary 或 result 之一）
  · **`kanban_request_review`** —— 开始**同卡评审**，带耐久 `summary` + 可选 `metadata` + 可选 reviewer profile；任务进入 `review`（**这不是 block**）
  · **`kanban_request_changes`** —— 评审者的裁决；关闭那次评审 run、重新施加父门控、把任务**路由回它原来的实现者**，且**不走 block 循环记账**
  · **`kanban_block`** —— 停手并**按原因路由**：`kind=dependency`（在 `todo` 等，**不完整父完成后自动恢复**；⚠️ 若**没有**未完成的父，会被记成 **`needs_input`** —— 因为那个等待永远无法满足）、`needs_input` / `capability` / `transient`（浮给人类）；**同 kind 反复 block 会自动升级到 `triage`**
  · **`kanban_heartbeat`** —— 长操作期间报存活（**纯副作用**）
  · **`kanban_comment`** —— 往任务线程追加耐久备注
  · **`kanban_attach`** —— 内联传字节（base64）把文件附到任务（存进该任务的 attachments 目录，**25 MB 上限**）
  · **`kanban_attach_url`** / **`kanban_attachments`** —— 按 URL 附加 / 列附件
  · **`kanban_create`**（编排者）—— fan out 出子任务（带 `assignee`、可选 `parents`、`skills` 等）；**当有未完成的父把新卡停住时返回 `gated: true` + `gated_by`**
  · **`kanban_link`**（编排者）—— 事后加 `parent_id → child_id` 依赖边；⚠️ **child 已在跑时会被 `child is already running` 拒绝**（认领之后加的边没法串行化那次运行）
  · **`kanban_unblock`**（编排者）—— 把 blocked 任务恢复到它的来源阶段（`review` 或 `ready`），有未完成父时回到 `todo`
- ⭐ **一个 worker 的典型一轮长这样**（官方给的工具调用顺序）：`kanban_show()`（无参，用 `HERMES_KANBAN_TASK`）→ 读回 `worker_context`、用 terminal/file 工具干活 → `kanban_heartbeat(note="halfway through — 4 of 8 files transformed")` → 继续干 → `kanban_complete(summary="migrated limiter.py to token-bucket; added 14 tests, all pass", metadata={"changed_files": [...], "tests_run": 14})`。
- **编排者 worker 则是 fan out**：`kanban_show()` → `kanban_create(title=…, assignee="researcher-a", body=…)`（返回 `task_id`）→ 再建第二个研究任务 → 建第三个 **`parents=["t_r1", "t_r2"]`** 的写作任务（**两个都完成时才提升为 ready**）→ `kanban_complete(summary="decomposed into 2 research tasks + 1 writer; linked dependencies")`。
  · ⚠️ 官方说明约定：**worker profile 不 fan out、不路由无关工作；orchestrator profile 不做实现工作**（这条约定编码在自动注入的 kanban 指引里）。**dispatcher spawn 的 worker 在破坏性生命周期操作上仍然是任务作用域的，不能改动无关任务。**
- ⭐ **为什么用工具而不是 shell 出去调 `hermes kanban`（官方给了三条理由，很实际）**：
  · **后端可移植性**：terminal 指向远端后端（Docker / Modal / Singularity / SSH）的 worker，会在容器里跑 `hermes kanban complete` —— 而**那里没装 hermes、`~/.hermes/kanban.db` 也没挂载**。kanban 工具跑在 agent 自己的 Python 进程里，**无论 terminal 后端是什么都能到达 `~/.hermes/kanban.db`**。
  · **没有 shell 引号脆弱性**：把 `--metadata '{"files": [...]}'` 穿过 shlex + argparse 是个潜在的坑；结构化工具参数完全绕过它。
  · **更好的错误**：工具结果是模型能推理的结构化 JSON，而不是它得去解析的 stderr 字符串。
  · 还有一条：**零 schema 足迹** —— 普通 `hermes chat` 会话**没有任何 `kanban_*` 工具**，除非活动 profile 显式为编排工作启用 `kanban` toolset。**不碰 kanban 的用户不会被工具撑大 schema。**
- ⚠️ **注入边界（容易误判的一点）**：自动注入的 kanban 指引**只注入给 dispatcher spawn 的、拥有该任务的 worker** —— 一个只是启用了 `kanban` toolset 的交互会话**保留了工具但不会被告诉「你被分配了一个任务」**；而一个 worker 内部派生出来的 `delegate_task` 子代理或 cron 运行（它们继承了 worker 的 `HERMES_KANBAN_TASK`）**既不收到 worker 协议，也不会在自己预算耗尽时给 worker 的卡记一个终态**。
- **推荐的交接证据**：`kanban_complete(summary=..., metadata={...})` 刻意做得灵活 —— **summary 是人类可读的收尾，`metadata` 是机器可读的交接**，好让下游 agent、评审者或仪表盘**无需去抠散文**就能复用。
- ⭐⭐ **worker 协议与退出码（这块设计得很细，P40 的技术核心）**：最后那个终态板调用（`kanban_complete` / `kanban_request_review` / `kanban_block`；评审者以 `kanban_complete` 或 `kanban_request_changes` 结束）**是 worker 协议的一部分**。⚠️ **如果 worker 进程以状态 0 退出但任务仍是 `running`，dispatcher 视之为协议违规并发出 `protocol_violation` 事件。**
  · 所以一个 dispatcher spawn 的 worker 在其轮次失败时**会以非零退出**：**`1`** = 普通失败；**`75`（`EX_TEMPFAIL`）** = provider 被限流、过载、返回 5xx 或超时，或账号撞到计费/配额墙 → dispatcher 把那一次记为 **`rate_limited` 并重新排队任务、不计一次失败**（**配额窗口永远不会被记成协议违规**）；**`78`（`EX_CONFIG`）** = provider 拒绝了重试修不了的东西 —— **该 profile 的凭证**（401/403、被吊销或无效的 key）、**模型**（404 / model not found）或 **TLS 链**。
  · ⭐ 最后那类**会在第一次发生时就跳闸熔断**：dispatcher 把那一次记为 `crashed` + `exit_kind: terminal_provider`，发 `gave_up` + `terminal_provider: true`，并把卡**停放为 `blocked`（粘性的 —— `recompute_ready` 不会自动恢复它）**，且把 provider 自己的原话放进 `last_failure_error` —— 而**不是**一直重新 spawn 去撞同一面墙直到耗尽 `failure_limit`/`max_retries`。**两条泳道同样记账**：评审者 worker 死在吊销的 key 上，卡也会被同样停放。`hermes kanban show` 会显示 `Provider rejected this profile's credential or model — blocked after one attempt`，修好该 assignee profile 的 provider 后 `hermes kanban unblock <id>`。
  · worker 还会把自己的退出码写成**自己日志的最后一行**（`[kanban-worker-exit] rc=<code>`），这样**一个每 tick 跑、从未 reap 过 worker、也读不到它退出状态的 `hermes kanban dispatch` 进程**也能按同样的方式登记同一种死亡；**在到达那行之前就被杀掉的 worker 是普通 `crashed`**（`pid <n> not alive`）。
- **agent 侧预防 + dispatcher 侧恢复（两层兜底）**：
  · **agent 侧**：在 worker 退出之前，若 Hermes 检测到**模型即将在没有终态板调用的情况下停下**，会注入**最多两条合成提醒**。它抓的是那个常见情形：**模型叙述了下一步（「让我来写这份报告」）然后以 `finish_reason=stop` 停下**。提醒会告诉模型立刻调 `kanban_complete` / `kanban_request_review` / `kanban_block`。⚠️ **已经交出卡的 worker 永不被提醒**（`kanban_request_review`，或评审者的 `kanban_request_changes` 就是它的终态调用）—— 这个提醒**永远不会要求它去 `kanban_complete` 一张正在评审中的卡**。这个守卫**只对 dispatcher spawn 的 worker 生效**（`HERMES_KANBAN_TASK` 已设且该 run 拥有那个任务）—— `delegate_task` 子代理与 worker 内的 cron 任务继承了变量但**永不被提醒**（它们没有板工具）。可用 **`HERMES_KANBAN_STOP_NUDGE=0`** 关掉。
  · **dispatcher 侧**：若提醒耗尽或 worker 在到达提醒前就崩了，dispatcher 给这次违规**有界重试**（最多 `_PROTOCOL_VIOLATION_FAILURE_LIMIT` 次连续违规，**默认 3**）后才**自动 block 任务**，而不是一直重 spawn 进同一个循环。⚠️ 这个预算**只计连续的干净退出协议违规** —— 中间夹的 `rate_limited` 重新排队是**中性**的，任何其他失败种类都会**重置**这个连续计数；per-task `max_retries` 可覆盖该上界。**被这个预算 block 的卡会保持 blocked**（不像低于 `failure_limit` 的熔断 block 那样被自动提升），直到 `hermes kanban unblock <id>`（同时也授予一份全新的重试预算）。官方注释：**这通常意味着模型写了一段纯文本回答、然后没用 Kanban 工具面就退出了。**
- **给单个任务钉额外技能**（不必每次改 assignee 的 profile）：从编排 agent 用 `kanban_create` 的 **`skills` 数组**；从人类（CLI / 斜杠命令）**重复 `--skill`**；从仪表盘在创建对话框的 skills 字段里**逗号分隔**输入。dispatcher 会为列出的每个技能发一个 `--skills <name>` 标志 → **worker 带着它们全部加载 spawn，叠加在自动注入的 kanban 指引之上**。⚠️ **技能名必须匹配该 assignee 的 profile 上真的装了的技能**（`hermes skills list` 看有什么）—— **没有运行时安装**。
- **worker 的会话命名**：worker 的会话**按它的卡命名**（`Fix the swap modal`，或板行读不到时 `Kanban task <id>`）—— 所以 `hermes sessions` 与会话搜索**显示的是那张卡，而不是模型的猜测**。⭐ **worker 永远不会做那个给交互会话命名的辅助 `title_generation` 模型调用**（省一次调用）；worker 会话里手打 `/title` 仍然优先。

## 关键概念

- **`KANBAN_GUIDANCE`**：spawn 时自动注入 worker system prompt 的生命周期指引（无需安装/配置）。
- **认领与心跳**：`kanban_heartbeat` + 自动心跳（约每分钟镜像存活）；>1 小时无心跳 → reclaim。
- **`dispatch_stale_timeout_seconds`**（默认 4h）：超时且半小时无心跳即回收，**不计失败**。
- **12 个 `kanban_*` 工具**：show / list / complete / request_review / request_changes / block / heartbeat / comment / attach / attach_url / attachments / create / link / unblock。
- **`protocol_violation`**：进程退出 0 但卡仍 `running` = 违规。
- **退出码三态**：`1` 普通失败 / `75` TEMPFAIL（限流·配额 → `rate_limited` 重排队） / `78` CONFIG（凭证·模型·TLS → **一次即熔断并粘性 block**）。
- **合成提醒（stop nudge）**：最多 2 条，防「叙述完下一步就停」；已交出卡的 worker 不被提醒。
- **`_PROTOCOL_VIOLATION_FAILURE_LIMIT`**（默认 3）：连续违规的自动 block 阈值。
- **per-task skills**：把技能钉到任务而非 profile。
- **worker 会话按卡命名**。

## 代码 / 实操

```python
# 一个 worker 的典型一轮（官方原文的工具调用顺序）
kanban_show()                                     # 无参 —— 用 HERMES_KANBAN_TASK
# （模型读回 worker_context，用 terminal/file 工具干活）
kanban_heartbeat(note="halfway through — 4 of 8 files transformed")
# （继续干）
kanban_complete(
    summary="migrated limiter.py to token-bucket; added 14 tests, all pass",
    metadata={"changed_files": ["limiter.py", "tests/test_limiter.py"], "tests_run": 14},
)
```

```python
# 编排者 worker 的 fan out
kanban_show()
kanban_create(title="research ICP funding 2024-2026", assignee="researcher-a",
              body="focus on seed + series A, North America, AI-adjacent")
kanban_create(title="research ICP funding — EU angle", assignee="researcher-b", body="…")
kanban_create(
    title="synthesize findings into launch brief",
    assignee="writer",
    parents=["t_r1", "t_r2"],     # 两个都完成时才提升为 ready
    body="one-pager, 300 words, neutral tone",
)
kanban_complete(summary="decomposed into 2 research tasks + 1 writer; linked dependencies")
```

```bash
# 给单个任务钉技能（人侧）
hermes kanban create "translate README to Japanese" --assignee linguist --skill translation
hermes kanban create "audit auth flow" --assignee reviewer \
    --skill security-pr-audit --skill github-code-review
```

**本机实测**（2026-09-25，`~/.hermes/kanban.db`）：
```
task_runs（2 行，profile 都是 dev）：
  run 1  outcome=completed  started 1781574719 → ended 1781574975（约 256 秒）
         changed_files: app/(site)/projects/page.tsx, app/globals.css
  run 2  outcome=completed  started 1781574975 → ended 1781575133（约 158 秒）
         changed_files: app/(site)/about/page.tsx, app/globals.css

task_events：heartbeat 8（其中三条相隔恰好 60 秒）| created 3 | completed 3
             spawned 2 | claimed 2 | commented 1 | tip_scratch_workspace 1
⚠️ 没有 crashed / timed_out / gave_up / protocol_violation → 三次都跑干净了
logs/：t_5949ec9d.log 20,460 B ｜ t_68fc8bb8.log 18,255 B
```

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25）：

- ⭐ **本机两个 run 的 `metadata` 里都有 `changed_files`** —— 这正是官方说的「**机器可读的交接**」：`task_runs` 实测 run 1 = `app/(site)/projects/page.tsx` + `app/globals.css`，run 2 = `app/(site)/about/page.tsx` + `app/globals.css`。也就是说**本机当初真的是用 kanban 把「改 PersonalWebsite 的 projects 页 / about 页」派发出去做的**，而且交接证据完整留在了 SQLite 里（P39 讲的「审计轨迹永久」不是我推的，是查出来的）。
- ⭐ **心跳的 60 秒节奏在事件里能直接量出来**：一条任务的 run 有三条连续 `heartbeat`（1781574979 → 1781575039 → 1781575099），**两两相差恰好 60 秒** → 与官方「worker 大约每分钟把进程内存活镜像到板上」**逐字吻合**。这也侧面证明那两个任务都活过了心跳窗口（没被 reclaim）。
- ⭐ **本机事件表里 `crashed` / `timed_out` / `gave_up` / `protocol_violation` 全是 0** —— 三个任务都走的是**成功路径**（`created → claimed → spawned → heartbeat ×N → completed`）。对照官方那张「退出码/熔断」的复杂表格，本机这批**一次都没触发**那些兜底机制（也算是一种阴性对照：它们只在真出问题时才出现）。
- 📌 **本机 `task_runs` 的时长可以反推 worker 行为**：run 1 从 started 到 ended 约 **256 秒**、run 2 约 **158 秒** —— 两次都**远短于** `dispatch_stale_timeout_seconds`（官方默认 4 小时，本机配置里也是 14400），所以这两次运行**根本不需要长时心跳**；而它们仍然按分钟级打了心跳，正说明那是**自动镜像**而不是模型手工调的。
- ⚠️ 本机 config 实录 **`dispatch_stale_timeout_seconds: 14400`**（= 4 小时，与官方默认一致）；配合官方那条「>1 小时无心跳即回收」的规则，意味着**在真实长任务里，worker 必须每小时至少心跳一次，否则进展会被白丢**（回收是良性的，但那一轮的工作没了）。
- 📌 本机 `logs/` 里那两份 worker 日志（20,460 B / 18,255 B）正是官方说的 `<board-root>/logs/<task_id>.log`；而官方也说明 worker 会把自己的退出码写成**日志最后一行** `[kanban-worker-exit] rc=<code>` —— 也就是说这 20 KB 的日志里**应该**有那一行，这是以后排查 worker 死因的第一手材料。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
