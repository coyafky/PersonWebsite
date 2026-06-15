# Inbox → Content 转化工作流

> Hermes 如何从 `content/inbox/` 的碎片素材生成正式内容。

## 通用规则（所有转化适用）

### Frontmatter 补齐

Hermes 生成内容时必须补齐：

```yaml
title: ""           # 从素材提取或自拟
date: ""            # 生成日期
summary: ""         # 1-2 句中文摘要
tags: []            # 2-5 个标签
status: draft       # ⚠️ 永远默认 draft
lang: zh            # 默认中文
englishSummary: ""  # 1-2 句英文摘要
```

### 内容生成原则

- **事实 vs 推断**：素材里有的 = 事实 ✅；Hermes 合理补充的 = 需标记 `[待确认]`
- **不编造**：素材里没提到的事不自行添加
- **保留原文语气**：你是 Coya 的第一人称口吻
- **禁用 AI 腔**：不用「在当今时代」「值得注意的是」「总而言之」

---

## 链路 1：`inbox/ideas/` → `content/blog/`

### 触发条件
- 你明确说「把这些写成 blog」
- 或执行 `/blog-from-notes`

### 输入格式
- 1 个或多个 `.md` 文件
- 内容可以是一句话灵感、一段笔记、一组散点

### 输出格式
- 文件：`content/blog/<YYYY-MM-DD-slug>.md`
- 结构：标题 + 摘要 + 正文（金字塔结构：结论先行 → 展开 → 总结）
- 长度：500-2000 字

### 生成规则
1. 从素材中提取核心观点作为标题
2. 把散点按逻辑串联成段落
3. 补充 1-2 个类比或例子（如果你是 Coya 风格）
4. 标记不确定的事实为 `[待确认]`

---

## 链路 2：`inbox/logs/` → `content/weekly/`

### 触发条件
- 每周日自动检查
- 或执行 `/weekly-from-inbox`

### 输入格式
- 一周内 `logs/` 下的所有 `.md` 文件
- 每条约 3-10 句的碎片记录

### 输出格式
- 文件：`content/weekly/YYYY-WNN.md`
- 模板：`docs/agent/weekly-template.md`

### 生成规则
1. 汇总所有 log 文件的内容
2. 按「完成 / 学到 / 遇到问题 / 下周计划」分类
3. 提取 highlights（2-3 个本周亮点）
4. 填写 mood（从素材语气判断：productive/excited/tired/neutral）
5. 如果某周没有素材 → 不生成（不编造）

---

## 链路 3：`inbox/project-notes/` → `content/projects/`

### 触发条件
- 你明确说「把这个项目更新到网站」
- 或项目有明显进展后手动触发

### 输入格式
- `project-notes/` 下某个项目的笔记
- 可以是一个文件或多个碎片

### 输出格式
- 文件：`content/projects/<slug>.mdx`（新增或更新）
- 模板：`docs/agent/project-template.md`

### 生成规则
1. 如果 `content/projects/<slug>.mdx` 已存在 → 更新，不覆盖
2. 如果不存在 → 按模板新建
3. 补充 resume-ready bullets（每个项目 3-5 条）
4. 标记不确定的数据为 `[待确认]`

---

## 链路 4：`content/projects/` + `inbox/career-notes/` → `content/career/`

### 触发条件
- 执行 `/project-to-career`
- 或你明确要更新求职材料

### 输入格式
- 全部 `content/projects/` 已有内容（作为事实基础）
- `career-notes/` 里的新增素材（面试准备、技能复盘等）

### 输出格式
- 更新 `content/career/bullets.md` — 简历子弹
- 更新 `content/career/star-stories.md` — STAR 故事
- 如需要，更新 `content/career/profile.md`

### 生成规则
1. **bullets**：从每个项目中提取 3-5 条，格式「做了什么 → 用什么 → 效果」
2. **STAR**：从项目笔记中识别完整叙事（情境 → 任务 → 行动 → 结果）
3. **Profile**：当技能栈或定位有变化时更新
4. 所有子弹 **必须** 追溯到具体项目或周记
5. 没有证据支撑的子弹标记 `[待确认]`

---

## 链路 5：`inbox/ai-notes/` → `content/ai-tracker/`

### 触发条件
- 你明确说「把这个记到 AI Tracker」
- 或执行 `/ai-tracker-from-inbox`

### 输入格式
- `content/inbox/ai-notes/` 下单个或多个 `.md` 碎片
- 可以是论文速记、产品 demo 笔记、播客记录、趋势想法

### 输出格式
- 文件：`content/ai-tracker/<YYYY-MM-DD-slug>.md`
- 模板：`docs/agent/ai-tracker-template.md`
- 状态：默认 `status: draft`

### 生成规则
1. 选 `sourceType` 枚举（paper / product / model / agent / tool / article / video / podcast / discussion / other）
2. 选 `signal`（1=存档 / 2=参考 / 3=高价值），不确定时用 2 并标 `[待确认]`
3. 选 `topics`（2-4 个粗分类，对齐 `content/ai-tracker/` 现有风格）
4. 提取 `tags`（2-5 个细标签）
5. 写 `takeaways`（3-5 条 Coya 第一人称要点）
6. 写 `questions`（2-3 条未解）
7. 自动填 `englishSummary`（1-2 句英文）
8. 可选 `relatedPosts`（跨集合 slug，Coya 手动确认）

