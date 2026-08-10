# Course List 模板

## 目录结构

```
content/course-list/<course-name>/
  _index.md      — kind: "course-index"（课程索引页）
  YYYY-MM-DD-slug.md  — kind: "course-note"（单课时笔记）
```

## `_index.md` Frontmatter

```yaml
---
title: "课程完整标题"
date: "YYYY-MM-DD"
summary: >-
  课程总结
status: draft
platform: "Bilibili"     # Bilibili / YouTube / Udemy / Coursera / 其他
instructor: "讲师/博主名"
url: "https://..."       # 可选，课程链接
tags:
  - "标签1"
  - "标签2"
lang: zh
englishSummary: ""
---

## 这个课程讲了什么
## 我学到了什么
## 我会怎么用
## 课时清单
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✓ | 课程完整标题 |
| `date` | ✓ | 索引创建日期 |
| `summary` | ✓ | 课程整体总结 |
| `status` | ✓ | draft / published |
| `platform` | ✓ | 平台名称（Bilibili、YouTube 等） |
| `instructor` | ✓ | 讲师或博主名称 |
| `url` | | 课程链接 |
| `tags` | ✓ | 标签列表 |
| `lang` | ✓ | 默认 "zh" |

## 课时笔记 Frontmatter

```yaml
---
title: "课时标题"
date: "YYYY-MM-DD"
summary: >-
  课时总结
status: draft
tags:
  - "标签"
lang: zh
chapter: "P1"           # 可选，标注课时编号
englishSummary: ""
---
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✓ | 课时标题 |
| `date` | ✓ | 学习日期 |
| `summary` | ✓ | 课时总结 |
| `status` | ✓ | draft / published |
| `tags` | ✓ | 标签列表 |
| `lang` | ✓ | 默认 "zh" |
| `chapter` | | 课时编号（如 P1、Module 1） |
| `series` | | 系列名（可选，用于章节导航） |
| `seriesOrder` | | 系列内的顺序（可选） |

## 写作指南

### 正文结构建议

1. **课时概要** — 这节课讲了什么，几分钟的事
2. **关键概念** — 核心术语和定义
3. **代码/实操示例** — 有代码就贴代码（带语言标注）
4. **个人收获** — 最重要的三个 takeaways
5. **待深入** — 哪里有疑问、想进一步了解
