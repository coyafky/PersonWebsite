import test from "node:test";
import assert from "node:assert/strict";
import { extractText, isMermaidCodeChild } from "./mdx-fence.ts";

test("isMermaidCodeChild returns true for language-mermaid className", () => {
  const node = { props: { className: "language-mermaid", children: "graph LR\nA-->B" } };
  assert.equal(isMermaidCodeChild(node), true);
});

test("isMermaidCodeChild returns true when mermaid is one of multiple classes", () => {
  const node = { props: { className: "hljs language-mermaid some-other", children: "x" } };
  assert.equal(isMermaidCodeChild(node), true);
});

test("isMermaidCodeChild returns false for non-mermaid className", () => {
  const node = { props: { className: "language-typescript", children: "x" } };
  assert.equal(isMermaidCodeChild(node), false);
});

test("isMermaidCodeChild returns false when className is missing or non-string", () => {
  assert.equal(isMermaidCodeChild({ props: { children: "x" } }), false);
  assert.equal(isMermaidCodeChild({ props: { className: 42, children: "x" } }), false);
});

test("isMermaidCodeChild returns false for null / primitives", () => {
  assert.equal(isMermaidCodeChild(null), false);
  assert.equal(isMermaidCodeChild(undefined), false);
  assert.equal(isMermaidCodeChild("language-mermaid"), false);
  assert.equal(isMermaidCodeChild(42), false);
});

test("extractText returns string as-is", () => {
  assert.equal(extractText("hello"), "hello");
});

test("extractText joins array of strings", () => {
  assert.equal(extractText(["a", "b", "c"]), "abc");
});

test("extractText recurses into element children", () => {
  const node = { props: { children: ["line1\n", { props: { children: "line2" } }] } };
  assert.equal(extractText(node), "line1\nline2");
});

test("extractText returns empty string for null / undefined; coerces numbers", () => {
  assert.equal(extractText(null), "");
  assert.equal(extractText(undefined), "");
  assert.equal(extractText(42), "42");
});

test("integration: MdxPre contract — mermaid fenced block yields the chart text", () => {
  const codeChild = {
    props: {
      className: "language-mermaid",
      children: "graph TD\nA-->B",
    },
  };
  assert.equal(isMermaidCodeChild(codeChild), true);
  assert.equal(extractText(codeChild.props.children), "graph TD\nA-->B");
});
