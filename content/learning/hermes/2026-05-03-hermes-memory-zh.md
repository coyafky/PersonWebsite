---
title: "HermesAgent Memory 使用整理"
date: "2026-05-03"
summary: "HermesAgent Memory 完整使用整理：4 类记忆层级（Working / Short-term Session / Long-term Persistent / Vector RAG）、4 种 Memory 类型（用户档案 / 项目事实 / 偏好 / 程序化）、5 种记忆操作（remember / recall / forget / list / consolidate）、嵌入工作流（自动检测偏好与事实 / 手动强制记录）、3 个实战场景（蓝辉 GEO / 飞书日报 / 个人 Coding 助手）、4 条隐私保护机制。"
tags:
  - hermes
  - Memory
  - 长期记忆
  - 记忆层级
  - 偏好
status: published
lang: zh
topic: hermes
englishSummary: "Complete HermesAgent Memory guide: 4 memory layers (Working / Short-term Session / Long-term Persistent / Vector RAG), 4 memory types (user profile / project facts / preferences / procedural), 5 memory operations (remember / recall / forget / list / consolidate), embedded workflow (auto-detect preferences & facts / manual forced save), 3 practical scenarios (蓝辉 GEO / Feishu daily / personal coding assistant), 4 privacy protection mechanisms."
---

# HermesAgent Memory 使用整理

> 基于 HermesAgent 项目的 Memory 系统完整使用说明整理。

---

## 一、为什么需要 Memory

大模型本身是无状态的——每次对话都是"独立"的：

- 不知道你之前说过什么
- 不知道你的项目背景
- 不知道你的偏好
- 不知道你踩过的坑

Memory 系统让 Agent 拥有"记忆"，从而：

- 跨会话记住用户偏好（语言、风格）
- 保留项目背景（业务、技术栈）
- 累积经验（踩过的坑、成功的方案）
- 个性化回答（基于历史交互）

## 二、Memory 的 4 层架构

HermesAgent 的记忆分为 4 层：

```text
┌─────────────────────────────────────┐
│  Layer 1: Working Memory            │  当前对话上下文
│  （当前会话的所有消息）              │
└─────────────────────────────────────┘
            ↓ 摘要 / 提取
┌─────────────────────────────────────┐
│  Layer 2: Short-term Session Memory │  本次会话总结
│  （会话结束时的关键事实）            │
└─────────────────────────────────────┘
            ↓ 重要性筛选
┌─────────────────────────────────────┐
│  Layer 3: Long-term Persistent     │  跨会话持久记忆
│  （结构化事实 + 偏好 + 项目背景）    │
└─────────────────────────────────────┘
            ↓ 语义索引
┌─────────────────────────────────────┐
│  Layer 4: Vector RAG Memory        │  向量检索记忆
│  （Embedding 索引，可语义搜索）      │
└─────────────────────────────────────┘
```

### 2.1 Layer 1：Working Memory

- **内容**：当前会话的所有消息
- **存储**：临时内存
- **生命周期**：当前会话结束即清除
- **使用**：直接喂给模型作为上下文

### 2.2 Layer 2：Short-term Session Memory

- **内容**：会话结束时提炼的关键事实
- **存储**：会话数据库（SQLite）
- **生命周期**：可配置（默认 30 天）
- **使用**：下次相似会话时自动召回

### 2.3 Layer 3：Long-term Persistent Memory

- **内容**：跨会话的结构化事实
- **存储**：SQLite + 可选 JSON/YAML
- **生命周期**：永久（除非主动删除）
- **使用**：每次会话开始注入系统提示

### 2.4 Layer 4：Vector RAG Memory

- **内容**：所有记忆的 Embedding
- **存储**：向量数据库（ChromaDB / Qdrant / pgvector）
- **生命周期**：与 Layer 3 同步
- **使用**：语义检索最相关的 Top-K 条目

## 三、记忆的类型

HermesAgent 支持 4 种结构化记忆类型：

### 3.1 用户档案（user_profile）

