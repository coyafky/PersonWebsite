import { CollectionList } from "@/components/collection-list";
import { GalleryCard } from "@/components/gallery-card";
import { GalleryCarouselCard } from "@/components/gallery-carousel-card";
import { getGalleryPosts } from "@/lib/content";

export const metadata = {
  title: "Gallery",
  description: "AI 生图作品集 — 每张图附完整提示词",
};

export default async function GalleryPage() {
  const posts = await getGalleryPosts();

  return (
    <div className="page-shell">
      <CollectionList
        title="Gallery"
        description="AI 生图作品集 — 每张图附完整提示词"
        emptyLabel="No gallery items yet."
      >
        <div className="entry-card-gallery-grid">
          {posts.map((post) => (
            post.carouselImages?.length ? (
              <GalleryCarouselCard key={post.slug} post={post} />
            ) : (
              <GalleryCard key={post.slug} post={post} />
            )
          ))}
        </div>
      </CollectionList>
    </div>
  );
}
