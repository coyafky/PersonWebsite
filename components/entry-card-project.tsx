import Image from "next/image";
import Link from "next/link";

type EntryCardProjectProps = {
  href: string;
  title: string;
  summary: string;
  stack: string[];
  impact: string[];
  featured: boolean;
  period?: string;
  cover?: string;
};

/**
 * Project case card: optional cover, clickable title/summary/impact block,
 * stack chips outside the anchor (avoid nested <a>). Server Component.
 */
export function EntryCardProject({
  href,
  title,
  summary,
  stack,
  impact,
  featured,
  period,
  cover,
}: EntryCardProjectProps) {
  const articleClassName = featured
    ? "entry-card-project entry-card-project-featured"
    : "entry-card-project";

  return (
    <article className={articleClassName}>
      {cover ? (
        <div className="entry-card-project-cover">
          <Image
            src={cover}
            alt=""
            width={400}
            height={240}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      ) : null}
      <Link href={href} className="entry-card-project-link">
        <header className="entry-card-project-header">
          <h2 className="entry-card-project-title">{title}</h2>
          {period ? (
            <time className="entry-card-project-period">{period}</time>
          ) : null}
        </header>
        <p className="entry-card-project-summary">{summary}</p>
        {impact.length > 0 ? (
          <ul className="entry-card-project-impact">
            {impact.slice(0, 2).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        ) : null}
      </Link>
      {stack.length > 0 ? (
        <footer className="entry-card-project-stack" aria-label="Tech stack">
          {stack.map((tech) => (
            <span key={tech} className="entry-card-project-stack-item">
              {tech}
            </span>
          ))}
        </footer>
      ) : null}
    </article>
  );
}
