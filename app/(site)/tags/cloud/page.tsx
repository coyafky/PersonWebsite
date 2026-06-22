import Link from "next/link";
import { CollectionList } from "@/components/collection-list";
import { getAllTags } from "@/lib/content";

export const metadata = {
  title: "Tags Cloud · Personal Website",
  description: "All tags as a frequency-weighted cloud.",
};

type Bucket = "xs" | "sm" | "md" | "lg";

function bucketOf(count: number): Bucket {
  if (count >= 8) return "lg";
  if (count >= 4) return "md";
  if (count >= 2) return "sm";
  return "xs";
}

export default async function TagsCloudPage() {
  const tags = await getAllTags();

  return (
    <div className="page-shell">
      <CollectionList
        title="Tags Cloud"
        description={`${tags.length} ${tags.length === 1 ? "tag" : "tags"} — size reflects frequency across all collections.`}
      >
        <div className="tag-cloud">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className={`tag-cloud-item tag-cloud-item--${bucketOf(count)}`}
            >
              <span className="tag-cloud-name">{tag}</span>
              <span className="tag-cloud-count">{count}</span>
            </Link>
          ))}
        </div>
      </CollectionList>
    </div>
  );
}
