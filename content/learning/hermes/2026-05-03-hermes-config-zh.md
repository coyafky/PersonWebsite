---
title: "HermesAgent Configuration 使用整理"
date: "2026-05-03"
summary: "HermesAgent Configuration 完整使用整理：架构与目录（hermes-agent 主目录 / config/ / profiles/ / logs/）、config.yaml 主配置（agent / providers / models / tools / memory / logging / security 等 9 大模块）、Profile 多环境隔离机制、CLI 与 env 覆盖优先级、热加载与运行时修改、3 个生产案例（蓝辉 GEO Agent / 飞书日报 / 个人 Coding 助手）。"
tags:
  - hermes
  - Configuration
  - 配置
  - Profile
  - 多环境
status: published
lang: zh
topic: hermes
englishSummary: "Complete HermesAgent Configuration guide: architecture & directory (hermes-agent main / config/ / profiles/ / logs/), config.yaml main config (9 modules: agent / providers / models / tools / memory / logging / security), Profile multi-environment isolation, CLI & env override priority, hot reload & runtime modification, and 3 production cases (蓝辉 GEO Agent / Feishu daily report / personal coding assistant)."
---

# HermesAgent Configuration 使用整理

> 基于 HermesAgent 项目的 Configuration 完整使用说明整理。

---

## 一、架构概览

HermesAgent 的配置体系围绕「主配置 + Profile 隔离 + 运行时覆盖」三层：

```text
hermes-agent/
├── hermes.yaml              # 全局默认配置（可省略）
├── config/
│   ├── config.yaml          # 主配置
│   ├── profiles/            # 多 Profile 隔离
│   │   ├── default.yaml
│   │   ├── work.yaml
│   │   └── personal.yaml
│   ├── tools/               # 工具专属配置
│   └── logging.yaml         # 日志配置
├── .env                     # 环境变量（密钥）
└── logs/
    └── hermes.log
```

## 二、config.yaml 详解

```yaml
# ============================================
# HermesAgent 主配置文件
# ============================================

agent:
  name: hermes-agent
  version: "1.0.0"
  description: Personal AI Agent for content engineering & GEO
  default_profile: default
  max_concurrent_tasks: 3
  task_timeout: 300

# Provider 配置
providers:
  openai:
    type: openai
    api_key: ${OPENAI_API_KEY}
    base_url: https://api.openai.com/v1
    default_model: gpt-5-mini

  anthropic:
    type: anthropic
    api_key: ${ANTHROPIC_API_KEY}
    default_model: claude-sonnet-4.6

  ollama:
    type: ollama
    base_url: http://localhost:11434
    default_model: qwen2.5:7b

# 模型路由
models:
  routing:
    strategy: task_based     # task_based / cost_first / speed_first / manual
    fallback:
      - openai:gpt-5-mini
      - anthropic:claude-sonnet-4.6
      - ollama:qwen2.5:7b

  task_routing:
    coding: openai:gpt-5-mini
    writing: anthropic:claude-sonnet-4.6
    analysis: ollama:qwen2.5:7b
    quick_qa: ollama:qwen2.5:7b

# 工具配置
tools:
  terminal:
    enabled: true
    allowed_commands:
      - ls
      - cat
      - grep
      - git
      - npm
      - python
    forbidden_commands:
      - rm -rf
      - sudo
      - chmod 777
    working_dir: ${PROJECT_ROOT}

  web_search:
    enabled: true
    provider: tavily
    api_key: ${TAVILY_API_KEY}
    max_results: 5

  file_ops:
    enabled: true
    allowed_paths:
      - ${PROJECT_ROOT}
      - ~/.hermes/workspace
    forbidden_paths:
      - /etc
      - /usr
      - ~/.ssh

  browser:
    enabled: false
    headless: true

# 记忆配置
memory:
  enabled: true
  backend: sqlite
  path: ~/.hermes/memory/hermes.db
  vector_store:
    enabled: true
    provider: chromadb
    embedding_model: text-embedding-3-small
    chunk_size: 500
    chunk_overlap: 50
  retention:
    session_ttl_days: 30
    long_term_ttl_days: 365

# 日志配置
logging:
  level: INFO
  format: json
  output:
    - console
    - file
  file:
    path: logs/hermes.log
    max_size_mb: 10
    backup_count: 5

# 安全配置
security:
  sandbox: true
  approval_required_for:
    - file_write
    - network_request
    - shell_command
  forbidden_patterns:
    - "rm -rf"
    - "DROP TABLE"
    - "DELETE FROM .* WHERE"
    - "curl .* | bash"

# 性能调优
performance:
  cache:
    enabled: true
    ttl_seconds: 300
    max_size_mb: 100
  rate_limit:
    requests_per_minute: 60
    tokens_per_minute: 100000
```

