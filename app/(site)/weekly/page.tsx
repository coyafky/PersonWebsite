import { ContentCard } from "@/components/content-card";
import { Icons0Calendar } from "@/components/icons0";
import { getWeeklyPosts } from "@/lib/content";

export const metadata = {
  title: "Weekly",
  description: "Weekly notes and stage reviews.",
};

export default async function WeeklyPage() {
  const posts = await getWeeklyPosts();

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>Weekly</h1>
        <p>周记、阶段复盘和长期成长轨迹。</p>
      </header>
      <div className="stack-list">
        {posts.map((post) => (
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
    </div>
  );
}
