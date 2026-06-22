import Link from "next/link";
import { CollectionList } from "@/components/collection-list";
import { getAllTags } from "@/lib/content";
import type { TagCount } from "@/lib/content/reader";

export const metadata = {
  title: "Tags · Personal Website",
  description: "Browse all tags across the site.",
};

function formatKinds(kinds: TagCount["kinds"]) {
  return Object.entries(kinds)
    .filter(([, n]) => n > 0)
    .map(([k]) => k)
    .sort((a, b) => a.localeCompare(b))
    .join(" · ");
}

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <div className="page-shell">
      <CollectionList
        title="Tags"
        description={`${tags.length} ${tags.length === 1 ? "tag" : "tags"} across the site.`}
      >
        <div className="tags-index">
          {tags.map(({ tag, count, kinds }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="tags-index-item"
            >
              <span className="tags-index-name">{tag}</span>
              <span className="tags-index-count">{count}</span>
              <span className="tags-index-kinds">{formatKinds(kinds)}</span>
            </Link>
          ))}
        </div>
      </CollectionList>
    </div>
  );
}
