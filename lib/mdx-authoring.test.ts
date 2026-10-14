import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import matter from "gray-matter";
import { checkMdxAuthoring } from "./mdx-authoring.ts";

test("both component samples compile and pass authoring checks", async () => {
  for (const name of ["reading", "code"]) {
    const { content } = matter(
      await fs.readFile(`docs/examples/mdx/${name}.mdx`, "utf8"),
    );
    const result = await checkMdxAuthoring(content);
    assert.ok(result.components.length >= 4);
  }
});

test("valid static component props are accepted", async () => {
  const source = `
<Callout type="tip" title="来源">

正文。

</Callout>

<Tabs label="方案">
  <Tab label="A">方案 A</Tab>
  <Tab label="B">方案 B</Tab>
</Tabs>

<CodeTabs items={[{ label: "TS", language: "typescript", filename: "index.ts", code: "const value = 1;" }]} />

<FileTree items={[{ name: "app", children: [{ name: "page.tsx", comment: "页面入口" }] }]} />

<Terminal lines={[{ command: "npm test", output: "通过" }]} />

<Mermaid chart="flowchart LR\\n  A[输入] --> B[输出]" />

<GitHubCard
  repository="coyafky/PersonWebsite"
  name="Personal Website"
  description="用于记录笔记、项目和工作流的个人网站。"
  url="https://github.com/coyafky/PersonWebsite"
  language="TypeScript"
  stars={12}
  forks={2}
  license="MIT"
/>

<LinkPreview
  url="https://nextjs.org/docs"
  title="Next.js Documentation"
  description="Next.js 官方文档入口。"
  image="/diagrams/knowledge-field-architecture.svg"
  siteName="Next.js"
/>
`;
  const result = await checkMdxAuthoring(source);
  assert.deepEqual(result.components, [
    "Callout",
    "Tabs",
    "Tab",
    "CodeTabs",
    "FileTree",
    "Terminal",
    "Mermaid",
    "GitHubCard",
    "LinkPreview",
  ]);
});

test("authoring checker rejects executable or unsupported MDX", async () => {
  for (const source of [
    'import x from "node:fs"\n\n## Text',
    'export const value = "text"',
    "{process.env.SECRET}",
    '<Callout title={(() => "value")()} />',
    "<Callout {...props} />",
    '<Callout onClick="alert(1)" />',
    '<Callout dangerouslySetInnerHTML={{__html: "unsafe"}} />',
    '<GitHubCard repository="coyafky/PersonWebsite" name="Site" description="描述" url="javascript:alert(1)" />',
    '<GitHubCard repository="coyafky/PersonWebsite" name="Site" description="描述" url="https://github.com/coyafky/PersonWebsite" html="<script>alert(1)</script>" />',
    '<GitHubCard repository="coyafky/PersonWebsite" name="Site" url="https://github.com/coyafky/PersonWebsite" />',
    '<LinkPreview url="https://example.com" title="资料" description="说明" image="https://example.com/image.png" />',
    '<LinkPreview url="https://example.com" title="资料" description="说明" image="/images/a.png?raw=1" />',
    '<LinkPreview url="https://example.com" title="资料" description="说明" image="/../secret.png" />',
    '<LinkPreview url="https://example.com" title="资料" description="说明" image="/images/\\\\secret.png" />',
    '<LinkPreview url={sourceUrl} title="资料" description="说明" />',
    "<script>alert(1)</script>",
    "<Unknown />",
    '<CodeTabs items={[{ label: "JS" }]} />',
    "<Terminal lines={[]} />",
    '<FileTree items={[{ name: "folder", children: [{ invalid: true }] }]} />',
    "# Duplicate title",
  ])
    await assert.rejects(() => checkMdxAuthoring(source), source);
});

test("image sources and links follow repository boundaries", async () => {
  for (const source of [
    "![](/example.png)",
    "![Alt](https://example.com/a.png)",
    "![Alt](//example.com/a.png)",
    "![Alt](/images/a.png?raw=1)",
    "![Alt](/images/a.png#preview)",
    "![Alt](/../secret)",
    "![Alt](/%2e%2e/secret)",
    "![Alt](/images\\\\secret.png)",
    "[link](javascript:alert%281%29)",
    "[link](relative/page)",
  ]) {
    await assert.rejects(() => checkMdxAuthoring(source), source);
  }

  const result = await checkMdxAuthoring(`
[站内](/blog/example) · [锚点](#details) · [资料](https://example.com/source)

![Diagram](/images/example.webp)
`);
  assert.deepEqual(result.assets, ["/images/example.webp"]);
});
