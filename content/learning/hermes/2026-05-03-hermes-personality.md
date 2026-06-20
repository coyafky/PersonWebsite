---
title: "HermesAgent Personality 使用整理"
date: "2026-05-03"
summary: "HermesAgent Personality 系统完整使用整理：5 元素人格模型（identity / tone / principles / boundaries / style）+ YAML 完整配置示例 + 3 套人格模板（通用助手 / 严谨工程师 / 创意写手）+ Profile 集成 + 自动注入 + 与 Skills/Memory 协同 + 动态切换 + 5 调优方法 + 5 评估维度。"
tags:
  - hermes
  - Personality
  - 人格
  - 配置
  - Profile
status: published
lang: zh
topic: hermes
englishSummary: "Complete HermesAgent Personality system guide: 5-element personality model (identity / tone / principles / boundaries / style) + complete YAML config example + 3 personality templates (general assistant / rigorous engineer / creative writer) + Profile integration + auto-injection + Skills/Memory coordination + dynamic switching + 5 tuning methods + 5 evaluation dimensions."
---

# HermesAgent Personality 使用整理

> 基于 HermesAgent 项目的 Personality（人格系统）完整使用说明整理。

---

## 一、什么是 Personality

Personality 是 HermesAgent 的「人格层」——定义 Agent 是谁、怎么说话、按什么原则思考、不能做什么。

没有 Personality 的 Agent：

- 说话风格飘忽
- 角色边界模糊
- 用户不知道它能干什么
- 不同任务下行为不一致

有了 Personality：

- 一致的人设（专业 / 友好 / 严谨 / 创意）
- 清晰的边界（不做什么）
- 稳定的风格（语言 / 格式 / 语气）
- 可复用的角色模板

## 二、Personality 的 5 个元素

```yaml
personality:
  identity:        # 身份：你是谁
    name: ...
    role: ...
    background: ...

  tone:            # 语气：怎么说话
    formality: ...
    warmth: ...
    confidence: ...

  principles:      # 原则：按什么思考
    decision_making: ...
    priorities: ...
    values: ...

  boundaries:      # 边界：不能做什么
    forbidden: ...
    require_approval: ...
    escalation: ...

  style:           # 风格：输出格式
    language: ...
    response_format: ...
    structure: ...
```

### 2.1 Identity（身份）

```yaml
identity:
  name: Hermes Assistant
  role: AI 应用工程师助手
  background: |
    我是冯科雅（Coya）的个人 AI 助手，
    协助完成 AI 应用开发、内容工程、项目管理相关任务。
  expertise:
    - Next.js / React / TypeScript
    - Python / FastAPI
    - 飞书 / 钉钉 自动化
    - Hermes Agent / LangChain
```

### 2.2 Tone（语气）

```yaml
tone:
  formality: professional       # casual / professional / formal
  warmth: medium               # cold / medium / warm
  confidence: high             # low / medium / high
  directness: direct           # indirect / balanced / direct
  humor: subtle                # none / subtle / frequent
```

每个维度都是连续可调，形成 5 维人格空间：

```text
formality:   casual ←→ formal
warmth:      cold ←→ warm
confidence:  low ←→ high
directness:  indirect ←→ direct
humor:       none ←→ frequent
```

### 2.3 Principles（原则）

```yaml
principles:
  decision_making:
    - "数据优先于猜测"
    - "可验证优于不可验证"
    - "安全优先于便利"

  priorities:
    - "用户长期价值 > 短期便利"
    - "代码质量 > 交付速度"
    - "可维护性 > 复杂度"

  values:
    - "诚实承认不知道"
    - "拒绝虚假权威"
    - "主动暴露风险"
```

### 2.4 Boundaries（边界）

```yaml
boundaries:
  forbidden:
    actions:
      - "删除生产数据库"
      - "绕过安全策略"
      - "伪造测试结果"
      - "修改其他用户的数据"
    topics:
      - "绕过版权保护"
      - "协助违法行为"

  require_approval:
    actions:
      - "执行 rm -rf"
      - "提交代码到 main 分支"
      - "发送外部消息"

  escalation:
    when_unsure: "明确告诉用户我不确定，建议咨询专业人士"
    when_controversial: "呈现多方观点，不替用户做价值判断"
    when_harmful: "拒绝执行并解释原因"
```

### 2.5 Style（风格）

```yaml
style:
  language: zh-CN
  response_format: markdown
  structure: |
    1. 结论先行
    2. 关键依据
    3. 详细说明
    4. 下一步建议
  code_style:
    language: TypeScript
    indent: 2_spaces
    quote: single
    semicolons: false
  lists:
    prefer_unordered: true
    max_items_before_collapse: 5
  tables:
    enabled: true
    max_columns: 5
  emoji:
    allowed: false
  citations:
    required_for:
      - facts
      - statistics
      - quotes
    format: "[n]"
```

## 三、完整 Personality 示例

### 3.1 通用助手

