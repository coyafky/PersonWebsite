import { NextResponse } from "next/server";
import {
  getBlogPosts,
  getBookListPosts,
  getWeeklyPosts,
  getProjectPosts,
  getAiTrackerPosts,
  getLearningTopics,
  getLearningPosts,
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

  const [blog, weekly, projects, aiTracker, bookList] = await Promise.all([
    getBlogPosts(),
    getWeeklyPosts(),
    getProjectPosts(),
    getAiTrackerPosts(),
    getBookListPosts(),
  ]);

  const hits: SearchHit[] = [];

  for (const post of blog) {
    const score = matchScore(post, q);
    if (score > 0) hits.push({ title: post.title, summary: post.summary, url: `/blog/${post.slug}`, date: post.date });
  }

  for (const post of weekly) {
    const score = matchScore(post, q);
    if (score > 0) hits.push({ title: post.title, summary: post.summary, url: `/weekly/${post.slug}`, date: post.date });
  }

  for (const post of projects) {
    const score = matchScore(post, q);
    if (score > 0) hits.push({ title: post.title, summary: post.summary, url: `/projects/${post.slug}`, date: post.date });
  }

  for (const post of aiTracker) {
    const score = matchScore(post, q);
    if (score > 0) hits.push({ title: post.title, summary: post.summary, url: `/ai-tracker/${post.slug}`, date: post.date });
  }

  for (const post of bookList) {
    const score = matchScore(post, q);
    if (score > 0) hits.push({ title: post.title, summary: post.summary, url: `/book-list/${post.slug}`, date: post.date });
  }

  const topics = await getLearningTopics();
  for (const topic of topics) {
    const articles = await getLearningPosts(topic.topic);
    for (const article of articles) {
      const score = matchScore(article, q);
      if (score > 0) {
        hits.push({
          title: article.title,
          summary: article.summary,
          url: `/learning/${topic.topic}/${article.slug}`,
          date: article.date,
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
