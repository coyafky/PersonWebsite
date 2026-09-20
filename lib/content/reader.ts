import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  type BlogPost,
  type BookIndexPost,
  type BookNotePost,
  type CareerPost,
  type ContentKind,
  type CourseIndexPost,
  type CourseNotePost,
  type DiaryPost,
  type GalleryPost,
  type LearningPost,
  type ProjectPost,
  type SiteContent,
  type WeeklyPost,
  bookIndexSchema,
  bookNoteSchema,
  contentStatusSchema,
  courseIndexSchema,
  courseNoteSchema,
  schemaByKind,
} from "./schemas.ts";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const SUPPORTED_EXTENSIONS = new Set([".md", ".mdx"]);

const statusProbeSchema = z.object({
  status: contentStatusSchema.default("draft"),
});

type CollectionMap = {
  blog: BlogPost;
  diary: DiaryPost;
  weekly: WeeklyPost;
  projects: ProjectPost;
  career: CareerPost;
  learning: LearningPost;
  "book-index": BookIndexPost;
  "book-note": BookNotePost;
  "course-index": CourseIndexPost;
  "course-note": CourseNotePost;
  gallery: GalleryPost;
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

/** 解码 URL 段。slug 与 tag 共用 —— 两者都会以未解码形态从动态段传进来。 */
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    // 字面 % 且非法转义（如 "100%完成"）→ 原样返回，不当成错误
    return slug;
  }
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

export async function getBlogPosts(includeDrafts = false): Promise<BlogPost[]> {
  const items = await getCollection("blog", includeDrafts);
  return items.filter((item): item is BlogPost => item.kind === "blog");
}

export type PaginatedPosts<T> = {
  posts: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function getBlogPostsPaginated(
  includeDrafts = false,
  opts?: { page?: number; pageSize?: number },
): Promise<PaginatedPosts<BlogPost>> {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 10;
  const allPosts = await getBlogPosts(includeDrafts);
  const total = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * pageSize;
  const posts = allPosts.slice(start, start + pageSize);

  return { posts, total, page: clampedPage, pageSize, totalPages };
}

export async function getDiaryPosts(includeDrafts = false): Promise<DiaryPost[]> {
  const items = await getCollection("diary", includeDrafts);
  return items.filter((item): item is DiaryPost => item.kind === "diary");
}

export async function getDiaryPostsPaginated(
  includeDrafts = false,
  opts?: { page?: number; pageSize?: number },
): Promise<PaginatedPosts<DiaryPost>> {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 28;
  const allPosts = await getDiaryPosts(includeDrafts);
  const total = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * pageSize;
  const posts = allPosts.slice(start, start + pageSize);

  return { posts, total, page: clampedPage, pageSize, totalPages };
}

/** 按月归档，用于日记列表页的分组展示 */
export async function getDiaryArchive(): Promise<
  { month: string; count: number; entries: DiaryPost[] }[]
> {
  const posts = await getDiaryPosts();
  const byMonth = new Map<string, DiaryPost[]>();

  for (const post of posts) {
    const month = post.date.slice(0, 7);
    const bucket = byMonth.get(month);
    if (bucket) {
      bucket.push(post);
    } else {
      byMonth.set(month, [post]);
    }
  }

  return [...byMonth.entries()]
    .toSorted((a, b) => b[0].localeCompare(a[0]))
    .map(([month, entries]) => ({ month, count: entries.length, entries }));
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

export type BookTopicSummary = {
  book: string;
  title: string;
  author: string;
  genre: string;
  summary: string;
  noteCount: number;
};

async function readBookTopic(book: string, includeDrafts = false): Promise<(BookIndexPost | BookNotePost)[]> {
  const directory = path.join(CONTENT_ROOT, "book-list", book);

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

        const isIndex = slug === "_index";
        const schema = isIndex ? bookIndexSchema : bookNoteSchema;
        const kind = isIndex ? "book-index" : "book-note";

        const result = schema.safeParse({
          ...parsed.data,
          kind,
          book,
          slug,
          filePath,
          extension,
          body: parsed.content.trim(),
        });

        if (!result.success) {
          if (status === "published") {
            throw new Error(formatValidationError(kind as ContentKind, slug, result.error));
          }
          console.warn(formatValidationError(kind as ContentKind, slug, result.error));
          return null;
        }

        return result.data as BookIndexPost | BookNotePost;
      }),
  );

  const allItems = items.filter((item): item is BookIndexPost | BookNotePost => item !== null);

  return includeDrafts ? allItems : publishedOnly(allItems);
}

