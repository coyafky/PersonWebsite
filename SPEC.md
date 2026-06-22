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
| **v0.2**（本规约） | About 去冗 + Tags 跨 collection + 词云 | 🟡 规约中 | 见下文 §1 |

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