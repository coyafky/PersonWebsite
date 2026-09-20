import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeTag, normalizeTags } from "./tag-aliases.ts";

test("normalizeTag: 大小写变体收敛到规范名", () => {
  assert.equal(normalizeTag("hermes"), "Hermes");
  assert.equal(normalizeTag("Hermes"), "Hermes");
  assert.equal(normalizeTag("HERMES"), "Hermes");
  assert.equal(normalizeTag("profile"), "Profile");
  assert.equal(normalizeTag("props"), "Props");
  assert.equal(normalizeTag("geo"), "GEO");
});

test("normalizeTag: 空白/连字符变体收敛（多 Agent / AI Agent）", () => {
  assert.equal(normalizeTag("多Agent"), "多 Agent");
  assert.equal(normalizeTag("多 agent"), "多 Agent");
  assert.equal(normalizeTag("多  Agent"), "多 Agent");
  assert.equal(normalizeTag("AI-agent"), "AI Agent");
  assert.equal(normalizeTag("ai-agent"), "AI Agent");
});

test("normalizeTag: Prompt 家族 6 种写法合成一个", () => {
  for (const v of ["prompt", "Prompt", "提示词", "提示词工程", "提示工程", "Prompt Engineering"]) {
    assert.equal(normalizeTag(v), "Prompt 工程", v + " 应归一到 Prompt 工程");
  }
});

test("normalizeTag: 中英文之间有无空格视为同一个（AI 生图）", () => {
  assert.equal(normalizeTag("AI 生图"), "AI 生图");
  assert.equal(normalizeTag("AI生图"), "AI 生图");
});

test("normalizeTag: 未登记的标签原样保留（不猜测性改写）", () => {
  assert.equal(normalizeTag("剪纸"), "剪纸");
  assert.equal(normalizeTag("  车膜  "), "车膜");
  assert.equal(normalizeTag("zero-to-tech"), "zero-to-tech");
});

test("normalizeTag: 绝不把不同概念合在一起", () => {
  // React 是库，ReAct 是提示策略 —— 实测中存在这两个标签，必须保持独立
  assert.equal(normalizeTag("React"), "React");
  assert.equal(normalizeTag("ReAct"), "ReAct");
  assert.notEqual(normalizeTag("React"), normalizeTag("ReAct"));
  // Prompt Caching 是独立概念，不被 Prompt 家族吞掉
  assert.equal(normalizeTag("Prompt Caching"), "Prompt Caching");
});

test("normalizeTags: 合并后要去掉产生的重复", () => {
  assert.deepEqual(normalizeTags(["hermes", "Hermes", "GEO"]), ["Hermes", "GEO"]);
});

test("normalizeTags: 保持原顺序，丢掉空标签", () => {
  assert.deepEqual(normalizeTags(["剪纸", "  ", "Prompt", "提示词"]), ["剪纸", "Prompt 工程"]);
});
