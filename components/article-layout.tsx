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
      <div className="article-layout__content">
        {headings.length > 0 && (
          <noscript>
            <nav className="mdx-toc-fallback" aria-label="文章目录">
              <strong>文章目录</strong>
              <ul>
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`}>{heading.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </noscript>
        )}
        {children}
      </div>
      <ArticleToc headings={headings} />
    </div>
  );
}
