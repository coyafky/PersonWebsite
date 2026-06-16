"use client";

import { motion } from "framer-motion";
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
        <p>
          Timeline 缺少 <code>items</code> 数据。请在 MDX 中通过 <code>import</code>{" "}
          引入数据文件，或在 frontmatter 中提供 <code>timeline</code> 数组。
        </p>
      </div>
    );
  }
  return (
    <div className="timeline">
      {items.map((itemData, i) => (
        <motion.div
          key={i}
          className="timeline-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.45,
            delay: i * 0.1,
            ease: [0.22, 0.61, 0.36, 1],
          }}
        >
          <div className="timeline-marker" />
          <div className="timeline-content">
            <span className="timeline-label">{itemData.label}</span>
            <span className="timeline-title">{itemData.title}</span>
            {itemData.tags && (
              <span className="timeline-tags">
                {itemData.tags.map((tag) => (
                  <span key={tag} className="timeline-tag">
                    {tag}
                  </span>
                ))}
              </span>
            )}
            {itemData.description && (
              <div className="timeline-desc">{itemData.description}</div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
