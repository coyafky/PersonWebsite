"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { onOpenSearch } from "@/lib/search-events";

type SearchResult = {
  title: string;
  summary: string;
  url: string;
  date: string;
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 客户端挂载检测：避免 SSR/CSR 不一致，并兼容 react-hooks/set-state-in-effect 规则。
  // 用 useSyncExternalStore 替代 useEffect+setState 模式（同 site-nav）。
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as { results: SearchResult[] };
      setResults(data.results);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 关闭时清空 query / results — 用 callback 替代 effect 中的 setState，
  // 规避 react-hooks/set-state-in-effect 规则。
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    onOpenSearch(() => setOpen(true));
  }, []);

  useEffect(() => {
    if (open && mounted) {
      inputRef.current?.focus();
    }
  }, [open, mounted]);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <>
      {open ? (
        <div
          className="search-overlay"
          onClick={close}
          style={{
            transitionDuration: "var(--dropdown-open-dur)",
            transitionTimingFunction: "var(--dropdown-ease)",
          }}
        >
          <div
            className="search-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{
              transformOrigin: "top center",
              transitionDuration: "var(--dropdown-open-dur)",
              transitionTimingFunction: "var(--dropdown-ease)",
            }}
          >
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {loading ? <div className="search-loading">Searching...</div> : null}
            {results.length > 0 ? (
              <ul className="search-results">
                {results.map((r) => (
                  <li key={r.url}>
                    <Link href={r.url} onClick={close}>
                      <span className="search-result-title">{r.title}</span>
                      <span className="search-result-excerpt">{r.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            {!loading && query && results.length === 0 ? (
              <div className="search-empty">No results found.</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
