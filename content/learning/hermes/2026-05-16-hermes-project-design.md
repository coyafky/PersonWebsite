---
title: "Hermes Agent 实战项目设计"
date: "2026-05-16"
summary: "三个递进式 Hermes Agent 实战项目设计：项目一「飞书日报助手」（入门 — Installation + Gateway + Cron）、项目二「Code Review Agent」（进阶 — Plugin + MCP + Skill 自改进 + 并发执行）、项目三「HermesOps 全链路运营平台」（高级 — Delegation + Honcho + 多 Gateway + Credential Pools + Trajectory 导出）。每个项目给出适合阶段、知识点、MVP、进阶版本、具体步骤、交付物、评价标准、常见坑、作品化方法。"
tags:
  - hermes
  - 实战项目
  - 飞书
  - Code Review
  - 自动化
  - 作品集
status: draft
lang: zh
topic: hermes
englishSummary: "Three escalating Hermes Agent hands-on project designs: Project 1 Feishu Daily Report Bot (intro — Installation + Gateway + Cron), Project 2 Code Review Agent (intermediate — Plugin + MCP + Skill self-improvement + concurrency), Project 3 HermesOps full-stack operations platform (advanced — Delegation + Honcho + multi-Gateway + Credential Pools + Trajectory export). Each project lists target stage, knowledge points, MVP, advanced version, concrete steps, deliverables, evaluation criteria, common pitfalls, and portfolio-ization paths."
---

# Hermes Agent 实战项目设计

---

## 项目一：飞书日报助手

### 1. 项目名称
飞书日报助手 — 自动收集日报并推送到飞书群

### 2. 项目目标
搭建一个 Hermes Agent，每天早上定时收集团队成员日报（GitHub commit、Jira 更新等），整理成结构化报告推送到飞书群。

### 3. 适合阶段
入门 — 熟悉 Hermes Agent 安装、配置、Gateway 和 Cron 机制

### 4. 会用到的知识点
- Hermes Agent 安装与配置 (`hermes setup`, `hermes model`)
- 飞书/Lark Gateway 适配器配置
- Cron 定时任务 (`/schedule` or API `/api/jobs`)
- Skill 基础概念与调用
- 日志查看 (`hermes logs`)
- 多 Provider 切换 (`hermes model`)

### 5. MVP
1. 安装 Hermes Agent 并选择可用的 Provider（如 GPT-4o / DeepSeek）
2. 配置飞书 Gateway，能通过飞书私聊与 Agent 对话
3. 写一个简单的 prompt 让 Agent「每天早上 9 点发送一条『早上好』到指定飞书群」
4. 用 `hermes cron` 或 `/schedule` 实现定时触发

### 6. 进阶版本
- 集成 GitHub API（通过 MCP 或自定义 tool），自动拉取昨天仓库的 commit 记录
- 让 Agent 自动总结 commit 内容，生成中英文双语日报
- 增加日报模板自定义能力（通过 memory 记住用户的格式偏好）
- 在日报中附带链接，飞书消息支持 markdown 格式
- 支持@指定成员、艾特特定群组
- 通过 plugin 添加自定义 tool：`get_github_commits`、`get_jira_updates`、`get_ci_status`

### 7. 具体步骤
1. `curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash`
2. `hermes model` 选择一个 Provider（推荐 DeepSeek 免费额度或 OpenAI）
3. `hermes setup` 运行配置向导
4. 配置飞书 Gateway（需要飞书开发者后台创建应用，获取 App ID / Secret）
5. `hermes gateway start` 启动网关
6. 在飞书上向 Bot 发消息测试连通性
7. 在对话中向 Agent 描述需求：「每天早上 9 点，请总结我的 GitHub 仓库昨天的 commit」
8. Agent 会自动创建 cron job 写入 SQLite
9. 用 `hermes logs` 查看 cron 执行日志
10. 逐步调整 prompt 直到日报格式满意

### 8. 交付物
- 一个可运行的飞书 Bot，每天早上自动推送日报
- cron job 配置（可通过 `hermes cron list` 查看）
- （进阶）自定义 plugin 或 skill 代码

