import { NextResponse } from "next/server";
import {
  getBlogPosts,
  getNoteCollections,
  getNoteCollectionNotes,
  getProjectPosts,
  getGalleryPosts,
} from "@/lib/content";

type SearchHit = {
  title: string;
  summary: string;
  url: string;
  date: string;
};

function matchScore(item: { title: string; summary: string; body?: string }, query: string): number {
  const lowerTitle = item.title.toLowerCase();
  const lowerSummary = item.summary.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let score = 0;
  if (lowerTitle.includes(lowerQuery)) score += 3;
  if (lowerSummary.includes(lowerQuery)) score += 2;
  if (item.body?.toLowerCase().includes(lowerQuery)) score += 1;
  return score;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] });
  }

  // Diary 与 Weekly 已下架（内容归档），搜索不再收录。
  const [blog, projects, gallery] = await Promise.all([
    getBlogPosts(),
    getProjectPosts(),
    getGalleryPosts(),
  ]);

  const hits: SearchHit[] = [];

  for (const post of blog) {
    const score = matchScore(post, q);
    if (score > 0) hits.push({ title: post.title, summary: post.summary, url: `/blog/${post.slug}`, date: post.date });
  }

  for (const post of projects) {
    const score = matchScore(post, q);
    if (score > 0) hits.push({ title: post.title, summary: post.summary, url: `/projects/${post.slug}`, date: post.date });
  }

  for (const post of gallery) {
    const score = matchScore(post, q);
    if (score > 0) hits.push({ title: post.title, summary: post.summary, url: `/gallery#${encodeURIComponent(post.slug)}`, date: post.date });
  }

  // Notes：学习主题 / 书 / 课程三合一，URL 扁平 `/notes/<collection>/<slug>`
  const noteCollections = await getNoteCollections();
  for (const collection of noteCollections) {
    const notes = await getNoteCollectionNotes(collection.kind, collection.collection);
    for (const note of notes) {
      const score = matchScore(note, q);
      if (score > 0) {
        hits.push({
          title: note.title,
          summary: note.summary,
          url: `/notes/${collection.collection}/${note.slug}`,
          date: note.date,
        });
      }
    }
  }

  hits.sort((a, b) => {
    const scoreA = matchScore(
      { title: a.title, summary: a.summary },
      q,
    );
    const scoreB = matchScore(
      { title: b.title, summary: b.summary },
      q,
    );
    return scoreB - scoreA || b.date.localeCompare(a.date);
  });

  return NextResponse.json({ results: hits.slice(0, 10) });
}
