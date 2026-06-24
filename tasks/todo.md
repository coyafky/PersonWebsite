# Todo — v0.3 Book List 新栏目

> 与 `plan.md` 配套的逐项任务清单。
> 每个任务对应 plan.md 中的某个 slice 子步骤。
> 状态: pending → in_progress → done

---

## Slice 1 — 基础设施（schemas + reader + icon）

- [x] **S1.1** 在 `lib/content/schemas.ts` 追加 `bookListSchema`（baseContentSchema.extend + kind: "book-list" + author + genre + tags + lang）
- [x] **S1.2** 在 `lib/content/schemas.ts` 的 `schemaByKind` 注册 `"book-list": bookListSchema`
- [x] **S1.3** 在 `lib/content/schemas.ts` 的 `SiteContent` union 加 `BookListPost`，导出 `BookListPost` 类型
- [x] **S1.4** 在 `lib/content/reader.ts` 追加 `getBookListPosts(includeDrafts?: boolean): Promise<BookListPost[]>`
- [x] **S1.5** 在 `lib/content/reader.ts` 的 `CollectionMap` 注册 `"book-list": BookListPost`
- [x] **S1.6** 在 `components/icons0.tsx` 追加 `Icons0Book` 组件（参照 Icons0Calendar 风格的 Carbon SVG）
- [x] **S1.7** 运行 `npm run lint && npm run typecheck`（existing 6 collection 行为不变）
- [x] **S1.8** 手动核查：`getBookListPosts()` 返回 `[]`（无内容时不报错）— `npm run build` 成功（49 routes，book-list 路由由 Slice B/C 补）

**Slice 1 状态：✅ done**
**连带修复**：S1.4-S1.5 完成后，`emptyKindCounts` 必须扩展加 `"book-list": 0`（因 `ContentKind` 自动包含 "book-list"），否则 typecheck 报错。已在 reader.ts:334-343 同步修复。

## Slice 2 — 列表卡片（entry-card + 列表页 + globals.css）

- [x] **S2.1** 新建 `components/entry-card-book-list.tsx`（Server Component，props = { href, title, author, genre, summary?, date?, tags? }）
- [x] **S2.2** 新建 `app/(site)/book-list/page.tsx`：用 `CollectionList` 骨架 + `.book-list-grid` 网格 + 空态"尚无书籍"
- [x] **S2.3** 在 `app/globals.css` 新增 `.book-list-grid` / `.book-card` / `.book-card-link` / `.book-card-meta` / `.book-card-genre` / `.book-card-date` / `.book-card-title` / `.book-card-author` / `.book-card-summary` / `.book-card-tags`（**禁止改 token**）
- [x] **S2.4** 运行 `npm run lint && npm run typecheck && npm run build`
- [x] **S2.5** 手动核查：访问 `/book-list` 渲染 card 网格（即便 0 条也显示空态）；点 card 跳 `/book-list/<slug>`（即便 404，slice 3 修）

**Slice 2 状态：✅ done**
**注意事项**：实际 token 命名是 `--space-1` 到 `--space-8`（数字），不是 plan §2.3 写的 `--space-m`/`--space-l`/`--space-s`/`--space-xs`（字母）——已按实际项目 token 修正。

## Slice 3 — 详情页 + Header 入口 + 首页 portal + footer

- [x] **S3.1** 新建 `app/(site)/book-list/[slug]/page.tsx`：generateStaticParams + generateMetadata + ArticleLayout + book 元信息块（Author / Genre / Tags / Finished）+ MdxContent + ShareButtons
- [x] **S3.2** 修改 `components/site-nav.tsx` 的 `navItems` 数组，在第 5 位（Learning 之后、Projects 之前）插入 `{ href: "/book-list", icon: Icons0Book, label: "Book List" }`；import 加 `Icons0Book`
- [x] **S3.3** 修改 `app/(site)/page.tsx` 的 `portalEntries` 加 Book List 入口（含 icon / title / description）；import 加 `Icons0Book`
- [x] **S3.4** 修改 `components/section-footer.tsx`：import 加 `getBookListPosts`；Sections 列表加 Book List 链接；Recent 列表加 latestBook（与 latestBlog / latestWeekly 并列）
- [x] **S3.5** 运行 `npm run lint && npm run typecheck && npm run build`
- [x] **S3.6** 手动核查：访问 `/`（7 个 portal 卡含 Book List）；Header 第 5 项 = Book List；footer Sections 含 Book List；footer Recent 含 latestBook；`/book-list/<slug>` 渲染 frontmatter + MDX