### 9. 评价标准
- 飞书 Gateway 能正常收发消息，不报错
- Cron 定时任务按预期时间触发
- Agent 能正确获取外部数据（GitHub API 等）
- 日报内容准确，格式清晰
- Agent 能通过 memory 记住用户偏好（进阶）

### 10. 常见坑
- **飞书权限配置**：飞书应用需要开启 `im:message` 权限，并且 Bot 必须加入目标群
- **Gateway 进程保活**：Gateway 是长进程，需要用 systemd / supervisor / screen 保持运行
- **Cron 时区问题**：默认 UTC，需显式指定 `TZ=Asia/Shanghai`
- **飞书消息长度限制**：飞书富文本消息有大小限制，超出会报错
- **Provider 费用**：定时任务持续调用会消耗 token，注意监控 `/cost`
- **Agent 误解意图**：Hermes 的 cron 是通过自然语言描述创建的，表述不清会导致意外行为

### 11. 如何变成作品集
- 做成开源项目，发布到 GitHub，附上演示截图和配置教程
- 在博客记录搭建过程：踩坑记录 + 架构图（Mermaid 画 Gateway + Cron + Agent 交互流程）
- 录制 2 分钟演示视频，展示飞书群自动收到日报的效果
- 作品适合展示：企业自动化能力、AI Agent 工程化落地

---

## 项目二：自定义 Code Review Skill

### 1. 项目名称
Code Review Agent — 基于 Hermes Skill 的自动化代码审查助手

### 2. 项目目标
开发一个 Hermes Plugin/Skill，让 Agent 能通过 GitHub MCP 拉取 PR，自动进行代码审查并发表评论。Skill 本身具备自我改进能力——当 review 发现新的代码模式时，skill 自动更新自己的审查规则。

### 3. 适合阶段
进阶 — 已掌握 Hermes 基础操作，需要深入 Plugin 机制和 Skill 自改进

### 4. 会用到的知识点
- Hermes Plugin 架构（`~/.hermes/plugins/`、生命周期钩子）
- MCP Server 配置与使用（GitHub MCP）
- Skill 文档结构与自改进机制（`~/.hermes/skills/`）
- Concurrent Tool Execution（多文件并行 review）
- Context Compression（处理大 PR 时的上下文管理）
- Hermes Curator（skill 管理）
- `hermes tools` 配置 tool 可见性

### 5. MVP
1. 配置 GitHub MCP Server（`hermes mcp install github`）
2. 通过 MCP 让 Agent 读取指定 PR 的 diff
3. 在对话中直接要求 Agent：「review this PR #123」
4. Agent 分析 diff，输出 review comment 格式的文本
5. 手动将评论贴到 GitHub PR 上

### 6. 进阶版本
- 开发自定义 plugin，注册 `review_pr` tool，一键操作
- 让 Skill 自动将 review 结果 POST 回 GitHub PR（通过 GitHub API）
- 实现 Skill 自改进：当发现新的 bug 模式时，Skill 更新自身的检查规则
- 支持并发 review 多个文件（利用 Hermes 的 ThreadPoolExecutor）
- 使用 `pre_llm_call` hook 注入项目代码规范文件
- 集成静态分析工具（如 ruff、eslint）的输出作为 review 上下文

### 7. 具体步骤
1. `hermes mcp install github` 配置 GitHub MCP（需要 GitHub Token）
2. 测试 MCP 连通：在对话中让 Agent 读取一个公开 PR
3. 编写 review prompt，反复调优 review 质量
4. 创建 Skill 文档：在 `~/.hermes/skills/` 下创建 `code_review.md`，包含 review 准则
5. 让 Agent review 几次 PR，观察 Agent 是否自动改进 skill
6. （进阶）写一个 plugin：`~/.hermes/plugins/review_plugin.py`，实现 `review_pr` tool
7. plugin 中利用 `post_llm_call` hook 检查 review 质量，触发 skill 更新
8. 配置 `hermes tools` 确保 plugin tool 对 Agent 可见
9. 用 `hermes logs` 监控 review 执行过程和 skill 变更

