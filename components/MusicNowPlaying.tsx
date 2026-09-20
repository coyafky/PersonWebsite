"use client";

import { usePathname } from "next/navigation";
import {
  resetPlaybackQueue,
  seek,
  setVolume,
  skip,
  toggle,
  useClock,
  usePlayback,
} from "@/lib/tools/music-player";
import { formatDuration } from "@/lib/tools/music-scan";

/**
 * 常驻悬浮播放条。
 *
 * 挂在 (site)/layout.tsx 里，所以它在站内任何页面都活着 —— 这是"跨页面控制
 * 音乐"的那一半，另一半是 lib/tools/music-player.ts 里的模块单例 audio。
 *
 * 设计依据：impeccable 的 **Operate** 模式（reference/operate.md）——
 * "native expectations 与真实使用场景优先于表达"。据此落实的几条：
 *   - 用 position: fixed（原文："Overlays escape their container"）
 *   - 状态齐全：default / hover / focus / active / disabled / loading / error
 *   - 动效 200ms，只表达状态不做装饰
 *   - **标签与按钮用正文字体**，不用站点的窄体展示字
 *     （原文 Don't："Display fonts in UI labels, buttons, data"）
 *   - accent 只出现在激活态，不撒到未激活控件
 *     （原文 Don't："Heavy color or full-saturation accents on inactive states"）
 *   - 作为 toolbar 用"第二中性层"：比内容面稍重 + 抬升阴影，读得出浮在内容之上
 */

/** 工具页自己已有一整套播放器，别在那一页再叠一条 */
const HIDE_ON = ["/tools/music"];

export function MusicNowPlaying() {
  const pathname = usePathname();
  const playback = usePlayback();
  const clock = useClock();

  const current = playback.index >= 0 ? playback.tracks[playback.index] : null;
  if (!current || HIDE_ON.includes(pathname)) return null;

  const single = playback.tracks.length <= 1;
  // duration 还没拿到 = 加载态（impeccable：用状态表达，不要塞个转圈）
  const loading = !Number.isFinite(clock.duration) || clock.duration <= 0;

  return (
    <aside className="music-np" aria-label="正在播放">
      <div className="music-np-inner">
        <div className="music-np-info">
          <span className="music-np-title" title={current.title}>
            {current.title}
          </span>
          <span className="music-np-meta" title={[current.artist, current.album].filter(Boolean).join(" · ")}>
            {playback.failed
              ? "这首播不了（格式可能不受支持）"
              : [current.artist, current.album].filter(Boolean).join(" · ") || "—"}
          </span>
        </div>

        <div className="music-np-controls">
          <button
            aria-label="上一首"
            className="music-np-btn"
            disabled={single}
            onClick={() => skip(-1)}
            type="button"
          >
            ⏮
          </button>
          <button
            aria-label={playback.isPlaying ? "暂停" : "播放"}
            aria-pressed={playback.isPlaying}
            className="music-np-btn music-np-btn--primary"
            onClick={toggle}
            type="button"
          >
            {playback.isPlaying ? "⏸" : "▶"}
          </button>
          <button
            aria-label="下一首"
            className="music-np-btn"
            disabled={single}
            onClick={() => skip(1)}
            type="button"
          >
            ⏭
          </button>
        </div>

        <div className="music-np-progress">
          <span className="music-np-time" aria-hidden={loading}>
            {loading ? "--:--" : formatDuration(clock.currentTime)}
          </span>
          <input
            aria-busy={loading}
            aria-label="播放进度"
            className="music-np-seek"
            disabled={loading}
            max={clock.duration || 0}
            min={0}
            onChange={(e) => seek(Number(e.target.value))}
            step={1}
            type="range"
            value={Math.min(clock.currentTime, clock.duration || 0)}
          />
          <span className="music-np-time">{loading ? "--:--" : formatDuration(clock.duration)}</span>
        </div>

        <label className="music-np-volume">
          <span className="music-np-volume-label">音量</span>
          <input
            aria-label="音量"
            max={1}
            min={0}
            onChange={(e) => setVolume(Number(e.target.value))}
            step={0.05}
            type="range"
            value={playback.volume}
          />
        </label>

        <button
          aria-label="停止播放并关闭"
          className="music-np-close"
          onClick={resetPlaybackQueue}
          type="button"
        >
          ✕
        </button>
      </div>
    </aside>
  );
}
