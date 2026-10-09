---
title: "P34 34_协作篇_消息网关使用邮箱"
date: "2026-09-24"
summary: >-
  P34 · 34_协作篇_消息网关使用邮箱（11:32）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P34"
series: "shangguigu-hermes"
seriesOrder: 34
---

## 课时概要

协作篇 · 消息网关使用邮箱。Hermes 的 messaging 体系里邮箱是一个平台，官方文档有 Email 页；配套技能 agentmail 提供邮箱读写能力。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档 Messaging 页（含平台对照表 / 架构 / 看门狗 / 投递台账 / 权限分层 / 频道覆盖等节）与 Email 页原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑/实读得到的真实状态（本轮只观测，未改任何平台配置）。

**视频**：[34_协作篇_消息网关使用邮箱](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=34) ｜ 时长 11:32 ｜ P34

## 本节要点

- **gateway 是什么**（官方 Architecture）：它是一个常驻守护进程 —— **每个平台适配器收到消息 → 经 per-chat session store 路由 → 分派给 `AIAgent` 处理**；⭐ **gateway 同时跑 cron 调度器**，每 60 秒 tick 一次执行到期任务。（所以 P33 讲的 cron 与实际运行的是**同一个进程**。）
- **平台能力对照表**（官方给的一张表，选平台前必看）—— 维度是 Voice / Images / Files / Threads / Reactions / Typing / Streaming：
  · **七项全满**：Discord、Slack、Matrix、**Feishu/Lark**
  · **Telegram**：六项，唯独没有 Reactions
  · **Email**：只有 Images / Files / Threads（**没有 voice、reactions、typing、streaming**）
  · **WeCom / ntfy / Raft / IRC**：能力最弱（基本只收发文本）
  · WhatsApp / Signal / Weixin / QQ 属于中间档（有图/文件/typing，无 reactions）
  官方注明：Voice = TTS 语音回复与/或语音消息转写；Streaming = 通过编辑消息做渐进式更新。**Hermes Relay**（实验）不是平台本身，而是连接器系统，能力在握手时逐连接器协商。
- **静默令牌（Intentional Silence Tokens）**（群聊/钩子/自动化必备）：如果 agent 的**最终响应恰好只是一个**受支持令牌，gateway **抑制投递、什么都不发**。受支持：`[SILENT]` ｜ `SILENT` ｜ `NO_REPLY` ｜ `NO REPLY` ｜ `[静默]`/`静默` ｜ `[沉默]`/`沉默`（**中文渲染也被认**，因为模型常把哨兵词翻译掉）。
  · 空白与大小写归一化，**但必须整个响应就是这个令牌** —— 「一句话里提到 `[SILENT]`」（如“什么都没变时用 `[SILENT]`”）会**正常投递**。
  · ⭐ **静默只是投递决定**：Hermes **仍把这一轮保留在会话记录里**（`user: …` → `assistant: [SILENT]` 存但不发）→ 所以对话仍然正常交替。**失败轮次仍以错误形式浮现**，不会因为文本像静默令牌就把失败藏掉。
