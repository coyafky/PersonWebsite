import { test } from "node:test";
import assert from "node:assert/strict";
import { extractHeadings, type Heading } from "./headings.ts";

test("extractHeadings: empty string returns empty array", () => {
  assert.deepEqual(extractHeadings(""), []);
});

test("extractHeadings: single h2", () => {
  const result = extractHeadings("## Hello World");
  assert.deepEqual(result, [{ id: "hello-world", text: "Hello World", level: 2 }]);
});

test("extractHeadings: single h3", () => {
  const result = extractHeadings("### Section Three");
  assert.deepEqual(result, [
    { id: "section-three", text: "Section Three", level: 3 },
  ]);
});

test("extractHeadings: nested h2 and h3 in order", () => {
  const md = [
    "Some intro.",
    "",
    "## First Heading",
    "",
    "Body text.",
    "",
    "### Sub Heading",
    "",
    "## Second Heading",
    "",
  ].join("\n");
  const result = extractHeadings(md);
  assert.deepEqual(result, [
    { id: "first-heading", text: "First Heading", level: 2 },
    { id: "sub-heading", text: "Sub Heading", level: 3 },
    { id: "second-heading", text: "Second Heading", level: 2 },
  ]);
});

test("extractHeadings: code fences do not count as headings", () => {
  const md = [
    "## Real Heading",
    "",
    "```",
    "## Not a heading",
    "# Also not a heading",
    "```",
    "",
    "### Another Real",
    "",
  ].join("\n");
  const result = extractHeadings(md);
  assert.deepEqual(result, [
    { id: "real-heading", text: "Real Heading", level: 2 },
    { id: "another-real", text: "Another Real", level: 3 },
  ]);
});

test("extractHeadings: tilde code fences are also skipped", () => {
  const md = ["~~~", "## Skipped", "~~~", "## Kept"].join("\n");
  const result = extractHeadings(md);
  assert.deepEqual(result, [{ id: "kept", text: "Kept", level: 2 }]);
});

test("extractHeadings: h1 and h4+ are ignored", () => {
  const md = ["# H1 ignored", "## H2 kept", "#### H4 ignored", "### H3 kept"].join(
    "\n",
  );
  const result = extractHeadings(md);
  assert.deepEqual(result, [
    { id: "h2-kept", text: "H2 kept", level: 2 },
    { id: "h3-kept", text: "H3 kept", level: 3 },
  ]);
});

test("extractHeadings: CJK characters are preserved in slug (matches github-slugger)", () => {
  // github-slugger keeps CJK characters in the slug
  const result = extractHeadings("## 你好，世界");
  assert.equal(result.length, 1);
  assert.equal(result[0]?.level, 2);
  assert.equal(result[0]?.id, "你好世界");
  assert.equal(result[0]?.text, "你好，世界");
});

test("extractHeadings: duplicate ids get suffixed", () => {
  const md = ["## Same Title", "## Same Title", "## Same Title"].join("\n\n");
  const result = extractHeadings(md);
  assert.equal(result.length, 3);
  assert.equal(result[0]?.id, "same-title");
  assert.equal(result[1]?.id, "same-title-1");
  assert.equal(result[2]?.id, "same-title-2");
});

test("extractHeadings: trailing hashes are stripped", () => {
  const result = extractHeadings("## Title ##");
  assert.deepEqual(result, [{ id: "title", text: "Title", level: 2 }]);
});

test("extractHeadings: returns Heading type array", () => {
  const result: Heading[] = extractHeadings("## Typed");
  assert.equal(result.length, 1);
  const h: Heading = result[0]!;
  assert.equal(typeof h.id, "string");
  assert.equal(typeof h.text, "string");
  assert.ok(h.level === 2 || h.level === 3);
});

test("extractHeadings: slug matches what rehype-slug/github-slugger produces", () => {
  // These are real titles from the corpus; the slug must match
  // what rehype-slug generates in the rendered HTML.
  // github-slugger strips punctuation (e.g. 、, ：, ？, 「」) and
  // spaces become hyphens; CJK characters are preserved.
  const cases: Array<[string, string]> = [
    ["## 一、整体架构", "一整体架构"],
    ["### 2.1 为什么需要资产库？", "21-为什么需要资产库"],
  ];
  for (const [src, expected] of cases) {
    const result = extractHeadings(src);
    assert.equal(result[0]?.id, expected, `slug for "${src}"`);
  }
});
