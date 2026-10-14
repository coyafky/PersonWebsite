import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export const mdxSamples = [
  {
    slug: "reading",
    title: "阅读与业务表达",
    description: "说明框、内容标签页、折叠说明与 Mermaid 流程图。",
    number: "01",
  },
  {
    slug: "code",
    title: "代码与操作说明",
    description: "代码高亮、代码标签页、文件树、终端与图片放大。",
    number: "02",
  },
] as const;

export async function getMdxSample(slug: string) {
  if (!mdxSamples.some((sample) => sample.slug === slug)) return null;
  const raw = await fs.readFile(
    path.join(process.cwd(), "docs/examples/mdx", `${slug}.mdx`),
    "utf8",
  );
  const { data, content } = matter(raw);
  return {
    title: String(data.title),
    summary: String(data.summary),
    body: content,
  };
}
