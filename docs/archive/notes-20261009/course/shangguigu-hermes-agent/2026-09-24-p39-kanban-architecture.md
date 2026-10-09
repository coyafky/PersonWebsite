---
title: "P39 39_协作篇_Kanban意义和架构"
date: "2026-09-24"
summary: >-
  P39 · 39_协作篇_Kanban意义和架构（7:51）
status: published
tags:
  - "Hermes"
  - "Kanban"
lang: zh
chapter: "P39"
series: "shangguigu-hermes"
seriesOrder: 39
---

## 课时概要

协作篇 · Kanban 的意义和架构。官方文档有 **Kanban**（多代理并行任务编排）与 **Kanban multi-gateway** 两页，讲看板在什么场景下解决什么问题。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档（Delegation 页 / Kanban 页 / Kanban tutorial / Kanban worker lanes / Kanban multi-gateway / Delegation patterns 六页）与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑/实读得到的真实状态。

**视频**：[39_协作篇_Kanban意义和架构](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=39) ｜ 时长 7:51 ｜ P39

## 本节要点

- **Kanban 是什么**（官方定义）：一个**持久消息队列 + 状态机**。与 `delegate_task` **看着像，实际是完全不同的原语**。
- ⭐ **官方给的七维对照表**（这张表是本分P 的核心）：
  · **形态**：`delegate_task` = RPC 调用（fork → join）｜ Kanban = **持久消息队列 + 状态机**
  · **父的状态**：阻塞直到子返回 ｜ **`create` 之后 fire-and-forget**
  · **子的身份**：匿名子代理 ｜ **具名 profile + 持久记忆**
  · **可恢复性**：无（失败就是失败）｜ **block → unblock → 重跑；崩溃 → reclaim**
  · **人在环**：不支持 ｜ **任意时刻评论 / unblock**
  · **每任务多少 agent**：一次调用 = 一个子 ｜ **一个任务的生命周期内 N 个 agent**（重试、审查、跟进）
  · **审计轨迹**：上下文压缩就丢了 ｜ **SQLite 里的耐久行，永久**
  · **协调方式**：层级式（调用者 → 被调用者）｜ **对等 —— 任何 profile 读写任何任务**
- ⭐ **一句话区分（官方原话）**：**「`delegate_task` 是一个函数调用；Kanban 是一个工作队列，其中每一次交接都是一行、任何 profile（或人）都能看到并编辑的记录。」**
- **什么时候用哪个**（官方的使用判据）：用 **`delegate_task`** 当**父 agent 需要一段短期推理答案才能继续**、**没有人类参与**、且**结果要回到父的上下文**里；用 **Kanban** 当工作**跨越 agent 边界**、**需要活过重启**、**可能需要人类输入**、**可能被另一个角色接手**、或**需要事后可被发现**。
  · ⭐ **两者共存**：一个 kanban worker **可以在自己的运行中调用 `delegate_task`**。
- ⚠️ **一个真实死锁陷阱（官方专门警告）**：一个**被 `t_parent` 阻塞**的 worker，如果为缺失的那块建了一张**支持卡**，**绝不能** `kanban_link(t_parent, t_support)` —— 这个链接会让支持卡变成**被阻塞父卡的子**，于是**它被它存在就是为了解锁的那张父卡门控住了** → **两张卡都永远不跑**。
  · **正确做法**：在支持卡的 **body 里用文字引用父 id**。
  · 官方说明：`link`/`kanban_link` 在把一个 `ready` 子卡降级时会报 **`gated: true`** 并记一条 **`dependency_wait`** 事件（`kanban_create` 带 `parents` 把新卡停住时同理）→ **死锁在板上可见**；`hermes kanban unlink <parent> <child>` 可解开。
- **核心概念之一：Board（板）** —— 一个**独立的任务队列**，带自己的 **SQLite DB**、**workspaces 目录**与 **dispatcher 循环**。一个安装可以有**很多板**（例如每个项目、仓库或领域一个）。⭐ **单项目用户永远待在 `default` 板上，除了文档这一节以外永远不会看到「board」这个词**。
- **核心概念之二：Task（任务）** —— 一行，含：**title**、可选 **body**、**恰好一个 assignee（一个 profile 名）**、**status**、可选 **tenant** 命名空间、可选 **idempotency key**（为重试的自动化去重）。
  · **status 有八态**：`triage` → `todo` → `ready` → `running` → `blocked` / `review` → `done` → `archived`
