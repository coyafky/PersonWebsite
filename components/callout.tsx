import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "danger" | "tip" | "success";

/**
 * 每种类型给一个**文字标签**，不再用 emoji。
 *
 * 改动的两个原因：
 *
 * 1. **原来 5 个类型视觉上完全一样。** 组件输出了 `callout-info` / `callout-warning`
 *    等 class，但 app/globals.css 里一个都没定义 —— 所以 type 实际只换了 emoji，
 *    语义信息没有传达出去。
 * 2. **emoji 与本站的排版语汇不符。** 站点有整套 Carbon SVG 图标
 *    (components/icons0.tsx)，emoji 在不同平台渲染还不一致。
 *    文字标签是本站既有的层级语言（section label / tool-block-title 都是这个做法），
 *    零新增图标就能把类型讲清楚。
 */
const LABELS: Record<CalloutType, string> = {
  info: "说明",
  warning: "注意",
  danger: "警告",
  tip: "提示",
  success: "结论",
};

export function Callout({
  type = "info",
  children,
}: {
  type?: CalloutType;
  children: ReactNode;
}) {
  return (
    <aside className={`callout callout-${type}`}>
      <span className="callout-label">{LABELS[type]}</span>
      <div className="callout-body">{children}</div>
    </aside>
  );
}
