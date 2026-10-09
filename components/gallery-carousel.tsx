"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryPost } from "@/lib/content";

type GalleryCarouselProps = {
  title: string;
  model: string;
  referenceCount: number;
  images: GalleryPost["carouselImages"];
  imageWidth: number;
  imageHeight: number;
  expanded: boolean;
  onToggleDetails: () => void;
};

/**
 * 多图生成案例的作品切换器。
 *
 * carouselImages 只承载同一提示词生成的成品图；原始输入图仍由
 * GalleryCard 的 referenceImages 区域展示。这样“输入 → 多张输出”的
 * 关系在卡片第一屏就能被看懂，旧的单图案例继续使用原来的封面模式。
 */
export function GalleryCarousel({
  title,
  model,
  referenceCount,
  images,
  imageWidth,
  imageHeight,
  expanded,
  onToggleDetails,
}: GalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage) return null;

  return (
    <div className="entry-card-gallery-carousel">
      <div className="entry-card-gallery-cover">
        <button
          type="button"
          className="entry-card-gallery-carousel-stage"
          onClick={onToggleDetails}
          aria-expanded={expanded}
          aria-label={`${title}：查看提示词和案例详情`}
        >
          <Image
            src={activeImage.src}
            alt={`${title} · ${activeImage.label}`}
            width={imageWidth}
            height={imageHeight}
            sizes="(max-width: 768px) 100vw, 320px"
            priority={activeIndex === 0}
          />
          <header className="entry-card-gallery-header">
            <h2 className="entry-card-gallery-title">{title}</h2>
            <div className="entry-card-gallery-badges">
              <span className="entry-card-gallery-model">{model}</span>
              <span className="entry-card-gallery-reference-count">
                {images.length} outputs · {referenceCount} reference
                {referenceCount === 1 ? "" : "s"}
              </span>
            </div>
          </header>
        </button>
      </div>

      <div
        className="entry-card-gallery-carousel-controls"
        role="group"
        aria-label={`${title}：切换成品图`}
      >
        {images.map((image, index) => {
          const selected = index === activeIndex;
          return (
            <button
              type="button"
              className={
                selected
                  ? "entry-card-gallery-carousel-choice entry-card-gallery-carousel-choice-active"
                  : "entry-card-gallery-carousel-choice"
              }
              key={image.src}
              onClick={() => setActiveIndex(index)}
              aria-pressed={selected}
              aria-label={`显示第 ${index + 1} 张：${image.label}`}
            >
              <span className="entry-card-gallery-carousel-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{image.label}</span>
            </button>
          );
        })}
      </div>

      <div className="entry-card-gallery-carousel-status" aria-live="polite">
        <span>{activeImage.label}</span>
        <span>点击画面展开提示词</span>
      </div>
    </div>
  );
}
