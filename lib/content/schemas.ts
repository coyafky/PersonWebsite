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

export const schemaByKind = {
  blog: blogSchema,
  weekly: weeklySchema,
  projects: projectSchema,
  career: careerSchema,
} as const;

export type ContentKind = keyof typeof schemaByKind;
export type ContentStatus = z.infer<typeof contentStatusSchema>;
export type BlogPost = z.infer<typeof blogSchema>;
export type WeeklyPost = z.infer<typeof weeklySchema>;
export type ProjectPost = z.infer<typeof projectSchema>;
export type CareerPost = z.infer<typeof careerSchema>;
export type SiteContent = BlogPost | WeeklyPost | ProjectPost | CareerPost;
