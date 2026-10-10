# 博客封面模块 + 批量封面生成

- [x] 摸清博客图片基建：`blogSchema` 无 cover 字段 / `scripts/content-images.mjs` 只认正文图片引用 / 58 篇里仅 4 篇有正文图
- [x] 发现 `blog-image-workflow.md` 已埋好触发条件（「等列表页确实需要封面时再加可选 cover 字段」）
- [x] 出 3 张封面风格样张（A 几何构成 / B 暗场光路 / C 白场材质），已发到对话
- [ ] **你选定封面风格** ← 卡在这里
- [ ] developer 实现 cover 模块（schema + 详情页 + 列表卡片 + 检查器 + 文档 + 测试）— 后台进行中
- [ ] 按选定风格生成 58 张封面（16:9，非 pro 通道约 1376×768）
- [ ] 写回 `cover` / `coverAlt` frontmatter 到 58 篇
- [ ] 跑六道门禁（typecheck / lint / test / content:audit / images:check / build）
- [ ] 生产服务实测页面（封面真渲染 + 列表页缩略图 + 320px 不溢出）

## 待确认
- 生图 pro 通道（max edge ≥1600）当前返 `503 No available channel`；非 pro 通道正常但上限 1376×768（1.06MP）。若要更清晰的封面需等 pro 恢复后重跑。
- 封面是否也上列表页卡片缩略图（已按「要」实现，无封面时自动降级为现在的纯文字卡）。
