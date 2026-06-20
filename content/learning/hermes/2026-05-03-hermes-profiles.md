---
title: "HermesAgent Profiles 使用整理"
date: "2026-05-03"
summary: "HermesAgent Profiles 多环境隔离完整使用整理：4 类内置 Profile（default / work / personal / coding）、3 大核心特性（隔离 / 切换 / 继承）、完整 YAML 配置（覆盖 Provider/Tools/Memory/Plugins/Personality/Context/Cron 等）、CLI 与运行时切换、3 个实战场景（蓝辉 GEO / 个人 Coding / 飞书日报）、环境变量注入与多 Profile 组合、与 Skills/Memory 协同、5 步配置流程、最佳实践与常见错误。"
tags:
  - hermes
  - Profiles
  - 多环境
  - 隔离
  - 切换
status: published
lang: zh
topic: hermes
englishSummary: "Complete HermesAgent Profiles multi-environment isolation guide: 4 built-in Profiles (default / work / personal / coding), 3 core features (isolation / switching / inheritance), complete YAML config (Provider/Tools/Memory/Plugins/Personality/Context/Cron override), CLI and runtime switching, 3 practical scenarios (蓝辉 GEO / personal coding / Feishu daily), env var injection & multi-profile composition, coordination with Skills/Memory, 5-step configuration workflow, best practices and common pitfalls."
---

# HermesAgent Profiles 使用整理

> 基于 HermesAgent 项目的 Profiles（多环境配置）完整使用说明整理。

---

## 一、为什么需要 Profile

单一套配置无法满足所有场景：

- **工作 vs 个人**：工作用 GPT-5-mini，个人用本地 Ollama
- **不同项目**：蓝辉 GEO 用中文模型，Coding 项目用 Claude
- **不同角色**：工程师需要 terminal 工具，PM 需要日历工具
- **不同环境**：本地开发 vs 腾讯云生产

Profile 让 HermesAgent 可以"一人多面"——同一份代码、不同配置、不同人格。

## 二、Profile 的核心特性

### 2.1 隔离

不同 Profile 完全独立：

```text
~/.hermes/profiles/
├── default/         # 默认配置
│   ├── config.yaml
│   ├── memory/
│   │   └── memory.db
│   └── logs/
├── work/            # 工作项目
│   ├── config.yaml
│   ├── memory/
│   │   └── work.db
│   └── logs/
└── personal/        # 个人使用
    ├── config.yaml
    ├── memory/
    │   └── personal.db
    └── logs/
```

每个 Profile 独立：

- 配置文件
- 记忆数据库
- 日志
- 缓存
- Skill 工作区

### 2.2 切换

一行命令切换：

```bash
hermes --profile work
hermes --profile personal
hermes --profile coding
```

### 2.3 继承

Profile 可以继承其他 Profile：

```yaml
# profiles/work.yaml
extends: default

overrides:
  providers:
    default: openai:gpt-5-mini
  memory:
    path: ~/.hermes/profiles/work/memory.db
```

只写差异部分，公共配置从父 Profile 继承。

## 三、目录结构

```text
~/.hermes/
├── config/
│   └── config.yaml              # 全局默认配置
├── profiles/
│   ├── default/
│   │   ├── profile.yaml         # Profile 配置
│   │   ├── memory/              # 记忆数据库
│   │   ├── logs/                # 日志
│   │   ├── workspace/           # 工作区
│   │   └── skills/              # 私有 Skill
│   ├── work/
│   │   ├── profile.yaml
│   │   ├── memory/
│   │   ├── logs/
│   │   ├── workspace/
│   │   └── skills/
│   └── personal/
│       └── ...
└── hermes.yaml                   # 全局配置（可选）
```

## 四、Profile 配置详解

### 4.1 完整示例

