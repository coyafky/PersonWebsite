import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  type AiTrackerPost,
  type BlogPost,
  type CareerPost,
  type ContentKind,
  type ProjectPost,
  type SiteContent,
  type WeeklyPost,
  contentStatusSchema,
  schemaByKind,
} from "./schemas";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const SUPPORTED_EXTENSIONS = new Set([".md", ".mdx"]);

const statusProbeSchema = z.object({
  status: contentStatusSchema.default("draft"),
});

type CollectionMap = {
  blog: BlogPost;
  weekly: WeeklyPost;
  projects: ProjectPost;
  career: CareerPost;
  "ai-tracker": AiTrackerPost;
};

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function byNewestDate<T extends { date: string }>(items: T[]) {
  return items.toSorted((a, b) => b.date.localeCompare(a.date));
}

function toSlug(fileName: string) {
  return fileName.replace(/\.(md|mdx)$/i, "");
}

function formatValidationError(kind: ContentKind, slug: string, error: z.ZodError) {
  const details = error.issues
    .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
    .join("; ");

  return `Invalid ${kind} content "${slug}": ${details}`;
}

async function readCollection(kind: ContentKind): Promise<SiteContent[]> {
  const directory = path.join(CONTENT_ROOT, kind);

  if (!(await fileExists(directory))) {
    return [];
  }

  const entries = await fs.readdir(directory, { withFileTypes: true });
  const items = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .filter((entry) => SUPPORTED_EXTENSIONS.has(path.extname(entry.name)))
      .map(async (entry) => {
        const filePath = path.join(directory, entry.name);
        const raw = await fs.readFile(filePath, "utf8");
        const parsed = matter(raw);
        const slug = toSlug(entry.name);
        const extension = path.extname(entry.name) as ".md" | ".mdx";
        const statusProbe = statusProbeSchema.safeParse(parsed.data);
        const status = statusProbe.success ? statusProbe.data.status : "draft";

        const result = schemaByKind[kind].safeParse({
          ...parsed.data,
          kind,
          slug,
          filePath,
          extension,
          body: parsed.content.trim(),
        });

        if (!result.success) {
          if (status === "published") {
            throw new Error(formatValidationError(kind, slug, result.error));
          }

          console.warn(formatValidationError(kind, slug, result.error));
          return null;
        }

        return result.data as SiteContent;
      }),
  );

  return byNewestDate(items.filter((item): item is SiteContent => item !== null));
}

function publishedOnly<T extends SiteContent>(items: T[]) {
  return items.filter((item) => item.status === "published");
}

function assertUniqueSlugs(items: SiteContent[], kind: ContentKind) {
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item.slug)) {
      throw new Error(`Duplicate ${kind} slug: ${item.slug}`);
    }

    seen.add(item.slug);
  }
}

async function getCollection(kind: ContentKind, includeDrafts = false) {
  const items = await readCollection(kind);
  assertUniqueSlugs(items, kind);
  return includeDrafts ? items : publishedOnly(items);
}

export async function getBlogPosts(includeDrafts = false): Promise<BlogPost[]> {
  const items = await getCollection("blog", includeDrafts);
  return items.filter((item): item is BlogPost => item.kind === "blog");
}

export async function getWeeklyPosts(includeDrafts = false): Promise<WeeklyPost[]> {
  const items = await getCollection("weekly", includeDrafts);
  return items.filter((item): item is WeeklyPost => item.kind === "weekly");
}

export async function getProjectPosts(includeDrafts = false): Promise<ProjectPost[]> {
  const items = await getCollection("projects", includeDrafts);
  return items.filter((item): item is ProjectPost => item.kind === "projects");
}

export async function getCareerPosts(includeDrafts = false): Promise<CareerPost[]> {
  const items = await getCollection("career", includeDrafts);
  return items.filter((item): item is CareerPost => item.kind === "career");
}

export async function getFeaturedProjects() {
  const projects = await getProjectPosts();
  return projects.filter((project) => project.featured).slice(0, 3);
}

export async function getAiTrackerPosts(includeDrafts = false): Promise<AiTrackerPost[]> {
  const items = await getCollection("ai-tracker", includeDrafts);
  return items.filter((item): item is AiTrackerPost => item.kind === "ai-tracker");
}

export async function getContentBySlug<K extends ContentKind>(kind: K, slug: string) {
  const items = (await getCollection(kind)) as CollectionMap[K][];
  return items.find((item) => item.slug === slug) ?? null;
}

export type RelatedRef = {
  blog?: string[];
  weekly?: string[];
  projects?: string[];
  career?: string[];
};

export type ResolvedRelated = {
  kind: "blog" | "weekly" | "projects" | "career";
  slug: string;
  title: string;
};

type RelatedCollectionKind = ResolvedRelated["kind"];

function buildTitleMap<T extends { slug: string; title: string }>(items: T[]) {
  return new Map(items.map((item) => [item.slug, item.title]));
}

export async function getRelatedTitles(
  map: RelatedRef | undefined,
): Promise<ResolvedRelated[]> {
  if (!map) {
    return [];
  }

  const kinds: RelatedCollectionKind[] = ["blog", "weekly", "projects", "career"];

  const [blogItems, weeklyItems, projectItems, careerItems] = await Promise.all([
    getBlogPosts(),
    getWeeklyPosts(),
    getProjectPosts(),
    getCareerPosts(),
  ]);

  const titleMaps: Record<RelatedCollectionKind, Map<string, string>> = {
    blog: buildTitleMap(blogItems),
    weekly: buildTitleMap(weeklyItems),
    projects: buildTitleMap(projectItems),
    career: buildTitleMap(careerItems),
  };

  const resolved: ResolvedRelated[] = [];
  for (const kind of kinds) {
    const slugs = map[kind] ?? [];
    const titleMap = titleMaps[kind];
    for (const slug of slugs) {
      const title = titleMap.get(slug);
      if (title === undefined) {
        continue; // silently skip missing slugs (drafts / typos / archived)
      }
      resolved.push({ kind, slug, title });
    }
  }
  return resolved;
}
