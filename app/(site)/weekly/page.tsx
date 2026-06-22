import { CollectionList } from "@/components/collection-list";
import { EntryCardWeekly } from "@/components/entry-card-weekly";
import { getWeeklyPosts } from "@/lib/content";

export const metadata = {
  title: "Weekly",
  description: "Weekly log: what I read, built, and learned.",
};

export default async function WeeklyPage() {
  const posts = await getWeeklyPosts();

  return (
    <div className="page-shell">
      <CollectionList
        title="Weekly"
        description="Weekly log: what I read, built, and learned."
      >
        <div className="timeline">
          {posts.map((post) => (
            <EntryCardWeekly
              key={post.slug}
              href={`/weekly/${post.slug}`}
              week={post.week}
              title={post.title}
              highlights={post.highlights}
              mood={post.mood}
            />
          ))}
        </div>
      </CollectionList>
    </div>
  );
}
