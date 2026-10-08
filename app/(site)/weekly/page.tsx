import { permanentRedirect } from "next/navigation";

/** /weekly → /blog（308 见 DEC-059：永久退场用 308，把权重传下去）。 */
export default function WeeklyRedirect() {
  permanentRedirect("/blog");
}
