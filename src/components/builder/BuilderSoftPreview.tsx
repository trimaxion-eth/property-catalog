"use client";

import type { SiteContent } from "@/lib/types/site-content";
import { siteStyleToCssProperties } from "@/lib/site/apply-site-style";
import { SiteContentProvider } from "@/hooks/site-content-context";
import { SiteHomeView } from "@/components/site/SiteHomeView";
import { SiteNavSection } from "@/components/site/SiteNavSection";

type BuilderSoftPreviewProps = {
  siteContent: SiteContent;
};

export function BuilderSoftPreview({ siteContent }: BuilderSoftPreviewProps) {
  return (
    <SiteContentProvider siteContent={siteContent}>
      <div
        className="site-template site-template--inline-preview w-full min-w-0 overflow-hidden rounded-xl border border-border shadow-sm"
        style={siteStyleToCssProperties(siteContent)}
      >
        <SiteNavSection siteContent={siteContent} />
        <div className="max-h-[min(80vh,900px)] overflow-x-hidden overflow-y-auto">
          <SiteHomeView />
        </div>
      </div>
    </SiteContentProvider>
  );
}
