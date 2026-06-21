import Link from "next/link";

type EntryCardBlogProps = {
  href: string;
  title: string;
  summary: string;
  date: string;
  tags?: string[];
};

/**
 * Magazine-style blog entry card: title + summary + date form a single
 * clickable area; the tag list lives outside the anchor to avoid nested
 * <a> elements. Server Component.
 */
export function EntryCardBlog({
  href,
  title,
  summary,
  date,
  tags = [],
}: EntryCardBlogProps) {
  return (
    <article className="entry-card-blog">
      <Link href={href} className="entry-card-blog-link">
        <header className="entry-card-blog-header">
          <time className="entry-card-blog-date" dateTime={date}>
            {date}
          </time>
          <h2 className="entry-card-blog-title">{title}</h2>
        </header>
        <p className="entry-card-blog-summary">{summary}</p>
      </Link>
      {tags.length > 0 ? (
        <ul className="entry-card-blog-tags tag-list" aria-label="Tags">
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
