import Link from "next/link";
import type { SiteContent } from "@/lib/content/schemas";

type RelatedItem = {
  title: string;
  slug: string;
  path: string;
  date: string;
};

export function getRelatedPosts(
  current: { slug: string; tags: string[]; path: string },
  allPosts: { title: string; slug: string; tags: string[]; date: string; path: string }[],
  max = 3,
): RelatedItem[] {
  return allPosts
    .filter((p) => p.slug !== current.slug || p.path !== current.path)
    .map((p) => {
      const shared = p.tags.filter((t) => current.tags.includes(t));
      return { ...p, score: shared.length };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))
    .slice(0, max);
}

export function RelatedPosts({ posts }: { posts: RelatedItem[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="related-posts">
      <h3>Related Posts</h3>
      <div className="stack-list">
        {posts.map((post) => (
          <Link
            key={`${post.path}/${post.slug}`}
            href={`/${post.path}/${post.slug}`}
            className="related-item"
          >
            <span className="related-item-title">{post.title}</span>
            <span className="related-item-date">{post.date}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
