---
title: "Hermes .env 配置文件完全指南"
date: "2026-06-05"
summary: "Hermes .env 配置完全指南：与 config.yaml 的职责分工（配置描述运行 / .env 提供秘密值）、8 大核心作用（API Key / Provider 地址 / 运行环境 / 数据库与记忆 / 工具权限 / 工作目录 / Web 与 Browser / 消息网关）、完整 .env 示例（基础运行 / LLM Provider / Memory / 工具权限 / Web Search / 安全 / 消息网关 7 大模块）、macOS 本地开发版 vs 腾讯云生产版对比、4 类最易踩的坑（提交到 Git / Key 名称不一致 / 路径不可移植 / 生产环境危险工具）、推荐的 3 文件拆分（.env.example / .env.local / .env.production）。"
tags:
  - hermes
  - .env
  - 配置
  - 环境变量
  - 密钥管理
  - 安全
status: draft
lang: zh
topic: hermes
englishSummary: "Complete Hermes .env config guide: division of responsibility with config.yaml (config describes running / .env provides secrets), 8 core functions (API Key / Provider URL / runtime env / database & memory / tool permissions / working dirs / Web & Browser / message gateway), complete .env example with 7 modules (basic runtime / LLM Provider / Memory / tool permissions / Web Search / security / message gateway), macOS local dev vs Tencent cloud production comparison, 4 most common pitfalls (committed to Git / Key name mismatch / non-portable paths / dangerous tools in production), recommended 3-file split (.env.example / .env.local / .env.production)."
---

# Hermes `.env` 配置完全指南

> Hermes 的「隐私配置文件」——专门存放 API Key、数据库地址、模型密钥、运行环境变量等不适合写进代码里的敏感信息。

它和 `config.yaml` 的关系是：

```txt
config.yaml 负责描述"怎么运行"
.env 负责提供"运行时需要的秘密值和环境变量"
```

例如：

```yaml
# config.yaml
provider:
  api_key: ${OPENAI_API_KEY}
```

这里的 `${OPENAI_API_KEY}` 就会从 `.env` 中读取。

---

## 一、`.env` 在 Hermes 中的核心作用

### 1. 保存模型 API Key

Hermes 需要调用大模型，例如 OpenAI、Anthropic、DeepSeek、Qwen、Gemini 等。

这些 Key 不能直接写进代码，所以放在 `.env`：

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
QWEN_API_KEY=xxxxxxxxxxxxxxxx
GEMINI_API_KEY=xxxxxxxxxxxxxxxx
```

作用是让 Hermes 启动时可以安全读取模型访问权限。

### 2. 保存 Provider 接口地址

如果你使用官方 API，通常是默认地址。

如果你使用代理、私有部署、国内中转服务，就需要配置 `BASE_URL`。

```env
OPENAI_BASE_URL=https://api.openai.com/v1
DEEPSEEK_BASE_URL=https://api.deepseek.com
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

在国内服务器，比如腾讯云上部署 Hermes 时，这一项很重要。

### 3. 控制运行环境

Hermes 可能有开发环境、测试环境、生产环境。

```env
APP_ENV=development
DEBUG=true
LOG_LEVEL=info
```

含义：

```txt
APP_ENV=development   本地开发环境
APP_ENV=production    云服务器生产环境
DEBUG=true            打开详细调试信息
LOG_LEVEL=info        日志级别
```

### 4. 配置数据库与记忆系统

Hermes 的跨会话学习通常需要记忆存储。

本地可以用 SQLite：

```env
DATABASE_URL=sqlite:///./Memory/session_db.sqlite
```

云服务器上可以用 PostgreSQL / MySQL：

```env
DATABASE_URL=postgresql://user:password@host:5432/hermes
```

如果使用向量数据库：

```env
VECTOR_DB=chroma
CHROMA_HOST=http://localhost:8000
CHROMA_COLLECTION=hermes_memory
```

作用是支持：

```txt
历史会话存储
长期记忆读取
session search
RAG 检索
跨会话学习
```

### 5. 配置工具权限

Hermes 可能可以调用终端、网页搜索、文件系统、浏览器、图片生成等工具。

`.env` 可以控制工具是否启用：

```env
ENABLE_TERMINAL=true
ENABLE_WEB_SEARCH=true
ENABLE_FILE_WRITE=true
ENABLE_IMAGE_GENERATION=true
ENABLE_BROWSER_AUTOMATION=false
```

这样可以避免 Agent 在不该执行的时候调用危险能力。

例如生产环境可以这样：

