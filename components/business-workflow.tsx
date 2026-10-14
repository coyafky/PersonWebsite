"use client";

import { useState } from "react";
import Link from "next/link";
import { portfolioCases } from "@/lib/portfolio";

export function BusinessWorkflow({
  availableSlugs,
}: {
  availableSlugs: string[];
}) {
  const cases = portfolioCases.filter((item) =>
    availableSlugs.includes(item.slug),
  );
  const [selected, setSelected] = useState(0);
  const current = cases[selected] ?? cases[0];
  if (!current) return null;

  return (
    <section className="business-workflow" aria-label="业务项目流程">
      <div className="workflow-heading">
        <span className="section-kicker">FROM BUSINESS TO WORKFLOW</span>
        <span className="workflow-caption">项目流程</span>
      </div>
      <div className="workflow-switcher" role="group" aria-label="选择业务场景">
        {cases.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={selected === index}
            aria-controls="business-workflow-detail"
            onClick={() => setSelected(index)}
          >
            {item.tab}
          </button>
        ))}
      </div>
      <div
        id="business-workflow-detail"
        className="workflow-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="workflow-endpoint">
          <span>业务输入</span>
          <strong>{current.input}</strong>
        </div>
        <div className="workflow-connector" aria-hidden="true">
          ↓
        </div>
        <div className="workflow-engine">
          <div className="workflow-engine-heading">
            <span className="workflow-symbol" aria-hidden="true">
              ✳
            </span>
            <strong>AI + 工作流</strong>
            <span>人保留判断</span>
          </div>
          <ol>
            {current.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="workflow-connector" aria-hidden="true">
          ↓
        </div>
        <div className="workflow-endpoint">
          <span>实际交付</span>
          <strong>{current.output}</strong>
        </div>
        <div className="workflow-footnote">
          <p>{current.boundary}</p>
          <Link href={`/projects/${current.slug}`}>
            查看案例 <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
