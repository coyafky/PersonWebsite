import Link from "next/link";
import type { ReactNode } from "react";
import { ContentCard } from "@/components/content-card";
import { FeaturedProjects } from "@/components/featured-projects";
import { HeroSection, HeroItem } from "@/components/hero-section";
import { getFeaturedProjects } from "@/lib/content";
import {
  Icons0Blog,
  Icons0Image,
  Icons0Notebook,
  Icons0Portfolio,
  Icons0Profile,
} from "@/components/icons0";

type PortalEntry = {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
};

const portalEntries: ReadonlyArray<PortalEntry> = [
  {
    href: "/blog",
    icon: <Icons0Blog />,
    title: "Blog",
    description: "技术、想法和工程实践的长文。",
  },
  {
    href: "/notes",
    icon: <Icons0Notebook />,
    title: "Notes",
    description: "学习笔记、读书笔记与课程笔记，按集合归档。",
  },
  {
    href: "/projects",
    icon: <Icons0Portfolio />,
    title: "Projects",
    description: "做过的项目与可验证的能力证据。",
  },
  {
    href: "/gallery",
    icon: <Icons0Image />,
    title: "Gallery",
    description: "AI 生图实验、提示词与视觉变量的对照档案。",
  },
  {
    href: "/about",
    icon: <Icons0Profile />,
    title: "About",
    description: "关于我、教育背景、技术栈与求职材料。",
  },
];

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects(3);

  return (
    <div className="page-shell home-shell">
      <HeroSection
        copy={
          <>
            <HeroItem>
              <h1 id="home-hero-title">
                把模糊的想法，
                <span>做成可验证的工作。</span>
              </h1>
            </HeroItem>
            <HeroItem>
              <p>
                我是 Coya，计算机科学背景的 AI 提效实践者。这里记录我如何把 Agent、内容系统和
                AI 视觉实验接进真实流程，也保留每次学习、试错和交付留下的证据。
              </p>
            </HeroItem>
            <HeroItem>
              <div className="hero-actions">
                <Link className="button primary" href="/projects">
                  <Icons0Portfolio />
                  View Projects
                </Link>
                <Link className="button secondary" href="/about">
                  <Icons0Profile />
                  About Coya
                </Link>
              </div>
            </HeroItem>
          </>
        }
        panel={
          <>
            <div className="panel-row strong">
              <Icons0Notebook />
              <span>Knowledge Field</span>
              <span>source → proof</span>
            </div>
            <div className="panel-row">
              <Icons0Blog />
              <span>Blog / Notes</span>
              <span>thinking</span>
            </div>
            <div className="panel-row">
              <Icons0Portfolio />
              <span>Projects</span>
              <span>evidence</span>
            </div>
          </>
        }
      />

      <FeaturedProjects projects={featuredProjects} />

      <section className="content-section portal-section" aria-label="Sections">
        <div className="section-heading">
          <div>
            <span className="section-kicker">EXPLORE THE FIELD</span>
            <h2>从哪里开始</h2>
          </div>
          <Link href="/about">About this site</Link>
        </div>
        <div className="card-grid">
          {portalEntries.map((entry) => (
            <ContentCard
              key={entry.href}
              href={entry.href}
              icon={entry.icon}
              title={entry.title}
              summary={entry.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
