import { CollectionList } from "@/components/collection-list";
import { EntryCardAiTracker } from "@/components/entry-card-ai-tracker";
import { getAiTrackerPosts } from "@/lib/content";

export const metadata = {
  title: "AI Tracker",
  description: "AI 信息摄取、阅读记录、观点沉淀与长期追踪。",
};

export default async function AiTrackerPage() {
  const posts = await getAiTrackerPosts();

  return (
    <div className="page-shell">
      <CollectionList
        title="AI Tracker"
        description="Signals I'm watching in the AI space."
      >
        {posts.length === 0 ? (
          <p className="empty-state">尚无内容。开始记录第一条 AI 跟踪 →</p>
        ) : (
          <div className="entry-card-ai-tracker-stream">
            {posts.map((post) => (
              <EntryCardAiTracker
                key={post.slug}
                href={`/ai-tracker/${post.slug}`}
                title={post.title}
                summary={post.summary}
                signal={post.signal}
                signalLabel={post.signalLabel}
                date={post.date}
                tags={post.tags}
              />
            ))}
          </div>
        )}
      </CollectionList>
    </div>
  );
}
