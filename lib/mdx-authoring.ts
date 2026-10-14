import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { z } from "zod";

// Authoring checks for repository-owned MDX. This is not an execution sandbox.
import { node, expression } from "./mdx-static-props.ts";
const text = z.string().min(1);
type TreeItem = { name: string; comment?: string; children?: TreeItem[] };
const treeItem: z.ZodType<TreeItem> = z.lazy(() =>
  z
    .object({
      name: text,
      comment: z.string().optional(),
      children: z.array(treeItem).optional(),
    })
    .strict(),
);
const propSchemas: Record<string, z.ZodType> = {
  Callout: z
    .object({
      type: z.enum(["info", "warning", "danger", "tip", "success"]).optional(),
      title: text.optional(),
    })
    .strict(),
  Accordion: z.object({ title: text, open: z.boolean().optional() }).strict(),
  Tabs: z.object({ label: text.optional() }).strict(),
  Tab: z.object({ label: text }).strict(),
  CodeTabs: z
    .object({
      label: text.optional(),
      items: z
        .array(
          z
            .object({
              label: text,
              code: z.string(),
              language: text.optional(),
              filename: text.optional(),
            })
            .strict(),
        )
        .min(1),
    })
    .strict(),
  FileTree: z
    .object({ title: text.optional(), items: z.array(treeItem).min(1) })
    .strict(),
  Terminal: z
    .object({
      title: text.optional(),
      lines: z
        .array(
          z.object({ command: text, output: z.string().optional() }).strict(),
        )
        .min(1),
    })
    .strict(),
  Mermaid: z.object({ chart: text }).strict(),
};
const allowed = new Set([
  ...Object.keys(propSchemas),
  "Timeline",
  "ImageCaptionGrid",
  "ImageCaptionItem",
  "ImageTextList",
  "ImageTextItem",
  "Tweet",
  "YouTube",
  "VisualDnaBuilder",
  "VisualStorytellingFramework",
  "LightingDirectionCarousel",
  "br",
  "kbd",
  "sup",
  "sub",
  "mark",
]);

export async function checkMdxAuthoring(source: string) {
  const assets: string[] = [];
  const components = new Set<string>();
  await compile(source, {
    remarkPlugins: [
      remarkGfm,
      () => (tree: unknown) => {
        function walk(value: unknown) {
          const item = node(value);
          if (item.type === "mdxjsEsm")
            throw new Error("文章无需 import/export，请使用已注册组件。");
          if (
            item.type === "mdxFlowExpression" ||
            item.type === "mdxTextExpression"
          )
            expression(item);
          if (item.type === "heading" && item.depth === 1)
            throw new Error(
              "正文从二级标题开始，一级标题由 frontmatter 提供。",
            );
          if (item.type === "image") {
            if (!String(item.alt ?? "").trim())
              throw new Error("图片需要有意义的 alt。");
            assets.push(String(item.url));
          }
          if (
            item.type === "link" &&
            !/^(https?:|mailto:|tel:|\/|#)/i.test(String(item.url))
          )
            throw new Error("链接请使用 https、站内绝对路径或锚点。");
          if (
            item.type === "mdxJsxFlowElement" ||
            item.type === "mdxJsxTextElement"
          ) {
            const name = String(item.name);
            if (!allowed.has(name))
              throw new Error(
                `未支持的组件：${name}。请查阅 docs/agent/mdx-components.md。`,
              );
            components.add(name);
            const props: Record<string, unknown> = {};
            for (const raw of item.attributes as unknown[]) {
              const attr = node(raw);
              if (
                attr.type !== "mdxJsxAttribute" ||
                typeof attr.name !== "string" ||
                /^(on[A-Z]|dangerouslySetInnerHTML)/i.test(attr.name)
              )
                throw new Error("不支持属性展开、事件处理器或 HTML 注入。");
              props[attr.name] =
                attr.value === null
                  ? true
                  : typeof attr.value === "string"
                    ? attr.value
                    : expression(attr.value);
            }
            propSchemas[name]?.parse(props);
            if (typeof props.src === "string") {
              if (!String(props.alt ?? "").trim())
                throw new Error(`${name} 需要 alt。`);
              assets.push(props.src);
            }
          }
          if (Array.isArray(item.children)) item.children.forEach(walk);
        }
        walk(tree);
      },
    ],
  });
  for (const asset of assets) {
    if (
      !asset.startsWith("/") ||
      asset.startsWith("//") ||
      /(?:^|\/)\.\.(?:\/|$)|[\\%?#]/.test(asset)
    )
      throw new Error(`图片须为 public 内的根相对路径：${asset}`);
  }
  return { assets, components: [...components] };
}
