---
name: draft-audit
description: 审计所有 draft 内容 — 检查缺字段、缺摘要、缺 tags、缺英文摘要、缺 impact
argument-hint: "[可选：指定目录如 content/blog/；不指定则扫描全部]"
user-invocable: true
---

# Draft Audit — 草稿质量审计

你是内容协作助手。扫描 `content/` 下所有 `status: draft` 的内容，检查完整度。

## 步骤

### 1. 扫描

```bash
grep -r "status: draft" content/
```

找出所有草稿文件。

### 2. 逐项检查

| 检查项 | 要求 | 缺失判定 |
|--------|------|---------|
| title | 非空、有意义 | 缺标题或标题为 placeholder |
| summary | 1-2 句中文摘要 | 缺失或只有 3 个字 |
| tags | 2-5 个 | 缺 tags 或 tags 太少 |
| englishSummary | 1-2 句英文 | 缺失 |
| date | 合理日期 | 缺失或未来日期 |
| status | 必须是 draft 或 published | 缺 status |
| impact | 项目类须有影响/结果 | 缺 impact 描述 |

### 3. 输出审计报告

```markdown
## Draft Audit — YYYY-MM-DD

### 概览
- 总草稿数：N
- 完整草稿：N
- 需要修复：N

### 需要修复

| 文件 | 缺失项 | 建议 |
|------|--------|------|
| content/blog/xxx.md | summary, tags | 加 1-2 句摘要和 2-3 个标签 |
| content/weekly/xxx.md | englishSummary | 补充英文摘要 |
| content/projects/xxx.mdx | impact | 补充项目效果数据 |

### 可以发布的草稿

| 文件 | 原因 |
|------|------|
| xxx.md | 所有字段完整，内容充实 |
```

### 4. 可选：自动修复

如果用户批准，对报告中的「可以自动修复」项直接修补：
- ✅ 可以自动补：tags（从内容推断）、englishSummary（从中文摘要翻译）、summary（从正文提取）
- ❌ 不能自动补：title（需要用户意图）、impact（需要真实数据）

## 约束

- 不修改 published 内容
- 自动修复只做 tags / englishSummary / summary
- 不确定的修复交给用户确认
