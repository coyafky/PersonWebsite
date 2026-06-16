import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx-content";
import { ArticleLayout } from "@/components/article-layout";
import { getContentBySlug, getWeeklyPosts } from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";

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

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function WeeklyDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const post = await getContentBySlug("weekly", slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.body);

  return (
    <ArticleLayout headings={headings}>
      <article className="article-shell">
        <header className="article-header">
          <span>{post.week}</span>
          <h1>{post.title}</h1>
          <p>{post.summary}</p>
          {post.englishSummary ? <p className="english-summary">{post.englishSummary}</p> : null}
        </header>
        <MdxContent source={post.body} />
      </article>
    </ArticleLayout>
  );
}
