---
title: "P24 24_能力篇_持久化记忆介绍"
date: "2026-09-24"
summary: >-
  P24 · 24_能力篇_持久化记忆介绍（8:09）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P24"
series: "shangguigu-hermes"
seriesOrder: 24
---

## 课时概要

能力篇 · 持久化记忆介绍。官方 README「A closed learning loop」：**Agent-curated memory with periodic nudges** —— agent 自己管理的长期记忆，并定期提醒自己沉淀。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档（Memory / Memory providers / Honcho 三页）与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[24_能力篇_持久化记忆介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=24) ｜ 时长 8:09 ｜ P24

## 本节要点

- **两个文件构成 agent 的记忆**（官方原文）：`MEMORY.md` = **agent 自己的笔记**（环境事实、约定、学到的东西），限额 **2,200 字符（≈800 tokens）**；`USER.md` = **用户画像**（你的偏好、沟通风格、期待），限额 **1,375 字符（≈500 tokens）**。
- 两者都存在 **`~/.hermes/memories/`**，并在**会话开始时作为冻结快照注入 system prompt**；agent 用 `memory` 工具自己管理（add / replace / remove）。
- ⚠️ **一个 Hermes home 只能有一个 agent 进程**（官方警告）：记忆写入是自动的、且会在会话开始时回灌进 prompt，两个进程共用一个 home 会**互相把条目叠成谁都没写过的状态**。记忆按 profile 隔离是设计使然 —— 要第二个 agent 就给它自己的 profile，要共享记忆就用**外置 provider**。
- **注入格式**（官方给的样例）：头部带存储名与用量百分比 —— `MEMORY (your personal notes) [67% — 1,474/2,200 chars]`；**条目之间用 `§`（section sign）分隔**；条目可以多行。
- **冻结快照模式（intentional）**：注入在会话开始时抓取一次、**会话内永不改变** —— 这是为了保住 LLM 的 prefix cache。会话中增删记忆会**立刻落盘**，但**要到下一个会话才出现在 system prompt 里**；工具响应里看到的始终是实时状态。
- **记忆需要会话边界**（官方专节）：整套记忆系统围绕「会话结束的那一刻」设计 —— MEMORY/USER 把要点带进下一个会话，`session_search` 补上超出上下文的部分。**单个会话内这套机制没有理由运转**（重要东西还在实时上下文里，agent 既不会去查 session_search，也倾向于压缩条目而不是策展它们）。所以在 CLI 上「每次调用都是新会话」基本自动成立，而在消息平台（gateway）上**边界要靠你自己用 `/new` 创造**。
- **最常见的故障：「我让它记住，下个会话它忘了」**（官方按顺序排查）：① **写入是否真的发生** —— 记忆只在模型**真的调用了 `memory` 工具**时才持久化；「我已记住」只是一句话。用 `cat ~/.hermes/memories/MEMORY.md` 看条目在不在；**小模型（约 30B 以下）与工具调用弱的模型经常只产确认不产调用** ② **是否被暂存** —— `write_approval: true` 时，非交互 CLI 的写入会被挂起等审批：`/memory pending` → `/memory approve all` ③ **读写是不是同一份记忆** —— 记忆按 profile 隔离，`hermes -p work` 读的是 `~/.hermes/profiles/work/memories/` ④ **记忆是否启用** —— `memory.memory_enabled: false` 或 `agent.disabled_toolsets` 里列了 memory 会让工具整个消失 ⑤ **快照是冻结的** —— 当前会话存的只对下一个会话可见。
- **两件不会让 agent 记住的事**（官方明确）：`.env` 里的变量（那是**凭证与设置**，不是记忆）｜顺口提到、但没要求保存的事实。
- **该用 skill 而不是记忆的场景**：对**每次都要用的位置**（比如某个周期任务固定要读的路径），**技能往往是比记忆条目更好的家** —— 它只在相关时加载，不跟 2,200 字符的预算抢位置。
- **`memory` 工具的三种动作**：`add` / `replace` / `remove`。**没有 `read`** —— 记忆内容在会话开始时自动进 system prompt，agent 把记忆当作对话上下文的一部分。`replace` 与 `remove` 用**短唯一子串（`old_text`）定位**，不需要整条原文；命中多条会报错要求更具体。⚠️ **`replace` 是整条覆盖**：`old_text` 只负责定位，新 `content` 必须是**完整的新条目**（想保留的部分要自己带上）。
- **该存 vs 该跳**（官方清单）：**存** = 用户偏好（→ `user`）｜环境事实（→ `memory`）｜纠正（如「Docker 命令别用 sudo」）｜约定（缩进/行宽/文档风格）｜已完成的工作（「2026-01-15 把 MySQL 迁到 PostgreSQL」）｜显式请求。**跳** = 琐碎/显而易见（「用户问了 Python」）｜一搜就能查到的（「Python 3.12 支持 f-string 嵌套」）｜原始数据转储（大段代码/日志/表格）｜会话内的临时上下文。
- **容量管理**：memory 2,200 字符 ≈ **8–15 条**，user 1,375 字符 ≈ **5–10 条**。⚠️ **记忆不会自动压缩** —— 超限时工具**返回错误**而不是静默丢弃，错误响应里带 `current_entries` 和 `usage`，agent 要在**同一轮里**自己腾地方（合并或删除重叠/过时条目）再重试。`replace` 同样受限额约束（换成更长的可能还是溢出）。官方建议：用量**超过 80%** 时先合并再加。
- **去重**：完全重复的条目会被自动拒收（返回成功 + “no duplicate added” 提示）。
- **安全扫描**：记忆条目在写入前会被扫（提示注入、凭证外泄、SSH 后门模式、不可见 Unicode 字符）→ 命中即拦（因为它会被注入 system prompt）。
- **`session_search` vs 记忆**（官方对照表）：容量 ≈1,300 tokens 固定 **vs 无上限（所有会话）** ｜ 速度 即时（就在 prompt 里）**vs ~20ms FTS5 查询 / ~1ms 滚动** ｜ **成本 每轮都花 token vs 免费（无 LLM 调用）** ｜ 用途 **关键事实常驻 vs 找某次具体的历史对话**。所以记忆放「必须一直在上下文里的关键事实」，检索放「上周我们是不是聊过 X」。
- **学习旅程 `/journey`**：把「Hermes 学到了什么」画成时间线（技能 + 记忆条目，最旧在上、最新在下），带可播放的「星座」回放滑块。三个入口：CLI `hermes journey`（别名 `learning` / `memory-graph`，`--play` 动画、`--json` 出原始图数据）｜TUI `/journey`｜Desktop 打开 Star Map 面板。还能在时间线上**修剪与纠错**：`hermes journey list`（列出节点 id）→ `delete <node>`（**技能是归档可恢复，记忆块是删除**）→ `edit <node>`（用 `$EDITOR` 打开该块内容）。
- **配置**（`~/.hermes/config.yaml` 的 `memory:` 段）：`memory_enabled` ｜ `user_profile_enabled` ｜ `memory_char_limit: 2200` ｜ `user_char_limit: 1375` ｜ `write_approval: false`（默认自由写）。两个开关都设 false = 内置存储**完全关闭**（工具从 schema 移除 + prompt 里的记忆指导块也移除，模型根本不知道有这工具）；但**外置 provider 不受影响**（仍有自己的工具）。把 `memory` 列进 `agent.disabled_toolsets` 是**更重的一刀**（连外置 provider 工具也藏起来）。
- **`write_approval`**（控制写入）：默认 false = 自由写（含回合后的**后台自我改进复盘**写入）。设 true 后，交互 CLI 的前台写入会**内联问你**；其他所有场景（消息平台、脚本、后台复盘）的写入会被**暂存待审**：`/memory pending`（自动写入会标 `[auto]`）｜`/memory approve <id|all>` ｜`/memory reject <id|all>` ｜`/memory approval on|off`。暂存的 `replace`/`remove` 会**记录它针对的整条原文** —— 若该条目在暂存之后变了，写入会被拒绝并留在 pending。**这就是「agent 存了一条关于我的错误假设」的答案。**
- **后台复盘通知**：回合之后，后台自我改进复盘可能悄悄存一条记忆或更新一个技能（这就是 Hermes 的「有同意意识的学习回路」）。默认会在聊天里显一行 `💾 Memory updated`；用 `display.memory_notifications: off | on（默认） | verbose` 控制话痨程度（`off` 只是不显示，复盘照跑照写）。