- **快速设置**：`hermes gateway setup` —— 交互向导（方向键选择），会显示哪些平台已经配好，结束时提供启动/重启 gateway。
- **gateway 命令族**：`hermes gateway`（前台运行）｜ `hermes gateway setup`（交互配置平台）｜ `hermes gateway install`（macOS launchd / Linux 用户服务）｜ `sudo hermes gateway install --system`（**仅 Linux**：开机系统服务）｜ `start` / `stop` / `status` ｜ `hermes gateway status --system`（仅 Linux）。
- **按需栈转储：`kill -USR2 <gateway pid>`**（Linux/macOS）—— 会把**每个线程的栈**追加到 `~/.hermes/logs/gateway_faulthandler.log`，**而 gateway 继续运行**。用途：在不重启的前提下看清「卡住/行为异常的 gateway 到底在干什么」。
- **内置事件循环存活看门狗（跨全平台）**：gateway 跑一个**环外** watchdog 线程探测 asyncio loop（`gateway.loop_watchdog_probe_interval_s` 默认 **30s**）。当 loop 连续 `gateway.loop_watchdog_max_strikes`（默认 **3**）次探测都停止派发 —— 此时 **housekeeping、cron 调度器、内嵌 kanban dispatcher 已经全部一起冻住** —— watchdog 会：① dump 所有线程栈到日志 ② 把 `gateway_state.json` 标成 `gateway_state: degraded` + `exit_reason: loop_liveness_watchdog` ③ **以退出码 75 退出**，让服务监管器重启它。`hermes gateway status` 会渲染成 `⚠ Gateway exited degraded: event loop stopped dispatching …`，仪表盘的 gateway 徽章显示 Degraded。`gateway.loop_watchdog: false` 可关。
- ⭐ **`gateway_state.json` 同时是心跳**（这条很实用）：housekeeping 每 tick（60s）会重写它的 `updated_at`。所以当**进程还活着、但该时间戳超过 120s 没更新**时，`hermes gateway status` 会打印 `⚠ Gateway heartbeat stale: housekeeping has not refreshed gateway_state.json for N s …`，仪表盘徽章读作 Heartbeat stale —— 这正是官方说的「**看着在跑，但什么都没被调度**」那一类。修法：重启 gateway。
- **可选 Linux event-loop watchdog（systemd 层）**：`gateway.systemd_watchdog_seconds: 120` → 生成的 unit 改用 `Type=notify` + `NotifyAccess=main` + 匹配的 `WatchdogSec`；**Hermes 只在事件循环及时推进时发心跳**，停了就由 systemd 重启进程。改完必须 `hermes gateway install --force` 重新生成 unit。默认 `0` 保持 `Type=simple`。**仅 Linux/systemd**，且不会把普通的平台网络断线当成事件循环故障。
- **聊天内的斜杠命令**（消息平台里能用的，官方给了一张大表）：`/new` `/reset`（新对话）｜ `/model [provider:model]` ｜ `/personality [名字]` ｜ `/retry` `/undo` ｜ `/status` `/whoami`（看你在该作用域的斜杠命令权限）｜ `/stop` `/approve` `/deny` ｜ `/sethome`（把本聊天设为 home channel）｜ `/compress` ｜ `/title` `/resume` `/sessions [all] [search <query>]` ｜ `/usage` `/insights [days]` ｜ `/reasoning [level|show|hide]` ｜ `/voice` ｜ `/rollback` ｜ `/bg <prompt>`（后台会话）｜ `/btw <question>`（旁问，不打断当前对话）｜ `/reload-mcp` ｜ `/update` ｜ `/help` ｜ **`/<skill-name>`（任何已安装技能都能直接当命令调）**。
- **会话持久化与查找**：会话跨消息持久，直到重置。`/sessions` 列出**当前聊天**的既往会话（含正在用的那条，标 `(current)`），`/sessions <名字>` 恢复它（`/resume` 的简写）；列表长了用 **`/sessions search <query>`**（别名 `find`）按标题或 session-id 过滤，按最近活动排序。⚠️ **`/sessions all` 跨来源列举仅管理员可用** —— 普通用户会收到一条说明（列表保持 chat-scoped），且**只能看到自己聊天来源的会话**。
- **`/model` 覆盖会持久化（跨重启存活）**：gateway 里切 `/model` 作用于该会话，并且**模型/provider 选择会持久化进 session store，重启后首次使用时再水合**（凭证在加载时重新解析、**绝不写盘**）。`/new`（或 `/reset`）清除该覆盖；`/model <name> --global` 则**写穿到 `config.yaml`**；`/model <name> --once` 只作用一轮。
- ⭐ **投递可靠性：durable delivery ledger（诚实 at-least-once）** —— 最终响应在每次平台发送的前后被记进 `state.db` 的**投递台账**。如果 gateway 在「产出响应」与「平台确认收到」之间崩溃/重启，**下次启动会重投存下的响应**，而不是丢掉它（也不是重跑整轮）。语义刻意做成诚实的**至少一次**：
  · 发送**从未开始**的 → 原样重投
  · 死亡时**正在发送中**的（平台可能收到也可能没收到），**以及上一次启动还在发的重投** → 重投时带可见前缀 **`♻️ Recovered reply — … may be a duplicate`** —— 官方原则是「**含糊就标出来，绝不静默重发**」
  · 被**限流**拒掉的最终发送，会在记录的惩罚期过后**自动重试**（不需重连或重启）；惩罚期内重启会采用存下的回复，**不消耗重试次数、也不重跑 agent**；重试保留原 bot profile / chat / thread；限流恢复前缀会警告先前的分片可能已到达
  · 其他被拒的最终发送按**增长退避**重试（30 秒，然后 2 分钟）；**最后一个预算内尝试留给下次 gateway 启动**，所以超时的故障不会让回复永远搁浅；**永久不可达的聊天**（bot 被拉黑、群被删）不重试
  · 重投有界：**3 次尝试 / 24 小时新鲜度**，然后放弃；已投递行 **7 天**后剪枝；`gateway.delivery_ledger: false` 关闭（恢复旧行为：崩溃时在途响应丢失）
