import type { MetadataRoute } from "next";
import {
  getBlogPosts,
  getBookNotes,
  getBookTopics,
  getCourseNotes,
  getCourseTopics,
  getWeeklyPosts,
  getProjectPosts,
  getLearningTopics,
  getLearningPosts,
} from "@/lib/content";
import { buildUrl } from "@/lib/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // /career 已合并到 /about（app/(site)/career/page.tsx 仅 307 跳转）。
  // 不暴露 /career 条目，避免搜索引擎索引跳转链。
  const [blog, weekly, projects] = await Promise.all([
    getBlogPosts(),
    getWeeklyPosts(),
    getProjectPosts(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: buildUrl("/"), lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: buildUrl("/blog"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: buildUrl("/timeline"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: buildUrl("/weekly"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: buildUrl("/projects"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: buildUrl("/gallery"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: buildUrl("/learning"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: buildUrl("/book-list"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: buildUrl("/course-list"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const blogUrls: MetadataRoute.Sitemap = blog.map((post) => ({
    url: buildUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const weeklyUrls: MetadataRoute.Sitemap = weekly.map((post) => ({
    url: buildUrl(`/weekly/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const projectUrls: MetadataRoute.Sitemap = projects.map((post) => ({
    url: buildUrl(`/projects/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Book list: book index pages + note detail pages
  const bookTopics = await getBookTopics();
  const bookIndexUrls: MetadataRoute.Sitemap = [];
  const bookNoteUrls: MetadataRoute.Sitemap = [];

  for (const book of bookTopics) {
    bookIndexUrls.push({
      url: buildUrl(`/book-list/${book.book}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });

    const notes = await getBookNotes(book.book);
    for (const note of notes) {
      bookNoteUrls.push({
        url: buildUrl(`/book-list/${book.book}/${note.slug}`),
        lastModified: new Date(note.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  }

  // Course list: course index pages + note detail pages
  const courseTopics = await getCourseTopics();
  const courseIndexUrls: MetadataRoute.Sitemap = [];
  const courseNoteUrls: MetadataRoute.Sitemap = [];

  for (const course of courseTopics) {
    courseIndexUrls.push({
      url: buildUrl(`/course-list/${course.course}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });

    const notes = await getCourseNotes(course.course);
    for (const note of notes) {
      courseNoteUrls.push({
        url: buildUrl(`/course-list/${course.course}/${note.slug}`),
        lastModified: new Date(note.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  }

  // Learning
  const topics = await getLearningTopics();
  const learningUrls: MetadataRoute.Sitemap = [];

  for (const topic of topics) {
    learningUrls.push({
      url: buildUrl(`/learning/${topic.topic}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    });

    const articles = await getLearningPosts(topic.topic);
    for (const article of articles) {
      learningUrls.push({
        url: buildUrl(`/learning/${topic.topic}/${article.slug}`),
        lastModified: new Date(article.date),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      });
    }
  }

  return [
    ...staticPages,
    ...blogUrls,
    ...weeklyUrls,
    ...projectUrls,
    ...bookIndexUrls,
    ...bookNoteUrls,
    ...courseIndexUrls,
    ...courseNoteUrls,
    ...learningUrls,
  ];
}
