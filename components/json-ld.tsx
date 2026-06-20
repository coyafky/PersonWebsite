import type { BlogPost, WeeklyPost, ProjectPost, AiTrackerPost } from "@/lib/content/schemas";
import { buildUrl, SITE_NAME } from "@/lib/metadata";

type ArticleLike = {
  title: string;
  summary: string;
  slug: string;
  date: string;
};

export function BlogPostingJsonLd({ post, path }: { post: ArticleLike; path: string }) {
  const url = buildUrl(`/${path}/${post.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    url,
    author: {
      "@type": "Person",
      name: "Coya Feng",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
