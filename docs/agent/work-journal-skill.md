---
name: work-journal
description: Alma 的多项目工作日志技能。每日自动整理当天工作内容为 markdown（写入 PersonalWebsite 的 content/inbox/logs/），每周日自动聚合本周记录生成周记草稿（content/weekly/，status: draft）。数据源以「各对话沉淀的 memory 笔记」为主，活动记录查漏补缺。触发词：今日工作日志、每日整理、周记、work journal、daily journal。
---

# Work Journal — Alma 的工作日志

把 Alma 在多个对话/项目里干过的活，自动沉淀为「每日记录 + 每周周记」，输出到 PersonalWebsite 项目（Coya 的多项目工作台）。

## 何时使用

- **daily 模式**：CRON `daily-work-journal`（每日 22:00 Asia/Shanghai）触发，或 Coya 说"整理今天的工作日志"
- **weekly 模式**：CRON `weekly-review`（周日 21:00 Asia/Shanghai）触发，或 Coya 说"写周记"

## 数据源（按优先级，前层有内容就不取后层）

| 优先级 | 数据源 | 获取方式 |
|--------|--------|---------|
| L1 主源 | 当日 memory 笔记 | 读 `~/.config/alma/memory/YYYY-MM-DD.md` |
| L2 补充 | daily-report 产物 | 读 `~/.config/alma/memory/YYYY-MM-DD-daily-report.md` |
| L3 兜底 | 屏幕活动记录 | `alma activity report today`（daily）/ `alma activity report <日期>`（weekly 逐天） |
| L4 原文 | 对话检索 | `alma thread search "<关键词>"` + `alma thread messages <threadId>` 补细节 |

> 原则：**总结优先，活动查漏**。memory 笔记是各对话里已经提炼过的内容，质量最高，绝不从零提取。

## 项目路径

- 项目根：`/Users/fkycoya/Documents/Code/PersonalWebsite`
- 每日产物：`<项目根>/content/inbox/logs/YYYY-MM-DD.md`
- 周记产物：`<项目根>/content/weekly/YYYY-WNN.md`
- 周记模板：`<项目根>/docs/agent/weekly-template.md`（必须套用）

---

## daily 模式

### 步骤

1. **算日期**：`date +%F` → `YYYY-MM-DD`；目标文件 `<项目根>/content/inbox/logs/YYYY-MM-DD.md`
2. **防重复**：若目标文件已存在且非空 → 不覆盖，提示"今日记录已存在"，结束
3. **取 L1**：读 `~/.config/alma/memory/YYYY-MM-DD.md`（可能不存在，跳过）
4. **取 L2**：读 `~/.config/alma/memory/YYYY-MM-DD-daily-report.md`（可能不存在，跳过）
5. **取 L3**：`alma activity report today`（L1/L2 已覆盖的内容跳过；只补 L1/L2 没有的项目/事件）
6. **取 L4（按需）**：若 L1~L3 里某项目信息不全（缺产出物路径/决策/数据），用 `alma thread search` 找到相关对话，`alma thread messages <id>` 补细节
7. **合成**：按项目/主题分组写文件（格式见下）
8. **自检**：frontmatter 必含 `date` `summary` `tags`；正文至少有一个项目分组

### 每日文件格式

```markdown
---
date: "YYYY-MM-DD"
summary: "一句话总结今天（哪个项目/什么主题）"
tags: [daily, work]
---

## 项目/主题一
- 做了什么（含产出物路径 / 决策 / 数据）
- 关键进展：...

## 项目/主题二
- ...

## 关键决策
| 决策 | 理由 |

## 待办 / 下一步
- [ ] ...
```

### 内容纪律

- 每条 3-10 句，写"做了什么 + 产出物 + 决策"，不写流水账废话
- 项目名用真实名称（AI-Video / Hermes / Lanhui-web / PersonalWebsite / learning-path…）
- 事实来自数据源，**绝不编造**；来源缺失就标"（待补充）"

---

## weekly 模式

### 步骤

1. **算周**：`date +%G-W%V` → `YYYY-WNN`（如 2026-W32）；目标 `<项目根>/content/weekly/YYYY-WNN.md`
2. **防重复**：若目标已存在 → 跳过，提示"本周周记已生成"
3. **取本周 daily**：读 `content/inbox/logs/` 下所有文件，过滤 `date` frontmatter 属于本周（周一 00:00 ~ 周日 24:00）的
4. **补周日**：周日的 daily 周日 22:00 才生成，而周记 21:00 跑 → 用 `alma activity report today` 实时取周日当天内容
5. **补全周**：缺某天的 daily 时，用 `alma activity report <该日期>` 补齐该天要点
6. **聚合**：按 `docs/agent/weekly-template.md` 模板生成周记（frontmatter + 四个正文 section）
7. **写文件**：`status: draft`（铁律：不发布，Coya 手动改 published）
8. **自检**：`week` 字段匹配 `^\d{4}-W\d{2}$`；`highlights` 至少 1 条；正文四节齐全

### 周记模板（对齐 docs/agent/weekly-template.md）

```markdown
---
title: "YYYY WNN 周记"
week: "YYYY-WNN"
date: "YYYY-MM-DD"
summary: ""
highlights:
  - ""
tags:
  - weekly
status: draft
mood: ""
englishSummary: ""
---

## 本周完成

-

## 学到什么

-

## 遇到的问题

-

## 下周计划

-
```

### 聚合纪律

- 本周完成：按项目分点，每条注明产出物（文件/URL/数据）
- 学到什么：本周新掌握的概念/工具/方法论
- 遇到的问题：卡点 + 怎么解的（或还卡着）
- 下周计划：从各天 daily 的"待办"里汇总
- highlights：本周 2-4 个亮点，一句话一个
- englishSummary：英文一句话（发布时对 SEO 有用）

---

## 红线（与 AGENT.md 一致）

1. 周记永远 `status: draft` —— **Agent 永不自动发布**
2. 不覆盖已存在的 daily/周记文件
3. 不删、不改任何已有内容文件
4. 不动 schemas.ts / globals.css design token / mdx-content.tsx 注册表 / 不加 npm 依赖
5. 事实不编造，来源缺失就标注
6. 提交代码走分支（feat/ 前缀），不直接改 main

## 容错

| 场景 | 处理 |
|------|------|
| L1~L3 全空 | 写"今日暂无记录"占位 + 提醒 Coya 可手动补充 |
| activity report 失败 | 静默降级，只用 L1/L2 |
| 周记缺某天 | 用该天 activity report 补齐，再不行留空标注 |
| 产物校验失败 | 不写文件，报告错误 |

## 验证

- daily/weekly 产物是 markdown，不影响构建；内容 frontmatter 需符合项目 schema（学习/周记/博客各自要求）
- 生成后检查：文件存在、frontmatter 完整、无空分组
