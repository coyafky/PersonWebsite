import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { Icons0ArrowUpRight } from "@/components/icons0";

type ContentCardProps = {
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  summary: string;
  meta?: string;
  tags?: string[];
};

export function ContentCard({ href, icon: Icon, title, summary, meta, tags = [] }: ContentCardProps) {
  return (
    <Link className="content-card" href={href}>
      {Icon ? (
        <span className="icon-shell">
          <Icon />
        </span>
      ) : null}
      {meta ? <span className="card-meta">{meta}</span> : null}
      <h3>{title}</h3>
      <p>{summary}</p>
      {tags.length > 0 ? (
        <ul className="tag-list" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
      <span className="card-link">
        Read
        <Icons0ArrowUpRight />
      </span>
    </Link>
  );
}
