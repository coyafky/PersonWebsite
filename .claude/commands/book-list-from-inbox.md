---
name: book-list-from-inbox
description: 从 content/inbox/book-notes/ 的读书碎片生成 book-list 草稿
argument-hint: "<素材文件名或目录路径>"
user-invocable: true
---

# Book List From Inbox — 从碎片生成读书笔记

你是内容协作助手。用户给了你一段或多段读书碎片笔记(单本书的速记 / 多本书的零散想法),你要生成 Book List 草稿。

## 目录结构（v0.4）

每本书是一个子目录，含 `_index.md`（书籍介绍）+ N 篇笔记 `.md`：

```
content/book-list/<book-name>/
├── _index.md          # 书籍索引页（kind: book-index）
└── <date>-<slug>.md   # 章节/主题笔记（kind: book-note）
```

## 步骤

### 1. 读取素材

读取 `content/inbox/book-notes/` 或用户通过参数指定的文件。

### 2. 识别这是一本还是多本

- 如果所有素材 `tags` 一致(同一本书) → 合并为 1 本书
- 如果素材分散多本书 → 询问 Coya 要先整理哪本

### 3. 确定 book-name

- book-name 用英文小写连字符（如 `designing-data-intensive-applications`）
- 中文书名用拼音（如 `shen-ru-li-jie-ji-suan-ji-xi-tong`）
- 检查 `content/book-list/<book-name>/` 是否已存在：
  - 已存在：追加新笔记到该目录下
  - 不存在：创建目录 + `_index.md`

### 4. 提取基本信息

从素材中识别:
- 书名(中文优先,如无则英文)
- 作者全名
- 类别(`genre` 枚举见模板)
- 读完后起的中文短名(`title`,≤20 字)

### 5. 选 genre

从模板的 `genre` 枚举中选 1 个。不确定时用 `其他` 并标 `[待确认]`,由 Coya 决定。

### 6. 提取 tags

- 2-5 个细粒度标签
- 概念而非形容词(用 `注意力` 不用 `重要的`)
- 中英混排时优先用英文专有名词

### 7. 写索引页正文 4 段

- **这本书讲了什么** — 2-4 段,客观描述核心论点
- **我学到了什么** — 3-5 条 Coya 第一人称 takeaways,Hermes 推断的标 `[待确认]`
- **我会怎么用** — 1-3 条具体可执行的改变
- **引用与摘录** — 1-5 条原文摘录,标注章节或页码(如有)

### 8. 写 summary

- 1-2 句中文,**讲清楚为什么值得读**
- 不要写"这是关于 X 的书"这种空话
- 不要照抄"我学到了什么"的第一条

### 9. 自动填 englishSummary

- 1-2 句英文摘要,与 `summary` 语义一致
- 风格保持 Coya 口吻(简洁、第一人称)

### 10. 写 frontmatter（_index.md）

必填:`title` / `date` / `summary` / `status: draft` / `author` / `genre` / `tags` / `lang: zh` / `englishSummary`

### 11. 生成文件

- **索引页**：`content/book-list/<book-name>/_index.md`
  - `status: draft` 永远默认
- **笔记**（如有拆分）：`content/book-list/<book-name>/<YYYY-MM-DD-slug>.md`
  - 文件名 `<slug>` 建议：英文小写连字符

### 12. 输出

展示生成的内容卡片,标注:
- 素材来源文件(原始 inbox 路径)
- 哪些字段是 Hermes 推断的(应标 `[待确认]`)
- 待 Coya 确认/补全的项(尤其是 `genre` / `title` 短名)
- 引用与摘录的来源章节/页码是否齐全

## 约束

- ❌ 不编造素材里没有的事实
- ❌ 不设为 `published`
- ❌ 不擅自把 `genre` 强行归入窄类 — 拿不准用 `其他` 并标 `[待确认]`
- ❌ 不要重复生成 — 同一本书的目录已存在时,先问 Coya 是更新 `_index.md` 还是追加新笔记
- ✅ 不确定的字段标 `[待确认]`
- ✅ 用 Coya 第一人称
- ✅ 禁用 AI 腔("在当今时代" / "值得注意的是" / "总而言之")
- ✅ 字段缺失时提示用户补全,不要硬猜
- ✅ 完成后让 Coya 手动审阅 `genre` / `title` / `summary` / 引用来源
