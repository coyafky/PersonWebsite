---
title: "HermesAgent"
date: "2026-05-03"
summary: "HermesAgent 整体介绍与 CLI 命令完全指南：核心定位（自改进 / 跨会话记忆 / 多平台集成 / Skills 程序化经验）、核心模块（Agent Loop / Memory / Skills / Tools / Gateway / Cron）、5 步快速开始（安装 → 配置 Provider → 启动 → 创建 Profile → 第一个任务）、CLI 全命令列表（chat / profile / skill / memory / session / plugin / cron / mcp / status / update）、6 个实际使用场景。"
tags:
  - hermes
  - CLI
  - 入门
  - 快速开始
  - 命令
status: published
lang: zh
topic: hermes
englishSummary: "HermesAgent overall introduction and CLI complete guide: core positioning (self-improving / cross-session memory / multi-platform integration / Skills as procedural experience), core modules (Agent Loop / Memory / Skills / Tools / Gateway / Cron), 5-step quick start (install → configure Provider → start → create Profile → first task), full CLI command list (chat / profile / skill / memory / session / plugin / cron / mcp / status / update), 6 practical use cases."
---

# HermesAgent

> HermesAgent 是一个面向开发者的 AI Agent 运行时——把工具调用、记忆、技能、上下文管理包装成可复用、可观测的工作单元。

---

## 一、什么是 HermesAgent

HermesAgent 不是 ChatGPT 那种"问答工具"，也不是 LangChain 那种"开发框架"——它是一个**开箱即用的 Agent 操作系统**。

核心特性：

- **Agent Loop**：用户输入 → Prompt 组装 → Provider 调用 → 工具执行 → 响应生成 → 记忆写入
- **Memory**：跨会话的长期记忆（用户偏好、项目事实、程序化经验）
- **Skills**：可复用的工作流模板（Markdown + 可选代码）
- **Tools**：70+ 内置工具 + Plugin 扩展
- **Gateway**：Telegram / Discord / Slack / 飞书 多平台接入
- **Cron**：自然语言定时任务
- **Profiles**：多环境隔离（工作 / 个人 / 项目）

HermesAgent 让 AI Agent 像一个"可调试的服务"——你能查看它调了哪个工具、读了哪段记忆、为什么选了这个 Skill，而不是只能看到最终输出。

## 二、核心模块

### 2.1 Agent Loop（核心循环）

```text
用户输入
  ↓
Prompt 组装（personality + memory + skills + context + history）
  ↓
Provider 调用（OpenAI / Anthropic / Ollama / DeepSeek）
  ↓
工具调度（terminal / web_search / file_ops / custom）
  ↓
结果整合
  ↓
响应生成
  ↓
记忆更新（add to MEMORY.md / project_facts）
  ↓
Session 保存（消息历史 + 摘要）
  ↓
输出给用户
```

### 2.2 Memory（记忆系统）

4 层架构：

1. **Working Memory**：当前会话上下文
2. **Short-term Session**：会话结束时的关键事实
3. **Long-term Persistent**：跨会话结构化记忆
4. **Vector RAG**：语义检索记忆

### 2.3 Skills（技能）

工作流模板：

- **格式**：Markdown + 可选 Python 代码
- **加载**：progressive disclosure（先索引，再加载主文档，最后加载引用）
- **触发**：自然语言匹配 / slash command / 显式调用
- **示例**：code-review、geo-content-generator、daily-summary

### 2.4 Tools（工具）

70+ 内置工具：

- terminal：执行 shell 命令
- file_ops：读写文件
- web_search：联网搜索
- browser：浏览器自动化
- vision：图片理解
- memory：记忆管理
- delegation：子 Agent 委派

### 2.5 Gateway（消息网关）

多平台接入：

- Telegram
- Discord
- Slack
- 飞书 / Lark
- WhatsApp / Signal
- Email

### 2.6 Cron（定时任务）

自然语言创建：

```text
用户：每天早上 9 点汇总昨天的 commit。
Agent：已创建 cron job，每天 9 点执行。
```

## 三、快速开始

