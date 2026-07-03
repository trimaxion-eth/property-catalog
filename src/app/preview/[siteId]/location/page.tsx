import { SitePageMetadata } from "@/components/site/SitePageMetadata";
import { SiteLocationView } from "@/components/site/SiteLocationView";

export default function PreviewLocationPage() {
  return (
    <>
      <SitePageMetadata page="location" />
      <SiteLocationView />
    </>
  );
}
