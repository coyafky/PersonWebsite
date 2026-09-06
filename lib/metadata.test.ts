import { test } from "node:test";
import assert from "node:assert/strict";
import { buildUrl } from "./metadata.ts";

test("buildUrl uses the production domain when no app URL is configured", () => {
  assert.equal(
    buildUrl("/blog/example-post"),
    "https://person-website-ivory.vercel.app/blog/example-post",
  );
});
