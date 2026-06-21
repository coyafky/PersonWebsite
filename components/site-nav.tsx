"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { triggerSearch } from "@/lib/search-events";
import {
  Icons0Blog,
  Icons0Calendar,
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
  { href: "/projects", icon: Icons0Portfolio, label: "Projects" },
  { href: "/about", icon: Icons0Profile, label: "About" },
];

export function SiteNav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <motion.header
      className="site-header"
      animate={{
        background: scrolled
          ? "color-mix(in srgb, var(--background) 96%, transparent)"
          : "color-mix(in srgb, var(--background) 88%, transparent)",
        boxShadow: scrolled
          ? "0 4px 24px rgb(42 45 51 / 0.06)"
          : "0 0 0 transparent",
      }}
      transition={{ duration: 0.3 }}
    >
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
      {mounted ? (
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          suppressHydrationWarning
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      ) : null}
      <button
        className="search-trigger"
        onClick={triggerSearch}
        aria-label="Search (Cmd+K)"
      >
        <span>⌘K</span>
      </button>
    </motion.header>
  );
}
