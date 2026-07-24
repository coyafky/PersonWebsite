# Plan — v0.3 Book List 新栏目落地

> 与 `tasks/todo.md` 配套的执行计划。
> 起点：v0.2 已合入 main，分支 `feat/book-list` 待建。
> 设计系统：Stripe Press（**禁止改 token**）。
> 参考：`SPEC.md` §18–§26。

---

## 0. 切片策略

按目标垂直切片（每个 slice 是一个完整的"改动 + 验收"路径），不做水平分层。

| 切片 | 标题 | 目标 | 文件数 | 可并行 | 依赖 |
|------|------|------|--------|--------|------|
| **S1 基础设施** | Slice A | schemas + reader + icon | 3 | 否 | 无 |
| **S2 列表卡片** | Slice B | entry-card + 列表页 + globals.css | 3 | 否 | S1 |
| **S3 详情 + 入口** | Slice C | 详情页 + nav + portal + footer | 5 | 否 | S2 |
| **S4 跨集合** | Slice D | tags + search + sitemap + tests | 5 | 否 | S3 |
| **S5 Hermes 工作流** | Slice E | inbox + template + command + docs | 6 | 否 | S4 |
| **S6 验收 + 同步** | — | 全量验证 + 文档同步 + 推送 | 3 | 否 | S1 + S2 + S3 + S4 + S5 |

**为什么全串行**（不像 v0.2 那样 S2+S3 并行）：
- S2 改 `globals.css`（`.book-list-grid`），S3 改 `components/site-nav.tsx` —— 文件域不冲突。
- 但 S2 的列表页是 S3 详情页的 href 目标，必须 S2 完成后 S3 才能验证跳转。
- S4 的 `getContentByTag` 跨 7 collection 测试要 S1 的 `getBookListPosts` 已存在。
- S5 的 Hermes 命令要 S1 的 schema 已确定才能写出正确的 frontmatter。
- 节省 agent token 消耗 + 早期 slice 失败时及时止损。

**串行依赖**：
```
S1 → S2 → S3 → S4 → S5
                  ↘
                   S6 (依赖全部)
```

---

## 1. Slice 1 — 基础设施（schemas + reader + icon）

### 1.1 目标
让 book-list collection 在类型系统、读取层、图标层完整存在。**不改任何现有 6 个 collection 的 schema/reader**。

### 1.2 文件清单

| 路径 | 操作 |
|------|------|
| `lib/content/schemas.ts` | 追加 `bookListSchema` + `BookListPost` + `schemaByKind` + `SiteContent` union |
| `lib/content/reader.ts` | 追加 `getBookListPosts()` + `CollectionMap` |
| `components/icons0.tsx` | 追加 `Icons0Book`（参照 `Icons0Calendar` 的 Carbon SVG 风格） |

### 1.3 改动点

**schemas.ts**（在 `aiTrackerSchema` 之后追加）：

```ts
export const bookListSchema = baseContentSchema.extend({
  kind: z.literal("book-list"),
  author: z.string(),                // 必填，作者名
  genre: z.string(),                 // 必填，粗分类
  tags: stringArraySchema,           // 必填可空，细粒度
  lang: z.string().default("zh"),
});

export type BookListPost = z.infer<typeof bookListSchema>;
```

并修改：

```ts
export const schemaByKind = {
  blog: blogSchema,
  weekly: weeklySchema,
  projects: projectSchema,
  career: careerSchema,
  "ai-tracker": aiTrackerSchema,
  learning: learningSchema,
  "book-list": bookListSchema,       // ← 新增
} as const;

export type SiteContent =
  | BlogPost
  | WeeklyPost
  | ProjectPost
  | CareerPost
  | AiTrackerPost
  | LearningPost
  | BookListPost;                    // ← 新增
```

**reader.ts**（在 `getAiTrackerPosts` 之后追加）：

```ts
export async function getBookListPosts(
  includeDrafts = false,
): Promise<BookListPost[]> {
  const items = await getCollection("book-list", includeDrafts);
  return items.filter((item): item is BookListPost => item.kind === "book-list");
}

type CollectionMap = {
  blog: BlogPost;
  weekly: WeeklyPost;
  projects: ProjectPost;
  career: CareerPost;
  "ai-tracker": AiTrackerPost;
  learning: LearningPost;
  "book-list": BookListPost;          // ← 新增
};
```

**icons0.tsx**（在 `Icons0Radar` 之后追加）：

```tsx
export function Icons0Book(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M16 4H8a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10V4zm-2 18H8v-2h6v2zm0-4H8v-2h6v2zm0-4H8v-2h6v2zM22 4h-4v22h6V6a2 2 0 0 0-2-2zm0 18h-2V8h2v14z"
        fill="currentColor"
      />
    </IconBase>
  );
}
```

### 1.4 验收

- [ ] `lib/content/schemas.ts` 含 `bookListSchema`（kind: "book-list"，author + genre 必填，tags 必填可空，lang 默认 zh）
- [ ] `lib/content/schemas.ts` 的 `schemaByKind["book-list"]` 注册
- [ ] `lib/content/schemas.ts` 的 `SiteContent` union 含 `BookListPost`
- [ ] `lib/content/reader.ts` 含 `getBookListPosts()` 函数
- [ ] `lib/content/reader.ts` 的 `CollectionMap["book-list"]: BookListPost` 注册
- [ ] `components/icons0.tsx` 含 `Icons0Book` 组件
- [ ] `npm run typecheck` 0 errors
- [ ] `npm run lint` 0 errors（existing 6 collection 行为不变）
- [ ] 0 条 book-list 内容时 `getBookListPosts()` 返回 `[]`，不报错

### 1.5 风险

| 风险 | 缓解 |
|------|------|
| `kind: z.literal("book-list")` 与 Zod 版本兼容 | 沿用 `aiTrackerSchema` 同款写法，已在 v0.2 验证 |
| `Icons0Book` SVG path 选错 | 优先用 icons0.dev Carbon collection 的 book 标识 |
| `getCollection("book-list", ...)` 在 `content/book-list/` 目录不存在时 | 现有 `fileExists` 已处理，返回 `[]` |

---

## 2. Slice 2 — 列表卡片（entry-card + 列表页 + globals.css）

### 2.1 目标
`/book-list` 列表页可访问，渲染 card 网格，每张 card 显示**书名 / 作者 / 类别**三件套。

### 2.2 文件清单

| 路径 | 操作 |
|------|------|
| `components/entry-card-book-list.tsx` | 新建（Server Component） |
| `app/(site)/book-list/page.tsx` | 新建 |
| `app/globals.css` | 追加 `.book-list-grid` / `.book-card` / `.book-card-meta`（**不动 token**） |

### 2.3 改动点

**entry-card-book-list.tsx**（Server Component）：

```tsx
import Link from "next/link";

type EntryCardBookListProps = {
  href: string;
  title: string;        // 书名
  author: string;       // 作者
  genre: string;        // 类别
  summary?: string;     // 可选摘要
  date?: string;        // 可选读完日期
  tags?: string[];      // 可选细粒度标签
};

export function EntryCardBookList({
  href,
  title,
  author,
  genre,
  summary,
  date,
  tags = [],
}: EntryCardBookListProps) {
  return (
    <article className="book-card">
      <Link href={href} className="book-card-link">
        <div className="book-card-meta">
          <span className="book-card-genre">{genre}</span>
          {date ? <time className="book-card-date">{date}</time> : null}
        </div>
        <h3 className="book-card-title">{title}</h3>
        <p className="book-card-author">by {author}</p>
        {summary ? <p className="book-card-summary">{summary}</p> : null}
      </Link>
      {tags.length > 0 ? (
        <ul className="book-card-tags tag-list" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag}>
              <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
```

**book-list/page.tsx**（Server Component）：

