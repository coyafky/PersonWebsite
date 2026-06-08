import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";

export default function SiteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
      <footer className="site-footer">
        <p>Built for writing, project evidence, and career preparation.</p>
      </footer>
    </>
  );
}
