"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-shell narrow" style={{ textAlign: "center", paddingTop: "120px" }}>
      <h1 style={{ fontSize: "36px", margin: "0 0 16px" }}>Something went wrong</h1>
      <p style={{ fontSize: "16px", marginBottom: "32px", color: "var(--muted)" }}>
        An unexpected error occurred. Please try again.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button className="button primary" onClick={reset}>
          Try again
        </button>
        <Link className="button secondary" href="/">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