- **核心概念之三：Link（依赖）** —— `task_links` 里的一行，记录 **父 → 子** 依赖。**dispatcher 在所有父都 `done` 时把 `todo` 提升为 `ready`**。⚠️ **给一个正在跑的 child 加链接会被拒绝**（它没法门控已经认领的工作）—— 唯一的例外是**活动 worker 在依赖阻塞交接之前立刻链接它自己的卡**（由 dispatcher 提供 run 所有权）。
- **核心概念之四：Comment（评论）= agent 间协议** —— agent 与人类都可以追加评论；⭐ **worker 被（重新）拉起时，会把整条评论线程读入作为它上下文的一部分**。
- **核心概念之五：Workspace（工作区）三种**（这块对理解「文件去哪了」很关键）：
  · **`scratch`（默认）**：`~/.hermes/kanban/workspaces/<id>/` 下的一个新临时目录（非默认板上是 `~/.hermes/kanban/boards/<slug>/workspaces/<id>/`）。⭐ **任务完成时被删除 —— scratch 生来就是临时的**。通过 `kanban_complete(artifacts=[...])` 或 `kanban_request_review(artifacts=[...])` **显式声明**的文件，会在清理前被拷进**耐久的 per-task 附件存储**；⭐ **一个被声明却缺失的 scratch 产物会让任务留在 in-flight**，好让 worker 修正路径并重试。**首次**在一个安装上创建 scratch 工作区时，dispatcher 记一条警告并在任务上发 **`tip_scratch_workspace`** 事件（`hermes kanban show <id>` 可见）。
  · **`dir:<path>`**：一个已存在的**共享目录**（Obsidian vault、邮件作业目录、按账号分的文件夹）。**必须是绝对路径** —— ⚠️ 相对路径（如 `dir:../tenants/foo/`）**在派发时就被拒**，因为它会依 dispatcher 恰好所在的 CWD 解析，**既含糊又是一种 confused-deputy 逃逸向量**。该路径本身是被信任的（**你的机器、你的文件系统、worker 用你的 uid 跑** —— 这是**可信本地用户威胁模型，kanban 的设计就是单机**）。**完成后保留**。
  · **`worktree`**：编码任务的 git worktree（`.worktrees/<id>/`），`worktree:<path>` 可钉精确目标路径，worker 侧 `git worktree add` 创建（给了 `--branch` 就用它）。**完成后保留**。
- **核心概念之六：Dispatcher（派发器）** —— 一个长驻循环，每 N 秒（**默认 60**）做六件事：① **回收陈旧 claim** ② **回收崩溃的 worker**（PID 没了但 TTL 未到）③ ⭐ **reap 活得比自己已结束的 run 还久的 worker**（一个 worker 在自己 `kanban_complete`/`kanban_block` 之后还活着，就在它的 run 关闭**两分钟后**被终止 —— 留时间让它跑完最后一轮；**按 PID + 启动时间指纹匹配，所以被复用的 PID 永不被误杀**；记为 **`terminal_worker_reaped`** 事件）④ 提升 ready 任务 ⑤ **原子认领** ⑥ **spawn 被分配的 profile**。
  · 默认**跑在 gateway 进程里**（`kanban.dispatch_in_gateway: true`，无需安装、无独立服务 —— **gateway 活着，ready 任务就会在下一个 tick 被捡起**）；**一个 dispatcher 每 tick 扫所有板**；worker 被 spawn 时被**钉上 `HERMES_KANBAN_BOARD`，所以它看不到别的板**。
  · ⚠️ **防捶打**：同一任务连续 spawn 失败达到 `kanban.failure_limit`（**默认 2**）次后，dispatcher **自动 block 它、并把最后一次错误当作原因** —— 防止对「profile 不存在」「工作区挂不上」这类任务反复捶打。
- ⭐ **多 profile 网关下的「单 dispatcher 姿态」（官方 Kanban multi-gateway 页）**：**只有一个 gateway 拥有 kanban dispatcher** —— 拥有的那个保持 `kanban.dispatch_in_gateway: true`（默认），**其他每一个都设成 false**。
  · **为什么重要（官方原话的理由）**：**派发是单拥有者，这样多个 gateway 不会竞速去 spawn 同一份工作**；而**通知投递则是 profile 拥有的** —— **每个 gateway 只轮询它拥有平台适配器的那些 profile 的订阅**。
