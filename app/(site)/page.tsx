import Link from "next/link";
import type { ReactNode } from "react";
import { ContentCard } from "@/components/content-card";
import { HeroSection, HeroItem } from "@/components/hero-section";
import {
  Icons0Blog,
  Icons0Book,
  Icons0Calendar,
  Icons0Notebook,
  Icons0Portfolio,
  Icons0Profile,
  Icons0Radar,
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
    href: "/ai-tracker",
    icon: <Icons0Radar />,
    title: "AI Tracker",
    description: "持续追踪的 AI 行业信号流。",
  },
  {
    href: "/weekly",
    icon: <Icons0Calendar />,
    title: "Weekly",
    description: "每周记录读了什么、做了什么、卡在哪。",
  },
  {
    href: "/learning",
    icon: <Icons0Notebook />,
    title: "Learning",
    description: "按主题整理的结构化学习笔记。",
  },
  {
    href: "/book-list",
    icon: <Icons0Book />,
    title: "Book List",
    description: "读过的书、读书笔记、长期沉淀的认知。",
  },
  {
    href: "/projects",
    icon: <Icons0Portfolio />,
    title: "Projects",
    description: "做过的项目与可验证的能力证据。",
  },
  {
    href: "/about",
    icon: <Icons0Profile />,
    title: "About",
    description: "关于我、教育背景、技术栈与求职材料。",
  },
];

export default function HomePage() {
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
                保留成长轨迹，Projects 把项目经验整理成可验证的能力索引。
              </p>
            </HeroItem>
            <HeroItem>
              <div className="hero-actions">
                <Link className="button primary" href="/projects">
                  <Icons0Portfolio />
                  View Projects
                </Link>
                <Link className="button secondary" href="/about#career">
                  <Icons0Profile />
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
              <Icons0Blog />
              <span>Blog</span>
              <span>essays</span>
            </div>
            <div className="panel-row">
              <Icons0Calendar />
              <span>Weekly</span>
              <span>log</span>
            </div>
            <div className="panel-row">
              <Icons0Radar />
              <span>AI Tracker</span>
              <span>signals</span>
            </div>
            <div className="panel-row">
              <Icons0Portfolio />
              <span>Projects</span>
              <span>evidence</span>
            </div>
          </>
        }
      />

      <section className="content-section" aria-label="Sections">
        <div className="section-heading">
          <h2>Sections</h2>
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