```yaml
user_profile:
  name: 冯科雅 (Coya)
  location: 广州/佛山
  role: AI 工程师
  tech_stack:
    - Next.js
    - React
    - TypeScript
    - Python
    - 飞书
    - Hermes Agent
  preferences:
    language: 中文
    response_style: 结构化、结论先行
    detail_level: 中等深度
    avoid: 冗长寒暄、emoji
```

### 3.2 项目事实（project_facts）

```yaml
project_facts:
  - id: lanhui-geo-001
    project: 蓝辉轻改 GEO 官网
    facts:
      - "服务包括：窗膜、车衣、改色膜、电动踏板、轮毂"
      - "目标市场：中国大陆本地生活搜索"
      - "目标受众：粤港澳大湾区车主"
      - "上线时间：2026 年 Q2"
    tags: [geo, automotive, lanhui]
    updated_at: 2026-05-16
```

### 3.3 用户偏好（preferences）

```yaml
preferences:
  - id: pref-001
    category: writing
    key: tone
    value: 专业可信、像 4S 店工程师
    scope: lanhui-geo
    confidence: 0.9
    source: user_explicit
    updated_at: 2026-04-20
```

### 3.4 程序化记忆（procedural）

```yaml
procedural:
  - id: proc-001
    name: lanhui-geo-content-checklist
    description: 蓝辉 GEO 内容生成 checklist
    steps:
      - "提取品牌核心事实"
      - "生成 20-30 个自然用户 prompt"
      - "在主流 AI 搜索引擎采样"
      - "记录引用来源"
      - "分析引用缺失"
      - "产出内容优化建议"
    tags: [geo, workflow]
    updated_at: 2026-05-10
```

## 四、Memory 配置

### 4.1 主配置

```yaml
memory:
  enabled: true

  # Working Memory（始终开启）
  working_memory:
    max_messages: 50
    max_tokens: 8000

  # Short-term Session
  short_term:
    enabled: true
    storage: sqlite
    path: ~/.hermes/memory/sessions.db
    ttl_days: 30
    auto_summarize: true

  # Long-term Persistent
  long_term:
    enabled: true
    storage: sqlite
    path: ~/.hermes/memory/long_term.db
    types:
      - user_profile
      - project_facts
      - preferences
      - procedural

  # Vector RAG
  vector:
    enabled: true
    provider: chromadb
    path: ~/.hermes/memory/vectors
    embedding:
      provider: openai
      model: text-embedding-3-small
      dimensions: 1536
    retrieval:
      top_k: 5
      min_similarity: 0.7

  # 检索策略
  retrieval:
    strategy: hybrid     # vector + keyword
    rerank: true
    inject_into_prompt: true
    max_inject_tokens: 1000
```

### 4.2 不同记忆后端

```yaml
# SQLite（轻量，单机）
storage:
  backend: sqlite
  path: ~/.hermes/memory.db

# PostgreSQL（生产级，多用户）
storage:
  backend: postgresql
  connection: postgresql://user:pass@localhost/hermes
  pool_size: 10

# MongoDB（文档型，灵活）
storage:
  backend: mongodb
  connection: mongodb://localhost:27017/hermes
```

## 五、Memory 工具

HermesAgent 提供 5 个核心 memory 工具：

### 5.1 remember（记忆保存）

```yaml
tool: memory_remember
description: 将重要信息保存到长期记忆
parameters:
  type:
    type: string
    enum: [user_profile, project_facts, preferences, procedural]
  content:
    type: object
  scope:
    type: string
    description: 作用域（如 project / global / user）
```

### 5.2 recall（记忆检索）

```yaml
tool: memory_recall
description: 检索与查询相关的记忆
parameters:
  query:
    type: string
  type:
    type: string
    optional: true
  scope:
    type: string
    optional: true
  top_k:
    type: integer
    default: 5
```

### 5.3 forget（记忆删除）

```yaml
tool: memory_forget
description: 删除指定记忆
parameters:
  id:
    type: string
  reason:
    type: string
```

### 5.4 list（记忆列表）

```yaml
tool: memory_list
description: 列出某类型的所有记忆
parameters:
  type:
    type: string
  scope:
    type: string
  limit:
    type: integer
    default: 20
```

