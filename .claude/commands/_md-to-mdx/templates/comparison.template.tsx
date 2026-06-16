// =====================================================================
// COMPARISON TEMPLATE — co-located with [slug].mdx
//
// Usage in MDX:
//   import W15Compare from './w15-compare'
//   <W15Compare />
//
// 替换规则:
//   1) 函数名 W15Compare → 你的 [Slug]Compare
//   2) cards 数组每一项替换为从原文对比表抽出的真实数据
//   3) 文件名改为 [slug]-comparison.tsx，与 MDX 同目录
//
// 样式：复用 globals.css 现有 .card-grid + .content-card (无需新增 CSS)
// =====================================================================

const cards = [
  // TODO: REPLACE each entry with one row from your comparison table.
  // - title: option name (e.g., "走法 A：抽数据文件")
  // - meta: short label / context (e.g., "复用通用组件")
  // - pros: array of strengths
  // - cons: array of weaknesses
  {
    title: "示例：走法 A — 抽数据文件",
    meta: "复用通用组件",
    pros: ["文件少", "复用度高"],
    cons: ["仍依赖 prop 序列化"],
  },
  {
    title: "示例：走法 B — 定制自给自足组件",
    meta: "每个特征独立",
    pros: ["无 prop，绕开 RSC 序列化", "视觉更贴合文章"],
    cons: ["组件文件多"],
  },
];

export default function W15Compare() {
  // TODO: REPLACE the function name to match your slug.
  return (
    <div className="card-grid">
      {cards.map((card) => (
        <article key={card.title} className="content-card">
          <span className="card-meta">{card.meta}</span>
          <h3>{card.title}</h3>
          <div>
            <strong>优点</strong>
            <ul>
              {card.pros.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>缺点</strong>
            <ul>
              {card.cons.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}