import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { extractHeadings, type Heading } from "../../../../lib/content/headings.ts";

const projectMdx = readFileSync(
  join(process.cwd(), "content/projects/ark-seedream-car-preview.mdx"),
  "utf8"
);

test("extractHeadings on ark-seedream-car-preview.mdx returns h2 sections", () => {
  const headings: Heading[] = extractHeadings(projectMdx);
  const h2Texts = headings.filter((h) => h.level === 2).map((h) => h.text);

  assert.ok(
    h2Texts.includes("Background"),
    "should include the 'Background' h2 from the project MDX"
  );
  assert.ok(
    h2Texts.includes("Problem"),
    "should include the 'Problem' h2 from the project MDX"
  );
  assert.ok(
    h2Texts.includes("Approach"),
    "should include the 'Approach' h2 from the project MDX"
  );
});