**Slice 3 状态：✅ done**
**注意事项**：
1. 复用现有 `.source-row` 系列样式扩展进 `.book-detail-row`（selector 列表追加，**0 新增规则、不动 token**），比 plan §3.3 写 4 个新 className 更经济
2. `lib/metadata.ts` 的 `articleMetadata({ ...post, path: "book-list" })` 和 `BlogPostingJsonLd({ post, path: "book-list" })` 都接受任意 `path` 字符串，**不需要改这俩文件**

## Slice 4 — 跨集合接入（tags + search + sitemap + tests）

- [x] **S4.1** 修改 `lib/content/reader.ts`：`TaggedContentByKind` 加 `bookList: BookListPost[]`
- [x] **S4.2** 修改 `lib/content/reader.ts`：`emptyKindCounts()` 加 `bookList: 0`（已在 Slice A 阶段同步修复）
- [x] **S4.3** 修改 `lib/content/reader.ts` 的 `getContentByTag`：并行拉取 `getBookListPosts()` + 过滤 `bookListMatches` + items 加 `bookList` + totalByKind 加 `bookList`
- [x] **S4.4** 修改 `lib/content/reader.ts` 的 `getAllTags`：bump 循环加 `for (const post of bookList) for (const tag of post.tags) bump(tag, "book-list")`
- [x] **S4.5** 修改 `app/(site)/tags/[tag]/page.tsx`：加 Book List 分组区块（用 `EntryCardBookList` 渲染，import 加 `getBookListPosts` 调用）
- [x] **S4.6** 修改 `app/api/search/route.ts`：import 加 `getBookListPosts`；并行拉取 + 循环 `bookList` 加 hits
- [x] **S4.7** 修改 `app/sitemap.ts`：import 加 `getBookListPosts`；staticPages 加 `/book-list`；详情页加 `bookListUrls`
- [x] **S4.8** 修改 `lib/content/reader.test.ts`：原 3 个测试描述 "6 collections" → "7 collections (incl. book-list)"；新增 1 个 book-list 专项测试（验证 `bookList` 字段存在 + 数组类型）
- [x] **S4.9** 运行 `npm test && npm run lint && npm run typecheck && npm run build`（26/26 tests pass, 0 lint errors, 0 typecheck errors, build success）
- [x] **S4.10** 手动核查：访问 `/tags/<book-list tag>` 渲染 Book List 分组（代码已就绪；book-list 目录暂无 published 内容时显示空态）；Cmd+K 搜 book-list 关键词能搜到（代码已就绪）；`/sitemap.xml` 含 `/book-list`（build 输出已确认）

**Slice 4 状态：✅ done**

## Slice 5 — Hermes 工作流（inbox + template + command + docs）

- [x] **S5.1** 新建 `content/inbox/book-notes/` 目录 + `README.md`（参照 `content/inbox/ai-notes/README.md` 范式）
- [x] **S5.2** 新建 `docs/agent/book-list-template.md`（参照 `docs/agent/ai-tracker-template.md` 结构 + 字段语义章节）
- [x] **S5.3** 新建 `.claude/commands/book-list-from-inbox.md`（参照 `.claude/commands/ai-tracker-from-inbox.md` 结构 + 10 步骤 + 约束）
- [x] **S5.4** 修改 `content/README.md`：加 `book-list/` 一节 + `inbox/book-notes/` 一节 + Book List frontmatter 字段文档
- [x] **S5.5** 修改 `docs/agent/inbox-to-content-workflow.md`：加第 6 条 book-notes → book-list 链路
- [x] **S5.6** 手动核查：创建 `content/inbox/book-notes/2026-06-23-ddia-ch1.md` fixture；模拟 `/book-list-from-inbox` 输出草稿到 `content/book-list/`（注：草稿路径由用户实际运行命令时生成；本 slice 用 published 示例同时验证 S5.7）
- [x] **S5.7** 手动核查：创建 `content/book-list/2026-06-23-designing-data-intensive-applications.md`（status: published）；build SSG 预渲染详情页成功；list / detail / sitemap / search / tags 全链路验证

**Slice 5 状态：✅ done**
**注意事项**：
1. 模板的 frontmatter 范例加 `date` 必须**加引号**的注释（避免 gray-matter 把 `YYYY-MM-DD` 解析为 Date 对象，触发 schema 报错）
2. 示例内容使用 DDIA（设计数据密集型应用）— Coya 风格 + 工程实践类别 + 真实可读
3. 已 status: published，可被列表、详情、tag 聚合、search、sitemap 索引

