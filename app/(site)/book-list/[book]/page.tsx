import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionList } from "@/components/collection-list";
import { getBookNotes, getBookTopicIndex, getBookTopics } from "@/lib/content";
import { SITE_NAME } from "@/lib/metadata";

type BookPageProps = {
  params: Promise<{ book: string }>;
};

export async function generateStaticParams() {
  const topics = await getBookTopics();
  return topics.map((t) => ({ book: t.book }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { book } = await params;
  const indexPost = await getBookTopicIndex(book);

  if (!indexPost) {
    return {};
  }

  return {
    title: indexPost.title,
    description: indexPost.summary,
    openGraph: {
      title: indexPost.title,
      description: indexPost.summary,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary",
      title: indexPost.title,
      description: indexPost.summary,
    },
  };
}

export default async function BookTopicPage({ params }: BookPageProps) {
  const { book } = await params;
  const [indexPost, notes] = await Promise.all([
    getBookTopicIndex(book),
    getBookNotes(book),
  ]);

  if (!indexPost) {
    notFound();
  }

  return (
    <div className="page-shell">
      <CollectionList
        title={indexPost.title}
        description={`${notes.length} note${notes.length === 1 ? "" : "s"} on this book.`}
        actions={
          <Link className="button secondary" href="/book-list">
            ← All books
          </Link>
        }
      >
        <div className="book-meta-block">
          <span>by {indexPost.author}</span>
          {indexPost.genre ? <span> · {indexPost.genre}</span> : null}
          {indexPost.finishedDate ? <span> · Finished {indexPost.finishedDate}</span> : null}
        </div>

        {notes.length === 0 ? (
          <p className="empty-state">尚无笔记。开始写第一篇 →</p>
        ) : (
          <ul className="entry-card-book-note-list">
            {notes.map((note) => (
              <li key={note.slug}>
                <Link
                  className="entry-card-book-note-item"
                  href={`/book-list/${book}/${note.slug}`}
                >
                  <h3 className="entry-card-book-note-title">{note.title}</h3>
                  <p className="entry-card-book-note-summary">{note.summary}</p>
                  <span className="entry-card-book-note-date">{note.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CollectionList>
    </div>
  );
}
