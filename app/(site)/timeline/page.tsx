import Link from "next/link";
import { CollectionList } from "@/components/collection-list";
import { getBlogPosts } from "@/lib/content";

export const metadata = {
  title: "Timeline · Personal Website",
  description: "All blog posts in a single timeline.",
};

export default async function TimelinePage() {
  const posts = await getBlogPosts();

  return (
    <div className="page-shell">
      <CollectionList
        title="Timeline"
        description={`${posts.length} ${posts.length === 1 ? "post" : "posts"} in reverse chronological order.`}
      >
        {posts.length === 0 ? (
          <p className="empty-state">尚无文章。</p>
        ) : (
          <ol className="timeline">
            {posts.map((post) => (
              <li key={post.slug} className="timeline-item">
                <div className="timeline-marker" aria-hidden />
                <article className="timeline-card">
                  <time className="timeline-date">{post.date}</time>
                  <h2 className="timeline-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="timeline-summary">{post.summary}</p>
                  {post.tags && post.tags.length > 0 ? (
                    <ul className="timeline-tags" aria-label="Tags">
                      {post.tags.map((tag) => (
                        <li key={tag}>
                          <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        )}
      </CollectionList>
    </div>
  );
}
