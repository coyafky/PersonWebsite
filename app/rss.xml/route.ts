import { GET as feedGet } from "@/app/feed.xml/route";

/**
 * /rss.xml — 别名路由。
 *
 * 站点 footer 链接使用 /rss.xml（更通用的 RSS 路径），
 * 与现有 /feed.xml 提供相同的 RSS 2.0 输出，避免路径不一致导致 404。
 *
 * 通过直接复用 /feed.xml 的 GET 实现保持单一事实来源，
 * 内容（blog + weekly + ai-tracker 最新 20 篇）始终一致。
 */
export const dynamic = "force-dynamic";

export const GET = feedGet;