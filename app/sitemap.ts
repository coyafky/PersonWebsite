import type { MetadataRoute } from "next";
import {
  getBlogPosts,
  getWeeklyPosts,
  getProjectPosts,
  getCareerPosts,
  getLearningTopics,
  getLearningPosts,
  getAiTrackerPosts,
} from "@/lib/content";
import { buildUrl } from "@/lib/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blog, weekly, projects, career, aiTracker] = await Promise.all([
    getBlogPosts(),
    getWeeklyPosts(),
    getProjectPosts(),
    getCareerPosts(),
    getAiTrackerPosts(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: buildUrl("/"), lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: buildUrl("/blog"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: buildUrl("/weekly"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: buildUrl("/projects"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: buildUrl("/career"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: buildUrl("/learning"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: buildUrl("/ai-tracker"), lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
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

  const careerUrls: MetadataRoute.Sitemap = career.map((post) => ({
    url: buildUrl(`/career/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const aiTrackerUrls: MetadataRoute.Sitemap = aiTracker.map((post) => ({
    url: buildUrl(`/ai-tracker/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

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
    ...careerUrls,
    ...aiTrackerUrls,
    ...learningUrls,
  ];
}
