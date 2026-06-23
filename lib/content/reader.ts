import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  type AiTrackerPost,
  type BlogPost,
  type BookListPost,
  type CareerPost,
  type ContentKind,
  type LearningPost,
  type ProjectPost,
  type SiteContent,
  type WeeklyPost,
  contentStatusSchema,
  schemaByKind,
} from "./schemas.ts";

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
  learning: LearningPost;
  "book-list": BookListPost;
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

async function readCollection(
  kind: ContentKind,
  subDirectory?: string,
): Promise<SiteContent[]> {
  const directory = subDirectory
    ? path.join(CONTENT_ROOT, kind, subDirectory)
    : path.join(CONTENT_ROOT, kind);

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

export async function getBlogPosts(
  includeDrafts = false,
  // _opts is accepted-but-ignored in v0.3; pagination kicks in later.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _opts?: { page?: number; pageSize?: number },
): Promise<BlogPost[]> {
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

export async function getBookListPosts(includeDrafts = false): Promise<BookListPost[]> {
  const items = await getCollection("book-list", includeDrafts);
  return items.filter((item): item is BookListPost => item.kind === "book-list");
}

export type TopicSummary = {
  topic: string;
  title: string;
  summary: string;
  articleCount: number;
};

function isArticleSlug(slug: string) {
  return !slug.startsWith("_");
}

async function readLearningTopic(topic: string, includeDrafts = false): Promise<LearningPost[]> {
  const items = await readCollection("learning", topic);
  assertUniqueSlugs(items, "learning");
  return items
    .filter((item): item is LearningPost => item.kind === "learning")
    .filter((item) => (includeDrafts ? true : item.status === "published"));
}

export async function getLearningPosts(
  topic: string,
  includeDrafts = false,
): Promise<LearningPost[]> {
  const items = await readLearningTopic(topic, includeDrafts);
  return byNewestDate(items.filter((item) => isArticleSlug(item.slug)));
}

export async function getLearningTopicIndex(
  topic: string,
): Promise<LearningPost | null> {
  const items = await readLearningTopic(topic, false);
  return items.find((item) => item.slug === "_index") ?? null;
}

export async function getLearningPostBySlug(
  topic: string,
  slug: string,
): Promise<LearningPost | null> {
  const items = await readLearningTopic(topic, false);
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getLearningTopics(includeDrafts = false): Promise<TopicSummary[]> {
  const root = path.join(CONTENT_ROOT, "learning");
  if (!(await fileExists(root))) {
    return [];
  }

  const entries = await fs.readdir(root, { withFileTypes: true });
  const topicDirs = entries.filter((entry) => entry.isDirectory());

  const topics = await Promise.all(
    topicDirs.map(async (entry) => {
      const topic = entry.name;
      const [indexPost, articles] = await Promise.all([
        getLearningTopicIndex(topic),
        getLearningPosts(topic, includeDrafts),
      ]);

      if (!indexPost) {
        return null;
      }

      return {
        topic,
        title: indexPost.title,
        summary: indexPost.summary,
        articleCount: articles.length,
      } satisfies TopicSummary;
    }),
  );

  return topics
    .filter((topic): topic is TopicSummary => topic !== null)
    .toSorted((a, b) => a.title.localeCompare(b.title));
}

export async function getContentBySlug<K extends ContentKind>(kind: K, slug: string) {
  const items = (await getCollection(kind)) as CollectionMap[K][];
  return items.find((item) => item.slug === slug) ?? null;
}

export type GetContentByTagOptions = {
  page?: number;
  pageSize?: number;
};

export type TaggedContentByKind = {
  blog: BlogPost[];
  weekly: WeeklyPost[];
  projects: ProjectPost[];
  career: CareerPost[];
  learning: LearningPost[];
  "ai-tracker": AiTrackerPost[];
  bookList: BookListPost[];
};

export async function getContentByTag(
  tag: string,
  // _opts is accepted-but-ignored in v0.2; pagination kicks in later.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _opts?: GetContentByTagOptions,
): Promise<{
  items: TaggedContentByKind;
  totalByKind: Record<keyof TaggedContentByKind, number>;
}> {
  const needle = tag.toLowerCase();
  const matchesTag = (t: string | undefined) => t?.toLowerCase() === needle;

  const [blog, weekly, projects, career, aiTracker, bookList, topics] =
    await Promise.all([
      getBlogPosts(),
      getWeeklyPosts(),
      getProjectPosts(),
      getCareerPosts(),
      getAiTrackerPosts(),
      getBookListPosts(),
      getLearningTopics(),
    ]);

  const learningPosts = (
    await Promise.all(topics.map((topic) => getLearningPosts(topic.topic)))
  ).flat();

  const blogMatches = blog.filter((p) => p.tags.some(matchesTag));
  const weeklyMatches = weekly.filter((p) => p.tags.some(matchesTag));
  // The project schema does not currently carry a `tags` field, so projects
  // contribute zero matches for any tag. We still read them in parallel to
  // keep the cross-collection contract stable for future schema additions.
  void projects;
  const careerMatches = career.filter((p) =>
    (p.tags ?? []).some(matchesTag),
  );
  const learningMatches = learningPosts.filter((p) => p.tags.some(matchesTag));
  const aiTrackerMatches = aiTracker.filter((p) => p.tags.some(matchesTag));
  const bookListMatches = bookList.filter((p) => p.tags.some(matchesTag));

  const items: TaggedContentByKind = {
    blog: blogMatches,
    weekly: weeklyMatches,
    projects: [],
    career: careerMatches,
    learning: learningMatches,
    "ai-tracker": aiTrackerMatches,
    bookList: bookListMatches,
  };

  const totalByKind: Record<keyof TaggedContentByKind, number> = {
    blog: blogMatches.length,
    weekly: weeklyMatches.length,
    projects: 0,
    career: careerMatches.length,
    learning: learningMatches.length,
    "ai-tracker": aiTrackerMatches.length,
    bookList: bookListMatches.length,
  };

  return { items, totalByKind };
}

export type RelatedRef = {
  blog?: string[];
  weekly?: string[];
  projects?: string[];
  career?: string[];
};

export type TagCount = {
  tag: string;
  count: number;
  kinds: Record<ContentKind, number>;
};

function emptyKindCounts(): Record<ContentKind, number> {
  return {
    blog: 0,
    weekly: 0,
    projects: 0,
    career: 0,
    learning: 0,
    "ai-tracker": 0,
    "book-list": 0,
  };
}

export async function getAllTags(): Promise<TagCount[]> {
  const [blog, weekly, career, aiTracker, bookList, topics] = await Promise.all([
    getBlogPosts(),
    getWeeklyPosts(),
    getCareerPosts(),
    getAiTrackerPosts(),
    getBookListPosts(),
    getLearningTopics(),
  ]);
  const learningPosts = (
    await Promise.all(topics.map((topic) => getLearningPosts(topic.topic)))
  ).flat();

  const counts = new Map<string, TagCount>();

  function bump(tag: string, kind: ContentKind) {
    let entry = counts.get(tag);
    if (!entry) {
      entry = { tag, count: 0, kinds: emptyKindCounts() };
      counts.set(tag, entry);
    }
    entry.count += 1;
    entry.kinds[kind] += 1;
  }

  for (const post of blog) for (const tag of post.tags) bump(tag, "blog");
  for (const post of weekly) for (const tag of post.tags) bump(tag, "weekly");
  for (const post of career) for (const tag of post.tags ?? []) bump(tag, "career");
  for (const post of aiTracker) for (const tag of post.tags) bump(tag, "ai-tracker");
  for (const post of bookList) for (const tag of post.tags) bump(tag, "book-list");
  for (const post of learningPosts) for (const tag of post.tags) bump(tag, "learning");

  return [...counts.values()].toSorted((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.tag.localeCompare(b.tag);
  });
}

export type BlogArchivePost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

export type BlogArchiveMonth = {
  month: string;
  count: number;
  posts: BlogArchivePost[];
};

function monthKey(date: string) {
  return date.slice(0, 7);
}

export async function getBlogArchive(): Promise<BlogArchiveMonth[]> {
  const posts = await getBlogPosts();
  const buckets = new Map<string, BlogArchivePost[]>();

  for (const post of posts) {
    const key = monthKey(post.date);
    const list = buckets.get(key) ?? [];
    list.push({
      slug: post.slug,
      title: post.title,
      date: post.date,
      summary: post.summary,
    });
    buckets.set(key, list);
  }

  return [...buckets.entries()]
    .map(([month, list]) => {
      const sortedPosts = list.toSorted((a, b) => b.date.localeCompare(a.date));
      return { month, count: sortedPosts.length, posts: sortedPosts };
    })
    .toSorted((a, b) => b.month.localeCompare(a.month));
}

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
