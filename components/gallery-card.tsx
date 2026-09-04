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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(post.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paramEntries = Object.entries(post.params);
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
            width={560}
            height={560}
            sizes="(max-width: 768px) 100vw, 280px"
          />
        </div>
        <header className="entry-card-gallery-header">
          <h2 className="entry-card-gallery-title">{post.title}</h2>
          <span className="entry-card-gallery-model">{post.model}</span>
        </header>
      </button>

      {expanded ? (
        <div
          id={`gallery-details-${post.slug}`}
          className="entry-card-gallery-details"
        >
          <section className="entry-card-gallery-detail-block">
            <div className="entry-card-gallery-detail-header">
              <h3>Prompt</h3>
              <button
                type="button"
                className="entry-card-gallery-copy"
                onClick={handleCopy}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
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
