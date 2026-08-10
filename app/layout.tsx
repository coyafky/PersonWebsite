import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SITE_NAME, buildUrl } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(buildUrl("/")),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Writing, weekly notes, projects, and career material.",
  keywords: ["blog", "weekly", "projects", "career", "software engineer"],
  authors: [{ name: "Coya Feng" }],
  creator: "Coya Feng",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: "Writing, weekly notes, projects, and career material.",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: "Writing, weekly notes, projects, and career material.",
  },
  icons: {
    icon: "/site-mark.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
