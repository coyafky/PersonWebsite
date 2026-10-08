import { headers } from "next/headers";
import { getBlogPosts } from "@/lib/content";
import { buildUrl } from "@/lib/metadata";

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
  return value.replace(/]]>/g, "]]]]><![CDATA[>");
}

function toRfc822(dateString: string): string {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) {
    return new Date(0).toUTCString();
  }
  return d.toUTCString();
}

type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  categories?: string[];
};

function buildItem(item: FeedItem): string {
  const categories = item.categories?.length
    ? item.categories.map((c) => `    <category>${escapeXml(c)}</category>`).join("\n") + "\n"
    : "";

  return (
    `  <item>\n` +
    `    <title>${escapeXml(item.title)}</title>\n` +
    `    <link>${item.link}</link>\n` +
    `    <guid isPermaLink="true">${item.link}</guid>\n` +
    `    <pubDate>${item.pubDate}</pubDate>\n` +
    `    <description><![CDATA[${escapeCdata(item.description)}]]></description>\n` +
    categories +
    `  </item>`
  );
}

async function getFeedItems(baseUrl: string): Promise<{ items: FeedItem[]; latestPub: string }> {
  // Diary 与 Weekly 已下架（内容归档），feed 只发 blog。
  const blog = await getBlogPosts();

  const feedItems: FeedItem[] = [];
  let latestPub: string | null = null;

  for (const post of blog) {
    const pubDate = toRfc822(post.date);
    if (latestPub === null || pubDate > latestPub) latestPub = pubDate;
    feedItems.push({
      title: post.title,
      link: buildUrl(`/blog/${post.slug}`),
      pubDate,
      description: post.summary,
      categories: post.tags,
    });
  }

  feedItems.sort((a, b) => b.pubDate.localeCompare(a.pubDate));

  return {
    items: feedItems,
    latestPub: latestPub ?? new Date().toUTCString(),
  };
}

export async function GET() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;
  const feedUrl = buildUrl("/feed.xml");

  const { items, latestPub } = await getFeedItems(baseUrl);

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    `  <channel>\n` +
    `    <title>${escapeXml("Coya's Site")}</title>\n` +
    `    <link>${baseUrl}</link>\n` +
    `    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />\n` +
    `    <description>Writing on engineering, AI, and craft.</description>\n` +
    `    <language>zh-CN</language>\n` +
    `    <lastBuildDate>${latestPub}</lastBuildDate>\n` +
    items.map(buildItem).join("\n") +
    (items.length > 0 ? "\n" : "") +
    `  </channel>\n` +
    `</rss>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
