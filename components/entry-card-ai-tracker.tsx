import Link from "next/link";

export type AiTrackerSignal = 1 | 2 | 3;

export type SignalStrength = "strong" | "mid" | "weak";

type EntryCardAiTrackerProps = {
  href: string;
  title: string;
  summary: string;
  signal: AiTrackerSignal;
  signalLabel?: string;
  date: string;
  tags?: string[];
};

/**
 * Map the schema's numeric `signal` (1|2|3) onto the three visual strengths
 * (strong|mid|weak) used by the signal-stream CSS. 1 = strong, 2 = mid, 3 = weak.
 */
function signalStrength(signal: AiTrackerSignal): SignalStrength {
  if (signal === 1) return "strong";
  if (signal === 3) return "weak";
  return "mid";
}

function strengthLabel(strength: SignalStrength): string {
  return strength === "strong" ? "STRONG" : strength === "mid" ? "MID" : "WEAK";
}

/**
 * Signal-stream entry card for the AI Tracker column. Strength badge sits
 * beside the date in a single meta row; title + summary form the main
 * clickable area; tags live outside the anchor to avoid nested <a>. Server
 * Component.
 */
export function EntryCardAiTracker({
  href,
  title,
  summary,
  signal,
  signalLabel,
  date,
  tags = [],
}: EntryCardAiTrackerProps) {
  const strength = signalStrength(signal);
  const badgeText = signalLabel
    ? `${strengthLabel(strength)} · ${signalLabel}`
    : strengthLabel(strength);

  return (
    <article className={`entry-card-ai-tracker entry-card-ai-tracker-${strength}`}>
      <div className="entry-card-ai-tracker-meta">
        <span
          className={`entry-card-ai-tracker-signal entry-card-ai-tracker-signal-${strength}`}
        >
          {badgeText}
        </span>
        <time className="entry-card-ai-tracker-date" dateTime={date}>
          {date}
        </time>
      </div>
      <Link href={href} className="entry-card-ai-tracker-link">
        <h2 className="entry-card-ai-tracker-title">{title}</h2>
        <p className="entry-card-ai-tracker-summary">{summary}</p>
      </Link>
      {tags.length > 0 ? (
        <ul className="entry-card-ai-tracker-tags" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag}>
              <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
