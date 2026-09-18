"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useIsHydrated, useToolStorageRaw, writeToolStorage } from "./use-tool-store";

/**
 * 倒计时 hook —— 番茄钟与倒计时共用。
 *
 * ⚠️ 最重要的一条：**剩余时间永远由 `endsAt - Date.now()` 现算，
 * 绝不靠 setInterval 累加计数**。浏览器会节流非活动标签页的定时器
 * （后台可能降到 1 次/秒甚至更低），累加式计时器切走一会儿就会明显走慢。
 * 这里 interval 只负责「触发一次重算」，不负责计时本身 —— 哪怕它被降频，
 * 读数依然准确。
 *
 * 刷新不丢进度：存的是绝对时刻 endsAt，恢复时用 Date.now() 重新对账，
 * 而不是存「还剩多少秒」再让它自己减。
 */

const TICK_MS = 200;

type Persisted = {
  /** 本轮结束的绝对时刻（epoch ms）；仅 isRunning 时有意义 */
  endsAt: number | null;
  /** 暂停 / 未运行时的剩余毫秒 */
  remainingMs: number;
  totalMs: number;
  isRunning: boolean;
};

type Machine = Persisted;

function parseStored(raw: string | null, fallbackTotalMs: number): Persisted | null {
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    const totalMs =
      typeof parsed.totalMs === "number" && parsed.totalMs > 0
        ? parsed.totalMs
        : fallbackTotalMs;
    const endsAt = typeof parsed.endsAt === "number" ? parsed.endsAt : null;
    const isRunning = parsed.isRunning === true && endsAt !== null;
    const remainingMs =
      typeof parsed.remainingMs === "number" && parsed.remainingMs >= 0
        ? Math.min(parsed.remainingMs, totalMs)
        : totalMs;

    return { endsAt, remainingMs, totalMs, isRunning };
  } catch {
    // JSON 损坏 → 当作全新开始，不影响计时
    return null;
  }
}

export type Countdown = {
  /** 剩余毫秒（每次重算由 endsAt 现算） */
  remainingMs: number;
  /** 当前总时长 */
  totalMs: number;
  isRunning: boolean;
  /** 已归零且未在运行 */
  isComplete: boolean;
  /** 0~1 的进度，给进度条用 */
  progress: number;
  /** 是否已从存储恢复完毕；false 时读数是首屏兜底值 */
  hydrated: boolean;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  /** 重置；传 nextTotalMs 可同时换新的总时长 */
  reset: (nextTotalMs?: number) => void;
};

