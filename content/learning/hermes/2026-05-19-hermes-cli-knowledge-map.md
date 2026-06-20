---
title: "Hermes CLI 指令知识文档"
date: "2026-05-19"
summary: "Hermes CLI 完整命令地图——分 Shell 命令和 Slash 命令两层；全局选项（--profile / --resume / --continue / --worktree / --yolo / --tui 等）；hermes chat / -z 单次入口；hermes model / fallback / gateway / proxy / lsp / setup / whatsapp / slack / auth / status / cron / kanban 等 Shell 顶级命令逐个解释。"
tags:
  - hermes
  - CLI
  - 命令
  - 终端
  - 运维
status: draft
lang: zh
topic: hermes
englishSummary: "Complete Hermes CLI command map — two layers (Shell vs Slash); global options (--profile / --resume / --continue / --worktree / --yolo / --tui); hermes chat / -z single-shot entries; shell top-level commands explained one by one: hermes model / fallback / gateway / proxy / lsp / setup / whatsapp / slack / auth / status / cron / kanban."
---

# Hermes CLI 指令知识文档

> 来源：Hermes Agent 官方文档
> 适用对象：希望系统掌握 Hermes 终端命令、CLI 交互、Slash 命令、会话管理与运维命令的学习者。

## 0. 总览：Hermes CLI 是什么

Hermes CLI 是 Hermes Agent 的终端交互界面。它不是网页 UI，而是面向终端工作流的 Agent 操作入口，支持：

- 交互式聊天：直接运行 `hermes` 或 `hermes chat`。
- 单次问答：用 `hermes chat -q "..."` 或脚本专用的 `hermes -z "..."`。
- 模型、Provider、工具集、Skill 预加载。
- 多行输入、快捷键、会话恢复、上下文压缩。
- 终端内 Slash 命令，例如 `/model`、`/tools`、`/background`。
- Shell 层管理命令，例如 `hermes auth`、`hermes gateway`、`hermes skills`、`hermes logs`。

建议把 Hermes CLI 分成两层理解：

| 层级 | 在哪里输入 | 典型形式 | 作用 |
|---|---|---|---|
| Shell 命令 | 普通终端提示符里 | `hermes chat -q "Hello"` | 启动、配置、调试、运维 Hermes |
| Slash 命令 | Hermes 聊天会话内 | `/model claude-sonnet-4` | 在当前会话中切换状态、管理工具、控制任务 |

## 1. 全局入口

```bash
hermes [global-options] <command> [subcommand/options]
```

### 1.1 全局选项

| 指令/选项 | 中文解释 | 典型场景 |
| --- | --- | --- |
| `--version`, `-V` | 显示 Hermes 版本并退出。 | 确认安装版本、排查环境问题。 |
| `--profile <name>`, `-p <name>` | 本次运行使用指定 profile。 | 同一台机器区分工作/个人/项目环境。 |
| `--resume <session>`, `-r <session>` | 按会话 ID 或标题恢复某个历史会话。 | 回到某个明确的历史任务。 |
| `--continue [name]`, `-c [name]` | 恢复最近会话，或恢复与名称匹配的最近会话。 | 快速接着上次聊。 |
| `--worktree`, `-w` | 在隔离 git worktree 中启动。 | 多 Agent 并行修代码，避免互相覆盖。 |
| `--yolo` | 跳过危险命令审批提示。 | 高信任自动化环境；日常慎用。 |
| `--pass-session-id` | 把 session ID 放入系统提示中。 | 外部集成需要 Agent 知道当前 session。 |
| `--ignore-user-config` | 忽略 `~/.hermes/config.yaml`，使用内置默认配置；`.env` 仍会加载。 | 做干净复现、CI、排查个人配置干扰。 |
| `--ignore-rules` | 跳过自动注入 `AGENTS.md`、`SOUL.md`、`.cursorrules`、记忆与预加载 skills。 | 想要不受本地规则影响的独立运行。 |
| `--tui` | 启动现代 TUI，而不是经典 CLI。 | 想使用更现代的终端 UI。 |
| `--dev` | 与 `--tui` 搭配，直接运行 TypeScript 源码。 | Hermes TUI 贡献者开发调试。 |

## 2. 快速启动与常用写法

| 命令 | 作用 | 说明 |
| --- | --- | --- |
| `hermes` | 启动默认交互会话。 | 最常用入口。 |
| `hermes chat` | 启动 chat 命令的交互模式。 | 与默认入口接近。 |
| `hermes chat -q "Hello"` | 单次非交互问答。 | 适合一次性任务。 |
| `hermes chat --model "anthropic/claude-sonnet-4"` | 本次使用指定模型。 | 临时切模型。 |
| `hermes chat --provider nous` | 强制使用 Nous Portal。 | 指定 Provider。 |
| `hermes chat --provider openrouter` | 强制使用 OpenRouter。 | 指定 Provider。 |
| `hermes chat --toolsets "web,terminal,skills"` | 本次启用指定工具集。 | 限定或扩展可用工具。 |
| `hermes -s hermes-agent-dev,github-auth` | 启动时预加载多个 skill。 | 会话开始前就把能力放进上下文。 |
| `hermes chat -s github-pr-workflow -q "open a draft PR"` | 单次任务中预加载 skill。 | 适合脚本化工作流。 |
| `hermes --continue` 或 `hermes -c` | 恢复最近 CLI 会话。 | 回到上次工作。 |
| `hermes --resume <session_id>` 或 `hermes -r <session_id>` | 恢复指定会话。 | 精确恢复。 |
| `hermes chat --verbose` | 启用调试/详细输出。 | 排查工具调用与执行过程。 |
| `hermes -w` | 在隔离 worktree 中交互运行。 | 多 Agent 并发工作。 |
| `hermes -w -q "Fix issue #123"` | 在隔离 worktree 中跑单次任务。 | 自动修 issue、并行执行。 |

