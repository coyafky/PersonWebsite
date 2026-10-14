import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MdxContent } from "@/components/mdx-content";
import { RelatedPosts } from "@/components/related-posts";
import { SeriesNav } from "@/components/series-nav";
import { extractHeadings } from "@/lib/content/headings";
import { getMdxSample, mdxSamples } from "@/lib/mdx-samples";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return mdxSamples.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sample = await getMdxSample((await params).slug);
  return {
    title: sample?.title ?? "组件样板",
    robots: { index: false, follow: false },
  };
}
export default async function MdxSamplePage({ params }: Props) {
  const { slug } = await params;
  const sample = await getMdxSample(slug);
  if (!sample) notFound();
  const index = mdxSamples.findIndex((item) => item.slug === slug);
  const link = (offset: number) => {
    const item = mdxSamples[index + offset];
    return item
      ? { title: item.title, slug: `/labs/mdx/${item.slug}`, date: "" }
      : null;
  };
  return (
    <ArticleLayout headings={extractHeadings(sample.body)}>
      <article className="article-shell">
        <header className="article-header">
          <Link href="/labs/mdx">← 博客组件预览</Link>
          <h1>{sample.title}</h1>
          <p>{sample.summary}</p>
        </header>
        <MdxContent source={sample.body} />
        <SeriesNav series="博客组件样板" prev={link(-1)} next={link(1)} />
      </article>
      <RelatedPosts
        posts={mdxSamples
          .filter((item) => item.slug !== slug)
          .map((item) => ({
            title: item.title,
            slug: item.slug,
            path: "labs/mdx",
            date: "",
          }))}
      />
    </ArticleLayout>
  );
}
