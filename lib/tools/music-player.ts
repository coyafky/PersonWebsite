"use client";

import { useSyncExternalStore } from "react";
import { compareTracks, matchesQuery, parseTrackPath, shouldSkipDirectory, isAudioFileName, type TrackMeta } from "./music-scan";

/**
 * 本地音乐播放器内核。
 *
 * ⚠️ 为什么 <audio> 不放在组件里：
 * 最初的实现把 <audio> 放在 MusicLibrary 组件内部，结果路由一切换组件卸载，
 * audio 元素被销毁 → 播放中断。音乐播放器必须是**跨页面活着**的东西。
 *
 * 解法：用 `new Audio()` 在模块里建单例。这个元素不属于 DOM 树，
 * 因此不受 React 挂载/卸载影响 —— 模块还在（用户没刷新页面），它就还在播。
 * 组件退化成"遥控器"，只读状态、发指令。
 *
 * 两个 store 分开的理由：
 * currentTime 每秒跳 4 次；如果和曲目列表放同一个 store，那 365 行列表
 * 会跟着每秒重渲染 4 次。分开之后只有播放条订阅"时钟"。
 */

const IDB_NAME = "alma-tools";
const IDB_STORE = "fs-handles";
const IDB_KEY = "music-root";

/* ── 类型 ───────────────────────────────────────────────────────────── */

export type PlayerTrack = TrackMeta & {
  id: string;
  name: string;
  sizeBytes: number;
  file: File;
};

export type RepeatMode = "off" | "all" | "one";

export type PlaybackState = {
  tracks: PlayerTrack[];
  /** -1 表示没在播 */
  index: number;
  isPlaying: boolean;
  /** 当前这首解码失败（格式不支持 / 文件坏了）—— 组件必须能表达这个状态 */
  failed: boolean;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  rootName: string | null;
  scanning: { active: boolean; found: number };
  error: string | null;
};

export type ClockState = {
  currentTime: number;
  duration: number;
};

type DirHandleLike = {
  kind: "directory";
  name: string;
  values: () => AsyncIterableIterator<
    { kind: "file"; name: string; getFile: () => Promise<File> } | DirHandleLike
  >;
  queryPermission?: (d: { mode: "read" }) => Promise<PermissionState>;
  requestPermission?: (d: { mode: "read" }) => Promise<PermissionState>;
};

declare global {
  interface Window {
    showDirectoryPicker?: (options?: {
      mode?: "read" | "readwrite";
      id?: string;
      startIn?: string;
    }) => Promise<DirHandleLike>;
  }
}

/* ── 极简外部 store（useSyncExternalStore 要求快照引用稳定）────────────── */

let playback: PlaybackState = {
  tracks: [],
  index: -1,
  isPlaying: false,
  failed: false,
  volume: 1,
  shuffle: false,
  repeat: "off",
  rootName: null,
  scanning: { active: false, found: 0 },
  error: null,
};

let clock: ClockState = { currentTime: 0, duration: 0 };

const playbackListeners = new Set<() => void>();
const clockListeners = new Set<() => void>();

export function subscribePlayback(listener: () => void): () => void {
  playbackListeners.add(listener);
  return () => playbackListeners.delete(listener);
}

export function getPlayback(): PlaybackState {
  return playback;
}

export function subscribeClock(listener: () => void): () => void {
  clockListeners.add(listener);
  return () => clockListeners.delete(listener);
}

export function getClock(): ClockState {
  return clock;
}

function setPlayback(patch: Partial<PlaybackState>): void {
  playback = { ...playback, ...patch };
  playbackListeners.forEach((l) => l());
}

function setClock(patch: Partial<ClockState>): void {
  clock = { ...clock, ...patch };
  clockListeners.forEach((l) => l());
}

/* ── 单例 audio ─────────────────────────────────────────────────────── */

let audio: HTMLAudioElement | null = null;
let objectUrl: string | null = null;

function ensureAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (audio) return audio;

  const el = new Audio();
  el.preload = "metadata";
  el.volume = playback.volume;

  el.addEventListener("timeupdate", () => setClock({ currentTime: el.currentTime }));
  el.addEventListener("durationchange", () => setClock({ duration: el.duration || 0 }));
  el.addEventListener("play", () => setPlayback({ isPlaying: true, failed: false }));
  el.addEventListener("error", () => setPlayback({ isPlaying: false, failed: true }));
  el.addEventListener("loadedmetadata", () => setPlayback({ failed: false }));
  el.addEventListener("pause", () => setPlayback({ isPlaying: false }));
  el.addEventListener("ended", () => {
    if (playback.repeat === "one") {
      el.currentTime = 0;
      void el.play().catch(() => setPlayback({ isPlaying: false }));
      return;
    }
    skip(1);
  });

  audio = el;
  return el;
}

/** 供"离开页面时"使用：不暂停，只是让调用方知道当前在播什么 */
export function getAudioElement(): HTMLAudioElement | null {
  return audio;
}

/* ── 播放指令 ───────────────────────────────────────────────────────── */

