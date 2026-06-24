# SPEC — 站点结构优化（结构层 / 不动设计层）

> 版本: v0.2（增量规约）
> 范围: 信息架构与页面结构
> 设计系统: 沿用 Stripe Press（不动 token、不动字体、不动圆角、不动动效）
> 起点: v0.1 已合入 main 的现状
> 增量: 在 v0.1 之上，3 个新目标（详见 §0.1）

---

## 0. 版本演进

### 0.1 版本历史

| 版本 | 范围 | 状态 | 关键改动 |
|------|------|------|---------|
| v0.1 | 信息架构升级（v1） | ✅ 已合入 main（merge commit `2e9b5a9`） | 6 个列表页差异化、Career 并入 About、tag 索引 + blog archive、footer 3 列、P2/P3 清理（RSS / sitemap / lint） |
| **v0.2** | About 去冗 + Tags 跨 collection + 词云 | ✅ 完成（分支 `refactor/site-structure-v2`，4 commits `027a337..94590ce`，待 push + merge） | About 9→6 sections / `getContentByTag` reader + 3 tests / `/tags/cloud` 词云页 / 分页架构预留 |

### 0.2 本规约新增的 3 个目标

| # | 目标 | 范围 |
|---|------|------|
| G1 | About 页去冗 + 内容重新优化 | 单页重写，砍 6 处冗余 |
| G2 | Tags 跨 6 collection 聚合 | 重写 `/tags/[tag]` + 新增 `getContentByTag` reader + 分页架构预留 |
| G3 | 词云页（visualize tag 频率） | 新增 `/tags/cloud` + font-size 4 档

---

## 1. Objective（目标）

### 1.1 一句话
把当前「首页 + 列表页合订本」的双层结构，重构为「门户 / 列表 / 详情」三层结构，并让每个列表页的呈现方式贴合其内容性质。

### 1.2 关键结果（必须）
1. **首页 = 编辑式封面**：不直接拉取 blog / weekly / projects 数据，只呈现 Hero + 7 个栏目入口卡。
2. **6 个栏目列表页差异化呈现**：每个栏目按其内容性质选择呈现方式（见 §5 呈现矩阵）。
3. **Career 入口降级**：从顶层导航移除，并入 About 页面作为子区。
4. **新增 section-level layout 与列表页通用骨架**：消除列表页样板重复。
5. **footer 升级为 3 列结构**：栏目索引 / 最近更新 / RSS & contact。
6. **新增归档页**：blog 按月归档（可选 v1）、weekly 时间轴视图（v0）。

### 1.3 不在范围内（红线）
- 设计 token（`app/globals.css` 中所有 CSS 变量、字体、半径、阴影、动效曲线）
- MDX 组件注册表（`components/mdx-content.tsx`）
- 内容 frontmatter schema（`lib/content/schemas.ts`）
- Hermes 工作流（`docs/agent/hermes-*.md`）
- 新增 npm 依赖

---

## 2. Commands（Claude / Agent 命令）

### 2.1 现有命令（保持不变）
| 命令 | 文件 | 用途 |
|------|------|------|
| `/prompt-boost` | `.claude/commands/prompt-boost.md` | 模糊需求 → 精确 brief |
| `/dispatch` | `.claude/commands/dispatch.md` | expert 流水线编排 |
| `/weekly-from-inbox` | `.claude/commands/weekly-from-inbox.md` | inbox → 周记 |
| `/blog-from-notes` | `.claude/commands/blog-from-notes.md` | inbox → 博客 |
| `/project-to-career` | `.claude/commands/project-to-career.md` | 项目 → 简历材料 |
| `/draft-audit` | `.claude/commands/draft-audit.md` | 草稿质量审计 |
| `/md-to-mdx` | `.claude/commands/md-to-mdx.md` | .md → .mdx 升级 |
| `/ai-tracker-from-inbox` | `.claude/commands/ai-tracker-from-inbox.md` | inbox → AI Tracker |

### 2.2 本 spec 新增 / 改动
- **无新增命令**。本 spec 是结构性改动，不涉及内容工作流。
- **`docs/agent/skills-usage.md`**：如果新增 section-level layout 抽象，需在该文件补 1 行说明。
- **`CLAUDE.md` 当前开发状态**：把"站点骨架完成"改为"站点骨架完成 + 信息架构升级"，待实施后追加 changelog 条目。

### 2.3 验证命令（必跑）
```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # Next.js production build（push 前必跑）
```

---

## 3. Project Structure（结构变更）

### 3.1 文件树变更（新增 ⭐ / 删除 ✂ / 改造 🔧）

```
app/(site)/
├── layout.tsx              🔧 footer 从单行 <p> 升级为 3 列结构
├── page.tsx                🔧 重写：移除 blog/weekly/projects 数据拉取，纯门户
├── about/
│   └── page.tsx            🔧 在末尾追加 Career section（合并自 career/page.tsx）
├── blog/
│   ├── page.tsx            🔧 重写：杂志式列表（标题+摘要+tags+日期+阅读时长）
│   ├── archive/            ⭐ 新增目录
│   │   └── page.tsx        ⭐ blog 月度归档索引页
│   └── [slug]/page.tsx     （不动）
├── weekly/
│   ├── page.tsx            🔧 重写：垂直 timeline（按 week 倒序，highlights + mood）
│   └── [slug]/page.tsx     （不动）
├── projects/
│   ├── page.tsx            🔧 重写：案例卡片网格（cover + stack + impact + featured + period）
│   └── [slug]/page.tsx     （不动）
├── career/
│   └── page.tsx            ✂ 删除（内容并入 about）
├── learning/
│   ├── page.tsx            🔧 重写：主题树（topic 分组，可折叠）
│   ├── [topic]/page.tsx    🔧 沿用主题树，叶节点展开为文章列表
│   └── [topic]/[slug]/page.tsx  （不动）
├── ai-tracker/
│   ├── page.tsx            🔧 重写：信号流（按时间倒序，signal 强度标签）
│   └── [slug]/page.tsx     （不动）
├── tags/
│   ├── page.tsx            ⭐ 新增：tag 全集索引页
│   └── [tag]/page.tsx      （不动）
└── error.tsx               （不动）

components/
├── collection-list.tsx     ⭐ 新增：列表页通用骨架（heading + 描述 + 空状态 + 卡片插槽）
├── section-footer.tsx      ⭐ 新增：3 列 footer（栏目索引 / 最近更新 / RSS & contact）
├── entry-card-blog.tsx     ⭐ 新增：blog 专用卡片（杂志式）
├── entry-card-weekly.tsx   ⭐ 新增：weekly 专用卡片（timeline 节点）
├── entry-card-project.tsx  ⭐ 新增：project 专用卡片（案例）
├── entry-card-learning.tsx ⭐ 新增：learning 专用卡片（主题树节点）
├── entry-card-ai-tracker.tsx ⭐ 新增：ai-tracker 专用卡片（信号流）
├── content-card.tsx        🔧 保留作为通用卡片（about / career 等其他场景）
├── site-nav.tsx            🔧 移除 Career 入口；顺序：Blog → AI Tracker → Weekly → Learning → Projects → About
└── ...（其他组件不动）

lib/content/
├── reader.ts               🔧 可能新增：按月归档读取器、tag 全集读取器
└── ...（schemas 不动）

app/globals.css             🚫 不动
docs/agent/skills-usage.md  🔧 补 1 行说明（如新增 section-level 抽象）
CLAUDE.md                   🔧 更新「当前开发状态」
```

### 3.2 路由表（改造后）

| 路由 | 类型 | 角色 |
|------|------|------|
| `/` | 门户 | 编辑式封面 + 7 栏目入口 |
| `/blog` | 列表 | 杂志式列表（全部） |
| `/blog/archive` | 索引 | 月度归档索引 |
| `/blog/[slug]` | 详情 | 文章详情 |
| `/weekly` | 列表 | 垂直 timeline |
| `/weekly/[slug]` | 详情 | 周记详情 |
| `/projects` | 列表 | 案例卡片网格 |
| `/projects/[slug]` | 详情 | 项目详情 |
| `/learning` | 列表 | 主题树（topic 分组） |
| `/learning/[topic]` | 列表 | 单一 topic 文章列表 |
| `/learning/[topic]/[slug]` | 详情 | 学习笔记详情 |
| `/ai-tracker` | 列表 | 信号流 |
| `/ai-tracker/[slug]` | 详情 | 信号详情 |
| `/about` | 单页 | 关于 + Career 子区 |
| `/tags` | 索引 | tag 全集 |
| `/tags/[tag]` | 列表 | 单 tag 聚合 |

---

## 4. Code Style（沿用现有 + 本轮新增）

### 4.1 沿用现有规范（`CLAUDE.md`）
- **Server Component 优先**：除非需要 `useState`/`useEffect`/事件处理，否则保持 Server Component
- **目录命名**：kebab-case（`collection-list.tsx` 不是 `CollectionList.tsx`）
- **不引入 `src/` 目录**
- **TypeScript strict**，禁止 `any`
- **样式**：全局 CSS + 语义 className，不引入 Tailwind 或 CSS-in-JS

