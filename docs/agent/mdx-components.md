# MDX 组件契约

本站只渲染仓库自有、经过检查和人工审核的 MDX。`next-mdx-remote/rsc` 的组件注册表位于 `components/mdx-content.tsx`；本文只记录实际注册能力，不把未注册能力写成正文 API。

作者不需要 `import` 组件。禁止 `import/export`、任意 JavaScript、事件处理器、动态表达式、属性展开、`dangerouslySetInnerHTML`、外部用户上传内容和未经核验的图片路径。`remarkStaticProps` 只把静态属性编码，`decodeStaticProps` 再还原；组件属性只能是静态字符串、布尔值、数组或对象，并通过 authoring checker 的 Zod schema。

## 能力目录：注册表优先

### 可以在正文直接书写的组件

| 组件 | 真实属性 | 解决的阅读问题 | 属性检查 |
| --- | --- | --- | --- |
| `Callout` | `type?`、`title?` | 标记证据边界、限制、提醒或结论 | 完整 |
| `Timeline` | 以实现为准，使用前读源码 | 展示时间线 | 白名单，未做完整 props schema |
| `Tabs` | `label?`；子组件 `Tab` | 比较并行方案或视角 | `label` 完整 |
| `Tab` | `label` | 作为 `Tabs` 的一个并行面板 | `label` 完整 |
| `Accordion` | `title`、`open?` | 放置非核心补充 | 完整 |
| `CodeTabs` | `label?`、`items[]` | 比较同一示例的多种代码写法 | 完整 |
| `FileTree` | `title?`、`items[]` | 解释目录层级和文件职责 | 完整 |
| `Terminal` | `title?`、`lines[]` | 区分命令和输出 | 完整 |
| `Mermaid` | `chart` | 表达真实流程、关系或分支 | 完整 |
| `GitHubCard` | `repository`、`name`、`description`、`url`；`language?`、`stars?`、`forks?`、`license?` | 说明外部项目来源、用途和作者核验时的公开信息快照 | 完整；只接受 GitHub HTTPS 仓库链接 |
| `LinkPreview` | `url`、`title`、`description`；`image?`、`siteName?` | 在跳转外部资料前补充标题、用途和来源上下文 | 完整；URL 只接受 HTTPS，图片只接受无 query/fragment 的根相对路径 |
| `Tweet` | 以实现为准 | 嵌入已核验的 Tweet | 白名单，未做完整 props schema |
| `YouTube` | 以实现为准 | 嵌入已核验的视频 | 白名单，未做完整 props schema |
| `VisualDnaBuilder` | 以实现为准 | 视觉分析型内容 | 白名单，未做完整 props schema |
| `VisualStorytellingFramework` | 以实现为准 | 视觉叙事分析 | 白名单，未做完整 props schema |
| `ImageCaptionGrid` / `ImageCaptionItem` | 以实现为准 | 图片与说明的网格展示 | 白名单，未做完整 props schema |
| `ImageTextList` / `ImageTextItem` | 以实现为准 | 图文列表 | 白名单，未做完整 props schema |
| `LightingDirectionCarousel` | 以实现为准 | 视觉方向对照 | 白名单，未做完整 props schema |

未列出完整 schema 的组件不能猜属性。写作前打开真实组件源码核对 API，并用 `npm run mdx:check` 验证。

### 页面自动处理，不要手写同名标签

- `h2`、`h3`：生成锚点，页面据此提供文章目录。
- `pre`：自动包装 Markdown 代码围栏，支持语言、文件名、行号、复制；Mermaid 围栏自动交给 `Mermaid`。
- `img`：本地图片自动走 `ImageLightbox`，支持放大和 Escape 返回。
- `table`：自动包裹横向滚动区域。
- 系列导航：由 frontmatter 的 `series`、`seriesOrder` 自动注入。
- 相关文章：由页面按 tags 自动推荐。

这些能力不是正文标签，也不应手写 `<TableOfContents>`、`<ImageZoom>`、`<SeriesNavigation>` 或 `<RelatedPosts>`。

## 按阅读问题选择组件

| 阅读问题 | 选择 | 不要这样用 |
| --- | --- | --- |
| 我要提醒证据边界、未知或限制 | `Callout` | 不要把核心论点全部藏在提示卡片里 |
| 我要比较并行方案或视角 | `Tabs` + `Tab` | 不要把线性步骤拆成 Tabs |
| 我要隐藏非核心补充 | `Accordion` | 不要把读者必须看到的结论放进去 |
| 我要展示代码差异 | `CodeTabs` | 不要用它代替一段普通代码围栏 |
| 我要解释目录职责 | `FileTree` | 不要展示与文章无关的虚构目录 |
| 我要区分命令和输出 | `Terminal` | 不要把它当作执行器；组件只展示文本 |
| 我要表达真实流程、关系或分支 | Mermaid | 不要为两个简单并列项画图 |
| 我要展示本地图片 | Markdown 图片 | 不要引用外部图片 URL 或不存在的路径 |
| 我要展示普通并列数据 | Markdown 表格 | 不要同时重复做一张信息图 |
| 我要说明外部 GitHub 项目的来源和用途 | `GitHubCard` | 普通链接足够时不要加卡片；不要把快照指标写成实时数据 |
| 我要在打开外部资料前提供标题和用途 | `LinkPreview` | 不要抓取 metadata、渲染外部 HTML，或用卡片代替正文引用 |

