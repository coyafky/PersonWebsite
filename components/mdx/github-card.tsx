export type GitHubCardProps = {
  repository: string;
  name: string;
  description: string;
  url: string;
  language?: string;
  stars?: number;
  forks?: number;
  license?: string;
};

export function GitHubCard({
  repository,
  name,
  description,
  url,
  language,
  stars,
  forks,
  license,
}: GitHubCardProps) {
  return (
    <article className="mdx-github-card">
      <a
        className="mdx-github-card-link"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        <div className="mdx-github-card-header">
          <span className="mdx-github-card-mark" aria-hidden="true">
            GH
          </span>
          <span className="mdx-github-card-source">{repository}</span>
          <span className="mdx-github-card-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
        <h3>{name}</h3>
        <p className="mdx-github-card-description">{description}</p>
        <div className="mdx-github-card-meta" aria-label="项目快照信息">
          {language ? <span>{language}</span> : null}
          {typeof stars === "number" ? <span>★ {stars} stars</span> : null}
          {typeof forks === "number" ? <span>⑂ {forks} forks</span> : null}
          {license ? <span>{license}</span> : null}
        </div>
      </a>
      <p className="mdx-github-card-note">作者核验时记录的公开信息，数据可能过期。</p>
    </article>
  );
}