## 关键概念

- **MEMORY.md / USER.md**：内置持久记忆的两个文件，前者是 agent 自己的笔记，后者是你的画像。
- **冻结快照（frozen snapshot）**：记忆在会话开始时注入一次、会话内不变，为的是保住 prefix cache；写入立刻落盘但对当前会话不可见。
- **`§` 分隔符**：条目之间的分节标记（section sign）。
- **`memory` 工具**：add / replace / remove 三动作，**无 read**；replace/remove 用子串定位，replace 是整条覆盖。
- **会话边界**：记忆真正发挥作用的时刻（`/new` 制造边界）。
- **容量限额 + 不自动压缩**：超限报错、要求 agent 同轮腾地方。
- **`write_approval` / 暂存写入**：写入前的审批闸门，覆盖前台与后台复盘。
- **`/journey` 学习旅程**：把技能与记忆画成时间线，并可 list / delete / edit 节点。

## 代码 / 实操

```yaml
# ~/.hermes/config.yaml（官方原文）
memory:
  memory_enabled: true
  user_profile_enabled: true
  memory_char_limit: 2200   # ~800 tokens
  user_char_limit: 1375     # ~500 tokens
  write_approval: false     # false = 自由写 | true = 需审批
```

agent 侧的调用形状（官方示例）：
```python
memory(action="add", target="memory",  content="这台机器是 Ubuntu 22.04，装了 Docker 与 Podman")
memory(action="replace", target="memory", old_text="dark mode",
       content="用户偏好：VS Code 用浅色、终端用深色")
memory(action="remove", target="memory", old_text="staging_ed25519")
```

