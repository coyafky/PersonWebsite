"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    onOpenSearch(() => setOpen(true));
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <>
      {open ? (
        <div className="search-overlay" onClick={() => setOpen(false)}>
          <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
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
                    <Link href={r.url} onClick={() => setOpen(false)}>
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
