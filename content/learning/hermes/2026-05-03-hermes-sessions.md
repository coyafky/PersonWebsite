---
title: "HermesAgent Sessions 使用整理"
date: "2026-05-03"
summary: "HermesAgent Sessions 会话管理完整使用整理：会话存储结构（messages / metadata / summary / tool_calls / tokens）、5 种会话操作（list / resume / export / import / search）、resume 命令（--last / --id / --title / --date / --tag / --interactive）、自动摘要（关键事实 / 决策 / 行动项 / 上下文）、搜索与会话分析、3 个实战场景（跨会话 GEO 项目 / 代码 review 上下文 / 飞书日报）、与 Memory/Profile 协同、最佳实践。"
tags:
  - hermes
  - Sessions
  - 会话管理
  - resume
  - 摘要
status: draft
lang: zh
topic: hermes
englishSummary: "Complete HermesAgent Sessions management guide: session storage structure (messages / metadata / summary / tool_calls / tokens), 5 session operations (list / resume / export / import / search), resume commands (--last / --id / --title / --date / --tag / --interactive), auto-summarization (key facts / decisions / action items / context), search and analytics, 3 practical scenarios (cross-session GEO project / code review context / Feishu daily), coordination with Memory/Profile, best practices."
---

# HermesAgent Sessions 使用整理

> 基于 HermesAgent 项目的 Sessions（会话管理）完整使用说明整理。

---

## 一、什么是 Session

Session 是 HermesAgent 中一次完整对话的记录——从用户输入第一条消息到会话结束的所有内容。

每个 Session 包含：

- 完整消息历史（用户 + Agent + 工具调用）
- 会话元信息（开始时间、模型、Profile、Token 用量）
- 自动摘要（关键事实、决策、行动项）
- 标签和注释

Session 让 Agent 能：

- 恢复之前的对话
- 跨会话查找历史
- 复盘关键决策
- 提取记忆

## 二、Session 存储结构

```text
~/.hermes/profiles/{profile}/sessions/
├── 2026-05-16_lanhui-geo-content.md
├── 2026-05-15_personal-coding-review.md
├── 2026-05-14_daily-summary.md
├── index.yaml           # 会话索引
└── archive/             # 已归档
    └── 2026-04-*.md
```

### 2.1 Session 文件格式

```markdown
---
session_id: sess_20260516_103015_abc123
title: 蓝辉轻改 GEO 内容生成
created_at: 2026-05-16 10:30:15
updated_at: 2026-05-16 11:45:23
profile: work
model: openai:gpt-5-mini
total_tokens: 12450
total_messages: 24
tags: [geo, lanhui, content-generation]
status: active
---

# 蓝辉轻改 GEO 内容生成

## 会话摘要
- 完成了 10 个 GEO prompt 生成
- 提取了 23 条品牌核心事实
- 输出了内容优化建议清单

## 关键决策
- 使用 qwen2.5:7b 处理中文内容
- 启用 web_search 验证品牌事实

## 行动项
- [ ] 等待用户确认 prompt 列表
- [ ] 基于确认的 prompt 生成实际内容

## 完整对话

### 用户 (10:30:15)
我们要做蓝辉轻改 GEO 官网的内容...

### Agent (10:30:42)
好的，根据之前保存的品牌事实...

### 用户 (10:32:10)
加上轮毂改装的场景...

...

## 工具调用记录

- web_search(query="蓝辉轻改 窗膜", max_results=5)
- file_read(path="~/.hermes/profiles/work/context/brand.yaml")
- skill_invoke(name="geo-content-generator")

## Token 用量

| 阶段 | Tokens |
| --- | --- |
| 系统提示 | 1200 |
| 用户消息 | 3500 |
| Agent 响应 | 5800 |
| 工具调用 | 1950 |
| 总计 | 12450 |
```

### 2.2 索引文件

```yaml
# index.yaml
sessions:
  - id: sess_20260516_103015_abc123
    title: 蓝辉轻改 GEO 内容生成
    date: 2026-05-16
    profile: work
    tags: [geo, lanhui]
    status: active

  - id: sess_20260515_141022_def456
    title: 个人 Coding 助手 review
    date: 2026-05-15
    profile: coding
    tags: [coding, react]
    status: archived

  - id: sess_20260514_090000_ghi789
    title: 飞书日报模板设计
    date: 2026-05-14
    profile: feishu-daily
    tags: [feishu, cron]
    status: active
```

