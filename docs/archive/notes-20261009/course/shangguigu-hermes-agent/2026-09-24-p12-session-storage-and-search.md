---
title: "P12 12_能力篇_会话存储和跨会话搜索"
date: "2026-09-24"
summary: >-
  P12 · 12_能力篇_会话存储和跨会话搜索（16:25）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P12"
series: "shangguigu-hermes"
seriesOrder: 12
---

## 课时概要

能力篇 · 会话存储与跨会话搜索。官方 README「A closed learning loop」一条：**FTS5 session search with LLM summarization for cross-session recall** —— 用 SQLite FTS5 全文索引会话 + LLM 摘要做跨会话召回。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[12_能力篇_会话存储和跨会话搜索](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=12) ｜ 时长 16:25 ｜ P12

## 本节要点

- **存储位置（官方 Storage Locations 表）**：所有会话元数据与消息都在 **`~/.hermes/state.db`** 这一个 SQLite 文件里（含 FTS5 全文索引）；gateway 路由索引在同一库的 `gateway_routing` 表里。
- **三件套**：`state.db` + `state.db-wal`（预写日志）+ `state.db-shm`（共享内存索引）。SQLite 自行管理后两者，多个 Hermes 进程（gateway / Desktop / dashboard / cron / CLI）靠 SQLite 自身锁安全共享。
- **Schema 关键三表**：`sessions`（会话元数据：id / source / user_id / model / title / 时间戳 / token 计数）｜`messages`（完整消息历史：role / content / tool_calls / tool_name / token_count）｜`messages_fts`（FTS5 虚拟表，跨消息内容的全文搜索）。标题有唯一索引（允许 NULL，非 NULL 必须唯一）。
- **`~/.hermes/sessions/sessions.json` 不是会话列表**：它只是 gateway 路由索引的遗留镜像（`gateway.write_sessions_json`，默认 true），只含消息平台条目。真正的会话列表在 `state.db` 里 —— CLI / TUI / gateway 会话全都在。
- **遗留 JSONL**：在 `state.db` 成为正典之前创建的会话可能在 `~/.hermes/sessions/` 留下 `*.jsonl`；现在已不再写入或读取，**确认对应会话已存在于 state.db 后可安全删除**。
- **`session_search` 工具（跨会话搜索的核心）**：用 SQLite 的 **FTS5 引擎**对所有历史会话做全文搜索，并允许 agent 在命中的会话里滚动阅读。⚠️ 官方明确写了 **it makes no LLM calls** —— 它返回的是 DB 里真实消息的视图，不是生成的摘要（这也是它与「记忆蒸馏」的分工所在）。
- **四种调用形态**（不靠 `mode` 参数，而是由你传了哪些参数推断）：① **discovery** 传 `query` ② **scroll** 传 `session_id` + `around_message_id` ③ **read** 只传 `session_id` ④ **browse** 不带参数（按时间倒序列最近会话）。
- **FTS5 查询语法**：简单关键词 `docker deployment`（FTS5 默认 AND）｜短语 `"exact phrase"`｜布尔 `docker OR kubernetes`、`python NOT java`｜前缀 `deploy*`。
- **搜索可选参数**：`sort`（`newest` / `oldest`，叠加在 FTS5 排序之上；省略则纯相关性排序）｜`detail`（`adaptive` 默认只完整水合第一条，`full` 全部水合）｜`role_filter`（默认 `user,assistant`，搜索工具输出需显式加 `tool`）。
- **discovery 结果字段**：`session_id` / `title` / `when` / `source` / `snippet`（FTS5 高亮片段）/ `detail` / `bookend_start` / `bookend_end` / `messages`（命中点 ±5 条）/ `match_message_id` / `messages_before` / `messages_after`。
- **自动清理**：`sessions.auto_prune`（默认 **true**）、`sessions.retention_days`（默认 **90**）、`vacuum_after_prune`（默认 true）、`min_vacuum_interval_days`（默认 30）。只有**已结束**的会话会被删，活跃会话永不自动清理。
- **官方点名的失效模式**：不做任何清理时，实测出现过 **384 MB 的 `state.db`、约 1000 个会话，拖慢 FTS5 插入与 `/resume` 列表**。
- **超大转录守卫**：`sessions.max_resume_messages` 与 `sessions.max_export_messages`（默认各 20000，设 0 关闭）—— 防止把失控的长转录一次性读进内存；被拒时客户端收到错误码 **4130**。
- **存储恢复（Session Storage Recovery）三件套铁律**：**不要删 `state.db-wal` / `state.db-shm`**（日志里是已提交、尚未并进 state.db 的对话，删它是唯一会把「拒写」变成真丢数据的动作）；**不要只拷贝 `state.db`**（三件套是一个镜像，要用 `hermes backup` 或 `hermes sessions recover`）。维护命令（`optimize` / `prune`）在别的进程持有该库时会**拒绝执行**并列出持有者 PID。
- **非破坏性的第一步**：`hermes sessions optimize` 合并 FTS5 索引段并 VACUUM，**不碰任何会话数据**；`hermes sessions prune` 才真删。日志模式可在 WAL 与 DELETE 间自服务切换（`hermes sessions set-journal-mode`）。
- **导入其他 CLI 的会话**：`hermes sessions import` 读 Claude Code（`~/.claude/projects/`）与 Codex CLI（`~/.codex/sessions/`）的日志，新建一条 `Imported from Claude Code: <首条用户消息>` 的会话；`hermes --resume @claude` 可导入并直接续接。源文件只读不改。
- **压缩两层（与存储直接相关）**：gateway 会话卫生在 **85%** 上下文触发（粗估，安全网），agent 的 ContextCompressor 在 **50%**（默认，真实 token）触发；手动 `/compress` 可强制压缩。压缩减少的是活动上下文，**不是隐私删除**。