export function playAt(index: number): void {
  const track = playback.tracks[index];
  const el = ensureAudio();
  if (!track || !el) return;

  // 换曲必须 revoke 上一个 objectURL，否则每切一首泄漏一个本地文件句柄
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  }
  objectUrl = URL.createObjectURL(track.file);
  el.src = objectUrl;
  el.load();
  setClock({ currentTime: 0, duration: 0 });
  setPlayback({ index, failed: false });
  void el.play().catch(() => setPlayback({ isPlaying: false }));
}

export function toggle(): void {
  const el = ensureAudio();
  if (!el) return;
  if (playback.index < 0) {
    if (playback.tracks.length > 0) playAt(0);
    return;
  }
  if (el.paused) void el.play().catch(() => setPlayback({ isPlaying: false }));
  else el.pause();
}

export function skip(direction: 1 | -1): void {
  const total = playback.tracks.length;
  if (total === 0) return;

  if (playback.shuffle && direction === 1 && total > 1) {
    let n = playback.index;
    while (n === playback.index) n = Math.floor(Math.random() * total);
    playAt(n);
    return;
  }

  const n = playback.index + direction;
  if (n >= total) {
    if (playback.repeat === "all") playAt(0);
    else setPlayback({ isPlaying: false });
    return;
  }
  if (n < 0) {
    playAt(total - 1);
    return;
  }
  playAt(n);
}

export function seek(seconds: number): void {
  const el = audio;
  if (!el) return;
  el.currentTime = seconds;
  setClock({ currentTime: seconds });
}

export function setVolume(value: number): void {
  const v = Math.min(1, Math.max(0, value));
  if (audio) audio.volume = v;
  setPlayback({ volume: v });
}

export function toggleShuffle(): void {
  setPlayback({ shuffle: !playback.shuffle });
}

export function cycleRepeat(): void {
  const next: RepeatMode =
    playback.repeat === "off" ? "all" : playback.repeat === "all" ? "one" : "off";
  setPlayback({ repeat: next });
}

/* ── 库（扫描结果也放这里，切回工具页不用重扫）────────────────────────── */

export function setLibrary(tracks: PlayerTrack[], rootName: string): void {
  setPlayback({ tracks, rootName, index: -1, error: null, scanning: { active: false, found: 0 } });
  const el = audio;
  if (el) {
    el.pause();
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
    el.removeAttribute("src");
  }
  setClock({ currentTime: 0, duration: 0 });
}

export function setScanning(scanning: { active: boolean; found: number }): void {
  setPlayback({ scanning });
}

export function setError(error: string | null): void {
  setPlayback({ error });
}

export function setRootName(rootName: string | null): void {
  setPlayback({ rootName });
}

export function resetPlaybackQueue(): void {
  setPlayback({ index: -1, isPlaying: false });
  const el = audio;
  if (el) el.pause();
}

/* ── 扫描 ───────────────────────────────────────────────────────────── */

export async function collectTracks(
  root: DirHandleLike,
  onProgress: (found: number) => void,
  cancel: { cancelled: boolean },
): Promise<PlayerTrack[]> {
  const out: PlayerTrack[] = [];

  const walk = async (dir: DirHandleLike, prefix: string): Promise<void> => {
    for await (const entry of dir.values()) {
      if (cancel.cancelled) return;
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.kind === "directory") {
        // 跳过 Music_副本（256 首重复）与系统目录
        if (shouldSkipDirectory(entry.name)) continue;
        await walk(entry as DirHandleLike, rel);
        continue;
      }
      if (!isAudioFileName(entry.name)) continue;

      const file = await entry.getFile();
      out.push({ id: rel, name: entry.name, sizeBytes: file.size, file, ...parseTrackPath(rel) });
      if (out.length % 25 === 0) onProgress(out.length);
    }
  };

  await walk(root, "");
  onProgress(out.length);
  return out;
}

export function sortTracks(tracks: PlayerTrack[]): PlayerTrack[] {
  const collator = new Intl.Collator("zh-Hans", { numeric: true });
  return [...tracks].sort((a, b) => compareTracks(a, b, collator));
}

export { matchesQuery };

/* ── IndexedDB：记住上次选的文件夹 ───────────────────────────────────── */

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveRootHandle(handle: DirHandleLike): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(handle, IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // 隐私模式 / 配额满 → 忽略，只是下次要重选
  }
}

export async function loadRootHandle(): Promise<DirHandleLike | null> {
  try {
    const db = await openDb();
    const value = await new Promise<unknown>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return (value as DirHandleLike) ?? null;
  } catch {
    return null;
  }
}

/* ── React 订阅 ─────────────────────────────────────────────────────── */

export function usePlayback(): PlaybackState {
  return useSyncExternalStore(subscribePlayback, getPlayback, getPlayback);
}

export function useClock(): ClockState {
  return useSyncExternalStore(subscribeClock, getClock, getClock);
}

/**
 * 弹出文件夹选择框。必须在**用户手势**里调用，否则浏览器直接拒。
 * 只申请 mode: "read" —— 连写入能力都不要。
 */
export async function pickDirectory(): Promise<DirHandleLike | null> {
  if (typeof window === "undefined" || !window.showDirectoryPicker) return null;
  return window.showDirectoryPicker({ mode: "read", id: "music-root" });
}

export function supportsFileSystemAccess(): boolean {
  return typeof window !== "undefined" && typeof window.showDirectoryPicker === "function";
}
