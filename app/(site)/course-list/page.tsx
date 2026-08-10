import { CollectionList } from "@/components/collection-list";
import { EntryCardCourseTopic } from "@/components/entry-card-course-topic";
import { getCourseTopics } from "@/lib/content";

export const metadata = {
  title: "Course List",
  description: "Video course notes organized by module and lesson.",
};

export default async function CourseListPage() {
  const courses = await getCourseTopics();

  return (
    <div className="page-shell">
      <CollectionList
        title="Course List"
        description="Video course notes organized by module and lesson."
      >
        {courses.length === 0 ? (
          <p className="empty-state">尚无课程。开始记录第一门 →</p>
        ) : (
          <div className="course-topic-grid">
            {courses.map((course) => (
              <EntryCardCourseTopic
                key={course.course}
                href={`/course-list/${course.course}`}
                title={course.title}
                platform={course.platform}
                instructor={course.instructor}
                summary={course.summary}
                noteCount={course.noteCount}
              />
            ))}
          </div>
        )}
      </CollectionList>
    </div>
  );
}
