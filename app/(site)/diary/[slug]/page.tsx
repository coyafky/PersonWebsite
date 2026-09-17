import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx-content";
import { ArticleLayout } from "@/components/article-layout";
import { getContentBySlug, getDiaryPosts } from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";
import { articleMetadata, buildUrl } from "@/lib/metadata";
import { readingTimeLabel } from "@/lib/reading-time";
import { BlogPostingJsonLd } from "@/components/json-ld";
import { ShareButtons } from "@/components/share-buttons";
import { ArticleKeyboardNav } from "@/components/article-keyboard-nav";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

const SOURCE_LABEL: Record<string, string> = {
  log: "当日记录",
  weekly: "据周记重建",
  memory: "据记忆笔记重建",
};

const WEEKDAYS = "日一二三四五六";

function weekdayOf(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? "" : `周${WEEKDAYS[d.getUTCDay()]}`;
}

export async function generateStaticParams() {
  const posts = await getDiaryPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentBySlug("diary", slug);

  if (!post) {
    return {};
  }

  return articleMetadata({ ...post, path: "diary" });
}

export default async function DiaryDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getContentBySlug("diary", slug),
    getDiaryPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.body);
  const url = buildUrl(`/diary/${post.slug}`);

  // 列表按日期倒序：索引 -1 是“后一天”，+1 是“前一天”
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = idx >= 0 && idx < allPosts.length - 1 ? allPosts[idx + 1] : undefined;
  const nextPost = idx > 0 ? allPosts[idx - 1] : undefined;

  return (
    <ArticleLayout headings={headings}>
      <BlogPostingJsonLd post={post} path="diary" />
      <ArticleKeyboardNav
        prevUrl={prevPost ? `/diary/${prevPost.slug}` : undefined}
        nextUrl={nextPost ? `/diary/${nextPost.slug}` : undefined}
      />
      <article className="article-shell">
        <header className="article-header">
          <span>
            {post.date} {weekdayOf(post.date)} ·{" "}
            <span className="reading-time">{readingTimeLabel(post.body)}</span>
          </span>
          <h1>{post.title}</h1>
          <p>{post.summary}</p>
          <p className="diary-meta">
            <span className="diary-source">{SOURCE_LABEL[post.source] ?? post.source}</span>
            {post.mood ? <span className="diary-mood">{post.mood}</span> : null}
          </p>
        </header>
        <MdxContent source={post.body} />
        <ShareButtons title={post.title} url={url} />
      </article>
    </ArticleLayout>
  );
}
