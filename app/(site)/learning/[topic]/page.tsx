import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionList } from "@/components/collection-list";
import {
  getLearningPosts,
  getLearningTopicIndex,
  getLearningTopics,
} from "@/lib/content";
import { SITE_NAME } from "@/lib/metadata";

type TopicPageProps = {
  params: Promise<{ topic: string }>;
};

export async function generateStaticParams() {
  const topics = await getLearningTopics();
  return topics.map((summary) => ({ topic: summary.topic }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
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
  const articles = await getLearningPosts(topic);

  if (articles.length === 0) {
    notFound();
  }

  return (
    <div className="page-shell">
      <CollectionList
        title={topic}
        description={`${articles.length} notes on ${topic}.`}
        actions={
          <Link className="button secondary" href="/learning">
            ← All topics
          </Link>
        }
      >
        <ul className="entry-card-learning-list">
          {articles.map((article) => (
            <li key={article.slug} className="entry-card-learning-list-item-wrap">
              <Link
                className="entry-card-learning-list-item"
                href={`/learning/${topic}/${article.slug}`}
              >
                <h3 className="entry-card-learning-list-title">{article.title}</h3>
                <p className="entry-card-learning-list-summary">
                  {article.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </CollectionList>
    </div>
  );
}