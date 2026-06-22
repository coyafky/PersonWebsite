# Todo — 站点结构优化

> 与 `plan.md` 配套的逐项任务清单。
> 每个任务对应 plan.md 中的某个 slice 子步骤。
> 状态: pending → in_progress → done

---

## Slice 1 — Portal Home + Nav + About

- [x] **S1.1** 重写 `app/(site)/page.tsx`：移除 `getBlogPosts/getWeeklyPosts/getFeaturedProjects`；只保留 Hero + 6 栏目入口卡（每张入口卡 = icon + 标题 + 1 句描述 + CTA）
- [x] **S1.2** 修改 `components/site-nav.tsx`：`navItems` 长度 = 6；移除 `/career`；顺序：Blog → AI Tracker → Weekly → Learning → Projects → About
- [x] **S1.3** 修改 `app/(site)/about/page.tsx`：在末尾追加 Career section，使用 `getCareerPosts()` 数据
- [x] **S1.4** 替换 `app/(site)/career/page.tsx`：改为 `redirect('/about#career')`，保留 1 版本过渡
- [x] **S1.5** 运行 `npm run lint && npm run typecheck && npm run build`
- [x] **S1.6** 手动核查：访问 `/`、`/about`、`/career`，确认功能

## Slice 2 — Footer Upgrade

- [x] **S2.1** 新建 `components/section-footer.tsx`：3 列布局；props: `{ recentPosts: { blog?: ..., weekly?: ... } }`
- [x] **S2.2** 修改 `app/(site)/layout.tsx`：用 `<SectionFooter>` 替换 `<p>`
- [x] **S2.3** 在 `globals.css` 不新增 token 的前提下，用现有 className 体系完成 3 列布局
- [x] **S2.4** 运行 `npm run lint && npm run typecheck && npm run build`
- [x] **S2.5** 手动核查：访问任一页，DOM 中 `section-footer` 含 3 区块

## Slice 3 — Collection Foundation + Blog

- [x] **S3.1** 新建 `components/collection-list.tsx`：Server Component；props: `{ title, description?, children, emptyLabel? }`
- [x] **S3.2** 新建 `components/entry-card-blog.tsx`：Server Component；杂志式（title + summary + tags + date + 可选 readTime）
- [x] **S3.3** 重写 `app/(site)/blog/page.tsx`：用 `CollectionList` + `EntryCardBlog`；按 date 倒序
- [x] **S3.4** 运行 `npm run lint && npm run typecheck && npm run build`
- [x] **S3.5** 手动核查：访问 `/blog`，确认杂志式列表

## Slice 4 — Weekly Timeline

- [x] **S4.1** 新建 `components/entry-card-weekly.tsx`：timeline 节点样式；props: `{ href, week, title, highlights, mood? }`
- [x] **S4.2** 重写 `app/(site)/weekly/page.tsx`：用 `CollectionList` + `EntryCardWeekly`；按 week 倒序
- [x] **S4.3** 复用 `components/timeline.tsx` 或 `globals.css` 中 `.timeline` 相关 className
- [x] **S4.4** 运行 `npm run lint && npm run typecheck && npm run build`
- [x] **S4.5** 手动核查：访问 `/weekly`，确认时间线视图

## Slice 5 — Projects Case Grid

- [x] **S5.1** 新建 `components/entry-card-project.tsx`：案例卡片样式；props: `{ href, title, summary, stack, impact, featured, period?, cover? }`
- [x] **S5.2** 重写 `app/(site)/projects/page.tsx`：用 `EntryCardProject`；按 featured 优先 + date 倒序
- [x] **S5.3** 运行 `npm run lint && npm run typecheck && npm run build`
- [x] **S5.4** 手动核查：访问 `/projects`，确认案例卡片网格

## Slice 6 — Learning Topic Tree

