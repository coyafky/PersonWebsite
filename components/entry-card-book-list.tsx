import Link from "next/link";

type EntryCardBookListProps = {
  href: string;
  title: string;
  author: string;
  genre: string;
  summary?: string;
  date?: string;
  tags?: string[];
};

/**
 * Book-list entry card: book title + author + genre form the main
 * clickable area; the optional summary and tags live below. Server
 * Component.
 */
export function EntryCardBookList({
  href,
  title,
  author,
  genre,
  summary,
  date,
  tags = [],
}: EntryCardBookListProps) {
  return (
    <article className="book-card">
      <Link href={href} className="book-card-link">
        <div className="book-card-meta">
          <span className="book-card-genre">{genre}</span>
          {date ? (
            <time className="book-card-date" dateTime={date}>
              {date}
            </time>
          ) : null}
        </div>
        <h3 className="book-card-title">{title}</h3>
        <p className="book-card-author">by {author}</p>
        {summary ? <p className="book-card-summary">{summary}</p> : null}
      </Link>
      {tags.length > 0 ? (
        <ul className="book-card-tags tag-list" aria-label="Tags">
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