## 关键概念

- **state.db**：每个 profile 一个 SQLite 会话库，是所有会话的唯一正典（canonical）存储。
- **WAL（Write-Ahead Log）**：`state.db-wal` 是 SQLite 的预写日志，支撑「多读 + 单写」的并发模型；gateway / Desktop 运行时 `-wal` 较大是正常现象。
- **FTS5**：SQLite 的全文搜索扩展，Hermes 用它建 `messages_fts` 虚拟表，实现毫秒级跨会话检索。
- **session_search 工具**：agent 内置的会话检索工具（discovery / scroll / read / browse 四种形态），**不调 LLM**。
- **auto_prune / retention_days**：自动清理已结束会话的开关与保留窗口（默认开 / 90 天）。
- **Session Storage Recovery**：当有进程仍持有旧 WAL 时 Hermes 主动拒写以保护数据的机制，以及配套的三步恢复法。

## 代码 / 实操

```bash
# 看一眼存储与统计
hermes sessions stats                 # 会话数 / 消息数 / 分来源 / DB 体积
hermes sessions export backup.jsonl   # 先备份再清理

# 非破坏性维护（先做这个）
hermes sessions optimize              # 合并 FTS5 段 + VACUUM，不动数据

# 真清理（先预览）
hermes sessions prune --older-than 90 --dry-run
hermes sessions prune --older-than 90 --yes

# 导入其他 CLI 的会话
hermes sessions import
hermes --resume @codex
```
agent 侧的检索调用（官方示例）：
```python
session_search(query="auth refactor", limit=3)
session_search(session_id="20260510_174648_805cc2", around_message_id=590803, window=10)
session_search(session_id="20260510_174648_805cc2")
session_search()   # 浏览最近会话
```
**本机实测**：`state.db` **365 MB** ｜ `state.db-shm` 32 KB ｜ `state.db-wal` **0 B**（已 checkpoint）｜ `~/.hermes/sessions/` 目录 **285 MB**。

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25 01:3x）：

- **本机正好落在官方点名的失效模式上**：官方说「不清理时会看到 ~384 MB 的 state.db 与约 1000 个会话」，本机是 **365 MB / 682 个会话** —— 同一个量级。
- 本机 `config.yaml` 实录：**`sessions.auto_prune: false`**（不自动清理）、`retention_days: 90`、`vacuum_after_prune: true`、`write_json_snapshots: false` —— 所以 365 MB 是「主动保留全部历史」的结果，不是 bug；要瘦身第一步应该走非破坏性的 `hermes sessions optimize`。
- 三件套体积实测（2026-09-25 01:31）：`state.db` 365 MB + `-shm` 32 KB + `-wal` 0 B —— `-wal` 为 0 说明当时的写入已 checkpoint 回主库。
- `~/.hermes/sessions/` 的 285 MB 里有 **94 个遗留 `.jsonl`**（最新一个停在 2026-06-08，正好对应官方说的「state.db 成为正典前的老会话」）外加 **843 个 `.json`**（其中 **796 个 `session_*.json`**、**46 个 `request_dump_*.json`** 调试转储，另 1 个其他；不在官方会话存储定义内）—— 这两类是值得考虑的目录卫生项。
- 官方文档纠正了 README 的措辞：`session_search` 用 FTS5 检索、**不做任何 LLM 调用**；README 里「FTS5 session search with LLM summarization」的 LLM 摘要指的是更大的记忆 / 召回叙事，不是这个检索工具。
- 压缩配置本机实录：`compression.enabled: true`、`threshold: 0.5`（= 官方默认 50%）、`target_ratio: 0.2`、`protect_last_n: 20`、`hygiene_hard_message_limit: 400`、`abort_on_summary_failure: false`。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
