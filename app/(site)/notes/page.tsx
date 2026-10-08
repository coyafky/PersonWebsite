import { CollectionList } from "@/components/collection-list";
import { EntryCardNote } from "@/components/entry-card-note";
import { getNoteCollections, type NoteKind } from "@/lib/content";

export const metadata = {
  title: "Notes",
  description:
    "Study notes in one place — topics, books, and video courses, each collected under its own index.",
};

/** kind → 卡片上的标记文字。 */
const KIND_LABEL: Record<NoteKind, string> = {
  topic: "Topic",
  book: "Book",
  course: "Course",
};

export default async function NotesPage() {
  const collections = await getNoteCollections();

  return (
    <div className="page-shell">
      <CollectionList
        title="Notes"
        description={`${collections.length} collections — study topics, books, and courses.`}
      >
        {collections.length === 0 ? (
          <p className="empty-state">尚无集合。开始记录第一个 →</p>
        ) : (
          <div className="entry-card-note-grid">
            {collections.map((collection) => (
              <EntryCardNote
                key={`${collection.kind}/${collection.collection}`}
                href={`/notes/${collection.collection}`}
                kindLabel={KIND_LABEL[collection.kind]}
                title={collection.title}
                meta={collection.genre ?? collection.platform}
                byline={collection.author ?? collection.instructor}
                summary={collection.summary}
                noteCount={collection.noteCount}
              />
            ))}
          </div>
        )}
      </CollectionList>
    </div>
  );
}
