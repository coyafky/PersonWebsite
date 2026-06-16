---
title: "从零配置 Hermes 连接飞书 Bot — 含多 Profile 实战"
date: "2026-06-12"
summary: "完整记录 Hermes Agent 连接飞书 Bot 的配置过程：Gateway 连接、Bot 授权、多 Profile 隔离、流式卡片插件、踩坑与排查。结合 W15-W17 三周实战经验。"
tags:
  - hermes
  - feishu
  - bot
  - profile
  - 教程
status: published
lang: zh
englishSummary: "A step-by-step guide to connecting Hermes Agent with Feishu Bot, covering Gateway connection, bot authorization, multi-profile isolation, streaming card plugins, and real troubleshooting from 3 weeks of production experience."
---

# 从零配置 Hermes 连接飞书 Bot — 含多 Profile 实战

> 写于 2026-W17 飞书集成落地之后。从 W14 的方案设计到 W15 的 Gateway 连接成功，再到 W16-W17 的稳定运行——这条链路跑了三周才跑通。实际问题不是配置复杂，而是**文档分散 + 配置层级容易搞混**。这篇文章把整个流程串起来。

---

## 前置条件

| 你需要什么 | 说明 |
|-----------|------|
| Hermes Agent 已安装 | 版本不限，建议最新 |
| 飞书开发者账号 | 在 [飞书开放平台](https://open.feishu.cn) 创建应用 |
| Bot 已创建 | 应用的「添加应用能力」中开启机器人 |
| 网络可达飞书 | 国内服务器或本地开发机均可 |

---

## 整体架构

```mermaid
flowchart LR
    A[飞书用户] -->|发消息| B[飞书服务器]
    B -->|WebSocket 推送| C[Hermes Gateway]
    C -->|处理请求| D[Hermes Agent]
    D -->|调用 Skill| E[各种工具]
    D -->|回复消息| C
    C -->|发送| B
    B -->|推送给用户| A
```

Hermes 不是直接连飞书——中间多了一层 **Gateway**，它负责 WebSocket 长连接、消息路由和流式卡片渲染。

---

## Step 1：获取飞书应用凭证

在飞书开放平台「应用详情」页面找到：

| 凭证 | 位置 | 用途 |
|------|------|------|
| **App ID** | 应用详情 → 凭证与基础信息 | 应用的唯一标识 |
| **App Secret** | 同上 | 应用的密钥，用于获取 tenant_access_token |

> ⚠️ App Secret 一旦生成只显示一次，请立即保存。如果丢失需要重置。

---

## Step 2：配置环境变量

这是最关键的一步。Hermes Gateway 通过 `.env` 文件自动检测飞书集成。

### 单 Profile 配置（最简单）

在 Hermes 项目根目录的 `.env` 中：

```bash
# 飞书应用凭证
FEISHU_APP_ID=cli_xxxxxxxxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 用户授权：允许哪些飞书用户使用 Bot
FEISHU_ALLOW_ALL_USERS=true
```

重启 Hermes Gateway 后，gateway 会在启动日志中打印：
```
[feishu] WebSocket connected
```

如果没有这行 → 说明飞书平台未加载，检查 `.env` 变量的命名是否精确。

---

### 多 Profile 配置（进阶）

**为什么需要多 Profile？**

Hermes 支持多个 profile，每个 profile 有独立的 skills、plugins、cron 和记忆。当你有多个飞书 Bot（如「先波车膜客服」「先波门店助手」）时，多 profile 是最佳隔离方案。

```
~/.hermes/profiles/
├── default/                 # 主 profile
│   ├── .env                 # FEISHU_APP_ID=xxx  FEISHU_APP_SECRET=xxx
│   ├── skills/
│   └── ...
│
└── geo-car-film-writer/     # 子 profile（GEO 内容写作专用）
    ├── .env                 # 不同的 FEISHU_APP_ID
    └── skills/
```

**配置步骤**：

1. 为每个 profile 创建独立的 `.env` 文件：

```bash
# ~/.hermes/profiles/default/.env
FEISHU_APP_ID=cli_main_bot_xxxxx
FEISHU_APP_SECRET=main_bot_secret_xxxxx
FEISHU_ALLOW_ALL_USERS=true

# ~/.hermes/profiles/geo-car-film-writer/.env
FEISHU_APP_ID=cli_content_bot_xxxxx
FEISHU_APP_SECRET=content_bot_secret_xxxxx
FEISHU_ALLOW_ALL_USERS=true
```

2. 启动时指定 profile：

```bash
hermes gateway start --profile default
hermes gateway start --profile geo-car-film-writer
```

**多 Profile 的实际场景**：

| Profile | Bot 名称 | 用途 |
|---------|---------|------|
| `default` | 先波企业测试 Bot | 内部测试、日常使用 |
| `geo-car-film-writer` | 先波内容助手 | GEO 内容写作、知识库维护 |
| （计划中） | 先波车膜客服 | 客户咨询自动回复 |
| （计划中） | 先波门店后台助手 | 门店数据查询 |

> 💡 **最佳实践**：子 profile 隔离独立的 bot + lark-cli，不改主 profile。每个子 profile 有自己的技能和记忆，互不干扰。

---

## Step 3：确保 Bot 权限配置

刚创建的应用**默认没有用户权限**，Bot 收不到任何消息。需要两步：

### 3.1 在飞书开放平台配置权限

进入「应用详情 → 权限管理」，搜索并开启：

| 权限 | 用途 |
|------|------|
| `im:message` | 获取用户发给 Bot 的消息 |
| `im:message:send_as_bot` | Bot 向用户发送消息 |
| `im:chat` | 获取群聊信息 |
| `im:chat:readonly` | 读取群聊成员（只读） |

> 添加权限后需要**重新发布应用版本**，等待审核通过。

### 3.2 在 Hermes 中配置用户授权

即使在飞书开放平台配置了权限，仍需在 Hermes 侧设置用户白名单。

**方式一：放开所有用户（测试阶段推荐）**

```bash
FEISHU_ALLOW_ALL_USERS=true
```

**方式二：按需白名单（生产推荐，未来会支持）**

```bash
# 按 open_id 白名单（当前版本可能尚未完全支持，以最新文档为准）
FEISHU_ALLOWED_USERS=ou_xxxx,ou_yyyy
```

> ⚠️ W15 实际踩坑：飞书 Gateway WebSocket 连接成功，但用户消息被静默拒绝——原因就是**飞书侧权限配置了但 Hermes 侧 `FEISHU_ALLOW_ALL_USERS` 没设**。排查了半小时才发现。

---

## Step 4：验证端到端链路

### 4.1 看 Gateway 启动日志

```bash
hermes gateway start --profile default
```

关键日志行：

```
✅ [feishu] platform loaded
✅ [feishu] WebSocket connected to Feishu
✅ Gateway listening on http://localhost:XXXX
```

### 4.2 在飞书中发消息测试

在飞书中找到你的 Bot，发送一条私聊消息：「你好」

在 Hermes 终端中应该看到：

```
[feishu] message received from ou_xxxx: "你好"
[agent] processing...
[feishu] response sent
```

### 4.3 常见故障排查

| 现象 | 可能原因 | 检查 |
|------|---------|------|
| 没有 `[feishu] platform loaded` | `.env` 变量名错误或未生效 | `echo $FEISHU_APP_ID` 确认 |
| 有 `platform loaded` 但无 WebSocket | App Secret 错误 | 去开放平台确认或重置 |
| WebSocket 连接成功但消息不响应 | `FEISHU_ALLOW_ALL_USERS` 未设 | 设为 `true` |
| 消息响应但无流式卡片 | hermes-lark-streaming 插件未安装 | 见 Step 5 |

---

## Step 5：安装流式卡片插件

流式卡片让 Bot 的回复以「逐字输出」的效果在飞书中呈现，而不是一次性等待完整回复。

```bash
# 检查插件是否安装
hermes plugins list

# 如果未安装
hermes plugins install hermes-lark-streaming
```

安装后在 profile 的配置中确认：

```yaml
# ~/.hermes/config.yaml
plugins:
  hermes-lark-streaming:
    enabled: true
```

---

## 多 Profile 环境下的飞书发图（进阶）

W17 实战中，我们搭建了 **Ark Seedream 车膜预览生图系统**。不同 profile 的 Bot 需要发图给不同客户：

```python
# scripts/feishu_sender.py
python3 feishu_sender.py \
  --target ou_user_open_id \          # 发送目标（DM 私聊）
  --chat-id oc_group_chat_id \        # 或发送到群聊
  --media /path/to/image.jpeg \       # 图片路径
  --message "这是您的车膜预览图" \
  --account xianbo-enterprise-test    # Bot 账号（不同 profile 用不同 bot）
```

当前支持的 Bot 账号路由：

| Bot | --account | profile |
|-----|-----------|---------|
| 先波企业测试 Bot | `xianbo-enterprise-test` | default |
| 先波车膜客服 | `xianbo-support` | (待建) |
| 先波门店后台助手 | `xianbo-ops` | (待建) |
| 先波内容助手 | `xianbo-content` | geo-car-film-writer |

---

## 总结：一张清单走完配置

| # | 步骤 | 关键操作 |
|---|------|---------|
| 1 | 飞书开放平台创建应用 | 记录 App ID + App Secret |
| 2 | `.env` 配置凭证 | `FEISHU_APP_ID` + `FEISHU_APP_SECRET` |
| 3 | 放开用户授权 | `FEISHU_ALLOW_ALL_USERS=true` |
| 4 | 飞书平台权限配置 | `im:message` + `im:message:send_as_bot` |
| 5 | 重启 Gateway | 检查日志 `[feishu] WebSocket connected` |
| 6 | 飞书发消息验证 | 发「你好」→ 确认有回复 |
| 7 | 安装流式卡片插件 | `hermes plugins install hermes-lark-streaming` |
| 8 | （可选）多 profile 隔离 | 每个 profile 独立 `.env` + 独立 Bot |

---

> 💡 **记住这一句**：飞书集成最大的坑不是配置复杂，而是 **`.env` 变量名不精确 + `FEISHU_ALLOW_ALL_USERS` 忘记设**。这两个搞对了，剩下的都是顺的。
