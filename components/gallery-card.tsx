"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryPost } from "@/lib/content";
import { GalleryDetails } from "@/components/gallery-details";

type GalleryCardProps = {
  post: GalleryPost;
};

/** 单张成品图案例。多图案例由 GalleryCarouselCard 独立承载。 */
export function GalleryCard({ post }: GalleryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const referenceImages = post.referenceImages ?? [];

  const ratioParts = (post.params.ratio ?? "1:1").split(":").map(Number);
  const ratioW = Number.isFinite(ratioParts[0]) && ratioParts[0] > 0 ? ratioParts[0] : 1;
  const ratioH = Number.isFinite(ratioParts[1]) && ratioParts[1] > 0 ? ratioParts[1] : 1;
  const imageWidth = 1000;
  const imageHeight = Math.round((imageWidth * ratioH) / ratioW);
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
            width={imageWidth}
            height={imageHeight}
            sizes="(max-width: 768px) 100vw, 320px"
          />
          <header className="entry-card-gallery-header">
            <h2 className="entry-card-gallery-title">{post.title}</h2>
            <div className="entry-card-gallery-badges">
              <span className="entry-card-gallery-model">{post.model}</span>
              {referenceImages.length > 0 ? (
                <span className="entry-card-gallery-reference-count">
                  {referenceImages.length} reference{referenceImages.length > 1 ? "s" : ""}
                </span>
              ) : null}
            </div>
          </header>
        </div>
      </button>

      {expanded ? (
        <GalleryDetails post={post} id={`gallery-details-${post.slug}`} />
      ) : null}
    </article>
  );
}
