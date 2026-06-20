import Link from "next/link";

type SeriesPost = {
  title: string;
  slug: string;
  date: string;
};

type SeriesNavProps = {
  series: string;
  prev: SeriesPost | null;
  next: SeriesPost | null;
};

export function SeriesNav({ series, prev, next }: SeriesNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="series-nav" aria-label="Article series navigation">
      {prev ? (
        <Link href={prev.slug}>
          ← {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.slug}>
          {next.title} →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
