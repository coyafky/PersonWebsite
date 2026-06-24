"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Article header reveal — transitions-dev P18 (texts reveal).
 * IntersectionObserver triggers once on first view; direct children
 * stagger their blur+translateY entrance via inline animationDelay.
 *
 * Stripe Press override (S2):
 *   --text-reveal-stagger: 120ms
 *   --text-reveal-blur: 2px
 *   --text-reveal-ease: cubic-bezier(0.22, 0.61, 0.36, 1)
 *
 * prefers-reduced-motion is handled by the global S2 guard in globals.css.
 */
type ArticleHeaderRevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  staggerMs?: number;
  threshold?: number;
};

export function ArticleHeaderReveal({
  children,
  as: As = "header",
  className = "",
  staggerMs,
  threshold = 0.1,
}: ArticleHeaderRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Defer to next tick to avoid cascading render inside effect body.
      const t = window.setTimeout(() => setRevealed(true), 0);
      return () => window.clearTimeout(t);
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
            return;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const resolvedStagger =
    typeof staggerMs === "number"
      ? staggerMs
      : 120; // matches --text-reveal-stagger fallback (S2)

  const classNames = [
    "article-header-reveal",
    revealed ? "revealed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <As ref={ref as never} className={classNames}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        const props = child.props as { style?: React.CSSProperties };
        const existingStyle = props.style ?? {};
        const nextDelay = revealed ? i * resolvedStagger : 0;
        return cloneElement(child as React.ReactElement<{ style?: React.CSSProperties }>, {
          style: { ...existingStyle, animationDelay: `${nextDelay}ms` },
        });
      })}
    </As>
  );
}

/**
 * Article footer reveal — transitions-dev P3 (panel reveal).
 * IntersectionObserver triggers once on first view; whole container
 * fades + slides up + cross-blurs together.
 *
 * Stripe Press override (S2):
 *   --panel-reveal-open-dur: 700ms
 *   --panel-reveal-translate-y: 24px
 *   --panel-reveal-blur: 2px
 *   --panel-reveal-ease: cubic-bezier(0.22, 0.61, 0.36, 1)
 *
 * prefers-reduced-motion is handled by the global S2 guard in globals.css.
 */
type ArticleFooterRevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  threshold?: number;
};

export function ArticleFooterReveal({
  children,
  as: As = "footer",
  className = "",
  threshold = 0.15,
}: ArticleFooterRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Defer to next tick to avoid cascading render inside effect body.
      const t = window.setTimeout(() => setRevealed(true), 0);
      return () => window.clearTimeout(t);
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
            return;
          }
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const classNames = [
    "article-footer-reveal",
    revealed ? "revealed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <As ref={ref as never} className={classNames}>
      {children}
    </As>
  );
}