```env
ENABLE_TERMINAL=false
ENABLE_FILE_WRITE=false
```

### 6. 配置工作目录

Hermes 需要知道文件、日志、缓存、记忆放在哪里：

```env
HERMES_ROOT=/Users/coya/hermes-agent
MEMORY_DIR=./Memory
LOG_DIR=./Logs
CACHE_DIR=./Cache
PROFILE_DIR=./Profile
SKILLS_DIR=./Skills
TOOLS_DIR=./Tools
```

作用是让 Hermes 启动时找到项目资源。

### 7. 配置 Web / Browser / Search 能力

如果 Hermes 需要搜索网页、抓取页面、做 GEO 采样，就可能需要：

```env
SEARCH_API_KEY=xxxxxxxxxxxxxxxx
SEARCH_ENGINE=serpapi
BROWSER_HEADLESS=true
BROWSER_TIMEOUT=30000
```

含义：

```txt
SEARCH_API_KEY      搜索服务密钥
SEARCH_ENGINE       使用哪个搜索服务
BROWSER_HEADLESS    是否无头浏览器运行
BROWSER_TIMEOUT     浏览器超时时间，单位毫秒
```

### 8. 配置消息网关

如果 Hermes 接入 Telegram、Slack、Discord、飞书、企业微信、Email 等渠道，`.env` 会保存相关 Token。

例如：

```env
TELEGRAM_BOT_TOKEN=xxxxxxxxxxxxxxxx
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxx
DISCORD_BOT_TOKEN=xxxxxxxxxxxxxxxx
FEISHU_APP_ID=cli_xxxxxxxxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxx
```

作用是让 Hermes 可以通过外部消息平台接收任务、发送结果。

---

## 二、完整 `.env` 示例

下面是一个适合 Hermes 本地开发的 `.env` 示例：

```env
# ===============================
# Hermes 基础运行配置
# ===============================

APP_ENV=development
DEBUG=true
LOG_LEVEL=info

HERMES_ROOT=./
MEMORY_DIR=./Memory
LOG_DIR=./Logs
CACHE_DIR=./Cache
PROFILE_DIR=./Profile
SKILLS_DIR=./Skills
TOOLS_DIR=./Tools


# ===============================
# LLM Provider 配置
# ===============================

OPENAI_API_KEY=sk-your-openai-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-5.5-thinking

DEEPSEEK_API_KEY=your-deepseek-key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

QWEN_API_KEY=your-qwen-key
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus


# ===============================
# Memory / Database 配置
# ===============================

DATABASE_URL=sqlite:///./Memory/session_db.sqlite
MEMORY_PERSISTENCE=true

VECTOR_DB=chroma
CHROMA_HOST=http://localhost:8000
CHROMA_COLLECTION=hermes_memory


# ===============================
# 工具权限配置
# ===============================

ENABLE_TERMINAL=true
ENABLE_WEB_SEARCH=true
ENABLE_FILE_READ=true
ENABLE_FILE_WRITE=true
ENABLE_BROWSER_AUTOMATION=false
ENABLE_IMAGE_GENERATION=true


# ===============================
# Web / Search 配置
# ===============================

SEARCH_ENGINE=serpapi
SEARCH_API_KEY=your-search-api-key
BROWSER_HEADLESS=true
BROWSER_TIMEOUT=30000


# ===============================
# 安全配置
# ===============================

ALLOW_DANGEROUS_COMMANDS=false
COMMAND_APPROVAL_REQUIRED=true
MAX_FILE_WRITE_SIZE_MB=10
SANDBOX_MODE=true


# ===============================
# 消息网关配置（可选）
# ===============================

TELEGRAM_BOT_TOKEN=
SLACK_BOT_TOKEN=
DISCORD_BOT_TOKEN=
FEISHU_APP_ID=
FEISHU_APP_SECRET=
```

---

## 三、`.env` 各模块详解

### 1. 基础运行配置

```env
APP_ENV=development
DEBUG=true
LOG_LEVEL=info
```

#### 作用

控制 Hermes 当前运行环境。

| 字段 | 作用 |
|---|---|
| `APP_ENV` | 当前环境，开发 / 测试 / 生产 |
| `DEBUG` | 是否开启调试模式 |
| `LOG_LEVEL` | 日志级别 |

常见日志级别：

```txt
debug  最详细，适合开发排错
info   普通运行日志
warn   只显示警告
error  只显示错误
```

生产环境一般建议：

```env
APP_ENV=production
DEBUG=false
LOG_LEVEL=warn
```

### 2. 项目路径配置

