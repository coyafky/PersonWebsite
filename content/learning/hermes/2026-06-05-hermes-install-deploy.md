---
title: "Hermes 在 macOS 本地和腾讯云服务上的安装与部署流程"
date: "2026-06-05"
summary: "Hermes Agent 跨环境部署完整指南：macOS 本地开发版（Homebrew + Python 3.11+ + venv + cfgutil）和腾讯云生产版（CVM/TKE + systemd + PostgreSQL + 任务队列）的环境准备、依赖、配置、运行步骤对比；7 维差异表（运行环境 / 存储 / 部署方式 / 并发 / 网络 / 高可用 / 维护）。"
tags:
  - hermes
  - 安装
  - 部署
  - macOS
  - 腾讯云
  - 生产
status: draft
lang: zh
topic: hermes
englishSummary: "Hermes Agent cross-environment deployment guide: macOS local dev (Homebrew + Python 3.11+ + venv + cfgutil) vs Tencent Cloud production (CVM/TKE + systemd + PostgreSQL + task queue) — environment prep, dependencies, config, run steps, and 7-dimension comparison (runtime / storage / deployment / concurrency / network / HA / maintenance)."
---

# Hermes 在 macOS 本地和腾讯云服务上的安装与部署流程

从三个层面理解：**环境准备 → Hermes 安装 → 部署与运行**。

---

## 1. macOS 本地安装与部署

### 环境准备

1. **系统要求**
    - macOS 12 及以上
    - x86_64 或 Apple Silicon（M1/M2）CPU
    - 内存 ≥ 8GB（推荐16GB+）
2. **依赖工具**
    - Homebrew：用于安装 Python、Node、Git 等依赖
    - Python 3.11+（用于运行 Hermes Python Library 和 Agent）
    - Node.js / npm（如果前端开发 Agent 需要构建网页）
    - SQLite / FTS5（用于 Agent session search 和 memory）
    - Apple Configurator / cfgutil（用于设备测试或远程执行自动化命令）

### Hermes 安装

1. **获取 Hermes**
    - Git 克隆 Hermes 仓库（私有或内部）：

        ```bash
        git clone https://github.com/yourorg/hermes-agent.git
        cd hermes-agent
        ```

2. **Python 环境**
    - 建议使用 `venv` 或 `conda` 创建虚拟环境：

        ```bash
        python3 -m venv .venv
        source .venv/bin/activate
        pip install -r requirements.txt
        ```

3. **配置 Provider**
    - 修改 `provider_config.toml` 或 `.env`：

        ```toml
        # 示例
        wire_api = "responses"
        openai_api_key = "YOUR_API_KEY"
        ```

    - 注意：macOS 本地运行时，Hermes 默认会使用本地缓存和 memory 文件夹保存长期记忆和 session 数据。

### 部署与运行

1. **启动 Hermes**

    ```bash
    python main.py
    ```

2. **选择入口点**
    - CLI / Batch Runner / API Server
    - CLI：用于命令行交互和测试 Agent
    - API Server：允许其他服务调用 Hermes Agent

3. **运行效果**
    - 本地运行可以直接访问 memory、tools、session search
    - 支持测试与开发阶段的快速迭代
    - 可通过 cfgutil、终端和本地工具调试 Agent 自动化任务

---

## 2. 腾讯云服务部署

在云上部署 Hermes，目标是 **远程运行、并行 Agent、持久化存储和高可用**。

### 环境准备

1. **选择云实例**
    - 腾讯云 CVM 或 TKE（Kubernetes）
    - CPU 4核+ / 内存 8GB+（多 Agent 并发建议16GB+）
    - 网络：允许访问 OpenAI 或其他 API，及内部数据库访问
2. **系统与依赖**
    - Linux（CentOS 7/8、Ubuntu 20+）
    - Python 3.11+, Node.js, Git
    - 数据库：CVM 可用 SQLite，规模大可用 TencentDB PostgreSQL/MySQL
    - 持久化存储：云盘挂载（Memory/Session/Logs）

### Hermes 安装

1. **克隆代码**

    ```bash
    git clone https://github.com/yourorg/hermes-agent.git
    cd hermes-agent
    ```

2. **Python 虚拟环境**

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```

3. **配置**
    - `.env` 或 `provider_config.toml` 填写 API Key
    - 云上可以配置多个 Agent profile、独立 memory 文件夹或数据库 schema
    - 配置日志、session 数据持久化到云盘或数据库

### 部署与运行

1. **后台运行**
    - 使用 `tmux` / `screen` / `systemd` 让 Hermes 持久运行

    ```bash
    python main.py --daemon
    ```

2. **API Server 或 WebSocket**
    - 云端部署可以作为微服务对外提供 Agent API
    - 前端或其他 Agent 可以通过 HTTP/WS 调用 Hermes 执行任务

3. **多 Agent 调度**
    - 如果有多个 Agent（Brand Research / Content Engineer / Frontend Agent），可通过 Task Queue（Celery / RabbitMQ / Redis）统一调度
    - Memory 和 session 数据可集中存储在数据库，实现跨实例共享

---

## 3. 核心差异

| 特性 | macOS 本地 | 腾讯云服务 |
| --- | --- | --- |
| 运行环境 | 单机、交互式 | 可并发、多实例、远程调用 |
| 存储 | 本地 memory / session | 云盘或数据库，支持持久化和共享 |
| 部署方式 | CLI / Python script | API Server / Daemon / Kubernetes |
| 并发能力 | 受硬件限制 | 弹性伸缩，多 Agent 协同 |
| 网络访问 | 本地网络 | 云公网，方便调用外部 API |
| 高可用 | 单点 | 可使用多节点、负载均衡 |
| 维护与更新 | 本地手动 | CI/CD 自动部署 |

---

## 🔑 总结

- **macOS 本地**：快速迭代、调试、开发 Agent，便于测试新的 Profile、Skill 和 Soul
- **腾讯云**：稳定部署、可扩展、多 Agent 协作、持久化存储与跨会话学习、生产级服务
- **核心实现**：无论本地还是云端，Hermes 都依赖 **Python 环境 + memory/session + Skills/Tools + Provider 配置**，部署只是把这些模块放到对应平台并保持运行。
