import Link from "next/link";

type LearningPostStub = {
  slug: string;
  title: string;
  summary?: string;
};

type EntryCardLearningProps = {
  topic: string;
  description?: string;
  postCount: number;
  posts: LearningPostStub[];
  hrefPrefix?: string;
};

/**
 * Topic-folded entry card for the Learning column. Uses native <details> for
 * zero-JS expand/collapse (per SPEC §6.4 R2). Topic name is the summary
 * caption; the inner list links to each article without nesting anchors.
 * Server Component.
 */
export function EntryCardLearning({
  topic,
  description,
  postCount,
  posts,
  hrefPrefix,
}: EntryCardLearningProps) {
  const prefix = hrefPrefix ?? `/learning/${topic}`;

  return (
    <details className="entry-card-learning">
      <summary className="entry-card-learning-summary">
        <span className="entry-card-learning-topic">{topic}</span>
        <span className="entry-card-learning-count">
          {postCount} {postCount === 1 ? "post" : "posts"}
        </span>
      </summary>
      {description ? (
        <p className="entry-card-learning-description">{description}</p>
      ) : null}
      <ul className="entry-card-learning-posts">
        {posts.map((post) => (
          <li key={post.slug} className="entry-card-learning-post">
            <Link
              href={`${prefix}/${post.slug}`}
              className="entry-card-learning-post-link"
            >
              {post.title}
            </Link>
            {post.summary ? (
              <p className="entry-card-learning-post-summary">{post.summary}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </details>
  );
}