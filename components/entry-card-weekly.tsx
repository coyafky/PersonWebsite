import Link from "next/link";

type EntryCardWeeklyProps = {
  href: string;
  week: string;
  title: string;
  highlights: string[];
  mood?: string;
};

/**
 * Timeline-style weekly entry card: a single clickable area containing the
 * week label, title, and 1-3 highlights. The mood line lives inside the
 * anchor; no nested <a>. The article itself is decorated as a timeline
 * node by the parent `.timeline` container. Server Component.
 */
export function EntryCardWeekly({
  href,
  week,
  title,
  highlights,
  mood,
}: EntryCardWeeklyProps) {
  return (
    <article className="entry-card-weekly timeline-node">
      <div className="entry-card-weekly-marker" aria-hidden="true" />
      <Link href={href} className="entry-card-weekly-link">
        <header className="entry-card-weekly-header">
          <time className="entry-card-weekly-week" dateTime={week}>
            {week}
          </time>
          <h2 className="entry-card-weekly-title">{title}</h2>
        </header>
        {highlights.length > 0 ? (
          <ul className="entry-card-weekly-highlights">
            {highlights.slice(0, 3).map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        ) : null}
        {mood ? <p className="entry-card-weekly-mood">Mood: {mood}</p> : null}
      </Link>
    </article>
  );
}
