import Link from "next/link";

type EntryCardCourseTopicProps = {
  href: string;
  title: string;
  platform: string;
  instructor: string;
  summary?: string;
  noteCount: number;
};

export function EntryCardCourseTopic({
  href,
  title,
  platform,
  instructor,
  summary,
  noteCount,
}: EntryCardCourseTopicProps) {
  return (
    <article className="course-card">
      <Link href={href} className="course-card-link">
        <div className="course-card-meta">
          <span className="course-card-platform">{platform}</span>
          <span className="course-card-count">
            {noteCount === 0 ? "No notes yet" : `${noteCount} note${noteCount > 1 ? "s" : ""}`}
          </span>
        </div>
        <h3 className="course-card-title">{title}</h3>
        <p className="course-card-instructor">by {instructor}</p>
        {summary ? <p className="course-card-summary">{summary}</p> : null}
      </Link>
    </article>
  );
}
