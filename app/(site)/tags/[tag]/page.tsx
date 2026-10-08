import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/content-card";
import { EntryCardBlog } from "@/components/entry-card-blog";
import { EntryCardNote } from "@/components/entry-card-note";
import { EntryCardProject } from "@/components/entry-card-project";
import { EntryCardWeekly } from "@/components/entry-card-weekly";
import { getAllTags, getContentByTag } from "@/lib/content";
import type { LearningPost } from "@/lib/content/schemas";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

/**
 * 把标签页预渲染成静态页。
 *
 * 加这个之前 /tags/[tag] 是 **ƒ Dynamic** —— 每次访问都要全量扫盘
 * （getContentByTag 会拉全站 8 个集合：blog + projects + career +
 * notes 的 topic / book index+notes / course index+notes —— 注：projects 无
 * tags 字段，恒贡献 0，读取只为保持跨集合契约稳定）。
 * 对照：/blog/[slug]、/notes/* 一直是静态的，只有 tags 这条是动态。
 *
 * 2026-09-20 标签精简后只剩 73 个，全部预渲染成本很低。
 *
 * ⚠️ 刻意**不设** `export const dynamicParams = false`：
 * 正文里可能存在指向长尾标签的链接，设成 false 会让那些 /tags/xxx 直接 404。
 * 保持默认（true）→ 已知的走静态，未知的仍可按需渲染，不会造死链。
 */
export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((item) => ({ tag: item.tag }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `Content tagged with "${tag}"`,
  };
}

function groupLearningByTopic(posts: LearningPost[]) {
  const groups = new Map<string, LearningPost[]>();
  for (const post of posts) {
    const list = groups.get(post.topic) ?? [];
    list.push(post);
    groups.set(post.topic, list);
  }
  return groups;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const { items, totalByKind } = await getContentByTag(tag);

  const totalHits = Object.values(totalByKind).reduce((sum, n) => sum + n, 0);
  if (totalHits === 0) {
    notFound();
  }

  const collectionCount = Object.values(totalByKind).filter((n) => n > 0).length;
  const learningByTopic = groupLearningByTopic(items.learning);

  return (
    <div className="page-shell narrow">
      <header className="page-header">
        <h1>#{tag}</h1>
        <p>
          {totalHits} {totalHits === 1 ? "item" : "items"} across {collectionCount}{" "}
          {collectionCount === 1 ? "collection" : "collections"}
        </p>
      </header>

      {totalByKind.blog > 0 ? (
        <section>
          <h2>Blog</h2>
          <div className="stack-list">
            {items.blog.map((post) => (
              <EntryCardBlog
                key={post.slug}
                href={`/blog/${post.slug}`}
                title={post.title}
                summary={post.summary}
                date={post.date}
                tags={post.tags}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/*
        Diary 与 Weekly 两段已移除（2026-10-07）：两个模块整体下架、内容归档，
        渲染段留着只会输出指向 308 桩的链接。
        若日后恢复，需同时补回 reader 的 TaggedContentByKind + 扫描逻辑。
      */}

      {totalByKind.projects > 0 ? (
        <section>
          <h2>Projects</h2>
          <div className="stack-list">
            {items.projects.map((post) => (
              <EntryCardProject
                key={post.slug}
                href={`/projects/${post.slug}`}
                title={post.title}
                summary={post.summary}
                stack={post.stack}
                impact={post.impact}
                featured={post.featured}
                period={post.period}
                cover={post.cover}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/*
        Notes 段（原 Learning / Book List / Course List 三段合并）。
        topic 用「按主题折叠」形态保留原来的文章清单；书 / 课用卡片形态。
        href 都是合并后的扁平 URL `/notes/<collection>`。
      */}
      {totalByKind.learning > 0 ? (
        <section>
          <h2>Notes — Topics</h2>
          <div className="stack-list">
            {[...learningByTopic.entries()].map(([topic, posts]) => (
              <EntryCardNote
                key={topic}
                href={`/notes/${topic}`}
                title={topic}
                posts={posts.map((p) => ({ slug: p.slug, title: p.title, summary: p.summary }))}
              />
            ))}
          </div>
        </section>
      ) : null}

      {totalByKind.bookIndex > 0 ? (
        <section>
          <h2>Notes — Books</h2>
          <div className="entry-card-note-grid">
            {items.bookIndex.map((post) => (
              <EntryCardNote
                key={post.slug}
                href={`/notes/${post.book}`}
                kindLabel="Book"
                title={post.title}
                meta={post.genre}
                byline={post.author}
                summary={post.summary}
              />
            ))}
          </div>
        </section>
      ) : null}

      {totalByKind.courseIndex > 0 ? (
        <section>
          <h2>Notes — Courses</h2>
          <div className="entry-card-note-grid">
            {items.courseIndex.map((post) => (
              <EntryCardNote
                key={post.slug}
                href={`/notes/${post.course}`}
                kindLabel="Course"
                title={post.title}
                meta={post.platform}
                byline={post.instructor}
                summary={post.summary}
              />
            ))}
          </div>
        </section>
      ) : null}

      {totalByKind.career > 0 ? (
        <section>
          <h2>Career</h2>
          <div className="stack-list">
            {items.career.map((post) => (
              <ContentCard
                key={post.slug}
                href={`/about#${post.slug}`}
                title={post.title}
                summary={post.summary}
                tags={post.tags ?? []}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
