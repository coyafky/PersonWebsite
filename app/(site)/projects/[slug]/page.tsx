import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx-content";
import { ArticleLayout } from "@/components/article-layout";
import { getContentBySlug, getProjectPosts } from "@/lib/content";
import { extractHeadings } from "@/lib/content/headings";
import { articleMetadata, buildUrl } from "@/lib/metadata";
import { readingTimeLabel } from "@/lib/reading-time";
import { BlogPostingJsonLd } from "@/components/json-ld";
import { ShareButtons } from "@/components/share-buttons";
import { SeriesNav } from "@/components/series-nav";
import { ArticleKeyboardNav } from "@/components/article-keyboard-nav";

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

  return articleMetadata({ ...project, path: "projects" });
}

export default async function ProjectDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getContentBySlug("projects", slug),
    getProjectPosts(),
  ]);

  if (!project) {
    notFound();
  }

  const headings = extractHeadings(project.body);
  const url = buildUrl(`/projects/${project.slug}`);

  let seriesPrev = null;
  let seriesNext = null;
  if (project.series) {
    const seriesProjects = allProjects
      .filter((p) => p.series === project.series)
      .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
    const idx = seriesProjects.findIndex((p) => p.slug === project.slug);
    if (idx > 0) seriesPrev = { title: seriesProjects[idx - 1].title, slug: `/projects/${seriesProjects[idx - 1].slug}`, date: seriesProjects[idx - 1].date };
    if (idx < seriesProjects.length - 1) seriesNext = { title: seriesProjects[idx + 1].title, slug: `/projects/${seriesProjects[idx + 1].slug}`, date: seriesProjects[idx + 1].date };
  }

  const postIdx = allProjects.findIndex((p) => p.slug === slug);
  const prevPost = postIdx > 0 ? allProjects[postIdx - 1] : undefined;
  const nextPost = postIdx < allProjects.length - 1 ? allProjects[postIdx + 1] : undefined;

  return (
    <ArticleLayout headings={headings}>
      <BlogPostingJsonLd post={project} path="projects" />
      <ArticleKeyboardNav
        prevUrl={prevPost ? `/projects/${prevPost.slug}` : undefined}
        nextUrl={nextPost ? `/projects/${nextPost.slug}` : undefined}
      />
      <article className="article-shell">
        <header className="article-header">
          <span>{project.stack.join(" / ")} · <span className="reading-time">{readingTimeLabel(project.body)}</span></span>
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
        <SeriesNav series={project.series ?? ""} prev={seriesPrev} next={seriesNext} />
        <section className="resume-block">
          <h2>Resume Bullets</h2>
          <ul>
            {project.resumeBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>
        <ShareButtons title={project.title} url={url} />
      </article>
    </ArticleLayout>
  );
}