先写清楚内容，再判断组件是否带来明确阅读收益。组件不是装饰，不预设文章章节数量，也不替代作者观点。图片组、图文列表和 YouTube 已有实现，不为同类场景重复设计组件。

`GitHubCard` 和 `LinkPreview` 都是作者提供的静态、已核验快照：组件不会访问 URL、调用 GitHub API、抓取 OG metadata 或渲染目标页面 HTML。GitHub 的 stars、forks、license 等字段可能过期，不能暗示实时数量、项目活跃度或业务成效。`LinkPreview.image` 只引用仓库内真实存在的根相对图片路径；没有图片时省略该属性，不填写外部图片 URL。

## 组件写法和静态属性

组件前后留空行。正文标题从 `##` 开始，文章标题由 frontmatter 渲染，正文禁止一级标题。

`Tabs` 新稿使用子组件 API：

```mdx
<Tabs label="两种视角">
  <Tab label="业务">

先核对目标和证据。

  </Tab>
  <Tab label="实施">

再核对输入、输出和验收。

  </Tab>
</Tabs>
```

旧版 `tabs={[{ label, children }]}` 仍由 `Tabs` 组件兼容已有文章，但 `children` 不能作为新稿的静态作者 API，优先使用 `Tab` 子组件。

`Callout` 的 `type` 为 `info`、`warning`、`danger`、`tip`、`success`。`Accordion` 的 `open` 是可选布尔值。

```mdx
<CodeTabs label="配置格式" items={[
  { label: "JSON", language: "json", filename: "config.json", code: '{\n  "status": "draft"\n}' },
  { label: "YAML", language: "yaml", filename: "config.yaml", code: 'status: draft' }
]} />

<FileTree title="内容目录" items={[
  { name: "content", children: [
    { name: "article.mdx", comment: "等待审核的草稿" }
  ] }
]} />

<Terminal title="检查示例" lines={[
  { command: "npm run typecheck", output: "检查通过（示例输出）" }
]} />

<Mermaid chart="flowchart LR\n  A[素材] --> B[确认]\n  B --> C[草稿]" />
```

`CodeTabs.items[]` 必须有 `label` 和 `code`，`language`、`filename` 可选；未知语言回退为纯文本。`FileTree.items[]` 的 `name` 必填，`comment` 可选，`children` 可递归。`Terminal.lines[]` 的 `command` 必填，`output` 可选；复制只提取命令，不执行命令。`Mermaid.chart` 必填。

代码围栏是普通 Markdown：

````mdx
```typescript title="workflow.ts" showLineNumbers {2}
const status = "draft";
```
````

Mermaid 可以使用围栏或显式标签。显式标签的数据同样必须静态编码。Mermaid 必须同时通过源码语法检查和浏览器实际 SVG 检查；源码回退不等于图表验收通过。

## 最小安全契约

authoring checker 会拒绝：

- `import`、`export`、MDX 表达式和任意 JavaScript；
- 事件属性、属性展开和 `dangerouslySetInnerHTML`；
- 未注册组件和不符合 schema 的属性；
- 一级标题；
- 缺少 alt、协议相对、带 query/fragment、含 `%` 或 `..` 的图片路径；
- 非 `https`、`mailto`、`tel`、站内根路径或锚点的链接。

检查命令：

```bash
npm run mdx:check -- <file>
```

`/labs/mdx` 用于预览两个仓库样板；`/labs/drafts/<slug>` 用于开发环境预览草稿，生产环境返回 404。检查器会编译和检查作者契约，但**不会执行 MDX，也不是沙箱**；它不验证事实、文字质量或 Mermaid 实际渲染。不要把外部用户上传或 Notion 原文直接交给 MDXRemote，先提取资料、按本文 API 重写，再检查和人工审核。

## 验收清单

- [ ] 正文从 `##` 开始，组件前后留空行。
- [ ] 所有组件来自实际注册表，属性名和必填项与源码一致。
- [ ] 普通段落、列表或表格已经足够的地方没有额外组件。
- [ ] 图片路径真实存在，alt 描述图片传达的信息。
- [ ] `npm run mdx:check -- <file>` 通过。
- [ ] 含交互组件时检查键盘焦点、Tabs/Accordion 行为、代码复制和表格滚动。
- [ ] 含 Mermaid 时检查源码语法、实际 SVG、错误状态、桌面和窄屏布局。
- [ ] 发布前运行 `typecheck`、`lint`、`test`、`content:audit`、`build`；图片变化另跑图片检查。
