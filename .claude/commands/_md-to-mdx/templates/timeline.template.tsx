// =====================================================================
// TIMELINE TEMPLATE — co-located with [slug].mdx
//
// Usage in MDX:
//   import W15Timeline from './w15-timeline'
//   <W15Timeline />
//
// 替换规则:
//   1) 函数名 W15Timeline → 你的 [Slug]Timeline (e.g., W16Timeline)
//   2) items 数组每一项替换为从原文 Time Log 表格抽出的真实数据
//   3) 文件名改为 [slug]-timeline.tsx，与 MDX 同目录
//
// 为什么自给自足：
//   items 是模块级常量，不是 JSX 数组字面量 prop —— 彻底绕开
//   next-mdx-remote/rsc 的 RSC 序列化坑。
// =====================================================================

import { Timeline } from "@/components/timeline";

const items = [
  // TODO: REPLACE each entry with one row from your "Time Log" table.
  // - label: weekday + date (e.g., "周一 5/18")
  // - title: short action title (e.g., "安装 10 个 Entrepreneurship skills")
  // - tags: optional hashtags (e.g., ["#Hermes技能"])
  {
    label: "示例 周一 5/18",
    title: "示例：在 Hermes 批量安装 10 个 Entrepreneurship skills",
    tags: ["#Hermes技能"],
  },
  {
    label: "示例 周二 5/19",
    title: "示例：Shared Agent Memory 设计→实现",
    tags: ["#共享记忆"],
  },
];

export default function W15Timeline() {
  // TODO: REPLACE the function name to match your slug.
  return <Timeline items={items} />;
}