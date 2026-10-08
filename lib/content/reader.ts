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
  learningSchema,
  schemaByKind,
} from "./schemas.ts";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const SUPPORTED_EXTENSIONS = new Set([".md", ".mdx"]);

const statusProbeSchema = z.object({
  status: contentStatusSchema.default("draft"),
});

/**
 * kind → Post 的映射，供 `getContentBySlug` 使用。
 *
 * 内容模块合并到 `/notes` 之后**这张表不用改**：合并动的是「URL 与函数形态」，
 * 底层的 `ContentKind` 没动（learning / book-index / book-note / course-index /
 * course-note 都还在 schemaByKind 里），所以这里仍然是一对一的。
 * 内容模块那一侧的新类型映射见下面的 NoteIndexPost / NotePost。
 */
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

/**
 * 精选项目，按 `date` 倒序确定性排序后取前 `limit` 个。
 *
 * 曾经是 `filter(featured).slice(0, 3)` —— 而目前 flag 了 `featured: true`
 * 的有 4 个，等于**每个构建随机丢掉一个**（顺序由 readdir 的返回决定，
 * 没有排序保证）。改成显式排序 + 参数化 limit，让「轮播/精选」这类位置
 * 在多次构建、多个调用点之间稳定可复现。
 */
export async function getFeaturedProjects(limit = 3) {
  const projects = await getProjectPosts();
  return projects
    .filter((project) => project.featured)
    .toSorted((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

/**
 * 把 project.details 里列出的博客 slug 解析成真实文章，**保持 details 的书写顺序**
 * （= 阅读顺序，不是日期顺序）。
 *
 * 解析不到的 slug 只 `console.warn` 并跳过，绝不抛错：一篇博客改名/下线
 * 不应该让整站构建失败（对照 readCollection 里 published 内容才 throw 的策略，
 * 引用缺失是内容问题，不是 schema 事故）。
 */
export async function getProjectDetailPosts(project: ProjectPost): Promise<BlogPost[]> {
  if (project.details.length === 0) {
    return [];
  }

  const posts = await getBlogPosts();
  const bySlug = new Map(posts.map((post) => [post.slug, post]));

  const resolved: BlogPost[] = [];
  for (const slug of project.details) {
    const post = bySlug.get(slug);
    if (!post) {
      console.warn(
        `Project "${project.slug}" references unknown detail post "${slug}" (skipped).`,
      );
      continue;
    }
    resolved.push(post);
  }

  return resolved;
}

/**
 * 反向索引：哪些项目的 details 里包含这个博客 slug。
 *
 * slug 走 decodeSlug —— 动态段传来的可能是未解码形态（与 getContentBySlug 同坑，
 * 见那里的注释），不解码会让 /blog/<未解码 slug> 的「本项目所属」提示 0 命中。
 */
export async function getProjectsForBlog(slug: string): Promise<ProjectPost[]> {
  const decoded = decodeSlug(slug);
  const projects = await getProjectPosts();
  return projects.filter((project) => project.details.includes(decoded));
}

/** 内容模块（`/notes`）下的三种集合形态。URL 是扁平的 `/notes/<collection>`，不带 kind。 */
export type NoteKind = "topic" | "book" | "course";

export const NOTE_KINDS = ["topic", "book", "course"] as const satisfies readonly NoteKind[];

/**
 * 集合简介页（`_index.md`）/ 集合内笔记的联合类型。
 *
 * topic（原 learning）的 index 与文章共用 `learningSchema`，所以两边都是 LearningPost。
 */
export type NoteIndexPost = LearningPost | BookIndexPost | CourseIndexPost;
export type NotePost = LearningPost | BookNotePost | CourseNotePost;

type NoteKindConfig = {
  /** 集合根目录：content/notes/<directory>/<collection>/ */
  directory: string;
  indexSchema: z.ZodType;
  noteSchema: z.ZodType;
  indexKind: ContentKind;
  noteKind: ContentKind;
  /**
   * 集合归属字段名。book/course 的 frontmatter 不带 `book:`/`course:`
   * （老实现由 reader 注入）；topic（原 learning）的 frontmatter 自带 `topic:`，
   * 老实现不注入 —— 这里保持不注入，语义与迁移前一致。
   */
  collectionField?: "book" | "course";
};

/**
 * 一张配置表取代原来 12 个平行函数（3 套 × 4 个）。
 *
 * ⚠️ `topic` 那一行的 schema / kind 是照 `getLearningTopicIndex` + `readLearningTopic`
 * 的原样抄的：原 learning 的 `_index.md` 与文章都走
 * `readCollection("learning", topic)` → `schemaByKind.learning`，
 * index 与 note 的 kind 都是 `learning`（learningSchema 自带 `topic` 字段）。
 */
const NOTE_KIND_CONFIG: Record<NoteKind, NoteKindConfig> = {
  topic: {
    directory: "topic",
    indexSchema: learningSchema,
    noteSchema: learningSchema,
    indexKind: "learning",
    noteKind: "learning",
  },
  book: {
    directory: "book",
    indexSchema: bookIndexSchema,
    noteSchema: bookNoteSchema,
    indexKind: "book-index",
    noteKind: "book-note",
    collectionField: "book",
  },
  course: {
    directory: "course",
    indexSchema: courseIndexSchema,
    noteSchema: courseNoteSchema,
    indexKind: "course-index",
    noteKind: "course-note",
    collectionField: "course",
  },
};

const NOTE_ROOT = path.join(CONTENT_ROOT, "notes");

export type NoteCollectionSummary = {
  kind: NoteKind;
  /** 集合 id —— 也是 URL 里那一段。 */
  collection: string;
  title: string;
  summary: string;
  noteCount: number;
  /** book 特有 */
  author?: string;
  genre?: string;
  /** course 特有 */
  platform?: string;
  instructor?: string;
};

/**
 * 读一个集合目录下的全部条目（含 `_index.md`），**不按 status 过滤** ——
 * 老 `readBookTopic` / `readCourseTopic` 把 `publishedOnly` 放在函数内部，
 * 这里统一提到各 getter 里，省得 index 与 note 想要不同过滤时又得复制一遍。
 */
async function readNoteCollection(kind: NoteKind, collection: string): Promise<NotePost[]> {
  const config = NOTE_KIND_CONFIG[kind];
  const directory = path.join(NOTE_ROOT, config.directory, collection);

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
        const schema = isIndex ? config.indexSchema : config.noteSchema;
        const contentKind = isIndex ? config.indexKind : config.noteKind;

        const result = schema.safeParse({
          ...parsed.data,
          kind: contentKind,
          ...(config.collectionField ? { [config.collectionField]: collection } : {}),
          slug,
          filePath,
          extension,
          body: parsed.content.trim(),
        });

        if (!result.success) {
          if (status === "published") {
            throw new Error(formatValidationError(contentKind, slug, result.error));
          }
          console.warn(formatValidationError(contentKind, slug, result.error));
          return null;
        }

        return result.data as NotePost;
      }),
  );

  const allItems = items.filter((item): item is NotePost => item !== null);
  assertUniqueSlugs(allItems, config.noteKind);

  return allItems;
}

