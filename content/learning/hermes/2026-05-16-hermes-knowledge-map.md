---
title: "Hermes Agent 知识架构图"
date: "2026-05-16"
summary: "基于官方文档整理的 Hermes Agent 一级模块地图——12 大核心模块（安装 / 会话 / 上下文 / Tools / Skills / Memory / Gateway / 自动化 / 集成 / 多模态 / 安全 / 开发者架构）、12 个分支的树状知识图、模块依赖关系、按目标分流的学习顺序（CLI 助手 / Bot / 定时自动化 / 自定义工具 / 生产运行 / 框架贡献 / RL 训练），以及初学者最容易忽略的 12 个盲点。"
tags:
  - hermes
  - 知识架构
  - 学习路径
  - 入门
  - 进阶
status: draft
lang: zh
topic: hermes
englishSummary: "Hermes Agent knowledge architecture map — 12 first-level modules (Install/Sessions/Context/Tools/Skills/Memory/Gateway/Automation/Integration/Multimodal/Security/Architecture), tree-style knowledge graph with 12 branches, module dependencies, target-based learning paths (CLI assistant, Bot, automation, custom tools, production, framework contribution, RL training), and 12 common beginner blind spots."
---

# Hermes Agent 知识架构图

> 基于官方文档入口、Learning Path、Quickstart、Features Overview、Architecture、Skills、Memory、MCP、Cron、Messaging Gateway 整理。

## 1. 这个领域的核心问题是什么？

Hermes Agent 要解决的不是"如何调用一个大模型聊天"，而是：**如何把大模型变成一个可长期运行、可使用工具、可跨平台协作、可记忆和自我改进、可安全扩展的自主 Agent 系统。**

因此学习 Hermes 的主线应围绕 5 个问题展开：

1. Agent 如何接收任务：CLI/TUI、Gateway、API Server、ACP、Batch 等入口。
2. Agent 如何思考和维持上下文：Prompt Assembly、Context Files、Memory、Session、Compression。
3. Agent 如何行动：Tools、Toolsets、Terminal/File/Web/Browser/Code Execution/MCP。
4. Agent 如何长期变强：Skills、Persistent Memory、Session Search、Curator、自改进经验沉淀。
5. Agent 如何可靠运行：Provider、配置、凭证、安全、隔离、Gateway、Cron、Fallback、运维。

## 2. 一级模块知识地图

