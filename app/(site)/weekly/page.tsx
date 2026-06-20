import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { Icons0Calendar } from "@/components/icons0";
import { getWeeklyPosts } from "@/lib/content";

export const metadata = {
  title: "Weekly",
  description: "Weekly notes and stage reviews.",
};

const PAGE_SIZE = 5;

type WeeklyPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function WeeklyPage({ searchParams }: WeeklyPageProps) {
  const posts = await getWeeklyPosts();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const pagedPosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>Weekly</h1>
        <p>周记、阶段复盘和长期成长轨迹。</p>
      </header>
      <div className="stack-list">
        {pagedPosts.map((post) => (
          <ContentCard
            href={`/weekly/${post.slug}`}
            icon={<Icons0Calendar />}
            key={post.slug}
            meta={post.week}
            summary={post.summary}
            tags={post.tags}
            title={post.title}
          />
        ))}
      </div>
      {totalPages > 1 ? (
        <nav className="pagination" aria-label="Weekly pagination">
          {page > 1 ? (
            <Link href={`/weekly?page=${page - 1}`}>← Previous</Link>
          ) : (
            <span>← Previous</span>
          )}
          <span>
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={`/weekly?page=${page + 1}`}>Next →</Link>
          ) : (
            <span>Next →</span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