```yaml
# profiles/work/profile.yaml

# 继承关系
extends: default

# Profile 元信息
name: work
description: 蓝辉轻改 GEO 项目工作配置
tags: [work, geo, automotive]
author: 冯科雅

# Agent 配置
agent:
  name: work-assistant
  personality: ./personalities/engineer.yaml

# Provider 配置（覆盖默认）
providers:
  default: openai:gpt-5-mini
  openai:
    type: openai
    api_key: ${OPENAI_API_KEY}
    default_model: gpt-5-mini
  ollama:
    type: ollama
    base_url: http://localhost:11434
    default_model: qwen2.5:7b

# 模型路由
models:
  routing:
    strategy: task_based
    fallback:
      - openai:gpt-5-mini
      - ollama:qwen2.5:7b
  task_routing:
    coding: openai:gpt-5-mini
    chinese_content: ollama:qwen2.5:7b
    analysis: ollama:qwen2.5:7b

# 工具配置
tools:
  terminal:
    enabled: true
    allowed_commands:
      - git
      - npm
      - python
      - pytest
      - make
    working_dir: ~/code/lanhui-geo

  web_search:
    enabled: true
    provider: tavily
    api_key: ${TAVILY_API_KEY}

  file_ops:
    enabled: true
    allowed_paths:
      - ~/code/lanhui-geo
      - ~/.hermes/profiles/work/workspace
    forbidden_paths:
      - /etc
      - /usr
      - ~/.ssh

  feishu_sender:
    enabled: true
    webhook: ${FEISHU_WEBHOOK_WORK}

# 记忆配置
memory:
  enabled: true
  backend: sqlite
  path: ~/.hermes/profiles/work/memory/memory.db
  vector:
    enabled: true
    provider: chromadb
    path: ~/.hermes/profiles/work/memory/vectors

# 启用/禁用 Plugin
plugins:
  enabled:
    - feishu_sender
    - content_safety_filter
  disabled:
    - notion_memory

# Context（项目上下文）
context:
  project_root: ~/code/lanhui-geo
  brand:
    name: 蓝辉轻改
    services: [车膜, 车衣, 改色膜, 电动踏板, 轮毂]
    target: 中国大陆本地生活搜索
    tone: 专业可信

# Skill 工作区
skills:
  dirs:
    - ~/.hermes/profiles/work/skills
    - ~/.hermes/skills/shared  # 共享 Skill
  autoload:
    - lanhui-geo-content-checklist

# 日志
logging:
  level: INFO
  file: ~/.hermes/profiles/work/logs/hermes.log

# Cron
cron:
  enabled: true
  config_file: ~/.hermes/profiles/work/cron.yaml
  timezone: Asia/Shanghai
```

### 4.2 最小 Profile

```yaml
# profiles/coding/profile.yaml
extends: default

providers:
  default: anthropic:claude-sonnet-4.6

tools:
  terminal:
    enabled: true
    allowed_commands: [git, npm, python, pytest]
```

只写差异，其他从 default 继承。

## 五、内置 Profile 模板

HermesAgent 内置 4 套模板：

### 5.1 default

通用默认配置，适合个人日常使用：

```yaml
agent:
  name: hermes-default
providers:
  default: ollama:qwen2.5:7b
tools:
  terminal:
    enabled: true
  web_search:
    enabled: true
```

### 5.2 work

工作场景：

```yaml
agent:
  name: hermes-work
providers:
  default: openai:gpt-5-mini
tools:
  terminal:
    enabled: true
    allowed_commands: [git, npm, python, make]
  file_ops:
    allowed_paths: [~/code/work]
```

### 5.3 personal

个人场景：

```yaml
agent:
  name: hermes-personal
providers:
  default: anthropic:claude-sonnet-4.6
memory:
  privacy:
    enhanced: true
```

### 5.4 coding

编程场景：

```yaml
agent:
  name: hermes-coding
providers:
  default: openai:gpt-5-mini
tools:
  terminal:
    enabled: true
    allowed_commands: [git, npm, python, go, cargo]
  file_ops:
    allowed_paths: [~/code/personal, ~/Documents/notes]
```

## 六、Profile 切换

### 6.1 命令行切换

```bash
# 启动时指定
hermes --profile work
hermes chat --profile personal

# 一次性任务
hermes chat --profile coding -q "帮我 review 这段代码"
```

### 6.2 环境变量

```bash
# 当前会话默认 Profile
export HERMES_PROFILE=work
hermes

# 临时切换
HERMES_PROFILE=personal hermes chat
```

### 6.3 配置文件

```yaml
# ~/.hermes/config/config.yaml
default_profile: work
```

启动时不指定 `--profile` 时使用。

### 6.4 运行时切换

会话内可以切换：

```text
/profile work
/profile personal
/profile coding
```

切换后：

- 当前会话结束
- 新 Profile 配置生效
- 记忆保留（独立存储）

### 6.5 列出可用 Profile

```bash
hermes profile list
```

输出：

```text
Available profiles:
  default   - 通用默认配置
  work      - 蓝辉轻改 GEO 项目工作配置
  personal  - 个人使用配置
  coding    - 编程场景配置

Current: work
```

### 6.6 Profile 信息

```bash
hermes profile info work
```

