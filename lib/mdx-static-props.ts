type Node = { type: string; [key: string]: unknown };

export function node(value: unknown): Node {
  if (!value || typeof value !== "object" || !("type" in value))
    throw new Error("需要静态字面量，不能使用动态表达式。");
  return value as Node;
}
function literal(value: unknown): unknown {
  const item = node(value);
  if (item.type === "Literal" && !item.regex) return item.value;
  if (item.type === "ArrayExpression")
    return (item.elements as unknown[]).map(literal);
  if (
    item.type === "TemplateLiteral" &&
    (item.expressions as unknown[]).length === 0
  ) {
    return (item.quasis as { value: { cooked: string } }[])[0].value.cooked;
  }
  if (
    item.type === "UnaryExpression" &&
    item.operator === "-" &&
    typeof literal(item.argument) === "number"
  )
    return -Number(literal(item.argument));
  if (item.type === "ObjectExpression") {
    return Object.fromEntries(
      (item.properties as unknown[]).map((value) => {
        const property = node(value);
        if (
          property.type !== "Property" ||
          property.computed ||
          property.method ||
          property.shorthand ||
          property.kind !== "init"
        )
          throw new Error("属性必须是静态键值，不支持展开、函数或 getter。");
        const keyNode = node(property.key);
        const key =
          keyNode.type === "Identifier" ? keyNode.name : literal(keyNode);
        if (
          typeof key !== "string" ||
          ["__proto__", "prototype", "constructor"].includes(key)
        )
          throw new Error("不支持此属性名称。");
        return [key, literal(property.value)];
      }),
    );
  }
  throw new Error(`不支持动态表达式 ${item.type}，请把逻辑放入项目组件。`);
}
export function expression(value: unknown) {
  const estree = (
    value as { data?: { estree?: { body: { expression?: unknown }[] } } }
  ).data?.estree;
  if (!estree || estree.body.length !== 1)
    throw new Error("属性需要一个静态值。");
  return literal(estree.body[0].expression);
}

// Preserve literal component data while next-mdx-remote v6 keeps blockJS enabled.
const dataComponents = new Set([
  "CodeTabs",
  "FileTree",
  "Terminal",
  "Tabs",
  "Tab",
  "Accordion",
  "Callout",
  "Timeline",
  "Mermaid",
  "GitHubCard",
  "LinkPreview",
]);
const prefix = "__MDX_STATIC_JSON__:";

export function decodeStaticProps<P extends object>(props: P): P {
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [
      key,
      typeof value === "string" && value.startsWith(prefix)
        ? JSON.parse(value.slice(prefix.length))
        : value,
    ]),
  ) as P;
}

export function remarkStaticProps() {
  return (tree: unknown) => {
    function walk(value: unknown) {
      const item = node(value);
      if (
        (item.type === "mdxJsxFlowElement" ||
          item.type === "mdxJsxTextElement") &&
        dataComponents.has(String(item.name))
      ) {
        for (const raw of item.attributes as unknown[]) {
          const attr = node(raw);
          if (
            attr.type === "mdxJsxAttribute" &&
            attr.value &&
            typeof attr.value === "object"
          ) {
            const parsed = expression(attr.value);
            attr.value =
              typeof parsed === "string"
                ? parsed
                : prefix + JSON.stringify(parsed);
          }
        }
      }
      if (Array.isArray(item.children)) item.children.forEach(walk);
    }
    walk(tree);
  };
}