### 4.2 本轮新增约定
- **新增列表页骨架**：必须基于 `components/collection-list.tsx`，禁止各页面重复定义 heading + empty-state。
- **新增 entry-card-\* 组件**：每个栏目卡片组件命名 `entry-card-<kind>.tsx`，遵循 props 约定：
  ```ts
  interface EntryCardProps {
    href: string;
    title: string;
    summary: string;
    meta?: string;          // 日期 / week / period
    tags?: string[];
    icon?: ReactNode;
    accent?: "weak" | "mid" | "strong";  // 用于 ai-tracker 信号强度
  }
  ```
- **kebab-case 文件名**：所有新组件 `entry-card-blog.tsx`、`collection-list.tsx`、`section-footer.tsx`。
- **Server Component 优先**：entry-card-\* 默认 Server Component；只有需要 `useTheme` / `useScroll` 等才用 `"use client"`。
- **样式复用**：所有新 className 必须使用 `globals.css` 已有的 token（`--space-*`、`--radius-*`、`--accent-*`），禁止新增硬编码值。

### 4.3 反模式（禁止）
- ❌ 在 `app/(site)/page.tsx` 中再拉取内容数据
- ❌ 在新列表页重复定义 `EmptyState` / `ContentSection` 私有组件
- ❌ 给 entry-card 加 `"use client"`（除非确实需要交互）
- ❌ 引入新依赖（framer-motion / lucide-react / clsx 等已有依赖外）
- ❌ 改动 `globals.css` 的 design token

---

## 5. Testing Strategy

### 5.1 测试层级
| 层级 | 工具 | 范围 |
|------|------|------|
| 类型 | `npm run typecheck` | 所有 .ts / .tsx |
| Lint | `npm run lint` | 所有文件 |
| 构建 | `npm run build` | Next.js 全量构建 |
| 内容读取 | `node --test lib/**/*.test.ts` | reader 单元测试（已有 `headings.test.ts`） |

### 5.2 关键验收点（每项对应一个测试或人工核查）
1. **首页 portal 化**：访问 `/`，grep 源码确认 `getBlogPosts` / `getWeeklyPosts` / `getFeaturedProjects` 不再被 `app/(site)/page.tsx` 引用。
2. **导航 6 栏目**：访问 `/`，检查 `site-nav.tsx` 的 `navItems` 数组长度为 6 且不含 `/career`。
3. **Career 内容并入 About**：访问 `/about`，确认包含 `career-notes` / `resume bullets` 等原文片段。
4. **6 个列表页差异化呈现**：grep 源码确认 6 个 entry-card-\* 组件被各自列表页引用，且呈现模式不同（见 §6）。
5. **新增 tags 索引**：访问 `/tags`，确认能列出所有 tag。
6. **新增 blog archive**：访问 `/blog/archive`，确认按月分组。
7. **footer 3 列**：访问任一页，DOM 中 `section-footer` 包含 3 个子区块。
8. **构建与 lint 通过**：`npm run build` / `npm run lint` / `npm run typecheck` 三条命令全部成功。

### 5.3 不引入端到端测试
本轮结构改动范围清晰，不引入 Playwright / Cypress。手动核查 + 单元测试覆盖。

---

## 6. Boundaries（边界）

### 6.1 In scope（必须做）
| # | 项 | 验收点 |
|---|----|--------|
| 1 | 首页重写为纯编辑式封面 | `app/(site)/page.tsx` 不再拉取内容数据 |
| 2 | Career 入口降为 About 二级 | 导航移除 `/career`；about/page.tsx 末尾追加 Career section |
| 3 | 6 个列表页差异化呈现 | 见 §6.3 呈现矩阵 |
| 4 | 列表页通用骨架 `collection-list.tsx` | 5 个列表页（blog/weekly/projects/learning/ai-tracker）使用此组件 |
| 5 | footer 升级为 3 列结构 | `section-footer.tsx` 替代单行 `<p>` |
| 6 | tag 全集索引页 `tags/page.tsx` | 列出所有 frontmatter tag |
| 7 | blog 月度归档索引 `blog/archive/page.tsx` | 按月倒序分组 |
| 8 | weekly 时间轴视图 | 在 weekly 列表页用 timeline 模式呈现 |

### 6.2 Out of scope（不做）
- 设计 token 任何改动
- MDX 组件库新增（除 entry-card-\*）
- frontmatter schema 任何改动
- Hermes 工作流任何改动
- 新增 npm 依赖
- 文章详情页内部结构（已有 article-layout / toc / related-posts 体系）
- 评论系统 / 订阅系统（giscus 已有，不动）

### 6.3 呈现矩阵（每个栏目的呈现方式）

| 栏目 | 呈现模式 | 卡片组件 | 关键字段 |
|------|----------|----------|----------|
| **blog** | 杂志式列表 | `entry-card-blog` | title / summary / tags / date / 阅读时长 |
| **weekly** | 垂直 timeline | `entry-card-weekly` | week / title / highlights[0..2] / mood |
| **projects** | 案例卡片网格 | `entry-card-project` | cover / title / stack / impact[0..1] / featured / period |
| **learning** | 主题树（折叠） | `entry-card-learning` | topic 分组 → 文章列表（无封面） |
| **ai-tracker** | 信号流 | `entry-card-ai-tracker` | title / signal 强度标签 / date / summary<br>（`signal: 1\|2\|3` 读自 frontmatter schema，组件内部 `signalStrength()` 映射到 `strong`/`mid`/`weak`） |
| **career** | 并入 about 单页分区 | `content-card`（沿用） | 简历板块 / 求职材料 |
| **about** | 单页分区 | `content-card`（沿用） | 关于 + Career 子区 |

### 6.4 Ask first（不确定时先问）
- ✅ 任何 `app/globals.css` 改动 → 先确认（设计层不动原则）
- ✅ 任何 `lib/content/schemas.ts` 改动 → 先确认（schema 冻结）
- ✅ 任何 `components/mdx-content.tsx` 新组件 → 先确认（影响所有 MDX 渲染）
- ✅ Career 现有内容（`content/career/*.md`）如何处理 → 合并 / 归档 / 删除，先确认

### 6.5 Never（红线）
- ❌ 删除内容文件（`content/**`）除非用户明确同意
- ❌ 提交 `.env` / `*.db` / `node_modules/`
- ❌ `git push --force` / `git reset --hard` / 任何不可逆 git 操作
- ❌ 在 main 分支直接改（按 CLAUDE.md 先建分支再开发）
- ❌ 引入 Tailwind / CSS-in-JS / 新依赖
- ❌ 修改 frontmatter `status: draft` 内容为 `published`（Hermes/Owner 工作流）
- ❌ 改动 Stripe Press 设计 token

---

## 7. Risks & Mitigations（风险与缓解）

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| 首页重写后 SEO 暂时下降（关键词集中在列表页） | 中 | 中 | 列表页 metadata 完整保留，sitemap 自动覆盖 |
| Career 内容并入 about 后，原 `/career` 链接 404 | 高 | 低 | 在 `app/(site)/career/page.tsx` 保留 1 行 `redirect('/about#career')` 一段时间；或保留薄壳页 |
| 新增 entry-card 组件与现有 ContentCard 重复 | 中 | 中 | 明确分工：entry-card-\* 用于 6 个列表页，ContentCard 用于 about/career/其他通用场景 |
| 学习主题树交互需要 client component | 中 | 低 | 用 `<details>/<summary>` 原生折叠元素，零 JS |
| blog archive 暂无可用数据 | 低 | 低 | 显示 "Archive coming soon" 空状态，与现有 empty-state 风格一致 |

---

## 8. Acceptance Criteria（验收标准）

### 8.1 功能验收
- [ ] 首页 `app/(site)/page.tsx` 不再调用 `getBlogPosts` / `getWeeklyPosts` / `getFeaturedProjects`
- [ ] 首页仅呈现 Hero + 6 个栏目入口卡 + footer
- [ ] `site-nav.tsx` 的 `navItems` 长度 = 6，无 `/career`
- [ ] 6 个列表页（blog/weekly/projects/learning/ai-tracker/topic）分别使用对应 entry-card-\* 组件
- [ ] `career/page.tsx` 被删除或重定向到 `/about#career`
- [ ] about 页面末尾包含 Career section（原 career/page.tsx 内容）
- [ ] `tags/page.tsx` 存在且能列出所有 tag
- [ ] `blog/archive/page.tsx` 存在
- [ ] footer 渲染 3 列：栏目索引 / 最近更新 / RSS & contact
- [ ] `collection-list.tsx` 被 5 个列表页复用

### 8.2 工程验收
- [ ] `npm run lint` 通过
- [ ] `npm run typecheck` 通过
- [ ] `npm run build` 通过
- [ ] `lib/**/*.test.ts` 现有测试不破坏
- [ ] 无新增 npm 依赖
- [ ] `app/globals.css` 中无新增 / 修改的设计 token

