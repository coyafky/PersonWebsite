"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * 动效候选预览台。
 *
 * 只服务于 /labs/motion 这一页 —— 不进导航、不进 sitemap、noindex。
 * 每个 demo 都对一个真实缺口，并且都能切到"降级"状态看 reduced-motion 用户
 * 看到的样子（这一页最重要的功能：动效的降级不是文档里的一句话，是能看的）。
 */

const REVEAL_SRC = "/gallery/2026-08-22-paper-cut-wonderland.webp";
const BLUR_SRC = "/gallery/2026-09-20-extreme-closeup-portrait.webp";
const REVEAL_TILES = Array.from({ length: 6 }, (_, i) => i);

const TOC_ITEMS = [
  { id: "t1", label: "为什么需要动效纪律" },
  { id: "t2", label: "现有动效清单" },
  { id: "t3", label: "缺口：没有入场语汇" },
  { id: "t4", label: "缺口：gallery 动效最少" },
  { id: "t5", label: "降级方案" },
];

export function MotionLab() {
  const prefersReduced = useReducedMotion();
  const [reducePreview, setReducePreview] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState("t2");
  const timer = useRef<number | null>(null);

  const noMotion = Boolean(prefersReduced) || reducePreview;

  // Demo 2 的"重新播放加载过程"
  const replay = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setLoaded(false);
    timer.current = window.setTimeout(() => setLoaded(true), 900);
  };

  useEffect(() => {
    timer.current = window.setTimeout(() => setLoaded(true), 900);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="ml" data-reduce={reducePreview ? "true" : "false"}>
      <header className="ml-head">
        <span className="section-kicker">LABS / MOTION</span>
        <h1>动效候选预览台</h1>
        <p>
          这一页只在本地与预览环境看，不进导航、不进 sitemap、<code>noindex</code>。每个 demo
          对应一个真实缺口；判定依据写在{" "}
          <code>docs/research/motion-inventory-and-candidates.md</code>。
        </p>
      </header>

      <div className="ml-bar">
        <label className="ml-switch">
          <input
            type="checkbox"
            checked={reducePreview}
            onChange={(e) => setReducePreview(e.target.checked)}
          />
          降级预览（近似模拟 prefers-reduced-motion: reduce）
        </label>
        <span className="ml-cap" />
        {prefersReduced ? <span className="ml-cap">系统当前已要求减少动效</span> : null}
      </div>

      {/* ── A1 ─────────────────────────────────────────────────── */}
      <section className="ml-demo">
        <h2>A1 · 画廊封面「显影」</h2>
        <p>
          零 JS：纯 CSS 滚动驱动。滚动到元素进入视口时，用{" "}
          <code>clip-path: inset()</code> 从中心揭开。不支持{" "}
          <code>view()</code> 的浏览器与 reduced-motion 用户，看到的就是最终态 ——
          <strong>降级不需要写兜底代码，因为它本来就是这个样子</strong>。
        </p>
        <ul className="ml-meta">
          <li className="ok">补缺口：/gallery 是唯一 Experience 面，动效数却最少（0）</li>
          <li>成本：低 · 零 JS · 零依赖</li>
          <li className="no">已否：rareui scroll-progress（本站已有 article-progress）</li>
        </ul>
        <div className="ml-reveal-grid">
          {REVEAL_TILES.map((i) => (
            <figure className="ml-reveal" key={i}>
              <Image
                src={REVEAL_SRC}
                alt=""
                width={1254}
                height={1254}
                sizes="(max-width: 720px) 45vw, 180px"
              />
            </figure>
          ))}
        </div>
        <p className="ml-caption">
          往下滚再看一遍 —— 视口下方的瓦片会依次揭开；已经在视口内的不会重播（滚动映射，没有时长）。
        </p>
      </section>

      {/* ── A2 ─────────────────────────────────────────────────── */}
      <section className="ml-demo">
        <h2>A2 · 图片占位（blur-up）对照</h2>
        <p>
          左右是同一张图、同一时刻。差别只在「加载中用户看到什么」。左＝现状（
          <code>placeholder=&quot;blur&quot;</code> 全站 0 命中 → 空白 → 图片硬出现）；
          右＝候选（先给模糊占位，加载完过渡到清晰）。
        </p>
        <ul className="ml-meta">
          <li className="ok">补缺口：无占位 → 图片硬出现，属 design.md 反对的视觉抖动</li>
          <li>成本：低—中 · 需给 next/image 显式 blurDataURL（字符串路径不会自动生成）</li>
          <li className="no">已否：骨架屏 shimmer（静态导出站无异步加载面）</li>
        </ul>
        <div className="ml-compare">
          <div>
            <div
              className="ml-shot"
              data-mode="current"
              data-state={loaded ? "loaded" : "loading"}
            >
              <Image src={BLUR_SRC} alt="" fill sizes="240px" />
            </div>
            <p className="ml-caption">现状：加载中是一片空白</p>
          </div>
          <div>
            <div className="ml-shot" data-mode="blur" data-state={loaded ? "loaded" : "loading"}>
              <Image src={BLUR_SRC} alt="" fill sizes="240px" />
            </div>
            <p className="ml-caption">候选：加载中是模糊占位 → 过渡到清晰</p>
          </div>
        </div>
        <p className="ml-actions">
          <button className="button secondary" type="button" onClick={replay}>
            重新播放加载过程
          </button>
        </p>
      </section>

      {/* ── A3 ─────────────────────────────────────────────────── */}
      <section className="ml-demo">
        <h2>A3 · 侧栏 TOC 当前项指示器</h2>
        <p>
          点下面任意一项。现状是只有文字变色（<code>aria-current=&quot;location&quot;</code>）；
          候选让一个 2px 的 <code>--accent</code> 细条滑过去。这是状态指示，不是装饰。
          <strong>优先级最低</strong> —— 它和已有的阅读进度条都在回答「我在哪」。
        </p>
        <ul className="ml-meta">
          <li>成本：中 · 用 framer-motion 的 layoutId 最省</li>
          <li>注意：与现有阅读进度条功能部分重叠，建议排在 A1/A2 之后</li>
        </ul>
        <nav className="ml-toc" aria-label="TOC 指示器演示">
          {TOC_ITEMS.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveId(item.id)}
              >
                {isActive ? (
                  <motion.span
                    className="ml-toc-ind"
                    layoutId="ml-toc-indicator"
                    transition={
                      noMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                ) : null}
                {item.label}
              </button>
            );
          })}
        </nav>
      </section>

      <section className="ml-demo">
        <h2>被拒绝的，也放在这里</h2>
        <p>
          完整拒绝名单（含 rareui 剩余 20 个组件逐条判定）在文档里。这里只贴最容易「看着想加」的几个，
          免得下次又绕回来：
        </p>
        <ul className="ml-meta">
          <li className="no">rareui scroll-progress —— 本站已有 article-progress</li>
          <li className="no">rareui gravity-letters —— 687 行物理引擎，Read 面纯装饰</li>
          <li className="no">rareui code-block —— 已有 shiki + 复制按钮</li>
          <li className="no">View Transitions —— PageTransitionWrapper 已在 layout 里</li>
          <li className="no">打字机 / 光标闪烁 —— 与窄体大写标签的刻意语汇冲突</li>
          <li className="no">全站视差 —— hero 已有 lens，Read 面拖累阅读</li>
        </ul>
      </section>
    </div>
  );
}
