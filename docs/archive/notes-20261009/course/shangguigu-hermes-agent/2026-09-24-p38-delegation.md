---
title: "P38 38_协作篇_任务委派展示"
date: "2026-09-24"
summary: >-
  P38 · 38_协作篇_任务委派展示（7:56）
status: published
tags:
  - "Hermes"
  - "多 Agent"
lang: zh
chapter: "P38"
series: "shangguigu-hermes"
seriesOrder: 38
---

## 课时概要

协作篇 · 任务委派展示。官方 README「Delegates and parallelizes」：**Spawn isolated subagents for parallel workstreams** —— 派生隔离子代理做并行工作流，也可写 Python 脚本经 RPC 调工具把多步流水线压成零上下文成本的一轮。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档（Delegation 页 / Kanban 页 / Kanban tutorial / Kanban worker lanes / Kanban multi-gateway / Delegation patterns 六页）与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑/实读得到的真实状态。

**视频**：[38_协作篇_任务委派展示](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=38) ｜ 时长 7:56 ｜ P38

## 本节要点

- **`delegate_task` 是什么**：一次 **RPC 调用（fork → join）** —— 父 agent **阻塞**到子代理返回，结果回到父的上下文。官方在 Kanban 那页给的对照原话：**「`delegate_task` 是函数调用」**。
- **两种调用形状**：单任务 `delegate_task(goal=…, context=…)`；**并行批次** `delegate_task(tasks=[{…},{…}])` —— **默认最多 10 个并发子代理**（可配置，**无硬上限**）。
- ⭐⭐ **最关键的一条：子代理什么都不知道**（官方用 Critical 框强调）—— 子代理从**一个全新对话**开始，对父的对话历史、先前的工具调用、之前讨论过的一切**零知识**；它唯一的上下文来自父在调用时填的 **`goal` 与 `context`**。
  · **一个例外**：当父有**已解析的工作区目录**时，每个子代理的 system prompt 会**嵌入该工作区的项目上下文文件**（`.hermes.md` > AGENTS.md 链 > CLAUDE.md > `.cursorrules` —— **与主 agent 相同的发现顺序、优先级与大小上限；SOUL.md 被排除**）→ 子代理在 repo 里作业时**自动遵循该 repo 自己的约定**，不必重新发现。
  · 所以父**必须把子需要的一切都传进去** —— 官方给了 BAD/GOOD 对照：`goal="Fix the error"` 是无效的（子不知道「那个 error」是什么），正解是把文件、行号、异常、相关函数的行为、项目路径、语言版本全写进 `context`。
- ⭐ **结构化输出（`output_schema`）**：每个任务可带一个 JSON Schema，子代理的最终答案必须通过它校验。子代理**一开始就看到**这个输出契约（提示语是 `return ONLY the JSON value — no prose, no code fence`）；父回来校验，**失败就发恰好一轮有界纠正**（**原样带上校验错误**，且**不重贴 schema**）；任务结果随后多出 `schema_valid`（true/false）与失败时的 `schema_errors`。
  · ⭐ **契约未命中不会丢掉子代理的活**：结果保持 `status: completed` + 子的**原始最终文本**放在 `summary` + `schema_valid: false` + `schema_errors` + 一条 `schema_note` 说明这段文本未校验 → **父从原文里取所需，而不是重跑一个可能跑了一小时的任务**。校验器**容忍**合法 JSON（对象或数组）外面的散文或代码围栏。
  · 官方建议：**schema 要写得宽容**，只 require 你**真会去读**的字段。没有 `output_schema` 的任务不受影响。