## 三、Profile 多环境隔离

HermesAgent 通过 Profile 实现多环境隔离，避免配置冲突：

### 3.1 默认 Profile（~/.hermes/config/profiles/default.yaml）

```yaml
agent:
  name: personal-assistant
  description: 通用个人助理

providers:
  default: ollama:qwen2.5:7b

tools:
  terminal:
    enabled: true
  web_search:
    enabled: true

memory:
  path: ~/.hermes/memory/personal.db
```

### 3.2 工作 Profile（work.yaml）

```yaml
agent:
  name: work-assistant
  description: 蓝辉轻改 GEO 工作助理

providers:
  default: openai:gpt-5-mini

tools:
  terminal:
    enabled: true
    allowed_commands:
      - git
      - npm
      - python
      - pytest

memory:
  path: ~/.hermes/memory/work.db

# 项目上下文
context:
  project_root: ~/code/lanhui-geo
  brand_info: ./brand-context.yaml
```

### 3.3 个人 Coding Profile（personal-coding.yaml）

```yaml
agent:
  name: coding-helper
  description: 个人编程助手

providers:
  default: anthropic:claude-sonnet-4.6

tools:
  terminal:
    enabled: true
    allowed_commands:
      - git
      - npm
      - node
      - python
      - pip

  file_ops:
    allowed_paths:
      - ~/code/personal
      - ~/Documents/notes
```

### 3.4 切换 Profile

```bash
# 命令行切换
hermes --profile work
hermes --profile personal-coding

# 一次性任务
hermes chat --profile work -q "分析这个 GEO 内容..."

# 通过环境变量
HERMES_PROFILE=work hermes
```

## 四、配置优先级

HermesAgent 的配置按以下优先级合并：

1. **CLI 参数**（最高）
   ```bash
   hermes chat --model claude-sonnet-4.6 --no-web
   ```

2. **环境变量**
   ```bash
   HERMES_MODEL=claude-sonnet-4.6 hermes chat
   ```

3. **Profile 配置**
   ```yaml
   providers:
     default: openai:gpt-5-mini
   ```

4. **主 config.yaml**
   ```yaml
   providers:
     openai:
       default_model: gpt-5-mini
   ```

5. **内置默认值**（最低）

## 五、热加载与运行时修改

### 5.1 修改配置后无需重启

```bash
# 修改 config.yaml 后
hermes reload-config

# 或通过 API
POST /api/config/reload
```

支持热加载的字段：

- 模型路由规则
- 工具开关
- 记忆后端
- 日志级别

需要重启的字段：

- Provider 凭据（API Key 变更）
- 数据库路径
- 安全策略

### 5.2 运行时查看生效配置

```bash
hermes config show
```

输出：

```yaml
agent:
  name: work-assistant        # source: profile(work.yaml:3)
providers:
  default: openai:gpt-5-mini  # source: profile(work.yaml:9)
tools:
  terminal:
    enabled: true             # source: main(config.yaml:62)
    shell: bash               # source: main(config.yaml:63)
memory:
  backend: sqlite             # source: main(config.yaml:102)
  path: ~/.hermes/memory/work.db  # source: profile(work.yaml:18)
```

这个 `source` 字段非常重要——告诉你每个配置从哪里来。

## 六、典型使用场景

### 场景 1：蓝辉 GEO Agent

```yaml
# profiles/lanhui-geo.yaml
agent:
  name: lanhui-geo-agent
  description: 蓝辉轻改 GEO 内容生成 Agent

providers:
  default: ollama:qwen2.5:7b

tools:
  web_search:
    enabled: true
    region: cn

context:
  brand:
    name: 蓝辉轻改
    services: [车膜, 车衣, 改色膜, 电动踏板, 轮毂]
    target: 中国大陆本地生活搜索
    tone: 专业可信

output:
  style: 结构化
  language: zh-CN
  chunk_friendly: true
  citations_required: true
```

### 场景 2：飞书日报助手

