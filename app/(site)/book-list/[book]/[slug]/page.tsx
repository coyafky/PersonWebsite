import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MdxContent } from "@/components/mdx-content";
import { BlogPostingJsonLd } from "@/components/json-ld";
import { ShareButtons } from "@/components/share-buttons";
import { ArticleKeyboardNav } from "@/components/article-keyboard-nav";
import { SeriesNav } from "@/components/series-nav";
import { RelatedPosts, getRelatedPosts } from "@/components/related-posts";
import { getBookNoteBySlug, getBookNotes, getBookTopics } from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";
import { articleMetadata, buildUrl } from "@/lib/metadata";
import { readingTimeLabel } from "@/lib/reading-time";

type NotePageProps = {
  params: Promise<{ book: string; slug: string }>;
};

export async function generateStaticParams() {
  const topics = await getBookTopics();
  const noteLists = await Promise.all(
    topics.map(async (t) => {
      const notes = await getBookNotes(t.book);
      return notes.map((note) => ({ book: t.book, slug: note.slug }));
    }),
  );
  return noteLists.flat();
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { book, slug } = await params;
  const post = await getBookNoteBySlug(book, slug);

  if (!post) {
    return {};
  }

  return articleMetadata({ ...post, path: `book-list/${book}` });
}

export default async function BookNotePage({ params }: NotePageProps) {
  const { book, slug } = await params;
  const [post, allNotes] = await Promise.all([
    getBookNoteBySlug(book, slug),
    getBookNotes(book),
  ]);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.body);
  const url = buildUrl(`/book-list/${book}/${slug}`);

  const related = getRelatedPosts(
    { slug: post.slug, tags: post.tags, path: `book-list/${book}` },
    allNotes.map((n) => ({
      title: n.title,
      slug: n.slug,
      tags: n.tags,
      date: n.date,
      path: `book-list/${book}`,
    })),
  );

  let seriesPrev = null;
  let seriesNext = null;
  if (post.series) {
    const seriesNotes = allNotes
      .filter((n) => n.series === post.series)
      .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
    const idx = seriesNotes.findIndex((n) => n.slug === post.slug);
    if (idx > 0)
      seriesPrev = {
        title: seriesNotes[idx - 1].title,
        slug: `/book-list/${book}/${seriesNotes[idx - 1].slug}`,
        date: seriesNotes[idx - 1].date,
      };
    if (idx < seriesNotes.length - 1)
      seriesNext = {
        title: seriesNotes[idx + 1].title,
        slug: `/book-list/${book}/${seriesNotes[idx + 1].slug}`,
        date: seriesNotes[idx + 1].date,
      };
  }

  const postIdx = allNotes.findIndex((n) => n.slug === slug);
  const prevNote = postIdx > 0 ? allNotes[postIdx - 1] : undefined;
  const nextNote = postIdx < allNotes.length - 1 ? allNotes[postIdx + 1] : undefined;

  return (
    <ArticleLayout headings={headings}>
      <BlogPostingJsonLd post={post} path={`book-list/${book}`} />
      <ArticleKeyboardNav
        prevUrl={prevNote ? `/book-list/${book}/${prevNote.slug}` : undefined}
        nextUrl={nextNote ? `/book-list/${book}/${nextNote.slug}` : undefined}
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