## 3. `hermes chat`

```bash
hermes chat [options]
```

`hermes chat` 是最核心的对话入口，既可以交互，也可以单次执行。

| 选项 | 中文解释 | 典型用法 |
| --- | --- | --- |
| `-q`, `--query "..."` | 单次 prompt，非交互运行。 | `hermes chat -q "总结这个仓库"` |
| `-m`, `--model <model>` | 本次覆盖模型。 | `hermes chat -m anthropic/claude-sonnet-4.6` |
| `-t`, `--toolsets <csv>` | 启用逗号分隔的工具集。 | `hermes chat -t web,terminal,skills` |
| `--provider <provider>` | 强制指定 Provider。 | `hermes chat --provider openrouter` |
| `-s`, `--skills <name>` | 预加载 skill；可重复或逗号分隔。 | `hermes chat -s github-auth -s plan` |
| `-v`, `--verbose` | 显示更详细的过程信息。 | 调试 Agent 行为。 |
| `-Q`, `--quiet` | 程序模式：隐藏 banner、spinner、工具预览。 | 需要干净输出时。 |
| `--image <path>` | 给单次 query 附加本地图片。 | 图片理解任务。 |
| `--resume <session>` / `--continue [name]` | 从 `chat` 直接恢复历史会话。 | `hermes chat --continue` |
| `--worktree` | 本次运行创建隔离 worktree。 | 并行开发。 |
| `--checkpoints` | 在破坏性文件变更前启用文件系统 checkpoint。 | 需要可回滚编辑时。 |
| `--yolo` | 跳过危险命令审批。 | 高信任自动化，谨慎使用。 |
| `--pass-session-id` | 把 session ID 注入系统提示。 | 外部系统集成。 |
| `--ignore-user-config` | 忽略用户配置。 | 复现问题。 |
| `--ignore-rules` | 跳过本地规则/记忆/预加载 skill。 | 完全独立运行。 |
| `--source <tag>` | 设置 session 来源标签，默认 `cli`。 | 第三方集成过滤。 |
| `--max-turns <N>` | 限制单轮最大工具调用迭代次数。 | 控制成本与 runaway 风险。 |

### 3.1 `hermes -z`：脚本专用单次入口

```bash
hermes -z "What's the capital of France?"
```

`hermes -z` 面向脚本、CI、cron、父进程管道调用。它只输出最终回答，不显示 banner、spinner、工具预览或 session 行。

| 配套参数 | 等价环境变量 | 作用 |
| --- | --- | --- |
| `-m`, `--model <model>` | `HERMES_INFERENCE_MODEL` | 本次覆盖模型。 |
| `--provider <provider>` | `HERMES_INFERENCE_PROVIDER` | 本次覆盖 Provider。 |

使用建议：

- 想捕获"纯最终答案"时，用 `hermes -z`。
- 想看工具过程、调试上下文时，用 `hermes chat -q`。

## 4. Shell 层顶级命令逐个解释

### 4.1 `hermes model`

```bash
hermes model
```

交互式 Provider 与模型选择器。用于添加 Provider、设置 API Key、运行 OAuth、配置自托管端点、保存默认模型。

注意：

- `hermes model` 是 Shell 命令，能添加新 Provider。
- `/model` 是会话内 Slash 命令，只能在已配置的 Provider/模型之间切换。

### 4.2 `hermes fallback`

```bash
hermes fallback <subcommand>
```

管理备用 Provider 链。当主模型遇到限流、过载或连接错误时，Hermes 按顺序尝试 fallback。

| 子命令 | 作用 |
| --- | --- |
| `list`, `ls` | 查看当前 fallback 链；无子命令时默认执行。 |
| `add` | 选择 Provider 与模型并追加到 fallback 链。 |
| `remove`, `rm` | 删除一个 fallback 条目。 |
| `clear` | 清空全部 fallback。 |

### 4.3 `hermes gateway`

```bash
hermes gateway <subcommand>
```

运行或管理消息网关服务，连接 Telegram、Discord、Slack 等平台。

| 子命令 | 作用 |
| --- | --- |
| `run` | 前台运行 gateway。WSL、Docker、Termux 推荐用它。 |
| `start` | 启动已安装的 systemd/launchd 后台服务。 |
| `stop` | 停止服务或前台进程。 |
| `restart` | 重启服务。 |
| `status` | 查看服务状态。 |
| `install` | 安装为 Linux systemd 或 macOS launchd 服务。 |
| `uninstall` | 移除已安装服务。 |
| `setup` | 交互式配置消息平台。 |

