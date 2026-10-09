---
title: "P23 23_能力篇_上下文文件的工作目录"
date: "2026-09-24"
summary: >-
  P23 · 23_能力篇_上下文文件的工作目录（10:17）
status: published
tags:
  - "Hermes"
lang: zh
chapter: "P23"
series: "shangguigu-hermes"
seriesOrder: 23
---

## 课时概要

能力篇 · 上下文文件的工作目录。官方文档条目：**Context files** / **Context references** —— Hermes 会读取哪些上下文文件（SOUL、工作目录相关文件等）。

> 本分P 没有逐P 的官方简介（视频简介只有资源链接）。以下「本节要点 / 关键概念 / 代码实操」均改写自 **Hermes 官方文档（Use SOUL with Hermes / Personality / Context files 三页）与官方仓库原文**并标注来源；「我的收获」里标 **本机实测** 的是在本机实跑得到的真实状态。

**视频**：[23_能力篇_上下文文件的工作目录](https://www.bilibili.com/video/BV1c5TL6eEkC/?p=23) ｜ 时长 10:17 ｜ P23

## 本节要点

- **官方支持的上下文文件清单**（含各自的发现方式）：`.hermes.md` / `HERMES.md`（项目指令，**最高优先级**，会走到 git root）｜`AGENTS.override.md`（**个人、按目录**覆盖 AGENTS.md，通常 gitignore）｜`AGENTS.md`（项目指令/约定/架构）｜`CLAUDE.md`（Claude Code 的上下文文件，同样会被识别）｜`SOUL.md`（**只从 HERMES_HOME**，全局人格）｜`.cursorrules`（Cursor IDE 约定，**仅当前目录**）｜`.cursor/rules/*.mdc`（Cursor 规则模块，仅当前目录）。
- **优先级（每个会话只加载一种项目上下文类型，first match wins）**：`.hermes.md` → `AGENTS.override.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules`。**SOUL.md 永远独立加载**（占 slot #1），不参与这个竞争。
- **`AGENTS.override.md` 的用途**：当你想要的指令与仓库里签入的 `AGENTS.md` 不同时，在旁边放一份**个人版（通常 gitignore）** —— override 会被加载而非签入版，**因此不必去改被跟踪的文件**。
- **目录链（git root → 工作目录）**：当工作目录位于 git 仓库内时，会话启动会加载一条**合并链** —— 先是 git 根的 `AGENTS.md`，再逐级到工作目录的每一层 `AGENTS.md`。**越深的文件在 prompt 里出现越晚 → 更具体的指导优先**；每个文件带自己的 provenance header（如 `## ../../AGENTS.md`），链上完全相同的副本会去重。
- ⚠️ **不在 git 仓库里时，只检查工作目录本身，绝不查父目录** —— 所以放在 `/tmp` 或 `$HOME` 的 `AGENTS.md` **不会泄漏进无关会话**。
- **渐进式子目录发现（Progressive Subdirectory Discovery）**：启动时把工作目录的 `AGENTS.md` 放进 system prompt；会话中当 agent 浏览到子目录时（通过 `read_file` / `terminal` / `search_files` 等），**在那个目录变得相关的当下**才发现并注入它的上下文文件。官方给的两点好处：**不撑爆 system prompt**（子目录提示只在需要时出现）+ **保住 prompt cache**（system prompt 跨轮保持稳定）。每个子目录每会话最多检查一次；发现时会向上走父目录（读 `backend/src/main.py` 会发现 `backend/AGENTS.md`，即使 `backend/src/` 自己没有）。
- **启动时的加载流程**（官方点名的实现：`agent/prompt_builder.py` 的 `build_context_files_prompt()`）：**扫描工作目录**（`.hermes.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules`，first match wins）→ **按 UTF-8 读取** → **安全扫描**（查 prompt injection）→ **截断**（超出字符上限时按 **70% 头 + 20% 尾**、中间留 marker）→ **组装**到 `# Project Context` 标题下 → **注入 system prompt**。
- **会话内发现走 `SubdirectoryHintTracker`**（`agent/subdirectory_hints.py`）：每次工具调用后从参数里抽文件路径（`path`、`workdir`、shell 命令）→ 检查该目录及**最多 5 层父目录**（遇到已访问过的目录就停）→ 命中 `AGENTS.md` / `CLAUDE.md` / `.cursorrules` 就加载（每目录 first match）→ **同样过注入扫描** → 截断上限 **32,000 字符（固定值，不随模型上下文窗口变化）** → **追加到工具结果里**，让模型在上下文里自然看到。
- **安全：注入防护**（所有上下文文件在进入前都被扫描）。检查的模式包括：**指令覆盖**（"ignore previous instructions"、"disregard your rules"）｜**欺骗**（"do not tell the user"）｜**system prompt 覆盖**（"system prompt override"）｜**隐藏 HTML 注释**（`<!-- ignore instructions -->`）｜**隐藏 div**（`<div style="display:none">`）｜**凭证外泄**（`curl ... $API_KEY`）｜**密钥文件访问**（`cat .env`）｜**不可见字符**（零宽空格、双向覆盖、word joiner）。项目上下文文件命中即**阻断**，prompt 里会写：`[BLOCKED: AGENTS.md contained potential prompt injection (prompt_injection). Content not loaded.]`。
- **大小与超时限制**：每文件上限 = 配置的 `context_file_max_chars`，否则**动态**（随模型上下文窗口伸缩：**地板 20,000、天花板 500,000** 字符）｜**每文件读取超时 `context_file_read_timeout` 默认 5 秒** —— 读得比这慢的文件（官方点名 iCloud Drive / OneDrive / NFS）会被跳过并告警 ｜ 截断比例头 70% / 尾 20% / marker 10%。
- 截断时 prompt 里的原话长这样：`[...truncated AGENTS.md: kept 14000+4000 of 25000 chars. Use file tools to read the full file.]`。
- **官方给的 AGENTS.md 写作纪律**：保持简洁（**每一轮都会被读到**）｜用 `##` 分节（架构 / 约定 / 重要事项）｜给具体例子（偏好的代码形态、API 形状、命名约定）｜**写明「不要做什么」**（如「绝不直接改迁移文件」）｜列出关键路径与端口（agent 会用来跑命令）｜**随项目演进更新** —— 官方原话：**过时的上下文比没有上下文更糟**。
- **单体仓库用法**：把子目录专属指令放进嵌套的 `AGENTS.md`（例：`frontend/AGENTS.md` 写「用 pnpm 不用 npm、组件在 src/components/」；`backend/AGENTS.md` 写「用 poetry、dev server 跑 uvicorn、端点要有 OpenAPI docstring」）—— 由上面的渐进发现机制按需注入。

## 关键概念

- **上下文文件（context files）**：Hermes 在启动与浏览过程中自动发现并注入的项目/人格说明文件。
- **优先级链**：`.hermes.md` → `AGENTS.override.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules`，first match wins（SOUL.md 不参与）。
- **目录链**：git 根 → 工作目录的合并链，越深越具体、越晚出现、优先级越高。
- **渐进式发现**：子目录上下文在「第一次访问到它」时才注入，而不是启动时全量加载。
- **`SubdirectoryHintTracker`**：会话内负责这项工作的组件，从工具调用参数里推路径（向上最多 5 层）。
- **注入扫描 / `[BLOCKED: …]`**：安全闸门；项目上下文文件命中即拒载（SOUL.md 是例外，见 P22）。
- **`context_file_max_chars` / `context_file_read_timeout`**：字符上限（未设则 2 万–50 万动态）与每文件读取超时（默认 5 秒）。

## 代码 / 实操

```markdown
# 官方示例 AGENTS.md（节选）
# Project Context
This is a Next.js 14 web application with a Python FastAPI backend.

## Architecture
- Frontend: Next.js 14 with App Router in `/frontend`
- Backend: FastAPI in `/backend`, uses SQLAlchemy ORM

## Conventions
- Use TypeScript strict mode for all frontend code
- All API endpoints return JSON with `{data, error, meta}` shape

## Important Notes
- Never modify migration files directly — use Alembic commands
- The `.env.local` file has real API keys, don't commit it
- Frontend port is 3000, backend is 8000, DB is 5432
```

**本机实测**（2026-09-25，全部逐项核实）：

| 位置 | 文件 | 体积 | 结论 |
| --- | --- | --- | --- |
| PersonalWebsite（**git 根 = 工作目录**） | `AGENTS.md` | **1281 B** | ⚠️ 内容还是** TODO 骨架**（"TODO: Describe what this project does…"）|
| 同上 | `CLAUDE.md` | 9795 B | 有实内容，但**被上面的 AGENTS.md 遮蔽** |
| 同上 | `AGENT.md`（单数） | 11040 B | **不在官方支持清单里 → 不会自动加载** |
| CoyaPersonal | `AGENTS.md` | 26162 B | 会被加载 |
| CoyaPersonal | `AGENT.md`（单数） | 3637 B | 不在清单里 |
| CoyaPersonal | `ME.md` | 符号链接 → `15-个人档案/身份与能力/ME.md`（4189 B） | ✅ 目标存在 |

## 我的收获

**用户此前已学过本模块**；以下是本机实测状态（2026-09-25）：

- 🔴 **本仓库实测到一个真实的遮蔽问题**：`AGENTS.md`（**1281 B，内容还是 TODO 占位**）、`CLAUDE.md`（9795 B）、`AGENT.md`（11040 B）三个文件同时存在，而按优先级链 **`AGENTS.md` 胜出** → 那个 1.2 KB 的占位骨架会**盖住**近 15 KB 的真实上下文。两种修法：① 把内容并进 `AGENTS.md` ② 删掉占位让链路回落到 `CLAUDE.md`。
- ⚠️ **`AGENT.md`（单数）不在官方支持清单里** —— 而本仓库与 CoyaPersonal **都有**这个文件（分别 11040 B / 3637 B）。它们**不会被自动加载**；CoyaPersonal 那份之所以能生效，是靠 `prefill` 机制在对话里**显式点名**。
- ⚠️ **`prefill_personal_api.json` 里有一条死路径**：它每次对话注入一条 user 消息，要求读 `ME.md` / `AGENT.md` / **`06-Session-Logs/now.md`** —— 而 `06-Session-Logs` 在 09-23 的库重构中已并入 `10-工作日志`，`now.md` 现在只剩 `99-归档/MySecondBrain-遗留-20260924/Session-Logs/now.md` 与一份 alma 快照里 → **第三个文件取不到了**（前两个：`ME.md` 是符号链接、目标存在 ✅；`AGENT.md` 存在 ✅）。
- 本仓库是 git 仓库且 `git rev-parse --show-toplevel` = 仓根 → 正好是官方说的**「目录链」场景**；官方那条「不在 git 仓库里就只查工作目录、不查父目录」也解释了为什么 `$HOME` 下放的 AGENTS.md 不会污染别的会话。
- `AGENTS.override.md` 这个键位对我很有用：以后想在某个项目里用与签入版不同的规则（例如只在本机生效的口味偏好），放一份 override + gitignore 即可，**不用动被跟踪的 `AGENTS.md`**。

*（个人感想部分待补写。）*

## 待深入

*（待填：没听懂、想回头查的。）*