## 三、Session 命令

### 3.1 列出 Session

```bash
hermes session list
```

输出：

```text
ID                                    Date        Profile    Tags                       Title
------------------------------------  ----------  ---------  -------------------------  ----------------------------
sess_20260516_103015_abc123           2026-05-16  work       geo, lanhui                蓝辉轻改 GEO 内容生成
sess_20260515_141022_def456           2026-05-15  coding     coding, react              个人 Coding 助手 review
sess_20260514_090000_ghi789           2026-05-14  feishu     feishu, cron               飞书日报模板设计
sess_20260513_153012_jkl012           2026-05-13  personal  writing, blog              公众号文章撰写
```

选项：

```bash
hermes session list --profile work
hermes session list --tag geo
hermes session list --since "2026-05-01"
hermes session list --limit 10
```

### 3.2 恢复 Session

```bash
# 恢复最近会话
hermes session resume --last

# 按 ID 恢复
hermes session resume sess_20260516_103015_abc123

# 按标题模糊匹配
hermes session resume --title "蓝辉 GEO"

# 按日期
hermes session resume --date "2026-05-16"

# 按标签
hermes session resume --tag geo --tag lanhui
```

### 3.3 导出 Session

```bash
# 导出单个会话
hermes session export sess_20260516_103015_abc123 --output ./sessions/

# 导出为 Markdown
hermes session export sess_20260516_103015_abc123 --format markdown

# 导出为 JSON（包含完整元数据）
hermes session export sess_20260516_103015_abc123 --format json

# 批量导出
hermes session export --profile work --since "2026-05-01" --output ./backup/
```

### 3.4 导入 Session

```bash
hermes session import ./sessions/sess_20260516_103015_abc123.md
hermes session import ./backup/ --profile work
```

### 3.5 搜索 Session

```bash
# 关键词搜索
hermes session search "蓝辉轻改 窗膜"

# 高级搜索
hermes session search --tag geo --profile work --since "2026-05-01"
```

输出：

```text
找到 3 个匹配的会话：

sess_20260516_103015_abc123 (2026-05-16)
  匹配片段："蓝辉轻改窗膜服务包含前挡、侧挡..."
  相关度: 0.95

sess_20260510_140022_xyz789 (2026-05-10)
  匹配片段："讨论了窗膜的车规级标准..."
  相关度: 0.78

sess_20260505_091234_mno345 (2026-05-05)
  匹配片段："窗膜品牌对比..."
  相关度: 0.62
```

### 3.6 删除 Session

```bash
hermes session delete sess_20260516_103015_abc123
hermes session delete --before "2026-04-01"
```

### 3.7 归档 Session

```bash
# 归档（不删除，但不再活跃）
hermes session archive sess_20260516_103015_abc123

# 查看归档
hermes session list --archived
```

## 四、会话内命令

在 HermesAgent 会话内：

### 4.1 会话元信息

```text
/session info
```

输出当前会话的元信息。

### 4.2 改名 / 加标签

```text
/session rename "蓝辉 GEO 第一轮讨论"
/session tag add geo
/session tag add lanhui
/session tag remove draft
```

### 4.3 摘要

```text
/session summarize
```

手动生成当前会话的摘要。

### 4.4 切分

```text
/session split 5
```

把当前会话从第 5 条消息开始拆分成新会话。

### 4.5 导出

```text
/session export markdown
/session export json
```

### 4.6 结束

```text
/end           # 正常结束，保存会话
/end discard   # 结束但不保存
```

## 五、自动摘要

HermesAgent 在会话结束时会自动生成摘要：

### 5.1 摘要内容

```yaml
summary:
  brief: "蓝辉轻改 GEO 内容生成第一轮"        # 一句话
  key_facts:                                    # 关键事实
    - "蓝辉轻改服务包括 5 类：车膜/车衣/改色膜/电动踏板/轮毂"
    - "目标市场是中国大陆本地生活搜索"
    - "已生成 10 个 GEO 优化 prompt"

  decisions:                                    # 决策
    - "使用 qwen2.5:7b 处理中文内容（更好的中文理解）"
    - "启用 web_search 验证品牌事实真实性"

  action_items:                                 # 行动项
    - id: action-001
      task: "等待用户确认 prompt 列表"
      owner: user
    - id: action-002
      task: "基于确认 prompt 生成内容"
      owner: agent

  context_for_next_session:                     # 下一会话上下文
    - "用户在推进蓝辉 GEO 内容生成"
    - "已确认品牌事实，下一步是内容产出"
    - "用户偏好 markdown + 表格"

  tags: [geo, lanhui, content]
```

