import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SITE_NAME, buildUrl } from "@/lib/metadata";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="zh-CN" className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
