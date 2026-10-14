import { CollectionList } from "@/components/collection-list";
import { EntryCardProject } from "@/components/entry-card-project";
import { portfolioCases } from "@/lib/portfolio";
import { getProjectPosts } from "@/lib/content";

export const metadata = {
  title: "项目案例",
  description:
    "企业 AI 应用与营销工作流的实践案例，包含业务问题、个人职责、实际交付与使用边界。",
};

export default async function ProjectsPage() {
  const priority: string[] = portfolioCases.map((item) => item.slug);
  const projects = (await getProjectPosts()).sort((a, b) => {
    const rank = (slug: string) =>
      priority.includes(slug) ? priority.indexOf(slug) : priority.length;
    return rank(a.slug) - rank(b.slug) || b.date.localeCompare(a.date);
  });

  return (
    <div className="page-shell project-index">
      <CollectionList
        title="项目案例"
        eyebrow="WORK / BUSINESS & AI"
        description="从销售跟进、营销内容到知识应用。这里记录每个项目解决的问题、我的工作，以及真实的交付和边界。"
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
              stage={project.stage}
              detailsCount={project.details.length}
            />
          ))}
        </div>
      </CollectionList>
    </div>
  );
}
