// Pure helpers for detecting mermaid fenced code blocks inside MDX-rendered
// <pre> elements. Extracted from MdxContent so the rules can be unit-tested
// without spinning up the full MDX pipeline.

type CodeLikeChild = { props: { className: string; children: unknown } };

export function extractText(node: unknown): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const children = (node as { props: { children?: unknown } }).props.children;
    return extractText(children);
  }
  return "";
}

export function isMermaidCodeChild(node: unknown): node is CodeLikeChild {
  if (!node || typeof node !== "object" || !("props" in node)) return false;
  const props = (node as { props: { className?: unknown } }).props;
  if (typeof props.className !== "string") return false;
  return props.className.split(/\s+/).includes("language-mermaid");
}
