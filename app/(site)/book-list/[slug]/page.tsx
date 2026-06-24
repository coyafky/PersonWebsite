import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { BlogPostingJsonLd } from "@/components/json-ld";
import { MdxContent } from "@/components/mdx-content";
import { ShareButtons } from "@/components/share-buttons";
import { getBookListPosts, getContentBySlug } from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";
import { articleMetadata, buildUrl } from "@/lib/metadata";
import { readingTimeLabel } from "@/lib/reading-time";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getBookListPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentBySlug("book-list", slug);

  if (!post) {
    return {};
  }

  return articleMetadata({ ...post, path: "book-list" });
}

export default async function BookListDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const post = await getContentBySlug("book-list", slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.body);
  const url = buildUrl(`/book-list/${post.slug}`);

  return (
    <ArticleLayout headings={headings}>
      <BlogPostingJsonLd post={post} path="book-list" />
      <article className="article-shell">
        <header className="article-header">
          <span>
            {post.date} · <span className="reading-time">{readingTimeLabel(post.body)}</span>
          </span>
          <h1>{post.title}</h1>
          <p className="book-detail-author">by {post.author}</p>
          <p>{post.summary}</p>
          {post.englishSummary ? (
            <p className="english-summary">{post.englishSummary}</p>
          ) : null}
        </header>

        <section className="book-detail-info">
          <h2>Book Info</h2>
          <div className="book-detail-row">
            <span className="book-detail-row__label">Author</span>
            <span className="book-detail-row__value">{post.author}</span>
          </div>
          <div className="book-detail-row">
            <span className="book-detail-row__label">Genre</span>
            <span className="book-detail-row__value">{post.genre}</span>
          </div>
          <div className="book-detail-row">
            <span className="book-detail-row__label">Tags</span>
            <span className="book-detail-row__value">
              {post.tags.length > 0 ? post.tags.map((t) => `#${t}`).join(" · ") : "—"}
            </span>
          </div>
          <div className="book-detail-row">
            <span className="book-detail-row__label">Finished</span>
            <span className="book-detail-row__value">{post.date}</span>
          </div>
        </section>

        <MdxContent source={post.body} />

        <ShareButtons title={post.title} url={url} />
      </article>
    </ArticleLayout>
  );
}
