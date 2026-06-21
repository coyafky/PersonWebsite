import Link from "next/link";
import { getBlogPosts, getWeeklyPosts } from "@/lib/content";

/**
 * Site-wide footer with three columns:
 *   1. 栏目索引  — link list to top-level sections
 *   2. 最近更新   — latest 1 blog + latest 1 weekly
 *   3. RSS & contact — RSS, GitHub, email, copyright
 *
 * Server Component. Reads recent posts via reader functions to keep
 * the call site (`layout.tsx`) free of data-fetching props.
 */
export async function SectionFooter() {
  const year = new Date().getFullYear();

  // 静默拉取；任意集合为空时回退到"暂无更新"提示。
  const [latestBlog, latestWeekly] = await Promise.all([
    getBlogPosts()
      .then((posts) => posts[0])
      .catch(() => undefined),
    getWeeklyPosts()
      .then((posts) => posts[0])
      .catch(() => undefined),
  ]);

  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        {/* Column 1 — 栏目索引 */}
        <nav className="site-footer-col" aria-label="Site sections">
          <h2 className="site-footer-heading">Sections</h2>
          <ul className="site-footer-list">
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/ai-tracker">AI Tracker</Link>
            </li>
            <li>
              <Link href="/weekly">Weekly</Link>
            </li>
            <li>
              <Link href="/learning">Learning</Link>
            </li>
            <li>
              <Link href="/projects">Projects</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </nav>

        {/* Column 2 — 最近更新 */}
        <div className="site-footer-col" aria-label="Recent updates">
          <h2 className="site-footer-heading">Recent</h2>
          <ul className="site-footer-list">
            {latestBlog ? (
              <li>
                <span className="site-footer-kind">Blog</span>
                <Link href={`/blog/${latestBlog.slug}`}>{latestBlog.title}</Link>
              </li>
            ) : (
              <li className="site-footer-empty">No posts yet.</li>
            )}
            {latestWeekly ? (
              <li>
                <span className="site-footer-kind">Weekly</span>
                <Link href={`/weekly/${latestWeekly.slug}`}>{latestWeekly.title}</Link>
              </li>
            ) : (
              <li className="site-footer-empty">No weekly yet.</li>
            )}
          </ul>
        </div>

        {/* Column 3 — RSS & contact */}
        <div className="site-footer-col" aria-label="Subscribe and contact">
          <h2 className="site-footer-heading">Subscribe</h2>
          <ul className="site-footer-list">
            <li>
              <a href="/rss.xml" rel="alternate" type="application/rss+xml">
                RSS feed
              </a>
            </li>
            <li>
              <a
                href="https://github.com/coyafky/PersonWebsite"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </li>
            <li>
              <a href="mailto:coya20020824@gmail.com">coya20020824@gmail.com</a>
            </li>
          </ul>
          <p className="site-footer-copy">© {year} Coya</p>
        </div>
      </div>
    </footer>
  );
}
