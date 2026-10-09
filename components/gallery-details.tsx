"use client";

import { useState } from "react";
import type { GalleryPost } from "@/lib/content";
import { ImageLightbox } from "@/components/image-lightbox";

type GalleryDetailsProps = {
  post: GalleryPost;
  id?: string;
};

/**
 * Gallery 单图和多图案例共用的详情面板。
 * 封面/轮播布局各自独立，只有 prompt、参考图和参数详情保持一致。
 */
export function GalleryDetails({ post, id }: GalleryDetailsProps) {
  const [copied, setCopied] = useState(false);
  const referenceImages = post.referenceImages ?? [];
  const copyText = post.fullPrompt ?? post.prompt;
  const paramEntries = Object.entries(post.params);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id={id} className="entry-card-gallery-details">
      {referenceImages.length > 0 ? (
        <section className="entry-card-gallery-detail-block">
          <div className="entry-card-gallery-detail-header">
            <h3>参考图 · {referenceImages.length}</h3>
            <span className="entry-card-gallery-detail-meta">点击图片放大</span>
          </div>
          <div className="entry-card-gallery-references">
            {referenceImages.map((src, index) => (
              <span className="entry-card-gallery-reference" key={src}>
                <ImageLightbox
                  src={src}
                  alt={`${post.title} 参考图 ${index + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- reference assets may be local or externally hosted. */}
                  <img
                    src={src}
                    alt={`${post.title} 参考图 ${index + 1}`}
                    loading="lazy"
                  />
                </ImageLightbox>
              </span>
            ))}
          </div>
        </section>
      ) : null}

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
  );
}