### 5.2 摘要触发

自动触发：

- 会话正常结束（`/end`）
- 会话超过 50 条消息
- Token 用量超过阈值
- 手动 `/session summarize`

### 5.3 摘要配置

```yaml
# config.yaml
session:
  auto_summarize:
    enabled: true
    trigger:
      message_count: 50
      token_count: 10000
      on_end: true
    extract:
      key_facts: true
      decisions: true
      action_items: true
      context_for_next: true
    save_to_memory:
      enabled: true
      types: [project_facts, preferences, procedural]
      dedup: true
```

## 六、Session 搜索与分析

### 6.1 全文搜索

```bash
hermes session search "GEO prompt"
```

支持：

- 标题
- 消息内容
- 摘要
- 工具调用参数

### 6.2 按条件筛选

```bash
# 时间范围
hermes session list --since "2026-05-01" --until "2026-05-15"

# 按模型
hermes session list --model "openai:gpt-5-mini"

# 按 Token 用量
hermes session list --min-tokens 5000

# 按状态
hermes session list --status active
hermes session list --status archived
```

### 6.3 会话分析

```bash
hermes session stats
```

输出：

```text
Total sessions: 142
Active: 38
Archived: 104

By profile:
  work: 67
  personal: 42
  coding: 23
  feishu-daily: 10

By month:
  2026-05: 38
  2026-04: 52
  2026-03: 52

Token usage:
  Total: 1,245,890
  Avg per session: 8,774
  Most expensive: sess_20260516 (24,560 tokens)

Top tags:
  geo (38)
  coding (23)
  feishu (10)
```

### 6.4 复盘决策

```bash
hermes session replay sess_20260516_103015_abc123
```

会重放整个会话（只读），可以：

- 跳到任意消息
- 查看当时的工具调用
- 提取决策和行动项

## 七、典型场景

### 场景 1：跨会话 GEO 项目

**第一次会话**：

```text
用户：蓝辉轻改 GEO 第一轮 - 提取品牌事实。
Agent：（生成 23 条品牌事实）
/end → 自动摘要 → 保存到 MEMORY.md
```

**一周后第二次会话**：

```bash
hermes session resume --last --profile work
```

```text
Agent：欢迎回到蓝辉 GEO 项目。上次我们提取了 23 条品牌事实，今天要继续什么？
```

无需重复背景。

### 场景 2：代码 review 上下文

**Session 1**：review PR #123

**Session 2**（3 天后）：

```bash
hermes session resume sess_20260513_review_pr123
```

```text
Agent：上次 review PR #123 提了 8 个建议，其中 5 个已修复。需要继续 review 修复部分吗？
```

完整上下文恢复。

### 场景 3：飞书日报

每天 9 点创建新会话执行日报任务：

```yaml
cron:
  jobs:
    - name: daily-summary
      schedule: "0 9 * * *"
      actions:
        - session:
            profile: feishu-daily
            title: "日报-{{date}}"
            tags: [daily, feishu]
        - task: "生成日报内容"
        - tool: feishu_sender
```

每次执行创建一个新 Session，保留历史日报。

## 八、Session 与 Memory 协同

### 8.1 从 Session 提取到 Memory

```bash
hermes session extract-memories sess_20260516_103015_abc123
```

输出：

```text
提取到 5 条候选记忆：

1. user_profile.preferences
   "用户偏好 markdown + 表格"
   [保存] [跳过] [编辑]

2. project_facts
   "蓝辉轻改服务包括 5 类"
   [保存] [跳过] [编辑]

...

选择操作：
输入编号选择，或 'all' 全部保存，'none' 全部跳过
```

### 8.2 Session 引用 Memory

新会话开始时自动：

1. 检索相关 project_facts
2. 加载 user_profile
3. 匹配相关 procedural

注入到 system prompt 作为上下文。

### 8.3 Memory 引用 Session

在 Memory 中记录 Session ID：

```yaml
project_facts:
  - id: lanhui-geo-001
    facts:
      - "服务包括：..."
    source_session: sess_20260516_103015_abc123
    updated_at: 2026-05-16
```

追溯事实来源。

## 九、Session 与 Profile 协同

每个 Profile 独立存储 Session：