```tsx
import { CollectionList } from "@/components/collection-list";
import { EntryCardBookList } from "@/components/entry-card-book-list";
import { getBookListPosts } from "@/lib/content";

export const metadata = {
  title: "Book List",
  description: "Books I've read, with notes on what I took away.",
};

export default async function BookListPage() {
  const books = await getBookListPosts();

  return (
    <div className="page-shell">
      <CollectionList
        title="Book List"
        description="Books I've read, with notes on what I took away."
      >
        {books.length === 0 ? (
          <p className="empty-state">尚无书籍。开始记录第一本 →</p>
        ) : (
          <div className="book-list-grid">
            {books.map((book) => (
              <EntryCardBookList
                key={book.slug}
                href={`/book-list/${book.slug}`}
                title={book.title}
                author={book.author}
                genre={book.genre}
                summary={book.summary}
                date={book.date}
                tags={book.tags}
              />
            ))}
          </div>
        )}
      </CollectionList>
    </div>
  );
}
```

**globals.css** 追加（**禁止改 token**）：

```css
.book-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-l);
}

.book-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
  padding: var(--space-m);
  border: 1px solid var(--border, transparent);
  transition: transform 200ms ease;
}

.book-card:hover {
  transform: translateY(-2px);
}

.book-card-link {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  text-decoration: none;
  color: inherit;
}

.book-card-meta {
  display: flex;
  gap: var(--space-s);
  align-items: center;
  font-size: var(--font-size-small, 0.875rem);
}

.book-card-genre {
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.book-card-date {
  color: var(--muted, var(--accent));
}

.book-card-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  margin: 0;
}

.book-card-author {
  color: var(--muted, var(--accent));
  font-size: var(--font-size-small, 0.875rem);
  margin: 0;
}

.book-card-summary {
  font-size: var(--font-size-base);
  color: var(--text);
  margin: 0;
}

.book-card-tags {
  display: flex;
  gap: var(--space-1);
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
}
```

### 2.4 验收

- [ ] `components/entry-card-book-list.tsx` 存在
- [ ] card 显示**书名（title）+ 作者（author）+ 类别（genre）** 三件套
- [ ] `app/(site)/book-list/page.tsx` 存在
- [ ] 列表页用 `CollectionList` 骨架
- [ ] 列表页用 `.book-list-grid` 网格布局
- [ ] 0 条内容时显示 empty-state（"尚无书籍"）
- [ ] `app/globals.css` 新增 `.book-list-grid` / `.book-card` / `.book-card-meta` 等 class（不动 token）
- [ ] `npm run typecheck` 0 errors
- [ ] `npm run lint` 0 errors
- [ ] `npm run build` 成功
- [ ] 手动核查：访问 `/book-list`，渲染 card 网格（即便 0 条也显示空态）

### 2.5 风险

| 风险 | 缓解 |
|------|------|
| 0 条内容时点 card 跳 404 | 0 条时只显示 empty-state，无 card 可点；S3 详情页完成后才有 href 目标 |
| `var(--border, transparent)` 等带 fallback 的 token 可能不存在 | 参照 v0.2 的 `tag-cloud` 同款写法 |
| 网格列宽 `minmax(280px, 1fr)` 在窄屏不友好 | 移动端自动堆叠（auto-fill + minmax） |

---

## 3. Slice 3 — 详情页 + Header 入口 + 首页 portal + footer

### 3.1 目标
`/book-list/<slug>` 详情页可访问；Header 第 5 项 = Book List；首页 portal 加 Book List 入口；footer Sections + Recent 列接入。

### 3.2 文件清单

| 路径 | 操作 |
|------|------|
| `app/(site)/book-list/[slug]/page.tsx` | 新建 |
| `components/site-nav.tsx` | 改：navItems 第 5 项加 Book List |
| `app/(site)/page.tsx` | 改：portalEntries 加 Book List |
| `components/section-footer.tsx` | 改：Sections + Recent 列加 Book List |
| `app/(site)/book-list/page.tsx` | （不动，S2 已完成） |

### 3.3 改动点

**book-list/[slug]/page.tsx**（参照 `ai-tracker/[slug]/page.tsx` 结构）：

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MdxContent } from "@/components/mdx-content";
import { getBookListPosts, getContentBySlug } from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";
import { articleMetadata, buildUrl } from "@/lib/metadata";
import { readingTimeLabel } from "@/lib/reading-time";
import { BookPostingJsonLd } from "@/components/json-ld";  // 视 json-ld.tsx 是否支持 book
import { ShareButtons } from "@/components/share-buttons";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getBookListPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentBySlug("book-list", slug);
  if (!post) return {};
  return articleMetadata({ ...post, path: "book-list" });
}

export default async function BookListDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const post = await getContentBySlug("book-list", slug);
  if (!post) notFound();

  const headings = extractHeadings(post.body);
  const url = buildUrl(`/book-list/${post.slug}`);

  return (
    <ArticleLayout headings={headings}>
      <article className="article-shell">
        <header className="article-header">
          <span>{post.date} · <span className="reading-time">{readingTimeLabel(post.body)}</span></span>
          <h1>{post.title}</h1>
          <p className="book-detail-author">by {post.author}</p>
          <p>{post.summary}</p>
          {post.englishSummary ? <p className="english-summary">{post.englishSummary}</p> : null}
        </header>

        <section className="book-detail-info">
          <h2>Book Info</h2>
          <div className="book-detail-row">
            <span className="book-detail-row__label">Author</span>
            <span className="book-detail-row__value">{post.author}</span>
          </div>
          <div className="book-detail-row">
            <span className="book-detail-row__label">Genre</span>
            <span className="book-detail-row__value">{post.genre}</span>
          </div>
          <div className="book-detail-row">
            <span className="book-detail-row__label">Tags</span>
            <span className="book-detail-row__value">
              {post.tags.length > 0 ? post.tags.map((t) => `#${t}`).join(" · ") : "—"}
            </span>
          </div>
          <div className="book-detail-row">
            <span className="book-detail-row__label">Finished</span>
            <span className="book-detail-row__value">{post.date}</span>
          </div>
        </section>

        <MdxContent source={post.body} />

        <ShareButtons title={post.title} url={url} />
      </article>
    </ArticleLayout>
  );
}
```

**site-nav.tsx**（`navItems` 第 5 项插入，参照 `site-nav.tsx:18-25`）：

```tsx
import {
  Icons0Blog,
  Icons0Book,           // ← 新增 import
  Icons0Calendar,
  Icons0Notebook,
  Icons0Portfolio,
  Icons0Profile,
  Icons0Radar,
} from "@/components/icons0";

const navItems = [
  { href: "/blog", icon: Icons0Blog, label: "Blog" },
  { href: "/ai-tracker", icon: Icons0Radar, label: "AI Tracker" },
  { href: "/weekly", icon: Icons0Calendar, label: "Weekly" },
  { href: "/learning", icon: Icons0Notebook, label: "Learning" },
  { href: "/book-list", icon: Icons0Book, label: "Book List" },  // ← 第 5 项
  { href: "/projects", icon: Icons0Portfolio, label: "Projects" },
  { href: "/about", icon: Icons0Profile, label: "About" },
];
```

**app/(site)/page.tsx**（`portalEntries` 加 Book List）：

```tsx
import {
  Icons0Blog,
  Icons0Book,           // ← 新增 import
  Icons0Calendar,
  Icons0Notebook,
  Icons0Portfolio,
  Icons0Profile,
  Icons0Radar,
} from "@/components/icons0";

const portalEntries: ReadonlyArray<PortalEntry> = [
  // ... 现有 6 项不动
  {
    href: "/book-list",
    icon: <Icons0Book />,
    title: "Book List",
    description: "读过的书、读书笔记、长期沉淀的认知。",
  },
  // ... 后续项
];
```

**section-footer.tsx**（`Sections` 列加 Book List；`Recent` 列加 latestBook）：

```tsx
import { getBlogPosts, getBookListPosts, getWeeklyPosts } from "@/lib/content";

