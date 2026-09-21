# Content

This directory is the source of truth for writing and career material.

```txt
blog/         Technical writing, ideas, learning notes
weekly/       Weekly reviews and personal logs
projects/     Project records and portfolio pages
career/       Resume bullets, STAR stories, profile material
book-list/    读书笔记 — 读过的书 + 摘要 + 个人收获 (`.md`)
course-list/  视频课程笔记 — 按模块组织的学习笔记 (`.md`)
inbox/
  ideas/         → blog
  logs/          → weekly
  project-notes/ → projects
  career-notes/  → career
  book-notes/    → book-list
  course-notes/  → course-list
```

Default format is Markdown (`.md`). Use MDX (`.mdx`) only when a page needs React components, richer layout, diagrams, or embedded demos.

## Blog Images

博客正文图片统一放在 `public/images/blog/<post-slug>/`，通过 `npm run images:add` 导入，并在发布前运行 `npm run images:check`。完整约定见 [`docs/agent/blog-image-workflow.md`](../docs/agent/blog-image-workflow.md)。

## Status Values

- `draft`: not public
- `published`: visible on public pages
- `archived`: kept in the repository but hidden from primary lists

Hermes agent may create and edit drafts. Hermes must not change content to `published` unless explicitly instructed by the owner.

## Mermaid Diagrams

Mermaid diagrams render on the **client** via the official `mermaid` library. The site provides two ways to embed them, both routed through the `<Mermaid>` client component:

### Option 1 — Fenced code block (recommended for most cases)

````md
```mermaid
graph LR
  A[Write] --> B{Review?}
  B -->|Yes| C[Publish]
  B -->|No| D[Iterate]
```
````

`components/mdx-content.tsx` overrides the `pre` element to detect `language-mermaid` and hand the chart text to `<Mermaid>`. Other fenced blocks (TypeScript, JSON, etc.) render normally as `<pre><code>`.

### Option 2 — `<Mermaid>` component directly

Useful when the chart source is computed or interpolated:

```mdx
<Mermaid
  chart="graph TD
    A[Start] --> B[End]"
/>
```

The `chart` prop must be a **plain string**. Do not use a JSX template-literal expression (`chart={`…`}`) — the MDX → RSC serializer drops the value. Use double-quoted strings (regular or multi-line) instead.

### Behavior and limitations

- **File extension**: both forms require the file to be `.mdx` (not `.md`), because the component is registered in the MDX component map.
- **First render**: a `mermaid-loading` placeholder is shown while the browser fetches and runs Mermaid. The SVG replaces it after hydration.
- **Errors**: invalid Mermaid syntax falls back to a `<pre class="mermaid-error">` containing the original chart text plus a `mermaid-error-message` span. The page does not crash.
- **Security**: Mermaid runs with `securityLevel: "strict"`, so click events in flowcharts and external scripts are disabled.
- **Client JS cost**: Mermaid is a ~600 KB client bundle loaded only on pages that contain a `<Mermaid>` component.

## No `<url>` Autolinks (`.md` Included)

`.md` content is compiled by the same MDX pipeline as `.mdx`, so CommonMark autolinks break the build:

```md
- 官方站点：<https://example.com/>              <!-- ✗ aborts the build -->
- 官方站点：[example.com](https://example.com/) <!-- ✓ -->
```

MDX parses `<` as the start of a JSX element, so `<https://…>` fails with
`[next-mdx-remote] error compiling MDX: Unexpected character '/' (U+002F) before local name`.
The failure surfaces at prerender time and aborts `next build` for that route — `npm run dev`
can still serve other pages, so it is easy to miss until you hit the page or build.

## JSX Serialization Gotcha

The MDX pipeline (`next-mdx-remote/rsc`) sends JSX props across the React Server → Client boundary as part of the RSC payload. Two patterns **silently drop the value** and the prop arrives as `undefined` at runtime:

1. **Template literals as attribute values**
   ```mdx
   <Mermaid chart={`graph LR\nA-->B`} />   {/* chart arrives as undefined */}
   ```
2. **Array literals as attribute values** — including arrays of objects and arrays containing JSX children
   ```mdx
   <Timeline items={[{ label: "Mon", title: "..." }]} />   {/* items arrives as undefined */}
   <Tabs tabs={[{ label: "Tab 1", children: <>...</> }]} />   {/* tabs arrives as undefined */}
   ```

### Workarounds

- **Pass data as a plain string** (the value is JSON-encoded) and parse it in the component. Works for Mermaid's `chart` prop; ugly for rich JSX.
- **Import data from a separate file** at the top of the MDX file:
  ```mdx
  import { timelineItems } from "./w15-data"
  <Timeline items={timelineItems} />
  ```
  The import resolves to a module export that the RSC serializer can walk. Co-locate `w15-data.ts` next to `w15.mdx`.
- **Use plain Markdown** (tables, lists) and skip the component entirely. The page does not need `<Timeline>` for a list of dated events.

All three custom MDX components (`Callout`, `Timeline`, `Tabs`) render a helpful "missing data" placeholder when their required array prop is undefined, so a partially-broken MDX file no longer crashes the whole page — it just renders an explanatory note in place of the component.

## Book List frontmatter

Book List 是读书笔记栏目 — 记录读完的书、核心观点、个人收获与可执行改变。每条 = 一本书(不是一章)。

### 必填字段

- `title`, `date`, `summary`, `status` — 与其他 collection 一致
- `author` — 作者全名
- `genre` — 单字段粗分类,见 `docs/agent/book-list-template.md` 的 `genre` 枚举
- `tags` — 细粒度标签(2-5 个,概念而非形容词)

### 可选字段

- `lang` — 默认 `zh`
- `englishSummary` — 1-2 句英文摘要

### Drafts

`status: draft` 条目被 `/book-list` 列表和详情路由过滤掉,草稿期间不可见。Coya 手动改为 `published` 后才会公开。

### 转化路径

`content/inbox/book-notes/` 的碎片通过 `/book-list-from-inbox` 整理为 `content/book-list/<date>-<slug>.md`。
