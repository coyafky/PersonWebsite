"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] },
  },
} as const;

const panelSlide = {
  hidden: { opacity: 0, x: 32 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay: 0.35 },
  },
} as const;

export function HeroSection({
  copy,
  panel,
}: {
  copy: ReactNode;
  panel: ReactNode;
}) {
  return (
    <section className="hero-section">
      <motion.div
        className="hero-copy"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {copy}
      </motion.div>

      <motion.div
        className="hero-panel"
        aria-label="Content workflow preview"
        variants={panelSlide}
        initial="hidden"
        animate="show"
      >
        {panel}
      </motion.div>
    </section>
  );
}

export function HeroItem({ children }: { children: ReactNode }) {
  return <motion.div variants={fadeUpItem}>{children}</motion.div>;
}
