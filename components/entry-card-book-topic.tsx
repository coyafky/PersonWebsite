import Link from "next/link";

type EntryCardBookTopicProps = {
  href: string;
  title: string;
  author: string;
  genre: string;
  summary?: string;
  noteCount: number;
};

/**
 * Book-topic entry card: shows book name, author, genre, note count,
 * and optional summary. Links to `/book-list/<book-name>` index page.
 * Server Component.
 */
export function EntryCardBookTopic({
  href,
  title,
  author,
  genre,
  summary,
  noteCount,
}: EntryCardBookTopicProps) {
  return (
    <article className="book-card">
      <Link href={href} className="book-card-link">
        <div className="book-card-meta">
          <span className="book-card-genre">{genre}</span>
          <span className="book-card-count">
            {noteCount === 0 ? "No notes yet" : `${noteCount} note${noteCount > 1 ? "s" : ""}`}
          </span>
        </div>
        <h3 className="book-card-title">{title}</h3>
        <p className="book-card-author">by {author}</p>
        {summary ? <p className="book-card-summary">{summary}</p> : null}
      </Link>
    </article>
  );
}
