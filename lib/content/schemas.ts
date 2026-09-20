import { z } from "zod";
// ⚠️ 必须带 .ts 扩展名。本仓库的 lib 内部导入统一这样写（见 reader.ts 的
// `from "./schemas.ts"`）—— 因为 test 脚本是 `node --test --experimental-strip-types`，
// Node 的 ESM 解析器不认无扩展名导入（Next/Turbopack 才认）。去掉扩展名会让
// reader.test.ts 直接 ERR_MODULE_NOT_FOUND。
import { normalizeTags } from "./tag-aliases.ts";

export const contentStatusSchema = z.enum(["draft", "published", "archived"]);

const stringArraySchema = z.array(z.string()).default([]);

/**
 * 标签专用：读入即归一化（见 tag-aliases.ts）。
 *
 * 刻意**不复用** stringArraySchema —— 那个还被 highlights / stack / impact /
 * resumeBullets 共用，那些字段不该被标签规则改写。
 */
const tagArraySchema = stringArraySchema.transform((tags) => normalizeTags(tags));

const baseContentSchema = z.object({
  slug: z.string(),
  filePath: z.string(),
  extension: z.enum([".md", ".mdx"]),
  body: z.string(),
  title: z.string(),
  date: z.string(),
  summary: z.string(),
  status: contentStatusSchema,
  englishSummary: z.string().optional(),
  series: z.string().optional(),
  seriesOrder: z.number().optional(),
});

export const blogSchema = baseContentSchema.extend({
  kind: z.literal("blog"),
  tags: tagArraySchema,
  lang: z.string(),
  updated: z.string().optional(),
  canonical: z.string().optional(),
});

export const diarySchema = baseContentSchema.extend({
  kind: z.literal("diary"),
  tags: tagArraySchema,
  lang: z.string().default("zh"),
  updated: z.string().optional(),
  mood: z.string().optional(),
  // 来源可追溯：log=当日原始日志，weekly=从周记时间轴重建，memory=从记忆笔记重建
  source: z.enum(["log", "weekly", "memory"]).default("log"),
});

export const weeklySchema = baseContentSchema.extend({
  kind: z.literal("weekly"),
  week: z.string().regex(/^\d{4}-W\d{2}$/),
  highlights: stringArraySchema,
  tags: tagArraySchema,
  mood: z.string().optional(),
});

export const projectSchema = baseContentSchema.extend({
  kind: z.literal("projects"),
  role: z.string(),
  stack: stringArraySchema,
  links: z.record(z.string(), z.string()).default({}),
  impact: stringArraySchema,
  resumeBullets: stringArraySchema,
  cover: z.string().optional(),
  featured: z.boolean().default(false),
  period: z.string().optional(),
});

export const careerSchema = baseContentSchema.extend({
  kind: z.literal("career"),
  lang: z.string().optional(),
  tags: tagArraySchema.optional(),
});

export const learningSchema = baseContentSchema.extend({
  kind: z.literal("learning"),
  topic: z.string(),
  tags: tagArraySchema,
  lang: z.string().default("zh"),
  updated: z.string().optional(),
});

export const bookIndexSchema = baseContentSchema.extend({
  kind: z.literal("book-index"),
  book: z.string(),
  author: z.string(),
  genre: z.string(),
  tags: tagArraySchema,
  lang: z.string().default("zh"),
  cover: z.string().optional(),
  translator: z.string().optional(),
  finishedDate: z.string().optional(),
});

export const bookNoteSchema = baseContentSchema.extend({
  kind: z.literal("book-note"),
  book: z.string(),
  tags: tagArraySchema,
  lang: z.string().default("zh"),
  chapter: z.string().optional(),
});

export const courseIndexSchema = baseContentSchema.extend({
  kind: z.literal("course-index"),
  course: z.string(),
  platform: z.string(),
  instructor: z.string(),
  tags: tagArraySchema,
  lang: z.string().default("zh"),
  url: z.string().optional(),
});

export const courseNoteSchema = baseContentSchema.extend({
  kind: z.literal("course-note"),
  course: z.string(),
  tags: tagArraySchema,
  lang: z.string().default("zh"),
  chapter: z.string().optional(),
});

export const gallerySchema = baseContentSchema.extend({
  kind: z.literal("gallery"),
  image: z.string(),
  model: z.string(),
  /** 原始关键词（作者当初记下的概念，很短，例如「明朝 汉服 复古胶片」） */
  prompt: z.string(),
  /**
   * 实际喂给模型、生成这张图的完整提示词。
   * 为什么要有它：短关键词复现不出图，画廊的立意是「每张图附完整提示词」——
   * 没有这一项，那个立意是空的。与 prompt 并存是为了保住来源可溯。
   */
  fullPrompt: z.string().optional(),
  negativePrompt: z.string().optional(),
  params: z.record(z.string(), z.string()).default({}),
  tags: tagArraySchema,
  lang: z.string().default("zh"),
  updated: z.string().optional(),
});

export const schemaByKind = {
  blog: blogSchema,
  diary: diarySchema,
  weekly: weeklySchema,
  projects: projectSchema,
  career: careerSchema,
  learning: learningSchema,
  "book-index": bookIndexSchema,
  "book-note": bookNoteSchema,
  "course-index": courseIndexSchema,
  "course-note": courseNoteSchema,
  gallery: gallerySchema,
} as const;

export type ContentKind = keyof typeof schemaByKind;
export type ContentStatus = z.infer<typeof contentStatusSchema>;
export type BlogPost = z.infer<typeof blogSchema>;
export type DiaryPost = z.infer<typeof diarySchema>;
export type WeeklyPost = z.infer<typeof weeklySchema>;
export type ProjectPost = z.infer<typeof projectSchema>;
export type CareerPost = z.infer<typeof careerSchema>;
export type LearningPost = z.infer<typeof learningSchema>;
export type BookIndexPost = z.infer<typeof bookIndexSchema>;
export type BookNotePost = z.infer<typeof bookNoteSchema>;
export type CourseIndexPost = z.infer<typeof courseIndexSchema>;
export type CourseNotePost = z.infer<typeof courseNoteSchema>;
export type GalleryPost = z.infer<typeof gallerySchema>;
export type SiteContent =
  | BlogPost
  | DiaryPost
  | WeeklyPost
  | ProjectPost
  | CareerPost
  | LearningPost
  | BookIndexPost
  | BookNotePost
  | CourseIndexPost
  | CourseNotePost
  | GalleryPost;
