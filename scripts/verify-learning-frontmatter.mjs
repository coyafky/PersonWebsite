import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { learningSchema } from "../lib/content/schemas.ts";

const target = process.argv[2] ?? "content/learning/nextjs";
const abs = path.resolve(target);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(p)));
    } else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
      files.push(p);
    }
  }
  return files;
}

const files = await walk(abs);
let ok = 0;
let bad = 0;
for (const file of files) {
  const raw = await fs.readFile(file, "utf8");
  const parsed = matter(raw);
  const slug = path.basename(file).replace(/\.mdx?$/, "");
  const ext = path.extname(file);
  const result = learningSchema.safeParse({
    ...parsed.data,
    kind: "learning",
    slug,
    filePath: file,
    extension: ext,
    body: parsed.content.trim(),
  });
  if (!result.success) {
    console.error(`FAIL  ${file}`);
    for (const issue of result.error.issues) {
      console.error(`        - ${issue.path.join(".") || "root"}: ${issue.message}`);
    }
    bad++;
    continue;
  }
  console.log(
    `OK    ${file}\n      topic=${result.data.topic} status=${result.data.status} tags=${JSON.stringify(result.data.tags)}`,
  );
  ok++;
}

console.log(`\n${ok} passed, ${bad} failed`);
process.exit(bad === 0 ? 0 : 1);