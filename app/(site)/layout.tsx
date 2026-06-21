import type { ReactNode } from "react";
import { PageTransitionWrapper } from "@/components/animations";
import { SiteNav } from "@/components/site-nav";
import { BackToTop } from "@/components/back-to-top";
import { SearchDialog } from "@/components/search-dialog";

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
      <BackToTop />
      <SearchDialog />
    </>
  );
}
