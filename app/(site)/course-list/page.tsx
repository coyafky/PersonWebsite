import { permanentRedirect } from "next/navigation";

/**
 * 内容模块已合并到 /notes（DEC-059：永久退场用 308，把权重传下去）。
 * 这个桩只是为了让旧链接不 404。
 */
export default function CourseListRedirect() {
  permanentRedirect("/notes");
}
