---
title: "Hermes 的 config.yaml 详解"
date: "2026-06-05"
summary: "Hermes Agent config.yaml（或 provider_config.toml）完整字段解析：provider 模型配置 / runtime 运行参数 / agent 行为规则 / tools 工具调用 / logging 日志 / advanced 高级选项（RAG / 跨会话学习 / 向量检索 / 安全检查）。每个字段都给出中文解释、典型值和工程实践。"
tags:
  - hermes
  - config.yaml
  - 配置
  - 字段
  - Provider
status: draft
lang: zh
topic: hermes
englishSummary: "Complete Hermes Agent config.yaml (or provider_config.toml) field reference: provider model config / runtime parameters / agent behavior rules / tools / logging / advanced options (RAG / cross-session learning / vector search / safety checks). Every field has Chinese explanation, typical values, and engineering practice."
---

# Hermes `config.yaml` 典型结构与详解

```yaml
# ===============================================
# Hermes Agent 配置文件（YAML 格式示例）
# ===============================================

# 1. 模型与 Provider 配置
provider:
  name: openai              # 使用的模型提供者
  model: gpt-5-mini          # 模型名称
  temperature: 0.7           # 模型生成文本的随机性
  max_tokens: 2000           # 最大输出 token 数
  api_key: ${OPENAI_API_KEY} # 从环境变量读取 API Key
  base_url: ""               # 可选，自定义 API 访问地址

# 2. 运行参数
runtime:
  mode: cli                 # 启动模式: cli / api / batch
  log_level: INFO           # 日志级别: DEBUG / INFO / WARN / ERROR
  session_dir: ./Memory     # 会话存储目录
  memory_persistence: true  # 是否将记忆写入硬盘
  cache_dir: ./Cache        # 临时缓存目录
  max_concurrent_agents: 3  # 最大并发 Agent 数量

# 3. Agent 行为规则
agent:
  default_profile: default_agent.md # 默认 Agent Profile
  soul_file: SOUL.md                # Soul 文件路径
  user_memory_file: USER.md         # 长期记忆文件
  skills_dir: ./Skills              # Skills 存放目录
  tools_dir: ./Tools                # Tools 存放目录
  forbidden_actions:                # Agent 禁止的行为
    - delete_files
    - override_logs
    - access_sensitive_data

# 4. 工具调用配置
tools:
  terminal_tool:
    enabled: true
    shell: bash
  web_tool:
    enabled: true
    timeout: 15
  image_gen_tool:
    enabled: true
    max_resolution: "1024x1024"
  file_tool:
    enabled: true
    allowed_extensions: [".txt", ".md", ".json"]

# 5. 日志与监控
logging:
  file: ./Logs/hermes.log
  rotate: daily
  max_size: 10MB

# 6. 高级选项（可选）
advanced:
  rAG_enabled: true               # 是否启用 Retrieval-Augmented Generation
  cross_session_learning: true    # 跨会话学习开关
  memory_vector_store: faiss      # 向量检索引擎类型
  search_top_k: 10                # 召回 top-k 相关历史会话
  safety_checks: true             # 是否启用安全规则检测
```

---

## 字段解析

### 1️⃣ provider

- **name**：模型提供者，例如 `openai`、`anthropic`
- **model**：使用的具体模型
- **temperature**：控制生成文本的随机性
- **max_tokens**：单次生成最大 token
- **api_key**：读取 API Key，可从环境变量引用
- **base_url**：自定义 API 地址（企业私有部署可用）

---

### 2️⃣ runtime

- **mode**：启动方式，CLI 本地交互 / API / 批量任务
- **log_level**：日志输出等级
- **session_dir**：当前会话缓存目录
- **memory_persistence**：是否写入长期记忆
- **cache_dir**：临时缓存目录
- **max_concurrent_agents**：多 Agent 并行执行数

---

### 3️⃣ agent

- **default_profile**：默认 Agent Profile
- **soul_file**：Agent 的行为价值观定义
- **user_memory_file**：用户或项目长期记忆
- **skills_dir / tools_dir**：Agent 技能和工具路径
- **forbidden_actions**：禁止操作列表，保障安全

---

### 4️⃣ tools

- **enabled**：是否启用该工具
- **配置参数**：
    - 终端工具：`shell`
    - Web 工具：`timeout` 秒
    - 图像生成：最大分辨率
    - 文件工具：允许文件类型

---

### 5️⃣ logging

- **file**：日志输出路径
- **rotate**：日志切割周期
- **max_size**：单日志文件最大大小

---

### 6️⃣ advanced

- **rAG_enabled**：是否启用检索增强生成（RAG）
- **cross_session_learning**：跨会话学习开关
- **memory_vector_store**：向量存储类型（FAISS / Pinecone / Milvus）
- **search_top_k**：检索历史记忆时返回的 top k
- **safety_checks**：是否启用安全策略检测

---

## 一句话总结

`config.yaml` 的核心作用是：

1. **定义 Agent 能调用的模型与接口**（provider）
2. **设置 Agent 的运行方式与并发能力**（runtime）
3. **加载 Agent 的身份、价值观、技能和工具路径**（agent + skills/tools）
4. **管理跨会话记忆和安全规则**（memory + forbidden_actions）
5. **日志与监控**（logging）
6. **高级特性**（RAG / 跨会话学习 / 向量检索）
