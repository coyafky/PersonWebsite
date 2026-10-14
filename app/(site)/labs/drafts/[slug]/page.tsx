import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MdxContent } from "@/components/mdx-content";
import { getBlogPosts } from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "本地草稿预览",
  robots: { index: false, follow: false },
};

export default async function DraftPreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { slug } = await params;
  const post = (await getBlogPosts(true)).find(
    (item) => item.slug === slug && item.status === "draft",
  );
  if (!post) notFound();
  return (
    <ArticleLayout headings={extractHeadings(post.body)}>
      <article className="article-shell">
        <header className="article-header">
          <span>本地草稿预览 · 尚未发布</span>
          <h1>{post.title}</h1>
          <p>{post.summary}</p>
        </header>
        <MdxContent source={post.body} />
      </article>
    </ArticleLayout>
  );
}
