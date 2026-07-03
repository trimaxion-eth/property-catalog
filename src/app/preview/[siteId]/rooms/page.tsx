import { SitePageMetadata } from "@/components/site/SitePageMetadata";
import { SiteRoomsView } from "@/components/site/SiteRoomsView";

export default function PreviewRoomsPage() {
  return (
    <>
      <SitePageMetadata page="rooms" />
      <SiteRoomsView />
    </>
  );
}