const [latestBlog, latestWeekly, latestBook] = await Promise.all([
  getBlogPosts().then((posts) => posts[0]).catch(() => undefined),
  getWeeklyPosts().then((posts) => posts[0]).catch(() => undefined),
  getBookListPosts().then((posts) => posts[0]).catch(() => undefined),  // ← 新增
]);

// Sections 列追加
<li>
  <Link href="/book-list">Book List</Link>
</li>

// Recent 列追加
{latestBook ? (
  <li>
    <span className="site-footer-kind">Book</span>
    <Link href={`/book-list/${latestBook.slug}`}>{latestBook.title}</Link>
  </li>
) : (
  <li className="site-footer-empty">No book yet.</li>
)}
```

### 3.4 验收

- [ ] `app/(site)/book-list/[slug]/page.tsx` 存在
- [ ] 详情页 frontmatter 元信息块显示 author / genre / tags / date
- [ ] 详情页用 `MdxContent` 渲染正文
- [ ] 详情页有 `ShareButtons`
- [ ] `components/site-nav.tsx` 的 `navItems` 第 5 项 = `{ href: "/book-list", icon: Icons0Book, label: "Book List" }`
- [ ] `app/(site)/page.tsx` 的 `portalEntries` 含 Book List 入口
- [ ] `components/section-footer.tsx` 的 Sections 列含 Book List 链接
- [ ] `components/section-footer.tsx` 的 Recent 列含 latestBook（与 latestBlog / latestWeekly 并列）
- [ ] `npm run typecheck` 0 errors
- [ ] `npm run lint` 0 errors
- [ ] `npm run build` 成功
- [ ] 手动核查：访问 `/`（7 个 portal 卡）、访问 Header 第 5 项跳 `/book-list`、访问 footer Sections 跳 `/book-list`、访问 footer Recent 跳 `/book-list/<slug>`

### 3.5 风险

| 风险 | 缓解 |
|------|------|
| `BookPostingJsonLd` 在 `json-ld.tsx` 中是否已支持 book-list | S1 完成后看 json-ld.tsx；若不支持改用通用 `ArticleJsonLd` 或新建 `BookJsonLd`（最低成本选择通用） |
| `site-nav.tsx` navItems 顺序错乱 | 严格按 1. Blog 2. AI Tracker 3. Weekly 4. Learning **5. Book List** 6. Projects 7. About 排列 |
| `section-footer.tsx` 的 `latestBook` 类型推导失败 | reader 已返回 `BookListPost[]`，类型安全 |

---

## 4. Slice 4 — 跨集合接入（tags + search + sitemap + tests）

### 4.1 目标
`getContentByTag` / `getAllTags` / `emptyKindCounts` 接入 book-list；`/tags/[tag]` 加 Book List 分组；`/api/search` 加 book-list 搜索源；sitemap 加 book-list 条目；reader.test.ts 加 1 个新测试。

### 4.2 文件清单

| 路径 | 操作 |
|------|------|
| `lib/content/reader.ts` | 改：getContentByTag / getAllTags / emptyKindCounts / TaggedContentByKind 接入 book-list |
| `lib/content/reader.test.ts` | 改：原 3 个测试描述 "6 collections" → "7 collections"；新增 1 个 book-list 专项测试 |
| `app/(site)/tags/[tag]/page.tsx` | 改：加 Book List 分组区块 |
| `app/api/search/route.ts` | 改：搜索源加 getBookListPosts |
| `app/sitemap.ts` | 改：静态页 + 详情页加 book-list |

### 4.3 改动点

**reader.ts** 4 处改动（参照 v0.2 `getContentByTag` + `getAllTags` + `emptyKindCounts` 的同款扩展模式）：

```ts
// 1. TaggedContentByKind 加 bookList
export type TaggedContentByKind = {
  blog: BlogPost[];
  weekly: WeeklyPost[];
  projects: ProjectPost[];
  career: CareerPost[];
  learning: LearningPost[];
  "ai-tracker": AiTrackerPost[];
  bookList: BookListPost[];           // ← 新增
};

// 2. emptyKindCounts 加 bookList
function emptyKindCounts(): Record<ContentKind, number> {
  return {
    blog: 0,
    weekly: 0,
    projects: 0,
    career: 0,
    learning: 0,
    "ai-tracker": 0,
    bookList: 0,                       // ← 新增
  };
}

// 3. getContentByTag 并行拉取 + 过滤 bookList
const [blog, weekly, projects, career, aiTracker, bookList, topics] = await Promise.all([
  getBlogPosts(),
  getWeeklyPosts(),
  getProjectPosts(),
  getCareerPosts(),
  getAiTrackerPosts(),
  getBookListPosts(),                  // ← 新增
  getLearningTopics(),
]);

const bookListMatches = bookList.filter((p) => p.tags.some(matchesTag));

const items: TaggedContentByKind = {
  blog: blogMatches,
  weekly: weeklyMatches,
  projects: [],
  career: careerMatches,
  learning: learningMatches,
  "ai-tracker": aiTrackerMatches,
  bookList: bookListMatches,           // ← 新增
};

// 4. getAllTags bump 循环加 book-list
for (const post of bookList) for (const tag of post.tags) bump(tag, "book-list");  // ← 新增
```

**reader.test.ts** 改动：

```ts
// 原 3 个测试的描述从 "6 collections" 改为 "7 collections (incl. book-list)"
test("getContentByTag: matches across all 7 collections (incl. book-list)", ...);

// 新增 1 个 book-list 专项测试
test("getContentByTag: bookList field always exists in result", async () => {
  const result = await getContentByTag("__test_tag_zzz__");
  assert.equal(Object.keys(result.totalByKind).length, 7);
  assert.ok("bookList" in result.totalByKind);
  assert.ok("bookList" in result.items);
  assert.ok(Array.isArray(result.items.bookList));
});
```

**tags/[tag]/page.tsx** 改（参照 v0.2 的 ai-tracker 分组）：

```tsx
{totalByKind.bookList > 0 ? (
  <section>
    <h2>Book List</h2>
    <div className="stack-list">
      {items.bookList.map((book) => (
        <EntryCardBookList
          key={book.slug}
          href={`/book-list/${book.slug}`}
          title={book.title}
          author={book.author}
          genre={book.genre}
          summary={book.summary}
          date={book.date}
          tags={book.tags}
        />
      ))}
    </div>
  </section>
) : null}
```

**api/search/route.ts** 改（参照 aiTracker 搜索源）：

```ts
import {
  getBlogPosts,
  getBookListPosts,                    // ← 新增 import
  getWeeklyPosts,
  getProjectPosts,
  getAiTrackerPosts,
  getLearningTopics,
  getLearningPosts,
} from "@/lib/content";

const [blog, weekly, projects, aiTracker, bookList] = await Promise.all([
  getBlogPosts(),
  getWeeklyPosts(),
  getProjectPosts(),
  getAiTrackerPosts(),
  getBookListPosts(),                  // ← 新增
]);

// ...

for (const post of bookList) {                          // ← 新增
  const score = matchScore(post, q);
  if (score > 0) hits.push({
    title: post.title,
    summary: post.summary,
    url: `/book-list/${post.slug}`,
    date: post.date,
  });
}
```

**sitemap.ts** 改（参照 aiTracker 模式）：

```ts
import {
  getBlogPosts,
  getBookListPosts,                    // ← 新增 import
  getWeeklyPosts,
  getProjectPosts,
  getLearningTopics,
  getLearningPosts,
  getAiTrackerPosts,
} from "@/lib/content";

const [blog, weekly, projects, aiTracker, bookList] = await Promise.all([
  getBlogPosts(),
  getWeeklyPosts(),
  getProjectPosts(),
  getAiTrackerPosts(),
  getBookListPosts(),                  // ← 新增
]);

