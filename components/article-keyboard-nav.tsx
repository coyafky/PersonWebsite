"use client";

import { useKeyboardNav } from "@/lib/keyboard-nav";

export function ArticleKeyboardNav({ prevUrl, nextUrl }: { prevUrl?: string; nextUrl?: string }) {
  useKeyboardNav({ prevUrl, nextUrl });
  return null;
}
