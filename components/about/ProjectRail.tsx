"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/** 内联箭头图标 —— 与 components/icons0.tsx 同风格，避免为新图标引入依赖 */
function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="1em"
      viewBox="0 0 32 32"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={direction === "left" ? "M20 6 10 16l10 10" : "M12 6l10 10-10 10"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export type RailItem = {
  slug: string;
  title: string;
  summary: string;
  meta: string;
  href: string;
};

/**
 * 横向画廊 —— "我做过什么"。
 *
 * 这是替代「纵向清单」的关键一招：简历的感觉来自"一栏一栏往下码同样的块"，
 * 改成横向之后，视线是"左右浏览"，读感立刻从"清单"变成"格子"。
 * 移动端／窄屏退回纵向堆叠（横向滚动在小屏上是负体验）。
 *
 * 用原生 overflow-x + scroll-snap，不上滚动劫持库 —— 触控板横滑、
 * 键盘 Tab、滚动条拖拽全都天然可用，且不抢页面纵向滚动。
 */

export function ProjectRail({ items }: { items: RailItem[] }) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const nudge = useCallback((direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    // 尊重系统偏好：开了"减少动态效果"就直接跳，不做平滑滚动。
    // 用 matchMedia 而不是 framer-motion 的 useReducedMotion —— 一个 DOM API 就够，
    // 没必要为此把 framer-motion 拖进这个组件。
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction * Math.round(el.clientWidth * 0.7),
      behavior: reduce ? "auto" : "smooth",
    });
  }, []);

  if (items.length === 0) {
    return (
      <p className="muted-block">
        项目还在整理，先去 <Link href="/projects">Projects</Link> 看。
      </p>
    );
  }

  return (
    <div className="about-rail">
      <ul
        className="about-rail-track"
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="做过的项目，可横向滚动"
      >
        {items.map((item) => (
          <li className="about-rail-item" key={item.slug}>
            <Link className="about-rail-card" href={item.href}>
              <span className="about-rail-meta">{item.meta}</span>
              <h3 className="about-rail-title">{item.title}</h3>
              <p className="about-rail-summary">{item.summary}</p>
              <span className="about-rail-cta">看这个项目 →</span>
            </Link>
          </li>
        ))}
      </ul>

      {items.length > 1 ? (
        <div className="about-rail-nav">
          <button
            aria-label="上一个项目"
            className="about-rail-btn"
            disabled={atStart}
            onClick={() => nudge(-1)}
            type="button"
          >
            <Chevron direction="left" />
          </button>
          <button
            aria-label="下一个项目"
            className="about-rail-btn"
            disabled={atEnd}
            onClick={() => nudge(1)}
            type="button"
          >
            <Chevron direction="right" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
