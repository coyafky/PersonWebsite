"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playChime, primeChime } from "@/lib/tools/chime";
import { formatClock, minutesToMs } from "@/lib/tools/format";
import { useCountdown } from "@/lib/tools/use-countdown";
import { useToolState } from "@/lib/tools/use-tool-store";

type Phase = "focus" | "short" | "long";

const PHASE_LABEL: Record<Phase, string> = {
  focus: "专注",
  short: "短休息",
  long: "长休息",
};

const PHASE_HINT: Record<Phase, string> = {
  focus: "把手上的这件事推完这一段，别切任务。",
  short: "离开屏幕几分钟，看看远处。",
  long: "这一轮结束了，休息久一点再回来。",
};

const DEFAULT_MINUTES: Record<Phase, number> = { focus: 25, short: 5, long: 15 };

/** 每完成这么多个专注段，就进一次长休息 */
const FOCUS_PER_LONG_BREAK = 4;

const MINUTE_CHOICES = [1, 3, 5, 10, 15, 20, 25, 30, 45, 60];

type PomodoroMeta = {
  phase: Phase;
  focusDone: number;
  minutes: Record<Phase, number>;
  soundOn: boolean;
};

const INITIAL_META: PomodoroMeta = {
  phase: "focus",
  focusDone: 0,
  minutes: DEFAULT_MINUTES,
  soundOn: true,
};

/** 键盘处理器要跳过的元素：用户在这些里面打字时不该抢键 */
function shouldIgnoreKey(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    // 焦点在按钮上时让浏览器自己处理空格（否则会和我们一起触发，变成两下）
    el.tagName === "BUTTON" ||
    el.isContentEditable === true
  );
}

