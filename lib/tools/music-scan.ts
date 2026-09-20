/**
 * 本地音乐库扫描的纯逻辑。
 *
 * 刻意与 File System Access API 解耦：这里只处理「路径字符串 → 元数据」，
 * 是纯函数，所以能跑单元测试（见 music-scan.test.ts）。
 * 目录遍历那部分依赖浏览器 API，留在组件里，不进这里。
 *
 * 依据（2026-09-20 实测本机 ~/Music/Music/Media.localized）：
 *   - 729/729 个 mp3 全是 4 层：Music/<歌手>/<专辑>/<曲目>.mp3，零例外
 *   - ID3 标签也在，但路径已经够用，先不引入 ID3 解析器（零依赖原则）
 *   - 0 个 .m4p（无 DRM），所以浏览器能直接播
 */

/** 浏览器能直接解码的音频扩展名（按 2026 主流浏览器实际支持度取） */
export const AUDIO_EXTENSIONS = [
  ".mp3",
  ".m4a",
  ".aac",
  ".wav",
  ".flac",
  ".ogg",
  ".opus",
  ".aif",
  ".aiff",
] as const;

/**
 * 扫描时跳过的目录名。
 *
 * `Music_副本` 是实测发现的：它与正式库有 256 首字节完全相同的重复文件，
 * 同时又有 108 首正式库里没有的孤儿曲目。目录本身不该删（会丢那 108 首），
 * 但**扫描时跳过**它 —— 否则歌单里会出现 256 首重复项。
 */
export const SKIP_DIRECTORY_NAMES = [
  "Music_副本",
  "Automatically Add to Music.localized",
  "Previous Libraries",
  ".Trash",
  "Trash",
  "node_modules",
] as const;

export function isAudioFileName(name: string): boolean {
  const lower = name.toLowerCase();
  return AUDIO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function shouldSkipDirectory(name: string): boolean {
  if (SKIP_DIRECTORY_NAMES.some((skip) => skip === name)) return true;
  // macOS 系统目录 / 包：进去只会浪费时间，且 .musiclibrary 是个目录包
  if (name.startsWith(".")) return true;
  return name.endsWith(".musiclibrary");
}

function stripExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

export type TrackMeta = {
  title: string;
  artist: string;
  album: string;
};

/**
 * 从相对路径推 曲目/歌手/专辑。
 *
 * 单测覆盖了两种选取层级 —— 用户可以选 `Media.localized`（路径里多一层 Music/），
 * 也可以直接选 `Music` 本身，两种都要得出同样的元数据。
 */
export function parseTrackPath(relativePath: string): TrackMeta {
  const cleaned = relativePath.replace(/^\.\//, "").replace(/^\/+/, "");
  const segments = cleaned.split("/").filter((s) => s.length > 0);
  if (segments.length === 0) return { title: "", artist: "", album: "" };

  const fileName = segments[segments.length - 1];
  const title = stripExtension(fileName);

  if (segments.length >= 3) {
    return {
      artist: segments[segments.length - 3],
      album: segments[segments.length - 2],
      title,
    };
  }
  if (segments.length === 2) {
    return { artist: segments[0], album: "", title };
  }
  return { artist: "", album: "", title };
}

/** 秒 → mm:ss（超过一小时给 h:mm:ss） */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** 文件体积 → 人类可读 */
export function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const mb = bytes / 1048576;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

/** 排序：歌手 → 专辑 → 曲目（都按本地化比较，中文歌名也自然） */
export function compareTracks(
  a: TrackMeta,
  b: TrackMeta,
  collator: Intl.Collator,
): number {
  return (
    collator.compare(a.artist, b.artist) ||
    collator.compare(a.album, b.album) ||
    collator.compare(a.title, b.title)
  );
}

/** 命中搜索：曲目 / 歌手 / 专辑 任一包含关键词即可 */
export function matchesQuery(meta: TrackMeta, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") return true;
  return (
    meta.title.toLowerCase().includes(q) ||
    meta.artist.toLowerCase().includes(q) ||
    meta.album.toLowerCase().includes(q)
  );
}
