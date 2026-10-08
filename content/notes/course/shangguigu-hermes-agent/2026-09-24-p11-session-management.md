---
title: "P11 11_能力篇_会话管理"
date: "2026-09-24"
summary: >-
  P11 · 11_能力篇_会话管理（5:56）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P11"
series: "shangguigu-hermes"
seriesOrder: 11
---

## 课时概要

能力篇 · 会话管理。官方 README 功能表第一条「A real terminal interface」：TUI 带多行编辑、斜杠命令自动补全、会话历史、打断并改道（interrupt-and-redirect）、流式工具输出。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[11_能力篇_会话管理](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=11) ｜ 时长 5:56 ｜ P11

## 本节要点

- **每个会话都会自动保存**（官方 Sessions 文档）：无论来自 CLI、Telegram、Discord、Slack、WhatsApp、Signal、Matrix、Teams 还是其他消息平台，都存成一个 session 并保留完整消息历史。
- **会话来源（Session Sources）** 是官方枚举的固定标签：`cli` / `oneshot` / `telegram` / `discord` / `slack` / `whatsapp` / `signal` / `matrix` / `mattermost` / `email` / `sms` / `dingtalk` / `feishu` / `wecom` / `weixin` / `bluebubbles` / `qqbot` / `homeassistant` / `webhook` / `api-server` / `acp` / `cron` / `batch` / `kanban` / `tool`。
- **CLI 续接**：`hermes --continue`（短写 `hermes -c`）恢复最近一次 CLI 会话；`hermes --resume <id|标题|latest>` 按 ID / 标题 / 最近续接。
- **每终端续接**：裸 `-c` 是 terminal-aware 的 —— 每个终端在 `~/.hermes/terminal-sessions/` 留一个面包屑（tty / tmux / kitty / wezterm / Zellij…），所以两个并排的 pane 各自续自己的会话；没有面包屑（首次使用 / 会话已删 / 面包屑超 30 天）时回退到「最近一次会话」。可用 `session.terminal_continue: false` 关闭。
- **恢复会切回工作目录**：续接 CLI 会话时 Hermes 会 `cd` 回该会话记录的工作目录（git 仓库根或项目目录），并打印 `↪ restored workspace dir: …` 确认；不想切就加 `--no-restore-cwd`。`--in <dir>` 则先切目录再恢复，并把会话钉在该目录。
- **恢复时显示回顾面板（recap）**：金色 `●` 是用户消息、绿色 `◆` 是助手回复，长消息截断（用户 300 字符 / 助手 200 字符 3 行），工具调用折叠成计数（如 `[3 tool calls: terminal, web_search]`），最多展示最近 10 轮 + “… N earlier messages …”。可用 `display.resume_display: minimal` 关掉。
- **会话 ID 格式**：`YYYYMMDD_HHMMSS_<hex>` —— CLI/TUI 用 6 位十六进制后缀，gateway 会话用 8 位；支持按完整 ID / 唯一前缀 / 标题续接。
- **会话命名**：首轮对话后自动生成 3–7 词标题（后台用快速辅助模型，不增加延迟；每会话只触发一次，手动设过就跳过）；也可用 `/title <名字>` 手动设。标题**必须唯一**、≤100 字符、自动清洗控制字符 / 零宽字符 / RTL 覆盖符；emoji 与中文都支持。
- **压缩自动续号（lineage）**：会话被压缩时（`/compress` 或自动）会生成继任会话，标题自动编号 —— my project → my project #2 → my project #3；按名字续接时自动选血统里最新的一条。
- **跨平台移交**：CLI 里 `/handoff <platform>` 可把进行中的会话转到消息平台的 home channel（同一 session id + 完整 transcript）；需要先在目标聊天执行一次 `/sethome`；agent 正在回合中会拒绝；gateway 未运行则 60 秒超时，慢移交最多等 15 分钟并打印 “Still transferring…”。
- **会话卫生（官方专门写了一节）**：gateway 会话不会自己过期 —— 所以官方建议在任务 / 话题结束时主动 `/new`（可命名，如 `/new payments-refactor`）或 `/reset`。理由：① 记忆（`MEMORY.md` / `USER.md`）只在会话**边界**注入，永不停的会话里记忆机制几乎不运转 ② 成本随历史增长，一个带蒸馏记忆的新会话通常比一个月的老线程更便宜。
- **崩溃 / 重启后仍连续**：会话身份（routing key、chat、origin）在建行时原子写入；重启后 gateway 按「最近真实活动」重新解析，且恢复**尊重 `/new` 边界**（不会越过你主动的重置去复活旧会话）。

