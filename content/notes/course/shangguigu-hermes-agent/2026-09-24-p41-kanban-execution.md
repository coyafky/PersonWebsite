---
title: "P41 41_协作篇_Kanban任务执行演示"
date: "2026-09-24"
summary: >-
  P41 · 41_协作篇_Kanban任务执行演示（7:51）
status: published
tags:
  - "Hermes"
  - "Kanban"
lang: zh
chapter: "P41"
series: "shangguigu-hermes"
seriesOrder: 41
---

## 课时概要

协作篇 · Kanban 任务执行演示。官方仓库实现：`apps/desktop/src/plugins/kanban/`（看板 UI + 编排 + 完成通知）。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档（Delegation 页 / Kanban 页 / Kanban tutorial / Kanban worker lanes / Kanban multi-gateway / Delegation patterns 六页）与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑/实读得到的真实状态。

**视频**：[41_协作篇_Kanban任务执行演示](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=41) ｜ 时长 7:51 ｜ P41

## 本节要点

- **官方快速开始五步（谁是人的活、谁是模型的活，划得很清）**：① 你建板 `hermes kanban init` ② 你启 gateway（它内含 dispatcher）`hermes gateway start` ③ 你建任务 `hermes kanban create "research AI funding landscape" --assignee researcher` ④ 你实时看活动 `hermes kanban watch` ⑤ 你看板 `hermes kanban list` / `hermes kanban stats`。
  · ⭐ 官方特别点明一个反直觉细节：**当 dispatcher 捡起任务并 spawn 出 `researcher` profile 时，那个 worker 的模型做的第一件事是调 `kanban_show()` 去读它的任务 —— 它不会去跑 `hermes kanban show t_abcd`。**
- **dispatcher 内嵌在 gateway 里（默认形态）**：默认 `kanban.dispatch_in_gateway: true` —— **没有东西要安装，也没有独立服务要管**；**gateway 活着，ready 任务就会在下一个 tick（默认 60 秒）被捡起**。可在运行时用 `HERMES_KANBAN_DISPATCH_IN_GATEWAY=0` 覆盖（调试用）。
  · ⚠️ **没有运行中的 gateway 时，`ready` 任务就待在那儿直到一个 gateway 起来** —— 而 `hermes kanban create` **会在创建时就警告这一点**。
- **worker 与 systemd cgroup**：worker 是 fire-and-forget 进程、**活得比 dispatcher 的 tick 还久**，所以凡 dispatcher 跑在 systemd unit 里的场景，worker 会被启动在**它自己的瞬态 scope** 里（`systemd-run --user --scope --unit hermes-worker-kanban-<task>-run-<run>`）→ **因此它挺得过那个 unit 的退出或重启**。创建这个 scope 需要一个**用户 systemd 会话**。
- **仪表盘（GUI）是个 bundled 插件，不是核心功能、也不是独立服务**（在 `plugins/kanban/`）：`hermes kanban init` 一次性建库 → `hermes dashboard` → 导航里在 **Skills 之后**出现 **Kanban 标签**。
- **仪表盘的能力清单**（官方逐条列了，P41 的「演示」部分主要看这个）：
  · **每个 status 一列**：`triage` / `todo` / `ready` / `running` / `blocked` / `done`（归档开开关时多 `archived`）。**队列列按派发顺序列卡（先优先级、再最老优先 —— 最上面那张就是下一个被 spawn 的）**；`done` 列是历史、**最新完成的在最上**。
  · **卡片上显示**：任务 id、标题、优先级徽章、tenant 标签、被分配的 profile、评论/链接计数、进度胶囊（有依赖时显示 `N/M` 个子任务完成）、以及「created N ago 之前创建」。**每卡一个复选框**可多选。
  · **Running 列里的 per-profile 泳道**：工具条上的复选框可切换按 assignee 分组。
  · ⭐ **WebSocket 实时更新**：插件以很短的轮询 interval **tail 那张 append-only 的 `task_events` 表** → **任何 profile（CLI、gateway、或另一个仪表盘标签）一动手，板就立刻反映出来**；重载做了防抖，所以一串事件爆发只触发一次重新拉取。
  · **拖放卡片**在列间改 status —— 放下会发 `PATCH /api/plugins/kanban/tasks/:id`，**这条路走的是 CLI 用的同一个 `kanban_db` 代码** → ⭐ **三个界面永远不会漂移**。移入破坏性状态（`done` / `archived` / `blocked`）会**要求确认**。触摸设备有基于指针的降级方案，所以平板也能用。
  · **建任务对话框**：点任意列头的 `+` 打开模态，字段有 标题、assignee、优先级、技能、工作区类型/路径（从板项目目录预填，可按任务覆盖）、目标模式，以及（可选）从所有既有任务的下拉里选一个父任务。**Enter 建任务、Shift+Enter 在标题里换行、Escape 取消**。⭐ **从 Triage 列创建会自动把新任务停在 triage。**
  · ⭐ **多选 + 批量操作**：shift/ctrl 点卡或勾选复选框加入选择 → 顶部出现**批量操作条**，含**批量状态转换、归档、以及按 profile 下拉重新分配（或「unassign」）**。破坏性批次会先确认；**per-id 的部分失败会被报告而不中止其余**。
  · **侧抽屉**（点卡不开 shift/ctrl）：可编辑标题（点标题改名）、可编辑 assignee/优先级、**可编辑描述（默认 markdown 渲染，带「edit」按钮切换成 textarea）**、**依赖编辑器**（父与子的 chip 列表，各带 `×` 解链，加下拉可加新父/子；⚠️ **环尝试会被服务端拒绝并给出清晰消息**）、**状态动作行**（→ triage / → ready / → running / block / unblock / complete / archive，破坏性转换有确认）、**结果区**（同样 markdown 渲染）、**评论线程（回车即提交）**、**最近 20 条事件**。
  · **Triage 列的两颗 LLM 按钮**（见 P42）：**⚗ Decompose** 与 **✨ Specify** —— 都能从 CLI（`hermes kanban decompose <id>` / `specify <id>` / `--all`）、任何 gateway 平台（`/kanban decompose <id>`）、以及 API（`POST /api/plugins/kanban/tasks/:id/decompose` 与 `…/specify`）触达。
  · **工具条筛选**：自由文本搜索、tenant 下拉（默认取 `config.yaml` 的 `dashboard.kanban.default_tenant`）、assignee 下拉、「显示已归档」开关、「按 profile 分泳道」开关，以及 ⭐ **一个 Nudge dispatcher 按钮 —— 这样你不用等下一个 60 秒 tick**。
