import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx-content";
import { getContentBySlug, getProjectPosts } from "@/lib/content";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjectPosts();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getContentBySlug("projects", slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const project = await getContentBySlug("projects", slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="article-shell">
      <header className="article-header">
        <span>{project.stack.join(" / ")}</span>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        {project.englishSummary ? <p className="english-summary">{project.englishSummary}</p> : null}
      </header>
      <section className="evidence-grid">
        <div>
          <h2>Role</h2>
          <p>{project.role}</p>
        </div>
        <div>
          <h2>Impact</h2>
          <ul>
            {project.impact.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <MdxContent source={project.body} />
      <section className="resume-block">
        <h2>Resume Bullets</h2>
        <ul>
          {project.resumeBullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