- **会话连续性**：gateway 对话**不会因闲置或跨天自动重置**（只有 `/new` / `/reset` 会）；上下文压缩仍是自动的。缓存中的 agent 可被释放以回收资源，但**不替换那份耐久对话**；重启恢复的「新鲜度」限制的是**自动延续**，不是你发消息时加载的历史。
- **按频道覆盖模型与 system prompt**：一个 gateway 就能让不同频道跑不同模型/人格（官方例子：`#daily` 用便宜快模型、`#dev` 用前沿模型 + 专家 prompt）。配置 `platforms.<平台>.channel_overrides.<频道或线程 id>`，三个键都可选（`model` / `provider` / `system_prompt`），未设的字段回落全局默认。
  · **查找顺序：精确频道/线程 id 优先，然后父频道/论坛 id** → Discord 线程**自动继承父频道**的覆盖
  · **模型解析优先级：会话 `/model` 覆盖 → `channel_overrides` → 全局配置**（用户在聊天里跑的 `/model` 仍然赢过频道默认）
  · `system_prompt` 覆盖**替换该频道**的全局 gateway prompt，且是**临时的**（每轮注入，不存进历史）
- **安全：默认拒绝**。⚠️ 默认 gateway **拒绝所有不在 allowlist、或没通过 DM 配对的人** —— 这是带终端访问的 bot 的安全默认。配置形态三选一：每平台 `*_ALLOWED_USERS`（`TELEGRAM_` / `DISCORD_` / `SIGNAL_` / `SMS_` / `EMAIL_` / `MATTERMOST_` / `MATRIX_` / `DINGTALK_` / **`FEISHU_`** / `WECOM_` / `WECOM_CALLBACK_` / `TEAMS_`）→ 或全局 `GATEWAY_ALLOWED_USERS` → 或 `GATEWAY_ALLOW_ALL_USERS=true`（官方标 **NOT recommended** for bots with terminal access）。
- **DM 配对（allowlist 的替代路线）**：未知用户 DM bot 时会收到一个**一次性配对码**（用户看到 `Pairing code: XKGH5N7P`），你用 `hermes pairing approve telegram XKGH5N7P` 批准；配套 `hermes pairing list`（看待批 + 已批）/ `hermes pairing revoke telegram 123456789`。配对码 **1 小时过期**、有限流、用密码学随机。⚠️ **Email 是例外**：未知名邮件发件人**默认被忽略**，除非显式启用 email 配对。
- **管理员 vs 普通用户（两层权限，P34 的安全重点）**：allowlist 回答「**这人能不能够到这个 bot**」；admin/user 分层回答「**进来了以后允许做什么**」。
  · 每个允许的用户在**每个作用域**（DM vs 群/频道）各属一档：**Admin = 全权**（能跑每一个已注册斜杠命令，含内置与插件，以及所有受门控能力）｜**Regular user = 受限**（能正常和 agent 聊天，但**只能跑你显式启用的斜杠命令**；永远允许的地板是 `/help` 与 `/whoami`）。
  · ⚠️ **DM 管理员不蕴含群/频道管理员** —— 两个作用域各自一份管理员列表。
  · 今天门控的**只是斜杠命令**（走活的命令注册表，所以内置与插件命令都覆盖、无需逐特性接线）；**普通聊天不受影响**。官方说明：未来会有更多能力面（工具访问、模型切换、昂贵操作）挂到**同一个 admin/user 区分**上 —— 所以**现在配好，将来这些限制会自然生效**，不必重新建模谁是管理员。
  · 配置：`gateway.platforms.<平台>.extra.{allow_from, allow_admin_from, user_allowed_commands}`，群/频道可另配 `group_allow_admin_from` / `group_user_allowed_commands`。**向后兼容**：某作用域没设 `allow_admin_from` 就**禁用分层**，所有被允许用户都是全权。
  · 用 **`/whoami`** 看当前作用域、你的层级（admin / user / unrestricted）、以及你能跑哪些斜杠命令；配了管理员列表时，`/help` 对非管理员**只显示其能跑的命令**。
