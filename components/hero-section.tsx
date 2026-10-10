"use client";

import { motion } from "framer-motion";

import type { ReactNode } from "react";

const staggerContainer = {
  hidden: {},
  show: { transition: { delayChildren: 0.1, staggerChildren: 0.1 } },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 0.61, 0.36, 1] },
  },
} as const;

const panelSlide = {
  hidden: { opacity: 0, x: 26 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.62,
      ease: [0.22, 0.61, 0.36, 1],
      delay: 0.28,
    },
  },
} as const;

export function HeroSection({
  signature,
  copy,
  panel,
}: {
  signature: "proof-card";
  copy: ReactNode;
  panel: ReactNode;
}) {
  return (
    <section
      className={`hero-section hero-section--${signature}`}
      aria-labelledby="home-hero-title"
    >
      <div className="hero-grid-field" aria-hidden="true" />
      <motion.div
        className="hero-copy"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <span className="hero-kicker">COYA / KNOWLEDGE FIELD</span>
        {copy}
      </motion.div>

      <motion.div
        className="hero-panel"
        aria-label="Content system overview"
        variants={panelSlide}
        initial="hidden"
        animate="show"
      >
        <div className="hero-panel-label">
          <span>FEATURED PROOF</span>
          <span className="hero-panel-status">SEE THE WORK</span>
        </div>
        {panel}
      </motion.div>

    </section>
  );
}

export function HeroItem({ children }: { children: ReactNode }) {
  return <motion.div variants={fadeUpItem}>{children}</motion.div>;
}
