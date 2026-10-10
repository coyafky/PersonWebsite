"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getWorkflowMotionSequence } from "@/lib/home-motion";
import {
  Icons0Notebook,
  Icons0Portfolio,
  Icons0Tools,
} from "@/components/icons0";

const workflowItems = [
  { key: "input", icon: <Icons0Notebook />, title: "Notes", label: "capture" },
  { key: "build", icon: <Icons0Tools />, title: "AI / Tools", label: "transform" },
  { key: "output", icon: <Icons0Portfolio />, title: "Projects", label: "proof" },
] as const;

export function HomeWorkflowPanel() {
  const sequence = getWorkflowMotionSequence();
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="home-workflow-panel"
      role="group"
      aria-label="Notes to proof workflow"
    >
      {workflowItems.map((item, index) => {
        const step = sequence[index];

        return (
          <motion.div
            className={`panel-row${index === 0 ? " strong" : ""}`}
            key={item.key}
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: step.delayMs / 1000,
              duration: step.durationMs / 1000,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            {item.icon}
            <span>{item.title}</span>
            <span>{item.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
