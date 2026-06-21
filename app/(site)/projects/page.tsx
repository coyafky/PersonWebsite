import { CollectionList } from "@/components/collection-list";
import { EntryCardProject } from "@/components/entry-card-project";
import { getProjectPosts } from "@/lib/content";

export const metadata = {
  title: "Projects",
  description: "Things I built. Each entry is a verifiable record.",
};

export default async function ProjectsPage() {
  const projects = await getProjectPosts();

  return (
    <div className="page-shell">
      <CollectionList
        title="Projects"
        description="Things I built. Each entry is a verifiable record."
      >
        <div className="entry-card-project-grid">
          {projects.map((project) => (
            <EntryCardProject
              key={project.slug}
              href={`/projects/${project.slug}`}
              title={project.title}
              summary={project.summary}
              stack={project.stack}
              impact={project.impact}
              featured={project.featured}
              period={project.period}
              cover={project.cover}
            />
          ))}
        </div>
      </CollectionList>
    </div>
  );
}
