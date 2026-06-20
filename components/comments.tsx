"use client";

import { useEffect, useRef } from "react";

export function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || container.children.length > 0) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", "coyafky/PersonWebsite");
    script.setAttribute("data-repo-id", "R_kgDOO0x6gg");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOO0x6gs4CpTiW");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");
    container.appendChild(script);
  }, []);

  return <div ref={ref} className="giscus-container" />;
}
