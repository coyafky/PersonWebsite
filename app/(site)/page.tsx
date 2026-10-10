import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { FeaturedProjects } from "@/components/featured-projects";
import { HeroSection, HeroItem } from "@/components/hero-section";
import { HomeProofCard } from "@/components/home-proof-card";
import { getFeaturedProjects } from "@/lib/content";
import { homePageModel } from "@/lib/home-page";
import {
  Icons0Image,
  Icons0Notebook,
  Icons0Portfolio,
} from "@/components/icons0";

const portalIcons = {
  "/notes": <Icons0Notebook />,
  "/projects": <Icons0Portfolio />,
  "/gallery": <Icons0Image />,
} as const;

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects(3);

  return (
    <div className="page-shell home-shell">
      <HeroSection
        signature={homePageModel.signature}
        copy={
          <>
            <HeroItem>
              <h1 id="home-hero-title">
                从一条笔记开始，
                <span>把它做到能用。</span>
              </h1>
            </HeroItem>
            <HeroItem>
              <p>
                我是 Coya，计算机科学背景的 AI 提效实践者。我把 AI、内容系统和自动化工具接进真实工作，
                并保留从问题、处理到交付的完整证据。
              </p>
            </HeroItem>
            <HeroItem>
              <div className="hero-actions">
                <Link className="button primary" href="/projects">
                  <Icons0Portfolio />
                  看项目证据
                </Link>
                <Link className="button secondary" href="/notes">
                  <Icons0Notebook />
                  了解工作方法
                </Link>
              </div>
            </HeroItem>
          </>
        }
        panel={<HomeProofCard proof={homePageModel.heroProof} />}
      />

      <section className="content-section home-process" aria-labelledby="home-process-title">
        <div className="section-heading home-process-heading">
          <div>
            <span className="section-kicker">HOW THE FIELD MOVES</span>
            <h2 id="home-process-title">从记录，到交付</h2>
          </div>
          <p>每一项工作都留下输入、处理和结果，而不只是一个漂亮的结论。</p>
        </div>
        <div className="home-process-grid">
          {homePageModel.process.map((step) => (
            <article className="home-process-step" key={step.key}>
              <span className="home-process-label">{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <FeaturedProjects projects={featuredProjects} />

      <section className="content-section portal-section" aria-labelledby="home-entry-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">START WITH A PROOF</span>
            <h2 id="home-entry-title">从一个证据开始</h2>
          </div>
          <Link href="/about">About the field</Link>
        </div>
        <div className="card-grid">
          {homePageModel.entryPoints.map((entry) => (
            <ContentCard
              key={entry.href}
              href={entry.href}
              icon={portalIcons[entry.href]}
              title={entry.title}
              summary={entry.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
