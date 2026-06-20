---
title: "Hermes 连接 GitHub MCP 项目实战"
date: "2026-05-16"
summary: "Project 01 实战整理：Hermes Agent 通过 MCP 连接 GitHub 的完整方案——链路结构（Hermes CLI → MCP Client → GitHub MCP Server → GitHub API）、为何不用废弃的 npm 包而采用官方 Docker 镜像 ghcr.io/github/github-mcp-server、当前连接状态（stdio transport / 26 个 GitHub MCP tools 列表）、本机前置检查（Hermes / Docker 29.4.3 / Node v24.15）、Fine-grained GitHub Token 权限矩阵、Token 存放位置 ~/.hermes/.env、Docker wrapper 启动脚本、hermes mcp add / test / configure 完整流程、5 项成功标准、5 个常见问题排查、5 步下一步练习。"
tags:
  - hermes
  - GitHub
  - MCP
  - Docker
  - 项目实战
  - 集成
status: draft
lang: zh
topic: hermes
englishSummary: "Project 01 hands-on: complete Hermes Agent connecting to GitHub via MCP — link structure (Hermes CLI → MCP Client → GitHub MCP Server → GitHub API), why not use deprecated npm package but official Docker image ghcr.io/github/github-mcp-server, current connection status (stdio transport / 26 GitHub MCP tools list), local pre-checks (Hermes / Docker 29.4.3 / Node v24.15), Fine-grained GitHub Token permission matrix, Token location ~/.hermes/.env, Docker wrapper startup script, complete hermes mcp add / test / configure flow, 5 success criteria, 5 common troubleshooting issues, 5-step next practice."
---

# Project 01 - Hermes 连接 GitHub MCP

> 目标：让 Hermes Agent 通过 MCP 连接 GitHub，从而具备读取仓库、Issue、PR、文件、搜索代码，甚至创建/更新 GitHub 对象的能力。
> 当前状态：已通过 stdio MCP server 建立 Hermes 与 GitHub 的连接；`hermes mcp test github` 已发现 26 个 GitHub MCP tools。

## 一、项目目标

Hermes 本身是 MCP Client。GitHub MCP Server 是一个外部工具服务器。连接成功后，链路是：

```text
Hermes CLI
  → MCP Client
  → GitHub MCP Server
  → GitHub API
  → 你的仓库 / Issue / PR / Actions
```

也就是说，Hermes 不需要自己内置 GitHub API 细节；它只要能启动并连接 GitHub MCP Server，就可以把 GitHub 暴露出来的工具注册到 Hermes 工具系统里。

## 二、为什么不用 npm 包

菜鸟教程使用的是：

```bash
npx -y @modelcontextprotocol/server-github
```

这条路线能帮助理解 MCP 基本概念，但现在不推荐作为主方案。GitHub 官方的 MCP Server 仓库已经说明：旧的 `@modelcontextprotocol/server-github` npm 包在 2025-04 已废弃，建议迁移到官方 GitHub MCP Server。

本 project 采用更稳的官方 Docker 镜像：

```text
ghcr.io/github/github-mcp-server
```

优点：

- 由 GitHub 官方维护。
- 不依赖旧 npm 包。
- Docker 运行环境更稳定。
- Hermes 配置里不用直接写复杂 Node 启动命令。

## 三、当前连接状态

当前 Hermes MCP 配置：

```yaml
mcp_servers:
  github:
    command: /Users/fkycoya/.npm-global/bin/mcp-server-github
    enabled: true
```

验收命令：

```bash
hermes mcp list
hermes mcp test github
```

当前验收结果：

| 检查项 | 结果 |
|---|---|
| MCP server 名称 | `github` |
| Transport | `stdio` |
| 启动命令 | `/Users/fkycoya/.npm-global/bin/mcp-server-github` |
| 状态 | enabled |
| 连接测试 | 成功 |
| 发现工具数 | 26 |

已发现的核心工具包括：

