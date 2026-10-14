import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx-content";
import { ArticleLayout } from "@/components/article-layout";
import { ProjectDetails } from "@/components/project-details";
import {
  getContentBySlug,
  getProjectDetailPosts,
  getProjectPosts,
} from "@/lib/content";
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

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
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

  // Older case studies repeat the frontmatter title as a leading H1.
  const trimmedBody = project.body.trimStart();
  const titleLine = `# ${project.title}`;
  const body =
    trimmedBody.split(/\r?\n/, 1)[0] === titleLine
      ? trimmedBody.slice(titleLine.length).trimStart()
      : project.body;
  const headings = extractHeadings(body);
  const url = buildUrl(`/projects/${project.slug}`);
  const detailPosts = await getProjectDetailPosts(project);

  let seriesPrev = null;
  let seriesNext = null;
  if (project.series) {
    const seriesProjects = allProjects
      .filter((p) => p.series === project.series)
      .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
    const idx = seriesProjects.findIndex((p) => p.slug === project.slug);
    if (idx > 0)
      seriesPrev = {
        title: seriesProjects[idx - 1].title,
        slug: `/projects/${seriesProjects[idx - 1].slug}`,
        date: seriesProjects[idx - 1].date,
      };
    if (idx < seriesProjects.length - 1)
      seriesNext = {
        title: seriesProjects[idx + 1].title,
        slug: `/projects/${seriesProjects[idx + 1].slug}`,
        date: seriesProjects[idx + 1].date,
      };
  }

  const postIdx = allProjects.findIndex((p) => p.slug === slug);
  const prevPost = postIdx > 0 ? allProjects[postIdx - 1] : undefined;
  const nextPost =
    postIdx < allProjects.length - 1 ? allProjects[postIdx + 1] : undefined;

  return (
    <ArticleLayout headings={headings}>
      <BlogPostingJsonLd post={project} path="projects" />
      <ArticleKeyboardNav
        prevUrl={prevPost ? `/projects/${prevPost.slug}` : undefined}
        nextUrl={nextPost ? `/projects/${nextPost.slug}` : undefined}
      />
      <article className="article-shell">
        <header className="article-header">
          <Link className="article-back" href="/projects">
            ← 全部项目案例
          </Link>
          <span>
            {project.stack.join(" / ")} ·{" "}
            <span className="reading-time">
              {readingTimeLabel(project.body)}
            </span>
            {project.stage ? ` · ${project.stage}` : null}
          </span>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </header>
        <section className="evidence-grid">
          <div>
            <h2>我的职责</h2>
            <p>{project.role}</p>
          </div>
          <div>
            <h2>交付与结果</h2>
            <ul>
              {project.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
        <MdxContent source={body} />
        <ProjectDetails posts={detailPosts} />
        <SeriesNav
          series={project.series ?? ""}
          prev={seriesPrev}
          next={seriesNext}
        />
        <section className="resume-block">
          <h2>项目摘要 · English</h2>
          {project.englishSummary ? <p>{project.englishSummary}</p> : null}
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
