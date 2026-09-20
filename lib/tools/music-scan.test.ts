import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AUDIO_EXTENSIONS,
  compareTracks,
  formatDuration,
  formatSize,
  isAudioFileName,
  matchesQuery,
  parseTrackPath,
  shouldSkipDirectory,
} from "./music-scan.ts";

// ── parseTrackPath：本机实测的两种选取层级都要正确 ────────────────────

test("parseTrackPath: 选 Media.localized 时（多一层 Music/）", () => {
  assert.deepEqual(parseTrackPath("./Music/Harry Styles/Fine Line/Watermelon Sugar.mp3"), {
    artist: "Harry Styles",
    album: "Fine Line",
    title: "Watermelon Sugar",
  });
});

test("parseTrackPath: 直接选 Music 目录时，元数据完全一致", () => {
  assert.deepEqual(parseTrackPath("Harry Styles/Fine Line/Watermelon Sugar.mp3"), {
    artist: "Harry Styles",
    album: "Fine Line",
    title: "Watermelon Sugar",
  });
});

test("parseTrackPath: 中文歌手与专辑名不乱码", () => {
  assert.deepEqual(parseTrackPath("./Music/Chih Siou/房間裡的大象/正想著你呢.mp3"), {
    artist: "Chih Siou",
    album: "房間裡的大象",
    title: "正想著你呢",
  });
});

test("parseTrackPath: 曲目名里的点只削掉最后一段扩展名", () => {
  assert.equal(parseTrackPath("A/B/Song.Name.v2.mp3").title, "Song.Name.v2");
});

test("parseTrackPath: 只有文件名时不猜歌手", () => {
  assert.deepEqual(parseTrackPath("loose.mp3"), { artist: "", album: "", title: "loose" });
});

test("parseTrackPath: 两层时歌手有、专辑留空", () => {
  assert.deepEqual(parseTrackPath("Artist/track.mp3"), {
    artist: "Artist",
    album: "",
    title: "track",
  });
});

test("parseTrackPath: 空路径不炸", () => {
  assert.deepEqual(parseTrackPath(""), { artist: "", album: "", title: "" });
  assert.deepEqual(parseTrackPath("/"), { artist: "", album: "", title: "" });
});

// ── 目录 / 文件筛选 ──────────────────────────────────────────────────

test("shouldSkipDirectory: 必须跳过 Music_副本（256 首重复的根源）", () => {
  assert.equal(shouldSkipDirectory("Music_副本"), true);
});

test("shouldSkipDirectory: 跳过系统目录与 .musiclibrary 包", () => {
  assert.equal(shouldSkipDirectory(".Trash"), true);
  assert.equal(shouldSkipDirectory("Music Library.musiclibrary"), true);
});

test("shouldSkipDirectory: 正常歌手目录不能误跳", () => {
  assert.equal(shouldSkipDirectory("Harry Styles"), false);
  assert.equal(shouldSkipDirectory("Chih Siou"), false);
  assert.equal(shouldSkipDirectory("Music"), false);
});

test("isAudioFileName: 认扩展名且大小写不敏感", () => {
  assert.equal(isAudioFileName("a.mp3"), true);
  assert.equal(isAudioFileName("a.MP3"), true);
  assert.equal(isAudioFileName("a.m4a"), true);
  assert.equal(isAudioFileName("a.flac"), true);
  assert.equal(isAudioFileName("cover.jpg"), false);
  assert.equal(isAudioFileName("a.mp3.txt"), false);
  assert.equal(isAudioFileName("noext"), false);
});

test("AUDIO_EXTENSIONS: 不含 .m4p（DRM，浏览器播不了，收了也是坑）", () => {
  assert.equal(AUDIO_EXTENSIONS.includes(".m4p" as never), false);
});

// ── 搜索 / 排序 / 格式化 ─────────────────────────────────────────────

test("matchesQuery: 曲目/歌手/专辑任一命中", () => {
  const t = { title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line" };
  assert.equal(matchesQuery(t, "water"), true);
  assert.equal(matchesQuery(t, "harry"), true);
  assert.equal(matchesQuery(t, "fine line"), true);
  assert.equal(matchesQuery(t, "  "), true);
  assert.equal(matchesQuery(t, "zzz"), false);
});

test("compareTracks: 先歌手再专辑再曲目", () => {
  const c = new Intl.Collator("zh-Hans", { numeric: true });
  const a = { artist: "A", album: "X", title: "b" };
  const b = { artist: "A", album: "X", title: "c" };
  const d = { artist: "B", album: "A", title: "a" };
  assert.ok(compareTracks(a, b, c) < 0, "同专辑内按曲目名");
  assert.ok(compareTracks(b, d, c) < 0, "不同歌手时歌手优先于曲目名");
  assert.equal(compareTracks(a, { ...a }, c), 0);
});

test("formatDuration: 分秒与小时", () => {
  assert.equal(formatDuration(0), "0:00");
  assert.equal(formatDuration(59), "0:59");
  assert.equal(formatDuration(60), "1:00");
  assert.equal(formatDuration(225), "3:45");
  assert.equal(formatDuration(3661), "1:01:01");
  assert.equal(formatDuration(NaN), "0:00");
  assert.equal(formatDuration(-5), "0:00");
});

test("formatSize: KB 与 MB", () => {
  assert.equal(formatSize(500), "0 KB");
  assert.equal(formatSize(2048), "2 KB");
  assert.equal(formatSize(1048576), "1.0 MB");
  assert.equal(formatSize(5 * 1048576), "5.0 MB");
});