```env
MEMORY_DIR=./Memory
LOG_DIR=./Logs
CACHE_DIR=./Cache
PROFILE_DIR=./Profile
SKILLS_DIR=./Skills
TOOLS_DIR=./Tools
```

#### 作用

告诉 Hermes 去哪里读取和保存文件。

| 字段 | 作用 |
|---|---|
| `MEMORY_DIR` | 记忆文件目录 |
| `LOG_DIR` | 日志目录 |
| `CACHE_DIR` | 缓存目录 |
| `PROFILE_DIR` | Agent Profile 目录 |
| `SKILLS_DIR` | 技能目录 |
| `TOOLS_DIR` | 工具目录 |

这些路径通常会被 `config.yaml` 引用。

### 3. 模型配置

```env
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-5.5-thinking
OPENAI_BASE_URL=https://api.openai.com/v1
```

#### 作用

让 Hermes 知道调用哪个模型、走哪个接口、使用哪个密钥。

| 字段 | 作用 |
|---|---|
| `OPENAI_API_KEY` | OpenAI API 密钥 |
| `OPENAI_MODEL` | 默认模型 |
| `OPENAI_BASE_URL` | API 地址 |

如果你在腾讯云部署，可能会遇到访问问题，这时常需要配置代理或兼容接口。

### 4. 记忆与数据库配置

```env
DATABASE_URL=sqlite:///./Memory/session_db.sqlite
MEMORY_PERSISTENCE=true
VECTOR_DB=chroma
CHROMA_COLLECTION=hermes_memory
```

#### 作用

支持 Hermes 的跨会话学习。

| 字段 | 作用 |
|---|---|
| `DATABASE_URL` | 会话数据库地址 |
| `MEMORY_PERSISTENCE` | 是否持久保存记忆 |
| `VECTOR_DB` | 向量数据库类型 |
| `CHROMA_COLLECTION` | 记忆集合名称 |

本地小项目可以用 SQLite。

```env
DATABASE_URL=sqlite:///./Memory/session_db.sqlite
```

多人协作或云端生产环境更适合 PostgreSQL：

```env
DATABASE_URL=postgresql://hermes:password@127.0.0.1:5432/hermes
```

### 5. 工具权限配置

```env
ENABLE_TERMINAL=true
ENABLE_WEB_SEARCH=true
ENABLE_FILE_READ=true
ENABLE_FILE_WRITE=true
```

#### 作用

控制 Hermes 是否能调用某些工具。

| 字段 | 作用 | 风险 |
|---|---|---|
| `ENABLE_TERMINAL` | 允许执行终端命令 | 高 |
| `ENABLE_WEB_SEARCH` | 允许联网搜索 | 中 |
| `ENABLE_FILE_READ` | 允许读取文件 | 中 |
| `ENABLE_FILE_WRITE` | 允许写入文件 | 高 |
| `ENABLE_BROWSER_AUTOMATION` | 允许浏览器自动化 | 中 |
| `ENABLE_IMAGE_GENERATION` | 允许图像生成 | 低 |

开发环境可以开放多一点。

生产环境建议谨慎：

```env
ENABLE_TERMINAL=false
ENABLE_FILE_WRITE=false
COMMAND_APPROVAL_REQUIRED=true
```

### 6. 搜索与浏览器配置

```env
SEARCH_ENGINE=serpapi
SEARCH_API_KEY=your-search-api-key
BROWSER_HEADLESS=true
BROWSER_TIMEOUT=30000
```

#### 作用

用于联网搜索、页面抓取、AI 搜索采样、GEO 结果记录。

| 字段 | 作用 |
|---|---|
| `SEARCH_ENGINE` | 搜索服务 |
| `SEARCH_API_KEY` | 搜索 API Key |
| `BROWSER_HEADLESS` | 浏览器是否无头运行 |
| `BROWSER_TIMEOUT` | 浏览器超时时间 |

### 7. 安全配置

```env
ALLOW_DANGEROUS_COMMANDS=false
COMMAND_APPROVAL_REQUIRED=true
SANDBOX_MODE=true
```

#### 作用

防止 Agent 做危险操作。

| 字段 | 建议 |
|---|---|
| `ALLOW_DANGEROUS_COMMANDS` | 强烈建议保持 `false` |
| `COMMAND_APPROVAL_REQUIRED` | 生产环境建议 `true` |
| `SANDBOX_MODE` | 建议开启 |
| `MAX_FILE_WRITE_SIZE_MB` | 防止大文件误写入 |

尤其是 Coding Agent，必须限制：

