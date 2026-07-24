"use client";

import Image from "next/image";
import Link from "next/link";
import { triggerSearch } from "@/lib/search-events";
import {
  Icons0Blog,
  Icons0Book,
  Icons0Calendar,
  Icons0Music,
  Icons0Notebook,
  Icons0Portfolio,
  Icons0Profile,
  Icons0Radar,
} from "@/components/icons0";

const navItems = [
  { href: "/blog", icon: Icons0Blog, label: "Blog" },
  { href: "/ai-tracker", icon: Icons0Radar, label: "AI Tracker" },
  { href: "/weekly", icon: Icons0Calendar, label: "Weekly" },
  { href: "/learning", icon: Icons0Notebook, label: "Learning" },
  { href: "/book-list", icon: Icons0Book, label: "Book List" },
  { href: "/projects", icon: Icons0Portfolio, label: "Projects" },
  { href: "/music", icon: Icons0Music, label: "Music" },
  { href: "/about", icon: Icons0Profile, label: "About" },
];

export function SiteNav() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Personal Website home">
        <Image src="/site-mark.svg" alt="" width={34} height={34} priority />
        <span>Personal Website</span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link href={href} key={href}>
            <Icon className="nav-icon" />
            {label}
          </Link>
        ))}
      </nav>
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
    </header>
  );
}
