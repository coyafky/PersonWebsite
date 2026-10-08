import Link from "next/link";

type EntryCardBlogProps = {
  href: string;
  title: string;
  summary: string;
  date: string;
  tags?: string[];
  /** 可选封面图（根相对路径）。不传时卡片保持纯文字布局，不多渲染任何节点。 */
  cover?: string;
  /** 封面替代文本。有 cover 时检查器要求非空。 */
  coverAlt?: string;
};

/**
 * Magazine-style blog entry card: title + summary + date form a single
 * clickable area; the tag list lives outside the anchor to avoid nested
 * <a> elements. Server Component.
 */
export function EntryCardBlog({
  href,
  title,
  summary,
  date,
  tags = [],
  cover,
  coverAlt,
}: EntryCardBlogProps) {
  return (
    <article className="entry-card-blog">
      <Link href={href} className="entry-card-blog-link">
        {cover ? (
          <div className="entry-card-blog-cover">
            {/* 缩略图 lazy 加载；16:9 比例由 CSS aspect-ratio 固定 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={coverAlt ?? ""}
              width={640}
              height={360}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}
        <header className="entry-card-blog-header">
          <time className="entry-card-blog-date" dateTime={date}>
            {date}
          </time>
          <h2 className="entry-card-blog-title">{title}</h2>
        </header>
        <p className="entry-card-blog-summary">{summary}</p>
      </Link>
      {tags.length > 0 ? (
        <ul className="entry-card-blog-tags tag-list" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag}>
              <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
