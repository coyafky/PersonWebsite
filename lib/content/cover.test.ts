import { test } from "node:test";
import assert from "node:assert/strict";
import { blogSchema } from "./schemas.ts";
import { validateCoverReference } from "../../scripts/content-images.mjs";

// ── Schema：cover / coverAlt 是可选的 ────────────────────────────────

const BASE_BLOG = {
  kind: "blog",
  slug: "2026-08-23-example",
  filePath: "content/blog/2026-08-23-example.md",
  extension: ".md",
  body: "正文",
  title: "示例文章",
  date: "2026-08-23",
  summary: "用于校验封面字段的示例摘要。",
  status: "published",
  tags: ["AI"],
  lang: "zh",
} as const;

function parseBlog(extra: Record<string, unknown> = {}) {
  return blogSchema.safeParse({ ...BASE_BLOG, ...extra });
}

test("blogSchema: cover + coverAlt 能通过校验并保留字段", () => {
  const result = parseBlog({
    cover: "/images/blog/2026-08-23-example/cover.webp",
    coverAlt: "示例封面",
  });
  assert.ok(result.success, "带 cover 的文章应通过 schema 校验");
  assert.equal(result.data.cover, "/images/blog/2026-08-23-example/cover.webp");
  assert.equal(result.data.coverAlt, "示例封面");
});

test("blogSchema: 不带 cover 的文章仍能通过校验（向后兼容）", () => {
  const result = parseBlog();
  assert.ok(result.success, "无 cover 的存量文章应照旧通过校验");
  assert.equal(result.data.cover, undefined);
  assert.equal(result.data.coverAlt, undefined);
});

test("blogSchema: 只有 cover 没有 coverAlt 也能通过 schema（成对约束在检查器里）", () => {
  const result = parseBlog({ cover: "/images/blog/2026-08-23-example/cover.webp" });
  assert.ok(result.success);
  assert.equal(result.data.coverAlt, undefined);
});

// ── 检查器纯函数：validateCoverReference ────────────────────────────

const PREFIX = "/images/blog/2026-08-23-example/";
const LOC = "content/blog/2026-08-23-example.md (frontmatter cover)";

function checkCover(cover: unknown, coverAlt: unknown) {
  return validateCoverReference({
    cover,
    coverAlt,
    expectedPrefix: PREFIX,
    location: LOC,
  });
}

test("validateCoverReference: 合法路径不报错并返回 publicUrl", () => {
  const result = checkCover("/images/blog/2026-08-23-example/cover.webp", "封面");
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.publicUrl, "/images/blog/2026-08-23-example/cover.webp");
});

test("validateCoverReference: 有 cover 但缺 coverAlt → error", () => {
  const result = checkCover("/images/blog/2026-08-23-example/cover.webp", undefined);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /coverAlt/);
});

test("validateCoverReference: coverAlt 仅空白 → 仍算缺失，报 error", () => {
  const result = checkCover("/images/blog/2026-08-23-example/cover.webp", "   ");
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /coverAlt/);
});

test("validateCoverReference: 落在别的文章目录 → error", () => {
  const result = checkCover("/images/blog/2026-01-01-other/cover.webp", "封面");
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /must keep this post's image under/);
});

test("validateCoverReference: 远程 URL → error 且不返回 publicUrl", () => {
  const result = checkCover("https://example.com/cover.webp", "封面");
  assert.equal(result.publicUrl, null);
  assert.match(result.errors.join("\n"), /remote or embedded/);
});

test("validateCoverReference: 非根相对路径 → error 且不返回 publicUrl", () => {
  const result = checkCover("images/blog/2026-08-23-example/cover.webp", "封面");
  assert.equal(result.publicUrl, null);
  assert.match(result.errors.join("\n"), /root-relative/);
});

test("validateCoverReference: 扩展名不在白名单 → error（仍返回 publicUrl 供存在性检查）", () => {
  const result = checkCover("/images/blog/2026-08-23-example/cover.bmp", "封面");
  assert.match(result.errors.join("\n"), /unsupported image extension/);
  assert.equal(result.publicUrl, "/images/blog/2026-08-23-example/cover.bmp");
});

test("validateCoverReference: cover 不是字符串 → error", () => {
  const result = checkCover(123, "封面");
  assert.equal(result.publicUrl, null);
  assert.match(result.errors.join("\n"), /must be a string path/);
});

test("validateCoverReference: 只有 coverAlt 没有 cover → warning，无 error", () => {
  const result = checkCover(undefined, "只有替代文本");
  assert.deepEqual(result.errors, []);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /coverAlt without a cover/);
});

test("validateCoverReference: 两个字段都没有 → 静默通过", () => {
  const result = checkCover(undefined, undefined);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.publicUrl, null);
});
