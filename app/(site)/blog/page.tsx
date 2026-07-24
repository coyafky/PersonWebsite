import { CollectionList } from "@/components/collection-list";
import { EntryCardBlog } from "@/components/entry-card-blog";
import { Pagination } from "@/components/pagination";
import { getBlogPostsPaginated } from "@/lib/content";

export const metadata = {
  title: "Blog",
  description: "Long-form essays on engineering, AI, and craft.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { posts, page: currentPage, totalPages } =
    await getBlogPostsPaginated(false, { page, pageSize: 10 });

  return (
    <div className="page-shell">
      <CollectionList
        title="Blog"
        description="Long-form essays on engineering, AI, and craft."
      >
        {posts.map((post) => (
          <EntryCardBlog
            key={post.slug}
            href={`/blog/${post.slug}`}
            title={post.title}
            summary={post.summary}
            date={post.date}
            tags={post.tags}
          />
        ))}
      </CollectionList>
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        baseHref="/blog"
      />
    </div>
  );
}
