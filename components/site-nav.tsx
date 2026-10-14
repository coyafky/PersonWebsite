"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { triggerSearch } from "@/lib/search-events";

const navItems = [
  { href: "/projects", label: "项目案例" },
  { href: "/about", label: "关于我" },
  { href: "/blog", label: "写作" },
  { href: "/notes", label: "笔记" },
  { href: "/gallery", label: "视觉" },
  { href: "/skills", label: "SKILL" },
  { href: "/tools", label: "工具" },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <>
      <a className="skip-link" href="#main-content">
        跳转到正文
      </a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Coya 冯科雅，首页">
          <Image src="/site-mark.svg" alt="" width={32} height={32} priority />
          <span>
            COYA<span className="brand-divider"> / </span>
            <span className="brand-descriptor">AI & BUSINESS</span>
          </span>
        </Link>
        <nav className="nav-links" aria-label="主导航">
          {navItems.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                href={href}
                key={href}
                className={active ? "active" : undefined}
                aria-current={
                  pathname === href ? "page" : active ? "location" : undefined
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="site-actions">
          <button
            className="search-trigger"
            onClick={triggerSearch}
            aria-label="搜索全站（⌘K 或 Ctrl+K）"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 5 5" />
            </svg>
          </button>
          <a className="nav-contact" href="mailto:coya20020824@gmail.com">
            联系我 <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
    </>
  );
}
