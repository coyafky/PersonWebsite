import { ContentCard } from "@/components/content-card";
import { Icons0Portfolio } from "@/components/icons0";
import { getProjectPosts } from "@/lib/content";

export const metadata = {
  title: "Projects",
  description: "Project evidence and portfolio records.",
};

export default async function ProjectsPage() {
  const projects = await getProjectPosts();

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1>Projects</h1>
        <p>项目档案、技术方案、结果影响和可复用的简历证据。</p>
      </header>
      <div className="card-grid">
        {projects.map((project) => (
          <ContentCard
            href={`/projects/${project.slug}`}
            icon={<Icons0Portfolio />}
            key={project.slug}
            meta={project.stack.join(" / ")}
            summary={project.summary}
            tags={project.impact.slice(0, 2)}
            title={project.title}
          />
        ))}
      </div>
    </div>
  );
}
