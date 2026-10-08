import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MdxContent } from "@/components/mdx-content";
import { BlogPostingJsonLd } from "@/components/json-ld";
import { ShareButtons } from "@/components/share-buttons";
import { ArticleKeyboardNav } from "@/components/article-keyboard-nav";
import { SeriesNav } from "@/components/series-nav";
import { RelatedPosts, getRelatedPosts } from "@/components/related-posts";
import {
  findNoteCollection,
  getNoteBySlug,
  getNoteCollectionNotes,
  getNoteCollections,
} from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";
import { articleMetadata, buildUrl } from "@/lib/metadata";
import { readingTimeLabel } from "@/lib/reading-time";

type NotePageProps = {
  params: Promise<{ collection: string; slug: string }>;
};

export async function generateStaticParams() {
  const collections = await getNoteCollections();
  const noteLists = await Promise.all(
    collections.map(async (collection) => {
      const notes = await getNoteCollectionNotes(collection.kind, collection.collection);
      return notes.map((note) => ({
        collection: collection.collection,
        slug: note.slug,
      }));
    }),
  );
  return noteLists.flat();
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { collection, slug } = await params;
  const summary = await findNoteCollection(collection);

  if (!summary) {
    return {};
  }

  const post = await getNoteBySlug(summary.kind, collection, slug);

  if (!post) {
    return {};
  }

  return articleMetadata({ ...post, path: `notes/${collection}` });
}

export default async function NotePage({ params }: NotePageProps) {
  const { collection, slug } = await params;
  const summary = await findNoteCollection(collection);

  if (!summary) {
    notFound();
  }

  const [post, allNotes] = await Promise.all([
    getNoteBySlug(summary.kind, collection, slug),
    getNoteCollectionNotes(summary.kind, collection),
  ]);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.body);
  const url = buildUrl(`/notes/${collection}/${slug}`);
  const path = `notes/${collection}`;

  const related = getRelatedPosts(
    { slug: post.slug, tags: post.tags, path },
    allNotes.map((note) => ({
      title: note.title,
      slug: note.slug,
      tags: note.tags,
      date: note.date,
      path,
    })),
  );

  let seriesPrev = null;
  let seriesNext = null;
  if (post.series) {
    const seriesNotes = allNotes
      .filter((note) => note.series === post.series)
      .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
    const idx = seriesNotes.findIndex((note) => note.slug === post.slug);
    if (idx > 0) {
      seriesPrev = {
        title: seriesNotes[idx - 1].title,
        slug: `/notes/${collection}/${seriesNotes[idx - 1].slug}`,
        date: seriesNotes[idx - 1].date,
      };
    }
    if (idx < seriesNotes.length - 1) {
      seriesNext = {
        title: seriesNotes[idx + 1].title,
        slug: `/notes/${collection}/${seriesNotes[idx + 1].slug}`,
        date: seriesNotes[idx + 1].date,
      };
    }
  }

  const postIdx = allNotes.findIndex((note) => note.slug === post.slug);
  const prevNote = postIdx > 0 ? allNotes[postIdx - 1] : undefined;
  const nextNote = postIdx < allNotes.length - 1 ? allNotes[postIdx + 1] : undefined;

  return (
    <ArticleLayout headings={headings}>
      <BlogPostingJsonLd post={post} path={path} />
      <ArticleKeyboardNav
        prevUrl={prevNote ? `/notes/${collection}/${prevNote.slug}` : undefined}
        nextUrl={nextNote ? `/notes/${collection}/${nextNote.slug}` : undefined}
      />
      <article className="article-shell">
        <header className="article-header">
          <span>
            {post.date} ·{" "}
            <span className="reading-time">{readingTimeLabel(post.body)}</span>
          </span>
          <h1>{post.title}</h1>
          <p>{post.summary}</p>
          {post.englishSummary ? <p className="english-summary">{post.englishSummary}</p> : null}
        </header>
        <MdxContent source={post.body} />
        <SeriesNav series={post.series ?? ""} prev={seriesPrev} next={seriesNext} />
        <ShareButtons title={post.title} url={url} />
      </article>
      <RelatedPosts posts={related} />
    </ArticleLayout>
  );
}
