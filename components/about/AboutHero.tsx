"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * About 的 hero：三行标题在滚动时以不同速度上浮（视差），并逐行入场。
 *
 * 目的不是"炫"，是打断"从上到下码模块"的读感 —— 一屏之内先让人看到
 * 这是一个"人"的页面，而不是一份排好版的经历清单。
 *
 * 动效全部用已装的 framer-motion（本就在全站加载），没有引入新依赖。
 * prefers-reduced-motion 下自动退化为静止 + 直接显示的静态排版。
 */

const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

const LINES = [
  "我把 AI 接进真实业务，",
  "让流程更清晰，",
  "结果可验证。",
];

export function AboutHero({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // 三行不同幅度 → 视差。用同一组 useTransform，钩子数量恒定。
  const y0 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -24]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -64]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -104]);
  const ys = [y0, y1, y2];

  const fade = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0.2]);
  const lift = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  return (
    <header className="page-header about-hero about-hero--motion" ref={ref}>
      <motion.span
        className="about-kicker"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        ABOUT / COYA FENG
      </motion.span>

      <motion.h1 style={{ opacity: fade }}>
        {LINES.map((line, index) => (
          <motion.span
            key={line}
            style={{ y: ys[index], display: "block" }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 * index, ease: EASE }}
          >
            {line}
          </motion.span>
        ))}
      </motion.h1>

      <motion.div style={{ y: lift, opacity: fade }}>{children}</motion.div>
    </header>
  );
}
