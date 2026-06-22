# Plan — 站点结构优化（基于 SPEC.md）

> 输入: `SPEC.md`（结构 spec）
> 输出: 9 个垂直切片（vertical slices），每个切片独立 shippable
> 起点: 现有 Next.js 16 App Router + Markdown/MDX 内容系统
> 终点: 三层信息架构（portal / list / detail）+ 6 栏目差异化呈现

---

## 1. 切片策略

按 **vertical slice** 切分（每片 = 一条端到端的可验证路径），不按 horizontal layer（不让"组件库全部先做完"）。

**为什么 vertical**：
- 每个 slice 都能在 dev 环境肉眼验收，立竿见影
- 任一 slice 失败只回滚该 slice，不污染主分支
- 切片顺序按依赖深度排列（浅层先做，深层后做）

---

## 2. 依赖图

```
┌──────────────────────────────────────────────────────────────────────┐
│ Slice 1: Portal Home + Nav + About                                    │
│   app/(site)/page.tsx  site-nav.tsx  about/page.tsx  career/page.tsx │
│   独立：无新组件，无新 reader                                          │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Slice 2: Footer Upgrade                                                │
│   section-footer.tsx (new)  app/(site)/layout.tsx                     │
│   独立：不依赖 slice 1 文件                                            │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Slice 3: Collection Foundation + Blog (vertical: 1 list ships)         │
│   collection-list.tsx (new)  entry-card-blog.tsx (new)                 │
│   blog/page.tsx (refactor)                                             │
│   依赖：slice 1 完成后可独立做（不修改首页和 nav）                       │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Slice 4: Weekly  │ │ Slice 5: Projects│ │ Slice 6: Learning│
│ entry-card-weekly│ │ entry-card-project│ │ entry-card-learn │
│ weekly/page.tsx  │ │ projects/page.tsx │ │ learning/page.tsx│
│                  │ │                   │ │ + [topic]/page  │
└──────────────────┘ └──────────────────┘ └────────┬─────────┘
                                                   │
                                                   ▼
                                  ┌─────────────────────────────┐
                                  │ Slice 7: AI Tracker          │
                                  │ entry-card-ai-tracker        │
                                  │ ai-tracker/page.tsx          │
                                  └─────────────────────────────┘
                                                   │
                                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Slice 8: Indices (tags + blog archive)                                 │
│   lib/content/reader.ts (helpers)  tags/page.tsx (new)                 │
│   blog/archive/page.tsx (new)                                          │
│   依赖：slice 3-7 全部完成（list 都稳了再加索引）                       │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Slice 9: Final Verification                                            │
│   全量 lint / typecheck / build                                        │
│   CLAUDE.md 当前开发状态更新                                            │
│   manual cross-page nav check                                          │
└──────────────────────────────────────────────────────────────────────┘
```

**并行机会**：Slice 4 / 5 / 6（weekly / projects / learning）互相不依赖，可在 Slice 3 完成后并行开工。Slice 7 依赖 Slice 6 主题树抽象完成后开工。

---

## 3. 切片详细规范

### Slice 1 — Portal Home + Nav + About
**目标**：让首页成为纯门户，导航降权 Career，About 收纳 Career 内容。

| 文件 | 操作 | 验收点 |
|------|------|--------|
| `app/(site)/page.tsx` | 重写 | 不再 import `getBlogPosts/getWeeklyPosts/getFeaturedProjects`；只保留 Hero + 6 个栏目入口卡 |
| `components/site-nav.tsx` | 修改 | `navItems` 长度 = 6；移除 `/career` 项；顺序：Blog → AI Tracker → Weekly → Learning → Projects → About |
| `app/(site)/about/page.tsx` | 修改 | 末尾追加 Career section（基于 `getCareerPosts` 读取的内容） |
| `app/(site)/career/page.tsx` | 替换为 redirect | `redirect('/about#career')` 或保留薄壳页 |

**验收命令**：`npm run lint && npm run typecheck && npm run build`

**Checkpoint 1**：人工访问 `/`、`/about`，确认首页是门户、Career 内容出现在 about 末尾。

---

