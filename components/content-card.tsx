"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icons0ArrowUpRight } from "@/components/icons0";

type ContentCardProps = {
  href: string;
  icon?: ReactNode;
  title: string;
  summary: string;
  meta?: string;
  tags?: string[];
};

export function ContentCard({
  href,
  icon,
  title,
  summary,
  meta,
  tags = [],
}: ContentCardProps) {
  return (
    <motion.a
      className="content-card"
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {icon ? <span className="icon-shell">{icon}</span> : null}
      {meta ? <span className="card-meta">{meta}</span> : null}
      <h3>{title}</h3>
      <p>{summary}</p>
      {tags.length > 0 ? (
        <ul className="tag-list" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/tags/${encodeURIComponent(tag)}`}
                onClick={(e) => e.stopPropagation()}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      <span className="card-link">
        Read
        <Icons0ArrowUpRight />
      </span>
    </motion.a>
  );
}
