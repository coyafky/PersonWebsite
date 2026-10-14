import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { blogSchema } from "../lib/content/schemas.ts";
import { checkMdxAuthoring } from "../lib/mdx-authoring.ts";

const files = process.argv.slice(2);
if (!files.length) {
  console.error("用法：npm run mdx:check -- content/blog/YYYY-MM-DD-slug.mdx");
  process.exitCode = 1;
}
for (const file of files) {
  try {
    const { data, content } = matter(await fs.readFile(file, "utf8"));
    const post = blogSchema.parse({
      ...data,
      kind: "blog",
      slug: path.basename(file, path.extname(file)),
      filePath: file,
      extension: path.extname(file),
      body: content,
    });
    const { assets, components } = await checkMdxAuthoring(content);
    if (post.cover) {
      if (!post.coverAlt?.trim()) throw new Error("封面缺少 coverAlt。");
      if (
        !post.cover.startsWith("/") ||
        post.cover.startsWith("//") ||
        /[\\%?#]|(?:^|\/)\.\.(?:\/|$)/.test(post.cover)
      )
        throw new Error("封面必须使用 public 内的根相对路径。");
      assets.push(post.cover);
    }
    for (const asset of assets) {
      const root = await fs.realpath(path.resolve("public"));
      const resolved = await fs.realpath(path.join(root, asset));
      if (!resolved.startsWith(`${root}${path.sep}`))
        throw new Error(`资源超出 public：${asset}`);
      await fs.access(resolved);
    }
    console.log(
      `通过 ${file} · ${post.status} · ${components.length} 种组件 · ${assets.length} 张图片`,
    );
  } catch (error) {
    console.error(
      `失败 ${file}\n${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 1;
  }
}
