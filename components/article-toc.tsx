"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/content/headings";

type ArticleTocProps = {
  headings: Heading[];
};

const MOBILE_QUERY = "(min-width: 1100px)";

export function ArticleToc({ headings }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  const rafRef = useRef<number | null>(null);

  // Track viewport breakpoint (desktop = true when >= 1100px)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Observe heading sections for active state
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (headings.length === 0) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the entry closest to the activation zone (top of viewport)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0]!.target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [headings]);

  // Reading progress bar via rAF-throttled scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const compute = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const ratio = window.scrollY / scrollable;
      const clamped = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
      setProgress(clamped);
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        compute();
      });
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const handleClick = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL hash after smooth scroll starts so it doesn't snap to the anchor
      window.setTimeout(() => {
        window.history.replaceState(null, "", `#${id}`);
      }, 50);
      setActiveId(id);
    },
    [],
  );

  const progressPct = Math.round(progress * 100);

  const navContent = (
    <ol>
      {headings.map((h) => (
        <li key={h.id} data-level={h.level}>
          <a
            href={`#${h.id}`}
            aria-current={h.id === activeId ? "location" : undefined}
            onClick={(e) => {
              e.preventDefault();
              handleClick(h.id);
            }}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <div
        className="article-progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPct}
        aria-label="阅读进度"
      >
        <span
          className="article-progress__bar"
          style={{
            transform: `scaleX(${progress})`,
            transformOrigin: "left",
          }}
        />
      </div>

      {headings.length > 0 && (
        isDesktop ? (
          <nav className="article-toc" aria-label="Table of contents">
            {navContent}
          </nav>
        ) : (
          <>
            <button
              type="button"
              className="article-toc__toggle"
              aria-expanded={open}
              aria-controls="article-toc-panel"
              onClick={() => setOpen((v) => !v)}
            >
              目录
            </button>
            <div
              id="article-toc-panel"
              className="article-toc-panel"
              data-open={open}
            >
              <nav className="article-toc" aria-label="Table of contents">
                {navContent}
              </nav>
            </div>
          </>
        )
      )}
    </>
  );
}