- **仪表盘的架构（官方明确：它没有自己的领域逻辑）**：GUI **严格只是一个「通过 DB 读、通过 `kanban_db` 写」的层**，没有任何属于自己的领域逻辑 —— 所以 CLI / gateway / 仪表盘三个界面**不可能漂移**。
- ⭐ **官方教程给了四个递进的真实剧本**（`kanban-tutorial`，这就是「任务执行演示」的骨架）：
  · **Story 1 — 单打独斗的开发者交付一个特性**（solo dev shipping a feature）
  · **Story 2 — 舰队式农耕（fleet farming）**：一批同类任务分给多个 worker 并行干
  · **Story 3 — 带重试的角色流水线（role pipeline with retry）**：按角色串成流水线，失败可重试
  · **Story 4 — 熔断器与崩溃恢复**：**看起来永久性的失败**（circuit breaker）与 **worker 死在半途**（crash recovery）
  · 教程另外两节很实用：**「结构化交接 —— 为什么 `summary` 与 `metadata` 要紧」**，以及 **「在一张已 done 的卡上跟进 —— 通过父链接做 CI 补救」**；还有一节是 **「检视一个正在运行的任务」**。
- **在卡上跟进（教程里的 CI 补救流程）**：当一张卡已经 `done` 而下游 CI 又出问题时，官方给的模式是**通过父链接**做补救 —— 也就是再建一张卡并把已完成的卡当父，而不是去改那张已完成的卡（保持审计轨迹不被篡改）。

## 关键概念

- **五步快速开始**：init 板 → 启 gateway（含 dispatcher）→ create 任务 → watch 实时 → list/stats 看板。
- **worker 第一动作是 `kanban_show()`**，不是 CLI。
- **dispatcher 内嵌 gateway**：`dispatch_in_gateway: true`（默认），无独立服务。
- **worker 瞬态 scope**：systemd 下 worker 跑在自己的 scope 里，挺得过 unit 重启。
- **三界面同源**：CLI / gateway / 仪表盘都走同一个 `kanban_db`，永不漂移。
- **WebSocket 实时**：tail `task_events` 表。
- **队列列顺序 = 派发顺序**（优先级 → 最老优先）；`done` 列最新在上。
- **批量操作**：批量状态转换 / 归档 / 重新分配（per-id 部分失败不中止其余）。
- **Triage 两颗 LLM 按钮**：⚗ Decompose 与 ✨ Specify。
- **Nudge dispatcher 按钮**：跳过 60 秒等待。
- **教程四剧本**：单打独斗 / 舰队农耕 / 角色流水线 / 熔断与崩溃恢复。

## 代码 / 实操

