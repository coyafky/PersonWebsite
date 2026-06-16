// =====================================================================
// STATS TEMPLATE — co-located with [slug].mdx
//
// Usage in MDX:
//   import W15Stats from './w15-stats'
//   <W15Stats />
//
// 替换规则:
//   1) 函数名 W15Stats → 你的 [Slug]Stats
//   2) metrics 数组每一项替换为从原文产出的真实数字
//   3) 文件名改为 [slug]-stats.tsx，与 MDX 同目录
//
// 样式：复用 globals.css 现有 .career-grid (3 列) + .career-panel (无需新增 CSS)
// =====================================================================

const metrics = [
  // TODO: REPLACE each entry with one KPI from your article.
  // - value: the headline number (e.g., "180")
  // - unit: optional unit string (e.g., "条 skill")
  // - label: short description (e.g., "跨 4 Agent 同步")
  {
    value: "180",
    unit: "条 skill",
    label: "示例：Shared Agent Skills 注册表",
  },
  {
    value: "95KB+",
    unit: "笔记",
    label: "示例：一天完成 4 个计算机基础模块",
  },
  {
    value: "4",
    unit: "个 Agent",
    label: "示例：Hermes / Codex / Claude Code / OpenCode",
  },
];

export default function W15Stats() {
  // TODO: REPLACE the function name to match your slug.
  return (
    <div className="career-grid">
      {metrics.map((m) => (
        <div key={m.label} className="career-panel">
          <strong
            style={{
              fontSize: "32px",
              color: "var(--accent-strong)",
              lineHeight: 1.1,
            }}
          >
            {m.value}
            {m.unit ? (
              <span
                style={{
                  fontSize: "14px",
                  marginLeft: "6px",
                  color: "var(--muted)",
                  fontWeight: 500,
                }}
              >
                {m.unit}
              </span>
            ) : null}
          </strong>
          <p>{m.label}</p>
        </div>
      ))}
    </div>
  );
}