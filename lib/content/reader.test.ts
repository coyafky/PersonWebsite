import { test } from "node:test";
import assert from "node:assert/strict";
import { getContentByTag, getContentBySlug } from "./reader.ts";

test("getContentByTag: matches across all 8 collections (incl. book-list + course-list)", async () => {
  const result = await getContentByTag("hermes");
  const totalHits = Object.values(result.totalByKind).reduce(
    (sum, n) => sum + n,
    0,
  );
  assert.ok(totalHits > 0, "expected at least one match for tag 'hermes'");
  assert.ok(
    Object.values(result.items).some((arr) => arr.length > 0),
    "expected at least one kind to contain matches",
  );
});

test("getContentByTag: case-insensitive", async () => {
  const upper = await getContentByTag("hermes");
  const lower = await getContentByTag("HERMES");
  const mixed = await getContentByTag("HeRmEs");

  const upperTotal = Object.values(upper.totalByKind).reduce(
    (sum, n) => sum + n,
    0,
  );
  const lowerTotal = Object.values(lower.totalByKind).reduce(
    (sum, n) => sum + n,
    0,
  );
  const mixedTotal = Object.values(mixed.totalByKind).reduce(
    (sum, n) => sum + n,
    0,
  );

  assert.equal(upperTotal, lowerTotal);
  assert.equal(upperTotal, mixedTotal);
});

test("getContentByTag: nonexistent tag returns all empty", async () => {
  const result = await getContentByTag("__nonexistent_tag_zzz__");
  assert.ok(
    Object.values(result.items).every((arr) => arr.length === 0),
    "expected all items arrays to be empty",
  );
  assert.ok(
    Object.values(result.totalByKind).every((n) => n === 0),
    "expected all totals to be zero",
  );
});

test("getContentByTag: result always exposes bookIndex + bookNote fields", async () => {
  const result = await getContentByTag("hermes");
  assert.ok(
    Array.isArray(result.items.bookIndex),
    "expected result.items.bookIndex to be an array",
  );
  assert.equal(
    typeof result.totalByKind.bookIndex,
    "number",
    "expected result.totalByKind.bookIndex to be a number",
  );
  assert.ok(
    Array.isArray(result.items.bookNote),
    "expected result.items.bookNote to be an array",
  );
  assert.equal(
    typeof result.totalByKind.bookNote,
    "number",
    "expected result.totalByKind.bookNote to be a number",
  );
});

test("getContentByTag: result always exposes courseIndex + courseNote fields", async () => {
  const result = await getContentByTag("hermes");
  assert.ok(
    Array.isArray(result.items.courseIndex),
    "expected result.items.courseIndex to be an array",
  );
  assert.equal(
    typeof result.totalByKind.courseIndex,
    "number",
    "expected result.totalByKind.courseIndex to be a number",
  );
  assert.ok(
    Array.isArray(result.items.courseNote),
    "expected result.items.courseNote to be an array",
  );
  assert.equal(
    typeof result.totalByKind.courseNote,
    "number",
    "expected result.totalByKind.courseNote to be a number",
  );
});

test("getContentBySlug: matches ASCII slug verbatim", async () => {
  // getContentBySlug only returns published posts, so the test fixture must
  // also be a published post (drafts are excluded from the lookup). Use
  // includeDrafts=true to scan a wider pool, but still filter to published.
  const blog = await import("./reader.ts").then((m) => m.getBlogPosts(true));
  const asciiPost = blog.find(
    (p) => /^[\x20-\x7e]+$/.test(p.slug) && p.status === "published",
  );
  assert.ok(asciiPost, "expected at least one published ASCII blog slug in fixtures");
  const looked = await getContentBySlug("blog", asciiPost!.slug);
  assert.ok(looked, "expected to find the post via ASCII slug");
  assert.equal(looked?.slug, asciiPost!.slug);
});

test("getContentBySlug: percent-encoded CJK slug is decoded before lookup", async () => {
  // The reader must decode percent-encoded URL slugs before comparing against
  // file-derived slugs (Next.js passes the URL-encoded literal into the route
  // param). Filenames are now English-only, so we verify the decode path with a
  // synthetic CJK slug: the round-trip must succeed, and a no-match lookup must
  // resolve cleanly to null (not throw).
  const synthetic = "2026-01-01-中文测试-fixture";
  const encoded = encodeURIComponent(synthetic);
  assert.notEqual(encoded, synthetic, "sanity check: encoding actually changed the string");
  assert.equal(decodeURIComponent(encoded), synthetic, "decode round-trip preserves CJK chars");

  const looked = await getContentBySlug("blog", encoded);
  assert.equal(looked, null, "no CJK fixture exists; lookup should decode and miss cleanly");
});

test("getContentBySlug: already-decoded CJK slug misses cleanly when no fixture", async () => {
  // Companion to the percent-encoded test: a raw (already-decoded) CJK slug
  // also goes through decodeSlug, which is a no-op for raw input. Verify the
  // reader returns null instead of throwing for an unmatched raw CJK slug.
  const looked = await getContentBySlug("blog", "2026-01-01-中文测试-fixture");
  assert.equal(looked, null);
});

test("getContentBySlug: malformed percent-encoding falls back gracefully", async () => {
  // decodeURIComponent throws on %E4%B8% — reader must not propagate the throw.
  const result = await getContentBySlug("blog", "%E4%B8%");
  assert.equal(result, null, "expected null for unmatchable malformed slug");
});

// ── 回归：含空格/中文的标签，URL 编码形态也必须命中 ──────────────────
// 症状：点 /tags/AI%20Skill 得到 404，而 /tags/Hermes 正常。
// 根因：动态段传来的 tag 是未解码的 "AI%20Skill"，而正文写的是 "AI Skill"。
test("getContentByTag: 未解码的编码形态也要命中（AI%20Skill → AI Skill）", async () => {
  const decoded = await getContentByTag("AI Skill");
  const encoded = await getContentByTag("AI%20Skill");
  const sum = (r: { totalByKind: Record<string, number> }) =>
    Object.values(r.totalByKind).reduce((a, b) => a + b, 0);
  assert.ok(sum(decoded) > 0, "解码形态应命中");
  assert.equal(sum(encoded), sum(decoded), "编码形态应命中同样数量");
});

test("getContentByTag: 中文标签的编码形态也要命中", async () => {
  const decoded = await getContentByTag("AI 生图");
  const encoded = await getContentByTag("AI%20%E7%94%9F%E5%9B%BE");
  const sum = (r: { totalByKind: Record<string, number> }) =>
    Object.values(r.totalByKind).reduce((a, b) => a + b, 0);
  assert.equal(sum(encoded), sum(decoded));
  assert.equal(sum(encoded) > 0, true, "「AI 生图」应有内容");
});

test("getContentByTag: 大小写仍然不敏感（归一化之前的行为不能丢）", async () => {
  const sum = (r: { totalByKind: Record<string, number> }) =>
    Object.values(r.totalByKind).reduce((a, b) => a + b, 0);
  assert.equal(sum(await getContentByTag("hermes")), sum(await getContentByTag("Hermes")));
});

test("getContentByTag: 非法转义的 % 不应抛错（原样返回不命中即可）", async () => {
  const r = await getContentByTag("100%");
  const sum = Object.values(r.totalByKind).reduce((a, b) => a + b, 0);
  assert.equal(sum, 0, "不存在的标签命中 0，而不是抛异常");
});
