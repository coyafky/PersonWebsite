"use client";

import { useState } from "react";
import type { GalleryPost } from "@/lib/content";
import { GalleryCarousel } from "@/components/gallery-carousel";
import { GalleryDetails } from "@/components/gallery-details";

type GalleryCarouselCardProps = {
  post: GalleryPost;
};

/**
 * 多图生成案例的独立卡片。
 * 它不复用单图 GalleryCard 的封面结构，轮播、切换器和详情展开由自己管理。
 */
export function GalleryCarouselCard({ post }: GalleryCarouselCardProps) {
  const [expanded, setExpanded] = useState(false);
  const referenceImages = post.referenceImages ?? [];
  const carouselImages = post.carouselImages ?? [];

  const ratioParts = (post.params.ratio ?? "1:1").split(":").map(Number);
  const ratioW = Number.isFinite(ratioParts[0]) && ratioParts[0] > 0 ? ratioParts[0] : 1;
  const ratioH = Number.isFinite(ratioParts[1]) && ratioParts[1] > 0 ? ratioParts[1] : 1;
  const imageWidth = 1000;
  const imageHeight = Math.round((imageWidth * ratioH) / ratioW);

  if (carouselImages.length === 0) return null;

  return (
    <article
      id={post.slug}
      className={
        expanded
          ? "entry-card-gallery entry-card-gallery-carousel-card entry-card-gallery-expanded"
          : "entry-card-gallery entry-card-gallery-carousel-card"
      }
    >
      <GalleryCarousel
        title={post.title}
        model={post.model}
        referenceCount={referenceImages.length}
        images={carouselImages}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        expanded={expanded}
        onToggleDetails={() => setExpanded((value) => !value)}
      />

      {expanded ? (
        <GalleryDetails post={post} id={`gallery-details-${post.slug}`} />
      ) : null}
    </article>
  );
}