```txt
删除文件
覆盖配置
执行系统命令
读取敏感目录
上传密钥
```

---

## 四、`.env` 和 `config.yaml` 的配合方式

一般是这样：

### `.env`

```env
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-5.5-thinking
DATABASE_URL=sqlite:///./Memory/session_db.sqlite
```

### `config.yaml`

```yaml
provider:
  name: openai
  model: ${OPENAI_MODEL}
  api_key: ${OPENAI_API_KEY}

memory:
  database_url: ${DATABASE_URL}
```

运行时 Hermes 会把 `${OPENAI_API_KEY}` 替换成 `.env` 中的真实值。

这样做的好处是：

```txt
代码不暴露密钥
不同环境可以使用不同配置
本地和云端部署更方便
配置可复用
安全性更高
```

---

## 五、macOS 本地和腾讯云上的 `.env` 区别

### 5.1 macOS 本地开发版

```env
APP_ENV=development
DEBUG=true
DATABASE_URL=sqlite:///./Memory/session_db.sqlite
ENABLE_TERMINAL=true
ENABLE_FILE_WRITE=true
COMMAND_APPROVAL_REQUIRED=false
```

特点：

```txt
方便调试
权限更开放
使用本地文件和 SQLite
适合开发 Agent、调试 Skills
```

### 5.2 腾讯云生产版

```env
APP_ENV=production
DEBUG=false
LOG_LEVEL=warn
DATABASE_URL=postgresql://hermes:password@10.0.0.5:5432/hermes
ENABLE_TERMINAL=false
ENABLE_FILE_WRITE=false
COMMAND_APPROVAL_REQUIRED=true
SANDBOX_MODE=true
```

特点：

```txt
更强调安全
日志更克制
数据库独立
工具权限收紧
适合长期运行和多 Agent 协作
```

---

## 六、`.env` 最容易踩的坑

### 6.1 把 `.env` 提交到 Git

这是最危险的错误。

一定要在 `.gitignore` 里写：

```gitignore
.env
.env.local
.env.production
```

可以提交示例文件：

```txt
.env.example
```

但不要提交真实密钥。

### 6.2 Key 名称和 `config.yaml` 对不上

比如 `.env` 是：

```env
OPENAI_API_KEY=sk-xxx
```

但 `config.yaml` 写成：

```yaml
api_key: ${OPEN_API_KEY}
```

少了 `AI`，就会读取失败。

### 6.3 路径在 macOS 可用，云服务器不可用

本地写：

```env
MEMORY_DIR=/Users/coya/hermes/Memory
```

部署到 Linux 就会失效。

更建议用相对路径：

```env
MEMORY_DIR=./Memory
```

或者按环境拆分：

```txt
.env.development
.env.production
```

### 6.4 生产环境还开着危险工具

例如：

```env
ENABLE_TERMINAL=true
ALLOW_DANGEROUS_COMMANDS=true
```

这在云服务器上风险很高。

生产环境建议：

```env
ENABLE_TERMINAL=false
ALLOW_DANGEROUS_COMMANDS=false
COMMAND_APPROVAL_REQUIRED=true
```

---

## 七、建议的 3 文件拆分

### 7.1 `.env.example`

可以提交到 Git，作为团队模板。

```env
OPENAI_API_KEY=
OPENAI_MODEL=
DATABASE_URL=
ENABLE_TERMINAL=
ENABLE_WEB_SEARCH=
```

### 7.2 `.env.local`

本地开发使用，不提交。

```env
APP_ENV=development
DEBUG=true
```

### 7.3 `.env.production`

腾讯云生产环境使用，不提交。

```env
APP_ENV=production
DEBUG=false
```

---

## 八、一句话总结

Hermes 中的 `.env` 主要负责：

> 存放密钥、模型接口、数据库地址、工具权限、运行环境和安全开关。

它不负责定义 Agent 的工作流程，而是给 Hermes 提供运行所需的"隐藏变量"。

更直观地说：

```txt
SOUL.md        决定 Agent 的价值观
Profile.md     决定 Agent 的角色
Skills/        决定 Agent 会什么
Tools/         决定 Agent 能调用什么
config.yaml    决定系统怎么组织
.env           决定系统用哪些密钥、地址和环境变量
Memory/        决定 Agent 如何记住过去
```

对于 GEO 官网 / Coding Agent Team 这类项目来说，`.env` 尤其要管好三类东西：

```txt
1. 模型 Key
2. 数据库 / 记忆系统地址
3. 工具权限与安全开关
```
