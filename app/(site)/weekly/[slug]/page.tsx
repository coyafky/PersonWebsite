import { permanentRedirect } from "next/navigation";

type WeeklySlugRedirectProps = {
  params: Promise<{ slug: string }>;
};

/** /weekly/<slug> → /blog（308 见 DEC-059）。内容已归档，只留旧链接不 404。 */
export default async function WeeklySlugRedirect({ params }: WeeklySlugRedirectProps) {
  await params;
  permanentRedirect("/blog");
}