/**
 * 集合简介页（`_index.md`）。
 *
 * ⚠️ 与老实现有意不同：这里**不按 published 过滤 index**。
 * 理由：`/notes` 要列出全部 15 个集合（含整集归档的 skeptics-guide），
 * 而「这个集合存在」由目录 + `_index.md` 决定，不由 index 的 status 决定 ——
 * 过滤 published 会让归档过 index 的集合从列表里消失、详情页 404，
 * 等于列表里挂一条死链。笔记本身仍只出 published（见 getNoteCollectionNotes）。
 */
export async function getNoteCollectionIndex(
  kind: NoteKind,
  collection: string,
): Promise<NoteIndexPost | null> {
  const config = NOTE_KIND_CONFIG[kind];
  const items = await readNoteCollection(kind, collection);
  return (
    (items.find(
      (item) => item.kind === config.indexKind && item.slug === "_index",
    ) as NoteIndexPost | undefined) ?? null
  );
}

export async function getNoteCollectionNotes(
  kind: NoteKind,
  collection: string,
  includeDrafts = false,
): Promise<NotePost[]> {
  const config = NOTE_KIND_CONFIG[kind];
  const items = await readNoteCollection(kind, collection);
  const notes = items.filter(
    (item): item is NotePost => item.kind === config.noteKind && isArticleSlug(item.slug),
  );
  const visible = includeDrafts ? notes : publishedOnly(notes);
  return byNewestDate(visible);
}