- [x] **S6.1** 新建 `components/entry-card-learning.tsx`：原生 `<details>` 折叠；props: `{ topic, postCount, posts }`
- [x] **S6.2** 重写 `app/(site)/learning/page.tsx`：主题树；按 topic 分组
- [x] **S6.3** 重写 `app/(site)/learning/[topic]/page.tsx`：单 topic 文章列表
- [x] **S6.4** 运行 `npm run lint && npm run typecheck && npm run build`
- [x] **S6.5** 手动核查：访问 `/learning` 与 `/learning/<topic>`，确认主题树

## Slice 7 — AI Tracker Signal Stream

- [x] **S7.1** 新建 `components/entry-card-ai-tracker.tsx`：信号流样式；props: `{ href, title, summary, signal, date, tags? }`
- [x] **S7.2** signal 字段直接读 schema `signal: 1|2|3`（frontmatter 字段），组件内部 `signalStrength()` 映射到 `strong/mid/weak` 视觉标签；原"第一 tag 推断"方案被取代（schema 已含 signal，无需推断）
- [x] **S7.3** 重写 `app/(site)/ai-tracker/page.tsx`：用 `EntryCardAiTracker`；按 date 倒序
- [x] **S7.4** 运行 `npm run lint && npm run typecheck && npm run build`
- [x] **S7.5** 手动核查：访问 `/ai-tracker`，确认信号流

## Slice 8 — Indices

- [x] **S8.1** 在 `lib/content/reader.ts` 新增 `getAllTags()`：聚合所有 frontmatter `tags` 字段
- [x] **S8.2** 在 `lib/content/reader.ts` 新增 `getBlogArchive()`：按月分组（YYYY-MM）
- [x] **S8.3** 新建 `app/(site)/tags/page.tsx`：列出所有 tag + 文章数
- [x] **S8.4** 新建 `app/(site)/blog/archive/page.tsx`：按月倒序分组
- [x] **S8.5** 运行 `npm run lint && npm run typecheck && npm run build`
- [x] **S8.6** 手动核查：访问 `/tags` 与 `/blog/archive`

## Slice 9 — Final Verification

- [x] **S9.1** 修改 `CLAUDE.md` 「当前开发状态」：追加「信息架构升级 v1」
- [x] **S9.2** 全量 `npm run lint && npm run typecheck && npm run build`
- [x] **S9.3** 手动跨页跳转核查：首页 → 6 list → 详情 → 归档 → tag → about，每条路径无 404
- [x] **S9.4** 对照 SPEC §6.3 呈现矩阵：6 个列表页呈现差异符合表格
- [x] **S9.5** 对照 SPEC §8 验收标准：功能 8.1 + 工程 8.2 + 设计 8.3 三组逐项打勾
- [x] **S9.6** 创建 PR（如果走 GitHub flow）/ 合并到 main（如直接）
- [x] **S9.7** 修复累积债 P2/P3：建 `/rss.xml` 别名 / 移除 sitemap 中 `/career` 条目 / `search-dialog.tsx` lint error / `series-nav.tsx` unused / `npm test` zsh glob

---

## 进度概览

| Slice | 标题 | 任务数 | 状态 |
|-------|------|-------|------|
| 1 | Portal Home + Nav + About | 6 | done |
| 2 | Footer Upgrade | 5 | done |
| 3 | Collection Foundation + Blog | 5 | done |
| 4 | Weekly Timeline | 5 | done |
| 5 | Projects Case Grid | 4 | done |
| 6 | Learning Topic Tree | 5 | done |
| 7 | AI Tracker Signal Stream | 5 | done |
| 8 | Indices | 6 | done |
| 9 | Final Verification | 7 | done |

总计：48 个子任务，全部 done。

---

## 执行提示

- 每个 Slice 完成后立即更新本文件状态（`pending` → `done`）
- Slice 3-7 可并行（互相不依赖），但同分支建议顺序串行合并
- Slice 8 必须在 Slice 3-7 完成后启动
- 任何 slice 失败 = 立即修，不累积到下一 slice