"use client";

import { useEffect, useState } from "react";
import type { Mermaid as MermaidInstance } from "mermaid";

type MermaidChart = MermaidInstance;
type MermaidProps = {
  chart?: string;
};

let mermaidSingleton: MermaidChart | null = null;
let mermaidInitPromise: Promise<MermaidChart> | null = null;

async function getMermaid(): Promise<MermaidChart> {
  if (mermaidSingleton) return mermaidSingleton;
  if (!mermaidInitPromise) {
    mermaidInitPromise = (async () => {
      const mod = await import("mermaid");
      const instance = mod.default;
      instance.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "strict",
        fontFamily: "inherit",
      });
      mermaidSingleton = instance;
      return instance;
    })();
  }
  return mermaidInitPromise;
}

export function Mermaid({ chart }: MermaidProps) {
  const definition = (chart ?? "").trim();
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!definition) return;
    let cancelled = false;
    let requestId = 0;

    (async () => {
      const currentId = ++requestId;
      try {
        const mermaid = await getMermaid();
        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(id, definition);
        if (cancelled || currentId !== requestId) return;
        setSvg(svg);
        setError(null);
      } catch (err) {
        if (cancelled || currentId !== requestId) return;
        setError(err instanceof Error ? err.message : String(err));
        setSvg(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [definition]);

  if (!definition) return null;

  if (error) {
    return (
      <pre className="mermaid-error">
        <code>{definition}</code>
        <span className="mermaid-error-message">{error}</span>
      </pre>
    );
  }

  if (svg) {
    return (
      <div
        className="mermaid"
        tabIndex={0}
        role="region"
        aria-label="流程图，可横向滚动"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  return (
    <div className="mermaid mermaid-loading">
      <p className="mdx-diagram-fallback">
        图表加载后显示；未启用 JavaScript 时可阅读下方流程源码。
      </p>
      <pre>
        <code>{definition}</code>
      </pre>
    </div>
  );
}
