import type { ReactNode } from "react";
import { ImageLightbox } from "@/components/image-lightbox";

export function ImageTextList({
  title,
  intro,
  children,
}: {
  title?: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="image-text-list">
      {title ? <h3 className="image-text-list-title">{title}</h3> : null}
      {intro ? <p className="image-text-list-intro">{intro}</p> : null}
      <div className="image-text-list-items">{children}</div>
    </section>
  );
}

export function ImageTextItem({
  src,
  alt,
  eyebrow,
  title,
  description,
  keywords,
}: {
  src?: string;
  alt: string;
  eyebrow?: string;
  title: string;
  description: string;
  keywords?: string;
}) {
  return (
    <article className="image-text-item">
      <div className="image-text-item-media">
        {src ? (
          <ImageLightbox src={src} alt={alt}>
            {/* eslint-disable-next-line @next/next/no-img-element -- the MDX component accepts local and external lesson assets. */}
            <img
              src={src}
              alt={alt}
              className="image-text-item-image"
              loading="lazy"
            />
          </ImageLightbox>
        ) : (
          <div className="image-text-item-placeholder" aria-label={`${title}暂无图片`}>
            <span aria-hidden="true">▧</span>
            <small>暂无图片</small>
          </div>
        )}
      </div>
      <div className="image-text-item-copy">
        {eyebrow ? <p className="image-text-item-eyebrow">{eyebrow}</p> : null}
        <h4>{title}</h4>
        <p className="image-text-item-description">{description}</p>
        {keywords ? (
          <p className="image-text-item-keywords">
            <span>关键词：</span>
            {keywords}
          </p>
        ) : null}
      </div>
    </article>
  );
}
