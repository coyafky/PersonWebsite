import { CollectionList } from "@/components/collection-list";
import { EntryCardBookList } from "@/components/entry-card-book-list";
import { getBookListPosts } from "@/lib/content";

export const metadata = {
  title: "Book List",
  description: "Books I've read, with notes on what I took away.",
};

export default async function BookListPage() {
  const books = await getBookListPosts();

  return (
    <div className="page-shell">
      <CollectionList
        title="Book List"
        description="Books I've read, with notes on what I took away."
      >
        {books.length === 0 ? (
          <p className="empty-state">尚无书籍。开始记录第一本 →</p>
        ) : (
          <div className="book-list-grid">
            {books.map((book) => (
              <EntryCardBookList
                key={book.slug}
                href={`/book-list/${book.slug}`}
                title={book.title}
                author={book.author}
                genre={book.genre}
                summary={book.summary}
                date={book.date}
                tags={book.tags}
              />
            ))}
          </div>
        )}
      </CollectionList>
    </div>
  );
}
