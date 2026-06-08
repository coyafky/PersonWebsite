import { BriefcaseBusiness, FileText, Sparkles } from "lucide-react";
import { getFeaturedProjects } from "@/lib/content";

export const metadata = {
  title: "Career",
  description: "Career evidence, resume bullets, and project-backed stories.",
};

export default async function CareerPage() {
  const projects = await getFeaturedProjects();

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>Career</h1>
        <p>一个连接技能、项目证据和求职材料的能力索引。</p>
      </header>
      <section className="career-grid">
        <div className="career-panel">
          <BriefcaseBusiness aria-hidden="true" />
          <h2>Focus</h2>
          <p>Frontend engineering, AI-assisted workflows, and product-minded development.</p>
        </div>
        <div className="career-panel">
          <FileText aria-hidden="true" />
          <h2>Resume Material</h2>
          <p>English bullets and STAR stories live in `content/career/` as reviewable drafts.</p>
        </div>
        <div className="career-panel">
          <Sparkles aria-hidden="true" />
          <h2>Evidence</h2>
          <p>Career claims should trace back to real projects, weekly notes, or confirmed experience.</p>
        </div>
      </section>
      <section className="content-section">
        <div className="section-heading">
          <h2>Project Evidence</h2>
        </div>
        <ul className="evidence-list">
          {projects.map((project) => (
            <li key={project.slug}>
              <strong>{project.title}</strong>
              <span>{project.resumeBullets[0]}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
