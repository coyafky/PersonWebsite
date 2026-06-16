import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { ComponentPropsWithoutRef } from "react";
import { Mermaid } from "@/components/mermaid";
import { extractText, isMermaidCodeChild } from "@/lib/mdx-fence";
import { Callout } from "@/components/callout";
import { Timeline } from "@/components/timeline";
import { Tabs } from "@/components/tabs";

function MdxPre(props: ComponentPropsWithoutRef<"pre">) {
  const child = Array.isArray(props.children) ? props.children[0] : props.children;
  if (isMermaidCodeChild(child)) {
    return <Mermaid chart={extractText(child.props.children)} />;
  }
  return <pre {...props} />;
}

function MdxImage(props: ComponentPropsWithoutRef<"img">) {
  const src = typeof props.src === "string" ? props.src : undefined;
  const image = <img {...props} className="markdown-image" loading="lazy" decoding="async" />;

  if (!src) {
    return image;
  }

  return (
    <a className="markdown-image-link" href={src} target="_blank" rel="noreferrer">
      {image}
    </a>
  );
}

const components = {
  Callout,
  Timeline,
  Tabs,
  Mermaid,
  img: MdxImage,
  pre: MdxPre,
};

export async function MdxContent({ source }: { source: string }) {
  return (
    <div className="markdown-table-wrap">
      <div className="markdown-body">
        <MDXRemote
          source={source}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [
                  rehypeAutolinkHeadings,
                  {
                    behavior: "wrap",
                    properties: { className: ["heading-anchor"] },
                    test: "h2, h3",
                  },
                ],
              ],
            },
          }}
        />
      </div>
    </div>
  );
}
