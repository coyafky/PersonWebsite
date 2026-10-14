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
  const [failed, setFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setLoading(false);
    setFailed(false);
  }, []);

  useEffect(() => onOpenSearch(() => setOpen(true)), []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        close();
        return;
      }
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (open) close();
        else setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
        dialog.close();
      };
    }
    dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open || !query.trim()) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Search unavailable");
        const data = (await response.json()) as { results: SearchResult[] };
        if (!controller.signal.aborted) setResults(data.results);
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  return (
    <dialog
      ref={dialogRef}
      className="search-overlay"
      aria-labelledby="search-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="search-dialog">
        <div className="search-heading">
          <h2 id="search-title">搜索全站</h2>
          <button type="button" onClick={close} aria-label="关闭搜索">
            关闭 <kbd>Esc</kbd>
          </button>
        </div>
        <input
          autoFocus
          className="search-input"
          type="search"
          placeholder="搜索项目、文章与笔记…"
          aria-label="搜索关键词"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setResults([]);
            setFailed(false);
            setLoading(Boolean(event.target.value.trim()));
          }}
        />
        <div role="status" aria-live="polite">
          {loading ? (
            <p className="search-loading">正在搜索…</p>
          ) : failed ? (
            <p className="search-empty">暂时无法搜索，请稍后修改关键词重试。</p>
          ) : query.trim() && results.length === 0 ? (
            <p className="search-empty">没有找到相关内容，试试其他关键词。</p>
          ) : !query.trim() ? (
            <p className="search-empty">输入关键词，查找项目与实践记录。</p>
          ) : (
            <p className="search-result-count">找到 {results.length} 条结果</p>
          )}
        </div>
        {results.length > 0 ? (
          <ul className="search-results">
            {results.map((result) => (
              <li key={result.url}>
                <Link href={result.url} onClick={close}>
                  <span className="search-result-title">{result.title}</span>
                  <span className="search-result-excerpt">
                    {result.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </dialog>
  );
}
