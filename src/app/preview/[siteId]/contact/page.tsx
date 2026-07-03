import { SitePageMetadata } from "@/components/site/SitePageMetadata";
import { SiteContactView } from "@/components/site/SiteContactView";

export default function PreviewContactPage() {
  return (
    <>
      <SitePageMetadata page="contact" />
      <SiteContactView />
    </>
  );
}
