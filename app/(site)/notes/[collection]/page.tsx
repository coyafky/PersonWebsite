import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionList } from "@/components/collection-list";
import { MdxContent } from "@/components/mdx-content";
import {
  findNoteCollection,
  getNoteCollectionIndex,
  getNoteCollectionNotes,
  getNoteCollections,
  type NoteIndexPost,
} from "@/lib/content";
import { SITE_NAME } from "@/lib/metadata";

type CollectionPageProps = {
  params: Promise<{ collection: string }>;
};

export async function generateStaticParams() {
  const collections = await getNoteCollections();
  return collections.map((collection) => ({ collection: collection.collection }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { collection } = await params;
  const summary = await findNoteCollection(collection);

  if (!summary) {
    return {};
  }

  const indexPost = await getNoteCollectionIndex(summary.kind, collection);

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

/**
 * 集合 index 的元信息行。三种 kind 的展示字段不同（book: 作者/流派/读完日期，
 * course: 平台/讲师/课程链接，topic: 无），所以按 kind 收窄而不是硬套同一行。
 */
function CollectionMeta({ indexPost }: { indexPost: NoteIndexPost }) {
  if (indexPost.kind === "book-index") {
    return (
      <div className="note-meta-block">
        <span>by {indexPost.author}</span>
        {indexPost.genre ? <span> · {indexPost.genre}</span> : null}
        {indexPost.finishedDate ? (
          <span> · Finished {indexPost.finishedDate}</span>
        ) : null}
      </div>
    );
  }

  if (indexPost.kind === "course-index") {
    return (
      <div className="note-meta-block">
        <span>{indexPost.platform}</span>
        <span> · {indexPost.instructor}</span>
        {indexPost.url ? (
          <span>
            {" "}
            ·{" "}
            <a href={indexPost.url} rel="noopener noreferrer" target="_blank">
              Course link
            </a>
          </span>
        ) : null}
      </div>
    );
  }

  return null;
}

export default async function NoteCollectionPage({ params }: CollectionPageProps) {
  const { collection } = await params;
  const summary = await findNoteCollection(collection);

  if (!summary) {
    notFound();
  }

  const [indexPost, notes] = await Promise.all([
    getNoteCollectionIndex(summary.kind, collection),
    getNoteCollectionNotes(summary.kind, collection),
  ]);

  if (!indexPost) {
    notFound();
  }

  return (
    <div className="page-shell">
      <CollectionList
        title={indexPost.title}
        description={`${notes.length} note${notes.length === 1 ? "" : "s"} in this collection.`}
        actions={
          <Link className="button secondary" href="/notes">
            ← All notes
          </Link>
        }
      >
        <CollectionMeta indexPost={indexPost} />

        {indexPost.body ? (
          <div className="note-index-body">
            <MdxContent source={indexPost.body} />
          </div>
        ) : null}

        {notes.length === 0 ? (
          <p className="empty-state">尚无笔记。开始写第一篇 →</p>
        ) : (
          <ul className="entry-card-note-list">
            {notes.map((note) => (
              <li key={note.slug} className="entry-card-note-list-item-wrap">
                <Link
                  className="entry-card-note-list-item"
                  href={`/notes/${collection}/${note.slug}`}
                >
                  <h3 className="entry-card-note-list-title">{note.title}</h3>
                  <p className="entry-card-note-list-summary">{note.summary}</p>
                  <span className="entry-card-note-list-date">{note.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CollectionList>
    </div>
  );
}
