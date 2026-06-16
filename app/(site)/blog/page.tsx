import { ContentCard } from "@/components/content-card";
import { Icons0Blog } from "@/components/icons0";
import { getBlogPosts } from "@/lib/content";

export const metadata = {
  title: "Blog",
  description: "Technical writing, ideas, and learning notes.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>Blog</h1>
        <p>技术文章、想法、学习笔记和较完整的观点沉淀。</p>
      </header>
      <div className="stack-list">
        {posts.map((post) => (
          <ContentCard
            href={`/blog/${post.slug}`}
            icon={<Icons0Blog />}
            key={post.slug}
            meta={post.date}
            summary={post.summary}
            tags={post.tags}
            title={post.title}
          />
        ))}
      </div>
    </div>
  );
}