```text
~/.hermes/profiles/work/sessions/
~/.hermes/profiles/personal/sessions/
~/.hermes/profiles/coding/sessions/
```

切换 Profile 后：

- 当前会话结束
- 新 Profile 加载其 Session 历史
- 跨 Profile 互不可见（除非显式导入）

## 十、Session 配置

```yaml
# config.yaml
session:
  # 存储
  storage:
    backend: sqlite          # sqlite / postgresql / filesystem
    path: ~/.hermes/profiles/{profile}/sessions/sessions.db
    max_size_mb: 100

  # 自动保存
  auto_save:
    enabled: true
    on_message: true
    interval_seconds: 30

  # 自动摘要
  auto_summarize:
    enabled: true
    trigger:
      message_count: 50
      token_count: 10000
      on_end: true

  # 归档
  archive:
    enabled: true
    after_days: 30
    compress: true

  # 清理
  cleanup:
    enabled: false           # 默认不自动删除
    after_days: 365
    require_confirmation: true
```

## 十一、最佳实践

### 11.1 每次会话都有清晰标题

```text
❌ 不好
"测试"
"调试"
"问一下"

✅ 好
"蓝辉 GEO 第二轮：内容生成"
"PR #123 Review: Frontend 重构"
"飞书日报模板设计"
```

### 11.2 善用标签

```bash
# 项目
hermes session tag add lanhui-geo

# 类型
hermes session tag add debug

# 状态
hermes session tag add in-progress
```

### 11.3 重要决策加注

```text
用户：以后都用 qwen2.5:7b 处理中文。
Agent：（标记为决策）好的，已保存到 memory 并在本会话标注。
```

### 11.4 定期归档

```bash
hermes session archive --before "2026-04-01"
hermes session archive --tag draft
```

### 11.5 备份重要会话

```bash
hermes session export sess_20260516_103015_abc123 --output ~/important-sessions/
```

### 11.6 会话 vs 记忆

| 维度 | Session | Memory |
| --- | --- | --- |
| 内容 | 完整对话历史 | 提炼后的关键事实 |
| 容量 | 大（几十 MB） | 小（KB 级别） |
| 检索 | 全文搜索 | 语义检索 |
| 适合 | 上下文回溯 | 长期事实 |
| 清理 | 定期归档 | 手动维护 |

原则：

- 临时信息放 Session（自动清理）
- 长期价值放 Memory（手动维护）

## 十二、常见问题

### Q1：会话太多，找不到想要的？

用标签和搜索：

```bash
hermes session search "关键词"
hermes session list --tag xxx
```

### Q2：恢复的会话上下文不完整？

检查：

- 会话是否被归档
- 是否在新 Profile 下恢复（旧 Profile 的记忆不可见）
- Token 窗口是否超出限制（很长的会话可能被截断）

### Q3：摘要不准确？

手动修正：

```text
/session edit-summary
```

或调整摘要配置：

```yaml
session:
  auto_summarize:
    model: openai:gpt-5-mini  # 用更强的模型
    extract:
      key_facts: true
      decisions: true
```

### Q4：会话占太多磁盘？

启用压缩归档：

```yaml
session:
  archive:
    enabled: true
    compress: true    # gzip 压缩
  cleanup:
    enabled: true
    after_days: 180   # 半年后清理
```

## 十三、Session 安全

### 13.1 敏感信息过滤

```yaml
session:
  privacy:
    auto_redact:
      enabled: true
      patterns:
        - "sk-[a-zA-Z0-9]+"
        - "[0-9]{16,}"
      action: replace  # replace / block / warn
```

### 13.2 加密存储

```yaml
session:
  encryption:
    enabled: true
    key_env: HERMES_SESSION_KEY
```

### 13.3 访问控制

```yaml
session:
  access:
    require_unlock: false   # 是否每次访问都要解锁
    auto_lock_minutes: 30   # 30 分钟无操作自动锁定
```

## 十四、总结

HermesAgent Session 系统核心：

- **完整记录**：消息 + 元信息 + 摘要
- **灵活管理**：list / resume / export / import / search
- **自动摘要**：关键事实 + 决策 + 行动项
- **检索分析**：全文搜索 + 统计 + 复盘
- **与 Memory 协同**：从会话提取记忆，记忆引导会话
- **Profile 隔离**：不同场景会话不串

Session 是 HermesAgent 的"短期工作记忆"，Memory 是"长期事实库"——两者结合，让 Agent 既能回溯上下文，又能稳定保留关键知识。
