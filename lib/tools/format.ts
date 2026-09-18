/**
 * 计时显示格式化。纯函数，因此有单元测试（见 format.test.ts）。
 *
 * 用 Math.ceil 而不是 Math.floor：倒计时开始的瞬间 1500000ms 必须显示
 * 25:00 而不是 24:59，否则用户会觉得计时器一上来就少了一秒。
 */

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * 把剩余毫秒格式化成 MM:SS，超过一小时自动变成 H:MM:SS。
 * @param ms 剩余毫秒，负数按 0 处理
 */
export function formatClock(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / MS_PER_SECOND);
  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;

  if (hours > 0) {
    return `${hours}:${pad2(minutes)}:${pad2(seconds)}`;
  }
  return `${pad2(minutes)}:${pad2(seconds)}`;
}

/** 只关心「还剩几秒」的场景（例如给 aria-live 用），不补零 */
export function formatSecondsForSpeech(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / MS_PER_SECOND);
  return `${totalSeconds}`;
}

/** 分钟数 → 毫秒，带下限 1 分钟，避免用户把时长设成 0 */
export function minutesToMs(minutes: number): number {
  const safe = Number.isFinite(minutes) ? Math.max(1, Math.round(minutes)) : 1;
  return safe * SECONDS_PER_MINUTE * MS_PER_SECOND;
}
