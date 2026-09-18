import { test } from "node:test";
import assert from "node:assert/strict";
import { TOOLS, getTool, getAllToolIds } from "./registry.ts";

test("TOOLS: id 全部唯一", () => {
  const ids = TOOLS.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length, "存在重复的 tool id");
});

test("TOOLS: 每个工具的字段齐全且非空", () => {
  for (const tool of TOOLS) {
    assert.ok(tool.id.length > 0, "id 不能为空");
    assert.ok(tool.title.length > 0, `${tool.id}: title 不能为空`);
    assert.ok(tool.summary.length > 0, `${tool.id}: summary 不能为空`);
    assert.ok(Array.isArray(tool.keywords), `${tool.id}: keywords 必须是数组`);
  }
});

test("TOOLS: id 必须能安全放进 URL（小写字母/数字/连字符）", () => {
  for (const tool of TOOLS) {
    assert.match(tool.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${tool.id} 不是合法的 URL 段`);
  }
});

test("getTool: 命中已注册的 id", () => {
  for (const tool of TOOLS) {
    assert.equal(getTool(tool.id)?.title, tool.title);
  }
});

test("getTool: 未注册的 id 返回 undefined", () => {
  assert.equal(getTool("no-such-tool"), undefined);
  assert.equal(getTool(""), undefined);
});

test("getAllToolIds: 与 TOOLS 顺序一致", () => {
  assert.deepEqual(
    getAllToolIds(),
    TOOLS.map((t) => t.id),
  );
});
