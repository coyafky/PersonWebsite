import { headers } from "next/headers";
import { getAiTrackerPosts } from "@/lib/content";
import type { AiTrackerPost } from "@/lib/content/schemas";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCdata(value: string): string {
  // CDATA cannot contain "]]>" — replace with a safe split.
  return value.replace(/]]>/g, "]]]]><![CDATA[>");
}

function toRfc822(dateString: string): string {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) {
    return new Date(0).toUTCString();
  }
  return d.toUTCString();
}

function buildRssXml(posts: AiTrackerPost[], baseUrl: string): string {
  const channelLink = `${baseUrl}/ai-tracker`;
  const feedUrl = `${baseUrl}/ai-tracker/feed.xml`;

  const items: string[] = [];
  let latestPub: string | null = null;

  for (const post of posts) {
    const pubDate = toRfc822(post.publishedAt ?? post.date);
    if (latestPub === null || pubDate > latestPub) {
      latestPub = pubDate;
    }

    const link = `${baseUrl}/ai-tracker/${post.slug}`;
    const title = escapeXml(post.title);

    const descParts: string[] = [post.summary];
    if (post.signalLabel) {
      descParts.push(`Signal: ${post.signalLabel}`);
    }
    if (post.topics.length > 0) {
      descParts.push(`Topics: ${post.topics.join(", ")}`);
    }
    const description = escapeCdata(descParts.join(" · "));

    const categories = post.topics
      .map((t) => `    <category>${escapeXml(t)}</category>`)
      .join("\n");

    const sourceTag = post.sourceUrl
      ? `    <source url="${escapeXml(post.sourceUrl)}">${escapeXml(post.sourceTitle ?? post.sourceUrl)}</source>\n`
      : "";

    items.push(
      `  <item>\n` +
        `    <title>${title}</title>\n` +
        `    <link>${link}</link>\n` +
        `    <guid isPermaLink="true">${link}</guid>\n` +
        `    <pubDate>${pubDate}</pubDate>\n` +
        `    <description><![CDATA[${description}]]></description>\n` +
        (categories ? `${categories}\n` : "") +
        sourceTag +
        `  </item>`,
    );
  }

  const lastBuildDate = latestPub ?? new Date().toUTCString();

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    `  <channel>\n` +
    `    <title>${escapeXml("AI Tracker — " + baseUrl.replace(/^https?:\/\//, ""))}</title>\n` +
    `    <link>${channelLink}</link>\n` +
    `    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />\n` +
    `    <description>${escapeXml("AI 信息摄取、阅读记录、观点沉淀与长期追踪。")}</description>\n` +
    `    <language>en-us</language>\n` +
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>\n` +
    items.join("\n") +
    (items.length > 0 ? "\n" : "") +
    `  </channel>\n` +
    `</rss>\n`
  );
}

export async function GET() {
  const posts = await getAiTrackerPosts();
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;
  const xml = buildRssXml(posts, baseUrl);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
