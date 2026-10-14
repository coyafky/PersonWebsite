export type LinkPreviewProps = {
  url: string;
  title: string;
  description: string;
  image?: string;
  siteName?: string;
};

export function LinkPreview({
  url,
  title,
  description,
  image,
  siteName,
}: LinkPreviewProps) {
  return (
    <article className={`mdx-link-preview${image ? " mdx-link-preview--with-image" : ""}`}>
      <a className="mdx-link-preview-link" href={url} target="_blank" rel="noreferrer">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- static MDX preview images use the same repository path contract as article images.
          <img className="mdx-link-preview-image" src={image} alt="" loading="lazy" />
        ) : null}
        <div className="mdx-link-preview-copy">
          {siteName ? <p className="mdx-link-preview-site">{siteName}</p> : null}
          <h3>{title}</h3>
          <p className="mdx-link-preview-description">{description}</p>
          <p className="mdx-link-preview-url">{url}</p>
        </div>
      </a>
    </article>
  );
}
