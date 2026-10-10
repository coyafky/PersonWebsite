"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ReactNode } from "react";
import { homeMotion } from "@/lib/home-motion";

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: homeMotion.entrance.stagger,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: homeMotion.entrance.duration,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
} as const;

const panelSlide = {
  hidden: { opacity: 0, x: 26 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: homeMotion.panel.duration,
      ease: [0.22, 0.61, 0.36, 1],
      delay: homeMotion.panel.delay,
    },
  },
} as const;

export function HeroSection({
  signature,
  copy,
  panel,
}: {
  signature: "workflow-panel";
  copy: ReactNode;
  panel: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={`hero-section hero-section--${signature}`}
      aria-labelledby="home-hero-title"
    >
      <div className="hero-grid-field" aria-hidden="true" />
      <motion.div
        className="hero-copy"
        variants={staggerContainer}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
      >
        <span className="hero-kicker">COYA / KNOWLEDGE FIELD</span>
        {copy}
      </motion.div>

      <motion.div
        className="hero-panel"
        aria-label="Content system overview"
        variants={panelSlide}
        initial={reduceMotion ? false : "hidden"}
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
