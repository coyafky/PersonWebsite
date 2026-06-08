import { ArrowRight } from "lucide-react";
import Link from "next/link";

type ContentCardProps = {
  href: string;
  title: string;
  summary: string;
  meta?: string;
  tags?: string[];
};

export function ContentCard({ href, title, summary, meta, tags = [] }: ContentCardProps) {
  return (
    <Link className="content-card" href={href}>
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
        <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
      </span>
    </Link>
  );
}
