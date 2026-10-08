import { permanentRedirect } from "next/navigation";

type BookRedirectProps = {
  params: Promise<{ book: string }>;
};

/** /book-list/<book> → /notes/<book>（集合 id 不变，直接透传；308 见 DEC-059）。 */
export default async function BookTopicRedirect({ params }: BookRedirectProps) {
  const { book } = await params;
  permanentRedirect(`/notes/${book}`);
}