- **订阅也覆盖评审反馈**（同一页）：一个 **`changes_requested`** 评审事件会被投递为**可行动的 review-BLOCK 通知**；用 **`notify+wake`** 的订阅还会**唤醒确切的原始 chat/thread/session**，让控制者去查看现有卡片与当前 run；而 `notify` 仍然只是被动通知、`wake` 仍然只唤醒。⭐ **评审反馈永不创建、解阻、重排或以其他方式修改任务。**
- **Boards（多项目）**：把无关的工作流分开（每项目/仓库/领域一个队列）。**新安装恰好只有一个板，叫 `default`**（DB 在 `~/.hermes/kanban.db`，为向后兼容）。**只要一条工作流的人永远不需要知道板的存在** —— 这个功能是 opt-in。
  · ⭐ **每板隔离是绝对的**：**每板一个独立 SQLite DB**（`~/.hermes/kanban/boards/<slug>/kanban.db`）｜ 各自的 `workspaces/` 与 `logs/` 目录 ｜ **为任务 spawn 的 worker 只看到自己板的任务**（dispatcher 在子环境里设 `HERMES_KANBAN_BOARD`，worker 能访问的每个 `kanban_*` 工具都读它）｜ ⚠️ **跨板链接任务不被允许**（保持 schema 简单；真需要跨项目引用就用自由文本提及 + 手工按 id 查）。
- **PR 完成契约（编码任务的硬门槛）**：建卡时声明 `--completion-contract OWNER/REPO`（已有工作可直接给完整的 `https://github.com/OWNER/REPO/pull/123` URL）；`local-only` 用于故意只在本地的活；已存在与未声明的卡保持那个默认。⚠️ **散文里的 URL 不构成策略**。发布之后把 `metadata.published_pr` 传给完成 —— **第一个匹配的 URL 会永久绑定该卡**，重试不能替换成一个绿的兄弟 PR。
  · 共享的 `complete_task` 边界覆盖 worker 工具、CLI、评审批准与仪表盘完成四条路；它读经典分支保护与活动 ruleset 的必需上下文、分页取**精确 head** 的 check runs 与 legacy statuses，然后**重读 PR 的 head/base**。⭐ **缺失、待定、失败、取消、超时、陈旧、跳过或中立 的必需证据都不能完成该卡**；**零运行的验收、不可读的策略、GitHub API 失败也都不能**。**一个没有必需检查的仓库需要 local-only 契约。** ⚠️ `gh` 必须以**对该仓库 checks 与 rules 有读权限**的身份认证 —— **这道门不做任何远端写入**。
  · **被拒会保留活动卡与工作区**；耐久 **`pr_acceptance`** 事件存 PR URL、SHA、必需上下文、check ID/URL、分类与恢复指引；`last_failure_error` 给出下一步。**修失败、重跑基础设施检查或等待，然后重试完成**；需要人类动作时用 `kanban_block`。
  · ⚠️ 官方明确边界：最后一次 GitHub 读是**完成时刻的快照，不是分布式事务、也不是完成后的持续监控**；这是**单用户生命周期守卫，不是防任意直接写数据库的 OS 隔离**；**GitHub Enterprise 不在覆盖范围**。

## 关键概念

- **Kanban = 持久消息队列 + 状态机**（vs `delegate_task` 的 RPC fork→join）。
- **Board**：独立队列（自己一份 SQLite + workspaces + logs）；`default` 板恒存。
- **Task**：一行 = 标题 + 一个 **assignee（profile 名）** + status 八态 + 可选 tenant / idempotency key。
- **Link**：父→子依赖，全部父 done 才把 `todo` 提升为 `ready`。
- **Comment**：agent 间协议；worker 重启时读整条线程。
- **Workspace 三种**：`scratch`（完成即删）/ `dir:<路径>`（共享目录，须绝对）/ `worktree`（git worktree）。
- **Dispatcher**：60 秒一循环，回收陈旧 claim / 崩溃 worker / 超期 worker，提升、原子认领、spawn。
- **单 dispatcher 姿态**：多网关下只有一个 `dispatch_in_gateway: true`。
- **PR 完成契约**：required checks 必须绿（或 local-only），否则不能 done。
- **`failure_limit`（默认 2）**：连续 spawn 失败自动 block，防捶打。
- **`tip_scratch_workspace`**：首次创建 scratch 工作区时发的小费事件。

## 代码 / 实操

```bash
# 快速开始五步（官方原文）
hermes kanban init                                  # 1. 建板（你）
hermes gateway start                                # 2. 启 gateway（内含 dispatcher）
hermes kanban create "research AI funding landscape" --assignee researcher   # 3. 建任务
hermes kanban watch                                 # 4. 实时看活动
hermes kanban list && hermes kanban stats           # 5. 看板
```

```yaml
# ~/.hermes/config.yaml —— dispatcher（官方原文）
kanban:
  dispatch_in_gateway: true        # 默认：dispatcher 跑在 gateway 里
  dispatch_interval_seconds: 60    # 默认
  review_dispatch: true            # 默认：用 bundled sdlc-review 技能 spawn 评审方
                                   # false = 纯人工评审板
  # dispatch_profiles: [sage]      # 不设=本 home 可认领任何已存在 profile 的卡
                                   # 设成列表=限定认领哪些 assignee（fail-closed：
                                   # 空列表/null/裸键/不可读配置都一个不认领）
```

