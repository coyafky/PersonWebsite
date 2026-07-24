import { CollectionList } from "@/components/collection-list";
import { EntryCardBookTopic } from "@/components/entry-card-book-topic";
import { getBookTopics } from "@/lib/content";

export const metadata = {
  title: "Book List",
  description: "Books I've read, with structured notes on what I took away.",
};

export default async function BookListPage() {
  const books = await getBookTopics();

  return (
    <div className="page-shell">
      <CollectionList
        title="Book List"
        description="Books with reading notes, organized by chapter and theme."
      >
        {books.length === 0 ? (
          <p className="empty-state">尚无书籍。开始记录第一本 →</p>
        ) : (
          <div className="book-topic-grid">
            {books.map((book) => (
              <EntryCardBookTopic
                key={book.book}
                href={`/book-list/${book.book}`}
                title={book.title}
                author={book.author}
                genre={book.genre}
                summary={book.summary}
                noteCount={book.noteCount}
              />
            ))}
          </div>
        )}
      </CollectionList>
    </div>
  );
}
