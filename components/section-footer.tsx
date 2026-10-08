import Link from "next/link";
import { getBlogPosts, getNoteCollections } from "@/lib/content";

/**
 * Site-wide footer with three columns:
 *   1. 栏目索引  — link list to top-level sections
 *   2. 最近更新   — latest 1 blog + latest 1 book + latest 1 course
 *   3. RSS & contact — RSS, GitHub, email, copyright
 *
 * Server Component. Reads recent posts via reader functions to keep
 * the call site (`layout.tsx`) free of data-fetching props.
 *
 * Diary 与 Weekly 已于 2026-10-07 下架（内容归档、路由 308 → /blog），
 * 因此两列里都不再有它们的入口。
 */
export async function SectionFooter() {
  const year = new Date().getFullYear();

  // 静默拉取；任意集合为空时回退到"暂无更新"提示。
  const [latestBlog, noteCollections] = await Promise.all([
    getBlogPosts()
      .then((posts) => posts[0])
      .catch(() => undefined),
    getNoteCollections().catch(() => []),
  ]);

  // 内容模块三合一后「最近的书 / 最近的一门课」从同一份集合列表里各取第一个
  // （getNoteCollections 按 title 排序，取的都是字母序最前的那本/那门 —— 与
  // 合并前 book/course 两个列表函数取 [0] 的行为一致）。
  const latestBook = noteCollections.find((item) => item.kind === "book");
  const latestCourse = noteCollections.find((item) => item.kind === "course");

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
              <Link href="/notes">Notes</Link>
            </li>
            <li>
              <Link href="/projects">Projects</Link>
            </li>
            <li>
              <Link href="/tools">Tools</Link>
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
            {latestBook ? (
              <li>
                <span className="site-footer-kind">Book</span>
                <Link href={`/notes/${latestBook.collection}`}>{latestBook.title}</Link>
              </li>
            ) : (
              <li className="site-footer-empty">No book yet.</li>
            )}
            {latestCourse ? (
              <li>
                <span className="site-footer-kind">Course</span>
                <Link href={`/notes/${latestCourse.collection}`}>{latestCourse.title}</Link>
              </li>
            ) : (
              <li className="site-footer-empty">No course yet.</li>
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