### 8.3 设计验收（仅核查"未破坏"，不要求"更好"）
- [ ] 所有列表页维持 Stripe Press 配色（`--background` / `--accent` / `--gold`）
- [ ] 所有列表页维持 0 圆角（`--radius: 0`）
- [ ] 所有列表页维持 1500ms page crossfade（`--transition-slow`）
- [ ] 所有列表页维持 Source Serif 4 / Fraunces 字体
- [ ] 新组件 className 全部使用 CSS 变量，不引入硬编码值

---

## 9. Ambiguities & Defaults（未决项 + 默认值）

| 模糊点 | 默认值 | 理由 |
|--------|--------|------|
| `content/career/*.md` 现有内容如何处理 | 保留文件 + 在 about/page.tsx 重新组装内容 | 避免破坏 SEO 与历史链接；保留 schema 一致性 |
| weekly 是否同时支持 timeline 与卡片切换 | 否，仅 timeline | 避免引入交互复杂度；weekly 本质就是时序日志 |
| blog archive 是否做年份下钻 | v0 仅月度；年份下钻 v1+ | 范围控制 |
| tag 索引是否支持搜索筛选 | 否，仅列出 tag + 文章数 | 搜索用现有 search-dialog |
| footer RSS 入口是否真接 feed | 接 `/rss.xml`（新建） | 后续实施细节，本 spec 仅声明存在 |
| 关于本页是否保留现有交互 | 是 | 风险低，仅追加 Career section |
| `content/career/` 目录是删除还是保留 | 保留为 content 层（在 about/page.tsx 读取） | 与 schema 保持一致；后续若 career 内容独立可快速还原 |
| 设计稿是否需要在 spec 中产出 | 否，按 v0 直接实施 | 用户已确认设计层不再调整 |
| 是否新建 git 分支 | 是，分支名建议 `refactor/site-structure-v1` | 遵循 CLAUDE.md「先建分支再开发」 |
| `/career` 路由重定向保留多久 | 至少保留到下个版本 | 兼容外链 |
| ai-tracker signal 字段来源 | 直接读 frontmatter `signal: 1\|2\|3`（schema 字段）；早期 spec 提到"第一 tag 推断"方案被取代 | 实施时发现 schema 已含 signal 字段，agent 直接读取比 tag 推断更可靠 |

---

## 10. Out-of-spec（明确不做）

- 内容填充（Obsidian → Website 同步）
- 设计稿评审 / Figma
- 移动端适配（沿用现有响应式规则，不专项优化）
- 暗色模式优化（沿用现有 `--theme="dark"` 规则）
- 性能优化（不在本 spec 范围）
- 国际化（双语 / i18n 切换）
- 站点搜索升级（沿用现有 search-dialog）
- 评论系统（giscus 已有）

---

## 附录 A：默认呈现类型示意（非代码，仅描述）

### blog（杂志式列表）
```
┌─────────────────────────────────────────────────────────┐
│  BLOG                                                  │
│  Long-form essays on engineering, AI, and craft.       │
├─────────────────────────────────────────────────────────┤
│  ▢ ─────────────────────────────────────────────────── │
│  2026-06-18  ·  8 min  ·  ai, design                  │
│  Why I rewrote my site in Stripe Press style           │
│  Summary line that wraps to ~2 lines on desktop...     │
├─────────────────────────────────────────────────────────┤
│  ▢ ─────────────────────────────────────────────────── │
│  2026-06-04  ·  12 min  ·  nextjs, mdx                │
│  Building a content layer with gray-matter + zod       │
│  Summary line...                                        │
└─────────────────────────────────────────────────────────┘
```

### weekly（垂直 timeline）
```
┌─────────────────────────────────────────────────────────┐
│  WEEKLY                                                │
│  Weekly log: what I read, built, and learned.          │
├─────────────────────────────────────────────────────────┤
│  ●  2026-W25   ──── Shipped Hermes inbox digest        │
│  │                  Picked up Stripe Press tokens      │
│  │                  Mood: focused                      │
│  │                                                     │
│  ●  2026-W24   ──── Refactored content reader          │
│  │                  Drafted career section             │
│  │                  Mood: tired-but-shipped            │
│  │                                                     │
│  ●  2026-W23   ──── ...                                │
└─────────────────────────────────────────────────────────┘
```

### learning（主题树）
```
┌─────────────────────────────────────────────────────────┐
│  LEARNING                                              │
│  Structured notes by topic.                             │
├─────────────────────────────────────────────────────────┤
│  ▾ Agent Architecture                       (4 posts)   │
│      · Tool routing patterns                          │
│      · Hermes content workflow                        │
│      · Prompt eval for long-context tasks             │
│      · ...                                             │
│                                                         │
│  ▸ Frontend Typography                      (2 posts)   │
│  ▸ Personal Knowledge Systems               (5 posts)   │
│  ▸ Stripe Press Design Language            (3 posts)   │
└─────────────────────────────────────────────────────────┘
```

### ai-tracker（信号流）
```
┌─────────────────────────────────────────────────────────┐
│  AI TRACKER                                            │
│  Signals I'm watching in the AI space.                  │
├─────────────────────────────────────────────────────────┤
│  [STRONG]  2026-06-19                                  │
│  Anthropic releases Claude 4.6 with extended thinking   │
│  Multi-step reasoning cost down ~40%                    │
│  #model-release #pricing                               │
├─────────────────────────────────────────────────────────┤
│  [MID]     2026-06-15                                  │
│  OpenAI ships structured outputs in API                │
│  ...                                                   │
└─────────────────────────────────────────────────────────┘
```

### projects（案例卡片网格）
```
┌─────────────────────────────────────────────────────────┐
│  PROJECTS                                              │
│  Things I built. Each entry is a verifiable record.    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  COVER IMG   │  │  COVER IMG   │  │  COVER IMG   │ │
│  │              │  │              │  │              │ │
│  │  Hermes      │  │  Personal    │  │  ...         │ │
│  │              │  │  Website     │  │              │ │
│  │  Next · TS   │  │  Next · MDX  │  │              │ │
│  │  ★ featured  │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 附录 B：与现有体系的对接点

- **数据流**：所有列表页通过 `lib/content/reader.ts` 已有的 reader 函数拉取；可能新增 2 个 reader：`getBlogArchive()`、`getAllTags()`。
- **样式系统**：所有新 className 通过 `app/globals.css` 的 token 引用；新增 className 时按 `globals.css` 现有命名约定（`.xxx` 一律用 kebab-case 语义命名）。
- **页面动画**：所有列表页自动继承 `PageTransitionWrapper`（`components/animations.tsx`）的 1500ms crossfade。
- **MDX 渲染**：本轮不新增 MDX 组件。
- **搜索**：`search-dialog.tsx` 已支持跨栏目搜索，无需改动。
- **SEO**：`json-ld.tsx` 已存在；新页面按需接入。
- **Git 工作流**：按 CLAUDE.md，先建 `refactor/site-structure-v1` 分支，再开发。

---

## 11. v0.2 增量规约 — About 去冗 + Tags 跨 collection + 词云

### 11.1 Objective（v0.2 三目标）

#### G1 — About 页去冗 + 内容重新优化

**现状**：`/about` 共 9 个 section，300+ 行，过长且多处冗余：

| # | 冗余点 | 行号 | 影响 |
|---|--------|------|------|
| A1 | "项目经历"与 `/projects` 路由重复 | `app/(site)/about/page.tsx` L73–103, L220 | 两处维护成本高、信息易不一致 |
| A2 | "专业技能"+"常用工具"两节重叠 | L105–147 | 阅读疲劳、信息密度低 |
| A3 | Profile 段 4 段过长 | L195–209 | 关键信息淹没 |
| A4 | Career section 三层嵌套 | L257–301（panels + content items + project evidence） | 视觉层级混乱 |
| A5 | 整页无信息架构分层 | 9 个 section 同一视觉权重 | 读者无锚点 |
| A6 | `/projects/[slug]` 已存在但 About 仍全量展示 | L73–103 | 数据来源不唯一 |

**目标形态**：
- section 总数 ≤ 6
- 项目经历 → 删除，替换为 1 句引导 + `/projects` 链接
- 专业技能 + 常用工具 → 合并为 1 节"Skills & Stack"
- Profile → ≤ 2 段
- Career section 的重复 project evidence list → 删除
- **保留**：`id="career"` 锚点（外链依赖）/ "Why this site exists" / 元数据

#### G2 — Tags 跨 6 collection 聚合 + 分页架构预留

**现状**：`app/(site)/tags/[tag]/page.tsx` 只查 `blog + weekly`：

```ts
// 现状
const [blog, weekly] = await Promise.all([getBlogPosts(), getWeeklyPosts()]);
// ❌ 漏掉 projects / career / learning / ai-tracker
```

**问题**：
- AI Tracker / Projects / Learning / Career 的 tag 一旦被点中 → 404
- `getAllTags()` 已经聚合了 6 个 collection 的 tag（`TagCount.kinds`），但详情页没用到这个聚合

**目标形态**：
- `/tags/[tag]` 跨 6 collection 查询，按 collection 分组呈现
- 每组用对应的 EntryCard 组件（blog → EntryCardBlog、weekly → EntryCardWeekly、ai-tracker → EntryCardAiTracker、projects → EntryCardProject、learning → EntryCardLearning）
- `lib/content/reader.ts` 新增 `getContentByTag(tag: string, opts?: { page?: number; pageSize?: number })`
- **分页架构预留**：`opts` 参数签名先设计，page.tsx 调用时仍传无参；未来真出现 50+ 条再启用

#### G3 — 词云页 `/tags/cloud`

**形态**：
- 独立路由 `/tags/cloud`
- Server Component，复用 `getAllTags()` 返回的 `count` 字段
- font-size 4 档（small / medium / large / x-large），按 count 分布映射
- 点击 tag 跳 `/tags/[tag]`
- `/tags` 与 `/tags/cloud` 互相跳转链接
- WCAG AA：字号差为唯一区分，**不靠颜色差**

---

### 11.2 Project Structure（v0.2 新增 ⭐ / 改造 🔧）

```
app/(site)/
├── about/
│   └── page.tsx            🔧 重写去冗（≤ 6 section）
├── tags/
│   ├── page.tsx            🔧 加"切换到词云"链接
│   ├── [tag]/page.tsx      🔧 重写跨 6 collection + 分页架构预留
│   └── cloud/              ⭐ 新增目录
│       └── page.tsx        ⭐ 词云页（font-size 4 档）

