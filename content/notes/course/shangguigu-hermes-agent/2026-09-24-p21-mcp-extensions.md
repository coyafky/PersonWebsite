---
title: "P21 21_能力篇_MCP服务扩展介绍"
date: "2026-09-24"
summary: >-
  P21 · 21_能力篇_MCP服务扩展介绍（6:31）
status: published
tags:
  - "Hermes"
  - "MCP"
lang: zh
chapter: "P21"
series: "shangguigu-hermes"
seriesOrder: 21
---

## 课时概要

能力篇 · MCP 服务扩展介绍。官方仓库带一大片可选 MCP 目录（`optional-mcps/`，本机实测 **65 个条目**），即 MCP 生态的扩展市场。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档（MCP 页 + Use MCP with Hermes 指南）与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[21_能力篇_MCP服务扩展介绍](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=21) ｜ 时长 6:31 ｜ P21

## 本节要点

- **官方 catalog = Nous 审核过的 MCP 清单**：Hermes 自带一份由 Nous 员工 review 并合并的 MCP 目录，**默认全部禁用**，只装你真正想要的。条目存放在仓库的 **`optional-mcps/`** 目录里 —— 在该目录里存在就等于 Nous 认可；**没有社区投稿层**，条目靠合并 PR 加入。
- **三种安装方式**：`hermes mcp`（交互 picker，也是默认）/ `hermes mcp catalog`（纯文本列表，可脚本化）/ `hermes mcp install <name>`（按名字一键装）。也可以**直接在对话里说**「add the Linear MCP」—— agent 会调 `manage_connections` 带 `mcp: true` 目标，弹出一张设置卡。
- **设置卡行为**（Desktop 是对话框、TUI 是 composer 上方 callout、经典 CLI 是面板）：一次展示该条目所有 setup 值（普通值预填默认、密钥打码、输入期间不保存）｜ **Connect / Cancel**（Cancel 只跳过这一个，同一请求里其他服务器继续）｜ OAuth 条目显示授权链接，但**Hermes 绝不自己开浏览器**（桌面点 Open in browser、终端按 Enter；SSH 下会告诉你回调端口怎么走或怎么粘贴重定向 URL）｜ **Save 是原子的**：服务器接受新 token 且首次连接返回后，才一起保存配置 + token + setup 值；失败或中途取消则**什么都不留**，旧配置与 token 保持原样。
- **授权成功后**：Hermes 列出该服务器工具并注册，agent 同一轮就能调用。若授权成功但工具列表失败，卡片显示 “Authorized. Tools unavailable.”，之后 agent 可重跑发现而**不需要你重新授权**。
- **条目可能要求什么**：**API key**（安装时提示，值写进 `~/.hermes/.env`，非密值如 base URL 也写同一个文件）｜ **OAuth（远程 MCP）**（config 里写 `auth: oauth`，首次连接起浏览器）｜ **OAuth（第三方 provider 如 Google/GitHub）**（会指向 `hermes auth <provider>`）。
- **n8n 的变化**：第三方 n8n bridge **不再可通过 catalog 安装**（已有安装继续照常加载、出现在 picker 里作为 custom 条目，可配置/启停，但不能重装）；替代品是 **`n8n-official`** 条目 —— 直连你的 n8n Cloud 或自建实例（HTTP + 浏览器 OAuth，不需要本地 bridge 或 n8n API key），并要求在 n8n 里由 owner/admin 打开 Settings → Instance-level MCP。
- **目录规模（本机实测）**：`optional-mcps/` 顶层 **65 个条目**；`hermes mcp catalog` 实测 **64 个 available + 1 个已启用（vercel）+ 6 个 custom（你自己配的）**。
- **（我的归纳）65 个条目的分布**：研发/可观测（gitlab、semgrep、sentry、buildkite、circleci、postman、context7、deepwiki、microsoft-learn、aws-knowledge、hugging_face、unreal-engine、globalping、grafana、datadog、betterstack）｜ 数据/后端（neon、supabase、prisma-postgres、motherduck、railway、cloudflare、vercel、netlify）｜ 项目/文档协作（linear、asana、atlassian、clickup、monday、todoist、notion、craft、miro、figma、canva、dropbox）｜ CRM/营销（attio、close、intercom、klaviyo、calendly）｜ 分析（amplitude、mixpanel）｜ 支付/金融/生活（stripe、paypal、square、plaid、robinhood、twelve-data、kiwi、trivago、alltrails、strava、indeed）｜ 媒体/生成（comfy-cloud、gamma、cloudinary、fireflies）｜ 自动化与知识（n8n-official、wolfram、webflow、wordpress-com、twilio-docs）。
- **Hermes 反向作为 MCP server**：`hermes mcp serve` 起一个 stdio MCP server，把 Hermes 的会话暴露给别的 MCP 客户端（例如在 Claude Code 的 `~/.claude/claude_desktop_config.json` 里加 Hermes）。它**直接从 `~/.hermes/state.db` 读会话**（`sessions.json` 只作遗留兜底），后台线程轮询新消息维护内存事件队列；发消息复用与 cron 投递、`hermes send` 相同的发送引擎。**读操作不需要 gateway 在跑，发消息需要。**
- **目录条目的元数据机制**（给自建 catalog 的心理模型）：安装时的**工具选择**可在装完后再改 ｜ catalog manifest 有**版本兼容**校验 ｜ setup 值支持 **运行时 `${ENV_VAR}` 替换** ｜ 条目可带 **`suggest:` 建议元数据** ｜ 有些条目需要**你自己的 OAuth app（无 DCR）**。

