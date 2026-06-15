import type { ReactNode } from "react";

interface TimelineItem {
  label: string;
  title: string;
  description?: ReactNode;
  tags?: string[];
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="timeline timeline-empty">
        <p>Timeline 缺少 <code>items</code> 数据。请在 MDX 中通过 <code>import</code> 引入数据文件，或在 frontmatter 中提供 <code>timeline</code> 数组。</p>
      </div>
    );
  }
  return (
    <div className="timeline">
      {items.map((item, i) => (
        <div key={i} className="timeline-item">
          <div className="timeline-marker" />
          <div className="timeline-content">
            <span className="timeline-label">{item.label}</span>
            <span className="timeline-title">{item.title}</span>
            {item.tags && (
              <span className="timeline-tags">
                {item.tags.map(tag => (
                  <span key={tag} className="timeline-tag">{tag}</span>
                ))}
              </span>
            )}
            {item.description && <div className="timeline-desc">{item.description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
