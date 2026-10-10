import test from "node:test";
import assert from "node:assert/strict";

import { homePageModel } from "./home-page.ts";

test("homepage offers three focused ways to inspect evidence", () => {
  assert.deepEqual(
    homePageModel.entryPoints.map((entry) => entry.href),
    ["/notes", "/projects", "/gallery"],
  );
});

test("homepage explains the real notes-to-proof workflow in order", () => {
  assert.deepEqual(
    homePageModel.process.map((step) => step.key),
    ["capture", "transform", "proof"],
  );
});

test("homepage makes the proof card the signature element", () => {
  assert.equal(homePageModel.signature, "proof-card");
  assert.match(homePageModel.heroProof.href, /^\/projects\//);
  assert.ok(homePageModel.heroProof.title.length > 0);
  assert.deepEqual(
    homePageModel.heroProof.steps.map((step) => step.label),
    ["INPUT", "BUILD", "OUTPUT"],
  );
});
