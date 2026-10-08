import { permanentRedirect } from "next/navigation";

type CourseNoteRedirectProps = {
  params: Promise<{ course: string; slug: string }>;
};

/** /course-list/<course>/<slug> → /notes/<course>/<slug>（308 见 DEC-059）。 */
export default async function CourseNoteRedirect({ params }: CourseNoteRedirectProps) {
  const { course, slug } = await params;
  permanentRedirect(`/notes/${course}/${slug}`);
}
