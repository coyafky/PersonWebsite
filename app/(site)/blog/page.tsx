import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { Icons0Blog } from "@/components/icons0";
import { getBlogPosts } from "@/lib/content";

export const metadata = {
  title: "Blog",
  description: "Technical writing, ideas, and learning notes.",
};

const PAGE_SIZE = 5;

type BlogPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = await getBlogPosts();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const pagedPosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>Blog</h1>
        <p>技术文章、想法、学习笔记和较完整的观点沉淀。</p>
      </header>
      <div className="stack-list">
        {pagedPosts.map((post) => (
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
      {totalPages > 1 ? (
        <nav className="pagination" aria-label="Blog pagination">
          {page > 1 ? (
            <Link href={`/blog?page=${page - 1}`}>← Previous</Link>
          ) : (
            <span>← Previous</span>
          )}
          <span>
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={`/blog?page=${page + 1}`}>Next →</Link>
          ) : (
            <span>Next →</span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
