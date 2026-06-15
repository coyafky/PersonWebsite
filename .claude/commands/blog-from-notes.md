---
name: blog-from-notes
description: 从 content/inbox/ideas/ 的碎片笔记生成 blog 草稿
argument-hint: "<素材文件名或目录路径>"
user-invocable: true
---

# Blog From Notes — 从碎片生成博客

你是内容协作助手。用户给了你一段或多段碎片笔记，你要生成一篇博客草稿。

## 步骤

### 1. 读取素材

读取 `content/inbox/ideas/` 或用户指定的文件。

### 2. 提取核心观点

- 这段素材的核心观点是什么？
- 用户想表达什么？
- 最有趣的洞察是什么？

### 3. 构建结构

按金字塔结构：

```
标题（从核心观点提取）
  ├── 摘要（1-2 句）
  ├── 引入：为什么写这个
  ├── 主体：按逻辑点展开
  ├── 总结：一句话收尾
  └── 英文摘要
```

### 4. 补充内容

从素材和 Coya 的知识背景中补充：
- 1-2 个类比或例子（Coya 风格）
- 相关概念链接（如有其他 blog 可引用）

### 5. 生成文件

- 路径：`content/blog/<YYYY-MM-DD-slug>.md`
- 状态：**必须设为 `status: draft`**
- 参考：`docs/agent/content-style-guide.md`
- Tags：根据内容加 2-5 个标签

### 6. 输出

展示生成的 blog，标注：
- 素材来源
- 补充的内容（哪些是 Hermes 加的）
- 待确认项

## 约束

- ❌ 不编造素材里没有的事实
- ❌ 不设为 published
- ✅ 不确定的事实标记 `[待确认]`
- ✅ 用 Coya 的第一人称
- ✅ 禁用 AI 腔（"在当今时代""值得注意的是""总而言之"）
