import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "danger" | "tip" | "success";

const styles: Record<CalloutType, { icon: string; cls: string }> = {
  info:    { icon: "ℹ️", cls: "callout-info" },
  warning: { icon: "⚠️", cls: "callout-warning" },
  danger:  { icon: "🚫", cls: "callout-danger" },
  tip:     { icon: "💡", cls: "callout-tip" },
  success: { icon: "✅", cls: "callout-success" },
};

export function Callout({ type = "info", children }: { type?: CalloutType; children: ReactNode }) {
  const s = styles[type];
  return (
    <aside className={`callout ${s.cls}`}>
      <span className="callout-icon">{s.icon}</span>
      <span>{children}</span>
    </aside>
  );
}