### 5.5 consolidate（记忆整合）

```yaml
tool: memory_consolidate
description: 整合相似/重复的记忆
parameters:
  type:
    type: string
  similarity_threshold:
    type: number
    default: 0.9
```

## 六、Memory 工作流

### 6.1 自动检测与保存

HermesAgent 会在以下时机自动检测并保存记忆：

```text
用户消息
  ↓
意图识别（user_profile / preference / fact / question）
  ↓
提取关键信息
  ↓
调用 memory_remember
  ↓
去重 & 整合
  ↓
写入对应存储
```

**示例触发场景**：

```text
用户："我以后请用中文回答。"
→ 自动保存偏好 pref-002: language=zh

用户："我们做蓝辉轻改 GEO 官网。"
→ 自动保存项目事实 lanhui-geo-001

用户："目标受众是粤港澳大湾区车主。"
→ 自动追加到 lanhui-geo-001.facts
```

### 6.2 手动强制保存

在 Skill 或对话中显式调用：

```python
@skill(name="save_brand_facts")
def save_brand_facts(brand_name: str, facts: list):
    return memory.remember(
        type="project_facts",
        content={
            "project": brand_name,
            "facts": facts,
            "tags": ["brand", "geo"],
        },
        scope=brand_name,
    )
```

### 6.3 会话开始自动注入

每次新会话开始时：

```text
新会话开始
  ↓
读取 user_profile
  ↓
检索相关 project_facts
  ↓
加载相关 procedural 步骤
  ↓
拼装成 memory_context 注入系统提示
  ↓
开始正常工作
```

例如：

```xml
<memory_context>
<user_profile>
  名字：Coya
  偏好：中文、结构化、结论先行
</user_profile>

<active_projects>
  蓝辉轻改 GEO 官网：服务车膜/车衣/改色膜/电动踏板/轮毂，目标粤港澳大湾区
</active_projects>

<relevant_procedures>
  GEO 内容生成 checklist：6 步骤
</relevant_procedures>
</memory_context>
```

## 七、典型使用场景

### 场景 1：蓝辉 GEO 项目持续推进

**第一次会话**：

```text
用户：我们要做蓝辉轻改 GEO 官网。
Agent：好的，我记住了。服务包括哪些？
用户：车膜、车衣、改色膜、电动踏板、轮毂。
→ memory: project_facts[lanhui-geo-001] = 服务列表
```

**第二次会话**（一周后）：

```text
用户：继续做 GEO 内容。
Agent：（自动加载 lanhui-geo-001）好的，蓝辉轻改 GEO 上次定的服务包括 5 项，这次要继续做什么？
→ 无需重新解释背景
```

**第三次会话**（一个月后）：

```text
用户：上次那套 GEO 内容模板在哪？
Agent：（检索 procedural[lanhui-geo-content-checklist]）模板在以下位置...
→ 自动召回程序化记忆
```

### 场景 2：飞书日报助手

```yaml
# 配置
memory:
  long_term:
    enabled: true
  auto_save:
    enabled: true
    triggers:
      - "每天 9 点推送日报"
      - "用户偏好 markdown 格式"
```

```text
用户：每天早上 9 点给我推飞书日报，markdown 格式。
→ memory: preferences[feishu-daily-format] = markdown
→ memory: preferences[feishu-daily-time] = 09:00
→ 自动创建 cron job
```

### 场景 3：个人 Coding 助手

```yaml
memory:
  long_term:
    types: [user_profile, preferences, project_facts]

procedural:
  - "用户偏好 TypeScript + 函数式风格"
  - "项目使用 Next.js App Router"
  - "避免引入新依赖除非必要"
```

```text
用户：帮我写个 React 组件。
Agent：（自动加载偏好）好的，TypeScript + 函数式，无新依赖。开始：
```

## 八、Memory 调优

### 8.1 控制 token 消耗

```yaml
memory:
  retrieval:
    max_inject_tokens: 1000    # 限制注入量
    top_k: 5                   # Top 5 条最相关
  working_memory:
    max_tokens: 8000           # 控制上下文大小
```