## 关键概念

- **Session（会话）**：Hermes 对一段对话的完整留档，含消息历史、模型、系统提示快照、token 计数、来源平台与时间戳。
- **Session Source（来源标签）**：标记这条会话从哪来（cli / telegram / cron / feishu …），决定它出现在哪些选择器里。
- **Session Recap（回顾面板）**：恢复会话时在提示符前显示的紧凑摘要，帮你快速接上下文。
- **Session Lineage（会话血统）**：压缩产生的「父会话 → 继任会话」链条，标题按 #2 / #3 递增。
- **`/handoff`**：把正在进行的会话从一个平台整体移交给另一个平台（同一 session id）。
- **会话卫生**：主动在边界处 `/new`，让记忆沉淀与成本控制生效的方法。

## 代码 / 实操

```bash
# 续接与恢复
hermes -c                                 # 续最近一次 CLI 会话（terminal-aware）
hermes -c "my project"                    # 按标题续（血统里自动取最新）
hermes --resume 20250305_091523_a1b2c3    # 按 ID 续
hermes --resume latest --in ./my-project  # 在指定目录续该目录最近的会话
hermes --resume <id> --no-restore-cwd     # 不切回会话记录的工作目录

# 查看与管理
hermes sessions list                      # 最近 20 条
hermes sessions list --source telegram --limit 50
hermes sessions list --workspace my-project
hermes sessions rename <id> "debugging auth flow"
hermes sessions pin <id>                  # 置顶（免被自动归档清扫）

# 会话内斜杠命令
/title my research project                # 手动命名
/new payments-refactor                    # 开新线程并起名
/handoff telegram                         # 移交到 Telegram
```
**本机实测**（2026-09-25）：`hermes sessions stats` → 682 会话 / 25,943 条消息 / 371 个 CLI 会话；`hermes sessions list --limit 6` 实测四列输出（Title / Preview / Last Active / ID）并以 `… more not shown (use --limit 12 to see more)` 收尾。

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25 01:3x）：

- 本机 `hermes sessions stats` 实录：**682 个会话、25,943 条消息、371 个 CLI 会话、DB 365.0 MB** —— 量级已经不小，正好印证官方「会话卫生」那一节的建议（该主动 `/new` 了）。
- `hermes sessions list` 实测输出里能看到 **cron 来源的会话**（`cron_3a2f6d25b8d3_20260924_230005`、`cron_e531a3a536e4_...`）—— 与官方 Session Sources 表里的 `cron` 一类完全对上。
- ID 两种形态本机都真实存在：CLI 风格的 6 位 hex（`20260828_174306_fcaa1f`）与 uuid 风格（`091f3111-b62e-4ab5-aeef-6e28fe81e4a8`）。
- 本机 `display.resume_display: full`（完整回顾面板，未改成 minimal）；`session.terminal_continue` 未显式配置 → 走默认的 terminal-aware 行为。
- `~/.hermes/sessions/` 目录里另有 843 个 `.json`（**796 个 `session_*.json` + 46 个 `request_dump_*.json` 调试转储 + 1 个其他**）与 94 个遗留 `.jsonl`（详见 P12）—— 说明「会话管理」要连目录卫生一起看。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
