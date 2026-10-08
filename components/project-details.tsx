import Link from "next/link";
import type { BlogPost } from "@/lib/content";

const SUMMARY_MAX_LENGTH = 80;

/**
 * 摘要截断到约 80 字，超出加省略号。
 * 按码点切（Array.from）而不是 .slice —— 否则会劈开代理对/emoji，
 * 渲染出一个替换字符。
 */
function truncateSummary(summary: string) {
  const chars = Array.from(summary.trim());
  if (chars.length <= SUMMARY_MAX_LENGTH) {
    return chars.join("");
  }
  return `${chars.slice(0, SUMMARY_MAX_LENGTH).join("")}…`;
}

/**
 * 项目页正文下方挂的「实现细节」文章列表。
 *
 * 行首序号 = `details` 里的书写顺序（作者安排的阅读顺序），**不是**日期排序 ——
 * 这不是"该项目相关的最新文章"，而是一条从总览读进实现的路径。
 * 空列表直接 return null：不留一个只有标题的空壳。Server Component。
 */
export function ProjectDetails({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="project-details" aria-label="实现细节">
      <h2>实现细节</h2>
      <ol className="project-details-list">
        {posts.map((post, index) => (
          <li className="project-details-item" key={post.slug}>
            <span className="project-details-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <article className="entry-card-blog">
              <Link href={`/blog/${post.slug}`} className="entry-card-blog-link">
                <header className="entry-card-blog-header">
                  <time className="entry-card-blog-date" dateTime={post.date}>
                    {post.date}
                  </time>
                  <h3 className="entry-card-blog-title">{post.title}</h3>
                </header>
                <p className="entry-card-blog-summary">
                  {truncateSummary(post.summary)}
                </p>
              </Link>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