| 一级模块 | 重要性 | 为什么重要 | 二级知识点 |
| --- | --- | --- | --- |
| 领域定位与学习路径 | 核心 | 决定你把 Hermes 当 CLI 助手、Bot、自动化平台、扩展框架还是训练数据系统来学；不同目标路径不同。 | Hermes 是什么、典型用例、Learning Path、按经验等级学习、按 Use Case 学习 |
| 安装、配置与模型 Provider | 核心 | Hermes 能不能稳定启动，首先取决于 provider、模型、密钥、上下文长度和配置是否正确。官方 Quickstart 明确建议先跑通普通对话，再叠加高级能力。 | 安装、`hermes setup`、`hermes model`、`~/.hermes/config.yaml`、`~/.hermes/.env`、Provider 选择、模型上下文、Fallback 前置条件 |
| 交互入口与会话生命周期 | 核心 | Hermes 的同一个 AIAgent 能服务 CLI、Gateway、ACP、API、Batch；理解入口差异，才能理解会话、权限和工具集差异。 | CLI/TUI、Slash Commands、Sessions、`--continue`、Messaging Gateway、API Server、ACP、Batch Runner |
| Agent 核心循环与上下文系统 | 核心 | 这是 Hermes 的大脑：用户输入如何变成系统提示、模型调用、工具调用、压缩、持久化。不了解它会很难排查"为什么 Agent 这样回答/忘了上下文/工具没出现"。 | AIAgent、Prompt Builder、SOUL.md、Context Files、Context References、Prompt Caching、Context Compression、Session Storage、SQLite + FTS5 |
| Tools、Toolsets 与执行环境 | 核心 | Agent 的价值来自行动能力。Tools 决定它能读写文件、跑命令、联网、浏览器操作、执行代码；Toolsets 决定不同平台可用哪些能力。 | Tool Registry、Tool Dispatch、Toolsets、Terminal、File Tools、Web、Browser、Vision、Code Execution、审批、沙箱、local/docker/ssh/modal/daytona 等后端 |
| Skills 系统 | 核心 | Skills 是 Hermes 的"程序化经验库"，把可复用流程做成按需加载的知识包，是自改进能力的核心载体。 | `~/.hermes/skills/`、SKILL.md、Progressive Disclosure、Slash Command、Bundled Skills、Optional Skills、External Skill Dirs、Skill Config、Skill 安全加载 |
| Persistent Memory 与用户建模 | 核心 | Memory 让 Hermes 跨会话记住偏好、环境、项目和经验。它不是无限上下文，而是受限、被策展的长期记忆。 | MEMORY.md、USER.md、Memory Tool、容量限制、去重、注入时机、Session Search、Memory Providers、Honcho/mem0 等外部记忆 |
| Gateway 与跨平台消息系统 | 重要 | 如果目标是把 Hermes 变成 Telegram/Discord/Slack/飞书等 Bot，Gateway 是关键；它还承载 Cron 调度。 | `hermes gateway setup`、平台 Adapter、Session Reset、Allowlist/Pairing、Platform Toolsets、Busy Input Mode、Voice/TTS、文件/图片/线程支持 |
| 自动化与多 Agent 编排 | 重要 | 让 Hermes 从"被动对话"升级为"定时执行、并行执行、批量执行、事件驱动执行"。 | Cron、Skill-backed Cron、Workdir、Delegation、Subagents、Hooks、Batch Processing、Kanban、Persistent Goals、No-agent mode |
| 外部集成与扩展机制 | 重要 | 当内置工具不够时，需要通过 MCP、Plugins、API、Provider Routing 等方式接入外部系统。 | MCP stdio/HTTP、MCP Tool Filtering、Plugins、Memory Provider Plugins、Context Engine Plugins、API Server、ACP、Provider Routing、Fallback Providers、Credential Pools |
| 多模态、媒体与 Web 能力 | 可选 | 对语音助手、浏览器自动化、图片理解/生成很重要；但不是所有学习目标都必须先学。 | Voice Mode、TTS、Vision、Image Paste、Image Generation、Browser Backends、Web Extraction |
| 安全、权限与运维 | 核心 | Hermes 具备终端、文件和网络能力，必须理解安全边界；否则 Gateway/Bot/Cron 场景风险很高。 | Command Approval、Allowlist、Credential 管理、环境变量透传、Docker/SSH 隔离、Gateway 日志、Profiles、Checkpoints/Rollback、Troubleshooting |
| 开发者内部架构与贡献 | 高阶 | 只有需要改 Hermes 本体、加 Provider、加 Tool、加 Gateway Adapter、做 RL 训练时才需要深入。 | `run_agent.py`、`model_tools.py`、`hermes_state.py`、Provider Runtime、Adding Tools、Gateway Internals、Session Storage、Prompt Assembly、RL Training、Trajectory、Tests |

## 3. 树状知识地图

