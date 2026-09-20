import type { ReactNode } from "react";
import { PageTransitionWrapper } from "@/components/animations";
import { SiteNav } from "@/components/site-nav";
import { SectionFooter } from "@/components/section-footer";
import { BackToTop } from "@/components/back-to-top";
import { MusicNowPlaying } from "@/components/MusicNowPlaying";

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

      {/* 常驻播放条：挂在 layout 层，站内任何页面都在（audio 本体在模块单例里） */}
      <MusicNowPlaying />
    </>
  );
}
