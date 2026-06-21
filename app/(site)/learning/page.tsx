import { CollectionList } from "@/components/collection-list";
import { EntryCardLearning } from "@/components/entry-card-learning";
import { getLearningPosts, getLearningTopics } from "@/lib/content";

export const metadata = {
  title: "Learning",
  description:
    "Structured study notes organized by topic — distilled from hands-on exploration and reference material.",
};

export default async function LearningPage() {
  const topicSummaries = await getLearningTopics();

  // Compose each topic with its posts inline: `getLearningTopics()` only
  // exposes articleCount, so we pair it with `getLearningPosts(topic)` per
  // topic to fill the cards. Slice 8 may consolidate this into a single
  // reader helper.
  const topics = await Promise.all(
    topicSummaries.map(async (summary) => {
      const posts = await getLearningPosts(summary.topic);
      return {
        topic: summary.topic,
        description: summary.summary,
        postCount: summary.articleCount,
        posts: posts.map((post) => ({
          slug: post.slug,
          title: post.title,
          summary: post.summary,
        })),
      };
    }),
  );

  return (
    <div className="page-shell">
      <CollectionList
        title="Learning"
        description="Structured notes by topic."
      >
        <div className="entry-card-learning-tree">
          {topics.map((topic) => (
            <EntryCardLearning
              key={topic.topic}
              description={topic.description}
              postCount={topic.postCount}
              posts={topic.posts}
              topic={topic.topic}
            />
          ))}
        </div>
      </CollectionList>
    </div>
  );
}