```yaml
# 工作区三种写法
# scratch（默认）—— 完成即删
# dir:<绝对路径> —— 共享目录，完成后保留
# worktree:<路径> —— 编码任务的 git worktree，完成后保留
```

```bash
# PR 完成契约
hermes kanban create "fix a11y issues" --assignee dev --completion-contract OWNER/REPO
hermes kanban create "local refactor" --assignee dev --completion-contract local-only
hermes kanban unlink <parent> <child>    # 解开被误连的依赖（死锁救援）
```

**本机实测**（2026-09-25，`~/.hermes/kanban.db` + 目录实况）：
```
表：tasks(3) task_links(0) task_comments(1) task_events(20) task_runs(2)
     kanban_notify_subs  task_attachments
事件种类：heartbeat 8 | created 3 | completed 3 | spawned 2 | claimed 2
          tip_scratch_workspace 1 | commented 1

~/.hermes/kanban/        .dispatcher.lock  logs/  workspaces/
  logs/       t_5949ec9d.log (20,460 B)  t_68fc8bb8.log (18,255 B)
  workspaces/ 0 个条目  ← scratch 按要求被删了
```

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25）：

- ⭐ **本机 kanban 目录结构逐项对上官方设计**：`~/.hermes/kanban/` 下有 **`.dispatcher.lock`**（dispatcher 单拥有者的锁）、**`logs/`**、**`workspaces/`** —— 正是官方说的「每板带自己的 workspaces 目录与 logs 目录」。
- ⭐⭐ **`workspaces/` 实测 0 个条目** —— 而 `tasks` 表里两个任务**都写着** `workspace_path: /Users/fkycoya/.hermes/kanban/workspaces/t_xxxx`。这**精确验证了官方那句「scratch 生来就是临时的、任务完成时被删除」**：路径记录还在（审计轨迹），**目录已经被清理掉了**。两个任务都是 `status: done`。
- ⭐ **`tip_scratch_workspace` 事件实测正好 1 条** —— 完美对上官方「**首次**在一个安装上创建 scratch 工作区时，dispatcher 记警告并发出 `tip_scratch_workspace` 事件」。这说明本机那批 kanban 任务就是**这台机器上 kanban 的第一次真实使用**。
- **事件种类分布实测**：`heartbeat 8` ｜ `created 3` ｜ `completed 3` ｜ `spawned 2` ｜ `claimed 2` ｜ `tip_scratch_workspace 1` ｜ `commented 1` —— 与官方列的 `task_events` 状态转换集合（promoted / claimed / heartbeat / completed / blocked / review_requested / changes_requested / gave_up / crashed / timed_out / reclaimed …）**是同一套词汇**；本机出现的是那条**成功路径**的完整子集（**没有** crashed / timed_out / gave_up / blocked，说明这三个任务都跑干净了）。
- ⭐ **`claimed` 事件里的 lock 形态值得记**：本机实录 `{"lock": "nothing.attdns.com:76180", "expires": …}` —— 把**主机名 + PID/端口**编进认领锁里。这正好解释了官方 worker-lanes 页说的 `HERMES_KANBAN_CLAIM_LOCK` 形如 `<host>:<pid>:<uuid>`，以及为什么**陈旧 claim 能被安全回收**（别的机器/进程能看出这条锁不属于自己）。
- 📌 **本机 `task_comments` 那唯一一条评论**（作者 `cto`）是「Comment 作为 agent 间协议」的活样本：内容是「本地项目路径: /Users/fkycoya/Documents/Code/PersonalWebsite。请直接在这个本地目录下进行开发，不需要重新 clone 仓库。」—— 既验证了「worker 被拉起时读整条评论线程」，也说明**本机当初就是用 kanban 来开发 PersonalWebsite 这个仓库本身**（与两个 run 的 `changed_files` 指向 `app/(site)/` 完全吻合）。
- 📌 **本机 `task_links` 实测 0 行**：那三个任务之间**没有依赖链接** → 所以 본机没踩到官方警告的那个「把支持卡链到它要解锁的父卡上」死锁陷阱（它只在多任务有依赖关系时才会发生）。这也解释了为什么事件里**没有** `dependency_wait`。
- 📌 **本机 `~/.hermes/kanban/boards/` 目录不存在** → 只用了 `default` 板，正是官方说的「单项目用户永远待在 default 板上，除了文档那一节以外永远不会看到 board 这个词」。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