- **模型覆盖**：`delegation.model` / `delegation.provider`（不设则子代理用与父相同的模型）。解析顺序：`delegation.base_url`（直连端点）优先 → 否则 `delegation.provider`（经运行时 provider 系统解析的完整凭证包）→ 两者都没设时子继承父的 provider 与凭证；`delegation.model` **在所有分支都生效**，为空时子继承父的模型。
- ⭐⭐ **成本策略：前沿模型做规划，便宜模型做执行**（官方专门写了一节，观点很值得记）：**把一个间题分解成规格良好的子任务需要前沿级判断力；但执行一个已经带着清晰目标、完整上下文与输出契约的子任务通常不需要**。而 token 的大头恰恰在子代 —— **一批并行子代理通常烧掉一次运行总 token 的绝大部分，所以 worker 模型才是成本真正所在**。把 `delegation.model` 钉在一个便宜模型、主会话保持前沿模型 = **规划质量留在该在的地方，开支砍在量最大的地方**。
  · ⚠️ **但这个 pin 是全局的**：`delegate_task` **没有 per-task 模型参数**，所以**批次里每个子都跑那个配置的 delegation 模型**。质量敏感的子任务要用更强模型 → 要么**该会话不设 `delegation.model`**，要么**把任务交给 kanban 板（它支持 per-task 模型覆盖）**。
- ⭐ **`/review` 命令**：派生一个**独立、全权限的后台子代理**，它唯一的职责是审查你这次对话**刚产出的工作**（PR、diff、代码、文档、设计）。CLI / TUI / Desktop / **每一个 gateway 消息平台**都能用。`/review` 审最后 10 条消息呈现的东西，`/review focus on security` 可加额外指令。
  · **最后 10 条 user/assistant 消息被快照**成审查者的起点证据（**工具输出与系统消息被排除**）
  · 审查者走**与 `delegate_task` 同一条后台委派轨道** → 拿到**完整的常规子代理工具集**（terminal、web、files、browser…）→ 所以它**真的会打开 PR、读 diff、跑代码**，而不是靠摘录判断
  · **继承主 agent 的工作上下文**：主 agent 加载过的技能（启动预载或会话中 `skill_view`）会在它的简报里被点名，并附上「加载它们并按其约定评判这份工作」的指令；像每个子代理一样，它的 system prompt 也嵌入工作区的项目上下文文件作为**有约束力的约定**
  · 完成后，**它的完整审查作为一次普通的后台子代理完成回到同一个会话** → 主 agent 看到并可以据此行动（修 findings、推后续、回你）。官方给的典型流程：**主 agent 开 PR → 你打 `/review` → 第二双眼睛去查，而你继续干活**；审查落在聊天里、**发给创建了那个 PR 的 agent**。
  · 派发只打印 `Review started. Results will return here.`；经典 CLI 里 composer 上方的 dock 显示耗时与最新活动，**Ctrl+T（或 F6）** 打开名单（含它的模型、transcript、steering、停止控制）；TUI 与 Desktop 的子代理查看器里也带同样的 review 标签
  · **审查模型**：默认用你的主模型；要钉专用审查模型就设 `auxiliary.review`（`provider: auto` + 空 `model` = 继承主模型，即默认行为）
  · ⚠️ 官方特别点明 **`/review` 与 `/refine` 是不同的东西**：**`/refine` 审查对话以更新记忆与技能，`/review` 审查对话产出的工作成果**。
- ⚠️ **工具继承与屏蔽**（安全设计）：`delegate_task` **不接受面向模型的 `toolsets` 参数** —— 每个子代理**继承父已启用的 toolsets**，这样**模型不能给子代理授予父自己没有的能力**（如果委派出去的工作需要额外能力，要在**开始这次对话之前**配置父的工具）。
  · 某些工具**即使父有、对子代理也被屏蔽**：`delegate_task`（对**叶子**子代理屏蔽；只有 `role="orchestrator"` 的子代理保留，受 `max_spawn_depth` 约束）｜ `clarify`（**子代理不能与用户交互**）｜ `memory`（**不写共享持久记忆**）｜ `send_message`（**无跨平台副作用**）｜ `cronjob`（**不能以父的名义排更多工作**）
  · 两种角色**都保留 `execute_code`**（程序化工具调用）→ 子代理能批量做机械活。
