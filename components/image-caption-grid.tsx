import type { CSSProperties, ReactNode } from "react";
import { ImageLightbox } from "@/components/image-lightbox";

export type ImageCaptionItem = {
  src?: string;
  alt: string;
  title: string;
  description?: string;
};

export function ImageCaptionGrid({
  title,
  columns = 3,
  children,
}: {
  title?: string;
  columns?: number;
  children?: ReactNode;
}) {
  const safeColumns = Math.max(1, Math.min(Math.round(columns), 6));
  const style = {
    "--image-caption-columns": safeColumns,
    "--image-caption-columns-mobile": safeColumns === 1 ? 1 : 2,
  } as CSSProperties;

  return (
    <figure className="image-caption-grid" style={style}>
      {title ? <figcaption className="image-caption-grid-title">{title}</figcaption> : null}
      <div className="image-caption-grid-items">
        {children}
      </div>
    </figure>
  );
}

export function ImageCaptionItem({ src, alt, title, description }: ImageCaptionItem) {
  return (
    <article className="image-caption-card">
      <div className="image-caption-card-media">
        {src ? (
          <ImageLightbox src={src} alt={alt}>
            {/* eslint-disable-next-line @next/next/no-img-element -- the MDX component accepts local and external lesson assets. */}
            <img
              src={src}
              alt={alt}
              className="image-caption-card-image"
              loading="lazy"
            />
          </ImageLightbox>
        ) : (
          <div className="image-caption-card-placeholder" aria-label={`${title}暂无图片`}>
            <span aria-hidden="true">▧</span>
            <small>暂无图片</small>
          </div>
        )}
      </div>
      <div className="image-caption-card-copy">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
    </article>
  );
}
