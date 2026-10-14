import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SITE_NAME, buildUrl } from "@/lib/metadata";
import "./globals.css";
import "./portfolio.css";
import "./mdx.css";

export const metadata: Metadata = {
  metadataBase: new URL(buildUrl("/")),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "冯科雅 Coya 的个人作品集：企业 AI 应用、营销工作流、销售助理与知识库实践。",
  keywords: ["企业 AI 应用", "AI 营销", "工作流", "Coya", "冯科雅"],
  authors: [{ name: "Coya Feng" }],
  creator: "Coya Feng",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "冯科雅 Coya 的个人作品集：企业 AI 应用、营销工作流、销售助理与知识库实践。",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description:
      "冯科雅 Coya 的个人作品集：企业 AI 应用、营销工作流、销售助理与知识库实践。",
  },
  icons: {
    icon: "/site-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
