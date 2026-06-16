import Link from "next/link";
import type { ReactNode } from "react";
import { ContentCard } from "@/components/content-card";
import { HeroSection, HeroItem } from "@/components/hero-section";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/animations";
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
      <HeroSection
        copy={
          <>
            <HeroItem>
              <h1>记录想法、项目和成长，把经历沉淀为求职证据。</h1>
            </HeroItem>
            <HeroItem>
              <p>
                这是一个面向长期写作和职业准备的个人网站。Blog 记录技术与想法，Weekly
                保留成长轨迹，Projects 和 Career 把项目经验整理成可验证的能力索引。
              </p>
            </HeroItem>
            <HeroItem>
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
            </HeroItem>
          </>
        }
        panel={
          <>
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
          </>
        }
      />

      <RevealOnScroll delay={0.1}>
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
      </RevealOnScroll>

      <section className="section-grid">
        <ContentSection title="Latest Blog" href="/blog">
          {blogPosts.length > 0 ? (
            <StaggerContainer>
              {blogPosts.slice(0, 2).map((post) => (
                <StaggerItem key={post.slug}>
                  <ContentCard
                    href={`/blog/${post.slug}`}
                    icon={<Icons0Blog />}
                    meta={post.date}
                    summary={post.summary}
                    tags={post.tags}
                    title={post.title}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <EmptyState label="No published Blog posts yet." />
          )}
        </ContentSection>

        <ContentSection title="Weekly Notes" href="/weekly">
          {weeklyPosts.length > 0 ? (
            <StaggerContainer>
              {weeklyPosts.slice(0, 2).map((post) => (
                <StaggerItem key={post.slug}>
                  <ContentCard
                    href={`/weekly/${post.slug}`}
                    icon={<Icons0Calendar />}
                    meta={post.week}
                    summary={post.summary}
                    tags={post.tags}
                    title={post.title}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <EmptyState label="No published Weekly notes yet." />
          )}
        </ContentSection>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <h2>Featured Projects</h2>
          <Link href="/projects">View all</Link>
        </div>
        {featuredProjects.length > 0 ? (
          <div className="card-grid">
            <StaggerContainer delay={0.1}>
              {featuredProjects.map((project) => (
                <StaggerItem key={project.slug}>
                  <ContentCard
                    href={`/projects/${project.slug}`}
                    icon={<Icons0Portfolio />}
                    meta={project.stack.join(" / ")}
                    summary={project.summary}
                    tags={project.impact.slice(0, 2)}
                    title={project.title}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        ) : (
          <EmptyState label="No featured projects yet." />
        )}
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
