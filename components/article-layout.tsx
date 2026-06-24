import type { ReactNode } from "react";
import type { Heading } from "@/lib/content/headings";
import { ArticleToc } from "./article-toc";
import { ArticleFooterReveal, ArticleHeaderReveal } from "./article-reveal";

type ArticleLayoutProps = {
  headings: Heading[];
  children: ReactNode;
  /**
   * Optional header slot — direct children are staggered via P18.
   * Pass an array of <h1>/<p>/<span> nodes for a clean headline reveal.
   * If omitted, the article body is wrapped as a single P3 panel reveal.
   */
  header?: ReactNode;
  /**
   * Optional footer slot — wrapped as a single P3 panel reveal.
   * Omit to fall back to the default body panel reveal.
   */
  footer?: ReactNode;
};

export function ArticleLayout({
  headings,
  children,
  header,
  footer,
}: ArticleLayoutProps) {
  return (
    <div className="article-layout">
      {header ? (
        <div className="article-layout__content">
          <ArticleHeaderReveal as="div" className="article-header-reveal-slot">
            {header}
          </ArticleHeaderReveal>
          {children}
        </div>
      ) : (
        <ArticleFooterReveal as="div" className="article-layout__content">
          {children}
        </ArticleFooterReveal>
      )}
      {footer ? (
        <ArticleFooterReveal as="div" className="article-layout__footer">
          {footer}
        </ArticleFooterReveal>
      ) : null}
      <ArticleToc headings={headings} />
    </div>
  );
}