export async function getNoteBySlug(
  kind: NoteKind,
  collection: string,
  slug: string,
): Promise<NotePost | null> {
  const config = NOTE_KIND_CONFIG[kind];
  // 与老 getBookNoteBySlug / getLearningPostBySlug 一致：单篇只出 published。
  const items = publishedOnly(await readNoteCollection(kind, collection));
  const decoded = decodeSlug(slug);
  return (
    (items.find(
      (item) => item.kind === config.noteKind && item.slug === decoded,
    ) as NotePost | undefined) ?? null
  );
}

async function listNoteCollections(kind: NoteKind): Promise<NoteCollectionSummary[]> {
  const config = NOTE_KIND_CONFIG[kind];
  const root = path.join(NOTE_ROOT, config.directory);

  if (!(await fileExists(root))) {
    return [];
  }

  const entries = await fs.readdir(root, { withFileTypes: true });
  const collectionDirs = entries.filter((entry) => entry.isDirectory());

  const summaries = await Promise.all(
    collectionDirs.map(async (entry) => {
      const collection = entry.name;
      const [indexPost, notes] = await Promise.all([
        getNoteCollectionIndex(kind, collection),
        getNoteCollectionNotes(kind, collection),
      ]);

      if (!indexPost) {
        return null;
      }

      const base = {
        kind,
        collection,
        title: indexPost.title,
        summary: indexPost.summary,
        noteCount: notes.length,
      };

      if (kind === "book") {
        const post = indexPost as BookIndexPost;
        return { ...base, author: post.author, genre: post.genre } satisfies NoteCollectionSummary;
      }

      if (kind === "course") {
        const post = indexPost as CourseIndexPost;
        return {
          ...base,
          platform: post.platform,
          instructor: post.instructor,
        } satisfies NoteCollectionSummary;
      }

      return base satisfies NoteCollectionSummary;
    }),
  );

  return summaries.filter((item): item is NoteCollectionSummary => item !== null);
}

/**
 * 列出集合（可限定 kind）。排序语义与迁移前一致：按 title 升序
 * （原来三个集合列表函数——learning / book / course 各一个——都是 title 排序）。
 * 额外的 kind / collection 只是 tie-breaker —— 原来并列时的顺序由 readdir
 * 决定（不稳定），这里钉死成确定性顺序。
 */
export async function getNoteCollections(kind?: NoteKind): Promise<NoteCollectionSummary[]> {
  const kinds: readonly NoteKind[] = kind ? [kind] : NOTE_KINDS;
  const groups = await Promise.all(kinds.map((k) => listNoteCollections(k)));

  return groups
    .flat()
    .toSorted(
      (a, b) =>
        a.title.localeCompare(b.title) ||
        a.kind.localeCompare(b.kind) ||
        a.collection.localeCompare(b.collection),
    );
}

/**
 * 按集合 id 反查（扁平 URL `/notes/<collection>` 不带 kind，需要反查）。
 *
 * ⚠️ 同一个 id 同时出现在多个 kind 的目录下时**抛错**，而不是静默取第一个 ——
 * 静默会让 URL 指向哪个集合取决于遍历顺序，是查不出来的沉默错误。
 * （当前数据没有这种冲突，这是给未来上的闸。）
 */
export async function findNoteCollection(
  collection: string,
): Promise<NoteCollectionSummary | null> {
  const found: NoteKind[] = [];

  for (const kind of NOTE_KINDS) {
    const dir = path.join(NOTE_ROOT, NOTE_KIND_CONFIG[kind].directory, collection);
    if (await fileExists(dir)) {
      found.push(kind);
    }
  }

  if (found.length > 1) {
    throw new Error(
      `Ambiguous note collection "${collection}": found under kinds ${found.join(", ")}. ` +
        "Collection ids must be unique across topic/book/course.",
    );
  }

  if (found.length === 0) {
    return null;
  }

  const summaries = await listNoteCollections(found[0]);
  return summaries.find((item) => item.collection === collection) ?? null;
}