- **最大迭代**：每个子代理有迭代上限（**默认 250**），控制它能做多少轮工具调用。⚠️ 这个限制**全局设在 `config.yaml`、作用于每一个子、不是 `delegate_task` 的 per-call 参数**。耗尽的子返回 `exit_reason: max_iterations` + `truncated: true` → **父能区分「预算停下」与「任务完成」**。
- ⭐⭐ **子超时：默认没有墙钟超时（设计理念值得记）** —— 子代理**只因它实际在做的事失败**（API 错、工具错、耗尽迭代预算），**从不因为委派层的秒表而失败**。官方明确解释了为什么改成这样：早期版本有硬顶（先是 300s，后来 600s），**不断把合法忙碌的子代理杀在半途** —— 深层代码审查、大研究扇出、慢推理模型**常规性地需要 10 分钟以上，而全程都在稳定前进**。
  · **真卡住的子仍会被检测**（无论有没有配置上限）：**心跳陈旧监控**盯着每个子的进展信号（API 调用、工具启动、活动时间戳）。**进展完全冻结超过阈值** —— **轮次之间 450 秒空闲，或工具内 1200 秒** —— 就被中断、其等待被放弃，父收到 `status: "timeout"` 条目，错误写明它多少次调用后停止了进展、静默了多久。**这个等待甚至在没有 gateway 看门狗的一次性运行里也会结束**（`hermes chat -Q`、Bot Chat one-shot、cron）→ **卡死的子再也不能永远占住那一轮或它的会话租约**。
  · ⭐ **在途的模型等待仍算进展**（子代理在等 provider 时会刷新活动时钟）→ **慢的本地模型 / 长 prefill 的补全不会被当成停滞**。
  · 想要上限可以 opt-in：`delegation.child_timeout_seconds`（**默认 0 = 无超时**，**下限 30s**）。⚠️ 正值限制的是**不活动**而非总运行时长 —— **它是最长可以多久没有任何进展**（没有完成的 API 调用、没有工具变化、没有活动时钟跳动）才被放弃；**每个进展迹象都重启这个窗口**。
  · **在空闲窗口约 80% 时**，子会通过它的 steer 通道收到一行 `[delegation budget warning]`（在它下一个迭代边界送达），告诉它已经空转了多久、**让它现在返回摘要** → 这样「慢但可恢复」的子能收尾，**而不是丢掉上下文**。这个警告**每个空闲窗口只发一次**，进展恢复后重新武装。
  · 超时结果带结构化元数据（父与钩子无需解析文本就能区分秒表杀与其他失败）：`timeout_seconds`（实际结束等待的那个限制）｜`timed_out_after_seconds`（真实墙钟）｜`last_event_age`（等待结束时子已经静默了多久 —— **一眼分辨慢 provider 与失控**）｜`timeout_phase`（`before_first_llm_call` = 从未发出第一次请求 / `after_llm_calls`）。非超时错误时这四项都是 `null`。
- **失败可见性：子失败永不静默**（官方原话）：① **CLI** 的委派树打印一行原因，形如 `⚠️ Subagent failed — "your goal": HTTP 404: model not found (after 12s)`；批量运行把原因附到每个任务的 `✗` 完成行 ② **gateway 平台**（Telegram/Discord/Slack…）把**同一行**作为**独立聊天通知**投递，**即使该平台的 `tool_progress` 是关的** ③ **父 agent** 的 tool result 带 `status: "failed"` + 完整 `error` 文本 → 模型能反应（重试、改道、报告）。错误文本被**缩减到最有信息量的那一行**（异常消息，而不是一整面 traceback）并限长。
  · **零调用超时的诊断 dump**：配了硬顶时，若子代理**一个 API 调用都没发出就超时**（通常是 provider 不可达、认证失败、或工具 schema 被拒），`delegate_task` 会写一份结构化诊断到 `~/.hermes/logs/subagent-timeout-<session>-<timestamp>.log`，含子的 config 快照、**凭证解析轨迹**、早期错误、以及**所有活线程的栈**（不只是子自己的）—— 原因：一个停在嵌套 helper 线程上的子，在没有全貌的情况下**和慢 provider 无法区分**。