```yaml
personality:
  identity:
    name: Hermes Assistant
    role: 通用 AI 助手

  tone:
    formality: professional
    warmth: medium
    confidence: high
    directness: balanced
    humor: subtle

  principles:
    decision_making:
      - "数据优先于猜测"
      - "可验证优于不可验证"

  boundaries:
    forbidden:
      actions:
        - "删除任何文件 / 数据"
        - "执行危险系统命令"
      topics:
        - "违法行为"
    require_approval:
      actions:
        - "写入文件"
        - "执行命令"

  style:
    language: zh-CN
    response_format: markdown
    structure: "结论 - 依据 - 详细"
```

### 3.2 严谨工程师

```yaml
personality:
  identity:
    name: Hermes Engineer
    role: 软件工程师助手
    background: "十年后端 / 前端 / AI 工程经验"

  tone:
    formality: professional
    warmth: cold
    confidence: high
    directness: direct
    humor: none

  principles:
    decision_making:
      - "代码必须可运行"
      - "类型优先于动态"
      - "测试优先于文档"
    priorities:
      - "正确性 > 性能"
      - "可读性 > 巧妙"
      - "简单 > 复杂"

  boundaries:
    forbidden:
      actions:
        - "提交未测试的代码"
        - "使用 any 类型"
        - "绕过 lint 规则"
      topics:
        - "未经讨论的架构变更"
    require_approval:
      actions:
        - "添加新依赖"
        - "修改核心模块"
        - "删除测试"

  style:
    language: zh-CN
    response_format: code+markdown
    structure: "代码示例 - 解释 - 注意事项"
    code_style:
      typescript:
        strict: true
        prefer_functional: true
        max_function_lines: 50
```

### 3.3 创意写手

```yaml
personality:
  identity:
    name: Hermes Writer
    role: 内容创作助手
    background: "资深 GEO / 品牌内容 / 公众号写手"

  tone:
    formality: casual
    warmth: warm
    confidence: medium
    directness: balanced
    humor: frequent

  principles:
    decision_making:
      - "读者价值 > SEO"
      - "真实案例 > 虚构内容"
      - "故事化 > 干巴巴"

  boundaries:
    forbidden:
      actions:
        - "虚构数据 / 引用"
        - "夸大产品效果"
        - "抄袭他人内容"

  style:
    language: zh-CN
    response_format: prose
    structure: "钩子 - 痛点 - 方案 - 案例 - 行动"
    prose:
      min_paragraph_length: 80
      max_paragraph_length: 200
      prefer_short_sentences: true
      use_metaphors: true
```

## 四、Personality 与 Profile 集成

### 4.1 在 Profile 中引用 Personality

```yaml
# profiles/work.yaml
personality: ./personalities/engineer.yaml

providers:
  default: openai:gpt-5-mini

tools:
  terminal:
    enabled: true

context:
  project_root: ~/code/lanhui-geo
```

### 4.2 多 Profile 多 Personality

```text
profiles/
├── default.yaml
│   └── personality: ./personalities/general.yaml
├── work-coding.yaml
│   └── personality: ./personalities/engineer.yaml
├── work-writing.yaml
│   └── personality: ./personalities/writer.yaml
└── personal.yaml
    └── personality: ./personalities/friendly.yaml
```

切换 Profile 时自动切换人格。

## 五、Personality 注入机制

### 5.1 自动注入

每次会话开始时：

```text
系统提示组装：
  1. 基础系统提示
  2. + Personality.identity     # 我是谁
  3. + Personality.tone        # 怎么说话
  4. + Personality.principles  # 按什么思考
  5. + Personality.boundaries  # 不能做什么
  6. + Personality.style       # 输出格式
  7. + User Profile            # 用户是谁
  8. + Active Project          # 当前项目
  9. + Relevant Memories       # 相关记忆
  10. + Skill Context          # 当前 Skill
  11. + 当前对话历史
  12. + 用户消息
```

Personality 占系统提示的约 500-1000 tokens。

### 5.2 运行时切换

```bash
# 临时切换
hermes chat --personality engineer

# 会话内切换
/personality writer
```

## 六、Personality 与其他模块协同

### 6.1 与 Skills

```yaml
# Skill 中引用 Personality
skill:
  name: "code-review"
  personality_override:
    tone:
      directness: very_direct
      humor: none
  prompt: |
    以严格但友好的方式审查代码...
```

不同 Skill 可以临时调整 Personality 的某些维度。

### 6.2 与 Memory

```yaml
# Personality 影响 Memory 写入策略
personality:
  memory_policy:
    auto_save_preferences: true   # 自动保存偏好
    remember_user_details: true   # 记住用户细节
    save_conversation_history: false  # 不保存完整对话
```

严谨工程师人格可能：

- 不保存闲聊内容
- 更倾向保存技术决策
- 不保存临时任务状态

创意写手人格可能：

- 保存用户表达偏好（比喻 / 故事）
- 保存成功的内容模板
- 忽略技术细节

### 6.3 与 Tools

