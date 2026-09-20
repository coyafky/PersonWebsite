"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  cycleRepeat,
  collectTracks,
  loadRootHandle,
  matchesQuery,
  pickDirectory,
  playAt,
  saveRootHandle,
  seek,
  setError,
  setLibrary,
  setRootName,
  setScanning,
  setVolume,
  skip,
  sortTracks,
  supportsFileSystemAccess,
  toggle,
  toggleShuffle,
  useClock,
  usePlayback,
} from "@/lib/tools/music-player";
import { formatDuration, formatSize } from "@/lib/tools/music-scan";

/**
 * /tools/music 的控制器。
 *
 * 播放本身不在这里 —— 在 lib/tools/music-player.ts 的模块单例里，
 * 所以离开这个页面音乐不会停（这正是这个组件被重写的原因）。
 * 这里只负责：选文件夹 → 扫描 → 渲染列表 → 把点击转成指令。
 */

const noopSubscribe = () => () => {};
const clientSupports = () => supportsFileSystemAccess();
const serverSupports = () => false;

export function MusicLibrary() {
  const supported = useSyncExternalStore(noopSubscribe, clientSupports, serverSupports);
  const playback = usePlayback();
  const clock = useClock();

  const [savedName, setSavedName] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const { tracks, index, isPlaying, scanning, rootName, error, volume, shuffle, repeat } = playback;

  const filtered = useMemo(
    () => tracks.filter((t) => matchesQuery(t, query)),
    [tracks, query],
  );
  const totalBytes = useMemo(() => tracks.reduce((s, t) => s + t.sizeBytes, 0), [tracks]);

  const runScan = useCallback(async (root: Parameters<typeof collectTracks>[0]) => {
    setRootName(root.name);
    setError(null);
    setScanning({ active: true, found: 0 });
    const cancel = { cancelled: false };
    try {
      const found = sortTracks(await collectTracks(root, (n) => setScanning({ active: true, found: n }), cancel));
      if (cancel.cancelled) return;
      setLibrary(found, root.name);
      if (found.length === 0) {
        setError("这个文件夹里没找到可播放的音频。选到包含歌手的上一层试试（例如 Media.localized）。");
      }
    } catch (e) {
      setScanning({ active: false, found: 0 });
      setError(`扫描失败：${e instanceof Error ? e.message : String(e)}`);
    }
  }, []);

  const pickFolder = useCallback(async () => {
    try {
      const handle = await pickDirectory();
      if (!handle) return;
      await saveRootHandle(handle);
      await runScan(handle);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return; // 用户取消
      setError(`打开文件夹失败：${e instanceof Error ? e.message : String(e)}`);
    }
  }, [runScan]);

  // 挂载时看看有没有上次的文件夹。权限必须由一次真实点击触发，
  // 所以这里只做"探测"，不自动扫描。
  useEffect(() => {
    let alive = true;
    void (async () => {
      const saved = await loadRootHandle();
      if (!alive || !saved) return;
      setSavedName(saved.name);
      // 已经有曲目（说明是切回本页，不是首次进入）→ 不要重启扫描
      if (playback.tracks.length > 0) return;
      try {
        const state = (await saved.queryPermission?.({ mode: "read" })) ?? "prompt";
        if (state === "granted") await runScan(saved);
        // 未授权时不自动扫：权限必须由一次真实点击触发
      } catch {
        // 探测失败就当作未授权，等用户点「恢复」
      }
    })();
    return () => {
      alive = false;
    };
    // playback.tracks.length 刻意不进依赖：只在挂载时判断一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runScan]);

  const resumeSaved = useCallback(async () => {
    const saved = await loadRootHandle();
    if (!saved) return;
    try {
      const state = await saved.requestPermission?.({ mode: "read" });
      if (state && state !== "granted") {
        setError("没有拿到读取权限。重新选一次文件夹即可。");
        return;
      }
      await runScan(saved);
    } catch (e) {
      setError(`恢复失败：${e instanceof Error ? e.message : String(e)}`);
    }
  }, [runScan]);

  if (!supported) {
    return (
      <div className="tool-panel">
        <div className="tool-face">
          <p className="tool-phase">不支持</p>
          <p className="tool-hint">
            这个工具用的是 File System Access API，目前只有 Chrome / Edge 支持。
            你正在用的浏览器没有 <code>showDirectoryPicker</code>，所以读不到本地音乐库。
            Safari 和 Firefox 暂时用不了。
          </p>
        </div>
      </div>
    );
  }

  const ready = tracks.length > 0;
  const current = index >= 0 ? tracks[index] : null;

  return (
    <div className="tool-panel tool-panel--music">
      <div className="tool-face">
        <p className="tool-phase">本地音乐</p>

        {!ready ? (
          <>
            <p className="tool-readout tool-readout--sm">
              {scanning.active ? `扫描中 ${scanning.found}` : savedName ? "待授权" : "未连接"}
            </p>
            <p className="tool-hint">
              选一次你的音乐文件夹，之后每次打开只要点一下「恢复」。
              <strong> 全部在你的机器上播放，不上传任何文件。</strong>
            </p>
            <div className="tool-controls">
              <button className="button primary" onClick={pickFolder} type="button">
                选择音乐文件夹
              </button>
              {savedName ? (
                <button className="button secondary" onClick={resumeSaved} type="button">
                  恢复「{savedName}」
                </button>
              ) : null}
            </div>
            <p className="tool-note">
              建议选 <code>~/Music/Music/Media.localized</code>。扫描会自动跳过{" "}
              <code>Music_副本</code>（那里 256 首与正式库重复）。
            </p>
          </>
        ) : (
          <>
            <p className="tool-readout tool-readout--sm">
              {tracks.length} <span className="tool-readout-unit">首</span>
            </p>
            <p className="tool-hint">
              {rootName} · 共 {formatSize(totalBytes)}
              {query ? ` · 匹配 ${filtered.length} 首` : ""}
            </p>
            <div className="tool-controls">
              <button className="button secondary" onClick={pickFolder} type="button">
                换文件夹
              </button>
            </div>
            <p className="tool-note">
              <strong>切到别的页面音乐也不会停</strong> —— 播放器在页面之外独立运行，
              屏幕底部会有一条常驻播放条。
            </p>
          </>
        )}

        {error ? <p className="tool-error">{error}</p> : null}
      </div>

      {ready ? (
        <div className="tool-side">
          <section className="tool-block tool-block--grow">
            <label className="tool-field">
              <span>搜索 曲目 / 歌手 / 专辑</span>
              <input
                onChange={(e) => setQuery(e.target.value)}
                placeholder="例如 Harry / 房間裡 / Watermelon"
                type="search"
                value={query}
              />
            </label>

            <ul className="music-list">
              {filtered.slice(0, 600).map((track) => {
                const i = tracks.indexOf(track);
                const active = i === index;
                return (
                  <li key={track.id}>
                    <button
                      aria-current={active ? "true" : undefined}
                      className={`music-row${active ? " is-active" : ""}`}
                      onClick={() => playAt(i)}
                      type="button"
                    >
                      <span className="music-row-main">
                        <span className="music-row-title">
                          {active && isPlaying ? "▶ " : ""}
                          {track.title}
                        </span>
                        <span className="music-row-meta">
                          {[track.artist, track.album].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                      <span className="music-row-size">{formatSize(track.sizeBytes)}</span>
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 ? <li className="music-empty">没有匹配的曲目。</li> : null}
            </ul>
          </section>
        </div>
      ) : null}

      {ready ? (
        <div className="music-player">
          <div className="music-player-now">
            <span className="music-player-title">{current?.title ?? "未在播放"}</span>
            <span className="music-player-meta">
              {current ? [current.artist, current.album].filter(Boolean).join(" · ") : ""}
            </span>
          </div>

          <div className="music-player-progress">
            <span className="music-time">{formatDuration(clock.currentTime)}</span>
            <input
              aria-label="播放进度"
              className="music-seek"
              max={clock.duration || 0}
              min={0}
              onChange={(e) => seek(Number(e.target.value))}
              step={1}
              type="range"
              value={Math.min(clock.currentTime, clock.duration || 0)}
            />
            <span className="music-time">{formatDuration(clock.duration)}</span>
          </div>

          <div className="music-player-controls">
            <button aria-label="上一首" className="tool-chip" onClick={() => skip(-1)} type="button">
              ⏮
            </button>
            <button
              aria-label={isPlaying ? "暂停" : "播放"}
              className="tool-chip is-active"
              onClick={toggle}
              type="button"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button aria-label="下一首" className="tool-chip" onClick={() => skip(1)} type="button">
              ⏭
            </button>
            <button
              aria-pressed={shuffle}
              className={`tool-chip${shuffle ? " is-active" : ""}`}
              onClick={toggleShuffle}
              type="button"
            >
              随机
            </button>
            <button
              className={`tool-chip${repeat !== "off" ? " is-active" : ""}`}
              onClick={cycleRepeat}
              type="button"
            >
              {repeat === "off" ? "不循环" : repeat === "all" ? "列表循环" : "单曲循环"}
            </button>
            <label className="music-volume">
              <span className="music-volume-label">音量</span>
              <input
                aria-label="音量"
                max={1}
                min={0}
                onChange={(e) => setVolume(Number(e.target.value))}
                step={0.05}
                type="range"
                value={volume}
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
