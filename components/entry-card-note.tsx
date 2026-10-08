import Link from "next/link";

type NotePostStub = {
  slug: string;
  title: string;
  summary?: string;
};

type EntryCardNoteProps = {
  /** 集合地址（`/notes/<collection>`）。折叠形态里兼作文章链接前缀。 */
  href: string;
  title: string;
  /** kind 标记：Topic / Book / Course。三合一后卡片外观一致，靠它区分来源。 */
  kindLabel?: string;
  /** 元信息行里的补充项：book 的 genre、course 的 platform。topic 不传。 */
  meta?: string;
  /** `by …` 一行：book 的 author、course 的 instructor。topic 不传。 */
  byline?: string;
  summary?: string;
  noteCount?: number;
  /**
   * 传了就切到「折叠」形态：`<details>` 里摊开这些文章（/tags 按主题分组在用）。
   * 不传就是默认卡片形态（/notes 的集合列表在用）。
   *
   * 为什么两种形态在一个组件里：合并前 learning 的卡是「主题 + 折叠文章列表」，
   * book/course 的卡是「书/课 + 元信息」，三者都要保留 —— 于是用可选字段
   * （meta / byline / posts）承载差异，而不是留三个只差几行的组件。
   * 空数组也算「传了」：会渲染出折叠外壳（与合并前 /tags 的空分组一致）。
   * Server Component。
   */
  posts?: NotePostStub[];
};

export function EntryCardNote({
  href,
  title,
  kindLabel,
  meta,
  byline,
  summary,
  noteCount,
  posts,
}: EntryCardNoteProps) {
  if (posts) {
    return (
      <details className="entry-card-note-fold">
        <summary className="entry-card-note-fold-summary">
          <span className="entry-card-note-fold-topic">{title}</span>
          <span className="entry-card-note-fold-count">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </summary>
        {summary ? (
          <p className="entry-card-note-fold-description">{summary}</p>
        ) : null}
        <ul className="entry-card-note-fold-posts">
          {posts.map((post) => (
            <li key={post.slug} className="entry-card-note-fold-post">
              <Link
                href={`${href}/${post.slug}`}
                className="entry-card-note-fold-post-link"
              >
                {post.title}
              </Link>
              {post.summary ? (
                <p className="entry-card-note-fold-post-summary">{post.summary}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </details>
    );
  }

  return (
    <article className="entry-card-note">
      <Link href={href} className="entry-card-note-link">
        <div className="entry-card-note-meta">
          {kindLabel ? (
            <span className="entry-card-note-kind">{kindLabel}</span>
          ) : null}
          {meta ? <span className="entry-card-note-meta-text">{meta}</span> : null}
          {/*
            noteCount 缺省时**不渲染**计数。合并前 /tags 的 book/course 分段
            硬传 noteCount={0}，于是「有 20 篇笔记的书」在标签页上写着
            "No notes yet" —— 那是页面不知道数量，不是真的没有。宁可不说。
          */}
          {noteCount === undefined ? null : (
            <span className="entry-card-note-count">
              {noteCount === 0 ? "No notes yet" : `${noteCount} note${noteCount > 1 ? "s" : ""}`}
            </span>
          )}
        </div>
        <h3 className="entry-card-note-title">{title}</h3>
        {byline ? <p className="entry-card-note-byline">by {byline}</p> : null}
        {summary ? <p className="entry-card-note-summary">{summary}</p> : null}
      </Link>
    </article>
  );
}
