# 博客 MDX 组件契约

本站用 `next-mdx-remote/rsc` 渲染受信任的仓库内容，组件在 `components/mdx-content.tsx` 注册。文章无需 `import`，不要加入任意 JavaScript、事件处理器或动态表达式。

`next-mdx-remote` 6 的 `blockJS` 保持默认开启。`remarkStaticProps` 只把 V1 组件的静态字面量属性转换为数据，再由注册适配器还原；函数、变量访问和模板插值不会作为组件逻辑执行。

组件选型依据：[Notion 设计说明](https://app.notion.com/p/MDX-Next-js-3f98de6ee7d281568082e0390f13f8ad)。实现参考 [Next.js MDX 文档](https://nextjs.org/docs/app/guides/mdx)与 [rehype-pretty-code 文档](https://rehype-pretty.pages.dev/)。

## V1 的 12 个能力

| 能力 | 项目 API | 使用场景 |
| --- | --- | --- |
| Callout | `<Callout type="info" title="补充说明">` | 证据边界、提醒、结论 |
| Tabs | `<Tabs label="方案"><Tab label="A">…</Tab></Tabs>` | 同一问题的不同方案 |
| Accordion | `<Accordion title="展开说明" open>` | 非核心补充内容 |
| TableOfContents | 页面自动使用 `ArticleToc` | 从正文二、三级标题生成目录 |
| CodeBlock | Markdown 代码围栏 | 语法高亮、文件名、行号、重点行、复制 |
| CodeTabs | `<CodeTabs items={[…]} />` | 同一示例的多种代码写法 |
| FileTree | `<FileTree items={[…]} />` | 解释目录与文件职责 |
| Terminal | `<Terminal lines={[…]} />` | 区分命令和输出 |
| Mermaid | Mermaid 围栏或 `<Mermaid chart="…" />` | 流程、关系、时序 |
| ImageZoom | Markdown 本地图片自动使用 `ImageLightbox` | 放大原图，Escape 关闭 |
| SeriesNavigation | 页面自动使用 `SeriesNav` | frontmatter 的 `series`、`seriesOrder` |
| RelatedPosts | 页面自动按 tags 推荐 | 文章末尾的关联阅读 |

**自动能力不在正文重复插入。** `TableOfContents`、`CodeBlock`、`ImageZoom`、`SeriesNavigation` 不是可直接书写的 MDX 标签。

## 最小示例

```mdx
<Callout type="tip" title="先确认来源">

关键结论应能追溯到用户素材或已核验资料。

</Callout>

<Accordion title="补充说明">

Markdown 内容前后留空行。核心结论不要放在折叠区里。

</Accordion>

<Tabs label="两种视角">
  <Tab label="业务">

业务目标与验收标准。

  </Tab>
  <Tab label="实施">

输入字段与审核过程。

  </Tab>
</Tabs>
```

Callout 的 `type` 可选 `info / warning / danger / tip / success`。Accordion 默认折叠，`open` 为可选布尔值。Tabs 在浏览器中支持左右方向键、Home、End 和唯一的无障碍标识；未启用 JavaScript 时展开全部内容。旧版 `tabs={[{label, children}]}` API 仍供已有文章兼容，新稿统一使用子组件形式。

````mdx
```typescript title="workflow.ts" showLineNumbers {2}
const draft = {
  status: "draft",
};
```

```mermaid
flowchart LR
    A[业务大纲] --> B[确认方向]
    B --> C[编写草稿]
    C --> D[人工审核]
```
````

文件名、行号和重点行均为可选。Mermaid 无 JavaScript 或渲染失败时显示源码；**源码回退不等于图表验收通过**。写作时须检查实际 SVG 和错误状态。

```mdx
<CodeTabs label="配置格式" items={[
  { label: "JSON", language: "json", filename: "config.json", code: '{\n  "status": "draft"\n}' },
  { label: "YAML", language: "yaml", filename: "config.yaml", code: 'status: draft' }
]} />

<FileTree title="内容目录" items={[
  { name: "content", children: [
    { name: "article.mdx", comment: "待审核的文章" }
  ] }
]} />

<Terminal title="类型检查 · 示例" lines={[
  { command: "npm run typecheck", output: "检查通过（示例输出）" }
]} />
```

CodeTabs 必填 `items[].label`、`items[].code`；`language`、`filename` 可选，不识别的语言回退纯文本。FileTree 的 `name` 必填，`comment` 可选，`children` 可递归嵌套。Terminal 必填 `lines[].command`，`output` 可选；复制时仅提取命令，组件不执行任何命令。以上数据只使用静态字符串、数组、对象。

图片使用 `![有意义的描述](/images/blog/<slug>/<filename>.webp)`。引用的文件必须实际存在于 `public/`，不要复制占位路径。导入图片请遵守 `content-style-guide.md`，更新 manifest 后运行图片检查。

原有 Timeline、图片组、Tweet、YouTube 等仍然保留。使用前读取对应组件源码确认属性，不猜测 API，不因组件存在而强行使用。当前写作检查器仅对 V1 数据组件进行完整的属性形状检查。

## 预览与验收

- `/labs/mdx`：两个样板入口；样板源在 `docs/examples/mdx/`，不进入博客列表，页面标记 noindex。
- `npm run dev` 后打开 `/labs/drafts/<文件名去掉扩展名>`：本地草稿预览。生产环境返回 404。
- `npm run mdx:check -- <文件路径>`：检查 Blog frontmatter、MDX 编译、组件白名单、V1 属性、静态表达式及本地图片存在性。**不会执行 MDX，也不是沙箱**。
- 渲染系统只接受经过审核的仓库文件；不要把外部用户上传或 Notion 原文直接交给 MDXRemote 执行。先提取资料，按本文 API 重写，再检查和人工审核。
- 编译检查不验证事实、文字质量或 Mermaid 语法。含交互组件时，实际打开草稿检查；含 Mermaid 时，另做语法与 SVG 双重检查。
- 发布前运行 `typecheck`、`lint`、`test`、`content:audit`、`build`；图片变化另跑 `images:manifest` 和 `images:check`。

## 选型原则

先写清楚内容，再决定组件。普通段落能讲清楚的内容不用卡片；需要逐项对照时使用表格；并行方案用 Tabs；操作示例用代码围栏；业务流转用 Mermaid。组件不预设文章结构，也不替代作者观点。