lib/content/
├── reader.ts               🔧 新增 getContentByTag(tag, opts?)
└── reader.test.ts          🔧 新增 getContentByTag 单元测试

app/globals.css             🔧 +.tag-cloud-* + .about-toc-*（不动 token）
```

### 11.3 路由表（v0.2 增量）

| 路由 | 状态 | 改动 |
|------|------|------|
| `/about` | 🔧 | 去冗重写 |
| `/tags` | 🔧 | 加"切换到词云"链接 |
| `/tags/[tag]` | 🔧 | 重写跨 collection；分页架构预留 |
| `/tags/cloud` | ⭐ | 新增词云页 |

---

### 12. Code Style（v0.2 新约定）

**沿用 §4.1 + §4.2**。本轮新增：

- **`getContentByTag` 函数签名**（架构预留分页）：
  ```ts
  export type GetContentByTagOptions = {
    page?: number;     // 1-based，未来启用
    pageSize?: number; // 默认 20，未来启用
  };

  export type TaggedContentByKind = {
    blog: BlogPost[];
    weekly: WeeklyPost[];
    projects: ProjectPost[];
    career: CareerPost[];
    learning: LearningPost[];
    "ai-tracker": AiTrackerPost[];
  };

  export async function getContentByTag(
    tag: string,
    opts?: GetContentByTagOptions,
  ): Promise<{
    items: TaggedContentByKind;
    totalByKind: Record<keyof TaggedContentByKind, number>;
    // 未来启用：page / pageSize / totalPages
  }>;
  ```
  v0.2 阶段：`opts` 参数接受但忽略；返回值不带分页字段

- **词云页 className**：
  ```css
  .tag-cloud              /* 容器 */
  .tag-cloud-item         /* 单个 tag */
  .tag-cloud-item--xs     /* count 1 */
  .tag-cloud-item--sm     /* count 2-3 */
  .tag-cloud-item--md     /* count 4-7 */
  .tag-cloud-item--lg     /* count 8+ */
  ```

- **About 页 className**：
  ```css
  .about-toc               /* 可选 toc 锚点导航 */
  .about-subsection--lead  /* 主 section 视觉强化（不动 token） */
  ```

---

### 13. Testing Strategy（v0.2 测试点）

#### 13.1 单元测试（必加）

新增 `getContentByTag` 单元测试：

```ts
// lib/content/reader.test.ts（追加）
test("getContentByTag: matches across all 6 collections", async () => {
  const result = await getContentByTag("AI");
  // 至少 1 个 collection 有命中（取决于 fixture）
  expect(Object.values(result.items).some((arr) => arr.length > 0)).toBe(true);
});

test("getContentByTag: case-insensitive", async () => {
  const upper = await getContentByTag("AI");
  const lower = await getContentByTag("ai");
  expect(upper.items.blog.length).toBe(lower.items.blog.length);
});