- **后台进程归属（容易误解的一块）**：后台终端进程**属于启动它的那个 agent**。委派拆除时关闭子**会终止它剩余的进程**（包括更早轮次启动的），**但不会停父或兄弟 agent 拥有的进程**；⚠️ **共享终端环境并不转移进程所有权**。
  · 子应当**等它的构建、测试与其他有界后台命令完成**再返回最终摘要。如果某个 CI watcher 或服务器必须在子结束之后继续跑，就**在父会话里启动它** —— ⚠️ **返回一个进程 ID 并不把所有权转给父**。
  · 子结束前有三个**诚实的选项**（`process_manage`）：**wait**（`action="wait"` 自己等并报告结果）｜ **kill** ｜ **handoff**（`action="handoff", data="<一句话：它是干什么的>"`）—— 运行时在**注册表锁**下把所有权转给父（**每个子最多 3 个**，只接受**子拥有的、正在运行的**进程，其他一律工具报错）。之后父的完成通知会带着 `Handed off to you by a subagent… Purpose: …` 到达父聊天，父可以像自己的进程一样 poll/log/kill。
  · **在子还在跑时就已经完成的进程不需要交接**：子 `poll`/`wait`/`log` 读它并报告即可。**若子从未读它**，退出码与输出尾巴会作为 **`unread_completions`** 附在它的结果上给父看。仍在跑且**既没被杀也没交接**的会在结果里被点名（**`orphaned_processes`**），并在父的委派通知里报为**已终止** —— ⭐ 所以**父是从运行时、而不是从子的散文里**得知「那个 watcher 还在跑」已经不成立。
  · 官方给的更好模式：**CI watcher 这类，让子只返回事实（PR 号、SHA），由父启动自己的 watcher**。

## 关键概念

- **`delegate_task`**：一次 RPC 式的 fork → join 调用，父阻塞等子返回。
- **子代理零上下文**：全新对话；唯一输入是父填的 `goal` + `context`（**唯一例外**：工作区项目上下文文件会被嵌入）。
- **`output_schema` 输出契约**：JSON Schema 校验 + 恰好一轮有界纠正；失败也保留子的原文。
- **`delegation.model` / `delegation.provider`**：子代理的模型与 provider（**全局 pin，无 per-task 覆盖**）。
- **前沿规划 + 便宜执行**：成本大头在子代，所以 worker 模型是省钱点。
- **`/review`**：全权限后台审查子代理；证据 = 最后 10 条消息；结果回到同一会话。
- **工具继承制**：子只继承父已启用的 toolsets，且五种工具对子屏蔽（delegate_task / clarify / memory / send_message / cronjob）。
- **心跳陈旧监控**：450s 轮次间 / 1200s 工具内无进展才判停滞（**在途模型等待算进展**）。
- **`handoff`**：把子启动的后台进程所有权交给父（每子最多 3 个）。
- **`failed` / `timeout` 结构化结果**：`status`、`exit_reason`、`truncated`、`timeout_phase` 等字段。

## 代码 / 实操

```python
# 单任务
delegate_task(goal="Debug why tests fail", context="Error: assertion in test_foo.py line 42")

# 并行批次（默认最多 10 个并发）
delegate_task(tasks=[
    {"goal": "Research topic A", "context": "Focus on recent primary sources"},
    {"goal": "Research topic B", "context": "Compare the leading explanations"},
    {"goal": "Fix the build", "context": "Project root: /home/user/project"},
])

# 带输出契约
delegate_task(tasks=[{
    "goal": "Check which of these three endpoints return 200",
    "context": "https://a.example, https://b.example, https://c.example",
    "output_schema": {
        "type": "object",
        "properties": {
            "healthy": {"type": "array", "items": {"type": "string"}},
            "failing": {"type": "array", "items": {"type": "string"}}
        },
        "required": ["healthy", "failing"]
    }
}])
```

