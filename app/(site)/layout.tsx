import type { ReactNode } from "react";
import { PageTransitionWrapper } from "@/components/animations";
import { SiteNav } from "@/components/site-nav";
import { SectionFooter } from "@/components/section-footer";
import { BackToTop } from "@/components/back-to-top";
import { SearchDialog } from "@/components/search-dialog";

export default function SiteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <SiteNav />
      <main>
        <PageTransitionWrapper>{children}</PageTransitionWrapper>
      </main>
      <SectionFooter />
      <BackToTop />
      <SearchDialog />
    </>
  );
}
