import Link from "next/link";
import { CollectionList } from "@/components/collection-list";
import { EntryCardBlog } from "@/components/entry-card-blog";
import { getDiaryArchive } from "@/lib/content";

export const metadata = {
  title: "Diary",
  description: "A dated work journal — what I actually did, day by day.",
};

function formatMonth(month: string) {
  const [year, mm] = month.split("-");
  return `${year} 年 ${Number(mm)} 月`;
}

export default async function DiaryPage() {
  const archive = await getDiaryArchive();
  const total = archive.reduce((sum, group) => sum + group.count, 0);

  return (
    <div className="page-shell">
      <CollectionList
        title="Diary"
        description={`一天一篇的工作记录，按时间倒序。共 ${total} 篇。`}
      >
        {archive.map((group) => (
          <section key={group.month} className="diary-month">
            <h2 className="diary-month-heading">
              {formatMonth(group.month)}
              <span className="diary-month-count">{group.count}</span>
            </h2>
            {group.entries.map((entry) => (
              <EntryCardBlog
                key={entry.slug}
                href={`/diary/${entry.slug}`}
                title={entry.title}
                summary={entry.summary}
                date={entry.date}
                tags={entry.tags}
              />
            ))}
          </section>
        ))}
      </CollectionList>

      {total === 0 ? (
        <p style={{ opacity: 0.7 }}>
          还没有日记。回头看看 <Link href="/blog">Blog</Link>。
        </p>
      ) : null}
    </div>
  );
}
