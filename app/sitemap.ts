import type { MetadataRoute } from "next";
import {
  getBlogPosts,
  getNoteCollections,
  getNoteCollectionNotes,
  getProjectPosts,
} from "@/lib/content";
import { buildUrl } from "@/lib/metadata";
import { TOOLS } from "@/lib/tools/registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // /career 已合并到 /about（app/(site)/career/page.tsx 仅 307 跳转）。
  // 不暴露 /career 条目，避免搜索引擎索引跳转链。
  // /diary 与 /weekly 已下架（内容已归档，路由只剩 308 跳转桩），同样不产出条目。
  const [blog, projects] = await Promise.all([
    getBlogPosts(),
    getProjectPosts(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: buildUrl("/"), lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: buildUrl("/blog"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: buildUrl("/timeline"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: buildUrl("/projects"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: buildUrl("/gallery"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: buildUrl("/notes"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: buildUrl("/tools"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const toolUrls: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: buildUrl(`/tools/${tool.id}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogUrls: MetadataRoute.Sitemap = blog.map((post) => ({
    url: buildUrl(`/blog/${post.slug}`),
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

  // Notes：集合简介页 + 笔记详情页。
  // 旧的 /learning、/book-list、/course-list 三个入口已合并到 /notes，
  // 它们只剩 308 重定向桩，所以这里**不产出**任何旧路径条目（避免索引跳转链）。
  const noteCollections = await getNoteCollections();
  const noteIndexUrls: MetadataRoute.Sitemap = [];
  const noteDetailUrls: MetadataRoute.Sitemap = [];

  for (const collection of noteCollections) {
    noteIndexUrls.push({
      url: buildUrl(`/notes/${collection.collection}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });

    const notes = await getNoteCollectionNotes(collection.kind, collection.collection);
    for (const note of notes) {
      noteDetailUrls.push({
        url: buildUrl(`/notes/${collection.collection}/${note.slug}`),
        lastModified: new Date(note.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  }

  return [
    ...staticPages,
    ...blogUrls,
    ...projectUrls,
    ...noteIndexUrls,
    ...noteDetailUrls,
    ...toolUrls,
  ];
}
