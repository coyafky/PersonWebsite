import { ContentCard } from "@/components/content-card";
import { Icons0Notebook } from "@/components/icons0";
import { getLearningTopics } from "@/lib/content";

export const metadata = {
  title: "Learning",
  description:
    "Structured study notes organized by topic — distilled from hands-on exploration and reference material.",
};

export default async function LearningPage() {
  const topics = await getLearningTopics();

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>Learning</h1>
        <p>按主题整理的学习笔记——从配置、记忆、技能到实战的完整记录。</p>
      </header>
      {topics.length === 0 ? (
        <p className="empty-state">No learning topics published yet.</p>
      ) : (
        <div className="stack-list">
          {topics.map((topic) => (
            <ContentCard
              href={`/learning/${topic.topic}`}
              icon={<Icons0Notebook />}
              key={topic.topic}
              meta={`${topic.articleCount} 篇文章`}
              summary={topic.summary}
              title={topic.title}
            />
          ))}
        </div>
      )}
    </div>
  );
}
