import { permanentRedirect } from "next/navigation";

type ArticleRedirectProps = {
  params: Promise<{ topic: string; slug: string }>;
};

/** /learning/<topic>/<slug> → /notes/<topic>/<slug>（308 见 DEC-059）。 */
export default async function LearningArticleRedirect({
  params,
}: ArticleRedirectProps) {
  const { topic, slug } = await params;
  permanentRedirect(`/notes/${topic}/${slug}`);
}