### Slice 2 — Footer Upgrade
**目标**：footer 从单行 `<p>` 升级为 3 列结构。

| 文件 | 操作 | 验收点 |
|------|------|--------|
| `components/section-footer.tsx` | 新建 | 3 列布局：栏目索引 / 最近更新 / RSS & contact；接收 props：`recentPosts` |
| `app/(site)/layout.tsx` | 修改 | 用 `<SectionFooter>` 替换 `<p>` |

**验收命令**：`npm run lint && npm run typecheck && npm run build`

**Checkpoint 2**：访问任一页，DOM 中 `section-footer` 含 3 个区块。

---

### Slice 3 — Collection Foundation + Blog
**目标**：抽出列表页通用骨架，让 blog 第一个用上。

| 文件 | 操作 | 验收点 |
|------|------|--------|
| `components/collection-list.tsx` | 新建 | props: `{ title, description, children, emptyLabel }`；含 heading + description + empty-state |
| `components/entry-card-blog.tsx` | 新建 | props: `{ href, title, summary, date, tags, readTime? }`；杂志式（标题 + summary + tags + 日期） |
| `app/(site)/blog/page.tsx` | 重写 | 用 `CollectionList` + `EntryCardBlog`；拉取 `getBlogPosts()`；按 date 倒序 |

**验收命令**：`npm run lint && npm run typecheck && npm run build`

**Checkpoint 3**：访问 `/blog`，确认杂志式列表生效。

---

### Slice 4 — Weekly Timeline
**目标**：weekly 从网格变时间线。

| 文件 | 操作 | 验收点 |
|------|------|--------|
| `components/entry-card-weekly.tsx` | 新建 | props: `{ href, week, title, highlights, mood }`；timeline 节点样式 |
| `app/(site)/weekly/page.tsx` | 重写 | 用 `CollectionList` + `EntryCardWeekly`；按 week 倒序；垂直 timeline 布局 |

**验收命令**：`npm run lint && npm run typecheck && npm run build`

**Checkpoint 4**：访问 `/weekly`，确认时间线视图。

---

### Slice 5 — Projects Case Grid
**目标**：projects 从网格变案例档案卡片。

| 文件 | 操作 | 验收点 |
|------|------|--------|
| `components/entry-card-project.tsx` | 新建 | props: `{ href, title, summary, stack, impact, featured, period, cover? }` |
| `app/(site)/projects/page.tsx` | 重写 | 用 `EntryCardProject`；按 featured 优先 + date 倒序 |

**验收命令**：`npm run lint && npm run typecheck && npm run build`

**Checkpoint 5**：访问 `/projects`，确认案例卡片网格。

---

### Slice 6 — Learning Topic Tree
**目标**：learning 从平铺变主题树。

| 文件 | 操作 | 验收点 |
|------|------|--------|
| `components/entry-card-learning.tsx` | 新建 | props: `{ topic, postCount, posts }`；用 `<details>`/`<summary>` 原生折叠 |
| `app/(site)/learning/page.tsx` | 重写 | 主题树布局；按 topic 分组 |
| `app/(site)/learning/[topic]/page.tsx` | 重写 | 单一 topic 内文章列表 |

**验收命令**：`npm run lint && npm run typecheck && npm run build`

**Checkpoint 6**：访问 `/learning`，确认主题树可折叠；访问 `/learning/<topic>`，确认单 topic 列表。

---

### Slice 7 — AI Tracker Signal Stream
**目标**：ai-tracker 从网格变信号流。

| 文件 | 操作 | 验收点 |
|------|------|--------|
| `components/entry-card-ai-tracker.tsx` | 新建 | props: `{ href, title, summary, signal: 'strong'|'mid'|'weak', date, tags }`；信号强度标签 |
| `app/(site)/ai-tracker/page.tsx` | 重写 | 用 `EntryCardAiTracker`；按 date 倒序 |

**验收命令**：`npm run lint && npm run typecheck && npm run build`

**Checkpoint 7**：访问 `/ai-tracker`，确认信号流呈现 + 强度标签可见。

---

### Slice 8 — Indices (tags + blog archive)
**目标**：补齐 tag 全集与 blog 月度归档索引。

