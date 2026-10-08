import { permanentRedirect } from "next/navigation";

type BookNoteRedirectProps = {
  params: Promise<{ book: string; slug: string }>;
};

/** /book-list/<book>/<slug> → /notes/<book>/<slug>（308 见 DEC-059）。 */
export default async function BookNoteRedirect({ params }: BookNoteRedirectProps) {
  const { book, slug } = await params;
  permanentRedirect(`/notes/${book}/${slug}`);
}
