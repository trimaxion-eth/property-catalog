import { SitePageMetadata } from "@/components/site/SitePageMetadata";
import { SiteGalleryView } from "@/components/site/SiteGalleryView";

export default function PreviewGalleryPage() {
  return (
    <>
      <SitePageMetadata page="gallery" />
      <SiteGalleryView />
    </>
  );
}
