/**
 * 站点小工具注册表 —— 唯一事实来源。
 *
 * 注意这里**不是** content collection：工具是一段代码，不是一篇 markdown。
 * 所以不走 lib/content/ 的 zod schema / status 流转 / frontmatter 那一套。
 *
 * 本文件刻意保持**零 import**（不碰 `@/` 路径别名），这样 `node --test`
 * 能直接 import 它跑纯函数测试 —— 测试跑的是真代码，不是副本。
 *
 * 组件不进注册表：把 client component 塞进来会让整个模块图被拖成客户端模块。
 * 组件由 app/(site)/tools/[slug]/page.tsx 单独映射。
 */

export type SiteTool = {
  /** URL 段，同时是 /tools/[slug] 的 slug */
  id: string;
  /** 索引页与详情页标题 */
  title: string;
  /** 一句话摘要，用于索引卡片与 meta description */
  summary: string;
  /** 说明段的小标题，用于详情页的正文分节 */
  keywords: string[];
};

export const TOOLS: SiteTool[] = [
  {
    id: "pomodoro",
    title: "番茄钟",
    summary:
      "25 分钟专注 + 5 分钟休息的循环计时器，每 4 轮进一次长休息。切到别的标签页也不会走慢。",
    keywords: ["专注", "番茄工作法", "循环计时", "后台不漂移"],
  },
  {
    id: "countdown",
    title: "倒计时",
    summary:
      "任意时长的倒计时，带快捷预设与进度条。刷新页面或误关标签页不会丢失进度。",
    keywords: ["倒计时", "计时", "刷新不丢", "绝对时间戳"],
  },
  {
    id: "music",
    title: "本地音乐",
    summary:
      "直接播放你 Mac 音乐库里的歌。不上传、不经过服务器 —— 文件始终留在你的机器上，浏览器只是读它。",
    keywords: ["本地播放", "不上传", "零后端", "只读权限"],
  },
];

export function getTool(id: string): SiteTool | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function getAllToolIds(): string[] {
  return TOOLS.map((tool) => tool.id);
}