| 工具 | 作用 |
|---|---|
| `search_repositories` | 搜索 GitHub 仓库。 |
| `get_file_contents` | 读取仓库中的文件或目录内容。 |
| `create_or_update_file` | 创建或更新单个文件。 |
| `push_files` | 一次性推送多个文件。 |
| `create_repository` | 创建新仓库。 |
| `list_commits` | 获取分支 commit 列表。 |
| `list_issues` | 列出仓库 issue。 |
| `get_issue` | 获取单个 issue 详情。 |
| `create_issue` | 创建 issue。 |
| `update_issue` | 更新 issue。 |
| `add_issue_comment` | 给 issue 添加评论。 |
| `list_pull_requests` | 列出 PR。 |
| `get_pull_request` | 获取 PR 详情。 |
| `get_pull_request_files` | 获取 PR 改动文件。 |
| `get_pull_request_status` | 获取 PR 检查状态。 |
| `get_pull_request_comments` | 获取 PR review comments。 |
| `get_pull_request_reviews` | 获取 PR reviews。 |
| `create_pull_request` | 创建 PR。 |
| `create_pull_request_review` | 创建 PR review。 |
| `merge_pull_request` | 合并 PR。 |
| `search_code` | 搜索代码。 |
| `search_issues` | 搜索 issue 和 PR。 |
| `search_users` | 搜索用户。 |

## 四、本机前置检查

| 项目 | 当前结果 |
|---|---|
| Hermes | 已安装：`/Users/fkycoya/.local/bin/hermes` |
| Docker | 已安装：`/usr/local/bin/docker` |
| Docker Server | 可用：`29.4.3` |
| Node | 已安装：`v24.15.0` |
| MCP 配置 | 当前没有 MCP server |

可自行复查：

```bash
hermes mcp list
docker info --format '{{.ServerVersion}}'
node --version
```

## 五、准备 GitHub Token

进入 GitHub：

```text
GitHub → Settings → Developer settings → Personal access tokens
```

推荐使用 Fine-grained token。权限按你的目标选择：

| 目标 | 建议权限 |
|---|---|
| 只读公开仓库 | 可以先不连私有权限，或只给目标 public repo 权限。 |
| 读取私有仓库、PR、Issue | 给目标 repository 的 Contents、Issues、Pull requests 读权限。 |
| 创建 Issue / 评论 PR | Issues / Pull requests 写权限。 |
| 读取 Actions 状态 | Actions 读权限。 |
| 操作多个私有仓库 | 尽量限定 owner 和 repository 范围，不要一上来全账号开放。 |

如果用 classic token，最常见的最小组合是：

```text
repo
read:org
```

但 classic token 权限颗粒更粗，学习阶段更建议 Fine-grained token。

## 六、把 Token 放到 Hermes 本地 `.env`

不要把 token 写进项目文档，也不要发到聊天里。把它放在本机：

```bash
mkdir -p ~/.hermes
nano ~/.hermes/.env
```

加入一行：

```bash
GITHUB_PERSONAL_ACCESS_TOKEN=你的 GitHub token
```

保存后验证变量是否能被 shell 读取：

```bash
set -a
source ~/.hermes/.env
set +a
test -n "$GITHUB_PERSONAL_ACCESS_TOKEN" && echo "GitHub token loaded"
```

## 七、可选方案：Docker wrapper 启动脚本

也可以准备一个 Docker wrapper 作为备用方案：

```bash
/Users/fkycoya/Documents/MySecondBrain/02-Projects/5-13Hermes学习/scripts/github-mcp-docker.sh
```

它做三件事：

1. 读取 `~/.hermes/.env`。
2. 检查 `GITHUB_PERSONAL_ACCESS_TOKEN` 是否存在。
3. 启动 GitHub 官方 MCP Docker 镜像。

脚本内容核心逻辑：

```bash
exec docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN \
  ghcr.io/github/github-mcp-server
```

这样 Hermes 配置里只记录脚本路径，不直接记录 token。