输出：

```yaml
name: work
description: 蓝辉轻改 GEO 项目工作配置
extends: default
agent:
  name: work-assistant
providers:
  default: openai:gpt-5-mini
tools:
  terminal:
    enabled: true
    allowed_commands: [git, npm, python, pytest]
memory:
  path: ~/.hermes/profiles/work/memory/memory.db
plugins:
  enabled: [feishu_sender, content_safety_filter]
context:
  project_root: ~/code/lanhui-geo
```

## 七、Profile 与环境变量

### 7.1 Profile 专属环境变量

```bash
# ~/.hermes/profiles/work/.env
OPENAI_API_KEY=sk-xxxxxxxx
TAVILY_API_KEY=tvly-xxxxxxxx
FEISHU_WEBHOOK_WORK=https://open.feishu.cn/...

# ~/.hermes/profiles/personal/.env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
```

每个 Profile 加载自己的 `.env`。

### 7.2 Profile 间共享

```bash
# ~/.hermes/.env.shared
OPENAI_BASE_URL=https://api.openai.com/v1
```

所有 Profile 都加载这个文件。

### 7.3 变量优先级

```text
当前 Profile .env
  ↓
共享 .env
  ↓
全局 ~/.hermes/.env
  ↓
系统环境变量（最低）
```

## 八、实战场景

### 场景 1：蓝辉 GEO 项目

```bash
# 启动 work profile
hermes --profile work
```

```text
用户：基于我们品牌事实，生成 10 个 GEO prompt。

Agent：
1. 加载 work profile
2. 读取 context.brand（蓝辉轻改、服务列表、目标市场）
3. 调用 Skill: geo-content-generator
4. 使用 openai:gpt-5-mini（路由策略决定）
5. 写入 work memory
6. 输出 10 个 prompt
```

### 场景 2：个人 Coding

```bash
hermes --profile coding
```

```text
用户：帮我 review 这段 React 组件。

Agent：
1. 加载 coding profile
2. 工具白名单：git/npm/python
3. 允许访问 ~/code/personal
4. 使用 anthropic:claude-sonnet-4.6
5. 调用 Skill: code-review
6. 输出 review 报告
```

### 场景 3：飞书日报

```bash
hermes --profile feishu-daily
```

```yaml
# profiles/feishu-daily/profile.yaml
extends: work

tools:
  feishu_sender:
    enabled: true
    webhook: ${FEISHU_DAILY_WEBHOOK}

cron:
  enabled: true
  jobs:
    - name: daily-summary
      schedule: "0 9 * * *"
      prompt: "汇总团队昨天工作进展，生成飞书日报"
      tools: [web_search, feishu_sender]
```

## 九、多 Profile 组合

某些场景需要组合多个 Profile 的能力：

### 9.1 Profile 组合配置

```yaml
# profiles/work-plus/profile.yaml
extends: [work, coding]

overrides:
  providers:
    default: openai:gpt-5-mini
  tools:
    feishu_sender:
      enabled: true
```

继承多个 Profile，按顺序合并，后面的覆盖前面的。

### 9.2 临时 Profile

```bash
hermes --profile "work+coding" -q "..."
```

临时组合，不创建新文件。

## 十、Profile 调试

### 10.1 查看生效配置

```bash
hermes config show --profile work
```

输出每个字段的来源（来自 default / work / CLI）：

```yaml
agent:
  name: work-assistant            # source: profile(work.yaml:12)
providers:
  default: openai:gpt-5-mini      # source: profile(work.yaml:18)
tools:
  terminal:
    enabled: true                 # source: profile(work.yaml:32)
    allowed_commands: [git, ...]  # source: profile(work.yaml:33)
```

### 10.2 配置校验

```bash
hermes profile validate work
```

检查：

- 继承关系正确
- 路径存在
- 权限合法
- 没有循环引用

### 10.3 Profile 对比

```bash
hermes profile diff work coding
```

输出两个 Profile 的差异：

```text
Field             work                coding
providers.default openai:gpt-5-mini   anthropic:claude-sonnet-4.6
tools.terminal    allowed: [git, ...] allowed: [git, npm, python]
memory.path       .../work.db         .../coding.db
```

## 十一、Profile 与 Skills

### 11.1 共享 Skill

```yaml
# ~/.hermes/skills/shared/  - 所有 Profile 共享
```

### 11.2 Profile 私有 Skill

```yaml
# profiles/work/skills/ - 只 work profile 可见
```

### 11.3 Profile Skill 工作区

