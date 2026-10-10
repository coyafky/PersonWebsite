import test from "node:test";
import assert from "node:assert/strict";

import { getWorkflowMotionSequence } from "./home-motion.ts";

test("workflow motion reveals input, build, and output in order", () => {
  const sequence = getWorkflowMotionSequence();

  assert.deepEqual(
    sequence.map((step) => step.key),
    ["input", "build", "output"],
  );
  assert.ok(sequence.every((step) => step.delayMs >= 0));
  assert.ok(sequence.at(-1)!.delayMs + sequence.at(-1)!.durationMs <= 400);
});
