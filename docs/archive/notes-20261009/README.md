---
title: 笔记归档 2026-10-09
date: 2026-10-09
status: archived
---

# 笔记归档 2026-10-09

按用户要求，`content/notes/` 只保留 **ChatGPT Image 2** 课程（`course/gpt-image-2`），其余全部移出站点内容区。

## 归档范围

| 区域 | 文件数 | 说明 |
| --- | --- | --- |
| `book/` | 24 | 全部（designing-data-intensive-applications、skeptics-guide、understanding-ai-agent-design） |
| `topic/` | 59 | 全部（ai-image-generation、geo、hermes、nextjs、react） |
| `course/` 除 gpt-image-2 外 | 142 | ai-programming-mindset、anker-ai-panoramic-course、matt-pocock-prototype-over-spec-driven、mokio-agent-toolcall-to-claw、shangguigu-hermes-agent、vibe-coding-cn、zero-to-fullstack-ai |
| **合计** | **225** | — |

## 保留

`content/notes/course/gpt-image-2/` —— 21 个文件（20 篇讲义 + `_index.md`）。

## 迁移方式

用 `git mv` 完成，git 历史与文件身份完全保留；`git log --follow` 仍可追到每篇的原始提交。

## 对账

- 归档前 `content/notes/` 共 **246** 个文件
- 归档后：保留 **21** + 归档 **225** = **246**
- 备份 tar 内条目 **246**，与迁移后合计逐项吻合

## 回滚

```bash
BK=~/.config/alma/backups/notes-cleanup-20261009-233404
tar -xzf "$BK/content-notes-full.tar.gz" -C /   # 写回 content/notes/ 全量
```

或用 git 反向搬运：

```bash
git mv docs/archive/notes-20261009/book content/notes/book
git mv docs/archive/notes-20261009/topic content/notes/topic
git mv docs/archive/notes-20261009/course/* content/notes/course/
```

## 影响面检查

迁移前已确认：站内对这批笔记的引用全部来自构建产物（`.next/`、`rss.xml`、`feed.xml`、tag cloud、search API）与 `.alma-snapshots/`，**没有手写硬编码的链接** → 移除不会产生断链。
