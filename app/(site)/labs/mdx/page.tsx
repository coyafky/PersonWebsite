import type { Metadata } from "next";
import Link from "next/link";
import { mdxSamples } from "@/lib/mdx-samples";

export const metadata: Metadata = {
  title: "博客组件预览",
  robots: { index: false, follow: false },
};

export default function MdxLabPage() {
  return (
    <section>
      <header className="mdx-lab-intro">
        <span className="mdx-lab-label">MDX / COMPONENT LIBRARY</span>
        <h1>让内容决定形式。</h1>
        <p>
          博客基础组件的阅读样板。以普通文本承载观点，用组件解释比较、流程和操作；两篇样板展示与真实文章相同的渲染效果。
        </p>
      </header>
      <div className="mdx-lab-grid">
        {mdxSamples.map((sample) => (
          <Link
            className="mdx-lab-card"
            key={sample.slug}
            href={`/labs/mdx/${sample.slug}`}
          >
            <span className="mdx-lab-label">{sample.number} / SAMPLE</span>
            <h2>{sample.title}</h2>
            <p>{sample.description}</p>
            <span>查看样板 →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
