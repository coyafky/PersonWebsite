import Link from "next/link";
import type { ReactNode } from "react";
import { ContentCard } from "@/components/content-card";
import {
  Icons0Blog,
  Icons0Calendar,
  Icons0Document,
  Icons0Idea,
  Icons0Notebook,
  Icons0Portfolio,
  Icons0Rocket,
} from "@/components/icons0";
import { getBlogPosts, getFeaturedProjects, getWeeklyPosts } from "@/lib/content";

export default async function HomePage() {
  const [blogPosts, weeklyPosts, featuredProjects] = await Promise.all([
    getBlogPosts(),
    getWeeklyPosts(),
    getFeaturedProjects(),
  ]);

  return (
    <div className="page-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <h1>记录想法、项目和成长，把经历沉淀为求职证据。</h1>
          <p>
            这是一个面向长期写作和职业准备的个人网站。Blog 记录技术与想法，Weekly
            保留成长轨迹，Projects 和 Career 把项目经验整理成可验证的能力索引。
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/projects">
              <Icons0Portfolio />
              View Projects
            </Link>
            <Link className="button secondary" href="/career">
              <Icons0Document />
              Career Notes
            </Link>
          </div>
        </div>
        <div className="hero-panel" aria-label="Content workflow preview">
          <div className="panel-row strong">
            <Icons0Notebook />
            <span>Markdown / MDX</span>
            <span>source</span>
          </div>
          <div className="panel-row">
            <Icons0Idea />
            <span>Hermes drafts</span>
            <span>review</span>
          </div>
          <div className="panel-row">
            <Icons0Portfolio />
            <span>Projects</span>
            <span>evidence</span>
          </div>
          <div className="panel-row">
            <Icons0Document />
            <span>Career</span>
            <span>bullets</span>
          </div>
        </div>
      </section>

      <section className="icon-map" aria-label="Content map">
        <div>
          <Icons0Blog />
          <span>Blog</span>
        </div>
        <div>
          <Icons0Calendar />
          <span>Weekly</span>
        </div>
        <div>
          <Icons0Portfolio />
          <span>Projects</span>
        </div>
        <div>
          <Icons0Rocket />
          <span>Career-ready</span>
        </div>
      </section>

      <section className="section-grid">
        <ContentSection title="Latest Blog" href="/blog">
          {blogPosts.slice(0, 2).map((post) => (
            <ContentCard
              href={`/blog/${post.slug}`}
              icon={Icons0Blog}
              key={post.slug}
              meta={post.date}
              summary={post.summary}
              tags={post.tags}
              title={post.title}
            />
          ))}
          {blogPosts.length === 0 ? <EmptyState label="No published Blog posts yet." /> : null}
        </ContentSection>

        <ContentSection title="Weekly Notes" href="/weekly">
          {weeklyPosts.slice(0, 2).map((post) => (
            <ContentCard
              href={`/weekly/${post.slug}`}
              icon={Icons0Calendar}
              key={post.slug}
              meta={post.week}
              summary={post.summary}
              tags={post.tags}
              title={post.title}
            />
          ))}
          {weeklyPosts.length === 0 ? <EmptyState label="No published Weekly notes yet." /> : null}
        </ContentSection>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <h2>Featured Projects</h2>
          <Link href="/projects">View all</Link>
        </div>
        <div className="card-grid">
          {featuredProjects.map((project) => (
            <ContentCard
              href={`/projects/${project.slug}`}
              icon={Icons0Portfolio}
              key={project.slug}
              meta={project.stack.join(" / ")}
              summary={project.summary}
              tags={project.impact.slice(0, 2)}
              title={project.title}
            />
          ))}
          {featuredProjects.length === 0 ? <EmptyState label="No featured projects yet." /> : null}
        </div>
      </section>
    </div>
  );
}

function ContentSection({
  children,
  href,
  title,
}: Readonly<{ children: ReactNode; href: string; title: string }>) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <h2>{title}</h2>
        <Link href={href}>View all</Link>
      </div>
      <div className="stack-list">{children}</div>
    </section>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="empty-state">{label}</p>;
}
