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

test("authoring checker rejects executable or unsupported MDX", async () => {
  for (const source of [
    'import x from "node:fs"\n\n## Text',
    "{process.env.SECRET}",
    '<Callout title={(() => "value")()} />',
    "<Callout {...props} />",
    '<Callout onClick="alert(1)" />',
    "<script>alert(1)</script>",
    "<Unknown />",
    '<CodeTabs items={[{ label: "JS" }]} />',
    "<Terminal lines={[]} />",
    '<FileTree items={[{ name: "folder", children: [{ invalid: true }] }]} />',
    "# Duplicate title",
  ])
    await assert.rejects(() => checkMdxAuthoring(source), source);
});

test("image sources and alt are checked without executing MDX", async () => {
  for (const source of [
    "![](/example.png)",
    "![Alt](https://example.com/a.png)",
    "![Alt](/../secret)",
    "![Alt](/%2e%2e/secret)",
    "[link](javascript:alert%281%29)",
  ]) {
    await assert.rejects(() => checkMdxAuthoring(source), source);
  }
  assert.deepEqual(
    (await checkMdxAuthoring("![Diagram](/images/example.webp)")).assets,
    ["/images/example.webp"],
  );
});