export async function getBookTopics(): Promise<BookTopicSummary[]> {
  const root = path.join(CONTENT_ROOT, "book-list");
  if (!(await fileExists(root))) {
    return [];
  }

  const entries = await fs.readdir(root, { withFileTypes: true });
  const bookDirs = entries.filter((entry) => entry.isDirectory());

  const topics = await Promise.all(
    bookDirs.map(async (entry) => {
      const book = entry.name;
      const [indexPost, notes] = await Promise.all([
        getBookTopicIndex(book),
        getBookNotes(book),
      ]);

      if (!indexPost) {
        return null;
      }

      return {
        book,
        title: indexPost.title,
        author: indexPost.author,
        genre: indexPost.genre,
        summary: indexPost.summary,
        noteCount: notes.length,
      } satisfies BookTopicSummary;
    }),
  );

  return topics
    .filter((topic): topic is BookTopicSummary => topic !== null)
    .toSorted((a, b) => a.title.localeCompare(b.title));
}

export async function getBookTopicIndex(book: string): Promise<BookIndexPost | null> {
  const items = await readBookTopic(book, false);
  return (items.find((item) => item.kind === "book-index" && item.slug === "_index") as BookIndexPost) ?? null;
}

export async function getBookNotes(book: string, includeDrafts = false): Promise<BookNotePost[]> {
  const items = await readBookTopic(book, includeDrafts);
  return byNewestDate(
    items.filter((item): item is BookNotePost => item.kind === "book-note" && isArticleSlug(item.slug)),
  );
}

export async function getBookNoteBySlug(book: string, slug: string): Promise<BookNotePost | null> {
  const items = await readBookTopic(book, false);
  const decoded = decodeSlug(slug);
  return (items.find((item) => item.kind === "book-note" && item.slug === decoded) as BookNotePost) ?? null;
}

export type CourseTopicSummary = {
  course: string;
  title: string;
  platform: string;
  instructor: string;
  summary: string;
  noteCount: number;
};

async function readCourseTopic(course: string, includeDrafts = false): Promise<(CourseIndexPost | CourseNotePost)[]> {
  const directory = path.join(CONTENT_ROOT, "course-list", course);

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

        const isIndex = slug === "_index";
        const schema = isIndex ? courseIndexSchema : courseNoteSchema;
        const kind = isIndex ? "course-index" : "course-note";

        const result = schema.safeParse({
          ...parsed.data,
          kind,
          course,
          slug,
          filePath,
          extension,
          body: parsed.content.trim(),
        });

        if (!result.success) {
          if (status === "published") {
            throw new Error(formatValidationError(kind as ContentKind, slug, result.error));
          }
          console.warn(formatValidationError(kind as ContentKind, slug, result.error));
          return null;
        }

        return result.data as CourseIndexPost | CourseNotePost;
      }),
  );

  const allItems = items.filter((item): item is CourseIndexPost | CourseNotePost => item !== null);

  return includeDrafts ? allItems : publishedOnly(allItems);
}

export async function getCourseTopics(): Promise<CourseTopicSummary[]> {
  const root = path.join(CONTENT_ROOT, "course-list");
  if (!(await fileExists(root))) {
    return [];
  }

  const entries = await fs.readdir(root, { withFileTypes: true });
  const courseDirs = entries.filter((entry) => entry.isDirectory());

  const topics = await Promise.all(
    courseDirs.map(async (entry) => {
      const course = entry.name;
      const [indexPost, notes] = await Promise.all([
        getCourseTopicIndex(course),
        getCourseNotes(course),
      ]);

      if (!indexPost) {
        return null;
      }

      return {
        course,
        title: indexPost.title,
        platform: indexPost.platform,
        instructor: indexPost.instructor,
        summary: indexPost.summary,
        noteCount: notes.length,
      } satisfies CourseTopicSummary;
    }),
  );

  return topics
    .filter((topic): topic is CourseTopicSummary => topic !== null)
    .toSorted((a, b) => a.title.localeCompare(b.title));
}

