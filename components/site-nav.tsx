"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { triggerSearch } from "@/lib/search-events";
import {
  Icons0Blog,
  Icons0Image,
  Icons0Notebook,
  Icons0Portfolio,
  Icons0Profile,
  Icons0Tools,
} from "@/components/icons0";

const navItems = [
  { href: "/blog", icon: Icons0Blog, label: "Blog" },
  // Diary 与 Weekly 已下架（内容归档，旧路由 308 → /blog）
  // 内容模块三合一：原 /learning、/book-list、/course-list → /notes
  { href: "/notes", icon: Icons0Notebook, label: "Notes" },
  { href: "/projects", icon: Icons0Portfolio, label: "Work" },
  { href: "/gallery", icon: Icons0Image, label: "Gallery" },
  { href: "/tools", icon: Icons0Tools, label: "Tools" },
  { href: "/about", icon: Icons0Profile, label: "About" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Personal Website home">
        <Image src="/site-mark.svg" alt="" width={34} height={34} priority />
        <span>COYA / FIELD</span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            href={href}
            key={href}
            className={pathname === href || pathname.startsWith(`${href}/`) ? "active" : undefined}
            aria-current={pathname === href ? "page" : undefined}
          >
            <Icon className="nav-icon" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="site-actions">
        <Link href="/timeline" className="site-nav-icon-link" aria-label="Timeline archive">
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </Link>
        <button
          className="search-trigger"
          onClick={triggerSearch}
          aria-label="Search (Cmd+K)"
        >
          <span>⌘K</span>
        </button>
      </div>
    </header>
  );
}