test("getContentByTag: empty tag returns all empty", async () => {
  const result = await getContentByTag("__nonexistent_tag__");
  expect(Object.values(result.items).every((arr) => arr.length === 0)).toBe(true);
});
```

#### 13.2 手工核查（v0.2 验收）

1. `/about` 渲染 ≤ 6 section，`id="career"` 锚点存在
2. `/tags/AI`（任一存在的跨 collection tag）渲染 6 个分组
3. `/tags/only-in-ai-tracker`（只在 AI Tracker 出现的 tag）不 404
4. `/tags/cloud` 渲染词云，font-size 4 档可见
5. `/tags` ↔ `/tags/cloud` 互链正常

---

### 14. Boundaries（v0.2）

#### 14.1 In scope（必做）

| # | 项 | 验收点 |
|---|----|--------|
| 1 | About 页去冗 | ≤ 6 section，`id="career"` 保留 |
| 2 | `/tags/[tag]` 跨 6 collection | 任意 tag 不 404，按 collection 分组 |
| 3 | `getContentByTag` + 单元测试 | 3 个新测试通过 |
| 4 | `getContentByTag` opts 参数签名 | 编译通过，运行时忽略 |
| 5 | `/tags/cloud` 词云页 | font-size 4 档，可点击 |
| 6 | `/tags` ↔ `/tags/cloud` 互链 | 顶部切换链接 |
| 7 | SPEC.md / plan.md / todo.md 同步 | 三文件更新 |

#### 14.2 Out of scope（v0.2 不做）

- ❌ 内容规范化（项目 frontmatter 审计、补字段）— 用户已确认不做
- ❌ Tag 详情页 UI 分页 — 架构预留即可
- ❌ 词云加点击动画 / 3D / 力导向图 — 保持编辑式静态
- ❌ 改 design token
- ❌ 改 frontmatter schema
- ❌ 改 Hermes 工作流
- ❌ 新增 npm 依赖
- ❌ About 页加 i18n

#### 14.3 Ask first（v0.2 不确定时先问）

- ✅ About 内容大段删除前先 grep 是否有外链引用
- ✅ About 中"专业技能 + 常用工具"合并后的命名（Skills & Stack / Skills / Capabilities）→ 用默认 Skills & Stack
- ✅ Tag 详情页 collection 顺序 → 用默认 blog → weekly → projects → ai-tracker → learning → career

---

### 15. Ambiguities Resolved（v0.2 已采纳的默认值）

| # | 模糊点 | 默认值 | 状态 |
|---|--------|--------|------|
| 1 | "爆品页面" 含义 | = About 页去冗 | ✅ 用户澄清 |
| 2 | 词云路径 | `/tags/cloud` 独立路由 | ✅ |
| 3 | 词云强弱映射 | font-size 4 档（不动 color/opacity） | ✅ |
| 4 | 内容规范化 | v0.2 不做 | ✅ |
| 5 | tag 分页 | 架构预留不实现 | ✅ |
| 6 | 词云是否要搜索/筛选 | 否，仅可视化 + 点击跳转 | 推荐默认 |
| 7 | About 去冗幅度 | section 总数 ≤ 6，保留个人声音 | 推荐默认 |
| 8 | Tag 详情页 collection 分组顺序 | 按"内容生产频次"：blog > weekly > ai-tracker > projects > learning > career | 推荐默认 |

---

### 16. Risks & Mitigations（v0.2 特有）

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| About 内容删除后 SEO 关键词丢失 | 中 | 中 | 保留 `id="career"` 锚点；元数据（title/description）不变 |
| 跨 collection 查询性能（首次慢） | 低 | 低 | `getAllTags` 已聚合；`getContentByTag` 复用同一 group-by 逻辑；后续可加缓存 |
| 词云 4 档字号分布不均（多数 tag 都是 count=1） | 中 | 中 | 启用对数缩放：`bucket = floor(log2(count + 1))`，避免单档压死 |
| About 删段后个人声音变薄 | 低 | 中 | 保留 Profile 第一段 + Why this site exists + Career section 主体；只砍重复段 |

---

### 17. Acceptance Criteria（v0.2 验收）

#### 17.1 About 去冗

- [ ] About 页面总 section 数 ≤ 6
- [ ] "项目经历"section 已删除，改为 1 句引导 + `/projects` 链接
- [ ] "专业技能"+"常用工具"合并为单节
- [ ] Profile 从 4 段砍到 ≤ 2 段
- [ ] Career section 的重复 project evidence list 删除
- [ ] `id="career"` 锚点保留
- [ ] "/career" → "/about#career" 重定向仍工作

#### 17.2 Tags 跨 collection

- [ ] `/tags/[tag]` 跨 6 collection 聚合（blog / weekly / projects / career / learning / ai-tracker）
- [ ] 任意 tag 点击均不 404（即使只在 1 个 collection 出现）
- [ ] 按 collection 分组，每组用对应的 EntryCard 组件
- [ ] `lib/content/reader.ts` 新增 `getContentByTag` + 3 个单元测试通过
- [ ] `getContentByTag` 接受可选 `{ page, pageSize }` 参数（架构预留，运行时忽略）

#### 17.3 词云页

- [ ] `/tags/cloud` 可访问
- [ ] font-size 4 档（xs / sm / md / lg）
- [ ] 点击 tag 跳到 `/tags/<tag>`
- [ ] `/tags` 与 `/tags/cloud` 互相跳转链接
- [ ] WCAG AA：通过（字号差为唯一区分）

#### 17.4 工程

- [ ] `npm run lint` 0 errors
- [ ] `npm run typecheck` 0 errors
- [ ] `npm run build` 成功
- [ ] `npm test` 通过（含新增 3 个 `getContentByTag` 测试）
- [ ] SPEC.md / plan.md / todo.md 同步本次改动
- [ ] v0.2 内容合并到一个新分支（建议 `refactor/tags-v2` 或 `refactor/site-structure-v2`），不直接动 main

#### 17.5 设计未破坏

- [ ] 所有页面维持 Stripe Press 配色 / 0 圆角 / 1500ms 动效
- [ ] 所有新 className 使用 CSS 变量，不引入硬编码值

---

**v0.2 规约完成。下一步：/plan 拆任务 → /dispatch 执行。**

---

## 18. v0.3 增量规约 — Book List 新栏目

### 18.1 版本演进（追加）

| 版本 | 范围 | 状态 | 关键改动 |
|------|------|------|----------|
| v0.1 | 信息架构升级（v1） | ✅ 合入 main | 6 个列表页差异化、Career 并入 About、tag 索引 + blog archive、footer 3 列、P2/P3 清理 |
| v0.2 | About 去冗 + Tags 跨 collection + 词云 | ✅ 合入 main | About 9→6 sections / `getContentByTag` reader + 3 tests / `/tags/cloud` 词云页 / 分页架构预留 |
| **v0.3** | **Book List 新栏目** | ✅ 合入 feat/book-list | 新增第 7 个 collection `book-list`（card 列表 + 读书笔记详情 + 跨集合接入 + Hermes 工作流） |
| **v0.4** | **transitions-dev 接入 + 博客动效** | **✅ 合入 feat/transitions-dev-blog** | transitions-dev skill 安装（21 过渡）+ globals.css 变量注入（Stripe Press 覆写 + 暗色模式 + a11y 守卫）+ 4 client component 过渡（image-lightbox P6 / search-dialog P5 / tabs P16 / copy-button P10）+ article-layout reveal（P18 header stagger + P3 footer panel）+ 6 collection [slug]/page.tsx 接入 slot props |

### 18.2 v0.3 本规约新增的 1 个目标

| # | 目标 | 范围 |
|---|------|------|
| **G1** | **Book List 新栏目落地** | 7 个文件改动 + 6 个文件新增 + Hermes 工作流 + inbox 子目录，按 5 个 vertical slices 实施 |

### 18.3 Git 工作流

- **分支名建议**：`feat/book-list`（独立 feature 分支，非 `refactor/*`）
- **commit 策略**：每个 slice 一个 commit，commit message 遵循 Conventional Commits（`feat(book-list): ...`）
- **不在 main 上直接改**——遵循 CLAUDE.md「先建分支再开发」

### 18.4 与 v0.2 的关系

- 复用 v0.2 的 `getContentByTag` 跨集合聚合架构（v0.3 扩展为 7 collection）
- 复用 v0.2 的 `CollectionList` 列表骨架
- 复用 v0.1 的 `entry-card-*` 卡片组件命名约定
- 不复用：v0.2 的 `tag-cloud` 不需要改（book-list 自动接入）
- 不破坏：现有 6 个 collection 任何字段

---

## 19. Objective（v0.3 目标）

### 19.1 一句话
在 6 collection 体系中新增第 7 个 `book-list` collection：列表页用 card 卡片展示「书名 / 作者 / 类别」三件套，点击进入对应书的读书笔记详情页。

### 19.2 关键结果（必须）
1. **新路由**：`/book-list`（列表页）+ `/book-list/<slug>`（详情页）双路由可访问。
2. **card 卡片显示三件套**：每张 card 显示**书名（title）+ 作者（author）+ 类别（genre）**。tags 在 card 下方可选显示。
3. **Header 入口**：`site-nav.tsx` 的 `navItems` 第 5 项为 Book List（在 Learning 和 Projects 之间）。
4. **首页 portal 入口**：`app/(site)/page.tsx` 的 `portalEntries` 含 Book List 入口卡。
5. **footer 接入**：`SectionFooter` 3 列中「Sections」含 Book List 链接，「Recent」含最新一条已 published 的书。
6. **跨集合接入**：`getContentByTag` / `getAllTags` 接入 book-list；`/tags/[tag]` 分组含 Book List；`/api/search` 搜索源含 book-list；sitemap 含 `/book-list` 静态页 + 全部 published 详情页。
7. **Hermes 工作流**：`content/inbox/book-notes/` 子目录 + `docs/agent/book-list-template.md` 模板 + `.claude/commands/book-list-from-inbox.md` 命令。
8. **设计系统对齐**：Stripe Press（Fraunces 衬线、oklch 暖调、0 圆角、1500ms 慢 crossfade），不动 token。
9. **内容边界**：`status: published` 才公开渲染；`status: draft` 仅本地可见。Hermes 永远生成 draft，Coya 手动改 published。
10. **首版无 RSS**（与 ai-tracker 区别，book-list 不是信号流）。

### 19.3 不在范围内（红线）
- ❌ 设计 token（`app/globals.css` 中 CSS 变量、字体、半径、阴影、动效曲线）
- ❌ MDX 组件注册表新增（读书笔记用现有 `MdxContent` 即可）
- ❌ 现有 6 个 collection 任何 schema 字段改动
- ❌ 新增 npm 依赖
- ❌ RSS feed（ai-tracker 才有；book-list 首版不做）
- ❌ 阅读状态机（reading / read / want-to-read / dnf）
- ❌ 评分字段（1-5 星或 10 分制）
- ❌ ISBN / 出版社 / 出版年 / 封面图（v0.3 schema 极简）
- ❌ 跨书「同主题 / 同作者」聚合页
- ❌ 「今年读了多少本」统计仪表盘

---

## 20. Project Structure（v0.3 文件树变更）

### 20.1 按 5 个 Slices 拆分

#### **Slice A — 基础设施**（schemas + reader + icon）

```
lib/content/
├── schemas.ts               🔧 加 bookListSchema（base + author + genre）+ schemaByKind["book-list"] + BookListPost 类型 + SiteContent union
└── reader.ts                🔧 加 getBookListPosts() + CollectionMap["book-list"]: BookListPost

components/
└── icons0.tsx               🔧 加 Icons0Book（参照 Icons0Calendar 风格的 Carbon SVG）
```

**验收**：`npm run typecheck` 通过；0 条 book-list 内容时无错误；`getBookListPosts()` 返回 `BookListPost[]`。

#### **Slice B — 列表页 + 卡片组件**

```
components/
└── entry-card-book-list.tsx   ⭐ 新增：card 组件，props = { href, title, author, genre, summary?, tags? }

app/(site)/
└── book-list/
    └── page.tsx               ⭐ 新增：列表页（CollectionList 骨架 + card-grid 网格 + 空态）

app/globals.css                🔧 +.book-list-grid +.book-card +.book-card-meta（不动 token，复用 --space-* --accent-* --gold）
```

**验收**：`/book-list` 渲染 card 网格；0 条内容时显示 empty-state（"尚无书籍 →"）；点击 card 跳 `/book-list/<slug>`（即使 404 也行，slice C 再补详情页）。

#### **Slice C — 详情页 + Header 入口 + 首页 portal + footer**

```
app/(site)/
└── book-list/
    └── [slug]/
        └── page.tsx           ⭐ 新增：详情页（ArticleLayout + book 元信息块 + MdxContent + ShareButtons）

components/
├── site-nav.tsx               🔧 navItems 数组插入 Book List 在第 5 位（Learning 之后、Projects 之前）
├── section-footer.tsx         🔧 Sections 列加 Book List 链接；Recent 列加 latestBook（与 latestBlog/latestWeekly 并列）
└── ...（其他不动）

app/(site)/
└── page.tsx                   🔧 portalEntries 加 Book List 入口（用 ContentCard 渲染）
```

**验收**：Header 第 5 项 = Book List；首页 portal 6→7 个入口卡；footer Sections 含 Book List 链接；footer Recent 在 latestBlog + latestWeekly 后显示 latestBook；`/book-list/<slug>` 详情页可渲染 frontmatter 元信息 + MDX 正文。

#### **Slice D — 跨集合接入（tags + search + sitemap + 测试）**

```
lib/content/
├── reader.ts                  🔧 getContentByTag / getAllTags / emptyKindCounts 接入 book-list
│                                + getContentByTag 返回类型 TaggedContentByKind 加 book-list
│                                + getAllTags bump() 循环加 book-list
└── reader.test.ts             🔧 现有 3 个测试改 "6 collections" → "7 collections"；
                                 新增 1 个 book-list 专项测试（验证 getBookListPosts + getContentByTag 跨 book-list 命中）

app/(site)/
└── tags/
    └── [tag]/
        └── page.tsx           🔧 加 Book List 分组区块（用 entry-card-book-list 渲染）

app/api/
└── search/
    └── route.ts               🔧 搜索源加 getBookListPosts() 循环

app/
└── sitemap.ts                 🔧 静态页加 /book-list（priority 0.7，changeFrequency weekly）；
                                 详情页加 bookListUrls（priority 0.5，changeFrequency monthly）
```

**验收**：
- `/tags/<book-list 已用 tag>` 分组含 Book List
- `/tags/<只在 book-list 出现的 tag>` 不 404
- Cmd+K 搜到 book-list 内容
- `npm run sitemap` / curl `/sitemap.xml` 含 book-list 条目
- `npm test` 通过（含 4 个 reader 测试，原 3 个 + 新增 1 个）

#### **Slice E — Hermes 工作流（template + command + inbox）**

```
content/
├── inbox/
│   ├── book-notes/            ⭐ 新增目录（与 ai-notes/ 并列）
│   │   └── README.md          ⭐ 子目录说明（参照 ai-notes/README.md）
│   └── ai-notes/              （不动）
└── README.md                  🔧 加 book-list/ 一节 + inbox 加 book-notes/

docs/agent/
├── book-list-template.md      ⭐ 新增：内容模板（参照 ai-tracker-template.md）
└── inbox-to-content-workflow.md  🔧 加 book-notes 转化链路（与 ai-notes 并列）

.claude/commands/
└── book-list-from-inbox.md    ⭐ 新增：从 inbox/book-notes/ 生成 status: draft 草稿（参照 ai-tracker-from-inbox.md）
```

**验收**：
- Hermes 调 `/book-list-from-inbox` 能从 `content/inbox/book-notes/<file>.md` 生成 `content/book-list/<date-slug>.md`
- 生成内容 `status: draft`，Coya 手动改 `published`
- `content/README.md` 列出 book-list/ 一节
- `inbox-to-content-workflow.md` 5 条转化链路（原有 4 条 + book-notes 新增）

### 20.2 完整文件树（5 个 slice 完成后）

```
app/(site)/
├── book-list/                 ⭐ 新增目录
│   ├── page.tsx               ⭐ Slice B
│   └── [slug]/
│       └── page.tsx           ⭐ Slice C
├── ...（其他路由不动）
└── tags/
    └── [tag]/
        └── page.tsx           🔧 Slice D

components/
├── entry-card-book-list.tsx   ⭐ 新增（Slice B）
├── icons0.tsx                 🔧 +Icons0Book（Slice A）
├── site-nav.tsx               🔧 +Book List 入口（Slice C）
├── section-footer.tsx         🔧 +Book List Sections/Recent（Slice C）
└── ...（其他不动）

lib/content/
├── schemas.ts                 🔧 +bookListSchema（Slice A）
├── reader.ts                  🔧 +getBookListPosts + 跨集合接入（Slice A + D）
└── reader.test.ts             🔧 测试更新（Slice D）

app/
├── page.tsx                   🔧 +portalEntries（Slice C）
├── sitemap.ts                 🔧 +book-list 条目（Slice D）
└── api/search/route.ts        🔧 +book-list 搜索源（Slice D）

app/globals.css                🔧 +.book-list-grid +.book-card +.book-card-meta（Slice B）

content/
├── book-list/                 ⭐ 新增目录（运行时由 Hermes/Coya 创建）
└── inbox/
    └── book-notes/            ⭐ 新增目录（Slice E）

docs/agent/
├── book-list-template.md      ⭐ 新增（Slice E）
└── inbox-to-content-workflow.md  🔧 +book-notes 链路（Slice E）

.claude/commands/
└── book-list-from-inbox.md    ⭐ 新增（Slice E）

SPEC.md                        🔧 v0.3 章节（本次）
```

### 20.3 路由表（v0.3 增量）

| 路由 | 状态 | 改动 |
|------|------|------|
| `/book-list` | ⭐ | 列表页，card 网格 |
| `/book-list/<slug>` | ⭐ | 详情页，读书笔记 |
| `/tags/<tag>` | 🔧 | 分组加 Book List（仅当该 tag 在 book-list 出现时） |
| `/sitemap.xml` | 🔧 | 加 `/book-list` 静态页 + 全部 published 详情页 |

---

## 21. Code Style（v0.3 新约定）

### 21.1 沿用现有（CLAUDE.md §4 + SPEC §4.1-4.2）
- Server Component 优先
- kebab-case 文件名
- 不引入 `src/`
- TypeScript strict
- 全局 CSS + 语义 className，不引入新样式方案

### 21.2 v0.3 新增约定

#### bookListSchema 字段定义（`lib/content/schemas.ts`）

```ts
export const bookListSchema = baseContentSchema.extend({
  kind: z.literal("book-list"),
  author: z.string(),                 // 必填，作者名
  genre: z.string(),                  // 必填，粗分类（"商业 / 文学 / 技术 / 历史 / 其他"）
  tags: stringArraySchema,            // 必填可空，细粒度标签
  lang: z.string().default("zh"),
});
```

**字段语义**：
- `title` — 书名（卡片主标题）
- `author` — 作者
- `genre` — 类别（粗分类，单字段，便于卡片展示）
- `tags` — 细粒度标签（2-5 个，自由发挥）
- `date` — 读完日期（YYYY-MM-DD；与现有所有 collection 的 `date` 语义统一）
- `summary` / `englishSummary` — 与 blog 相同
- `status` — 永远 `draft` 由 Hermes 生成，Coya 手动改 `published`

**不引入的字段**（v0.3 极简）：
- ❌ `isbn` / `publisher` / `publishedYear` / `cover` / `rating` / `readingStatus`

#### getBookListPosts 签名（`lib/content/reader.ts`）

```ts
export async function getBookListPosts(
  includeDrafts = false,
): Promise<BookListPost[]> {
  const items = await getCollection("book-list", includeDrafts);
  return items.filter((item): item is BookListPost => item.kind === "book-list");
}
```

**接入点**：
- `CollectionMap` 加 `"book-list": BookListPost`
- `TaggedContentByKind` 加 `bookList: BookListPost[]`
- `emptyKindCounts` 加 `bookList: 0`
- `getContentByTag` 加 `getBookListPosts()` 并行拉取 + `bookListMatches` 过滤
- `getAllTags` 在 `bump` 循环加 `for (const post of bookList) for (const tag of post.tags) bump(tag, "book-list")`

#### entry-card-book-list props（`components/entry-card-book-list.tsx`）

```ts
type EntryCardBookListProps = {
  href: string;
  title: string;        // 书名
  author: string;       // 作者
  genre: string;        // 类别
  summary?: string;     // 可选摘要
  date?: string;        // 可选读完日期
  tags?: string[];      // 可选细粒度标签
};
```

**视觉结构**（参照 `content-card.tsx` 风格，零圆角、暖调）：
```
┌─────────────────────────────┐
│ <genre pill>                │  ← 类目徽章
│                             │
│ Book Title (h3)             │  ← 书名（Fraunces 衬线）
│ by Author                   │  ← 作者（小一号，灰）
│                             │
│ Summary text (optional)...  │  ← 可选摘要
│                             │
│ #tag1 #tag2 #tag3           │  ← 可选细粒度标签
│                             │
│ Read  ↗                     │  ← 跳转提示
└─────────────────────────────┘
```

#### 详情页 frontmatter 块（`app/(site)/book-list/[slug]/page.tsx`）

参照 `ai-tracker/[slug]/page.tsx` 的 `.ai-tracker-source` 块：

```
┌─ Book Info ─────────────────┐
│ Author    │ Coya            │
│ Genre     │ 商业            │
│ Tags      │ #管理 #效率     │
│ Finished  │ 2026-06-15      │
└─────────────────────────────┘
```

#### globals.css 新增 className（不动 token）

```css
.book-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-l);  /* 沿用 v0.1 token */
}

