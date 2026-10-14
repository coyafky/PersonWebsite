import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { ArticleKeyboardNav } from "@/components/article-keyboard-nav";
import { MdxContent } from "@/components/mdx-content";
import { ShareButtons } from "@/components/share-buttons";
import { SkillEvidence } from "@/components/skill-evidence";
import { extractHeadings } from "@/lib/content/headings";
import { getContentBySlug, getSkillPosts } from "@/lib/content";
import { articleMetadata, buildUrl } from "@/lib/metadata";
import { readingTimeLabel } from "@/lib/reading-time";

const contributionLabels = {
  original: "原创开发",
  adaptation: "基于第三方改造",
  analysis: "解析与实测",
} as const;

type SkillPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const skills = await getSkillPosts();
  return skills.map((skill) => ({ slug: skill.slug }));
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getContentBySlug("skills", slug);
  return skill ? articleMetadata({ ...skill, path: "skills" }) : {};
}

export default async function SkillDetailPage({ params }: SkillPageProps) {
  const { slug } = await params;
  const [skill, allSkills] = await Promise.all([
    getContentBySlug("skills", slug),
    getSkillPosts(),
  ]);

  if (!skill) notFound();

  const index = allSkills.findIndex((item) => item.slug === skill.slug);
  const prev = index > 0 ? allSkills[index - 1] : undefined;
  const next = index >= 0 && index < allSkills.length - 1 ? allSkills[index + 1] : undefined;
  const url = buildUrl(`/skills/${skill.slug}`);

  return (
    <ArticleLayout headings={extractHeadings(skill.body)}>
      <ArticleKeyboardNav
        prevUrl={prev ? `/skills/${prev.slug}` : undefined}
        nextUrl={next ? `/skills/${next.slug}` : undefined}
      />
      <article className="article-shell skill-detail">
        <header className="article-header">
          <Link className="article-back" href="/skills">← 全部工作流实践</Link>
          <span>
            {contributionLabels[skill.contribution]} · {skill.scenario} · {readingTimeLabel(skill.body)}
          </span>
          <h1>{skill.title}</h1>
          <p>{skill.summary}</p>
          {skill.englishSummary ? <p className="english-summary">{skill.englishSummary}</p> : null}
        </header>

        <section className="skill-brief" aria-label="实践摘要">
          <div><span>贡献类型</span><strong>{contributionLabels[skill.contribution]}</strong></div>
          <div><span>业务场景</span><strong>{skill.scenario}</strong></div>
          <div><span>原作 / 来源</span><strong>{skill.origin}</strong></div>
          <div><span>当前状态</span><strong>{skill.status}</strong></div>
          <div className="skill-brief-wide"><span>个人贡献</span><strong>{skill.contributionSummary}</strong></div>
        </section>

        {skill.sourceUrl || skill.license ? (
          <p className="skill-source">
            来源：{skill.sourceUrl ? <a href={skill.sourceUrl} target="_blank" rel="noreferrer">{skill.sourceUrl} ↗</a> : skill.origin}
            {skill.license ? ` · 许可证：${skill.license}` : null}
          </p>
        ) : null}

        <section className="skill-io" aria-label="输入处理输出">
          <div><span>输入</span><p>{skill.input}</p></div>
          <div><span>处理</span><p>{skill.process}</p></div>
          <div><span>输出</span><p>{skill.output}</p></div>
        </section>

        <MdxContent source={skill.body} />
        <SkillEvidence skill={skill} />

        <section className="skill-related" aria-labelledby="skill-related-title">
          <h2 id="skill-related-title">关联材料</h2>
          <div>
            {skill.relatedProjects.map((project) => <Link key={project} href={`/projects/${project}`}>项目：{project} ↗</Link>)}
            {skill.relatedBlogPosts.map((post) => <Link key={post} href={`/blog/${post}`}>文章：{post} ↗</Link>)}
          </div>
        </section>

        <ShareButtons title={skill.title} url={url} />
      </article>
    </ArticleLayout>
  );
}