### 3.1 安装

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# 或通过 pip
pip install hermes-agent

# 或从源码
git clone https://github.com/NousResearch/hermes-agent
cd hermes-agent
pip install -e .
```

### 3.2 配置 Provider

```bash
hermes setup
```

交互式配置：

```text
? 选择 Provider
  > OpenAI
    Anthropic
    Ollama (本地)
    DeepSeek
    自定义

? 输入 API Key
  > sk-xxxxxxxxxxxxxxxx

? 选择默认模型
  > gpt-5-mini
    gpt-5-mini
    claude-sonnet-4.6

? 配置 Memory（推荐 SQLite）
  > SQLite
    PostgreSQL
    暂不启用

配置完成！运行 `hermes` 开始使用。
```

### 3.3 启动 HermesAgent

```bash
# 启动交互式会话
hermes

# 一次性问答
hermes chat -q "今天 AI 圈有什么大新闻？"

# 指定 Profile
hermes --profile work

# 启用 TUI
hermes --tui
```

### 3.4 创建第一个 Profile

```bash
hermes profile create my-project
```

输出：

```text
✓ Profile 'my-project' 已创建
  路径: ~/.hermes/profiles/my-project/

下一步：
  1. 编辑 ~/.hermes/profiles/my-project/profile.yaml
  2. 添加 API Key 到 ~/.hermes/profiles/my-project/.env
  3. 运行 hermes --profile my-project
```

### 3.5 第一个任务

```bash
hermes --profile my-project
```

```text
用户：帮我设计一个 React 组件，接收 props 显示用户头像。

Agent：
1. 加载 my-project profile
2. 注入 personality（如果配置）
3. 调用 Skill: react-component-generator（如果存在）
4. 使用默认 Provider 生成代码
5. 输出：

```tsx
interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ src, alt, size = 'md' }: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`avatar avatar--${size}`}
    />
  );
}
```
```

## 四、CLI 命令完全指南

### 4.1 主命令

```bash
hermes                              # 启动交互式会话
hermes chat                          # 同上
hermes chat -q "..."                # 一次性问答
hermes chat --model claude-sonnet-4 # 临时切换模型
hermes chat --tools "web,terminal"  # 启用工具集
hermes --profile work                # 使用指定 Profile
hermes --resume sess_xxx             # 恢复会话
hermes --tui                         # 启动 TUI 模式
```

### 4.2 Profile 管理

```bash
hermes profile list                  # 列出所有 Profile
hermes profile create <name>         # 创建 Profile
hermes profile info <name>           # 查看 Profile 详情
hermes profile edit <name>           # 编辑 Profile
hermes profile delete <name>         # 删除 Profile
hermes profile validate <name>       # 校验 Profile
hermes profile diff <a> <b>          # 对比两个 Profile
```

### 4.3 Skill 管理

```bash
hermes skill list                    # 列出所有 Skill
hermes skill create <name>           # 创建 Skill
hermes skill info <name>             # 查看 Skill 详情
hermes skill edit <name>             # 编辑 Skill
hermes skill delete <name>           # 删除 Skill
hermes skill test <name>             # 测试 Skill
hermes skill publish <name>          # 发布 Skill
hermes skill search <keyword>        # 搜索 Skill
```

### 4.4 Memory 管理

```bash
hermes memory list                   # 列出记忆
hermes memory list --type prefs      # 按类型筛选
hermes memory show <id>              # 查看记忆详情
hermes memory search "keyword"       # 搜索记忆
hermes memory stats                  # 记忆统计
hermes memory export                 # 导出
hermes memory import                 # 导入
hermes memory delete <id>            # 删除
```

### 4.5 Session 管理

```bash
hermes session list                  # 列出会话
hermes session resume --last         # 恢复最近会话
hermes session resume <id>           # 恢复指定会话
hermes session export <id>           # 导出会话
hermes session import <file>         # 导入会话
hermes session search "keyword"      # 搜索会话
hermes session delete <id>           # 删除会话
hermes session archive <id>          # 归档会话
hermes session stats                 # 会话统计
```

### 4.6 Plugin 管理

```bash
hermes plugin list                   # 列出 Plugin
hermes plugin install <source>       # 安装 Plugin
hermes plugin enable <name>          # 启用 Plugin
hermes plugin disable <name>         # 禁用 Plugin
hermes plugin info <name>            # 查看 Plugin 详情
hermes plugin test <name>            # 测试 Plugin
hermes plugin reload <name>          # 重载 Plugin
hermes plugin uninstall <name>       # 卸载 Plugin
```

### 4.7 Cron 管理

```bash
hermes cron list                     # 列出定时任务
hermes cron create                   # 创建定时任务
hermes cron edit <id>                # 修改定时任务
hermes cron pause <id>               # 暂停任务
hermes cron resume <id>              # 恢复任务
hermes cron run <id>                 # 立即执行
hermes cron delete <id>              # 删除任务
hermes cron status                   # cron 状态
```

### 4.8 MCP 管理

```bash
hermes mcp list                      # 列出 MCP servers
hermes mcp add <name> --command ...  # 添加 MCP server
hermes mcp remove <name>             # 移除 MCP server
hermes mcp test <name>               # 测试 MCP server
hermes mcp configure <name>          # 配置 MCP server
hermes mcp enable <name>             # 启用
hermes mcp disable <name>            # 禁用
```

### 4.9 Gateway 管理

```bash
hermes gateway run                   # 前台运行
hermes gateway start                 # 后台启动
hermes gateway stop                  # 停止
hermes gateway status                # 查看状态
hermes gateway setup                 # 配置网关
hermes gateway install               # 安装为系统服务
```

### 4.10 系统命令

```bash
hermes status                        # Agent 状态
hermes config show                   # 查看配置
hermes config set <key> <value>      # 设置配置
hermes config validate               # 校验配置
hermes version                       # 版本
hermes update                        # 更新
hermes logs                          # 查看日志
hermes help                          # 帮助
```

## 五、典型使用场景

### 场景 1：个人 Coding 助手

```yaml
# profile: coding
providers:
  default: openai:gpt-5-mini
