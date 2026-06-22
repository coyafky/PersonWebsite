import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/content-card";
import { EntryCardAiTracker } from "@/components/entry-card-ai-tracker";
import { EntryCardBlog } from "@/components/entry-card-blog";
import { EntryCardLearning } from "@/components/entry-card-learning";
import { EntryCardProject } from "@/components/entry-card-project";
import { EntryCardWeekly } from "@/components/entry-card-weekly";
import { getContentByTag } from "@/lib/content";
import type { LearningPost } from "@/lib/content/schemas";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `Content tagged with "${tag}"`,
  };
}

function groupLearningByTopic(posts: LearningPost[]) {
  const groups = new Map<string, LearningPost[]>();
  for (const post of posts) {
    const list = groups.get(post.topic) ?? [];
    list.push(post);
    groups.set(post.topic, list);
  }
  return groups;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const { items, totalByKind } = await getContentByTag(tag);

  const totalHits = Object.values(totalByKind).reduce((sum, n) => sum + n, 0);
  if (totalHits === 0) {
    notFound();
  }

  const collectionCount = Object.values(totalByKind).filter((n) => n > 0).length;
  const learningByTopic = groupLearningByTopic(items.learning);

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>#{tag}</h1>
        <p>
          {totalHits} {totalHits === 1 ? "item" : "items"} across {collectionCount}{" "}
          {collectionCount === 1 ? "collection" : "collections"}
        </p>
      </header>

      {totalByKind.blog > 0 ? (
        <section>
          <h2>Blog</h2>
          <div className="stack-list">
            {items.blog.map((post) => (
              <EntryCardBlog
                key={post.slug}
                href={`/blog/${post.slug}`}
                title={post.title}
                summary={post.summary}
                date={post.date}
                tags={post.tags}
              />
            ))}
          </div>
        </section>
      ) : null}

      {totalByKind.weekly > 0 ? (
        <section>
          <h2>Weekly</h2>
          <div className="timeline">
            {items.weekly.map((post) => (
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
        </section>
      ) : null}

      {totalByKind.projects > 0 ? (
        <section>
          <h2>Projects</h2>
          <div className="stack-list">
            {items.projects.map((post) => (
              <EntryCardProject
                key={post.slug}
                href={`/projects/${post.slug}`}
                title={post.title}
                summary={post.summary}
                stack={post.stack}
                impact={post.impact}
                featured={post.featured}
                period={post.period}
                cover={post.cover}
              />
            ))}
          </div>
        </section>
      ) : null}

      {totalByKind["ai-tracker"] > 0 ? (
        <section>
          <h2>AI Tracker</h2>
          <div className="stack-list">
            {items["ai-tracker"].map((post) => (
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
        </section>
      ) : null}

      {totalByKind.learning > 0 ? (
        <section>
          <h2>Learning</h2>
          <div className="stack-list">
            {[...learningByTopic.entries()].map(([topic, posts]) => (
              <EntryCardLearning
                key={topic}
                topic={topic}
                postCount={posts.length}
                posts={posts.map((p) => ({ slug: p.slug, title: p.title, summary: p.summary }))}
              />
            ))}
          </div>
        </section>
      ) : null}

      {totalByKind.career > 0 ? (
        <section>
          <h2>Career</h2>
          <div className="stack-list">
            {items.career.map((post) => (
              <ContentCard
                key={post.slug}
                href={`/about#${post.slug}`}
                title={post.title}
                summary={post.summary}
                tags={post.tags ?? []}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
