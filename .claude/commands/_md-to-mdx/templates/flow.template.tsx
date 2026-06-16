// =====================================================================
// FLOW TEMPLATE — co-located with [slug].mdx
//
// Usage in MDX:
//   import W15Flow from './w15-flow'
//   <W15Flow />
//
// 替换规则:
//   1) 函数名 W15Flow → 你的 [Slug]Flow
//   2) chart 字符串替换为你的 mermaid 源码（注意换行用 \n，缩进无意义）
//   3) 文件名改为 [slug]-flow.tsx，与 MDX 同目录
//
// ⚠️ 关键约束：
//   chart 必须是模块级 const 字符串，且最终传给 <Mermaid chart={chart} />。
//   禁止在 MDX 里写成 <Mermaid chart={`...`} /> —— 模板字面量作为 JSX 属性
//   会被 next-mdx-remote/rsc 的 RSC 序列化器直接丢弃，运行时 chart 变 undefined。
// =====================================================================

"use client";

import { Mermaid } from "@/components/mermaid";

// TODO: REPLACE with your mermaid source.
// Example below: simple decision flow.
const chart =
  "graph LR\n  A[识别特征] --> B{用户确认}\n  B -->|Yes| C[定制组件]\n  B -->|No| D[跳过]\n  C --> E[替换 MDX 段落]";

export default function W15Flow() {
  // TODO: REPLACE the function name to match your slug.
  return <Mermaid chart={chart} />;
}