- **纠正正在干活的 agent（Redirecting）**：agent 工作时你发消息会**纠正当前轮**，而不是另起：模型生成**带着上下文重启**（已展示的推理与可见的部分文本作为普通 assistant checkpoint 保留）｜**已完成的工作保持可用**（先前的工具调用与结果留在本轮）｜**正在跑的工具会安全跑完**（修正在**下一个工具结果边界**应用，而不是杀掉工具）｜`/stop` 仍是硬停。
- **忙碌输入模式三选一**（`display.busy_input_mode`）：**`interrupt`（默认）** —— 给忙碌 agent 发消息会重定向当前轮（连正在跑的前台终端命令都会被**移到后台**而不是杀掉，让你的消息立刻被读到）｜**`queue`** —— 后续消息排队，当前任务结束后作为下一轮跑；每个后续消息各得一轮（按到达顺序），**只有连拍照片会并成一个相册轮**｜**`steer`** —— 用 `/steer` 把后续消息**注入当前运行**，在**下一个工具调用之后**到达 agent，不打断也不开新轮；agent 还没开始则回落到 queue。
  · 配套：`display.busy_ack_enabled`（false 可完全静音 ⚡/⏳/⏩ 回执）｜ `busy_text_debounce_seconds`（默认 0.35）｜ `busy_text_hard_cap_seconds`（默认 1.0）。**这四个键都从各 profile 自己的 `config.yaml` 读**，所以多路复用 profile 各自保持独立的忙碌策略，**没有进程环境变量覆盖**。首次给忙碌 agent 发消息会附一行一次性提示（由 `onboarding.seen.busy_input_prompt` 闩住）。
- **澄清问题（支持多选）**：agent 用 `clarify` 工具提问时，gateway 渲染成**编号提示**（支持的平台用原生按钮）。**多选**：消息平台提示里会写 “Multiple selections allowed”，你回复数字（逗号或空格分隔，如 `1, 3`）、或选项文本、或自己的自由回答；经典 CLI/TUI 渲染成**复选框**（空格切换、回车提交）。单选行为不变。
- **Email 作为 gateway 平台（本分P 的载体）**：⚠️ 官方开篇就强调**两个不同的东西别混** —— ① **Email gateway 适配器**（本页）：让人**给 agent 发邮件并收到回复**，除一个 IMAP/SMTP 邮箱账号外**无外部依赖** ② **bundled Himalaya email 技能**：让 agent **通过终端命令**检查/撰写/移动/管理邮箱，需要外部 `himalaya` CLI + `~/.config/himalaya/config.toml`。
  · **前置条件**：一个**专用**邮箱账号（官方明确说**别用个人邮箱**）｜ 账号开启 **IMAP** ｜ 用 Gmail 或带 2FA 的 provider 需要**应用专用密码**（Gmail 路径：开 2FA → App Passwords → 新建 → 拿 16 位密码代替常规密码）。
