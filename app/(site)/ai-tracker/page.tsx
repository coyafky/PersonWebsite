import { AiTrackerCard } from "@/components/ai-tracker-card";
import { getAiTrackerPosts } from "@/lib/content";
import Link from "next/link";

export const metadata = {
  title: "AI Tracker",
  description: "AI 信息摄取、阅读记录、观点沉淀与长期追踪。",
};

type AiTrackerPageProps = {
  searchParams: Promise<{ topic?: string | string[] }>;
};

export default async function AiTrackerPage({ searchParams }: AiTrackerPageProps) {
  const posts = await getAiTrackerPosts();
  const params = await searchParams;
  const activeTopics = Array.isArray(params.topic)
    ? params.topic
    : params.topic
      ? [params.topic]
      : [];

  if (posts.length === 0) {
    return (
      <div className="page-shell narrow">
        <header className="page-header">
          <h1>AI Tracker</h1>
          <p>AI 信息摄取、阅读记录、观点沉淀与长期追踪。</p>
        </header>
        <p className="empty-state">尚无内容。开始记录第一条 AI 跟踪 →</p>
      </div>
    );
  }

  // collect all topics preserving first-appearance order across posts sorted by date desc
  const orderedTopics: string[] = [];
  const seen = new Set<string>();
  for (const post of posts) {
    const topics = post.topics.length > 0 ? post.topics : ["未分类"];
    for (const topic of topics) {
      if (!seen.has(topic)) {
        seen.add(topic);
        orderedTopics.push(topic);
      }
    }
  }

  // filtered mode: single flat list, filter by topic membership
  if (activeTopics.length > 0) {
    const filtered = posts.filter((post) =>
      post.topics.some((t) => activeTopics.includes(t)),
    );
    const sorted = filtered.toSorted((a, b) => b.date.localeCompare(a.date));

    return (
      <div className="page-shell narrow">
        <header className="page-header">
          <h1>AI Tracker</h1>
          <p>AI 信息摄取、阅读记录、观点沉淀与长期追踪。</p>
        </header>
        <div className="ai-tracker-filter-bar" role="status" aria-live="polite">
          <p className="ai-tracker-filter-bar__label">
            当前筛选：
            {activeTopics.map((t) => (
              <span className="topic-chip active" key={t}>
                {t}
              </span>
            ))}
          </p>
          <Link className="ai-tracker-filter-bar__clear" href="/ai-tracker">
            清除筛选
          </Link>
        </div>
        {sorted.length === 0 ? (
          <p className="empty-state">当前筛选下没有匹配内容。</p>
        ) : (
          <div className="stack-list">
            {sorted.map((post) => (
              <AiTrackerCard
                activeTopics={activeTopics}
                date={post.date}
                key={post.slug}
                signal={post.signal}
                signalLabel={post.signalLabel}
                slug={post.slug}
                sourceTitle={post.sourceTitle}
                sourceType={post.sourceType}
                sourceUrl={post.sourceUrl}
                summary={post.summary}
                tags={post.tags}
                title={post.title}
                topics={post.topics}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // default mode: group by topics
  const groups = new Map<string, typeof posts>();
  for (const post of posts) {
    const topics = post.topics.length > 0 ? post.topics : ["未分类"];
    for (const topic of topics) {
      const bucket = groups.get(topic) ?? [];
      bucket.push(post);
      groups.set(topic, bucket);
    }
  }

  // each group sorted by date desc
  for (const bucket of groups.values()) {
    bucket.sort((a, b) => b.date.localeCompare(a.date));
  }

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>AI Tracker</h1>
        <p>AI 信息摄取、阅读记录、观点沉淀与长期追踪。</p>
      </header>
      {orderedTopics.map((topic) => {
        const bucket = groups.get(topic) ?? [];
        return (
          <section className="ai-tracker-group" key={topic}>
            <h2 className="ai-tracker-group__title">
              <span>{topic}</span>
              <span className="ai-tracker-group__count">{bucket.length}</span>
            </h2>
            <div className="stack-list">
              {bucket.map((post) => (
                <AiTrackerCard
                  date={post.date}
                  key={`${topic}-${post.slug}`}
                  signal={post.signal}
                  signalLabel={post.signalLabel}
                  slug={post.slug}
                  sourceTitle={post.sourceTitle}
                  sourceType={post.sourceType}
                  sourceUrl={post.sourceUrl}
                  summary={post.summary}
                  tags={post.tags}
                  title={post.title}
                  topics={post.topics}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
