import { SitePageMetadata } from "@/components/site/SitePageMetadata";
import { SiteHomeView } from "@/components/site/SiteHomeView";

export default function PreviewHomePage() {
  return (
    <>
      <SitePageMetadata page="home" />
      <SiteHomeView />
    </>
  );
}
