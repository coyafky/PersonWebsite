import test from "node:test";
import assert from "node:assert/strict";
import { serialize } from "next-mdx-remote/serialize";
import * as runtime from "react/jsx-runtime";
import * as devRuntime from "react/jsx-dev-runtime";
import { decodeStaticProps, remarkStaticProps } from "./mdx-static-props.ts";

test("literal component data survives next-mdx-remote v6 with JS blocking enabled", async () => {
  const { compiledSource } = await serialize(
    '<CodeTabs items={[{label: "JSON", code: "a\\nb"}]} />',
    { mdxOptions: { remarkPlugins: [remarkStaticProps] } },
    true,
  );
  // Execute only this fixed test fixture, using the same runtime as the renderer.
  const Content = new Function(compiledSource)({
    ...runtime,
    ...devRuntime,
  }).default;
  const element = Content({ components: { CodeTabs: () => null } });
  assert.deepEqual(decodeStaticProps(element.props), {
    items: [{ label: "JSON", code: "a\nb" }],
  });
});

test("static props reject code, lookups, interpolation and getters", async () => {
  for (const expression of [
    "process.env",
    "(() => 42)()",
    "`value ${globalThis}`",
    "{get value() { return 1 }}",
    "[...values]",
  ]) {
    await assert.rejects(() =>
      serialize(
        `<CodeTabs items={${expression}} />`,
        { mdxOptions: { remarkPlugins: [remarkStaticProps] } },
        true,
      ),
    );
  }
});

test("other MDX expressions remain blocked by the renderer", async () => {
  const { compiledSource } = await serialize(
    "<Other value={globalThis.__test} />\n\n{globalThis.__test}",
    { mdxOptions: { remarkPlugins: [remarkStaticProps] } },
    true,
  );
  assert.ok(!compiledSource.includes("globalThis.__test"));
});