export async function getCourseTopicIndex(course: string): Promise<CourseIndexPost | null> {
  const items = await readCourseTopic(course, false);
  return (items.find((item) => item.kind === "course-index" && item.slug === "_index") as CourseIndexPost) ?? null;
}

export async function getCourseNotes(course: string, includeDrafts = false): Promise<CourseNotePost[]> {
  const items = await readCourseTopic(course, includeDrafts);
  return byNewestDate(
    items.filter((item): item is CourseNotePost => item.kind === "course-note" && isArticleSlug(item.slug)),
  );
}

export async function getCourseNoteBySlug(course: string, slug: string): Promise<CourseNotePost | null> {
  const items = await readCourseTopic(course, false);
  const decoded = decodeSlug(slug);
  return (items.find((item) => item.kind === "course-note" && item.slug === decoded) as CourseNotePost) ?? null;
}

export async function getGalleryPosts(includeDrafts = false): Promise<GalleryPost[]> {
  const items = await getCollection("gallery", includeDrafts);
  return items.filter((item): item is GalleryPost => item.kind === "gallery");
}

export async function getGalleryPostBySlug(slug: string): Promise<GalleryPost | null> {
  return getContentBySlug("gallery", slug);
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
  const decoded = decodeSlug(slug);
  return items.find((item) => item.slug === decoded) ?? null;
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
  const decoded = decodeSlug(slug);
  return items.find((item) => item.slug === decoded) ?? null;
}

export type GetContentByTagOptions = {
  page?: number;
  pageSize?: number;
};

export type TaggedContentByKind = {
  blog: BlogPost[];
  /**
   * ⚠️ 这一项曾经缺失。getAllTags() 一直扫 diary，但 getContentByTag 不扫 ——
   * 于是"只在日记里出现"的标签会被 /tags 列出来、点进去却 404
   * （例：全站第 1 高频的「工作日记」68 篇、以及 官网/素材/门店/Codex 等）。
   * 2026-09-20 补齐。类型是契约：这里没有 diary 字段，
   * 后面 items / totalByKind 就一定会漏，编译器也拦不住。
   */
  diary: DiaryPost[];
  weekly: WeeklyPost[];
  projects: ProjectPost[];
  career: CareerPost[];
  learning: LearningPost[];
  bookIndex: BookIndexPost[];
  bookNote: BookNotePost[];
  courseIndex: CourseIndexPost[];
  courseNote: CourseNotePost[];
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
  // ⚠️ 必须先解码。动态段拿到的 params 可能是**未解码**的字符串
  // （例如 URL 里的 "AI%20Skill"），而正文里的标签写的是 "AI Skill" ——
  // 不解码就 0 命中，页面走 notFound()，标签页变成 404。
  // 实测：getContentByTag("AI Skill") 命中 7；getContentByTag("AI%20Skill") 命中 0。
  // 这与 getContentBySlug 用 decodeSlug 处理 slug 是同一个坑，只是当初漏了 tag。
  // decodeSlug 内部有 try/catch：标签里出现字面 % 而非法转义时会原样返回。
  const needle = decodeSlug(tag).toLowerCase();
  const matchesTag = (t: string | undefined) => t?.toLowerCase() === needle;

  const [blog, diary, weekly, projects, career, topics, bookTopicList, courseTopicList] =
    await Promise.all([
      getBlogPosts(),
      getDiaryPosts(),
      getWeeklyPosts(),
      getProjectPosts(),
      getCareerPosts(),
      getLearningTopics(),
      getBookTopics(),
      getCourseTopics(),
    ]);

  const learningPosts = (
    await Promise.all(topics.map((topic) => getLearningPosts(topic.topic)))
  ).flat();

  // Collect bookIndex and bookNote posts from all book topics
  const bookIndexPosts = (
    await Promise.all(bookTopicList.map((bt) => getBookTopicIndex(bt.book)))
  ).filter((p): p is BookIndexPost => p !== null);

  const bookNotePosts = (
    await Promise.all(bookTopicList.map((bt) => getBookNotes(bt.book)))
  ).flat();

  const courseIndexPosts = (
    await Promise.all(courseTopicList.map((ct) => getCourseTopicIndex(ct.course)))
  ).filter((p): p is CourseIndexPost => p !== null);

  const courseNotePosts = (
    await Promise.all(courseTopicList.map((ct) => getCourseNotes(ct.course)))
  ).flat();

  const blogMatches = blog.filter((p) => p.tags.some(matchesTag));
  const diaryMatches = diary.filter((p) => p.tags.some(matchesTag));
  const weeklyMatches = weekly.filter((p) => p.tags.some(matchesTag));
  // The project schema does not currently carry a `tags` field, so projects
  // contribute zero matches for any tag. We still read them in parallel to
  // keep the cross-collection contract stable for future schema additions.
  void projects;
  const careerMatches = career.filter((p) =>
    (p.tags ?? []).some(matchesTag),
  );
  const learningMatches = learningPosts.filter((p) => p.tags.some(matchesTag));
  const bookIndexMatches = bookIndexPosts.filter((p) => p.tags.some(matchesTag));
  const bookNoteMatches = bookNotePosts.filter((p) => p.tags.some(matchesTag));
  const courseIndexMatches = courseIndexPosts.filter((p) => p.tags.some(matchesTag));
  const courseNoteMatches = courseNotePosts.filter((p) => p.tags.some(matchesTag));

  const items: TaggedContentByKind = {
    blog: blogMatches,
    diary: diaryMatches,
    weekly: weeklyMatches,
    projects: [],
    career: careerMatches,
    learning: learningMatches,
    bookIndex: bookIndexMatches,
    bookNote: bookNoteMatches,
    courseIndex: courseIndexMatches,
    courseNote: courseNoteMatches,
  };

  const totalByKind: Record<keyof TaggedContentByKind, number> = {
    blog: blogMatches.length,
    diary: diaryMatches.length,
    weekly: weeklyMatches.length,
    projects: 0,
    career: careerMatches.length,
    learning: learningMatches.length,
    bookIndex: bookIndexMatches.length,
    bookNote: bookNoteMatches.length,
    courseIndex: courseIndexMatches.length,
    courseNote: courseNoteMatches.length,
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
    diary: 0,
    weekly: 0,
    projects: 0,
    career: 0,
    learning: 0,
    "book-index": 0,
    "book-note": 0,
    "course-index": 0,
    "course-note": 0,
    gallery: 0,
  };
}

