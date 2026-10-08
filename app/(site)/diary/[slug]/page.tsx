import { permanentRedirect } from "next/navigation";

type DiarySlugRedirectProps = {
  params: Promise<{ slug: string }>;
};

/** /diary/<slug> → /blog（308 见 DEC-059）。内容已归档，只留旧链接不 404。 */
export default async function DiarySlugRedirect({ params }: DiarySlugRedirectProps) {
  await params;
  permanentRedirect("/blog");
}