### 8.2 提升检索质量

```yaml
memory:
  vector:
    embedding:
      model: text-embedding-3-small   # 质量优先
    retrieval:
      top_k: 10
      min_similarity: 0.6
      rerank: true
```

### 8.3 自动整合相似记忆

```yaml
memory:
  consolidation:
    enabled: true
    schedule: "0 3 * * *"      # 每天凌晨 3 点
    similarity_threshold: 0.92
    types: [project_facts, preferences]
```

### 8.4 清理过期记忆

```yaml
memory:
  retention:
    short_term_ttl_days: 30
    long_term_review_days: 90   # 每 90 天审视一次
    auto_delete_after_review: false  # 不自动删，需要人工确认
```

## 九、隐私与安全

### 9.1 敏感信息过滤

```yaml
memory:
  privacy:
    auto_filter:
      patterns:
        - "sk-[a-zA-Z0-9]{20,}"     # API Key
        - "[0-9]{16,}"               # 长数字（卡号）
        - "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"  # Email
    action: warn  # warn / block / encrypt
```

### 9.2 记忆加密

```yaml
memory:
  encryption:
    enabled: true
    provider: aes-256-gcm
    key_env: HERMES_MEMORY_KEY
```

### 9.3 作用域隔离

```yaml
memory:
  scopes:
    global:
      description: 跨项目共享
      types: [user_profile, general_preferences]
    per_project:
      description: 项目级隔离
      types: [project_facts, procedural]
    ephemeral:
      description: 临时，不持久化
      types: [session_only]
```

### 9.4 用户控制

```yaml
memory:
  user_control:
    allow_view: true     # 用户可以查看自己的记忆
    allow_delete: true   # 用户可以删除记忆
    allow_export: true   # 用户可以导出记忆
    audit_log: true      # 记录所有记忆操作
```

## 十、调试与监控

### 10.1 查看当前记忆

```bash
hermes memory list --type preferences
hermes memory list --type project_facts --scope lanhui-geo
hermes memory show <id>
```

### 10.2 检索测试

```bash
hermes memory search "蓝辉轻改服务"
```

输出：

```yaml
matches:
  - id: lanhui-geo-001
    type: project_facts
    similarity: 0.94
    snippet: "服务包括：窗膜、车衣、改色膜..."
```

### 10.3 记忆统计

```bash
hermes memory stats
```

输出：

```text
Total memories: 142
By type:
  user_profile: 5
  project_facts: 23
  preferences: 41
  procedural: 12
Storage: 12.4 MB
Vector index: 8.7 MB
Last consolidation: 2026-05-15 03:00:00
```

## 十一、常见问题

### Q1：Agent 用了很久但好像没记住东西？

检查：

```bash
hermes memory list --type preferences
```

如果为空，可能是：

- auto_save 没启用
- 过滤器太严格，把所有内容都过滤掉了
- 存储路径权限问题

### Q2：记忆太冗余，重复内容多？

开启自动整合：

```yaml
memory:
  consolidation:
    enabled: true
    schedule: "0 3 * * *"
```

### Q3：检索结果不相关？

调整 embedding 模型和阈值：

```yaml
memory:
  vector:
    embedding:
      model: text-embedding-3-small
    retrieval:
      min_similarity: 0.75
      top_k: 8
```

### Q4：导入/导出记忆？

```bash
hermes memory export --output memories.json
hermes memory import --input memories.json
```

## 十二、总结

HermesAgent 的 Memory 系统核心：

- **4 层架构**：Working → Short-term → Long-term → Vector RAG
- **4 种类型**：用户档案 / 项目事实 / 偏好 / 程序化
- **5 个工具**：remember / recall / forget / list / consolidate
- **自动检测**：从对话中提取关键信息
- **作用域隔离**：global / per_project / ephemeral
- **隐私保护**：敏感信息过滤、加密、用户控制

设计良好的 Memory 系统能让 Agent 从"工具"变成"助手"——它知道你是谁、做什么、喜欢什么、踩过什么坑。这是 LLM 应用工程化的关键基础设施。
