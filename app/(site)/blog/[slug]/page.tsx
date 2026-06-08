import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx-content";
import { getBlogPosts, getContentBySlug } from "@/lib/content";

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

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const post = await getContentBySlug("blog", slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="article-shell">
      <header className="article-header">
        <span>{post.date}</span>
        <h1>{post.title}</h1>
        <p>{post.summary}</p>
        {post.englishSummary ? <p className="english-summary">{post.englishSummary}</p> : null}
      </header>
      <MdxContent source={post.body} />
    </article>
  );
}