### 8. 交付物
- 自定义 Plugin 代码（Python 文件）
- 自动演进的 Code Review Skill 文档
- PR review 示例（能展示 skill 自改进前后的差异）
- （进阶）Skill 版本管理记录（通过 curator）

### 9. 评价标准
- MCP 连接稳定，能正确读取 PR diff
- Review 覆盖：代码逻辑、安全性、性能、风格
- Skill 确实随着使用而自动更新规则（查看 skill 文件变更）
- Plugin 的 tool 注册正确，`hermes tools` 可看到新 tool
- 并发 review 多文件时不丢结果、不乱序
- 大 PR（500+ 行 diff）不触发 context 超限

### 10. 常见坑
- **MCP 权限不足**：GitHub Token 需要 `repo` 和 `pull_request` scope
- **Plugin 热加载**：修改 plugin 后需重启 Hermes 才能生效，`hermes --tui` 不支持动态重载 plugin
- **Skill 自改进过度**：Agent 可能频繁修改 skill，导致规则膨胀。需配合 curator 定期整理
- **Token 消耗大**：大 PR 的 diff 占用大量 context，注意 context compression 配置
- **并发竞态**：多个 tool 并发写同一个 skill 文件可能导致内容冲突
- **review 质量不稳定**：不同 model 的 review 深度差异大，需要根据 model 调 prompt

### 11. 如何变成作品集
- GitHub 仓库：Hermes Code Review Plugin，附 README 和 demo GIF
- 写深度技术博客：「如何让 AI Agent 学会自我改进——Hermes Skill 自改进机制拆解」
- 在 GitHub marketplace 或 agentskills.io 发布 skill
- 展示「skill 版本日志」——从 v1 到 v5 的规则进化史，是很好的内容素材
- 对比传统 CI review 工具（如 CodeRabbit）vs Hermes 自改进 Agent 的差异

---

## 项目三：全链路自动化运营 Agent

### 1. 项目名称
HermesOps — 全链路自动化运营平台

### 2. 项目目标
构建一个多平台、多 Agent 协同的自动化运营系统。Hermes Agent 担任总指挥官，通过飞书/Telegram 接收指令，派发子任务给子 Agent 并行执行（内容收集 → 处理 → 发布 → 复盘），利用 Honcho 用户建模持续优化运营策略。

### 3. 适合阶段
高级 — 涉及 Hermes 核心机制：子 Agent 委派、Honcho 建模、平台适配器、API Server、Trajectory 导出

### 4. 会用到的知识点
- 子 Agent 委派与并行执行
- Honcho 用户建模（跨 session 用户画像）
- 多平台适配器协同（Feishu + Telegram + Discord）
- API Server 模式（`hermes-api-server`）
- Trajectory 导出与 SFT 数据生成
- Profiles 多实例管理（`hermes profile`）
- Fallback Provider 链
- Credential Pools 多凭证轮换
- 自定义 Gateway Plugin 开发（可选）

### 5. MVP
1. 配置 Hermes Gateway 同时连接飞书和 Telegram
2. 定义一个运营 workflow：「每天早上汇总 HackerNews Top10 + GitHub Trending」
3. 用 cron job 定时执行，将结果推送到两个平台的指定频道
4. Agent 使用 Honcho 记录用户对内容的选择偏好

### 6. 进阶版本
- 拆分子 Agent 并行工作：Agent A 抓 HN，Agent B 抓 GitHub Trending，Agent C 整合
- 用 `hermes profile` 隔离「运营配置」和「个人使用」
- 用 API Server 对外暴露运营接口，供外部系统触发任务
- 用 Credential Pools 实现多个 API Key 自动轮换，避免限流
- 用 `hermes curator` 管理运营技能库
- 导出运行轨迹（trajectory），生成 SFT 数据用于微调专用运营模型
- 用 Plugin 的 `on_session_end` hook 自动生成运营日报
