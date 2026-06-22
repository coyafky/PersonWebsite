import { CollectionList } from "@/components/collection-list";
import { EntryCardBlog } from "@/components/entry-card-blog";
import { getBlogPosts } from "@/lib/content";

export const metadata = {
  title: "Blog",
  description: "Long-form essays on engineering, AI, and craft.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

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
    </div>
  );
}
