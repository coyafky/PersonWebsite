import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/content-card";
import { Icons0Blog, Icons0Calendar } from "@/components/icons0";
import { getBlogPosts, getWeeklyPosts } from "@/lib/content";
import type { BlogPost, WeeklyPost } from "@/lib/content/schemas";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

type TaggedItem = {
  href: string;
  icon: "blog" | "weekly";
  title: string;
  summary: string;
  date: string;
  tags: string[];
};

function byDate(a: TaggedItem, b: TaggedItem) {
  return b.date.localeCompare(a.date);
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `Content tagged with "${tag}"`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const [blog, weekly] = await Promise.all([getBlogPosts(), getWeeklyPosts()]);

  const blogMatches: TaggedItem[] = blog
    .filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
    .map((p) => ({
      href: `/blog/${p.slug}`,
      icon: "blog" as const,
      title: p.title,
      summary: p.summary,
      date: p.date,
      tags: p.tags,
    }));

  const weeklyMatches: TaggedItem[] = weekly
    .filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
    .map((p) => ({
      href: `/weekly/${p.slug}`,
      icon: "weekly" as const,
      title: p.title,
      summary: p.summary,
      date: p.date,
      tags: p.tags,
    }));

  const items = [...blogMatches, ...weeklyMatches].sort(byDate);

  if (items.length === 0) {
    notFound();
  }

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>#{tag}</h1>
        <p>{items.length} article{items.length !== 1 ? "s" : ""}</p>
      </header>
      <div className="stack-list">
        {items.map((item) => (
          <ContentCard
            href={item.href}
            icon={item.icon === "blog" ? <Icons0Blog /> : <Icons0Calendar />}
            key={item.href}
            meta={item.date}
            summary={item.summary}
            tags={item.tags}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
}
