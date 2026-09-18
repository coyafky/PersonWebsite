/**
 * 提示音：用 Web Audio API 现场合成，不引入任何音频文件或依赖。
 *
 * 关键约束：浏览器自动播放策略要求 AudioContext 必须在**用户手势**里
 * 被创建（或 resume）。所以 primeChime() 必须在点击处理器里调用一次；
 * 没有调用过就直接 playChime() 会静默跳过，不报错 —— 定时器本身照常工作。
 *
 * 本模块只在客户端组件的 effect / 事件处理器里被调用。
 */

let audioCtx: AudioContext | null = null;

type AudioContextCtor = typeof AudioContext;

function getAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    AudioContext?: AudioContextCtor;
    webkitAudioContext?: AudioContextCtor;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

/**
 * 在用户点击处理器里调用一次。重复调用安全（幂等）。
 * 同时负责把被浏览器挂起的 context 唤醒。
 */
export function primeChime(): void {
  const Ctor = getAudioContextCtor();
  if (!Ctor) return;
  if (!audioCtx) {
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
}

/** 环境是否支持提示音（不支持时界面可以隐藏相关开关） */
export function isChimeSupported(): boolean {
  return getAudioContextCtor() !== null;
}

/**
 * 播放一串短提示音。
 * @param beeps 响几声，默认 2
 */
export function playChime(beeps = 2): void {
  // 没有经过用户手势 → 静默跳过，不抛错、不打断计时逻辑
  if (!audioCtx) return;
  const ctx = audioCtx;
  const base = ctx.currentTime;
  const gap = 0.24;

  for (let i = 0; i < beeps; i += 1) {
    const startAt = base + i * gap;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, startAt);

    // 用指数包络做淡入淡出，避免爆音（直接开关会听到 "咔"）
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.22, startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.18);

    osc.connect(gain).connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + 0.2);
  }
}
