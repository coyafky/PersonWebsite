import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx-content";
import { ArticleLayout } from "@/components/article-layout";
import { getContentBySlug, getWeeklyPosts } from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";
import { articleMetadata, buildUrl } from "@/lib/metadata";
import { readingTimeLabel } from "@/lib/reading-time";
import { BlogPostingJsonLd } from "@/components/json-ld";
import { ShareButtons } from "@/components/share-buttons";
import { Comments } from "@/components/comments";
import { RelatedPosts, getRelatedPosts } from "@/components/related-posts";
import { SeriesNav } from "@/components/series-nav";
import { ArticleKeyboardNav } from "@/components/article-keyboard-nav";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getWeeklyPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentBySlug("weekly", slug);

  if (!post) {
    return {};
  }

  return articleMetadata({ ...post, path: "weekly" });
}

export default async function WeeklyDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getContentBySlug("weekly", slug),
    getWeeklyPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.body);
  const url = buildUrl(`/weekly/${post.slug}`);

  const related = getRelatedPosts(
    { slug: post.slug, tags: post.tags, path: "weekly" },
    allPosts.map((p) => ({ title: p.title, slug: p.slug, tags: p.tags, date: p.date, path: "weekly" })),
  );

  let seriesPrev = null;
  let seriesNext = null;
  if (post.series) {
    const seriesPosts = allPosts
      .filter((p) => p.series === post.series)
      .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
    const idx = seriesPosts.findIndex((p) => p.slug === post.slug);
    if (idx > 0) seriesPrev = { title: seriesPosts[idx - 1].title, slug: `/weekly/${seriesPosts[idx - 1].slug}`, date: seriesPosts[idx - 1].date };
    if (idx < seriesPosts.length - 1) seriesNext = { title: seriesPosts[idx + 1].title, slug: `/weekly/${seriesPosts[idx + 1].slug}`, date: seriesPosts[idx + 1].date };
  }

  const postIdx = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = postIdx > 0 ? allPosts[postIdx - 1] : undefined;
  const nextPost = postIdx < allPosts.length - 1 ? allPosts[postIdx + 1] : undefined;

  return (
    <ArticleLayout headings={headings}>
      <BlogPostingJsonLd post={post} path="weekly" />
      <ArticleKeyboardNav
        prevUrl={prevPost ? `/weekly/${prevPost.slug}` : undefined}
        nextUrl={nextPost ? `/weekly/${nextPost.slug}` : undefined}
      />
      <article className="article-shell">
        <header className="article-header">
          <span>{post.week} · <span className="reading-time">{readingTimeLabel(post.body)}</span></span>
          <h1>{post.title}</h1>
          <p>{post.summary}</p>
          {post.englishSummary ? <p className="english-summary">{post.englishSummary}</p> : null}
        </header>
        <MdxContent source={post.body} />
        <SeriesNav series={post.series ?? ""} prev={seriesPrev} next={seriesNext} />
        <ShareButtons title={post.title} url={url} />
      </article>
      <RelatedPosts posts={related} />
      <Comments />
    </ArticleLayout>
  );
}
