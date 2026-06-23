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

const aiTrackerSourceTypeSchema = z.enum([
  "paper",
  "product",
  "model",
  "agent",
  "tool",
  "article",
  "video",
  "podcast",
  "discussion",
  "other",
]);

export const aiTrackerSchema = baseContentSchema.extend({
  kind: z.literal("ai-tracker"),
  topics: stringArraySchema,
  tags: stringArraySchema,
  sourceType: aiTrackerSourceTypeSchema,
  signal: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  signalLabel: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  sourceTitle: z.string().optional(),
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  takeaways: z.array(z.string()).optional(),
  questions: z.array(z.string()).optional(),
  relatedLinks: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
      }),
    )
    .optional(),
  relatedPosts: z
    .object({
      blog: z.array(z.string()).optional(),
      weekly: z.array(z.string()).optional(),
      projects: z.array(z.string()).optional(),
      career: z.array(z.string()).optional(),
    })
    .optional(),
  lang: z.string().optional(),
});

export const bookListSchema = baseContentSchema.extend({
  kind: z.literal("book-list"),
  author: z.string(),
  genre: z.string(),
  tags: stringArraySchema,
  lang: z.string().default("zh"),
});

export const schemaByKind = {
  blog: blogSchema,
  weekly: weeklySchema,
  projects: projectSchema,
  career: careerSchema,
  "ai-tracker": aiTrackerSchema,
  learning: learningSchema,
  "book-list": bookListSchema,
} as const;

export type ContentKind = keyof typeof schemaByKind;
export type ContentStatus = z.infer<typeof contentStatusSchema>;
export type BlogPost = z.infer<typeof blogSchema>;
export type WeeklyPost = z.infer<typeof weeklySchema>;
export type ProjectPost = z.infer<typeof projectSchema>;
export type CareerPost = z.infer<typeof careerSchema>;
export type AiTrackerPost = z.infer<typeof aiTrackerSchema>;
export type LearningPost = z.infer<typeof learningSchema>;
export type BookListPost = z.infer<typeof bookListSchema>;
export type AiTrackerSourceType = z.infer<typeof aiTrackerSourceTypeSchema>;
export type SiteContent =
  | BlogPost
  | WeeklyPost
  | ProjectPost
  | CareerPost
  | AiTrackerPost
  | LearningPost
  | BookListPost;
