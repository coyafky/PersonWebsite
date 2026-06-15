import type { ReactNode } from "react";
import type { Heading } from "@/lib/content/headings";
import { ArticleToc } from "./article-toc";

type ArticleLayoutProps = {
  headings: Heading[];
  children: ReactNode;
};

export function ArticleLayout({ headings, children }: ArticleLayoutProps) {
  return (
    <div className="article-layout">
      <div className="article-layout__content">{children}</div>
      <ArticleToc headings={headings} />
    </div>
  );
}
