"use client";

import { useEffect } from "react";
import { useSiteContent } from "@/hooks/site-content-context";
import {
  applyDocumentMetadata,
  resetDocumentMetadata,
} from "@/lib/site/document-meta";
import {
  getSitePageMetadata,
  type SitePreviewPage,
} from "@/lib/site/page-meta";

type SitePageMetadataProps = {
  page: SitePreviewPage;
};

export function SitePageMetadata({ page }: SitePageMetadataProps) {
  const siteContent = useSiteContent();
  const { documentTitle, description } = getSitePageMetadata(siteContent, page);

  useEffect(() => {
    applyDocumentMetadata({
      title: documentTitle,
      description,
      noIndex: true,
    });

    return () => {
      resetDocumentMetadata();
    };
  }, [documentTitle, description]);

  return null;
}
