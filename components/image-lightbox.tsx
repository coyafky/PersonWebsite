"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LightboxProps = {
  src: string;
  alt: string;
  children: React.ReactNode;
};

export function ImageLightbox({ src, alt, children }: LightboxProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <span className="lightbox-trigger" onClick={() => setOpen(true)}>
        {children}
      </span>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="lightbox-overlay"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              transitionDuration: "var(--modal-open-dur)",
              transitionTimingFunction: "var(--modal-ease)",
            }}
          >
            <motion.img
              src={src}
              alt={alt}
              className="lightbox-image"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
              style={{
                transform: "scale(var(--modal-scale))",
                transitionDuration: "var(--modal-open-dur)",
                transitionTimingFunction: "var(--modal-ease)",
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
