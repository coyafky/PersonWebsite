# Work Journal Skill — 设计文档

> 日期：2026-08-10
> 状态：已确认（Coya 批准）
> 目标产物：Alma 的 `work-journal` SKILL + 两个 CRON 定时任务，把 PersonalWebsite 变成 Alma 的日常工作台

---

## 1. 背景与目标

Coya 把 PersonalWebsite 定位为 **Alma 的多项目工作台**：Alma 每天在多个对话里帮 Coya 干活（AI 视频体系、Hermes、官网、学习体系…），这些工作内容需要被**每日自动整理成 markdown**，并在**每周日自动汇总成周记**。

目标：
1. 每日 22:00 自动整理当天工作内容 → `content/inbox/logs/YYYY-MM-DD.md`（周记素材）
2. 每周日 21:00 自动汇总本周 → `content/weekly/YYYY-WNN.md`（draft，守红线）
3. 全程 Alma 自主完成，不打扰 Coya，产出物在项目文件树可见

## 2. 核心设计决策

### 2.1 数据源四层（以「对话总结」为主，非从零提取）⭐ Coya 拍板

**验证结论（2026-08-10 实测）**：Alma 在各对话里做的总结已经沉淀为 memory 笔记，质量最高，应作为主数据源。活动记录只做查漏补缺。

| 层 | 数据源 | 命令 | 角色 |
|----|--------|------|------|
| L1 主源 | 当日 memory 笔记 | 读 `~/.config/alma/memory/YYYY-MM-DD.md` | 各对话沉淀的总结，最全最新鲜 |
| L2 补充 | daily-report 产物 | 读 `~/.config/alma/memory/YYYY-MM-DD-daily-report.md` | LittleBird 风格按项目分组的日报 |
| L3 兜底 | 屏幕活动记录 | `alma activity report today` | 查漏补缺，L1/L2 未覆盖的内容 |
| L4 原文 | 对话检索 | `alma thread search "<关键词>"` + `alma thread messages <id>` | 提取 L1/L2 里没写清的细节 |

提取优先级：**L1 → L2 → L3 → L4**，前层有的内容不重复取，L4 只在需要补细节时用。

### 2.2 产物位置与格式

**每日文件**：`content/inbox/logs/YYYY-MM-DD.md`（走现有 inbox→weekly 工作流，周记直接引用）

```markdown
---
date: "YYYY-MM-DD"
summary: "一句话总结今天"
tags: [daily, work]
---

## 项目/主题一
- 做了什么（含产出物路径 / 决策 / 数据）

## 项目/主题二
...

## 关键决策
| 决策 | 理由 |

## 待办 / 下一步
- [ ] ...
```

**周记文件**：`content/weekly/YYYY-WNN.md`（完全套用 `docs/agent/weekly-template.md` 模板，`status: draft`）

### 2.3 红线

- 周记永远 `status: draft`，Coya 手动改 published（项目铁律，Agent 不自动发布）
- 同名 daily 文件已存在 → 跳过不覆盖（防重复、保护手改内容）
- 数据为空 → 写"今日暂无记录"占位，绝不硬编虚构
- 不删任何内容文件、不动 schemas.ts / design token / MDX 注册表

### 2.4 周日记覆盖策略

周日 21:00 跑周记时，周日当天的 daily（22:00 才生成）还没出：
- 聚合「周一 ~ 周六的 daily 文件」+「周日 0:00~21:00 的 activity report 实时数据」
- 周日晚的 daily 照常 22:00 生成，补全留存（下周回顾时能看到完整周日）

### 2.5 CRON 配置