const staticPages: MetadataRoute.Sitemap = [
  // ... 现有 7 项不动
  { url: buildUrl("/book-list"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },  // ← 新增
];

// 详情页
const bookListUrls: MetadataRoute.Sitemap = bookList.map((post) => ({
  url: buildUrl(`/book-list/${post.slug}`),
  lastModified: new Date(post.date),
  changeFrequency: "monthly" as const,
  priority: 0.5,
}));

return [
  ...staticPages,
  ...blogUrls,
  ...weeklyUrls,
  ...projectUrls,
  ...aiTrackerUrls,
  ...learningUrls,
  ...bookListUrls,                     // ← 新增
];
```

### 4.4 验收

- [ ] `lib/content/reader.ts` 的 `TaggedContentByKind.bookList: BookListPost[]`
- [ ] `lib/content/reader.ts` 的 `emptyKindCounts` 含 `bookList: 0`
- [ ] `lib/content/reader.ts` 的 `getContentByTag` 返回含 `bookList` 字段
- [ ] `lib/content/reader.ts` 的 `getAllTags` bump 循环含 `for (const post of bookList) ...`
- [ ] `app/(site)/tags/[tag]/page.tsx` 含 Book List 分组区块
- [ ] `app/api/search/route.ts` 搜索源含 `getBookListPosts`
- [ ] `app/sitemap.ts` 静态页含 `/book-list`
- [ ] `app/sitemap.ts` 详情页含 `bookListUrls`
- [ ] `lib/content/reader.test.ts` 含 4 个测试（原 3 个 + 1 个新增），全部通过
- [ ] 原 3 个测试的 "6 collections" 描述改为 "7 collections (incl. book-list)"
- [ ] `npm test` 通过
- [ ] `npm run typecheck` 0 errors
- [ ] `npm run lint` 0 errors
- [ ] `npm run build` 成功
- [ ] 手动核查：访问 `/tags/__booklist_only_tag__`（仅 book-list 出现的 tag）不 404 + 渲染 Book List 分组；Cmd+K 搜 book-list 关键词能搜到

### 4.5 风险

| 风险 | 缓解 |
|------|------|
| `TaggedContentByKind` 类型与 v0.2 现有类型破坏兼容 | 仅追加字段；v0.2 现有 `result.items.blog` 等访问模式不变 |
| `sitemap.ts` 加 1 个 collection 后路由总数变化 | 接受 48 → 49+ routes；不影响功能 |
| 6 个 reader 并行拉取 +1 → 7 个 | 性能损耗 < 50ms（v0.2 已并行）；后续可缓存 |

---

## 5. Slice 5 — Hermes 工作流（inbox + template + command + docs）

### 5.1 目标
Hermes 能从 `content/inbox/book-notes/` 生成 `status: draft` 的 book-list 草稿；Coya 手动改 `published`。配套 4 个文档同步。

### 5.2 文件清单

| 路径 | 操作 |
|------|------|
| `content/inbox/book-notes/` | 新建目录 |
| `content/inbox/book-notes/README.md` | 新建（参照 `content/inbox/ai-notes/README.md` 范式） |
| `docs/agent/book-list-template.md` | 新建（参照 `docs/agent/ai-tracker-template.md`） |
| `.claude/commands/book-list-from-inbox.md` | 新建（参照 `.claude/commands/ai-tracker-from-inbox.md`） |
| `content/README.md` | 改：加 `book-list/` + `inbox/book-notes/` 说明 |
| `docs/agent/inbox-to-content-workflow.md` | 改：加 book-notes 转化链路 |

### 5.3 改动点

**content/inbox/book-notes/README.md**（参照 `content/inbox/ai-notes/README.md`）：

```markdown
# Book Notes Inbox

碎片笔记入口——记录"刚读完 / 在读 / 想读"的书。

写完丢这里，等凑够一批后用 `/book-list-from-inbox` 命令生成 `content/book-list/<date-slug>.md` 草稿。

> 注意：Hermes 永远生成 `status: draft`；Coya 手动审阅后改 `published`。
```

**docs/agent/book-list-template.md**（参照 `docs/agent/ai-tracker-template.md` 结构）：

```markdown
# Book List 模板

> Hermes 在 `/book-list-from-inbox` 时使用此模板生成 `content/book-list/<date-slug>.md`。

## 模板

\```markdown
---
title: ""
date: ""
summary: ""
status: draft        # ⚠️ 永远默认 draft
tags:
  - ""
author: ""           # 必填
genre: ""            # 必填，推荐值：商业 / 文学 / 技术 / 历史 / 哲学 / 科学 / 其他
lang: zh
englishSummary: ""
---

## 我读到的核心

## 我会怎么用
\```

## 字段语义

### 必填

- `title` — 书名
- `date` — 读完日期（YYYY-MM-DD）
- `summary` — 1-2 句中文摘要
- `status` — **必须 `draft`**，由 Coya 手动改为 `published`
- `tags` — 细粒度标签（2-5 个）
- `author` — 作者名
- `genre` — 粗分类（推荐"商业 / 文学 / 技术 / 历史 / 哲学 / 科学 / 其他"）

### 可选

- `englishSummary` — 1-2 句英文摘要
- `lang` — 默认 `zh`
```

**`.claude/commands/book-list-from-inbox.md`**（参照 `.claude/commands/ai-tracker-from-inbox.md`）：

```markdown
---
name: book-list-from-inbox
description: 从 content/inbox/book-notes/ 的碎片笔记生成 book-list 草稿
argument-hint: "<素材文件名或目录路径>"
user-invocable: true
---

# Book List From Inbox — 从读书碎片生成书单卡片

你是内容协作助手。用户给了你一段或多段读书碎片笔记（刚读完 / 在读 / 想读的书），你要生成一篇 Book List 草稿。

## 步骤

### 1. 读取素材

读取 `content/inbox/book-notes/` 或用户通过参数指定的文件。

### 2. 提取核心信息

从素材中识别：
- 这是什么书（书名 + 作者）？
- 属于哪个粗类（商业 / 文学 / 技术 / 历史 / 哲学 / 科学 / 其他）？
- 核心 takeaway 是什么（1-3 条）？

### 3. 选 author / genre

- `author` — 直接从素材提取，不确定时标 `[待确认]`
- `genre` — 从推荐值选一个（商业 / 文学 / 技术 / 历史 / 哲学 / 科学 / 其他）

### 4. 选 tags

- 2-5 个细粒度标签
- 例：`["管理", "效率", "元方法"]`

### 5. 写 summary

- 1-2 句中文摘要
- 用 Coya 第一人称

### 6. 选 date

- 默认 = 读完日期（如果素材提到）
- 拿不准时 = 当前日期 + `[待确认]`

### 7. 写正文

模板分两节：
- `## 我读到的核心` — 1-3 条核心 takeaway
- `## 我会怎么用` — 我会怎么应用到自己的工作/生活

### 8. 自动填 englishSummary

- 1-2 句英文摘要
- 与 `summary` 语义一致

### 9. 生成文件

- 路径：`content/book-list/<YYYY-MM-DD-slug>.md`
- `status: draft` 永远默认
- 模板：`docs/agent/book-list-template.md`

### 10. 输出

展示生成的 book-list 卡片，标注：
- 素材来源文件
- 哪些字段是 Hermes 推断的（应标 `[待确认]`）
- 待 Coya 确认/补全的项

## 约束

- ❌ 不编造素材里没有的事实
- ❌ 不设为 `published`
- ❌ 不擅自选 genre — 拿不准时用 "其他" 并标 `[待确认]`
- ✅ 不确定的字段标 `[待确认]`
- ✅ 用 Coya 第一人称
- ✅ 禁用 AI 腔
- ✅ 字段缺失时提示用户补全，不要硬猜
- ✅ 完成后让 Coya 手动审阅 frontmatter
```

**content/README.md** 改（追加 2 个段落）：

```markdown
# 在 Content 列表末尾追加：
blog/         Technical writing, ideas, learning notes
weekly/       Weekly reviews and personal logs
projects/     Project records and portfolio pages
career/       Resume bullets, STAR stories, profile material
ai-tracker/   AI 信息摄取与长期追踪
book-list/    Book reading notes — 一本书一卡片（书名 + 作者 + 类别 + 读书笔记）
inbox/
  ideas/         → blog
  logs/          → weekly
  project-notes/ → projects
  career-notes/  → career
  ai-notes/      → ai-tracker
  book-notes/    → book-list           ← 新增
```

**docs/agent/inbox-to-content-workflow.md** 改（加 1 条链路）：

```markdown
# 在 4 条转化链路后追加第 5 条：
## book-notes → book-list
- 触发命令：`/book-list-from-inbox`
- 路径：`content/inbox/book-notes/*.md` → `content/book-list/<date-slug>.md`
- 状态：`draft` → Coya 改 `published`
- 模板：`docs/agent/book-list-template.md`
```

### 5.4 验收

- [ ] `content/inbox/book-notes/README.md` 存在
- [ ] `docs/agent/book-list-template.md` 存在
- [ ] `.claude/commands/book-list-from-inbox.md` 存在
- [ ] `content/README.md` 含 `book-list/` 一节
- [ ] `content/README.md` 含 `inbox/book-notes/` 一节
- [ ] `docs/agent/inbox-to-content-workflow.md` 含 5 条转化链路（原 4 条 + book-notes 新增）
- [ ] 手动跑 `/book-list-from-inbox <fixture>` 能生成 `status: draft` 草稿
- [ ] Coya 手动改 `status: published` 后，list / detail / tag 聚合均能访问

### 5.5 风险

| 风险 | 缓解 |
|------|------|
| Hermes 误把 draft 改成 published | 命令明确禁止；Coya 手动审阅 |
| genre 拼写不一致 | 模板推荐常见值；Coya 自定但文档列出 |
| inbox 目录空时命令误生成空草稿 | 命令 prompt 中加"如无内容则提示退出" |

---

## 6. Slice 6 — 验收 + docs 同步

### 6.1 目标
5 个 slice 完成后全量验证 + 文档同步 + 推送分支。

### 6.2 文件清单

| 路径 | 操作 |
|------|------|
| `CLAUDE.md` | 更新"当前开发状态"追加 v0.3 |
| `SPEC.md` | §18 版本演进表把 v0.3 状态改为 ✅ |
| `tasks/plan.md` + `tasks/todo.md` | 全部 mark done |

### 6.3 改动点

**CLAUDE.md** 当前开发状态追加 1 行：

```markdown
- ✅ **Book List 新栏目 v0.3 (2026.06)** — 第 7 个 collection 落地（card 列表 + 读书笔记详情 + 跨集合接入 + Hermes 工作流）
```

**SPEC.md** §18 版本演进表：

```markdown
| **v0.3** | Book List 新栏目 | ✅ 已合入 main（merge commit 待填） |
```

### 6.4 验收

- [ ] `npm run lint && npm run typecheck && npm run build && npm test` 全绿
- [ ] 手动跨页跳转核查：
  - `/` → portal 含 7 个入口卡（含 Book List）
  - Header 第 5 项 = Book List，跳 `/book-list`
  - `/book-list` → card 网格 → 点击 card → `/book-list/<slug>`
  - `/book-list/<slug>` → book 元信息 + MDX 正文 + ShareButtons
  - `/tags/<book-list tag>` → Book List 分组
  - Cmd+K 搜 book-list 关键词能搜到
  - `/sitemap.xml` 含 `/book-list` + 全部 published 详情页
  - footer Sections 含 Book List 链接
  - footer Recent 含 latestBook
- [ ] CLAUDE.md + SPEC.md + tasks/todo.md 全部同步
- [ ] 对照 SPEC §26 验收标准：5 个 slice 逐项打勾
- [ ] 分支 `feat/book-list` 推送到 origin（**用户确认后**）
- [ ] 合并到 main（**用户确认后**）

---

## 7. 风险汇总（v0.3 全局）

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| Slice A 没做完就开 Slice B，导致 B 引用不存在的 reader | 高 | 高 | 严格按依赖顺序：S1 → S2 → S3 → S4 → S5；每个 slice 完成后跑 `npm run typecheck` |
| `entry-card-book-list` 与 `content-card` 视觉重复 | 中 | 中 | 明确分工：book-list 用专属 `entry-card-book-list`（genre 徽章 + 三件套），content-card 留给 portal / about |
| `getContentByTag` 跨 7 collection 性能下降 | 低 | 低 | v0.2 已聚合 6 collection；v0.3 仅 +1 个 reader 拉取；后续可加缓存 |
| sitemap 详情页数量爆炸 | 低 | 低 | 只列 `status: published`；与 ai-tracker 一致 |
| Hermes 误把 draft 改成 published | 中 | 高 | `book-list-from-inbox.md` 命令明确禁止；Coya 手动审阅 |
| 类别枚举不规范（genre 拼写不一致） | 中 | 低 | 模板里推荐常见值（商业 / 文学 / 技术 / 历史 / 哲学 / 科学 / 其他），不强制；Coya 自定 |
| `/book-list` 列表页 0 条内容时点 card 跳 404 | 中 | 低 | S2 完成时 0 条 → 只显示 empty-state，无 card 可点 |
| globals.css 误改 token | 低 | 高 | S2 增量 diff review；不动 token 是 hard rule |
| 6 个 slices 串行执行时间累计较长 | 中 | 低 | 5+1 = 6 个 commit，每个 commit 独立可 revert；接受串行节省 agent token |
| Slice 4 测试 fixture 缺失（`getContentByTag("__test_tag_zzz__")` 行为依赖真实数据） | 低 | 中 | reader 已存在；测试仅验证 `bookList` 字段存在即可，不依赖数据命中 |

---

## 8. 不在本 plan 范围（红线）

- ❌ 设计 token 任何改动
- ❌ MDX 组件库新增（除 entry-card-book-list）
- ❌ 现有 6 个 collection 任何 schema 字段改动
- ❌ 现有 6 个 collection 任何 reader 函数改动（仅追加 `getBookListPosts`）
- ❌ Hermes 现有 5 个命令任何改动（仅追加 `book-list-from-inbox`）
- ❌ 新增 npm 依赖
- ❌ RSS feed（book-list 不是信号流）
- ❌ 阅读状态机 / 评分 / ISBN / 出版社 / 出版年 / 封面图
- ❌ 跨书聚合页（同主题 / 同作者）
- ❌ 「今年读了多少本」统计仪表盘
- ❌ 文章详情页 article-layout / toc / related-posts 体系改动
- ❌ 在 main 分支直接开发

---

## 9. 执行顺序

```
1. 建分支：feat/book-list（基于 main）
2. S1 (Slice A 基础设施)            ← 串行，dispatch agent
3. S2 (Slice B 列表卡片)            ← 串行，dispatch agent
4. S3 (Slice C 详情+Header)         ← 串行，dispatch agent
5. S4 (Slice D 跨集合)              ← 串行，dispatch agent
6. S5 (Slice E Hermes)              ← 串行，dispatch agent
7. S6 (验收 + docs 同步)            ← 串行，self-verify + commit
8. 推送：git push -u origin feat/book-list（**用户确认后**）
9. 合并：合并到 main（**用户确认后**）
```

**与 v0.2 区别**：v0.2 把 S2 + S3 并行；v0.3 全串行。理由：
- S2 改 globals.css + S3 改 nav/portal/footer，理论可并行（不同文件域）
- 但 S2 的列表页是 S3 详情页的 href 目标，必须 S2 完成后 S3 才能验证
- 节省 agent token 消耗 + 早期 slice 失败时及时止损

---

**Plan 完成。下一步：/dispatch 流水线执行 6 个 slices。**

---

# Plan — v0.4 Book List 重构为「书籍+笔记」模式

> 与 `todo.md` 配套的执行计划。
> 起点：v0.3 已合入 main，分支 `feat/book-list-v04` 待建。
> 设计系统：Stripe Press（**禁止改 token**）。
> 参考：`SPEC.md` §27 v0.4 增量规约。
> 对标：learning 栏目的完整组织模式（topic dir → _index.md + articles）。

---

## 0. 切片策略

按目标垂直切片（每个 slice 是一个完整的"改动 + 验收"路径），不做水平分层。

| 切片 | 标题 | 目标 | 文件数 | 可并行 | 依赖 |
|------|------|------|--------|--------|------|
| **S1** | Schema 拆分 | bookIndexSchema + bookNoteSchema，移除旧 bookListSchema | 2 | 否 | 无 |
| **S2** | Reader 重建 | getBookTopics/getBookNotes 等 + CollectionMap 更新 | 2 | 否 | S1 |
| **S3** | 内容迁移 | 现有唯一 .md → 子目录 _index.md | 2 | 是 | S2 |
| **S4** | 路由重建 | 3 层路由 page.tsx | 4 | 是 | S2 |
| **S5** | 组件改造 | EntryCardBookList → EntryCardBookTopic | 2 | 是 | S2 |
| **S6** | 跨集合更新 | sitemap/search/tags/footer/allTags | 5 | 否 | S3+S4+S5 |
| **S7** | Docs 同步 | agent docs + commands + CLAUDE.md | 5 | 否 | S6 |

**依赖关系**：
```
S1 → S2 → S3 + S4 + S5（可并行）
                  ↘
                   S6 → S7
```

**为什么 S3/S4/S5 可并行**：
- S3 只动 `content/book-list/` 目录（内容文件）
- S4 只动 `app/(site)/book-list/` 目录（路由页面）
- S5 只动 `components/` 目录（UI 组件）
- 三个 slice 文件域完全不重叠，各自独立验证

**S6 必须等 S3+S4+S5 都完成**：
- sitemap/search/tags 依赖 reader 函数 + 路由路径，需要 S4 的路由确定后才能正确生成 URL
- 但实现层面，只要 reader 函数签名已定（S2），S6 可以提前编写；只是验证需要 S3/S4/S5 的内容/路由/组件存在

**S7 必须等 S6 完成**：
- docs 中描述的命令和工作流要在所有代码改动锁死后才能更新，避免二次返工

---

## 1. Slice 1 — Schema 拆分（schemas.ts）

### 1.1 目标
新增 `bookIndexSchema` + `bookNoteSchema`，移除旧的 `bookListSchema`，更新所有类型引用。

### 1.2 文件清单

| 路径 | 操作 |
|------|------|
| `lib/content/schemas.ts` | 🔧 新增 2 schema + 移除 1 schema + 更新 SiteContent union |

### 1.3 改动点

**新增 `bookIndexSchema`**（在 `aiTrackerSchema` 之后）：

```ts
export const bookIndexSchema = baseContentSchema.extend({
  kind: z.literal("book-index"),
  book: z.string(),
  author: z.string(),
  genre: z.string(),
  tags: stringArraySchema,
  lang: z.string().default("zh"),
  cover: z.string().optional(),
  translator: z.string().optional(),
  finishedDate: z.string().optional(),
});
```

**新增 `bookNoteSchema`**：

```ts
export const bookNoteSchema = baseContentSchema.extend({
  kind: z.literal("book-note"),
  book: z.string(),
  tags: stringArraySchema,
  lang: z.string().default("zh"),
  chapter: z.string().optional(),
});
```

**移除**：
- `bookListSchema` 定义
- `BookListPost` 类型
- `schemaByKind["book-list"]`
- `SiteContent` union 中的 `BookListPost`

**更新**：
- `schemaByKind`：加 `"book-index": bookIndexSchema` + `"book-note": bookNoteSchema`
- `ContentKind`：`"book-list"` → `"book-index" | "book-note"`（自动从 `schemaByKind` 推导）
- `SiteContent`：加 `BookIndexPost | BookNotePost`
- 导出 `BookIndexPost` + `BookNotePost` 类型

### 1.4 验收
- `npm run typecheck` 报错（这是预期的——reader.ts 和其他文件还引用旧的 `BookListPost` / `"book-list"` kind，会在后续 slice 修复）

---

## 2. Slice 2 — Reader 重建（reader.ts）

### 2.1 目标
新增 4 个 reader 函数（对标 learning），更新 `CollectionMap`、`emptyKindCounts`、`getAllTags`、`getContentByTag` 等内部函数，移除 `getBookListPosts`，更新 `getContentBySlug` 对 book-list 的支持。

### 2.2 文件清单

| 路径 | 操作 |
|------|------|
| `lib/content/reader.ts` | 🔧 新增 4 函数 + 移除 1 函数 + 更新内部类型和循环 |
| `lib/content/index.ts` | （不动，`export * from "./reader"` 自动覆盖） |

### 2.3 改动点

**新增函数**（参照 learning 的函数签名）：

```ts
// ── Book Topics ──

export type BookTopicSummary = {
  book: string;
  title: string;
  author: string;
  genre: string;
  summary: string;
  noteCount: number;
};

async function readBookTopic(book: string, includeDrafts = false): Promise<(BookIndexPost | BookNotePost)[]> {
  const items = await readCollection("book-list", book);
  return items.filter((item) => (includeDrafts ? true : item.status === "published"));
}

export async function getBookTopics(): Promise<BookTopicSummary[]> {
  const root = path.join(CONTENT_ROOT, "book-list");
  if (!(await fileExists(root))) return [];

  const entries = await fs.readdir(root, { withFileTypes: true });
  const bookDirs = entries.filter((entry) => entry.isDirectory());

  const topics = await Promise.all(
    bookDirs.map(async (entry) => {
      const book = entry.name;
      const [indexPost, notes] = await Promise.all([
        getBookTopicIndex(book),
        getBookNotes(book),
      ]);
      if (!indexPost) return null;
      return {
        book,
        title: indexPost.title,
        author: indexPost.author,
        genre: indexPost.genre,
        summary: indexPost.summary,
        noteCount: notes.length,
      } satisfies BookTopicSummary;
    }),
  );
  return topics
    .filter((t): t is BookTopicSummary => t !== null)
    .toSorted((a, b) => a.title.localeCompare(b.title));
}

export async function getBookTopicIndex(book: string): Promise<BookIndexPost | null> {
  const items = await readBookTopic(book, false);
  return items.find((item) => item.kind === "book-index" && item.slug === "_index") as BookIndexPost | null;
}

export async function getBookNotes(book: string, includeDrafts = false): Promise<BookNotePost[]> {
  const items = await readBookTopic(book, includeDrafts);
  return byNewestDate(
    items.filter((item): item is BookNotePost => item.kind === "book-note" && isArticleSlug(item.slug))
  );
}

export async function getBookNoteBySlug(book: string, slug: string): Promise<BookNotePost | null> {
  const items = await readBookTopic(book, false);
  const decoded = decodeSlug(slug);
  return items.find((item) => item.kind === "book-note" && item.slug === decoded) as BookNotePost | null;
}
```

**关键实现细节**：
- `readBookTopic(book)` 调用 `readCollection("book-list", book)` —— 复用了现有的 `readCollection` 第二个参数 `subDirectory`
- `_index.md` 通过 `kind === "book-index"` 识别，NOT 通过文件名 `_index`（但 slug 确实是 `_index`）
- `isArticleSlug` 复用 learning 的 helper（过滤掉 `_index` slug）

**移除**：
- `getBookListPosts()` 函数
- `CollectionMap["book-list"]`

**更新**：
- `CollectionMap`：`"book-index": BookIndexPost` + `"book-note": BookNotePost`
- `emptyKindCounts()`：加 `"book-index": 0` + `"book-note": 0`，删 `"book-list": 0`
- `getAllTags()`：bump 循环拆为 bookIndex + bookNote
- `getContentByTag()`：`TaggedContentByKind` 类型更新，`bookList: BookListPost[]` → `bookIndex: BookIndexPost[]` + `bookNote: BookNotePost[]`
- `_opts` 参数改为 `_opts?: GetContentByTagOptions`（类型已存在，不用改）

### 2.4 验收
- `npm run typecheck` 通过（reader.ts 内部无类型错误）
- 其他文件如果还引用 `getBookListPosts` / `BookListPost` 会报错（在后续 Slice 修复）

---

## 3. Slice 3 — 内容迁移（现有唯一文件）

### 3.1 目标
将 `content/book-list/2026-06-23-designing-data-intensive-applications.md` 迁移到新的子目录结构。

### 3.2 文件清单

| 路径 | 操作 |
|------|------|
| `content/book-list/designing-data-intensive-applications/_index.md` | ⭐ 新建（从旧文件迁移内容） |
| `content/book-list/2026-06-23-designing-data-intensive-applications.md` | ✂ 删除 |

### 3.3 改动点

1. 创建子目录 `content/book-list/designing-data-intensive-applications/`
2. 将旧文件内容复制到 `_index.md`
3. 修改 frontmatter：
   - `kind: "book-list"` → `kind: "book-index"`
   - 新增 `book: "designing-data-intensive-applications"`
   - 保留 `title` / `date` / `summary` / `status: published` / `author` / `genre` / `tags` / `lang` / `englishSummary`
4. 删除旧文件

### 3.4 验收
- 文件系统仅含 `content/book-list/designing-data-intensive-applications/_index.md`
- `getBookTopics()` 返回 1 条记录（book = `designing-data-intensive-applications`，noteCount = 0）
- `getBookTopicIndex("designing-data-intensive-applications")` 返回 non-null

---

## 4. Slice 4 — 路由重建（3 层路由）

### 4.1 目标
重建 `/book-list` 的 3 层路由，删除旧的 `[slug]` 路由。

### 4.2 文件清单

| 路径 | 操作 |
|------|------|
| `app/(site)/book-list/page.tsx` | 🔧 重写：按书籍分组列表 |
| `app/(site)/book-list/[book]/page.tsx` | ⭐ 新建：书籍索引页 |
| `app/(site)/book-list/[book]/[slug]/page.tsx` | ⭐ 新建：笔记详情页 |
| `app/(site)/book-list/[slug]/page.tsx` | ✂ 删除 |

### 4.3 改动点

#### 4.3.1 `/book-list/page.tsx` — 书籍分组列表（对标 `/learning`）

```tsx
import { CollectionList } from "@/components/collection-list";
import { EntryCardBookTopic } from "@/components/entry-card-book-topic";
import { getBookTopics } from "@/lib/content";

export const metadata = {
  title: "Book List",
  description: "Books I've read, with structured notes on what I took away.",
};

export default async function BookListPage() {
  const books = await getBookTopics();

  return (
    <div className="page-shell">
      <CollectionList
        title="Book List"
        description="Books with reading notes, organized by chapter and theme."
      >
        {books.length === 0 ? (
          <p className="empty-state">尚无书籍。开始记录第一本 →</p>
        ) : (
          <div className="book-topic-grid">
            {books.map((book) => (
              <EntryCardBookTopic
                key={book.book}
                href={`/book-list/${book.book}`}
                title={book.title}
                author={book.author}
                genre={book.genre}
                summary={book.summary}
                noteCount={book.noteCount}
              />
            ))}
          </div>
        )}
      </CollectionList>
    </div>
  );
}
```

#### 4.3.2 `/book-list/[book]/page.tsx` — 书籍索引页（对标 `/learning/[topic]`）

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionList } from "@/components/collection-list";
import { getBookNotes, getBookTopicIndex, getBookTopics } from "@/lib/content";
import { SITE_NAME } from "@/lib/metadata";

type BookPageProps = { params: Promise<{ book: string }> };

export async function generateStaticParams() {
  const topics = await getBookTopics();
  return topics.map((t) => ({ book: t.book }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { book } = await params;
  const indexPost = await getBookTopicIndex(book);
  if (!indexPost) return {};
  return {
    title: indexPost.title,
    description: indexPost.summary,
    openGraph: { title: indexPost.title, description: indexPost.summary, siteName: SITE_NAME },
    twitter: { card: "summary", title: indexPost.title, description: indexPost.summary },
  };
}

export default async function BookTopicPage({ params }: BookPageProps) {
  const { book } = await params;
  const [indexPost, notes] = await Promise.all([
    getBookTopicIndex(book),
    getBookNotes(book),
  ]);
  if (!indexPost) notFound();

  return (
    <div className="page-shell">
      <CollectionList
        title={indexPost.title}
        description={`${notes.length} notes on this book.`}
        actions={<Link className="button secondary" href="/book-list">← All books</Link>}
      >
        {/* Book meta block */}
        <div className="book-meta-block">
          <span>by {indexPost.author}</span>
          {indexPost.genre ? <span> · {indexPost.genre}</span> : null}
          {indexPost.finishedDate ? <span> · Finished {indexPost.finishedDate}</span> : null}
        </div>

        {notes.length === 0 ? (
          <p className="empty-state">尚无笔记。开始写第一篇 →</p>
        ) : (
          <ul className="entry-card-book-note-list">
            {notes.map((note) => (
              <li key={note.slug}>
                <Link href={`/book-list/${book}/${note.slug}`}>
                  <h3>{note.title}</h3>
                  <p>{note.summary}</p>
                  <span>{note.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CollectionList>
    </div>
  );
}
```

#### 4.3.3 `/book-list/[book]/[slug]/page.tsx` — 笔记详情页（对标 `/learning/[topic]/[slug]`）

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MdxContent } from "@/components/mdx-content";
import { BlogPostingJsonLd } from "@/components/json-ld";
import { ShareButtons } from "@/components/share-buttons";
import { ArticleKeyboardNav } from "@/components/article-keyboard-nav";
import { SeriesNav } from "@/components/series-nav";
import { RelatedPosts, getRelatedPosts } from "@/components/related-posts";
import { getBookNoteBySlug, getBookNotes, getBookTopics } from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";
import { articleMetadata, buildUrl } from "@/lib/metadata";
import { readingTimeLabel } from "@/lib/reading-time";

