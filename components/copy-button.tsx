"use client";

import { useEffect, useRef, useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState("复制");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      className="code-copy-btn"
      aria-live="polite"
      onClick={async () => {
        clearTimeout(timer.current);
        try {
          await navigator.clipboard.writeText(text);
          setStatus("已复制");
        } catch {
          setStatus("复制失败，请手动选择");
        }
        timer.current = setTimeout(() => setStatus("复制"), 3000);
      }}
    >
      {status}
    </button>
  );
}
