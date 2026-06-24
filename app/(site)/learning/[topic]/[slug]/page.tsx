import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MdxContent } from "@/components/mdx-content";
import {
  getLearningPostBySlug,
  getLearningPosts,
  getLearningTopics,
} from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";
import { articleMetadata, buildUrl } from "@/lib/metadata";
import { readingTimeLabel } from "@/lib/reading-time";
import { BlogPostingJsonLd } from "@/components/json-ld";
import { ShareButtons } from "@/components/share-buttons";
import { RelatedPosts, getRelatedPosts } from "@/components/related-posts";
import { SeriesNav } from "@/components/series-nav";
import { ArticleKeyboardNav } from "@/components/article-keyboard-nav";

type ArticlePageProps = {
  params: Promise<{ topic: string; slug: string }>;
};

export async function generateStaticParams() {
  const topics = await getLearningTopics();
  const articleLists = await Promise.all(
    topics.map(async (t) => {
      const articles = await getLearningPosts(t.topic);
      return articles.map((article) => ({ topic: t.topic, slug: article.slug }));
    }),
  );
  return articleLists.flat();
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { topic, slug } = await params;
  const post = await getLearningPostBySlug(topic, slug);

  if (!post) {
    return {};
  }

  return articleMetadata({ ...post, path: `learning/${topic}` });
}

export default async function LearningArticlePage({ params }: ArticlePageProps) {
  const { topic, slug } = await params;
  const [post, allPosts] = await Promise.all([
    getLearningPostBySlug(topic, slug),
    getLearningPosts(topic),
  ]);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.body);
  const url = buildUrl(`/learning/${topic}/${slug}`);

  const related = getRelatedPosts(
    { slug: post.slug, tags: post.tags, path: `learning/${topic}` },
    allPosts.map((p) => ({ title: p.title, slug: p.slug, tags: p.tags, date: p.date, path: `learning/${topic}` })),
  );

  let seriesPrev = null;
  let seriesNext = null;
  if (post.series) {
    const seriesPosts = allPosts
      .filter((p) => p.series === post.series)
      .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
    const idx = seriesPosts.findIndex((p) => p.slug === post.slug);
    if (idx > 0) seriesPrev = { title: seriesPosts[idx - 1].title, slug: `/learning/${topic}/${seriesPosts[idx - 1].slug}`, date: seriesPosts[idx - 1].date };
    if (idx < seriesPosts.length - 1) seriesNext = { title: seriesPosts[idx + 1].title, slug: `/learning/${topic}/${seriesPosts[idx + 1].slug}`, date: seriesPosts[idx + 1].date };
  }

  const postIdx = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = postIdx > 0 ? allPosts[postIdx - 1] : undefined;
  const nextPost = postIdx < allPosts.length - 1 ? allPosts[postIdx + 1] : undefined;

  return (
    <ArticleLayout
      headings={headings}
      header={
        <>
          <BlogPostingJsonLd post={post} path={`learning/${topic}`} />
          <ArticleKeyboardNav
            prevUrl={prevPost ? `/learning/${topic}/${prevPost.slug}` : undefined}
            nextUrl={nextPost ? `/learning/${topic}/${nextPost.slug}` : undefined}
          />
          <article className="article-shell">
            <header className="article-header">
              <span>{post.date} · <span className="reading-time">{readingTimeLabel(post.body)}</span></span>
              <h1>{post.title}</h1>
              <p>{post.summary}</p>
              {post.englishSummary ? (
                <p className="english-summary">{post.englishSummary}</p>
              ) : null}
            </header>
          </article>
        </>
      }
      footer={
        <>
          <SeriesNav series={post.series ?? ""} prev={seriesPrev} next={seriesNext} />
          <ShareButtons title={post.title} url={url} />
          <RelatedPosts posts={related} />
        </>
      }
    >
      <MdxContent source={post.body} />
    </ArticleLayout>
  );
}
