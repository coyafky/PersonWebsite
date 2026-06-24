import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx-content";
import { ArticleLayout } from "@/components/article-layout";
import { getBlogPosts, getContentBySlug } from "@/lib/content";
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
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentBySlug("blog", slug);

  if (!post) {
    return {};
  }

  return articleMetadata({ ...post, path: "blog" });
}

export default async function BlogDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getContentBySlug("blog", slug),
    getBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.body);
  const url = buildUrl(`/blog/${post.slug}`);

  const related = getRelatedPosts(
    { slug: post.slug, tags: post.tags, path: "blog" },
    allPosts.map((p) => ({ title: p.title, slug: p.slug, tags: p.tags, date: p.date, path: "blog" })),
  );

  let seriesPrev = null;
  let seriesNext = null;
  if (post.series) {
    const seriesPosts = allPosts
      .filter((p) => p.series === post.series)
      .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
    const idx = seriesPosts.findIndex((p) => p.slug === post.slug);
    if (idx > 0) seriesPrev = { title: seriesPosts[idx - 1].title, slug: `/blog/${seriesPosts[idx - 1].slug}`, date: seriesPosts[idx - 1].date };
    if (idx < seriesPosts.length - 1) seriesNext = { title: seriesPosts[idx + 1].title, slug: `/blog/${seriesPosts[idx + 1].slug}`, date: seriesPosts[idx + 1].date };
  }

  const postIdx = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = postIdx > 0 ? allPosts[postIdx - 1] : undefined;
  const nextPost = postIdx < allPosts.length - 1 ? allPosts[postIdx + 1] : undefined;

  return (
    <ArticleLayout
      headings={headings}
      header={
        <>
          <BlogPostingJsonLd post={post} path="blog" />
          <ArticleKeyboardNav
            prevUrl={prevPost ? `/blog/${prevPost.slug}` : undefined}
            nextUrl={nextPost ? `/blog/${nextPost.slug}` : undefined}
          />
          <article className="article-shell">
            <header className="article-header">
              <span>{post.date} · <span className="reading-time">{readingTimeLabel(post.body)}</span></span>
              <h1>{post.title}</h1>
              <p>{post.summary}</p>
              {post.englishSummary ? <p className="english-summary">{post.englishSummary}</p> : null}
            </header>
          </article>
        </>
      }
      footer={
        <>
          <SeriesNav series={post.series ?? ""} prev={seriesPrev} next={seriesNext} />
          <ShareButtons title={post.title} url={url} />
          <RelatedPosts posts={related} />
          <Comments />
        </>
      }
    >
      <MdxContent source={post.body} />
    </ArticleLayout>
  );
}