.book-card {
  /* 复用 .content-card 的 padding / border / hover，仅覆盖 grid-item 布局 */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.book-card-meta {
  display: flex;
  gap: var(--space-s);
  align-items: center;
  color: var(--accent);  /* 类别徽章用 accent 色 */
  font-size: var(--font-size-small);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**禁止**：
- ❌ 新增 CSS 变量（token 冻结）
- ❌ 新增硬编码值（color / spacing / font-size 全部走变量）
- ❌ 改 `globals.css` 任何已有 token

#### 不可触碰的红线
- ❌ 不动 `app/globals.css` 的设计 token
- ❌ 不动 `components/mdx-content.tsx`
- ❌ 不动 `lib/content/reader.ts` 现有 6 个 reader（仅追加 `getBookListPosts`）
- ❌ 不动 `lib/content/schemas.ts` 现有 6 个 schema（仅追加 `bookListSchema`）
- ❌ 不动现有 6 个 collection 的内容文件

---

## 22. Testing Strategy（v0.3）

### 22.1 单元测试（`lib/content/reader.test.ts` 追加）

**Slice D 必加 1 个测试**（保留 v0.2 已有 3 个 + 描述从 "6 collections" 改为 "7 collections"）：

```ts
// lib/content/reader.test.ts（追加 + 修改）
test("getContentByTag: matches across all 7 collections (incl. book-list)", async () => {
  const result = await getContentByTag("__test_tag_zzz__");
  // 即便 fixture 中无匹配，也验证 7 collection 都被查询（kinds 字段覆盖）
  assert.equal(
    Object.keys(result.totalByKind).length,
    7,
    "expected 7 collections in totalByKind",
  );
  assert.ok("bookList" in result.totalByKind);
  assert.ok("bookList" in result.items);
});
```

**其他 3 个原测试**：把描述中的 "6 collections" 改为 "7 collections"，逻辑不变。

### 22.2 手工验收（每个 slice 的关键点）

| Slice | 关键验收点 |
|-------|------------|
| A | `tsc --noEmit` 通过；`getBookListPosts()` 返回 `BookListPost[]`；0 条内容时不报错 |
| B | `/book-list` 渲染 card 网格；0 条时显示 empty-state；点击 card 跳详情（即使 404，slice C 再修） |
| C | Header 第 5 项是 Book List；首页 portal 7 个入口；footer 3 列含 Book List；详情页 frontmatter 元信息 + MDX 正文均渲染 |
| D | tag 详情页 Book List 分组存在；Cmd+K 搜到 book；sitemap 含 book-list；`npm test` 通过 |
| E | Hermes 调 `/book-list-from-inbox` 能生成 draft；`content/README.md` 列出 book-list/ |

### 22.3 工程验证（必跑）

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # Next.js production build
npm test            # node --test lib/**/*.test.ts
```

### 22.4 不引入端到端测试
v0.3 范围清晰，跨集合聚合靠 reader 单测 + 手工核查覆盖。不引入 Playwright / Cypress。

---

## 23. Boundaries（v0.3）

### 23.1 In scope（5 个 slices 必做）

| Slice | # | 项 | 验收点 |
|-------|---|----|--------|
| A | 1 | `bookListSchema` 含 author + genre 单字段 | schemas.ts 通过 typecheck |
| A | 2 | `getBookListPosts()` reader | reader.ts 通过 typecheck |
| A | 3 | `Icons0Book` SVG 图标 | icons0.tsx 通过 typecheck |
| B | 4 | `entry-card-book-list` 组件 | `/book-list` 列表页可用 |
| B | 5 | `/book-list` 列表页 + `.book-list-grid` 样式 | card 网格渲染 |
| C | 6 | `/book-list/[slug]` 详情页 | book 元信息块 + MDX 正文 |
| C | 7 | `site-nav.tsx` navItems 第 5 项 = Book List | 视觉验证 |
| C | 8 | `app/(site)/page.tsx` portalEntries 加 Book List | 7 个入口卡 |
| C | 9 | `section-footer.tsx` Sections + Recent 加 Book List | footer 3 列渲染 |
| D | 10 | `getContentByTag` / `getAllTags` 接入 book-list | reader.test.ts 通过 |
| D | 11 | `/tags/[tag]` 加 Book List 分组 | tag 详情页有 Book List |
| D | 12 | `/api/search` 加 book-list 搜索源 | Cmd+K 搜到 book |
| D | 13 | `sitemap.ts` 加 book-list 条目 | sitemap.xml 含 book-list |
| E | 14 | `content/inbox/book-notes/` 子目录 + README | Hermes 可写 |
| E | 15 | `docs/agent/book-list-template.md` | 内容模板 |
| E | 16 | `.claude/commands/book-list-from-inbox.md` | Hermes 命令 |
| E | 17 | `content/README.md` + `inbox-to-content-workflow.md` 同步 | 文档同步 |

### 23.2 Out of scope（v0.3 不做）
- ❌ 设计 token 任何改动
- ❌ MDX 组件库新增（除 entry-card-book-list）
- ❌ 现有 6 个 collection 任何 schema 字段改动
- ❌ 现有 6 个 collection 任何 reader 函数改动（仅追加 `getBookListPosts`）
- ❌ Hermes 现有 5 个命令任何改动
- ❌ 新增 npm 依赖
- ❌ RSS feed（book-list 不是信号流）
- ❌ 阅读状态机 / 评分 / ISBN / 出版社 / 出版年 / 封面图
- ❌ 跨书聚合页（同主题 / 同作者）
- ❌ 「今年读了多少本」统计仪表盘
- ❌ 文章详情页 article-layout / toc / related-posts 体系改动

### 23.3 Ask first（v0.3 不确定时先问）
- ✅ `lib/content/schemas.ts` 任何修改（仅追加 bookListSchema，不动其他）
- ✅ `lib/content/reader.ts` 任何修改（仅追加 + 接入跨集合聚合）
- ✅ `app/globals.css` 任何修改（仅追加 3 个新 className，不动 token）
- ✅ 任何 `*.md` 内容文件从 `draft` 改为 `published`（Coya 手动）

### 23.4 Never（v0.3 红线）
- ❌ 删除 `content/**` 任何文件
- ❌ 提交 `.env` / `*.db` / `node_modules/`
- ❌ `git push --force` / `git reset --hard` / 任何不可逆 git 操作
- ❌ 在 main 分支直接改
- ❌ 引入 Tailwind / CSS-in-JS / 新依赖
- ❌ 改动 `app/globals.css` 的设计 token
- ❌ 改动 `components/mdx-content.tsx`
- ❌ 改动现有 6 个 collection 的任何 schema 字段
- ❌ 改动现有 6 个 collection 的任何 reader 函数（仅追加新函数）
- ❌ 改动 `app/(site)/page.tsx` 的现有 6 个 portalEntries 顺序或文案

---

## 24. Ambiguities Resolved（v0.3 已采纳的默认值）

| # | 模糊点 | 默认值 | 状态 |
|---|--------|--------|------|
| 1 | 是否要阅读状态机 | 否 | ✅ 推荐默认 |
| 2 | 是否要评分 / ISBN / 出版年 | 否 | ✅ 推荐默认 |
| 3 | `date` 字段语义 | 读完日期（与现有 collection 一致） | ✅ 推荐默认 |
| 4 | `tags` 必填 vs 可选 | 必填可空（沿用约定 `stringArraySchema.default([])`） | ✅ 沿用 |
| 5 | 类别用单字段 vs tag | 单字段 `genre` | ✅ 推荐默认 |
| 6 | 路由段名 | `book-list` ↔ `"book-list"` 完全一致 | ✅ 推荐默认 |
| 7 | inbox 子目录 | `content/inbox/book-notes/` | ✅ 推荐默认 |
| 8 | 首版是否做 RSS | 否（与 ai-tracker 区别） | ✅ 推荐默认 |
| 9 | card 视觉风格 | content-card 网格（参照 portal） | ✅ 推荐默认 |
| 10 | spec 文档策略 | 追加 v0.3 章节到 SPEC.md | ✅ 用户确认 |
| 11 | 执行模式 | 5 个 vertical slices | ✅ 用户确认 |
| 12 | Header 入口位置 | Learning 之后、Projects 之前（第 5 项） | ✅ 用户确认 |
| 13 | Git 分支名 | `feat/book-list` | ✅ 推荐默认 |
| 14 | Commit 策略 | 每 slice 一个 commit（`feat(book-list): ...`） | ✅ 推荐默认 |
| 15 | 类别枚举值 | 自由字符串（不强制枚举），推荐用"商业 / 文学 / 技术 / 历史 / 哲学 / 科学 / 其他" | ✅ 推荐默认 |

---

## 25. Risks & Mitigations（v0.3 特有）

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| Slice A 没做完就开 Slice B，导致 B 引用不存在的 reader | 高 | 高 | 严格按依赖顺序：先 A → B → C → D → E；每个 slice 完成后跑 `npm run typecheck` |
| `entry-card-book-list` 与 `content-card` 视觉重复 | 中 | 中 | 明确分工：book-list 用专属 `entry-card-book-list`（genre 徽章 + 三件套），content-card 留给 portal / about |
| `getContentByTag` 跨 7 collection 性能下降（每次都拉所有 collection） | 低 | 低 | v0.2 已聚合；v0.3 仅 +1 个 collection 拉取；后续可加缓存 |
| sitemap 详情页数量爆炸 | 低 | 低 | 只列 `status: published`；与 ai-tracker 一致 |
| Hermes 误把 draft 改成 published | 中 | 高 | `book-list-from-inbox.md` 命令明确禁止；Coya 手动审阅 |
| 类别枚举不规范（Coya 自由发挥导致 genre 拼写不一致） | 中 | 低 | 模板里推荐常见值（商业 / 文学 / 技术 / 历史 / 哲学 / 科学 / 其他），不强制；Coya 自定 |
| `/book-list` 列表页 0 条内容时点 card 跳 404 | 中 | 低 | Slice C 完成前 0 条 → 列表页显示 empty-state（"尚无书籍"），不点 |
| globals.css 误改 token | 低 | 高 | Slice B 增量 diff review；不动 token 是 hard rule |

---

## 26. Acceptance Criteria（v0.3 验收）

### 26.1 Slice A — 基础设施

- [ ] `lib/content/schemas.ts` 含 `bookListSchema`（kind: "book-list"，author + genre 必填，tags 必填可空）
- [ ] `lib/content/schemas.ts` 的 `schemaByKind` 加 `"book-list": bookListSchema`
- [ ] `lib/content/schemas.ts` 的 `SiteContent` union 加 `BookListPost`
- [ ] `lib/content/reader.ts` 含 `getBookListPosts()` 函数
- [ ] `lib/content/reader.ts` 的 `CollectionMap` 加 `"book-list": BookListPost`
- [ ] `components/icons0.tsx` 含 `Icons0Book` 组件（导出）
- [ ] `npm run typecheck` 0 errors

### 26.2 Slice B — 列表页 + 卡片

- [ ] `components/entry-card-book-list.tsx` 存在
- [ ] card 显示**书名（title）+ 作者（author）+ 类别（genre）** 三件套
- [ ] `app/(site)/book-list/page.tsx` 存在
- [ ] 列表页用 `CollectionList` 骨架
- [ ] 列表页用 `.book-list-grid` 网格布局
- [ ] 0 条内容时显示 empty-state
- [ ] `app/globals.css` 新增 `.book-list-grid` / `.book-card` / `.book-card-meta`（不动 token）
- [ ] `npm run typecheck` 0 errors
- [ ] `npm run lint` 0 errors

### 26.3 Slice C — 详情 + Header + Portal + Footer

- [ ] `app/(site)/book-list/[slug]/page.tsx` 存在
- [ ] 详情页 frontmatter 元信息块显示 author / genre / tags / date
- [ ] 详情页用 `MdxContent` 渲染正文
- [ ] 详情页有 `ShareButtons`
- [ ] `components/site-nav.tsx` 的 `navItems` 第 5 项 = `{ href: "/book-list", icon: Icons0Book, label: "Book List" }`
- [ ] `app/(site)/page.tsx` 的 `portalEntries` 含 Book List 入口
- [ ] `components/section-footer.tsx` 的 Sections 列含 Book List 链接
- [ ] `components/section-footer.tsx` 的 Recent 列含 latestBook（与 latestBlog / latestWeekly 并列）
- [ ] `npm run build` 成功

### 26.4 Slice D — 跨集合接入

- [ ] `lib/content/reader.ts` 的 `getContentByTag` 返回类型含 `bookList`
- [ ] `lib/content/reader.ts` 的 `getAllTags` bump 循环含 book-list
- [ ] `lib/content/reader.ts` 的 `emptyKindCounts` 含 `bookList: 0`
- [ ] `app/(site)/tags/[tag]/page.tsx` 含 Book List 分组区块
- [ ] `app/api/search/route.ts` 搜索源含 `getBookListPosts`
- [ ] `app/sitemap.ts` 静态页含 `/book-list`
- [ ] `app/sitemap.ts` 详情页含 `bookListUrls`
- [ ] `lib/content/reader.test.ts` 含 4 个测试（原 3 个 + 1 个新增），全部通过
- [ ] 原 3 个测试的 "6 collections" 描述改为 "7 collections"
- [ ] `npm test` 通过

### 26.5 Slice E — Hermes 工作流

- [ ] `content/inbox/book-notes/README.md` 存在
- [ ] `docs/agent/book-list-template.md` 存在，参照 ai-tracker-template.md 结构
- [ ] `.claude/commands/book-list-from-inbox.md` 存在，参照 ai-tracker-from-inbox.md 结构
- [ ] `content/README.md` 含 `book-list/` 一节
- [ ] `content/README.md` 含 `inbox/book-notes/` 一节
- [ ] `docs/agent/inbox-to-content-workflow.md` 含 5 条转化链路（原 4 条 + book-notes 新增）
- [ ] 手动跑 `/book-list-from-inbox <fixture>` 能生成 `status: draft` 草稿

### 26.6 工程验证

- [ ] `npm run lint` 0 errors
- [ ] `npm run typecheck` 0 errors
- [ ] `npm run build` 成功
- [ ] `npm test` 0 failures
- [ ] 无新增 npm 依赖
- [ ] `app/globals.css` 无新增 / 修改的设计 token（仅追加 3 个新 className）
- [ ] 现有 6 个 collection 的 schema / reader / 内容文件均无改动
- [ ] SPEC.md / tasks/plan.md / tasks/todo.md 同步本次改动

### 26.7 设计未破坏

- [ ] 所有页面维持 Stripe Press 配色 / 0 圆角 / 1500ms 动效
- [ ] 所有新 className 使用 CSS 变量，不引入硬编码值
- [ ] 不动 `app/globals.css` 的 design token

---

## 附录 C：Book List card 视觉示意（非代码，仅描述）

### /book-list 列表页

```
┌─────────────────────────────────────────────────────────────────┐
│  BOOK LIST                                                      │
│  Books I've read, with notes on what I took away.               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │ [商业]           │  │ [文学]           │  │ [技术]         │ │
│  │                  │  │                  │  │                │ │
│  │  Managing Oneself│  │  The Three-Body  │  │ Designing      │ │
│  │                  │  │  Problem         │  │ Data-Intensive │ │
│  │  by Peter        │  │                  │  │ Applications   │ │
│  │  Drucker         │  │  by 刘慈欣       │  │                │ │
│  │                  │  │                  │  │  by Kleppmann  │ │
│  │  极简管理思想...  │  │  文明与时间的...  │  │  系统设计的...  │ │
│  │                  │  │                  │  │                │ │
│  │  #管理 #效率     │  │  #科幻 #文明     │  │  #系统 #DDIA  │ │
│  │                  │  │                  │  │                │ │
│  │  Read  ↗         │  │  Read  ↗         │  │  Read  ↗       │ │
│  └──────────────────┘  └──────────────────┘  └────────────────┘ │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │ [技术]           │  │ [商业]           │  ...更多卡片         │
│  │  ...             │  │  ...             │                     │
│  └──────────────────┘  └──────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

### /book-list/<slug> 详情页

```
┌─────────────────────────────────────────────────────────────────┐
│  Managing Oneself                            2026-06-15 · 6 min│
│  by Peter Drucker                                              │
│  极简管理思想：从认知自己到贡献价值的元方法。                    │
│  A meta-method for managing yourself — from self-awareness...  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─ Book Info ─────────────────────────────┐                  │
│  │  Author   │ Peter Drucker               │                  │
│  │  Genre    │ 商业                        │                  │
│  │  Tags     │ #管理 #效率 #元方法         │                  │
│  │  Finished │ 2026-06-15                  │                  │
│  └─────────────────────────────────────────┘                  │
│                                                                 │
│  ## 我读到的核心                                                │
│                                                                 │
│  1. **先做对的事，再把事做对** — 效能 vs 效率 ...              │
│  2. **把精力放在长板上** — 短板补到"够用"即可 ...              │
│  3. **决策是判断，不是创意** — 多方案中选最不差的 ...           │
│                                                                 │
│  ## 我会怎么用                                                  │
│                                                                 │
│  - 周日做一次"我这段时间在做什么"复盘                            │
│  - 决策时用"最不满意后果"框架 ...                              │
│                                                                 │
│  [Share buttons]                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 附录 D：与现有体系的对接点

- **数据流**：所有 list / 详情页通过 `lib/content/reader.ts` 已有的 reader 模式；`getBookListPosts` 沿用 `getCollection("book-list")` 模式。
- **样式系统**：新 className 通过 `app/globals.css` 现有 token（`--space-*` `--accent-*` `--font-size-*` `--gold`）引用。
- **页面动画**：所有页面自动继承 `PageTransitionWrapper`（`components/animations.tsx`）的 1500ms crossfade。
- **MDX 渲染**：读书笔记直接用现有 `MdxContent` 渲染，无需注册新组件。
- **搜索**：`search-dialog.tsx` 现有实现透明支持 book-list（通过 `/api/search` 扩展）。
- **SEO**：`sitemap.ts` 自动覆盖；详情页 `generateMetadata` 用现有 `articleMetadata` helper。
- **Git 工作流**：按 CLAUDE.md，先建 `feat/book-list` 分支，5 个 slice 各 1 个 commit。
- **Hermes 边界**：`/book-list-from-inbox` 命令永远生成 `status: draft`；Coya 手动改 `published`。

---

**v0.3 规约完成。下一步：/plan 拆任务 → /dispatch 执行 5 个 vertical slices。**