"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryPost } from "@/lib/content";

type GalleryCardProps = {
  post: GalleryPost;
};

/**
 * Extend card for an AI image generation entry: shows the image, title and
 * model badge by default; clicking expands to reveal the full prompt,
 * negative prompt and generation params, with a copy button for the prompt.
 * Client Component.
 */
export function GalleryCard({ post }: GalleryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // 复制「完整提示词」—— 短关键词粘出去复现不出这张图，复制它没有意义
  const copyText = post.fullPrompt ?? post.prompt;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paramEntries = Object.entries(post.params);

  // 每篇按自己的 params.ratio 出图（有 1:1 也有 3:4）。Next/Image 的 width/height
  // 只用来定"占位盒"的比例 —— 如果这里写死 1:1 而真图是 3:4，图加载完会跳一下。
  // 所以从内容里已有的 ratio 字段推导，不新增字段。
  const ratioParts = (post.params.ratio ?? "1:1").split(":").map(Number);
  const ratioW = Number.isFinite(ratioParts[0]) && ratioParts[0] > 0 ? ratioParts[0] : 1;
  const ratioH = Number.isFinite(ratioParts[1]) && ratioParts[1] > 0 ? ratioParts[1] : 1;
  const IMG_W = 1000;
  const IMG_H = Math.round((IMG_W * ratioH) / ratioW);
  const cardClassName = expanded
    ? "entry-card-gallery entry-card-gallery-expanded"
    : "entry-card-gallery";

  return (
    <article id={post.slug} className={cardClassName}>
      <button
        type="button"
        className="entry-card-gallery-trigger"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls={`gallery-details-${post.slug}`}
      >
        <div className="entry-card-gallery-cover">
          <Image
            src={post.image}
            alt={post.title}
            width={IMG_W}
            height={IMG_H}
            sizes="(max-width: 768px) 100vw, 320px"
          />
          {/*
            标题与模型徽章叠在图上、默认隐去。
            /gallery 是 DESIGN.md 里的 Experience 模式：作品从第一屏就主导，
            界面后退 —— 常亮的标题栏属于「界面在主导」。
            hover / focus / 展开时才浮出；无悬停能力的触屏由 CSS 常驻（见 globals.css）。
          */}
          <header className="entry-card-gallery-header">
            <h2 className="entry-card-gallery-title">{post.title}</h2>
            <span className="entry-card-gallery-model">{post.model}</span>
          </header>
        </div>
      </button>

      {expanded ? (
        <div
          id={`gallery-details-${post.slug}`}
          className="entry-card-gallery-details"
        >
          {post.fullPrompt ? (
            <section className="entry-card-gallery-detail-block">
              <div className="entry-card-gallery-detail-header">
                <h3>Prompt · 完整版</h3>
                <button
                  type="button"
                  className="entry-card-gallery-copy"
                  onClick={handleCopy}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <p className="entry-card-gallery-note">
                这张图实际是用下面这段生成的，可以直接粘去复现。
              </p>
              <pre className="entry-card-gallery-prompt">{post.fullPrompt}</pre>
            </section>
          ) : null}

          <section className="entry-card-gallery-detail-block">
            <h3>{post.fullPrompt ? "原始关键词" : "Prompt"}</h3>
            {post.fullPrompt ? (
              <p className="entry-card-gallery-note">
                最初记下的概念，只有几个词 —— 单靠它复现不出上面的图。
              </p>
            ) : null}
            <pre className="entry-card-gallery-prompt">{post.prompt}</pre>
          </section>

          {post.negativePrompt ? (
            <section className="entry-card-gallery-detail-block">
              <h3>Negative Prompt</h3>
              <pre className="entry-card-gallery-prompt">
                {post.negativePrompt}
              </pre>
            </section>
          ) : null}

          {paramEntries.length > 0 ? (
            <section className="entry-card-gallery-detail-block">
              <h3>Params</h3>
              <dl className="entry-card-gallery-params">
                {paramEntries.map(([key, value]) => (
                  <div className="entry-card-gallery-param" key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