```bash
cat ~/.hermes/memories/MEMORY.md      # 查写入是否真的发生
/memory pending                       # 看待审写入
hermes journey                        # 学习旅程（CLI 时间线）
hermes journey list                   # 列节点 id（含 memory:<source>:<index>:<fingerprint>）
```

**本机实测**（2026-09-25）：
```
~/.hermes/memories/  →  MEMORY.md 3259 B (Jun 24) ｜ USER.md 1433 B (Jul 8)
                        MEMORY.md.lock 0 B ｜ USER.md.lock 0 B
config.yaml          →  memory_char_limit: 2200 ｜ user_char_limit: 1375
                        memory_enabled: true ｜ user_profile_enabled: true
                         provider: ''（空 → 内置）
```
MEMORY.md 内容确实是官方说的 **`§` 分隔**结构，条目形如：
```
Network (Guangzhou/China): OpenAI/Google TCP blocked; DeepSeek reachable TLSv1.3…
§
## Coya 的架构偏好
- 架构原则：能简单就简单…
```
`hermes memory status` 实测：Memory injection ✓ ｜ User profile ✓ ｜ Memory tool ✓ ｜ Provider: **(none — built-in only)**。

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25）：

- 本机 `~/.hermes/memories/` 实测：**MEMORY.md 3259 B + USER.md 1433 B**，各带一个 0 字节的 `.lock`（MEMORY.md.lock / USER.md.lock）—— 与官方「两文件 + 位于 memories/」的结构完全一致。
- 本机 MEMORY.md **真的在用 `§` 分隔**（如「Network (Guangzhou/China): OpenAI/Google TCP blocked…」§「## Coya 的架构偏好」§「## Coya 工作模式」），条目都是官方推荐的「紧凑、信息密度高」形态，而不是碎句。
- config 实录与官方默认**逐项一致**：`memory_char_limit: 2200`、`user_char_limit: 1375`、`memory_enabled: true`、`user_profile_enabled: true`（`write_approval` 未显式写 → 走默认 false，即自由写、含后台复盘写入）。
- ⚠️ **本机有两个同名 USER.md，只有一个属于记忆系统**：`~/.hermes/USER.md`（2612 B，内容是「求职底稿」）vs **`~/.hermes/memories/USER.md`（1433 B，agent 管理的用户画像）**。官方文档里 USER.md 指的一律是 `memories/` 下那份 —— 这解释了为什么「我以为改了用户画像但 agent 没变」。
- ⚠️ 本机 MEMORY.md 里存在**过时条目**：至少两条指向已废弃的 `MySecondBrain/`（`dashboard.md 在 MySecondBrain/`、车膜知识库 `3-Resources/05.wiki/...`）—— 按官方「超过 80% 就该合并」的纪律，这类该清掉；也正好是 `/journey delete` 想解决的场景。
- 🛡️ 一个天然的对账点：官方把 memory 说成「≈1,300 tokens 固定成本、每轮都花」，而我（Alma）这边也有自己的 MEMORY.md 层 —— 两边是**同一套设计哲学**（限额、手工策展、会话开始时注入、配套一个检索层补漏）。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