```bash
# 官方快速开始（谁干什么写得很清楚）
hermes kanban init                                  # 1. 建板（你）
hermes gateway start                                # 2. 启 gateway（内含 dispatcher）
hermes kanban create "research AI funding landscape" --assignee researcher
                                                    # 3. 建任务（你，或编排 agent 用 kanban_create）
hermes kanban watch                                 # 4. 实时看活动（你）
hermes kanban list && hermes kanban stats           # 5. 看板（你）
```

```bash
# 仪表盘
hermes kanban init      # 一次性：没有 kanban.db 就建一个
hermes dashboard        # 导航里 Skills 之后出现 Kanban 标签
```

```bash
# 运行期命令（本机实测过的）
hermes kanban tail <task_id>       # 跟着 worker 日志实时看
hermes kanban runs <task_id>       # 历史尝试列表
hermes kanban show <id>            # 含 tip_scratch_workspace 之类事件
hermes kanban stats                # 板级统计
```

**本机实测**（2026-09-25，回看那次真实执行）：
```
task t_5949ec9d  「修复project项目页的表达」        assignee=dev  status=done
  created 1781574692 → started 1781574719（27 秒后被认领）→ completed 1781574975
  run outcome=completed   changed_files: app/(site)/projects/page.tsx, app/globals.css

task t_68fc8bb8  「更新About页面：简历内容+技术栈展示」 assignee=dev  status=done
  created 1781574967 → started 1781574975（8 秒后认领）→ completed 1781575133
  run outcome=completed   changed_files: app/(site)/about/page.tsx, app/globals.css

task t_71f76b62  「research AI funding landscape」   assignee=researcher  status=done
```

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25）：

- ⭐⭐ **本机 kanban 库里存着一次完整真实执行的全程**（三个任务、两个 run、20 条事件），而且**时间线可以逐秒还原**：`t_5949ec9d` 从创建到被认领 **27 秒**（1781574692 → 1781574719）、跑了约 **256 秒**完成；紧接着 `t_68fc8bb8` 创建于 1781574967、**8 秒后**被认领、跑了约 **158 秒**完成 → 两次的「创建 → 认领」延迟都在**一个 60 秒 tick 之内**，正好印证官方「gateway 活着，ready 任务在下一个 tick 被捡起」。
- ⭐ **本机三个 task 的 `assignee` 分别是 `dev` 与 `researcher`** —— 也就是**官方那套「按 profile 名匹配 worker」的模型在本机是真的这么用的**（不是抽象概念）：一个开发 profile 干实现活、一个研究 profile 干调研活。而 `researcher` 那个任务（`research AI funding landscape`）的 run **没有**出现在 `task_runs` 里（只有 2 行）→ 说明它**建了卡但没被派发执行**（本机当时只有 `dev` 在工作，或它被手动标了 done）。
- 📌 **本机那两条 run 的改动落点极其具体**：run 1 改了 `app/(site)/projects/page.tsx` + `app/globals.css`、run 2 改了 `app/(site)/about/page.tsx` + `app/globals.css` —— 两份 **`globals.css` 都被动过**，说明这两个任务是**同一条视觉一致性工作流**的两半（改 projects 页布局 → 再改 about 页）。这正好能对上官方教程 **Story 1「单打独斗的开发者交付一个特性」** 的形态：同一批 UI 改动被拆成两张卡、由同一个 `dev` profile 顺序做完。
- ⚠️ **本机那次执行没有一个任务走 review 阶段**：事件表里 **没有** `review_requested` / `changes_requested`，两个 run 都直接 `completed`。而官方默认 `kanban.review_dispatch: true`（会用 bundled `sdlc-review` 技能拉起评审方）—— 也就是说本机用的是**「实现完直接 complete」的路径**，没启用同卡评审。原因看得到：**那个任务的人类操作者已经在评论里把上下文和期望讲清楚了**（`cto` 那条评论指定了本地路径、要求直接在本地目录开发）。
- 📌 **本机 `done` 列的排序语义**（官方说 `done` 是最新完成在上）在本机可验证：两个 run 的 `ended_at` 分别是 1781574975 与 1781575133，所以按官方顺序**后完成的那张（更新 About 页）会排在前面** —— 与官方 `hermes kanban list --status done --sort completed-desc` 给的口径一致。
- 💡 本轮最实用的一条：官方给的 **`hermes kanban tail <task_id>`（跟着 worker 实时看）与 `hermes kanban runs <task_id>`（历史尝试列表）** 正是本机现在就能用的命令 —— 那两份 20 KB / 18 KB 的 worker 日志就是它们的数据源，**下次要复盘「那次到底谁改的、改了什么」不用翻会话，直接查板**。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
