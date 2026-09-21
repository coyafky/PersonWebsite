"use client";

import { motion } from "framer-motion";

import { FluidOrb } from "./fluid-orb";
import {
  useEffect,
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";

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

type Point = { x: number; y: number };

export function HeroSection({
  copy,
  panel,
}: {
  copy: ReactNode;
  panel: ReactNode;
}) {
  const frameRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const targetRef = useRef<Point>({ x: 0, y: 0 });
  const positionRef = useRef<Point>({ x: 0, y: 0 });
  const radiusRef = useRef(0);
  const targetRadiusRef = useRef(0);
  const isActiveRef = useRef(false);
  const canAnimateRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updatePreference = () => {
      canAnimateRef.current = finePointer.matches && !reducedMotion.matches;
      if (!canAnimateRef.current) {
        lensRef.current?.style.setProperty("--lens-radius", "0px");
        copyRef.current?.style.setProperty("--hero-x", "0px");
        copyRef.current?.style.setProperty("--hero-y", "0px");
        copyRef.current?.style.setProperty("--hero-rx", "0deg");
        copyRef.current?.style.setProperty("--hero-ry", "0deg");
      }
    };

    updatePreference();
    reducedMotion.addEventListener("change", updatePreference);
    finePointer.addEventListener("change", updatePreference);

    return () => {
      reducedMotion.removeEventListener("change", updatePreference);
      finePointer.removeEventListener("change", updatePreference);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const draw = () => {
    const lens = lensRef.current;
    if (!lens) {
      animationRef.current = null;
      return;
    }

    const position = positionRef.current;
    const target = targetRef.current;
    position.x += (target.x - position.x) * 0.14;
    position.y += (target.y - position.y) * 0.14;
    radiusRef.current += (targetRadiusRef.current - radiusRef.current) * 0.18;

    lens.style.setProperty("--lens-x", `${position.x}px`);
    lens.style.setProperty("--lens-y", `${position.y}px`);
    lens.style.setProperty("--lens-radius", `${Math.max(radiusRef.current, 0)}px`);

    const isMoving =
      Math.abs(target.x - position.x) > 0.15 ||
      Math.abs(target.y - position.y) > 0.15 ||
      Math.abs(targetRadiusRef.current - radiusRef.current) > 0.15;

    if (isMoving) {
      animationRef.current = requestAnimationFrame(draw);
    } else {
      animationRef.current = null;
    }
  };

  const startDrawing = () => {
    if (animationRef.current === null) {
      animationRef.current = requestAnimationFrame(draw);
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || !canAnimateRef.current) return;

    const frame = frameRef.current;
    const copyElement = copyRef.current;
    if (!frame || !copyElement) return;

    const bounds = frame.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const normalizedX = Math.max(-1, Math.min(1, (x / bounds.width - 0.5) * 2));
    const normalizedY = Math.max(-1, Math.min(1, (y / bounds.height - 0.5) * 2));
    const radius = Math.min(190, Math.max(118, bounds.width * 0.14));

    if (!isActiveRef.current) {
      positionRef.current = { x, y };
    }

    isActiveRef.current = true;
    targetRef.current = { x, y };
    targetRadiusRef.current = radius;
    copyElement.style.setProperty("--hero-x", `${normalizedX * 8}px`);
    copyElement.style.setProperty("--hero-y", `${normalizedY * 6}px`);
    copyElement.style.setProperty("--hero-rx", `${normalizedY * -2.4}deg`);
    copyElement.style.setProperty("--hero-ry", `${normalizedX * 3.4}deg`);
    startDrawing();
  };

  const handlePointerLeave = () => {
    isActiveRef.current = false;
    targetRadiusRef.current = 0;
    copyRef.current?.style.setProperty("--hero-x", "0px");
    copyRef.current?.style.setProperty("--hero-y", "0px");
    copyRef.current?.style.setProperty("--hero-rx", "0deg");
    copyRef.current?.style.setProperty("--hero-ry", "0deg");
    startDrawing();
  };

  return (
    <section
      className="hero-section"
      ref={frameRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-labelledby="home-hero-title"
    >
      <div className="hero-grid-field" aria-hidden="true" />
      <motion.div
        className="hero-copy"
        ref={copyRef}
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
          <span>FIELD INDEX</span>
          <span className="hero-panel-live">
            <FluidOrb aria-hidden="true" size={22} />
            LIVE / 2026
          </span>
        </div>
        {panel}
      </motion.div>

      <div className="hero-lens" ref={lensRef} aria-hidden="true">
        <div className="hero-lens-grid" />
        <div className="hero-lens-copy">
          <span>FROM NOTES</span>
          <strong>TO EVIDENCE</strong>
          <small>把记录连接成能力，把能力放进真实工作。</small>
        </div>
      </div>

      <p className="hero-motion-hint" aria-hidden="true">
        MOVE TO REFRAME <span>↘</span>
      </p>
    </section>
  );
}

export function HeroItem({ children }: { children: ReactNode }) {
  return <motion.div variants={fadeUpItem}>{children}</motion.div>;
}
