import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/content-card";
import { Icons0Notebook } from "@/components/icons0";
import { MdxContent } from "@/components/mdx-content";
import { getLearningPosts, getLearningTopicIndex, getLearningTopics } from "@/lib/content";
import { buildUrl, SITE_NAME } from "@/lib/metadata";

type TopicPageProps = {
  params: Promise<{ topic: string }>;
};

export async function generateStaticParams() {
  const topics = await getLearningTopics();
  return topics.map((topic) => ({ topic: topic.topic }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topic } = await params;
  const indexPost = await getLearningTopicIndex(topic);

  if (!indexPost) {
    return {};
  }

  return {
    title: indexPost.title,
    description: indexPost.summary,
    openGraph: {
      title: indexPost.title,
      description: indexPost.summary,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary",
      title: indexPost.title,
      description: indexPost.summary,
    },
  };
}

export default async function LearningTopicPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const [indexPost, articles] = await Promise.all([
    getLearningTopicIndex(topic),
    getLearningPosts(topic),
  ]);

  if (!indexPost) {
    notFound();
  }

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>{indexPost.title}</h1>
        <p>{indexPost.summary}</p>
      </header>
      <section className="content-section">
        <MdxContent source={indexPost.body} />
      </section>
      <section className="content-section">
        <div className="section-heading">
          <h2>Articles</h2>
          <span>{articles.length} 篇</span>
        </div>
        {articles.length === 0 ? (
          <p className="empty-state">No articles published in this topic yet.</p>
        ) : (
          <div className="stack-list">
            {articles.map((article) => (
              <ContentCard
                href={`/learning/${topic}/${article.slug}`}
                icon={<Icons0Notebook />}
                key={article.slug}
                meta={article.date}
                summary={article.summary}
                tags={article.tags}
                title={article.title}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
