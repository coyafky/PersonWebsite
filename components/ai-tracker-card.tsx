import Link from "next/link";

import type { AiTrackerSourceType } from "@/lib/content/schemas";

export type AiTrackerCardData = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  sourceType: AiTrackerSourceType;
  signal: 1 | 2 | 3;
  signalLabel?: string;
  topics: string[];
  tags: string[];
  sourceUrl?: string;
  sourceTitle?: string;
  activeTopics?: string[];
};

type AiTrackerCardProps = AiTrackerCardData;

export function AiTrackerCard({
  slug,
  title,
  date,
  summary,
  sourceType,
  signal,
  signalLabel,
  topics,
  tags,
  sourceUrl,
  sourceTitle,
  activeTopics,
}: AiTrackerCardProps) {
  const activeSet = new Set(activeTopics ?? []);
  return (
    <article className="ai-tracker-card">
      <div className="ai-tracker-card__meta-row">
        <span className={`signal-badge signal-${signal}`}>
          {signalLabel ? `${signal} · ${signalLabel}` : `signal ${signal}`}
        </span>
        <div className="ai-tracker-card__meta-row__right">
          <span className="source-type-pill">{sourceType}</span>
          {sourceUrl ? (
            <a className="external-link" href={sourceUrl} target="_blank" rel="noreferrer">
              {sourceTitle ? `${sourceTitle} ↗` : "Source ↗"}
            </a>
          ) : null}
        </div>
      </div>
      <Link className="ai-tracker-card__title-link" href={`/ai-tracker/${slug}`}>
        <span className="card-meta">{date}</span>
        <h3>{title}</h3>
      </Link>
      <p>{summary}</p>
      {topics.length > 0 ? (
        <ul className="topic-chips" aria-label="Topics">
          {topics.map((topic) => (
            <li key={topic}>
              <Link
                className={`topic-chip${activeSet.has(topic) ? " active" : ""}`}
                href={`/ai-tracker?topic=${encodeURIComponent(topic)}`}
              >
                {topic}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {tags.length > 0 ? (
        <ul className="tag-list" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
