"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * 小工具的浏览器本地存储层。
 *
 * 为什么不写成「useState + useEffect 里读 localStorage」：
 * 那会在渲染之后同步 setState（违反 eslint 的 react-hooks/set-state-in-effect，
 * 也确实会多走一次级联渲染），而且要先画一帧兜底值再闪一下。
 *
 * 这里改用 useSyncExternalStore —— 它本来就是为「订阅 React 之外的数据源」
 * 设计的。快照取的是**原始 JSON 字符串**：字符串按值比较，所以不会因为
 * 引用变化造成无限渲染。
 */

const PREFIX = "alma:tool:";

const listeners = new Map<string, Set<() => void>>();

function emit(key: string): void {
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribeTo(key: string, listener: () => void): () => void {
  let bucket = listeners.get(key);
  if (!bucket) {
    bucket = new Set();
    listeners.set(key, bucket);
  }
  bucket.add(listener);
  return () => {
    bucket.delete(listener);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    // 隐私模式 / 存储被禁用 → 当作没有
    return null;
  }
}

/** 写入并通知订阅者 */
export function writeToolStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // 配额满 / 被禁用 → 忽略，只是刷新后不保留
  }
  emit(key);
}

/** 订阅某个 key 的原始 JSON 字符串（含其它标签页的写入） */
export function useToolStorageRaw(key: string): string | null {
  const subscribe = useCallback(
    (listener: () => void) => {
      const unsubscribe = subscribeTo(key, listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === PREFIX + key) listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        unsubscribe();
        window.removeEventListener("storage", onStorage);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(() => readRaw(key), [key]);
  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * 读写一小块自动持久化的状态。
 *
 * ⚠️ fallback 必须是**稳定的引用**（模块级常量）。传对象字面量进去会让
 * useMemo 每帧重建，进而拖着重渲染。
 */
export function useToolState<T>(
  key: string,
  fallback: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const raw = useToolStorageRaw(key);
  const value = useMemo(() => parse(raw, fallback), [raw, fallback]);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      // 每次都从存储重新读一次当前值：连续两次函数式更新
      // （例如先改 focusDone 再改 phase）才能正确叠加。
      const prev = parse(readRaw(key), fallback);
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeToolStorage(key, resolved);
    },
    [key, fallback],
  );

  return [value, setValue];
}

const noopSubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/**
 * 是否已经真的跑在浏览器上（SSR 与水合阶段返回 false）。
 * 用 useSyncExternalStore 实现，因此不需要在 effect 里 setState。
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, clientSnapshot, serverSnapshot);
}
