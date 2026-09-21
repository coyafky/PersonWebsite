import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { ComponentPropsWithoutRef } from "react";
import { Mermaid } from "@/components/mermaid";
import { extractText } from "@/lib/mdx-fence";
import { Callout } from "@/components/callout";
import { Timeline } from "@/components/timeline";
import { Tabs } from "@/components/tabs";
import { CopyButton } from "@/components/copy-button";
import { Tweet } from "@/components/tweet-embed";
import { YouTube } from "@/components/youtube-embed";
import { getImageMeta } from "@/lib/image-manifest";
import { ImageLightbox } from "@/components/image-lightbox";

const prettyCodeOptions = {
  theme: "github-light",
  keepBackground: false,
};

function CodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  const lang = (props as Record<string, unknown>)["data-language"] as string | undefined;

  if (lang === "mermaid") {
    return <Mermaid chart={extractText(props.children)} />;
  }

  const rawText = extractText(props.children);

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        {lang ? <div className="code-block-lang">{lang}</div> : <span />}
        <CopyButton text={rawText} />
      </div>
      <pre className="code-block-pre" {...props}>
        {props.children}
      </pre>
    </div>
  );
}

function MdxImage(props: ComponentPropsWithoutRef<"img">) {
  const src = typeof props.src === "string" ? props.src : undefined;
  const alt = typeof props.alt === "string" ? props.alt : "";

  if (!src) {
    return null;
  }

  /*
    宽高原先是 0/0（响应式写法）+ CSS `width:100%; height:auto` —— 浏览器因此
    推断不出宽高比，图片加载前的高度是 0，加载完突然撑开。实测（2026-09-20）：
    单张图 0px → 450px，等于视口的 58%，是真实的 CLS。

    清单里给了真实宽高之后，宽高比在图片到达之前就已知，高度按比例就位，CLS 归零；
    24px 模糊缩略图则让加载期呈现「显影」而不是空白。
    清单里没有这张图 → 退回原来的 0/0 行为，不报错、不阻塞构建。
  */
  const meta = getImageMeta(src);

  const image = (
    <Image
      src={src}
      alt={alt}
      width={meta?.width ?? 0}
      height={meta?.height ?? 0}
      sizes="(max-width: 820px) 100vw, 720px"
      placeholder={meta ? "blur" : "empty"}
      blurDataURL={meta?.blurDataURL}
      className="markdown-image"
    />
  );

  return (
    <ImageLightbox src={src} alt={alt}>
      <a className="markdown-image-link" href={src} target="_blank" rel="noreferrer">
        {image}
      </a>
    </ImageLightbox>
  );
}

const components = {
  Callout,
  Timeline,
  Tabs,
  Mermaid,
  Tweet,
  YouTube,
  img: MdxImage,
  pre: CodeBlock,
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
                [rehypePrettyCode, prettyCodeOptions],
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