tools:
  terminal:
    allowed_commands: [git, npm, python, pytest]
  file_ops:
    allowed_paths: [~/code/personal]
```

```text
用户：帮我 review 一下 ~/code/personal/next-app 的代码。
Agent：（执行 git diff、读文件、调用 Skill: code-review）
输出：5 个改进建议 + 优化后的代码。
```

### 场景 2：飞书日报

```yaml
# profile: feishu-daily
tools:
  feishu_sender:
    enabled: true
cron:
  - name: daily-summary
    schedule: "0 9 * * *"
    prompt: "汇总昨天 commit，生成飞书日报"
```

每天 9 点自动推送日报到飞书群。

### 场景 3：GEO 内容生成

```yaml
# profile: lanhui-geo
providers:
  default: ollama:qwen2.5:7b
tools:
  web_search:
    enabled: true
context:
  brand:
    name: 蓝辉轻改
    services: [车膜, 车衣, 改色膜, 电动踏板, 轮毂]
```

```text
用户：基于品牌事实生成 10 个 GEO 优化 prompt。
Agent：（调用 Skill: geo-content-generator）
输出：10 个结构化 prompt，每个包含关键词、用户意图、答案框架。
```

### 场景 4：跨平台 Bot

```bash
hermes gateway setup
# 选择 Telegram → 输入 Bot Token → 完成
hermes gateway start
```

```text
Telegram 用户：今天天气怎么样？
Agent：（通过 Telegram Gateway 接收消息）
Bot：北京今天晴，25°C。
```

### 场景 5：自动化运营

```yaml
cron:
  - name: hn-daily
    schedule: "0 8 * * *"
    prompt: "汇总 HackerNews Top10 推送到 Telegram"
  - name: github-trending
    schedule: "0 8 * * *"
    prompt: "汇总 GitHub Trending 推送到 Telegram"
```

### 场景 6：企业知识库助手

```yaml
# 配合 Plugin: notion-memory
plugins:
  enabled:
    - notion_memory