export async function getAllTags(): Promise<TagCount[]> {
  const [blog, diary, weekly, career, topics, bookTopicList, courseTopicList] = await Promise.all([
    getBlogPosts(),
    getDiaryPosts(),
    getWeeklyPosts(),
    getCareerPosts(),
    getLearningTopics(),
    getBookTopics(),
    getCourseTopics(),
  ]);
  const learningPosts = (
    await Promise.all(topics.map((topic) => getLearningPosts(topic.topic)))
  ).flat();
  const bookIndexPosts = (
    await Promise.all(bookTopicList.map((bt) => getBookTopicIndex(bt.book)))
  ).filter((p): p is BookIndexPost => p !== null);
  const bookNotePosts = (
    await Promise.all(bookTopicList.map((bt) => getBookNotes(bt.book)))
  ).flat();
  const courseIndexPosts = (
    await Promise.all(courseTopicList.map((ct) => getCourseTopicIndex(ct.course)))
  ).filter((p): p is CourseIndexPost => p !== null);
  const courseNotePosts = (
    await Promise.all(courseTopicList.map((ct) => getCourseNotes(ct.course)))
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
  for (const post of diary) for (const tag of post.tags) bump(tag, "diary");
  for (const post of weekly) for (const tag of post.tags) bump(tag, "weekly");
  for (const post of career) for (const tag of post.tags ?? []) bump(tag, "career");
  for (const post of bookIndexPosts) for (const tag of post.tags) bump(tag, "book-index");
  for (const post of bookNotePosts) for (const tag of post.tags) bump(tag, "book-note");
  for (const post of courseIndexPosts) for (const tag of post.tags) bump(tag, "course-index");
  for (const post of courseNotePosts) for (const tag of post.tags) bump(tag, "course-note");
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
