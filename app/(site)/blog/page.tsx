import { CollectionList } from "@/components/collection-list";
import { EntryCardBlog } from "@/components/entry-card-blog";
import { Pagination } from "@/components/pagination";
import { getBlogPostsPaginated } from "@/lib/content";

export const metadata = {
  title: "写作",
  description:
    "关于 AI 应用、营销工作流与工具实践的记录。保留过程、判断和踩过的坑。",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const {
    posts,
    page: currentPage,
    totalPages,
  } = await getBlogPostsPaginated(false, { page, pageSize: 10 });

  return (
    <div className="page-shell">
      <CollectionList
        title="写作"
        eyebrow="WRITING / IDEAS IN PRACTICE"
        description="关于 AI 应用、营销工作流与工具实践的记录。保留过程、判断和踩过的坑。"
      >
        {posts.map((post) => (
          <EntryCardBlog
            key={post.slug}
            href={`/blog/${post.slug}`}
            title={post.title}
            summary={post.summary}
            date={post.date}
            tags={post.tags}
            cover={post.cover}
            coverAlt={post.coverAlt}
          />
        ))}
      </CollectionList>
      <Pagination page={currentPage} totalPages={totalPages} baseHref="/blog" />
    </div>
  );
}