| 文件 | 操作 | 验收点 |
|------|------|--------|
| `lib/content/reader.ts` | 新增 | `getAllTags()`、`getBlogArchive()` |
| `app/(site)/tags/page.tsx` | 新建 | 列出所有 tag + 文章数 |
| `app/(site)/blog/archive/page.tsx` | 新建 | 按月倒序分组 |

**验收命令**：`npm run lint && npm run typecheck && npm run build`

**Checkpoint 8**：访问 `/tags` 与 `/blog/archive`，确认索引生效。

---

### Slice 9 — Final Verification
**目标**：跨切片回归 + 文档更新。

| 文件 | 操作 | 验收点 |
|------|------|--------|
| `CLAUDE.md` | 修改 | 「当前开发状态」追加一行「信息架构升级 v1」 |
| 全站 | 核查 | 手动跨页跳转（首页 → 6 个 list → 详情 → 归档） |

**验收命令**：`npm run lint && npm run typecheck && npm run build` 三连击。

**Checkpoint 9**：人工在 dev server 上跑一遍，确认每个路由都正常。

---

## 4. 阶段检查点（Phase Checkpoints）

| Checkpoint | 触发 | 必经项 | 失败处理 |
|-----------|------|--------|---------|
| CP-1 | Slice 1 完成 | 首页纯门户 + nav 6 项 + about 含 career + `career` 重定向 | 回滚 slice 1，定位是 page.tsx 还是 nav 还是 about |
| CP-2 | Slice 2 完成 | footer 3 列渲染 | 检查 SectionFooter props 与 layout 接入 |
| CP-3 | Slice 3 完成 | CollectionList 抽象可用 + blog 杂志式列表 | 检查 entry-card-blog 是否破坏 TypeScript strict |
| CP-4 | Slice 4-7 完成 | 6 个列表页呈现差异化 | 视觉对照 SPEC §6.3 呈现矩阵 |
| CP-5 | Slice 8 完成 | tags + blog archive 索引可用 | 检查 reader helper 是否覆盖所有 frontmatter |
| CP-6 | Slice 9 完成 | 三连击命令通过 + 跨页跳转无 404 | 强制阻断：build 失败必须修 |

---

## 5. 风险与决策记录

| # | 风险 | 缓解策略 | 决策 |
|---|------|---------|------|
| R1 | entry-card 与 ContentCard 重复 | 明确分工：entry-card 用于 5 个 list，ContentCard 保留给 about/career/其他通用 | 在 components/README.md 注明 |
| R2 | learning 主题树需要交互（折叠） | 用原生 `<details>` 元素，零 JS | 选定 |
| R3 | weekly timeline CSS 复杂 | 复用 `.timeline` className（components/timeline.tsx 已存在） | 复用 |
| R4 | ai-tracker signal 强度字段缺失 | 暂用 frontmatter tags 推断（第一 tag 为 strong/mid/weak）；后续 schema 可加 signal 字段 | v1 用 tag 推断 |
| R5 | footer 最近更新数据流 | 用 reader 现成的 `getBlogPosts()` + `getWeeklyPosts()` 各取最新 1 条 | 选定 |
| R6 | blog/archive 暂无可用数据 | 显示 "Archive coming soon" 空状态 | 选定 |

---

## 6. 验收红线（每个 slice 必跑）

```bash
# Slice 完成后必跑，3 条命令全过才能算 shippable
npm run lint        # 0 errors
npm run typecheck   # 0 errors
npm run build       # success
```

任一失败 = 该 slice 未完成，必须修完才能进入下一 slice。

---

## 7. 与 /dispatch 的对接

下一步进入 `/dispatch`：把 9 个 slice 派给 expert 流水线。

- **architect**：复核 Slice 设计，输出每个 entry-card 的 props 接口契约
- **coder**：按 slice 实施，每个 slice 一个 commit
- **tester**：跑三连击 + 手动核查每个 Checkpoint
- **reviewer**：审每个 slice 的 diff，确认 SPEC §6.3 呈现矩阵被满足

---

**Plan 完成。等用户确认后进入 /dispatch。**