type NotePageProps = { params: Promise<{ book: string; slug: string }> };

export async function generateStaticParams() {
  const topics = await getBookTopics();
  const noteLists = await Promise.all(
    topics.map(async (t) => {
      const notes = await getBookNotes(t.book);
      return notes.map((note) => ({ book: t.book, slug: note.slug }));
    }),
  );
  return noteLists.flat();
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { book, slug } = await params;
  const post = await getBookNoteBySlug(book, slug);
  if (!post) return {};
  return articleMetadata({ ...post, path: `book-list/${book}` });
}

export default async function BookNotePage({ params }: NotePageProps) {
  const { book, slug } = await params;
  const [post, allNotes] = await Promise.all([
    getBookNoteBySlug(book, slug),
    getBookNotes(book),
  ]);
  if (!post) notFound();

  const headings = extractHeadings(post.body);
  const url = buildUrl(`/book-list/${book}/${slug}`);

  const related = getRelatedPosts(
    { slug: post.slug, tags: post.tags, path: `book-list/${book}` },
    allNotes.map((n) => ({ title: n.title, slug: n.slug, tags: n.tags, date: n.date, path: `book-list/${book}` })),
  );

  // Series nav within same book
  let seriesPrev = null, seriesNext = null;
  if (post.series) {
    const seriesNotes = allNotes
      .filter((n) => n.series === post.series)
      .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
    const idx = seriesNotes.findIndex((n) => n.slug === post.slug);
    if (idx > 0) seriesPrev = { title: seriesNotes[idx - 1].title, slug: `/book-list/${book}/${seriesNotes[idx - 1].slug}`, date: seriesNotes[idx - 1].date };
    if (idx < seriesNotes.length - 1) seriesNext = { title: seriesNotes[idx + 1].title, slug: `/book-list/${book}/${seriesNotes[idx + 1].slug}`, date: seriesNotes[idx + 1].date };
  }

  const postIdx = allNotes.findIndex((n) => n.slug === slug);
  const prevNote = postIdx > 0 ? allNotes[postIdx - 1] : undefined;
  const nextNote = postIdx < allNotes.length - 1 ? allNotes[postIdx + 1] : undefined;

  return (
    <ArticleLayout headings={headings}>
      <BlogPostingJsonLd post={post} path={`book-list/${book}`} />
      <ArticleKeyboardNav
        prevUrl={prevNote ? `/book-list/${book}/${prevNote.slug}` : undefined}
        nextUrl={nextNote ? `/book-list/${book}/${nextNote.slug}` : undefined}
      />
      <article className="article-shell">
        <header className="article-header">
          <span>{post.date} · <span className="reading-time">{readingTimeLabel(post.body)}</span></span>
          <h1>{post.title}</h1>
          <p>{post.summary}</p>
          {post.englishSummary ? <p className="english-summary">{post.englishSummary}</p> : null}
        </header>
        <MdxContent source={post.body} />
        <SeriesNav series={post.series ?? ""} prev={seriesPrev} next={seriesNext} />
        <ShareButtons title={post.title} url={url} />
      </article>
      <RelatedPosts posts={related} />
    </ArticleLayout>
  );
}
```

### 4.4 验收
- `/book-list` 渲染书籍列表
- `/book-list/designing-data-intensive-applications` 渲染书籍索引页
- `/book-list/designing-data-intensive-applications/<slug>` 渲染笔记详情页（有笔记时）
- 如果该目录只有 `_index.md`（0 篇笔记），书籍索引页显示 empty-state
- `npm run typecheck` 对该目录下的新文件零报错

---

## 5. Slice 5 — 组件改造（EntryCardBookTopic）

### 5.1 目标
新建/改造书籍分组卡片组件，替换旧的 `EntryCardBookList`。

### 5.2 文件清单

| 路径 | 操作 |
|------|------|
| `components/entry-card-book-topic.tsx` | ⭐ 新建：书籍分组卡片（对标 `EntryCardLearning`） |
| `components/entry-card-book-list.tsx` | ✂ 删除（被新组件替代） |
| `app/globals.css` | 🔧 新增 `.book-topic-grid` + `.book-topic-card`（或复用现有 `.book-card` 样式） |

### 5.3 改动点

**`EntryCardBookTopic` props**：

```ts
type EntryCardBookTopicProps = {
  href: string;
  title: string;
  author: string;
  genre: string;
  summary?: string;
  noteCount: number;
};
```

**CSS 策略**：
- 旧 `.book-list-grid` 可改为 `.book-topic-grid`（语义更准确）
- 或直接复用 `.article-card-grid` 等通用网格类
- **红线**：不改 token（--space-* / --border / --muted / --accent / --font-*）

### 5.4 验收
- `EntryCardBookTopic` 组件渲染书名、作者、genre、noteCount、summary
- `/book-list` 使用新组件渲染
- 旧 `EntryCardBookList` 不再被任何文件 import
- `npm run lint && npm run typecheck` 通过

---

## 6. Slice 6 — 跨集合更新

### 6.1 目标
更新所有跨集合引用文件，确保 sitemap / search / tags / footer / page.tsx 全部对齐新结构。

### 6.2 文件清单

| 路径 | 操作 |
|------|------|
| `app/sitemap.ts` | 🔧 更新 sitemap 生成逻辑（3 层路由） |
| `app/api/search/route.ts` | 🔧 更新 search 聚合（遍历 book note） |
| `app/(site)/tags/[tag]/page.tsx` | 🔧 TaggedContentByKind 类型更新 + 渲染 |
| `components/section-footer.tsx` | 🔧 latestBook 改为 getBookTopics |
| `app/(site)/page.tsx` | （不动，portalEntries 路由 /book-list 不变） |
| `lib/content/reader.test.ts` | 🔧 更新测试 |

### 6.3 改动点

#### 6.3.1 sitemap.ts

```ts
// 旧：getBookListPosts() → /book-list/<slug>
const books = await getBookTopics();

