import Link from "next/link";
import type { SkillPost } from "@/lib/content/schemas";

type SkillCardProps = {
  skill: SkillPost;
  relatedProjectSlugs?: string[];
};

const contributionLabels: Record<SkillPost["contribution"], string> = {
  original: "原创开发",
  adaptation: "基于第三方改造",
  analysis: "解析与实测",
};

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <article className="skill-card">
      <Link className="skill-card-link" href={`/skills/${skill.slug}`}>
        {skill.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- card cover uses the same local content asset contract as blog covers.
          <img className="skill-card-cover" src={skill.cover} alt={skill.coverAlt ?? ""} loading="lazy" />
        ) : (
          <div className="skill-card-flow" aria-label="工作流预览">
            <span>{skill.input}</span>
            <span aria-hidden="true">→</span>
            <span>{skill.output}</span>
          </div>
        )}
        <div className="skill-card-content">
          <div className="skill-card-meta">
            <span className="skill-card-label">{contributionLabels[skill.contribution]}</span>
            <span>{skill.scenario}</span>
          </div>
          <h2>{skill.title}</h2>
          <p className="skill-card-summary">{skill.summary}</p>
          <p className="skill-card-attribution">
            <span>来源：{skill.origin}</span>
            <span>贡献：{skill.contributionSummary}</span>
          </p>
          <span className="skill-card-cta">查看实践 <span aria-hidden="true">↗</span></span>
        </div>
      </Link>
    </article>
  );
}