memory:
  provider: notion_memory
```

```text
用户：上次讨论的蓝辉 Q2 营销策略在哪？
Agent：（从 Notion 检索）找到了，是 2026-04-15 那份文档。摘要如下...
```

## 六、配置示例

### 6.1 完整 config.yaml

```yaml
agent:
  name: my-agent
  default_profile: default
  max_concurrent_tasks: 3

providers:
  openai:
    type: openai
    api_key: ${OPENAI_API_KEY}
    default_model: gpt-5-mini

  ollama:
    type: ollama
    base_url: http://localhost:11434
    default_model: qwen2.5:7b

models:
  routing:
    strategy: task_based
    task_routing:
      coding: openai:gpt-5-mini
      chinese: ollama:qwen2.5:7b

tools:
  terminal:
    enabled: true
  web_search:
    enabled: true
  file_ops:
    allowed_paths: [~/code, ~/Documents]

memory:
  enabled: true
  backend: sqlite
  vector:
    enabled: true

logging:
  level: INFO
```

### 6.2 .env

```bash
# Provider
OPENAI_API_KEY=sk-xxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx

# Web Search
TAVILY_API_KEY=tvly-xxxxxxxx

# 飞书
FEISHU_WEBHOOK=https://open.feishu.cn/...

# Telegram
TELEGRAM_BOT_TOKEN=xxxxxxxx
```

## 七、与其他工具对比

| 维度 | HermesAgent | LangChain | ChatGPT | OpenClaw |
| --- | --- | --- | --- | --- |
| 形态 | 运行时 OS | 开发框架 | SaaS | 开源 |
| 学习曲线 | 低 | 高 | 极低 | 中 |
| 可扩展性 | Plugin + Skill | 代码级 | 不可 | Plugin |
| 记忆 | 内置 4 层 | 自建 | 有限 | 基础 |
| 多平台 | Gateway | 自建 | 不可 | 单一 |
| 适合 | 个人 / 小团队 | 开发者 | 普通用户 | 研究 |

## 八、学习路径

### 入门

1. 安装 + Quickstart
2. 配置 Provider
3. 第一次对话
4. 创建 Skill
5. 启动 Gateway（Telegram / 飞书）

### 进阶

1. 多 Profile 隔离
2. 长期记忆使用
3. 定时任务
4. Plugin 开发
5. MCP 集成

### 高阶

1. 自改进 Skill
2. 多 Agent 编排
3. Provider Routing
4. 外部 Memory Provider
5. 二次开发

## 九、常见问题

### Q1：HermesAgent 和 OpenClaw 是什么关系？

HermesAgent 是 OpenClaw 的下一代架构（同一个团队 Nous Research）。OpenClaw 偏向个人单机，HermesAgent 强调多平台、多 Agent、生产可用。

### Q2：必须用 OpenAI 吗？

不。可以使用：

- Anthropic Claude
- DeepSeek
- Ollama（本地）
- 任何 OpenAI 兼容 API

### Q3：记忆会不会泄露隐私？

HermesAgent 提供：

- 本地存储（默认 SQLite）
- 加密选项
- 隐私过滤
- 用户完全控制

### Q4：可以商用吗？

可以，HermesAgent 采用 MIT License。

### Q5：性能如何？

取决于 Provider 和工具。本地 Ollama 模型可以做到秒级响应，复杂任务（多工具调用）可能 5-30 秒。

## 十、总结

HermesAgent 是一个面向开发者的 AI Agent 操作系统——

- 开箱即用：装好就能跑
- 高度可扩展：Plugin + Skill + MCP
- 跨会话记忆：4 层架构
- 多平台集成：Gateway
- 多环境隔离：Profile

它不是"另一个 ChatGPT 客户端"，而是一个**让 Agent 真正可工程化、可调试、可生产**的运行时。

适合：

- 想用 AI 改造工作流的开发者
- 想搭自动化系统的个人 / 小团队
- 想要长期记忆 + 工具调用的研究者
- 需要多平台 Bot 的运营人员