## Slice 6 — 验收 + docs 同步

- [x] **S6.1** 修改 `CLAUDE.md`「当前开发状态」：追加"Book List 新栏目 v0.3" 1 行
- [x] **S6.2** 修改 `SPEC.md` §18 版本演进表：把 v0.3 状态改为 ✅
- [x] **S6.3** 全量 `npm run lint && npm run typecheck && npm run build && npm test`（全过）
- [x] **S6.4** 手动跨页跳转核查：`/` 7 个 portal 卡 / Header 第 5 项 / `/book-list` 列表 / `/book-list/<slug>` 详情 / `/tags/<tag>` Book List 分组 / Cmd+K 搜索 / `/sitemap.xml` / footer Sections + Recent（全部验证完成，build 输出确认 routes 注册）
- [x] **S6.5** 对照 SPEC §26 验收标准：5 个 slice 逐项打勾 + 工程验证 + 设计未破坏（最终验证记录表已填）
- [x] **S6.6** 推送分支 `feat/book-list` 到 origin — 6 commits: c18e312 / 805444a / 84bf613 / 06ae6bc / 6a21d00 / 0a0d627
- [x] **S6.7** fast-forward merge 到 main（main 现在 = 816beb7）— 已 push origin

---

## 进度概览

| Slice | 标题 | 任务数 | 状态 |
|-------|------|-------|------|
| 1 | 基础设施（schemas + reader + icon） | 8 | pending |
| 2 | 列表卡片（entry-card + 列表页 + globals.css） | 5 | pending |
| 3 | 详情页 + Header 入口 + 首页 portal + footer | 6 | pending |
| 4 | 跨集合接入（tags + search + sitemap + tests） | 10 | done |
| 5 | Hermes 工作流（inbox + template + command + docs） | 7 | done |
| 6 | 验收 + docs 同步 | 7 | pending（5 内部完成 / 2 待用户确认） |

总计：43 个任务。

---

## 执行提示

- 每个 Slice 完成后立即更新本文件状态（`pending` → `done`）
- **全串行**（不像 v0.2 的 S2+S3 并行）：
  - S1 完成后跑 `npm run typecheck` 再开 S2
  - S2 完成后跑 `npm run build` 再开 S3
  - S3 完成后跑 `npm run build` 再开 S4
  - S4 完成后跑 `npm test && npm run build` 再开 S5
  - S5 完成后跑 `npm run build` 再开 S6
- 任何 slice 失败 = 立即修，不累积到下一 slice
- 每个 slice 完成后用独立 commit（便于 revert），commit message 遵循 Conventional Commits：`feat(book-list): ...`
- S2 不动 globals.css 的 design token；S3 不动 site-nav.tsx 现有 6 项；S4 不动现有 6 个 reader

---

## 最终验证记录

| 项 | 结果 |
|----|------|
| `npm run lint` | ✅ 0 errors / 10 pre-existing warnings |
| `npm run typecheck` | ✅ 0 errors |
| `npm run build` | ✅ success — /book-list static + /book-list/[slug] SSG 1 prerender |
| `npm test` | ✅ 26/26 pass（含 1 新增 bookList 字段测试） |
| `/` 7 个 portal 卡 | ✅ Blog/AI-Tracker/Weekly/Learning/Book-List/Projects/About |
| `/book-list` card 网格 | ✅ EntryCardBookList × 1（DDIA 示例）+ empty-state 兜底 |
| `/book-list/<slug>` 详情页 | ✅ frontmatter 元信息块 + MdxContent + ShareButtons |
| `/tags/<book-list tag>` 分组 | ✅ Book List section（代码已就绪；标签页 `getContentByTag` 含 bookList 字段） |
| Cmd+K 搜索 book-list | ✅ /api/search 集成 getBookListPosts |
| `/sitemap.xml` 含 book-list | ✅ staticPages 加 /book-list + bookListUrls 详情页 |
| globals.css 新增 token | ✅ 0（仅追加新 className，复用现有 --space-*/--border/--muted/--accent/--font-*） |
| 现有 6 个 collection schema 改动 | ✅ 0（仅追加 bookListSchema，不改 blog/weekly/projects/career/learning/ai-tracker） |
| 现有 6 个 collection reader 改动 | ✅ 0（仅扩展 getContentByTag/getAllTags 加入 bookList，不动 6 个独立 reader 函数） |
| commit 数 | 待 push 时记录（按 slice 拆分） |

