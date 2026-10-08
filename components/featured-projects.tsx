import Link from "next/link";
import { EntryCardProject } from "@/components/entry-card-project";
import type { ProjectPost } from "@/lib/content";

/**
 * 首页「精选作品」区。
 *
 * 刻意复用 `EntryCardProject`（只把 `featured` 钉成 false）而不是另写一套卡片 ——
 * `featured: true` 在项目列表页会触发 `entry-card-project-featured`
 * （grid-column: 1 / -1，整行铺开），首页要的是一排并排卡片，
 * 所以这里不把数据里的 featured 透给布局。不引入新的视觉体系。
 */
export function FeaturedProjects({ projects }: { projects: ProjectPost[] }) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="content-section featured-projects" aria-label="精选作品">
      <div className="section-heading">
        <div>
          <span className="section-kicker">SELECTED WORK</span>
          <h2>精选作品</h2>
        </div>
        <Link href="/projects">全部作品 →</Link>
      </div>
      <div className="entry-card-project-grid">
        {projects.map((project) => (
          <EntryCardProject
            key={project.slug}
            href={`/projects/${project.slug}`}
            title={project.title}
            summary={project.summary}
            stack={project.stack}
            impact={project.impact}
            featured={false}
            period={project.period}
            cover={project.cover}
            stage={project.stage}
          />
        ))}
      </div>
    </section>
  );
}
