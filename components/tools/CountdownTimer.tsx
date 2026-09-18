"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playChime, primeChime } from "@/lib/tools/chime";
import { formatClock } from "@/lib/tools/format";
import { useCountdown } from "@/lib/tools/use-countdown";
import { useToolState } from "@/lib/tools/use-tool-store";

const MIN_MS = 1000;
const MAX_MS = 99 * 60 * 60 * 1000; // 99 小时封顶
const PRESET_MINUTES = [1, 3, 5, 10, 15, 30, 60];

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

type CountdownMeta = {
  /** 用户选定时长。计时器自己的进度另存在 alma:tool:countdown */
  totalMs: number;
  soundOn: boolean;
};

const INITIAL_META: CountdownMeta = {
  totalMs: 5 * MINUTE_MS,
  soundOn: true,
};

function clamp(ms: number): number {
  if (!Number.isFinite(ms)) return MIN_MS;
  return Math.min(MAX_MS, Math.max(MIN_MS, Math.round(ms)));
}

function splitMs(ms: number) {
  const safe = clamp(ms);
  const totalSeconds = Math.floor(safe / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function shouldIgnoreKey(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.tagName === "BUTTON" ||
    el.isContentEditable === true
  );
}

function notify(title: string, body: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body });
  } catch {
    // 非安全上下文下可能抛错 → 忽略
  }
}

/** 读当前通知权限；浏览器不支持时返回 "unsupported" */
function readNotifyPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export function CountdownTimer() {
  const [meta, setMeta] = useToolState<CountdownMeta>("countdown:meta", INITIAL_META);
  const { totalMs, soundOn } = meta;

  const handleComplete = useCallback(() => {
    if (soundOn) playChime(3);
    notify("倒计时结束", "时间到了。");
  }, [soundOn]);

  const countdown = useCountdown({
    totalMs,
    storageKey: "countdown",
    onComplete: handleComplete,
  });
  const { reset, toggle, hydrated } = countdown;

  // 与存储对齐由 useCountdown 在渲染期一次做完，这里不需要额外 effect。

  // 标签页标题同步
  const idleTitleRef = useRef<string | null>(null);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (idleTitleRef.current === null) idleTitleRef.current = document.title;
    document.title = countdown.isRunning
      ? `${formatClock(countdown.remainingMs)} · 倒计时`
      : idleTitleRef.current;
  }, [countdown.isRunning, countdown.remainingMs]);

  useEffect(() => {
    return () => {
      if (typeof document !== "undefined" && idleTitleRef.current !== null) {
        document.title = idleTitleRef.current;
      }
    };
  }, []);

  // 键盘：空格开始/暂停，R 重置（避开站点的 / 与 j/k）
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreKey(event.target)) return;
      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        primeChime();
        toggle();
        return;
      }
      if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        reset(totalMs);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle, reset, totalMs]);

  // 权限只在用户点按钮时变化 → 直接派生，不用 effect 同步
  const [answeredPermission, setAnsweredPermission] = useState<
    NotificationPermission | null
  >(null);
  const permission: NotificationPermission | "unsupported" =
    answeredPermission ?? (hydrated ? readNotifyPermission() : "unsupported");

  const requestPermission = useCallback(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    void Notification.requestPermission().then((result) =>
      setAnsweredPermission(result),
    );
  }, []);

  const setTotal = useCallback(
    (nextMs: number) => {
      const next = clamp(nextMs);
      setMeta((prev) => ({ ...prev, totalMs: next }));
      reset(next);
    },
    [setMeta, reset],
  );

  const handleToggle = useCallback(() => {
    primeChime();
    toggle();
  }, [toggle]);

  const parts = splitMs(totalMs);

  if (!hydrated) {
    return (
      <div className="tool-panel" aria-busy="true">
        <p className="tool-loading">正在恢复上次的进度…</p>
      </div>
    );
  }

  return (
    <div className="tool-panel">
      <div className={`tool-face tool-face--${countdown.isComplete ? "done" : "countdown"}`}>
        <p className="tool-phase">倒计时</p>
        <p className="tool-readout" role="timer" aria-label="剩余时间">
          {formatClock(countdown.remainingMs)}
        </p>
        <p className="tool-hint">
          {countdown.isComplete
            ? "时间到了。"
            : countdown.isRunning
              ? "正在计时，切到别的标签页也不会走慢。"
              : "选一个时长，或者自己填。"}
        </p>

        <div className="tool-progress" aria-hidden="true">
          <div
            className="tool-progress-fill"
            style={{ width: `${Math.round(countdown.progress * 100)}%` }}
          />
        </div>

        <div className="tool-controls">
          <button className="button primary" onClick={handleToggle} type="button">
            {countdown.isRunning ? "暂停" : countdown.isComplete ? "再来一次" : "开始"}
          </button>
          <button
            className="button secondary"
            onClick={() => reset(totalMs)}
            type="button"
          >
            重置
          </button>
        </div>

        <p className="tool-keyhint">
          快捷键：<kbd>空格</kbd> 开始 / 暂停 · <kbd>R</kbd> 重置
        </p>
      </div>

      <div className="tool-side">
        <section className="tool-block">
          <h3 className="tool-block-title">快捷时长</h3>
          <div className="tool-chips">
            {PRESET_MINUTES.map((minutes) => (
              <button
                key={minutes}
                className={`tool-chip${totalMs === minutes * MINUTE_MS ? " is-active" : ""}`}
                onClick={() => setTotal(minutes * MINUTE_MS)}
                type="button"
              >
                {minutes < 60 ? `${minutes} 分钟` : "1 小时"}
              </button>
            ))}
          </div>
        </section>

        <section className="tool-block">
          <h3 className="tool-block-title">自定义时长</h3>
          <div className="tool-field-row">
            <label className="tool-field">
              <span>时</span>
              <input
                max={99}
                min={0}
                onChange={(event) =>
                  setTotal(
                    Number(event.target.value) * HOUR_MS + parts.minutes * MINUTE_MS + parts.seconds * 1000,
                  )
                }
                type="number"
                value={parts.hours}
              />
            </label>
            <label className="tool-field">
              <span>分</span>
              <input
                max={59}
                min={0}
                onChange={(event) =>
                  setTotal(
                    parts.hours * HOUR_MS + Number(event.target.value) * MINUTE_MS + parts.seconds * 1000,
                  )
                }
                type="number"
                value={parts.minutes}
              />
            </label>
            <label className="tool-field">
              <span>秒</span>
              <input
                max={59}
                min={0}
                onChange={(event) =>
                  setTotal(
                    parts.hours * HOUR_MS + parts.minutes * MINUTE_MS + Number(event.target.value) * 1000,
                  )
                }
                type="number"
                value={parts.seconds}
              />
            </label>
          </div>
          <p className="tool-note">改了时长会立刻按新时长重置。</p>
        </section>

        <section className="tool-block">
          <h3 className="tool-block-title">提示</h3>
          <label className="tool-switch">
            <input
              checked={soundOn}
              onChange={(event) =>
                setMeta((prev) => ({ ...prev, soundOn: event.target.checked }))
              }
              type="checkbox"
            />
            <span>结束时响一声</span>
          </label>

          {permission === "unsupported" ? (
            <p className="tool-note">当前浏览器不支持桌面通知。</p>
          ) : permission === "granted" ? (
            <p className="tool-note">桌面通知已开启。</p>
          ) : permission === "denied" ? (
            <p className="tool-note">桌面通知已被拒绝，可在浏览器设置里改回来。</p>
          ) : (
            <button className="button secondary" onClick={requestPermission} type="button">
              开启桌面通知
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