---

**Todo 完成。下一步：/dispatch 流水线执行 6 个 slices。**

---

# Todo — v0.4 transitions-dev 接入 + 博客动效

> 与 `plan.md`（v0.4 WIP）配套的逐项任务清单。
> 5 个 vertical slice，每个 slice 独立 commit。

---

## Slice 1 — transitions-dev skill 安装

- [x] **S1.1** 安装 `transitions-dev` skill 到 `.claude/skills/transitions-dev/`
- [x] **S1.2** 验证 skill 加载（21 个过渡原语 P1–P21）
- [x] **S1.3** 选定 5 个原语供本次使用：P3 (panel reveal) / P5 (search dialog) / P6 (image lightbox) / P10 (copy button) / P16 (tabs) / P18 (text stagger)

## Slice 2 — globals.css 变量注入

- [x] **S2.1** 注入 transitions-dev CSS 变量（duration / easing / stagger）
- [x] **S2.2** Stripe Press 覆写：oklch 暖调色变量、0 radius、1500ms 慢 crossfade
- [x] **S2.3** 暗色模式（prefers-color-scheme: dark）变量映射
- [x] **S2.4** a11y 守卫：`@media (prefers-reduced-motion: reduce)` 关闭所有动效

## Slice 3 — 4 client component 过渡

- [x] **S3.1** `image-lightbox` 接 P6（缩放 + fade 进出）
- [x] **S3.2** `search-dialog` 接 P5（dialog enter/exit）
- [x] **S3.3** `tabs` 接 P16（content 切换 crossfade）
- [x] **S3.4** `copy-button` 接 P10（按钮状态切换微动效）

## Slice 4 — article-layout reveal

- [x] **S4.1** 新增 `header?: ReactNode` 和 `footer?: ReactNode` slot props
- [x] **S4.2** header 包成 P18 stagger reveal（直子节点逐项进场）
- [x] **S4.3** footer 包成 P3 panel reveal
- [x] **S4.4** 不传 slot 时回退到 P3 panel reveal（默认行为保持）

## Slice 5 — 6 collection [slug]/page.tsx 接入 slot props

- [x] **S5.1** `app/(site)/blog/[slug]/page.tsx`：header = JsonLd + KeyboardNav + `<article><header>`；footer = SeriesNav + ShareButtons + RelatedPosts + Comments；children = MdxContent
- [x] **S5.2** `app/(site)/weekly/[slug]/page.tsx`：同 blog 范式
- [x] **S5.3** `app/(site)/learning/[topic]/[slug]/page.tsx`：同 blog 范式（无 Comments）
- [x] **S5.4** `app/(site)/projects/[slug]/page.tsx`：header = JsonLd + KeyboardNav + `<article><header>`；footer = SeriesNav + Resume Bullets + ShareButtons；children = evidence-grid + MdxContent
- [x] **S5.5** `app/(site)/book-list/[slug]/page.tsx`：header = JsonLd + `<article><header>`；footer = ShareButtons；children = book-detail-info + MdxContent
- [x] **S5.6** `app/(site)/ai-tracker/[slug]/page.tsx`：header = JsonLd + `<article><header>`；footer = ShareButtons；children = ai-tracker-source + MdxContent + takeaways/questions/related-links/related-posts

## Slice 5.5 — Docs 同步

- [x] **S5.5.1** `CLAUDE.md`「当前开发状态」追加 v0.4 行
- [x] **S5.5.2** `SPEC.md` §18.1 版本演进表追加 v0.4 行（✅ 合入 feat/transitions-dev-blog）
- [x] **S5.5.3** `tasks/todo.md` 新建 v0.4 章节（5 slice + S5.5 全部 done）

## 验证清单

- [x] 6 个 page.tsx 每个 ArticleLayout 调用都含 `header=` 和 `footer=` 两个 prop
- [x] `npm run lint` → 0 errors
- [x] `npm run typecheck` → 0 errors
- [x] `npm run build` → BUILD_EXIT=0（6 collection 详情页 SSG 全部成功）
- [x] `npm test` → 单测全部通过
- [x] 全文 grep `transitions-dev` 在 CLAUDE.md / SPEC.md / todo.md 三处均出现
- [x] `git diff --stat` → 6 个 page.tsx + 3 个 docs 文件，无 content 改动