```bash
# 每日整理（isolated 模式，不打扰主对话）
alma cron add "daily-work-journal" cron "0 22 * * *" \
  --timezone Asia/Shanghai --mode isolated \
  --prompt "运行 work-journal skill 的 daily 模式：整理今天的工作内容为 markdown，写入 PersonalWebsite 项目 content/inbox/logs/（文件名为今天日期）。数据源按优先级：①~/.config/alma/memory/YYYY-MM-DD.md ② daily-report 产物 ③ alma activity report today ④ thread search 补细节。"

# 周日周记（isolated 模式）
alma cron add "weekly-review" cron "0 21 * * 0" \
  --timezone Asia/Shanghai --mode isolated \
  --prompt "运行 work-journal skill 的 weekly 模式：聚合本周 daily 记录（周一~周六文件 + 周日实时活动）生成周记草稿，按 weekly-template 模板写入 content/weekly/YYYY-WNN.md，status: draft，不发布。"
```

## 3. SKILL 架构

```
~/.config/alma/skills/work-journal/SKILL.md   # Alma 全局能力（跨项目可用）
├── daily 模式   # 每日 22:00
├── weekly 模式  # 周日 21:00
└── 数据管道（两模式共用）
```

SKILL 本体放全局（`~/.config/alma/skills/`），因为它是 Alma 工作台能力、要从多个项目的对话取数。项目内留档：
- `docs/agent/work-journal-skill.md`（SKILL 副本，Coya 在文件树可见）
- ALMA.md「Alma 能做什么」章节补充说明

### 3.1 daily 模式管道

```
1. 计算日期（今天）→ 目标路径 content/inbox/logs/YYYY-MM-DD.md
2. 防重复：文件已存在且有内容 → 跳过并通知
3. L1：读 memory 笔记（若存在）
4. L2：读 daily-report 产物（若存在）
5. L3：alma activity report today（查漏补缺）
6. L4：按需 thread search 补细节（L1/L2 缺失的项目名/产出物）
7. 合成：按项目/主题分组 → 写文件（轻量 frontmatter + 分组正文 + 决策表 + 待办）
8. 自检：frontmatter 字段完整（date/summary/tags）
```

### 3.2 weekly 模式管道

```
1. 计算本周（date +%G-W%V → YYYY-WNN）→ 目标 content/weekly/YYYY-WNN.md
2. 收集本周周一~周六的 daily 文件（content/inbox/logs/ 按 date frontmatter 过滤）
3. 补充：本周 activity report 汇总 + 周日 0:00~21:00 实时数据
4. 按 weekly-template.md 模板聚合：
   - frontmatter: title/week/date/summary/highlights/tags/mood/englishSummary
   - 正文: 本周完成 / 学到什么 / 遇到的问题 / 下周计划
5. 写文件，status: draft
6. 自检：week 字段符合 ^\d{4}-W\d{2}$；highlights 非空
```

## 4. 容错与质量

| 场景 | 处理 |
|------|------|
| L1~L3 全空 | 写"今日暂无记录"占位 + 提示 Coya 可手动补充 |
| 同 slug 周记已存在 | 跳过，提示已生成 |
| 周记 schema 校验失败 | 不写文件，报告错误（draft 校验不炸站） |
| activity report 超时/失败 | 静默降级到 L1/L2 |
| 周日周记缺某天 daily | 用该天 activity report 数据补齐 |

验证命令：`npm run typecheck`（SKILL 本身是 markdown 不影响构建，但每日/周记产物需符合 schema）。

## 5. 交付清单

1. `~/.config/alma/skills/work-journal/SKILL.md` — SKILL 本体（daily + weekly 模式完整指令）
2. `alma cron add daily-work-journal` — 每日 22:00
3. `alma cron add weekly-review` — 周日 21:00
4. `docs/agent/work-journal-skill.md` — 项目内留档副本
5. ALMA.md 更新 — 记录工作台定位与新能力

## 6. 验收标准

- [ ] 手动跑一次 daily 模式 → `content/inbox/logs/2026-08-10.md` 生成，内容按项目分组、来自今日真实工作
- [ ] 手动跑一次 weekly 模式 → `content/weekly/2026-W33.md` 生成，status: draft，套 weekly 模板
- [ ] 两个 CRON 在 `alma cron list` 可见、时间正确、isolated 模式
- [ ] 重复运行不覆盖已有文件
- [ ] 项目文档（docs/agent + ALMA.md）留档完成