## 八、添加 GitHub MCP 到 Hermes

设置好 token 后，运行：

```bash
hermes mcp add github \
  --command "/Users/fkycoya/Documents/MySecondBrain/02-Projects/5-13Hermes学习/scripts/github-mcp-docker.sh"
```

Hermes 会做 discovery：

1. 启动这个 MCP server。
2. 连接 GitHub MCP Server。
3. 列出 GitHub 暴露的 tools。
4. 问你是否启用所有 tools。

学习阶段建议先选择：

```text
Y
```

也就是先全部启用，后续再用：

```bash
hermes mcp configure github
```

按需关闭高风险写操作。

## 九、测试连接

### 9.1 Shell 层测试

```bash
hermes mcp test github
```

成功时应该看到类似：

```text
Connected! Found N tool(s)
```

### 9.2 会话内测试

进入 Hermes 会话后：

```bash
hermes
```

在 Hermes 内输入：

```text
/tools
```

你应该能看到 GitHub MCP 相关工具。Hermes 的 MCP 工具命名通常是：

```text
github:<tool_name>
```

然后可以问：

```text
请用 GitHub MCP 查看我有权限访问的仓库列表。
```

或指定一个仓库：

```text
请用 GitHub MCP 读取 owner/repo 的最近 5 个 open issues，并总结每个 issue 的状态。
```

## 十、成功标准

| 检查点 | 验收方式 |
|---|---|
| GitHub MCP server 能启动 | `hermes mcp test github` 连接成功。 |
| Hermes 能发现工具 | `hermes mcp list` 显示 `github`。 |
| 会话内能看到工具 | Hermes 内 `/tools` 出现 `github:*` 工具。 |
| 能读取 GitHub 数据 | 让 Hermes 读取一个 repo、issue 或 PR，返回真实内容。 |
| 权限边界可控 | Fine-grained token 只授予必要 repo 和操作权限。 |

## 十一、常见问题

### 11.1 `GITHUB_PERSONAL_ACCESS_TOKEN is not set`

原因：`~/.hermes/.env` 里没有 token，或变量名写错。

修复：

```bash
nano ~/.hermes/.env
```

确认存在：

```bash
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...
```

### 11.2 Docker 找不到镜像或拉取失败

先手动拉取：

```bash
docker pull ghcr.io/github/github-mcp-server
```

再测试：

```bash
hermes mcp test github
```

### 11.3 Hermes 显示连接成功但没有工具

可能原因：

- GitHub MCP Server 启动失败但 stderr 被写到日志。
- Token 权限不足。
- Hermes MCP discovery 没拿到 tool list。

排查：

```bash
hermes logs agent -n 100
tail -100 ~/.hermes/logs/mcp-stderr.log
```

### 11.4 想重配

删除再添加：

```bash
hermes mcp remove github
hermes mcp add github \
  --command "/Users/fkycoya/Documents/MySecondBrain/02-Projects/5-13Hermes学习/scripts/github-mcp-docker.sh"
```

### 11.5 连接后想减少可调用工具

运行交互式工具筛选：

```bash
hermes mcp configure github
```

也可以在 Hermes 会话内：

```text
/tools
```

## 十二、下一步练习

连接成功后，按这个顺序练：

1. **读取仓库信息**：让 Hermes 总结某个 repo 的 README。
2. **读取 issue**：列出 open issues，并按优先级分类。
3. **读取 PR**：总结 PR diff 和 review 风险。
4. **写操作**：创建一个测试 issue。
5. **Code Review project**：让 Hermes 基于 GitHub MCP 做 PR review。

## 十三、官方与参考资料

- Hermes MCP 命令：`hermes mcp --help`、`hermes mcp add --help`
- Hermes CLI 文档：[CLI Interface](https://hermes-agent.nousresearch.com/docs/user-guide/cli)
- Hermes CLI Commands Reference：[CLI Commands Reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
- GitHub 官方 MCP Server：[github/github-mcp-server](https://github.com/github/github-mcp-server)
