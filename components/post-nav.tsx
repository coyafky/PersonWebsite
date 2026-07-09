import Link from "next/link";

type PostNavPost = {
  title: string;
  slug: string;
  date: string;
};

type PostNavProps = {
  prev: PostNavPost | null | undefined;
  next: PostNavPost | null | undefined;
};

/**
 * Visible prev / next post navigation for blog detail pages.
 *
 * Two side-by-side cards. Each card shows a direction label ("上一篇" / "下一篇"),
 * the post title, and the date. Both columns collapse to a placeholder when one
 * side is missing (oldest / newest post in the collection), preserving the
 * left-alignment.
 *
 * Hidden in print stylesheet (see `.post-nav` rule in `app/globals.css`).
 */
export function PostNav({ prev, next }: PostNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="post-nav" aria-label="前后篇导航">
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="post-nav__card post-nav__card--prev"
        >
          <span className="post-nav__direction">← 上一篇</span>
          <span className="post-nav__title">{prev.title}</span>
          <span className="post-nav__date">{prev.date}</span>
        </Link>
      ) : (
        <span className="post-nav__placeholder" aria-hidden="true" />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="post-nav__card post-nav__card--next"
        >
          <span className="post-nav__direction">下一篇 →</span>
          <span className="post-nav__title">{next.title}</span>
          <span className="post-nav__date">{next.date}</span>
        </Link>
      ) : (
        <span className="post-nav__placeholder" aria-hidden="true" />
      )}
    </nav>
  );
}