选项：

| 选项 | 作用 |
| --- | --- |
| `--all` | 对所有 profile 的 gateway 执行 start/restart/stop。 |

### 4.4 `hermes proxy`

启动本地 OpenAI-compatible proxy，并附加 OAuth Provider 凭据。适合让其他 OpenAI API 兼容客户端复用 Hermes 的认证能力。

### 4.5 `hermes lsp`

```bash
hermes lsp <subcommand>
```

管理 Language Server Protocol 集成。LSP 会运行 pyright、gopls、rust-analyzer 等语言服务器，把语义诊断接入写文件/打补丁后的检查。

| 子命令 | 作用 |
| --- | --- |
| `status` | 查看服务状态、已配置 server、安装状态。 |
| `list` | 列出支持的 language server；可加 `--installed-only`。 |
| `install <id>` | 安装某一个 server binary。 |
| `install-all` | 安装所有有自动安装方案的 server。 |
| `restart` | 重启 LSP client。 |
| `which <id>` | 输出某个 server binary 的路径。 |

### 4.6 `hermes setup`

```bash
hermes setup [model|tts|terminal|gateway|tools|agent] [--non-interactive] [--reset] [--quick] [--reconfigure]
```

首次运行时启动初始化向导；已配置用户再次运行时进入重新配置流程。

| section | 作用 |
| --- | --- |
| `model` | 配置 Provider 与模型。 |
| `terminal` | 配置终端后端和 sandbox。 |
| `gateway` | 配置消息平台。 |
| `tools` | 配置各平台工具启用状态。 |
| `agent` | 配置 Agent 行为。 |

| 选项 | 作用 |
| --- | --- |
| `--quick` | 只询问缺失或未设置项。 |
| `--non-interactive` | 使用默认值/环境变量，不进入交互。 |
| `--reset` | 先重置配置再 setup。 |
| `--reconfigure` | 兼容旧写法；现在裸 `hermes setup` 对已配置用户默认就是 reconfigure。 |

### 4.7 `hermes whatsapp`

```bash
hermes whatsapp
```

运行 WhatsApp 配对/设置流程，包括模式选择与二维码配对。

### 4.8 `hermes slack`

```bash
hermes slack manifest
hermes slack manifest --write
hermes slack manifest --slashes-only
```

生成 Slack App Manifest，把 gateway 命令注册为 Slack 原生 slash command。

| 选项 | 作用 |
| --- | --- |
| `--write [PATH]` | 写入文件；裸 `--write` 写到 `$HERMES_HOME/slack-manifest.json`。 |
| `--name NAME` | 设置 Slack bot 显示名。 |
| `--description DESC` | 设置 Slack app 描述。 |
| `--slashes-only` | 只输出 `features.slash_commands` 部分。 |

### 4.9 `hermes auth`

```bash
hermes auth <subcommand>
```

管理凭据池、OAuth 登录、API Key 增删、冷却状态重置等。

| 子命令 | 作用 |
| --- | --- |
| 无子命令 | 打开交互式管理向导。 |
| `list` | 列出所有凭据池。 |
| `list <provider>` | 查看某个 Provider。 |
| `add <provider> --api-key ...` | 添加 API Key。 |
| `add <provider> --type oauth` | 添加 OAuth 凭据。 |
| `remove <provider> <index>` | 按索引删除凭据。 |
| `reset <provider>` | 清除 cooldown 状态。 |
| `status <provider>` | 查看 Provider 认证状态。 |
| `logout <provider>` | 注销并清除认证状态。 |
| `spotify` | 通过 PKCE 认证 Spotify。 |

`hermes login` / `hermes logout` 已废弃，应改用 `hermes auth`、`hermes model` 或 `hermes setup`。

### 4.10 `hermes status`

```bash
hermes status [--all] [--deep]
```

查看 Agent、认证、平台状态。

| 选项 | 作用 |
| --- | --- |
| `--all` | 输出适合分享的脱敏全量信息。 |
| `--deep` | 执行更深入但可能更慢的检查。 |

### 4.11 `hermes cron`

```bash
hermes cron <list|create|edit|pause|resume|run|remove|status|tick>
```

管理定时任务。

| 子命令 | 作用 |
| --- | --- |
| `list` | 查看定时任务。 |
| `create`, `add` | 从 prompt 创建定时任务；可重复 `--skill` 附加 skill。 |
| `edit` | 修改时间、prompt、名称、投递方式、重复次数、skills。 |
| `pause` | 暂停任务，不删除。 |
| `resume` | 恢复暂停任务，并计算下次执行时间。 |
| `run` | 下一次 scheduler tick 时触发任务。 |
| `remove` | 删除任务。 |
| `status` | 查看 cron scheduler 是否运行。 |
| `tick` | 执行一次到期任务后退出。 |

### 4.12 `hermes kanban`

```bash
hermes kanban [--board <slug>] <action> [options]
```
