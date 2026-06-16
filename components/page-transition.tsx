"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
} as const;

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeUp}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
