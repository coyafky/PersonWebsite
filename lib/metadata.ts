import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const SITE_NAME = "Coya's Site";

export function buildUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

export function articleMetadata(post: {
  title: string;
  summary: string;
  slug: string;
  date: string;
  path: string;
}): Metadata {
  const url = buildUrl(`/${post.path}/${post.slug}`);
  const ogImage = buildUrl(`/api/og?title=${encodeURIComponent(post.title)}&date=${encodeURIComponent(post.date)}`);

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [ogImage],
    },
  };
}
