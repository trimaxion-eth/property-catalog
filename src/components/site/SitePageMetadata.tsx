"use client";

import { useSiteContent } from "@/hooks/site-content-context";
import {
  getSitePageMetadata,
  type SitePreviewPage,
} from "@/lib/site/page-meta";

type SitePageMetadataProps = {
  page: SitePreviewPage;
};

/**
 * Applies site-specific document metadata (`title`, description, Open Graph,
 * robots) for a preview page.
 *
 * The tags are rendered as React elements rather than imperatively mutated via
 * `document.title`/`document.head`: React 19 hoists `<title>`/`<meta>` elements
 * into the document `<head>`, so the site title survives hydration (which
 * re-asserts the server-rendered head) and the elements are added/updated/
 * removed by React itself across client-side page transitions — no stale
 * metadata, no duplicate description tag.
 */
export function SitePageMetadata({ page }: SitePageMetadataProps) {
  const siteContent = useSiteContent();
  const { documentTitle, description } = getSitePageMetadata(siteContent, page);

  return (
    <>
      <title>{documentTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={documentTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="robots" content="noindex, nofollow" />
    </>
  );
}