```text
Hermes Agent
├─ A. 定位与学习路径（核心）
│  ├─ 是什么：自改进 AI Agent，而非单纯 Chatbot
│  ├─ 主要形态：CLI 助手 / Bot / 自动化平台 / Python Library / 开发框架 / RL 数据系统
│  └─ 学习路径：Beginner → Intermediate → Advanced；按 Use Case 分流
├─ B. 安装与基础配置（核心）
│  ├─ 安装：Linux / macOS / WSL2 / Termux
│  ├─ Provider：Nous Portal / OpenAI Codex / Anthropic / OpenRouter / DeepSeek / Copilot 等
│  ├─ 配置文件：config.yaml 管非密钥，.env 管密钥
│  ├─ 模型要求：足够上下文、稳定工具调用、正确认证
│  └─ 验证：能完成普通聊天、能恢复 Session、能调用基础工具
├─ C. 交互入口与 Session（核心）
│  ├─ CLI / TUI
│  ├─ Slash Commands
│  ├─ Session 保存、恢复、搜索
│  ├─ Messaging Gateway
│  ├─ API Server / ACP / Python Library
│  └─ Batch Runner
├─ D. Agent 核心循环与上下文（核心）
│  ├─ AIAgent 主循环：输入 → Prompt → Provider → Tool Calls → 回答 → 保存
│  ├─ Prompt Builder：SOUL、Memory、Skills、Context Files、工具说明
│  ├─ Context Files：AGENTS.md、.hermes.md、CLAUDE.md、SOUL.md、.cursorrules
│  ├─ Context References：@file、@folder、@diff、@url
│  ├─ Compression / Caching
│  └─ Session Storage：SQLite + FTS5
├─ E. Tools 与执行环境（核心）
│  ├─ Tool Registry / Tool Dispatch
│  ├─ Toolsets：按平台启用/禁用工具
│  ├─ Terminal / File / Search / Browser / Vision / Memory / Delegation
│  ├─ Code Execution：Python 脚本通过 RPC 调 Hermes tools
│  ├─ Terminal Backends：local、docker、ssh、modal、daytona 等
│  └─ 安全审批与隔离
├─ F. Skills 系统（核心）
│  ├─ Skills 是按需加载的知识/流程包
│  ├─ SKILL.md 格式、references、scripts、templates、assets
│  ├─ Progressive Disclosure：先索引，再加载主文档，再加载引用文件
│  ├─ Slash Command 与自然语言调用
│  ├─ Skill 配置、环境变量、平台限制、条件激活
│  └─ Agent-created Skills 与 Skills Hub
├─ G. Memory 与长期学习（核心）
│  ├─ MEMORY.md：环境、项目、经验
│  ├─ USER.md：用户偏好、沟通风格、期望
│  ├─ 容量限制与策展：不是无限记忆
│  ├─ Session Search：查历史会话而非永久注入
│  ├─ 外部 Memory Providers
│  └─ 自改进闭环：经验 → 记忆/技能 → 后续任务复用
├─ H. Gateway 与跨平台 Bot（重要）
│  ├─ 支持平台：Telegram、Discord、Slack、WhatsApp、Signal、飞书、企微等
│  ├─ Gateway Daemon：统一接入和消息分发
│  ├─ Platform Adapter / Session Store / Delivery
│  ├─ Allowlist、Pairing、Reset Policy
│  ├─ Platform Toolsets
│  └─ Voice、TTS、图片、文件、线程
├─ I. 自动化与编排（重要）
│  ├─ Cron：自然语言或 cron 表达式定时任务
│  ├─ Skill-backed Cron：任务执行前加载一个或多个 Skills
│  ├─ Workdir：让定时任务带项目上下文运行
│  ├─ Delegation：并行子 Agent
│  ├─ Hooks：生命周期回调、监控、拦截、告警
│  └─ Batch Processing：批量 prompt、轨迹数据、评测/训练数据
├─ J. 集成与扩展（重要）
│  ├─ MCP：接 GitHub、数据库、文件系统、内部 API 等外部工具
│  ├─ MCP stdio / HTTP、动态工具发现、工具过滤
│  ├─ Plugins：工具、Hooks、Memory Provider、Context Engine
│  ├─ Provider Routing / Fallback / Credential Pools
│  ├─ API Server / ACP Editor Integration
│  └─ 添加 Provider、Tool、Gateway Adapter
├─ K. 多模态与媒体能力（可选）
│  ├─ Voice Mode / TTS
│  ├─ Vision / Image Paste
│  ├─ Image Generation
│  └─ Browser Automation
└─ L. 开发者内部与 RL（高阶）
   ├─ Architecture 总览
   ├─ Agent Loop Internals
   ├─ Prompt Assembly
   ├─ Provider Runtime Resolution
   ├─ Tools Runtime
   ├─ Gateway Internals
   ├─ Session Storage
   ├─ Context Compression
   └─ RL Training / Trajectory / Environments
```

## 4. 基础前置知识

| 前置知识 | 为什么需要 |
| --- | --- |
| 命令行基础 | Hermes 首先是 CLI 工具；安装、配置、调试、日志和服务管理都离不开终端。 |
| YAML、环境变量、密钥管理 | `config.yaml` 与 `.env` 是 Hermes 配置核心，Provider 和 Gateway 都依赖密钥。 |
| LLM 基础概念 | 需要理解模型、上下文窗口、工具调用、系统提示、温度、Provider 差异。 |
| Git/文件系统基础 | Hermes 常用于代码项目，Context Files、文件读写、Checkpoints 都依赖项目目录理解。 |
| 基础安全意识 | Agent 可以执行命令和访问文件；必须理解 allowlist、审批、沙箱、凭证隔离。 |
| Python 基础（进阶前置） | Code Execution、插件、开发者内部、RL 训练都大量涉及 Python。 |
| Docker/SSH/Cron 基础（自动化前置） | 若要安全运行终端后端、远程执行或定时任务，需要掌握这些基础。 |
| Bot 平台基础（Gateway 前置） | Telegram/Discord/Slack/飞书等需要 token、webhook、用户 ID、权限配置。 |

## 5. 高阶知识

1. **Agent Loop Internals**：理解 Provider Resolution、Prompt Assembly、Tool Dispatch、Retry、Fallback、Persistence。
2. **自定义 Tools / Plugins**：不改核心代码扩展能力，或在核心中注册新工具。
3. **MCP 深度配置**：stdio/HTTP、tool include/exclude、resource/prompt utility、动态工具刷新、安全过滤。
4. **Provider Routing / Fallback / Credential Pools**：面向成本、速度、稳定性做模型路由和容灾。
5. **Gateway Internals 与平台 Adapter**：新增消息平台或深度定制消息分发。
6. **Context Compression / Prompt Caching**：长会话性能、成本、记忆一致性的关键。
7. **Batch Processing 与 RL Training**：生成轨迹数据、训练/评测 Agent 行为。
8. **外部 Memory Providers / Context Engines**：替换或增强内置记忆与上下文管理。

