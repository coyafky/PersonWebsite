import type { SkillPost } from "@/lib/content/schemas";

export function SkillEvidence({ skill }: { skill: SkillPost }) {
  return (
    <section className="skill-evidence" aria-labelledby="skill-evidence-title">
      <div>
        <span className="section-kicker">EVIDENCE / BOUNDARIES</span>
        <h2 id="skill-evidence-title">改造点与验证记录</h2>
      </div>
      <div className="skill-evidence-columns">
        <div>
          <h3>我的改造 / 设计决策</h3>
          <ul>
            {skill.changes.map((change) => <li key={change}>{change}</li>)}
          </ul>
        </div>
        <div>
          <h3>验证与边界</h3>
          <ul>
            {skill.evidence.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