```yaml
# profiles/feishu-daily.yaml
agent:
  name: feishu-daily-bot

providers:
  default: anthropic:claude-sonnet-4.6

tools:
  web_search:
    enabled: true
    schedule: "0 9 * * *"

  messaging:
    feishu:
      enabled: true
      webhook: ${FEISHU_WEBHOOK}

cron:
  jobs:
    - name: daily-summary
      schedule: "0 9 * * *"
      prompt: "汇总昨天团队工作进展，生成飞书日报"
```

### 场景 3：个人 Coding 助手

```yaml
# profiles/coding.yaml
agent:
  name: coding-assistant

providers:
  default: openai:gpt-5-mini

tools:
  terminal:
    enabled: true
    allowed_commands: [git, npm, python, pytest]

  file_ops:
    allowed_paths:
      - ~/code/personal
      - ~/Documents/notes

memory:
  vector_store:
    enabled: true
    embedding_model: text-embedding-3-small
```

## 七、最佳实践

### 7.1 永远不要把密钥写进 config.yaml

```yaml
# 错误 ❌
providers:
  openai:
    api_key: sk-xxxxxxxxxxxxx

# 正确 ✅
providers:
  openai:
    api_key: ${OPENAI_API_KEY}
```

`.env` 加入 `.gitignore`：

```gitignore
.env
.env.local
.env.production
```

### 7.2 用 Profile 隔离不同工作场景

```yaml
profiles/
├── default.yaml       # 通用默认
├── work.yaml          # 工作项目
├── personal.yaml      # 个人使用
├── coding.yaml        # 编程助手
└── writing.yaml       # 写作辅助
```

### 7.3 工具白名单优于黑名单

```yaml
# 黑名单容易遗漏
tools:
  terminal:
    forbidden_commands: [rm, sudo, chmod]  # 容易被绕过

# 白名单更安全
tools:
  terminal:
    allowed_commands: [ls, cat, grep, git]  # 明确范围
```

### 7.4 关键配置加注释

```yaml
providers:
  # 主力模型：高 reasoning 任务
  openai:
    default_model: gpt-5-mini

  # 备用模型：限流时切换
  anthropic:
    default_model: claude-sonnet-4.6

  # 本地模型：敏感数据 / 离线任务
  ollama:
    base_url: http://localhost:11434
```

### 7.5 定期备份配置

```bash
cp -r ~/.hermes/config ~/.hermes/config.backup-$(date +%Y%m%d)
```

## 八、常见错误

### 8.1 路径错误

```yaml
# 错误 ❌（macOS 路径在 Linux 上无效）
memory:
  path: /Users/coya/hermes/memory.db

# 正确 ✅（使用 ~ 或环境变量）
memory:
  path: ~/.hermes/memory/hermes.db
```

### 8.2 模型名称拼错

```yaml
# 错误 ❌
providers:
  openai:
    default_model: gpt5

# 正确 ✅（注意版本号格式）
providers:
  openai:
    default_model: gpt-5-mini
```

### 8.3 Provider 未启用

```yaml
# 错误 ❌（引用了 anthropic 但未配置）
models:
  routing:
    fallback:
      - anthropic:claude-sonnet-4.6

providers:
  # anthropic 配置缺失

# 正确 ✅（fallback 必须先在 providers 中定义）
providers:
  anthropic:
    api_key: ${ANTHROPIC_API_KEY}
    default_model: claude-sonnet-4.6
```

## 九、配置验证

启动前可以用 `hermes config validate` 检查配置：

```bash
$ hermes config validate

✓ config.yaml syntax OK
✓ All referenced env vars are set
✓ All providers have valid API keys
✓ Profile inheritance is valid
✓ No circular references

Warnings:
- `tools.browser.enabled: false` — disabled, browser automation unavailable
- `memory.vector_store.embedding_model` not in any provider — using fallback
```

## 十、调试技巧

### 10.1 启用 Debug 日志

```yaml
logging:
  level: DEBUG
  output:
    - console
```

### 10.2 查看真实生效的配置

```bash
hermes config show --effective
```

### 10.3 追踪配置加载过程

```bash
hermes --trace-config
```

## 十一、总结

HermesAgent 的配置体系核心理念：

- **配置分层**：CLI > env > Profile > main > default
- **Profile 隔离**：避免不同工作场景冲突
- **环境变量优先**：密钥不进 git
- **白名单安全**：工具 / 路径都白名单
- **运行时可改**：常用配置热加载

掌握这套配置系统后，可以灵活应对不同场景需求，又不会因为配置混乱导致 Agent 行为难以预测。
