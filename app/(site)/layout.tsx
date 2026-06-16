import type { ReactNode } from "react";
import { PageTransitionWrapper } from "@/components/page-transition";
import { SiteNav } from "@/components/site-nav";

export default function SiteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <SiteNav />
      <main>
        <PageTransitionWrapper>{children}</PageTransitionWrapper>
      </main>
      <footer className="site-footer">
        <p>Built for writing, project evidence, and career preparation.</p>
      </footer>
    </>
  );
}
