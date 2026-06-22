import Link from "next/link";
import { CollectionList } from "@/components/collection-list";
import { getBlogArchive } from "@/lib/content";

export const metadata = {
  title: "Blog Archive · Personal Website",
  description: "Monthly archive of blog posts.",
};

export default async function BlogArchivePage() {
  const months = await getBlogArchive();

  return (
    <div className="page-shell">
      <CollectionList
        title="Blog Archive"
        description="Posts grouped by month."
      >
        <div className="blog-archive">
          {months.map(({ month, count, posts }) => (
            <section key={month} className="blog-archive-month">
              <header className="blog-archive-month-header">
                <h2 className="blog-archive-month-label">{month}</h2>
                <span className="blog-archive-month-count">
                  {count} {count === 1 ? "post" : "posts"}
                </span>
              </header>
              <ul className="blog-archive-month-posts">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="blog-archive-post"
                    >
                      <time className="blog-archive-post-date">{post.date}</time>
                      <div>
                        <h3 className="blog-archive-post-title">{post.title}</h3>
                        <p className="blog-archive-post-summary">{post.summary}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </CollectionList>
    </div>
  );
}
