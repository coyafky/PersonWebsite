"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface Tab {
  label: string;
  children: ReactNode;
}

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);

  if (!Array.isArray(tabs) || tabs.length === 0) {
    return (
      <div className="tabs tabs-empty">
        <p>
          Tabs 缺少 <code>tabs</code> 数据。请在 MDX 中通过 <code>import</code> 引入数据文件，或在
          frontmatter 中提供 <code>tabs</code> 数组。
        </p>
      </div>
    );
  }

  return (
    <div className="tabs">
      <div className="tabs-nav" role="tablist" aria-label="Content tabs">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`tabs-panel-${i}`}
            id={`tabs-trigger-${i}`}
            className={`tabs-trigger ${i === active ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className="tabs-panel"
        role="tabpanel"
        id={`tabs-panel-${active}`}
        aria-labelledby={`tabs-trigger-${active}`}
      >
        {tabs[active]?.children}
      </div>
    </div>
  );
}