/**
 * 把 `/notes` 下所有集合的 index / note 全量拉一遍，按**老函数的口径**分组：
 *   - learning —— 只算文章（老的文章 getter 会过滤 isArticleSlug，index 不算），
 *   - bookIndex / bookNote / courseIndex / courseNote —— index 与文章都算。
 *
 * 这个不对称是迁移前就有的，这里照搬而不是顺手统一 —— `getContentByTag` /
 * `getAllTags` 的统计口径属于「既有行为」，改它会让 /tags 上冒出新标签页。
 * 两处共用，省得再各写一遍。
 */
async function readAllNotePosts() {
  const collections = await getNoteCollections();
  const [indexPosts, notePosts] = await Promise.all([
    Promise.all(collections.map((c) => getNoteCollectionIndex(c.kind, c.collection))),
    Promise.all(collections.map((c) => getNoteCollectionNotes(c.kind, c.collection))),
  ]);

  const indexes = indexPosts.filter((p): p is NoteIndexPost => p !== null);
  const notes = notePosts.flat();

  return {
    learning: notes.filter((p): p is LearningPost => p.kind === "learning"),
    bookIndex: indexes.filter((p): p is BookIndexPost => p.kind === "book-index"),
    bookNote: notes.filter((p): p is BookNotePost => p.kind === "book-note"),
    courseIndex: indexes.filter((p): p is CourseIndexPost => p.kind === "course-index"),
    courseNote: notes.filter((p): p is CourseNotePost => p.kind === "course-note"),
  };
}

export async function getGalleryPosts(includeDrafts = false): Promise<GalleryPost[]> {
  const items = await getCollection("gallery", includeDrafts);
  return items.filter((item): item is GalleryPost => item.kind === "gallery");
}

export async function getGalleryPostBySlug(slug: string): Promise<GalleryPost | null> {
  return getContentBySlug("gallery", slug);
}

function isArticleSlug(slug: string) {
  return !slug.startsWith("_");
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
   * diary / weekly 两个字段曾在此（2026-09-20 为修「只在日记里出现的标签
   * 点进去 404」而补齐）。2026-10-07 两个模块整体下架、内容归档，
   * 于是连同 tags 页的渲染段一起移除 —— 留着会渲染出指向 308 桩的链接。
   *
   * ⚠️ 若日后恢复日记/周记，要同时补回三处：本类型、getContentByTag 的扫描、
   * 以及 app/(site)/tags/[tag]/page.tsx 的渲染段。漏掉任一处就会出现
   * 「标签列得出来但点进去没有」的老问题。
   */
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

  // diary / weekly 已下架，不再参与标签聚合（见 TaggedContentByKind 注释）。
  const [blog, projects, career, notePosts] = await Promise.all([
    getBlogPosts(),
    getProjectPosts(),
    getCareerPosts(),
    readAllNotePosts(),
  ]);

  const {
    learning: learningPosts,
    bookIndex: bookIndexPosts,
    bookNote: bookNotePosts,
    courseIndex: courseIndexPosts,
    courseNote: courseNotePosts,
  } = notePosts;

  const blogMatches = blog.filter((p) => p.tags.some(matchesTag));
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
  // weekly 已下架（2026-10-07）：内容归档、路由 308 → /blog，相关阅读不再解析它。
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
  const [blog, career, notePosts] = await Promise.all([
    getBlogPosts(),
    getCareerPosts(),
    readAllNotePosts(),
  ]);
  const {
    learning: learningPosts,
    bookIndex: bookIndexPosts,
    bookNote: bookNotePosts,
    courseIndex: courseIndexPosts,
    courseNote: courseNotePosts,
  } = notePosts;

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
  kind: "blog" | "projects" | "career";
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

  const kinds: RelatedCollectionKind[] = ["blog", "projects", "career"];

  const [blogItems, projectItems, careerItems] = await Promise.all([
    getBlogPosts(),
    getProjectPosts(),
    getCareerPosts(),
  ]);

  const titleMaps: Record<RelatedCollectionKind, Map<string, string>> = {
    blog: buildTitleMap(blogItems),
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
