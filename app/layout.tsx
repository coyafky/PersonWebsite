import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Fraunces, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SITE_NAME, buildUrl } from "@/lib/metadata";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// UI chrome (nav, buttons, meta) — keep Inter for legibility at small sizes
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

// Editorial display — Fraunces with optical sizing for hero/heading scale
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["opsz"],
});

// Long-form reading body — Source Serif 4
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
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
    <html
      lang="zh-CN"
      className={`${inter.variable} ${fraunces.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
