import { z } from "zod";

export const contentStatusSchema = z.enum(["draft", "published", "archived"]);

const stringArraySchema = z.array(z.string()).default([]);

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
  tags: stringArraySchema,
  lang: z.string(),
  updated: z.string().optional(),
  canonical: z.string().optional(),
});

export const diarySchema = baseContentSchema.extend({
  kind: z.literal("diary"),
  tags: stringArraySchema,
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
  tags: stringArraySchema,
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
  tags: stringArraySchema.optional(),
});

export const learningSchema = baseContentSchema.extend({
  kind: z.literal("learning"),
  topic: z.string(),
  tags: stringArraySchema,
  lang: z.string().default("zh"),
  updated: z.string().optional(),
});

export const bookIndexSchema = baseContentSchema.extend({
  kind: z.literal("book-index"),
  book: z.string(),
  author: z.string(),
  genre: z.string(),
  tags: stringArraySchema,
  lang: z.string().default("zh"),
  cover: z.string().optional(),
  translator: z.string().optional(),
  finishedDate: z.string().optional(),
});

export const bookNoteSchema = baseContentSchema.extend({
  kind: z.literal("book-note"),
  book: z.string(),
  tags: stringArraySchema,
  lang: z.string().default("zh"),
  chapter: z.string().optional(),
});

export const courseIndexSchema = baseContentSchema.extend({
  kind: z.literal("course-index"),
  course: z.string(),
  platform: z.string(),
  instructor: z.string(),
  tags: stringArraySchema,
  lang: z.string().default("zh"),
  url: z.string().optional(),
});

export const courseNoteSchema = baseContentSchema.extend({
  kind: z.literal("course-note"),
  course: z.string(),
  tags: stringArraySchema,
  lang: z.string().default("zh"),
  chapter: z.string().optional(),
});

export const gallerySchema = baseContentSchema.extend({
  kind: z.literal("gallery"),
  image: z.string(),
  model: z.string(),
  prompt: z.string(),
  negativePrompt: z.string().optional(),
  params: z.record(z.string(), z.string()).default({}),
  tags: stringArraySchema,
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
