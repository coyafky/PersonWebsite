"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className={`code-copy-btn${copied ? " success-check show" : ""}`}
      onClick={handleCopy}
      aria-label="Copy code"
      style={{
        transitionDuration: "var(--success-check-dur)",
        transitionTimingFunction: "var(--success-check-ease)",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}
