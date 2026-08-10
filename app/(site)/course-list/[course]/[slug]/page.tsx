import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MdxContent } from "@/components/mdx-content";
import { BlogPostingJsonLd } from "@/components/json-ld";
import { ShareButtons } from "@/components/share-buttons";
import { ArticleKeyboardNav } from "@/components/article-keyboard-nav";
import { SeriesNav } from "@/components/series-nav";
import { RelatedPosts, getRelatedPosts } from "@/components/related-posts";
import { getCourseNoteBySlug, getCourseNotes, getCourseTopics } from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";
import { articleMetadata, buildUrl } from "@/lib/metadata";
import { readingTimeLabel } from "@/lib/reading-time";

type NotePageProps = {
  params: Promise<{ course: string; slug: string }>;
};

export async function generateStaticParams() {
  const topics = await getCourseTopics();
  const noteLists = await Promise.all(
    topics.map(async (t) => {
      const notes = await getCourseNotes(t.course);
      return notes.map((note) => ({ course: t.course, slug: note.slug }));
    }),
  );
  return noteLists.flat();
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { course, slug } = await params;
  const post = await getCourseNoteBySlug(course, slug);

  if (!post) {
    return {};
  }

  return articleMetadata({ ...post, path: `course-list/${course}` });
}

export default async function CourseNotePage({ params }: NotePageProps) {
  const { course, slug } = await params;
  const [post, allNotes] = await Promise.all([
    getCourseNoteBySlug(course, slug),
    getCourseNotes(course),
  ]);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.body);
  const url = buildUrl(`/course-list/${course}/${slug}`);

  const related = getRelatedPosts(
    { slug: post.slug, tags: post.tags, path: `course-list/${course}` },
    allNotes.map((n) => ({
      title: n.title,
      slug: n.slug,
      tags: n.tags,
      date: n.date,
      path: `course-list/${course}`,
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
        slug: `/course-list/${course}/${seriesNotes[idx - 1].slug}`,
        date: seriesNotes[idx - 1].date,
      };
    if (idx < seriesNotes.length - 1)
      seriesNext = {
        title: seriesNotes[idx + 1].title,
        slug: `/course-list/${course}/${seriesNotes[idx + 1].slug}`,
        date: seriesNotes[idx + 1].date,
      };
  }

  const postIdx = allNotes.findIndex((n) => n.slug === slug);
  const prevNote = postIdx > 0 ? allNotes[postIdx - 1] : undefined;
  const nextNote = postIdx < allNotes.length - 1 ? allNotes[postIdx + 1] : undefined;

  return (
    <ArticleLayout headings={headings}>
      <BlogPostingJsonLd post={post} path={`course-list/${course}`} />
      <ArticleKeyboardNav
        prevUrl={prevNote ? `/course-list/${course}/${prevNote.slug}` : undefined}
        nextUrl={nextNote ? `/course-list/${course}/${nextNote.slug}` : undefined}
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