```yaml
# profiles/work/profile.yaml
skills:
  dirs:
    - ~/.hermes/profiles/work/skills
    - ~/.hermes/skills/shared
  autoload:
    - lanhui-geo-content-checklist
    - geo-keyword-matrix
```

## 十二、Profile 与 Memory

### 12.1 隔离存储

不同 Profile 的记忆完全隔离：

```text
~/.hermes/profiles/work/memory/memory.db      # 工作记忆
~/.hermes/profiles/personal/memory/memory.db  # 个人记忆
```

### 12.2 共享记忆（高级）

```yaml
# profiles/work/profile.yaml
memory:
  shared_with:
    - personal
  types:
    - user_profile  # 只共享用户档案
```

只共享 `user_profile`，项目记忆各自独立。

### 12.3 跨 Profile 记忆导入

```bash
hermes memory export --profile personal --output memories.json
hermes memory import --profile work --input memories.json
```

## 十三、最佳实践

### 13.1 不要太多 Profile

建议 3-5 个：

- default（兜底）
- work（工作）
- personal（个人）
- coding（编程，可选）
- writing（写作，可选）

太多 Profile 难维护。

### 13.2 命名清晰

```yaml
# 清晰命名
- work-lanhui-geo     # 项目级
- work-coding         # 工作类型
- personal-blog       # 个人项目

# 避免
- profile1
- new-config
- test-123
```

### 13.3 Profile 文档化

每个 Profile 有 README：

```markdown
# Work Profile

## 用途
蓝辉轻改 GEO 项目相关任务。

## 何时使用
- 生成 GEO 内容
- 分析 AI 搜索结果
- 写品牌文案

## 主要 Provider
openai:gpt-5-mini（主力）
ollama:qwen2.5:7b（备用 / 中文任务）

## 主要 Skill
- lanhui-geo-content-checklist
- geo-keyword-matrix

## 注意事项
- 不要在 work profile 下处理 personal 项目
- 切换 Profile 前先结束当前任务
```

### 13.4 定期备份

```bash
cp -r ~/.hermes/profiles ~/.hermes/profiles.backup-$(date +%Y%m%d)
```

### 13.5 Profile + 版本控制

```bash
# ~/.hermes/profiles 是 git repo
cd ~/.hermes/profiles
git init
git add .
git commit -m "init: work and personal profiles"
```

但 `.env` 文件加 `.gitignore`。

## 十四、常见错误

### 错误 1：Profile 不生效

```bash
hermes profile list
```

检查：

- 目录名是否在 profiles/ 下
- profile.yaml 是否存在
- extends 引用的父 Profile 是否存在

### 错误 2：路径错误

```yaml
# 错误 ❌（硬编码绝对路径）
memory:
  path: /Users/coya/hermes/memory.db

# 正确 ✅（使用 ~ 或相对 Profile 目录）
memory:
  path: ~/.hermes/profiles/work/memory.db
```

### 错误 3：循环继承

```yaml
# profile A
extends: B

# profile B
extends: A  # 循环！会报错
```

### 错误 4：环境变量未加载

```bash
# 检查 Profile 的 .env 是否存在
ls ~/.hermes/profiles/work/.env

# 手动测试加载
hermes --profile work env
```

## 十五、Profile 创建流程

完整创建一个新 Profile 的步骤：

```bash
# 1. 创建目录
mkdir -p ~/.hermes/profiles/my-new-project/{memory,logs,workspace,skills}

# 2. 复制模板
cp ~/.hermes/profiles/default/profile.yaml \
   ~/.hermes/profiles/my-new-project/profile.yaml

# 3. 修改配置
vim ~/.hermes/profiles/my-new-project/profile.yaml

# 4. 创建 .env
cp ~/.hermes/profiles/default/.env \
   ~/.hermes/profiles/my-new-project/.env
vim ~/.hermes/profiles/my-new-project/.env

# 5. 校验
hermes profile validate my-new-project

# 6. 测试启动
hermes --profile my-new-project chat -q "测试"
```

## 十六、总结

HermesAgent Profiles 系统的核心价值：

- **隔离**：不同场景不互相干扰
- **切换**：一行命令换"身份"
- **继承**：减少重复配置
- **共享**：团队可共享 Profile 模板

设计良好的 Profile 系统让：

- 工作 / 个人不混淆
- 不同项目用不同模型
- 不同角色有不同工具
- 本地 / 生产配置分离

Profile 是 HermesAgent 走向"工程化"的关键——同一份代码，满足多种需求。
