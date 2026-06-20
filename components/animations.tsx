"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { useMemo, useRef, type ElementType, type ReactNode } from "react";

// ── shared cubic-bezier easing (must be a tuple for framer-motion types) ──
const easeOut: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

// ── motion element lookup table ────────────────────────────────────────
// Keep at module level so references stay stable across renders.
// `motion.create(Tag)` inside render would create a new component on every
// render, remounting the subtree and resetting state.
const MOTION_ELEMENTS = {
  div: motion.div,
  span: motion.span,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  nav: motion.nav,
  main: motion.main,
  aside: motion.aside,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  p: motion.p,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
} as const;

type SupportedTag = keyof typeof MOTION_ELEMENTS;

function resolveMotionTag(tag: ElementType) {
  if (typeof tag === "string" && tag in MOTION_ELEMENTS) {
    return MOTION_ELEMENTS[tag as SupportedTag];
  }
  return motion.div;
}

// ── variants catalogue ────────────────────────────────────────────────

export const fadeUp: Variants = {
  off: { opacity: 0, y: 24 },
  on: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  off: { opacity: 0 },
  on: { opacity: 1, transition: { duration: 0.45 } },
};

export const slideRight: Variants = {
  off: { opacity: 0, x: -24 },
  on: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOut } },
};

export const slideLeft: Variants = {
  off: { opacity: 0, x: 24 },
  on: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOut } },
};

export const scaleIn: Variants = {
  off: { opacity: 0, scale: 0.94 },
  on: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeOut } },
};

// stagger children with a delay between each
export const stagger = (delay = 0.1): Variants => ({
  on: {
    transition: { staggerChildren: delay },
  },
});

// ═══════════════════════════════════════════════════════════════════════
//  Reusable wrapper components
// ═══════════════════════════════════════════════════════════════════════

/**
 * Wraps children in AnimatePresence for page / route transitions.
 * Key must change between routes — pass pathname.
 */
export function PageTransition({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial="off"
        animate="on"
        exit="off"
        variants={fadeUp}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Fades + slides up when the element scrolls into view.
 * Use `once` to animate only the first time.
 */
export function RevealOnScroll({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  once = true,
  ...props
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  once?: boolean;
} & HTMLMotionProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-64px 0px -64px 0px" });

  // resolveMotionTag returns the same `motion.X` reference for the same
  // `Tag` string, so memoizing by `Tag` keeps the component stable across
  // renders (no remount, no state reset).
  // eslint-disable-next-line react-hooks/static-components
  const Comp = useMemo(() => resolveMotionTag(Tag), [Tag]);

  return (
    <Comp
      ref={ref}
      className={className}
      initial="off"
      animate={inView ? "on" : "off"}
      variants={{
        off: { opacity: 0, y: 28 },
        on: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: easeOut, delay },
        },
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}

/**
 * Stagger container — animates direct children one by one.
 */
export function StaggerContainer({
  children,
  className,
  delay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="off"
      animate={inView ? "on" : "off"}
      variants={stagger(delay)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Single staggered child — must be a direct child of StaggerContainer.
 */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
