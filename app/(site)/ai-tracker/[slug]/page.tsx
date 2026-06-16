import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MdxContent } from "@/components/mdx-content";
import {
  getAiTrackerPosts,
  getContentBySlug,
  getRelatedTitles,
} from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

const RELATED_COLLECTION_LABELS = {
  blog: "Blog",
  weekly: "Weekly",
  projects: "Projects",
  career: "Career",
} as const;

type RelatedKind = keyof typeof RELATED_COLLECTION_LABELS;

export async function generateStaticParams() {
  const posts = await getAiTrackerPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentBySlug("ai-tracker", slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function AiTrackerDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const post = await getContentBySlug("ai-tracker", slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.body);
  const resolvedRelated = await getRelatedTitles(post.relatedPosts);
  const resolvedByKind = (Object.keys(RELATED_COLLECTION_LABELS) as RelatedKind[]).map(
    (key) => ({
      key,
      items: resolvedRelated.filter((r) => r.kind === key),
    }),
  );
  const hasAnyResolved = resolvedByKind.some((g) => g.items.length > 0);

  return (
    <ArticleLayout headings={headings}>
      <article className="article-shell">
        <header className="article-header">
          <span>{post.date}</span>
          <h1>{post.title}</h1>
          <p>{post.summary}</p>
          {post.englishSummary ? <p className="english-summary">{post.englishSummary}</p> : null}
          <p className="ai-tracker-rss-hint">
            <a href="/ai-tracker/feed.xml" target="_blank" rel="noreferrer">
              Subscribe via RSS →
            </a>
          </p>
        </header>

        <section className="ai-tracker-source">
          <h2>Source</h2>
          <div className="source-row">
            <span className="source-row__label">Type</span>
            <span className="source-row__value">{post.sourceType}</span>
          </div>
          <div className="source-row">
            <span className="source-row__label">Signal</span>
            <span className="source-row__value">
              <span className={`signal-badge signal-${post.signal}`}>
                {post.signalLabel ? `${post.signal} · ${post.signalLabel}` : `signal ${post.signal}`}
              </span>
            </span>
          </div>
          {post.author ? (
            <div className="source-row">
              <span className="source-row__label">Author</span>
              <span className="source-row__value">{post.author}</span>
            </div>
          ) : null}
          {post.publishedAt ? (
            <div className="source-row">
              <span className="source-row__label">Published</span>
              <span className="source-row__value">{post.publishedAt}</span>
            </div>
          ) : null}
          {post.sourceTitle || post.sourceUrl ? (
            <div className="source-row">
              <span className="source-row__label">Link</span>
              <span className="source-row__value">
                {post.sourceUrl ? (
                  <a href={post.sourceUrl} target="_blank" rel="noreferrer">
                    {post.sourceTitle ?? post.sourceUrl} ↗
                  </a>
                ) : (
                  post.sourceTitle
                )}
              </span>
            </div>
          ) : null}
        </section>

        <MdxContent source={post.body} />

        {post.takeaways && post.takeaways.length > 0 ? (
          <section className="ai-tracker-section">
            <h2>Takeaways</h2>
            <ul>
              {post.takeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {post.questions && post.questions.length > 0 ? (
          <section className="ai-tracker-section">
            <h2>Questions</h2>
            <ul>
              {post.questions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {post.relatedLinks && post.relatedLinks.length > 0 ? (
          <section className="ai-tracker-section">
            <h2>Related Links</h2>
            <ul>
              {post.relatedLinks.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {hasAnyResolved ? (
          <section className="ai-tracker-related">
            <h2>Related Posts</h2>
            {resolvedByKind.map((group) => {
              if (group.items.length === 0) {
                return null;
              }
              return (
                <div className="ai-tracker-related-group" key={group.key}>
                  <p className="ai-tracker-related-group__title">
                    {RELATED_COLLECTION_LABELS[group.key]}
                  </p>
                  <ul>
                    {group.items.map((item) => (
                      <li key={`${item.kind}-${item.slug}`}>
                        <Link href={`/${item.kind}/${item.slug}`}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>
        ) : null}
      </article>
    </ArticleLayout>
  );
}
