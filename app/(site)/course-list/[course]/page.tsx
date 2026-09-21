import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionList } from "@/components/collection-list";
import { MdxContent } from "@/components/mdx-content";
import { getCourseNotes, getCourseTopicIndex, getCourseTopics } from "@/lib/content";
import { SITE_NAME } from "@/lib/metadata";

type CoursePageProps = {
  params: Promise<{ course: string }>;
};

export async function generateStaticParams() {
  const topics = await getCourseTopics();
  return topics.map((t) => ({ course: t.course }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { course } = await params;
  const indexPost = await getCourseTopicIndex(course);

  if (!indexPost) {
    return {};
  }

  return {
    title: indexPost.title,
    description: indexPost.summary,
    openGraph: {
      title: indexPost.title,
      description: indexPost.summary,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary",
      title: indexPost.title,
      description: indexPost.summary,
    },
  };
}

export default async function CourseTopicPage({ params }: CoursePageProps) {
  const { course } = await params;
  const [indexPost, notes] = await Promise.all([
    getCourseTopicIndex(course),
    getCourseNotes(course),
  ]);

  if (!indexPost) {
    notFound();
  }

  return (
    <div className="page-shell">
      <CollectionList
        title={indexPost.title}
        description={`${notes.length} note${notes.length === 1 ? "" : "s"} on this course.`}
        actions={
          <Link className="button secondary" href="/course-list">
            ← All courses
          </Link>
        }
      >
        <div className="course-meta-block">
          <span>{indexPost.platform}</span>
          <span> · {indexPost.instructor}</span>
          {indexPost.url ? (
            <span>
              {" "}
              ·{" "}
              <a href={indexPost.url} rel="noopener noreferrer" target="_blank">
                Course link
              </a>
            </span>
          ) : null}
        </div>

        {indexPost.body ? (
          <div className="course-index-body">
            <MdxContent source={indexPost.body} />
          </div>
        ) : null}

        {notes.length === 0 ? (
          <p className="empty-state">尚无笔记。开始写第一篇 →</p>
        ) : (
          <ul className="entry-card-course-note-list">
            {notes.map((note) => (
              <li key={note.slug}>
                <Link
                  className="entry-card-course-note-item"
                  href={`/course-list/${course}/${note.slug}`}
                >
                  <h3 className="entry-card-course-note-title">{note.title}</h3>
                  <p className="entry-card-course-note-summary">{note.summary}</p>
                  <span className="entry-card-course-note-date">{note.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CollectionList>
    </div>
  );
}
