"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { triggerSearch } from "@/lib/search-events";

type KeyboardNavProps = {
  prevUrl?: string;
  nextUrl?: string;
};

export function useKeyboardNav({ prevUrl, nextUrl }: KeyboardNavProps = {}) {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        triggerSearch();
        return;
      }

      if (e.key === "j" && nextUrl) {
        router.push(nextUrl);
      }
      if (e.key === "k" && prevUrl) {
        router.push(prevUrl);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router, prevUrl, nextUrl]);
}
