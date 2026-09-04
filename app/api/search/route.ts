import { NextResponse } from "next/server";
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

  const [blog, weekly, projects, gallery] = await Promise.all([
    getBlogPosts(),
    getWeeklyPosts(),
    getProjectPosts(),
    getGalleryPosts(),
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

  for (const post of gallery) {
    const score = matchScore(post, q);
    if (score > 0) hits.push({ title: post.title, summary: post.summary, url: `/gallery#${encodeURIComponent(post.slug)}`, date: post.date });
  }

  // Book notes
  const bookTopics = await getBookTopics();
  for (const book of bookTopics) {
    const notes = await getBookNotes(book.book);
    for (const note of notes) {
      const score = matchScore(note, q);
      if (score > 0) {
        hits.push({
          title: note.title,
          summary: note.summary,
          url: `/book-list/${book.book}/${note.slug}`,
          date: note.date,
        });
      }
    }
  }

  // Course notes
  const courseTopics = await getCourseTopics();
  for (const course of courseTopics) {
    const notes = await getCourseNotes(course.course);
    for (const note of notes) {
      const score = matchScore(note, q);
      if (score > 0) {
        hits.push({
          title: note.title,
          summary: note.summary,
          url: `/course-list/${course.course}/${note.slug}`,
          date: note.date,
        });
      }
    }
  }

  // Learning
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