const bookIndexUrls = books.map((book) => ({
  url: buildUrl(`/book-list/${book.book}`),
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));

const bookNoteUrls: MetadataRoute.Sitemap = [];
for (const book of books) {
  const notes = await getBookNotes(book.book);
  for (const note of notes) {
    bookNoteUrls.push({
      url: buildUrl(`/book-list/${book.book}/${note.slug}`),
      lastModified: new Date(note.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    });
  }
}

return [
  { url: buildUrl("/book-list"), ... },
  ...bookIndexUrls,
  ...bookNoteUrls,
  ...
];
```

#### 6.3.2 search/route.ts

```ts
// 旧：getBookListPosts()
const books = await getBookTopics();

for (const book of books) {
  const notes = await getBookNotes(book.book);
  for (const note of notes) {
    const score = matchScore(query, `${note.title} ${note.summary} ${note.body}`);
    if (score > 0) {
      hits.push({
        title: note.title,
        summary: note.summary,
        url: `/book-list/${book.book}/${note.slug}`,
        date: note.date,
      });
    }
  }
}
```

#### 6.3.3 tags/[tag]/page.tsx

```ts
// 旧：import { EntryCardBookList } ...
// 旧：items.bookList.map(post => ...)

// 新：
import { EntryCardBookTopic } from "@/components/entry-card-book-topic";

// 按 tag 匹配 bookNote
{totalByKind.bookNote > 0 ? (
  <section>
    <h2>Book Notes</h2>
    <ul>
      {items.bookNote.map((note) => (
        <li key={note.slug}>
          <Link href={`/book-list/${note.book}/${note.slug}`}>
            {note.title}
          </Link>
        </li>
      ))}
    </ul>
  </section>
) : null}

// bookIndex 也可以聚合（如果 index 本身的 tags 匹配）
```

#### 6.3.4 section-footer.tsx

```ts
// 旧：getBookListPosts()
const books = await getBookTopics();
// latestBook 逻辑改为取最近更新的 book topic（或最近有 note 更新的 book）
```

#### 6.3.5 reader.test.ts

更新测试以适配新的函数名和返回类型。

### 6.4 验收
- `npm run build` 通过（无类型错误、无死引用）
- `/sitemap.xml` 含 book-index + book-note 路由
- Cmd+K 搜到 book-note 内容
- `/tags/<tag>` 含 Book Notes 分组
- Footer 正确显示 latest book
- `npm test` 通过

---

## 7. Slice 7 — Docs 同步

### 7.1 目标
更新所有 agent docs、commands、CLAUDE.md 中对 book-list 的描述。

### 7.2 文件清单

| 路径 | 操作 |
|------|------|
| `docs/agent/book-list-template.md` | 🔧 拆分为 book-index + book-note 两个模板 |
| `.claude/commands/book-list-from-inbox.md` | 🔧 输出路径改为子目录结构 |
| `docs/agent/inbox-to-content-workflow.md` | 🔧 book-list 转化链路更新 |
| `content/inbox/book-notes/README.md` | 🔧 新目录结构说明 |
| `CLAUDE.md` | 🔧 当前开发状态更新 |

### 7.3 验收
- 所有 docs 引用与代码实际结构一致
- CLAUDE.md 当前开发状态含 v0.4 条目

---

## 8. 执行顺序

```
1. git checkout main && git pull（确认最新）
2. git checkout -b feat/book-list-v04
3. S1 (Schema 拆分)               ← 串行
4. S2 (Reader 重建)               ← 串行
5. S3 (内容迁移)  + S4 (路由重建) + S5 (组件改造)  ← 三路并行
6. S6 (跨集合更新)                ← 串行（等 S3+S4+S5）
7. S7 (Docs 同步)                 ← 串行（等 S6）
8. 全量验证：npm run lint && npm run typecheck && npm run build && npm test
9. 推送：git push -u origin feat/book-list-v04（**用户确认后**）
10. 合并到 main（**用户确认后**）
```

**与 v0.3 区别**：
- v0.3 全串行（6 slices，每个等上一个完成）
- v0.4 在 S2 完成后 S3/S4/S5 三路并行（文件域不重叠），减少总耗时

---

**Plan 完成。下一步：执行 7 个 slices。**
