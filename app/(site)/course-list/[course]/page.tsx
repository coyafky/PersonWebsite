import { permanentRedirect } from "next/navigation";

type CourseRedirectProps = {
  params: Promise<{ course: string }>;
};

/** /course-list/<course> → /notes/<course>（集合 id 不变，直接透传；308 见 DEC-059）。 */
export default async function CourseTopicRedirect({ params }: CourseRedirectProps) {
  const { course } = await params;
  permanentRedirect(`/notes/${course}`);
}