/** 读当前通知权限；浏览器不支持时返回 "unsupported" */
function readNotifyPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export function PomodoroTimer() {
  const [meta, setMeta] = useToolState<PomodoroMeta>("pomodoro:meta", INITIAL_META);

  const { phase, focusDone, minutes, soundOn } = meta;
  const durationMs = minutesToMs(minutes[phase]);

  // ── 计时器 ──────────────────────────────────────────────────
  // 声明顺序有讲究：goToPhase / handleComplete 都要用 reset 与 start，
  // 所以必须先把倒计时 hook 调起来；而 hook 又要求传 onComplete。
  // 两者互为前提 → 用一层 ref 转发回调，绕开「变量在声明前使用」。
  const completeRef = useRef<() => void>(() => {});
  const fireComplete = useCallback(() => completeRef.current(), []);

  const countdown = useCountdown({
    totalMs: durationMs,
    storageKey: "pomodoro",
    onComplete: fireComplete,
  });
  const { reset, start, toggle, hydrated } = countdown;

  // ── 阶段流转 ────────────────────────────────────────────────
  const goToPhase = useCallback(
    (next: Phase, withSound: boolean) => {
      if (withSound) playChime(2);
      // 先把计时器拨到新阶段的时长并启动，再落元数据。
      // reset 与 start 都是 setState 更新器，按调用顺序生效。
      reset(minutesToMs(minutes[next]));
      start();
      setMeta((prev) => ({ ...prev, phase: next }));
    },
    [minutes, reset, start, setMeta],
  );

  const handleComplete = useCallback(() => {
    if (phase === "focus") {
      const nextDone = focusDone + 1;
      const isLongBreak = nextDone % FOCUS_PER_LONG_BREAK === 0;
      setMeta((prev) => ({ ...prev, focusDone: nextDone }));
      goToPhase(isLongBreak ? "long" : "short", soundOn);
      notify("专注结束", isLongBreak ? "该长休息了。" : "起来动一动，5 分钟。");
    } else {
      goToPhase("focus", soundOn);
      notify("休息结束", "回到专注。");
    }
  }, [phase, focusDone, soundOn, goToPhase, setMeta]);

  // 让 hook 里的 ref 始终指向最新回调（hook 内部也是这么存 onComplete 的）
  useEffect(() => {
    completeRef.current = handleComplete;
  }, [handleComplete]);

  // 与存储对齐这件事由 useCountdown 在渲染期一次做完 ——
  // 放在这里做会多一个 effect，还容易在阶段变化时误重置刚启动的计时器。

  // ── 标签页标题同步剩余时间 ──────────────────────────────────
  const idleTitleRef = useRef<string | null>(null);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (idleTitleRef.current === null) idleTitleRef.current = document.title;
    document.title = countdown.isRunning
      ? `${formatClock(countdown.remainingMs)} · ${PHASE_LABEL[phase]}`
      : idleTitleRef.current;
  }, [countdown.isRunning, countdown.remainingMs, phase]);

  useEffect(() => {
    return () => {
      if (typeof document !== "undefined" && idleTitleRef.current !== null) {
        document.title = idleTitleRef.current;
      }
    };
  }, []);

  // ── 键盘：空格开始/暂停，R 重置 ─────────────────────────────
  // 站点全局快捷键占用 / 与 j/k（见 lib/keyboard-nav.ts），这里刻意避开。
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
        reset(minutesToMs(minutes[phase]));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle, reset, minutes, phase]);

  // ── 通知权限 ────────────────────────────────────────────────
  // 不用 effect 同步初始权限（那会在渲染之后 setState）：
  // 权限只在「用户点了按钮」时才会变，所以直接派生即可，
  // 把用户答复过的结果 pin 在 state 上。
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

  // ── 操作 ────────────────────────────────────────────────────
  const handleToggle = useCallback(() => {
    primeChime(); // 必须在用户手势里初始化 AudioContext
    toggle();
  }, [toggle]);

  const handleReset = useCallback(() => {
    reset(minutesToMs(minutes[phase]));
  }, [reset, minutes, phase]);

  const handleSkip = useCallback(() => {
    goToPhase(phase === "focus" ? "short" : "focus", false);
    if (phase === "focus") {
      setMeta((prev) => ({ ...prev, focusDone: prev.focusDone + 1 }));
    }
  }, [phase, goToPhase, setMeta]);

  const handleRestartCycle = useCallback(() => {
    setMeta((prev) => ({ ...prev, phase: "focus", focusDone: 0 }));
    reset(minutesToMs(minutes.focus));
  }, [setMeta, reset, minutes]);

  const changeMinutes = useCallback(
    (target: Phase, value: number) => {
      setMeta((prev) => ({
        ...prev,
        minutes: { ...prev.minutes, [target]: value },
      }));
      // 改的正好是当前阶段 → 立刻按新时长重开这一段
      if (target === phase) reset(minutesToMs(value));
    },
    [setMeta, phase, reset],
  );

  // 元数据与计时器都还没就绪前先占位，避免闪一下默认值
  if (!hydrated) {
    return (
      <div className="tool-panel" aria-busy="true">
        <p className="tool-loading">正在恢复上次的进度…</p>
      </div>
    );
  }

  const cyclePosition = focusDone % FOCUS_PER_LONG_BREAK;

  return (
    <div className="tool-panel">
      <div className={`tool-face tool-face--${phase}`}>
        <p className="tool-phase">{PHASE_LABEL[phase]}</p>
        <p className="tool-readout" role="timer" aria-label="剩余时间">
          {formatClock(countdown.remainingMs)}
        </p>
        <p className="tool-hint">{PHASE_HINT[phase]}</p>

        <div className="tool-progress" aria-hidden="true">
          <div
            className="tool-progress-fill"
            style={{ width: `${Math.round(countdown.progress * 100)}%` }}
          />
        </div>

        <div className="tool-controls">
          <button
            className="button primary"
            onClick={handleToggle}
            type="button"
          >
            {countdown.isRunning ? "暂停" : countdown.isComplete ? "再来一段" : "开始"}
          </button>
          <button className="button secondary" onClick={handleReset} type="button">
            重置
          </button>
          <button className="button secondary" onClick={handleSkip} type="button">
            跳到{phase === "focus" ? "休息" : "专注"}
          </button>
          <button
            className="button secondary"
            onClick={handleRestartCycle}
            type="button"
          >
            重开一轮
          </button>
        </div>

        <p className="tool-keyhint">
          快捷键：<kbd>空格</kbd> 开始 / 暂停 · <kbd>R</kbd> 重置
        </p>
      </div>

      <div className="tool-side">
        <section className="tool-block">
          <h3 className="tool-block-title">本轮进度</h3>
          <div className="tool-dots" role="img" aria-label={`本轮已完成 ${cyclePosition} / ${FOCUS_PER_LONG_BREAK} 个专注段`}>
            {Array.from({ length: FOCUS_PER_LONG_BREAK }, (_, index) => (
              <span
                key={index}
                className={`tool-dot${index < cyclePosition ? " is-done" : ""}`}
              />
            ))}
          </div>
          <p className="tool-stat">
            累计完成专注段：<strong>{focusDone}</strong>
          </p>
        </section>

        <section className="tool-block">
          <h3 className="tool-block-title">时长（分钟）</h3>
          <div className="tool-field-row">
            {(["focus", "short", "long"] as Phase[]).map((item) => (
              <label className="tool-field" key={item}>
                <span>{PHASE_LABEL[item]}</span>
                <select
                  value={minutes[item]}
                  onChange={(event) => changeMinutes(item, Number(event.target.value))}
                >
                  {MINUTE_CHOICES.map((choice) => (
                    <option key={choice} value={choice}>
                      {choice}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
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

      <p className="tool-sr-only" aria-live="polite">
        {PHASE_LABEL[phase]}
      </p>
    </div>
  );
}

/**
 * 只在权限已授予时发桌面通知。权限未授予就静默跳过 ——
 * 绝不在页面加载时主动弹权限请求。
 */
function notify(title: string, body: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body });
  } catch {
    // 某些浏览器在非安全上下文下会抛错 → 忽略
  }
}