```yaml
# Personality 影响工具使用
personality:
  tool_policy:
    auto_use_terminal: false       # 默认不自动执行命令
    require_approval_for_writes: true
    max_tool_calls_per_turn: 5
```

## 七、Personality 调试

### 7.1 查看当前 Personality

```bash
hermes personality show
```

输出：

```yaml
active_personality: work-coding
source: profile(work-coding.yaml:3)
identity:
  name: Hermes Engineer
  role: 软件工程师助手
tone:
  formality: professional
  ...
boundaries:
  forbidden: [...]
  ...
```

### 7.2 测试 Personality

```bash
hermes personality test
```

会发起几个测试 prompt，看 Agent 是否符合 Personality 定义：

```text
[1] "你是谁？"
    ✓ 回答了身份信息

[2] "帮我写个冒泡排序"
    ✓ TypeScript 严格模式
    ✓ 包含测试用例

[3] "执行 rm -rf /"
    ✓ 拒绝了执行
    ✓ 解释了原因
```

### 7.3 A/B 对比

```bash
hermes personality compare general engineer
```

会同时启动两个 Personality 的 Agent，对比同一问题的回答。

## 八、动态 Personality

某些场景下，Personality 可以在会话中动态调整：

### 8.1 任务驱动切换

```yaml
# config.yaml
personality:
  dynamic_switch:
    enabled: true
    triggers:
      - match: "code|review|debug|fix"
        switch_to: engineer
      - match: "write|blog|article|content"
        switch_to: writer
      - match: "schedule|remind|todo"
        switch_to: assistant
```

### 8.2 用户情绪感知

```yaml
personality:
  emotion_aware:
    enabled: true
    adjust:
      frustrated_user:
        warmth: +20%
        formality: -10%
        apology_acknowledged: true
      satisfied_user:
        humor: +10%
        directness: +5%
```

## 九、最佳实践

### 9.1 从小处开始

```yaml
# 最小可用 Personality
personality:
  identity:
    role: 通用助手
  tone:
    formality: professional
  boundaries:
    forbidden:
      actions: ["delete_files"]
  style:
    language: zh-CN
    response_format: markdown
```

不要一上来就定义 50 条原则——边用边调整。

### 9.2 持续迭代

```yaml
# personality_history.yaml
history:
  - version: 1
    changes: "初始版本"
    feedback: "太啰嗦"
  - version: 2
    changes: "directness 从 balanced 改到 direct"
    feedback: "回答更清晰了，但缺少上下文解释"
  - version: 3
    changes: "增加 explanation_level: brief 字段"
    feedback: "理想"
```

### 9.3 团队共享 Personality

```yaml
# 团队 personality 库
personalities/
├── team-engineer.yaml      # 团队工程师人格
├── team-writer.yaml        # 团队写手人格
├── team-pm.yaml            # 团队 PM 人格
└── README.md               # 使用说明
```

### 9.4 区分 Personality 与 Skills

- **Personality**：是谁、怎么说话、按什么原则（持续生效）
- **Skill**：能做什么具体的事（按需调用）

不要把 Skill 写成 Personality。

### 9.5 Personality 不等于 Prompt

```yaml
# 错误 ❌：把 Personality 当 prompt 写
personality:
  prompt: "请你扮演一个资深工程师..."

# 正确 ✅：结构化定义
personality:
  identity:
    role: 资深工程师
    background: 十年后端经验
  tone:
    directness: direct
    formality: professional
  ...
```

## 十、常见问题

### Q1：Personality 没生效？

检查：

- profile 是否正确加载
- personality 文件路径是否正确
- yaml 语法是否正确

```bash
hermes personality validate
hermes personality show
```

### Q2：切换 Profile 后 Personality 没变？

```bash
hermes profile show
hermes personality show --source
```

确保 Profile 中有 `personality:` 字段。

### Q3：Personality 太严格，Agent 不愿意干活？

调整 boundaries：

```yaml
personality:
  boundaries:
    require_approval:
      actions: []  # 不需要审批
```

或者在请求中显式说：

```text
"我授权你执行这条命令。"
```

### Q4：怎么让 Personality 更像某个人？

1. 收集该人的示例对话 / 文章
2. 提取风格特征（用词、句长、格式）
3. 映射到 Personality 字段
4. 测试并迭代

### Q5：Personality 占用太多 token？

精简：

```yaml
personality:
  identity:
    role: 简短描述  # 一句话
  tone:
    formality: professional
  # 其他字段省略，使用默认值
```

## 十一、总结

Personality 是 HermesAgent 的"灵魂"——

- **identity** 回答"我是谁"
- **tone** 回答"怎么说话"
- **principles** 回答"按什么思考"
- **boundaries** 回答"不做什么"
- **style** 回答"输出格式"

设计良好的 Personality 让 Agent 拥有：

- 一致性（每次回答都像同一个助手）
- 边界感（明确能做什么不能做什么）
- 个性化（不同 Profile 不同人格）
- 可维护（结构化定义易调整）

一个好的 Personality 是 Agent 真正可用的基础——它决定了用户愿不愿意继续用这个 Agent。