- ⚠️ **Desktop / dashboard 里的 messaging 状态怎么读**（官方专门提醒）：messaging 状态属于「**所选机器上的所选 profile**」。`hermes gateway setup` 保存的凭证**可以启用一个基于凭证的平台，而不需要 `config.yaml` 里有 `platforms` 条目**；但**显式 `platforms.<name>.enabled: false` 仍然禁用它**。**另一个 profile 永远不会继承 server 进程的凭证**；没有必需凭证字段的平台**不会仅因为那个列表为空就被启用**。最关键的一句：**「已保存」只意味着凭证存了 —— 不意味着 messaging gateway 在跑、也不意味着平台已连上**；所以一个「已启用」的平台完全可以正确地显示「Messaging gateway stopped」。

## 关键概念

- **Gateway**：常驻守护进程，把 18+ 种消息平台接到 AIAgent；同时承载 cron 调度器与内嵌 kanban dispatcher。
- **平台适配器 + per-chat session store**：每个平台一个适配器，消息按聊天落到独立会话再分派。
- **静默令牌**：`[SILENT]` / `NO_REPLY` / `静默` 等 —— 只抑制投递，不改变对话记录。
- **投递台账（delivery ledger）**：`state.db` 里的耐久投递记录，做成诚实的 at-least-once，含糊重投会带 `♻️ Recovered reply` 前缀。
- **loop watchdog / degraded / heartbeat stale**：环外看门狗 + `gateway_state.json` 心跳，用来区分「真活着」与「看着在跑但没调度」。
- **allowlist / DM 配对 / admin vs user**：三层递进 —— 能不能够到 → 怎么被批准 → 进来后能做什么。
- **channel_overrides**：按频道/线程覆盖模型与 system prompt（线程继承父频道）。
- **busy_input_mode**：`interrupt`（默认，把前台命令挪后台）/ `queue` / `steer`。
- **Himalaya 技能 vs Email 适配器**：前者让 agent 用终端管邮箱，后者让人给 agent 发邮件。

## 代码 / 实操

```bash
# 安装与生命周期
hermes gateway setup            # 交互式配置所有消息平台
hermes gateway install          # macOS launchd / Linux 用户服务
sudo hermes gateway install --system   # 仅 Linux：开机系统服务
hermes gateway start|stop|status
hermes gateway                  # 前台运行

# 排障
kill -USR2 <gateway pid>        # 按需 dump 所有线程栈，gateway 继续跑
hermes pairing list             # 待批 + 已批用户
hermes pairing approve telegram XKGH5N7P
hermes pairing revoke telegram 123456789
```

**按频道覆盖模型/人格**（官方原文）：
```yaml
platforms:
  discord:
    enabled: true
    channel_overrides:
      "123456789012345678":        # 频道/线程 id
        model: anthropic/claude-sonnet-4.6
        provider: anthropic
        system_prompt: "You are the #dev channel code-review specialist."
      "987654321098765432":
        model: openai/gpt-5-mini
```

**安全（默认拒绝 + 管理员分层，官方原文）**：
```bash
FEISHU_ALLOWED_USERS=ou_xxxxxxxx,ou_yyyyyyyy
GATEWAY_ALLOWED_USERS=123456789,987654321
# GATEWAY_ALLOW_ALL_USERS=true   # 不推荐（有终端访问的 bot）
```
```yaml
gateway:
  platforms:
    discord:
      extra:
        allow_from: ["111", "222", "333"]
        allow_admin_from: ["111"]                 # 管理员 → 全部斜杠命令
        user_allowed_commands: [status, model]    # 普通用户只能跑这些
        group_allow_admin_from: ["111"]           # 群/频道作用域单独一份
        group_user_allowed_commands: [status]
```

**忙碌输入与投递**：
```yaml
display:
  busy_input_mode: steer        # or queue, or interrupt (默认)
  busy_ack_enabled: true        # false 可完全静音忙碌回执
  busy_text_debounce_seconds: 0.35
  busy_text_hard_cap_seconds: 1.0

gateway:
  delivery_ledger: true          # 默认；false = 崩溃时在途响应丢失
  loop_watchdog: true            # 默认
  loop_watchdog_probe_interval_s: 30
  loop_watchdog_max_strikes: 3
  systemd_watchdog_seconds: 0    # 仅 Linux/systemd，>0 需 gateway install --force
```