export function useCountdown(options: {
  /** 总时长（毫秒）。仅在没有任何已存状态时作为初始值 */
  totalMs: number;
  /** localStorage 后缀，不同工具必须各不相同 */
  storageKey: string;
  /** 归零时回调一次（含「离开期间就已经跑完」的情况） */
  onComplete?: () => void;
}): Countdown {
  const { totalMs: initialTotalMs, storageKey } = options;

  const hydrated = useIsHydrated();
  const raw = useToolStorageRaw(storageKey);

  const [machine, setMachine] = useState<Machine>(() => ({
    endsAt: null,
    remainingMs: initialTotalMs,
    totalMs: initialTotalMs,
    isRunning: false,
  }));

  // ── 与存储对齐（渲染期调整 state）────────────────────────────
  // 这是 React 官方的「adjusting state during render」模式，不是副作用。
  // 不放在 effect 里的原因：那会先提交一帧兜底值再闪一下。
  // 注意 initialTotalMs 在这一帧已经是**水合后的真实值**（组件的元数据
  // 同样来自 useSyncExternalStore 快照），所以这里可以直接采信。
  const [seeded, setSeeded] = useState(false);
  if (hydrated && !seeded) {
    setSeeded(true);
    const stored = parseStored(raw, initialTotalMs);
    if (stored) {
      // ⚠️ 这里刻意不调 Date.now() —— 渲染期调用非纯函数会被
      // react-hooks/purity 拦下，而且读出来的值也不稳定。
      // 直接采信存储里的 remainingMs（运行中它由下面的节流写入维持在
      // 秒级精度）；离开期间已经跑完的情况，交给 tick 的收尾分支处理。
      setMachine({
        totalMs: stored.totalMs,
        remainingMs: stored.remainingMs,
        isRunning: stored.isRunning,
        endsAt: stored.endsAt,
      });
    } else {
      setMachine({
        endsAt: null,
        remainingMs: initialTotalMs,
        totalMs: initialTotalMs,
        isRunning: false,
      });
    }
  }

  // onComplete 放 ref：避免它进依赖数组把 interval 反复拆建
  const onCompleteRef = useRef(options.onComplete);
  useEffect(() => {
    onCompleteRef.current = options.onComplete;
  }, [options.onComplete]);

  // ── 计时：唯一的真相是 endsAt ────────────────────────────────
  useEffect(() => {
    if (!machine.isRunning || machine.endsAt === null) return;
    const endsAt = machine.endsAt;
    let finished = false;

    const recompute = () => {
      if (finished) return;
      const left = Math.max(0, endsAt - Date.now());
      if (left <= 0) {
        finished = true;
        setMachine((prev) =>
          prev.isRunning
            ? { ...prev, isRunning: false, endsAt: null, remainingMs: 0 }
            : prev,
        );
        onCompleteRef.current?.();
        return;
      }
      setMachine((prev) => (prev.isRunning ? { ...prev, remainingMs: left } : prev));
    };

    recompute(); // 挂载即对账：离开期间已经跑完的，在这一步就收尾
    const id = window.setInterval(recompute, TICK_MS);
    return () => window.clearInterval(id);
  }, [machine.isRunning, machine.endsAt]);

  // ── 落盘 ────────────────────────────────────────────────────
  // 运行中 remainingMs 每 200ms 跳一次，但 truth 是 endsAt —— 所以运行期间
  // 只按「秒」节流写入：既让刷新后的首帧有个准数（不会先闪一个 00:00），
  // 也不会 5 次/秒地写 localStorage。
  const lastWrittenSecondRef = useRef<number | null>(null);
  useEffect(() => {
    if (!seeded) return;
    if (machine.isRunning) {
      const second = Math.ceil(machine.remainingMs / 1000);
      if (lastWrittenSecondRef.current === second) return;
      lastWrittenSecondRef.current = second;
    } else {
      lastWrittenSecondRef.current = null;
    }
    writeToolStorage(storageKey, machine);
  }, [seeded, machine, storageKey]);

  const start = useCallback(() => {
    setMachine((prev) => {
      if (prev.isRunning) return prev;
      const base = prev.remainingMs > 0 ? prev.remainingMs : prev.totalMs;
      return { ...prev, remainingMs: base, endsAt: Date.now() + base, isRunning: true };
    });
  }, []);

  const pause = useCallback(() => {
    setMachine((prev) => {
      if (!prev.isRunning || prev.endsAt === null) return prev;
      return {
        ...prev,
        remainingMs: Math.max(0, prev.endsAt - Date.now()),
        endsAt: null,
        isRunning: false,
      };
    });
  }, []);

  const toggle = useCallback(() => {
    setMachine((prev) => {
      if (prev.isRunning) {
        return {
          ...prev,
          remainingMs:
            prev.endsAt === null ? prev.remainingMs : Math.max(0, prev.endsAt - Date.now()),
          endsAt: null,
          isRunning: false,
        };
      }
      const base = prev.remainingMs > 0 ? prev.remainingMs : prev.totalMs;
      return { ...prev, remainingMs: base, endsAt: Date.now() + base, isRunning: true };
    });
  }, []);

  const reset = useCallback((nextTotalMs?: number) => {
    setMachine((prev) => {
      const total = nextTotalMs ?? prev.totalMs;
      return { totalMs: total, remainingMs: total, endsAt: null, isRunning: false };
    });
  }, []);

  const { remainingMs, totalMs, isRunning } = machine;

  return {
    remainingMs,
    totalMs,
    isRunning,
    isComplete: !isRunning && remainingMs === 0 && totalMs > 0,
    progress: totalMs > 0 ? 1 - remainingMs / totalMs : 0,
    hydrated,
    start,
    pause,
    toggle,
    reset,
  };
}
