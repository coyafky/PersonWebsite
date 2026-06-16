# Hermes 使用指南 — 个人网站内容协作

> 以后你负责丢素材，Hermes 负责整理成正式内容。这份指南告诉你具体怎么配合。

---

## 一句话总结这个系统

```
你 → 把想法/记录/笔记丢进 content/inbox/
    → Hermes 定期扫描 → 生成 draft 到 content/blog/ weekly/ projects/ career/
    → 你 review → 满意了就改 status: published
```

---

## 你应该往哪里放东西？

| 你在想什么 | 丢到哪里 | 粒度 | 示例 |
|-----------|---------|------|------|
| 「想写一篇关于 XX 的文章」 | `inbox/ideas/` | 1-5 句 | 「想写轮毂入门，用购物车解释 Scrub Radius」 |
| 「今天做了 XX」 | `inbox/logs/` | 每条约 3-10 句 | 「上午：学了轮毂参数体系」 |
| 「项目上踩了个坑」 | `inbox/project-notes/` | 每次推进一个文件 | 「PPF 知识库今天出现了数据重复问题」 |
| 「这个经验可以放简历」 | `inbox/career-notes/` | 每条事实一段 | 「用 Agent Team 架构完成了 16 个文件的轮毂学习包」 |

**关键**：不需要格式，不需要 frontmatter，不需要完整句子。你写一句话都行。

---

## Hermes 会把这些变成什么？

| 你丢的 | 变成什么 | 什么时候变 |
|--------|---------|-----------|
| `inbox/ideas/` 里的碎片 | `content/blog/<slug>.md` | 你说「把这些写成博客」或执行 `/blog-from-notes` |
| `inbox/logs/` 一周的记录 | `content/weekly/YYYY-WNN.md` | 每周日自动或你执行 `/weekly-from-inbox` |
| `inbox/project-notes/` 的笔记 | `content/projects/<slug>.mdx` | 你说「更新项目页」 |
| 项目 + `career-notes/` | `content/career/bullets.md` 等 | 执行 `/project-to-career` |

---

## 你审核时看哪些地方？

Hermes 生成的内容默认都是 **draft**，不会自动发布。审核时看：

1. **标题和摘要** — 准确反映你的意思吗？
2. **事实准确性** — Hermes 有没有编造你没说过的事？（标记了 `[待确认]` 的要特别注意）
3. **语气** — 听起来像你写的吗？
4. **Tags** — 分类合理吗？
5. **英文摘要** — 语法和意思对吗？

审核通过后 → 把 `status: draft` 改成 `status: published`。

---

## 你如何控制哪些内容能发布？

```
status: draft      → 只有你能看到（不进入公开页面）
status: published  → 对外公开
```

- 你**不需要**告诉 Hermes「这篇可以发了」
- 你只需要自己动手把 status 改成 `published`
- Hermes 永远不会主动改你的 status

---

## 四个常用命令

| 命令 | 做什么 |
|------|--------|
| `/weekly-from-inbox` | 从 `inbox/logs/` 生成周记 |
| `/blog-from-notes` | 从 `inbox/ideas/` 生成博客 |
| `/project-to-career` | 从项目提炼简历材料 |
| `/draft-audit` | 检查所有 draft 是否缺字段 |

---

## 典型一周的配合流程

```
周一~周五：
  你 → 随时往 inbox/logs/ 和 inbox/ideas/ 丢碎片
  你 → 完全不用管格式

周日：
  你说「帮我写本周周记」
  Hermes → 执行 /weekly-from-inbox → 生成 draft
  你 → 查看 → 改几个字 → 改 status: published

不定期：
  你说「把轮毂那些笔记写成博客」
  Hermes → 执行 /blog-from-notes → 生成 draft
  你 → review → 满意就发布

每月：
  你说「审计一下草稿」
  Hermes → 执行 /draft-audit → 出审计报告
  你 → 决定哪些发布、哪些删除、哪些继续改
```

---

## FAQ

**Q：我忘记写英文摘要怎么办？**
A：不用写。Hermes 生成时会补 `englishSummary`。

**Q：我能直接写正式文章跳过 inbox 吗？**
A：当然。直接在 `content/blog/` 下写 `.md` 文件就行。Inbox 是可选的。

**Q：Hermes 会改我写好的文章吗？**
A：不会。Hermes 只创建新 draft 和更新已有 draft。`status: published` 的内容不会碰。

**Q：我不确定素材放哪个目录怎么办？**
A：扔 `ideas/`。Hermes 会判断它更适合变成博客还是项目或周记。