```yaml
# ~/.hermes/config.yaml —— 前沿规划 + 便宜执行（官方原文）
model:
  default: "your-frontier-model"     # 父（规划者）留在前沿模型
delegation:
  model: "your-inexpensive-model"    # 所有 delegate_task 子代都跑这个
  provider: "openrouter"             # 可选：把子代路由到别的 provider
  max_iterations: 60                 # 简单任务舰队调低；长调研调高（默认 250）
  child_timeout_seconds: 0           # 默认 0 = 无超时；正值是不活动上限（下限 30s）
auxiliary:
  review:
    provider: openrouter             # /review 的专用审查模型
    model: anthropic/claude-opus-4.6
```

```
/review                      # 审查最后 10 条消息呈现的工作
/review focus on security    # 加额外指令
```

**本机实测**（2026-09-25，`~/.hermes/config.yaml` 实录）：
```yaml
delegation:
  child_timeout_seconds: 600     # ⚠️ 非官方默认（默认 0=无超时）——本机显式设了 600s
  inherit_mcp_toolsets: true
  max_concurrent_children: 10    # = 官方默认
  max_iterations: 250            # = 官方默认
  max_spawn_depth: 1
  model: ''                      # 未设 → 子代理继承父模型
  provider: ''                   # 未设 → 继承父 provider 与凭证
  orchestrator_enabled: true
  subagent_auto_approve: false
```

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25）：

- 本机 `config.yaml` 的 `delegation` 段实录 10 个键 —— **大部分走默认**（`max_concurrent_children: 10` / `max_iterations: 250` / `max_spawn_depth: 1`），但 **`child_timeout_seconds: 600` 是显式设过的**（官方默认是 **0 = 无超时**）。按官方定义这里限的是**不活动**而非总时长，所以本机的子代理在静默 600 秒后会被放弃 —— 这正是给「无人值守」场景设的那种上限。
- 本机 `delegation.model` 与 `provider` **都是空** → 子代理**继承父的模型与 provider**，所以官方那套「前沿规划 + 便宜执行」的分档**在本机没有启用**（省钱点还在桌上）。
- ⭐ **本机 kanban 库里恰好有两个真实运行的对照物**：`task_runs` 里两条 run 的 `profile` 都是 **`dev`**、`outcome` 都是 **`completed`**，并且都带 **`changed_files`**（`app/(site)/projects/page.tsx` + `app/globals.css`；`app/(site)/about/page.tsx` + `app/globals.css`）→ 说明**本机实际是用 Kanban 派发的（不是 `delegate_task`）**，而且派发的活真的改到了 PersonalWebsite 仓库的文件。
- ⭐ **心跳机制在本机有硬证据**：`task_events` 里 `heartbeat` 共 **8 条**，其中一条任务的 run 里连续三条 heartbeat 时间戳相差 **恰好 60 秒**（1781574979 → 5039 → 5099）→ 与官方描述的「进展信号 = 活动时间戳跳动」是同一个东西；这也正是官方「心跳陈旧监控」用来判「真卡住」的依据。
- ⚠️ 本机 `logs/` 目录里有**两个真实 worker 日志**：`t_5949ec9d.log`（20,460 B）与 `t_68fc8bb8.log`（18,255 B），命名与官方说的 `<board-root>/logs/<task_id>.log` **完全一致**。
- 📌 一条能对上官方设计的细节：本机 `task_comments` 里那唯一一条评论的作者是 **`cto`**，内容是「本地项目路径: /Users/fkycoya/Documents/Code/PersonalWebsite。请直接在这个本地目录下进行开发，不需要重新 clone 仓库。」—— 这正是官方说的 **Comment 是 agent 间协议、worker 被拉起时会读整条评论线程作为上下文**的活样本（而且它解决的问题恰好是 P38 强调的「子代理零上下文、必须把路径喂给它」）。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
