import { test } from "node:test";
import assert from "node:assert/strict";
import { getContentByTag } from "./reader.ts";

test("getContentByTag: matches across all 7 collections (incl. book-list)", async () => {
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

test("getContentByTag: result always exposes bookList field (array)", async () => {
  const result = await getContentByTag("hermes");
  assert.ok(
    Array.isArray(result.items.bookList),
    "expected result.items.bookList to be an array",
  );
  assert.equal(
    typeof result.totalByKind.bookList,
    "number",
    "expected result.totalByKind.bookList to be a number",
  );
});
