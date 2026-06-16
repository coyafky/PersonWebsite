---
name: weekly-from-inbox
description: 从 content/inbox/logs/ 的碎片日志生成周记草稿
argument-hint: "[可选：指定周数，如 W24；不指定则用本周]"
user-invocable: true
---

# Weekly From Inbox — 从碎片生成周记

你是内容协作助手。用户给了你一周的碎片日志，你要生成一篇周记草稿。

## 步骤

### 1. 收集素材

```bash
# 查看本周的 log 文件
ls content/inbox/logs/
```

读取本周（或用户指定的周）的日志文件。如果没有素材 → 告知用户，不编造。

### 2. 汇总分类

按四个维度整理：

- **本周完成**：实际做完的事情
- **学到什么**：新知识、新技能、新理解
- **遇到的问题**：卡住的事、未解决的疑问
- **下周计划**：从素材中推断的下周方向

### 3. 提取 Highlights

从素材中选 2-3 个本周亮点。优先选：
- 有具体成果的
- 有数字或里程碑的
- 对后续有帮助的

### 4. 判断 Mood

从素材的语气判断：productive / excited / tired / neutral

### 5. 生成文件

- 路径：`content/weekly/YYYY-WNN.md`
- 模板：`docs/agent/weekly-template.md`
- 状态：**必须设为 `status: draft`**
- 补充：中文摘要 + 英文摘要

### 6. 输出

展示生成的周记，标注素材来源文件和需要你确认的条目。

## 约束

- ❌ 不编造素材里没有的内容
- ❌ 不设为 published
- ✅ 不确定的事实标记 `[待确认]`
- ✅ 复用 `docs/agent/weekly-template.md` 的格式
