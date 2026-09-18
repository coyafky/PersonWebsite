import { test } from "node:test";
import assert from "node:assert/strict";
import { formatClock, formatSecondsForSpeech, minutesToMs } from "./format.ts";

test("formatClock: 满 25 分钟显示 25:00（不是 24:59）", () => {
  assert.equal(formatClock(25 * 60 * 1000), "25:00");
});

test("formatClock: 用 ceil，最后不足一秒显示 00:01", () => {
  assert.equal(formatClock(1), "00:01");
  assert.equal(formatClock(999), "00:01");
  assert.equal(formatClock(1000), "00:01");
  assert.equal(formatClock(1001), "00:02");
});

test("formatClock: 正好归零显示 00:00", () => {
  assert.equal(formatClock(0), "00:00");
});

test("formatClock: 负数按 0 处理（后台节流/时钟回拨时不会出现 -1）", () => {
  assert.equal(formatClock(-1), "00:00");
  assert.equal(formatClock(-60000), "00:00");
});

test("formatClock: 满一小时切换成 H:MM:SS", () => {
  assert.equal(formatClock(59 * 60 * 1000 + 59 * 1000), "59:59");
  assert.equal(formatClock(60 * 60 * 1000), "1:00:00");
  assert.equal(formatClock(2 * 60 * 60 * 1000 + 3 * 60 * 1000 + 4000), "2:03:04");
});

test("formatClock: 分钟与秒不足两位要补零", () => {
  assert.equal(formatClock(5 * 60 * 1000), "05:00");
  assert.equal(formatClock(9 * 1000), "00:09");
  assert.equal(formatClock(60 * 60 * 1000 + 9 * 1000), "1:00:09");
});

test("formatSecondsForSpeech: 返回不补零的秒数字符串", () => {
  assert.equal(formatSecondsForSpeech(0), "0");
  assert.equal(formatSecondsForSpeech(999), "1");
  assert.equal(formatSecondsForSpeech(60000), "60");
});

test("minutesToMs: 下限 1 分钟，避免时长为 0", () => {
  assert.equal(minutesToMs(25), 1500000);
  assert.equal(minutesToMs(0), 60000);
  assert.equal(minutesToMs(-5), 60000);
  assert.equal(minutesToMs(2.4), 120000);
});
