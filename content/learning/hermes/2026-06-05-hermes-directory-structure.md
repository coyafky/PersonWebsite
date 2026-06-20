---
title: "Hermes Agent 的典型目录结构"
date: "2026-06-05"
summary: "Hermes Agent 项目的标准目录结构与各文件作用：main.py / provider_config.toml / .env / README.md / SOUL.md / USER.md / Profile/ / Skills/ / Tools/ / Memory/ / Logs/ / Docs/ / scripts/ / tests/。每个模块的职责清晰划分——入口、Provider、行为价值观、用户档案、Agent Profile、可执行技能、外部工具接口、跨会话记忆、日志、脚本、测试。"
tags:
  - hermes
  - 目录结构
  - 项目组织
  - 配置
status: draft
lang: zh
topic: hermes
englishSummary: "Standard Hermes Agent project directory structure with every file's role: main.py / provider_config.toml / .env / README.md / SOUL.md / USER.md / Profile/ / Skills/ / Tools/ / Memory/ / Logs/ / Docs/ / scripts/ / tests/. Each module's responsibility is clearly divided — entry point, provider, behavioral values, user profile, agent profiles, executable skills, external tool interfaces, cross-session memory, logs, scripts, tests."
---

# Hermes 项目典型目录结构

```
hermes-agent/
├─ main.py
├─ provider_config.toml
├─ .env
├─ README.md
├─ SOUL.md
├─ USER.md
├─ Profile/
│   ├─ FrontendAgent.md
│   ├─ GEOAgent.md
│   └─ SalesAgent.md
├─ Skills/
│   ├─ GEOContentSkill.py
│   ├─ WebDevSkill.py
│   └─ MemorySkill.py
├─ Tools/
│   ├─ terminal_tool.py
│   ├─ web_tool.py
│   ├─ image_gen_tool.py
│   └─ file_tool.py
├─ Memory/
│   ├─ curated_memory.json
│   └─ session_db.sqlite
├─ Logs/
│   └─ hermes.log
├─ Docs/
│   └─ HermesArchitecture.pdf
├─ scripts/
│   └─ setup_mac.sh
└─ tests/
    └─ test_agents.py
```

---

## 各文件/文件夹的含义与作用

### 1. `main.py`

- **含义**：Hermes Agent 的入口程序
- **作用**：
    - 启动 Agent 的 CLI、API Server 或 Batch Runner
    - 加载 Profile、Soul、Skills、Tools
    - 管理当前会话 Context 与 Memory
    - 调度各个 Agent 执行任务

---

### 2. `provider_config.toml`

- **含义**：外部 Provider 配置
- **作用**：
    - 配置 OpenAI 或其他 LLM 提供者
    - 包括 `wire_api = "responses"`、API Key、模型参数
    - Hermes 通过这个配置调用模型执行推理

---

### 3. `.env`

- **含义**：环境变量文件
- **作用**：
    - 保存敏感信息，例如 API Key、数据库 URL、第三方服务密钥
    - 在启动时被 main.py 读取

---

### 4. `README.md`

- **含义**：项目说明文档
- **作用**：
    - 简要说明 Hermes 项目用途、运行方法、依赖
    - 方便新成员快速理解目录和启动流程

---

### 5. `SOUL.md`

- **含义**：Agent 的行为理念和决策价值观
- **作用**：
    - 定义 Hermes 的长期判断标准
    - 指导 Agent 在执行任务时保持一致性
    - 示例：GEO Agent 的 Soul 可能是"内容必须可被 AI 检索和引用，并体现品牌实体性"

---

### 6. `USER.md`

- **含义**：用户项目信息与长期记忆
- **作用**：
    - 保存品牌信息、业务范围、用户偏好
    - Hermes 在跨会话学习中会读取此文件作为长期记忆参考

---

### 7. `Profile/`

- **含义**：Agent 岗位描述与角色设定
- **作用**：
    - 每个 Markdown 文件对应一个 Agent 的 Profile
    - 说明该 Agent 的职责、能力范围、禁止行为、交付物
    - 例如：
        - `FrontendAgent.md` → 前端开发 Agent
        - `GEOAgent.md` → GEO 内容生成与分析 Agent
        - `SalesAgent.md` → 销售话术与量化分析 Agent

---

### 8. `Skills/`

- **含义**：Agent 可执行技能模块
- **作用**：
    - 每个 Skill 是一套可复用操作/流程
    - 例如：
        - `GEOContentSkill.py` → 生成 GEO-friendly 内容
        - `WebDevSkill.py` → 构建网页和组件
        - `MemorySkill.py` → 管理 session 和长期记忆

---

### 9. `Tools/`

- **含义**：Agent 可调用的外部工具接口
- **作用**：
    - 封装可被 Agent 使用的功能
    - 例如：
        - `terminal_tool.py` → 执行 shell 命令
        - `web_tool.py` → 调用 Web 搜索或抓取数据
        - `image_gen_tool.py` → 生成或修改图像
        - `file_tool.py` → 文件读写、解析

---

### 10. `Memory/`

- **含义**：Hermes 的跨会话记忆存储
- **作用**：
    - `curated_memory.json` → 提炼后的长期记忆事实
    - `session_db.sqlite` → 会话记录与检索（支持 FTS5 向量搜索）

---

### 11. `Logs/`

- **含义**：运行时日志目录
- **作用**：
    - 记录 Agent 运行过程、工具调用、错误信息
    - 方便调试与生产监控

---

### 12. `Docs/`

- **含义**：项目文档与设计资料
- **作用**：
    - 存放架构图、设计文档、API 手册
    - 团队协作时方便查阅

---

### 13. `scripts/`

- **含义**：辅助脚本目录
- **作用**：
    - 存放环境配置、安装、初始化脚本
    - 例如 `setup_mac.sh` 自动安装 Python 依赖、初始化目录

---

### 14. `tests/`

- **含义**：Agent 与 Skill 的测试用例
- **作用**：
    - 验证 Agent 行为是否符合预期
    - 防止重构时破坏核心功能