## 关键概念

- **catalog / `optional-mcps/`**：Nous 审核的 MCP 目录；目录里存在 = 已认可（无社区投稿层）。
- **一键安装三入口**：`hermes mcp`（picker）/ `hermes mcp catalog`（可脚本）/ `hermes mcp install <name>`；对话里说「add the X MCP」等效。
- **原子化保存**：配置 + token + setup 值一起提交 —— 服务器拒绝就什么都不留，不污染已有配置。
- **API key 落点 `~/.hermes/.env`**：catalog 安装时收集的密钥与 base URL 都写这里。
- **`n8n-official`**：接替已下线的第三方 n8n bridge，走 HTTP + 浏览器 OAuth。
- **`hermes mcp serve`**：把 Hermes 当 MCP server，暴露会话给其他 agent（读不需 gateway，发需要）。

## 代码 / 实操

```bash
hermes mcp             # 交互 picker（默认）
hermes mcp catalog     # 纯文本列表，可脚本化
hermes mcp install deepwiki
hermes mcp install figma   # 然后 hermes mcp login figma

# 反向：把 Hermes 变成 MCP server
hermes mcp serve           # 正常模式
hermes mcp serve --verbose # stderr 打调试日志
```

**本机实测**（2026-09-25）：`hermes mcp catalog` 输出 **64 个 available**，涵盖 airtable / algolia / asana / atlassian / cloudflare / context7 / deepwiki / figma / gitlab / grafana / hugging_face / linear / miro / neon / netlify / notion / postman / semgrep / sentry / stripe / supabase / todoist / vercel / wolfram / wordpress-com 等；**1 个 enabled（vercel）**；以及 **6 个 custom 条目**（agentkey / codegraph / github / hermes-studio / open-knowledge / tavily）—— 这 6 个不在 catalog 里，是我自己的自建或第三方服务器。

## 我的收获

**用户此前已完成本模块的学习与配置**；以下是本机实测状态（2026-09-25）：

- 本机 catalog 实测：**64 个可一键装 + vercel 已启用 + 6 个自定义** —— 也就是说我 7 个服务器里只有 vercel 来自官方目录，其余全是「custom」（自建本地 server 或第三方托管）。
- `optional-mcps/` 顶层实测 **65 个条目**（64 available + vercel），与 `hermes mcp catalog` 的列表逐项对得上 —— catalog 就是那个目录的投影。
- 官方那条 **「catalog 条目默认禁用，只装你真正想要的」**在我这台机器上是事实：64 个 available 一个都没启用（避免了一次性把几十个外部工具面塞进模型视野）。
- 反向用法（`hermes mcp serve`）值得记：它**从 `~/.hermes/state.db` 读会话**——正好接上 P12 讲的存储层，也意味着我本机的 682 个会话可以被别的 agent 通过 MCP 读到（读操作不需要 gateway）。
- `n8n` 从第三方 bridge 迁到 `n8n-official` 这件事，是 catalog「条目会演进甚至下线，但已有安装继续可用」的一个真实案例。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