## 6. 初学者容易忽略的知识

| 容易忽略点 | 后果 |
| --- | --- |
| 先跑通普通聊天，再加 Gateway/Cron/Skills | 基础 provider 或密钥错误时，叠加功能会让排错复杂化。 |
| 模型上下文长度要求 | 小上下文模型不适合多步工具调用和长上下文 Agent 工作流。 |
| `.env` 与 `config.yaml` 的分工 | 把密钥和普通配置混用会带来安全和迁移问题。 |
| Session 与 Memory 是两套机制 | Session 是会话历史，Memory 是被策展的长期事实；不能把 Memory 当无限历史。 |
| Memory 有容量上限 | 需要合并、替换、删除，而不是无限追加。 |
| Context Files 会强烈影响行为 | AGENTS.md、SOUL.md、.hermes.md 可能解释"为什么 Agent 总按某种方式做事"。 |
| Platform Toolsets 不同 | CLI 和 Telegram/Discord/飞书里可用工具可能不同，排查时要看平台工具集。 |
| Gateway 默认安全策略 | Bot 有终端能力，必须配置 allowlist/pairing，否则风险很高。 |
| Cron 的 workdir | 没有 workdir 的定时任务不会自动加载项目 AGENTS.md 等上下文。 |
| MCP 工具命名与过滤 | MCP 工具会被前缀注册；不做过滤会让工具列表膨胀或暴露过多能力。 |
| Skills 是按需加载，不是全部塞进 prompt | 这解释了为什么需要清晰 description 和 progressive disclosure。 |
| Checkpoints/Rollback | 文件修改前的快照是安全网，实际开发使用时应知道如何回滚。 |

## 7. 推荐学习顺序

### 通用主线

1. **读 Documentation 首页和 Learning Path**：先确定你是学 CLI、Bot、自动化、扩展还是训练。
2. **Installation + Quickstart**：安装、选择 Provider、启动 CLI/TUI、完成第一轮可验证对话。
3. **Configuration + Sessions**：理解 `config.yaml`、`.env`、profile、session 保存/恢复。
4. **CLI Usage + Context Files**：掌握 slash commands、项目上下文、`@` 引用文件/目录/diff/url。
5. **Tools & Toolsets + Security**：知道 Hermes 能做什么、在哪些平台能做、危险操作如何审批和隔离。
6. **Skills + Memory**：学习 Hermes 的长期学习机制：经验如何沉淀成 skill 和 memory。
7. **Gateway**：如果要 Bot 化，再学消息平台、allowlist、session reset、platform toolsets。
8. **Cron + Delegation + Code Execution**：进入自动化、多 Agent 并行和程序化工具调用。
9. **MCP + Plugins + Provider Routing**：接入外部工具、定制扩展、提高稳定性和成本效率。
10. **Architecture + Developer Guide + RL Training**：需要改源码、贡献、训练或深度调试时再深入。

### 按目标分流

| 目标 | 推荐顺序 |
| --- | --- |
| CLI 编码助手 | Installation → Quickstart → CLI Usage → Configuration → Tools → Context Files → Sessions |
| Telegram/Discord/飞书 Bot | Installation → Quickstart → Configuration → Messaging Gateway → Security → Platform Setup → Voice/TTS（可选） |
| 定时自动化 | Quickstart → Tools → Skills → Cron → Workdir → Delegation → Hooks |
| 自定义工具/技能 | Plugins → Skills → Tools → MCP → Architecture → Adding Tools / Creating Skills |
| 团队/生产运行 | Configuration → Security → Gateway → Profiles → Provider Routing → Fallback → Logs/Troubleshooting |
| 框架开发/贡献 | Architecture → Agent Loop → Prompt Assembly → Provider Runtime → Tools Runtime → Gateway Internals → Tests |
| RL/数据生成 | Quickstart → Configuration → Batch Processing → Trajectory → RL Training → Environments |

## 8. 模块依赖关系

| 上游模块 | 依赖它的模块 | 依赖说明 |
| --- | --- | --- |
| 安装与 Provider | 所有模块 | Hermes 必须先能正常启动并调用模型。 |
| Configuration | Tools、Gateway、Cron、MCP、Plugins、Provider Routing | 这些能力都从配置读取模型、密钥、工具集、平台和集成信息。 |