**本机实测**（2026-09-25，**只观测未改任何配置**）：
```
$ hermes gateway status
  Launchd plist: /Users/fkycoya/Library/LaunchAgents/ai.hermes.gateway.plist
  ⚠ Service definition is stale relative to the current Hermes install
    Run: hermes gateway start
  ✓ Gateway is supervised by launchd (PID 50147)

$ launchctl list | grep hermes
  50147   78   ai.hermes.gateway        ← 状态列 78 = 最近一次退出码 78（EX_CONFIG）

$ gateway_state.json
  gateway_state:  startup_failed
  exit_reason:    api_server: API_SERVER_KEY was rejected by the startup guard
  served_profiles: []              ← 一个 profile 都没服务上

$ config.yaml
  platforms: {feishu: False, api_server: True}
  gateway keys: strict, media_delivery_allow_dirs, trust_recent_files, trust_recent_files_seconds
```

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25）：

- 本机 `hermes gateway status` 实测两条：`⚠ Service definition is stale relative to the current Hermes install（Run: hermes gateway start）` + `✓ Gateway is supervised by launchd (PID 50147)` —— 官方文档解释为「service definition 相对当前 Hermes 安装已过期」，需要重跑 `hermes gateway start` 重新生成。
- 🔴 **网关确实在重启循环**：launchd 里 `ai.hermes.gateway` 的**状态列是 78**（最近一次退出码 78 = `EX_CONFIG`）。本会话先后观测到的 PID：**37431 → 37719 → 47027 → 48638 → 48056 → 50147** —— 六次变化，与官方描述的「以非零码退出让监管器重启」的循环形态一致。
- `gateway_state.json` 实测：`gateway_state: startup_failed`、`exit_reason: api_server: API_SERVER_KEY was rejected by the startup guard (missing, placeholder/too short, or strength unverifiable)`、**`served_profiles: []`**（一个 profile 都没服务上）。
- ⭐ **本机 config 把原因指得很明确**：`platforms: {feishu: False, api_server: True}` —— **`api_server` 是启用状态**，而启动守卫卡住的正是它。这与官方说的「显式 `enabled: false` 仍然禁用它」互为印证：feishu 显式关了（不参与启动），api_server 显式开着但缺密钥 → 卡在 startup guard → 整个 gateway 起不来。
- 本机 `gateway:` 段实测只有 4 个键：`strict` / `media_delivery_allow_dirs` / `trust_recent_files` / `trust_recent_files_seconds` —— 也就是说 **`delivery_ledger`（默认 true）与 `loop_watchdog`（默认 true）都在走默认值**，投递台账和存活看门狗这台机器上是**开着但没机会工作**（gateway 起不来）。
- 📌 **用官方文档串起了之前两个现象**：`cron status` 报的「ticker 心跳停摆 22.9h」与 `gateway_state.json` 的 `updated_at` 心跳是**同一件事的两种表述** —— 官方说 housekeeping 每 60s 重写 `gateway_state.json` 的 `updated_at`，它同时是 gateway 的心跳；**gateway 起不来 → housekeeping 不跑 → 心跳停 + cron 不 tick**。这条把 P33 的 ticker 停摆与 gateway 启动失败**归因到同一个根因**了。
- ⚠️ 一个可以顺手修的旁证（本轮**没动**）：gateway 日志里 MCP `vercel` 初始连接 `401 Unauthorized`（token 过期，重试 3 次后放弃）—— 这是启动阶段的连带噪音，与启动失败无因果关系。
- 🔒 **本轮严格遵守了你的指示**：只读文档 + 只观测本机状态，**没有改动任何平台配置、没有重连飞书、没有新造密钥**。上面所有关于 feishu / api_server 的描述都是**观测结果**，不是我的操作记录。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
