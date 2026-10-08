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
  /** 项目真实阶段（原型 / 试用中 / 日常在用…）。可选，不传/为空则不显示。 */
  stage?: string;
  /** 「实现细节」文章数。可选，不传或 ≤0 则不显示。 */
  detailsCount?: number;
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
  stage,
  detailsCount,
}: EntryCardProjectProps) {
  const articleClassName = featured
    ? "entry-card-project entry-card-project-featured"
    : "entry-card-project";
  const hasMeta = Boolean(stage || period);

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
          {hasMeta ? (
            <div className="entry-card-project-meta">
              {stage ? (
                <span className="entry-card-project-stage">{stage}</span>
              ) : null}
              {period ? (
                <time className="entry-card-project-period">{period}</time>
              ) : null}
            </div>
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
        {detailsCount !== undefined && detailsCount > 0 ? (
          <p className="entry-card-project-details">{detailsCount} 篇实现细节</p>
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
