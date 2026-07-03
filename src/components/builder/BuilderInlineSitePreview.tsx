"use client";

import type { CSSProperties } from "react";
import type { SiteContent } from "@/lib/types/site-content";
import { SiteContentProvider } from "@/hooks/site-content-context";
import { SiteHomeView } from "@/components/site/SiteHomeView";
import { SiteHeader } from "@/components/site/SiteHeader";

type BuilderInlineSitePreviewProps = {
  siteContent: SiteContent;
};

export function BuilderInlineSitePreview({
  siteContent,
}: BuilderInlineSitePreviewProps) {
  return (
    <SiteContentProvider siteContent={siteContent}>
      <div
        className="site-template site-template--inline-preview w-full min-w-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm"
        style={
          { "--site-accent": siteContent.branding.accentColor } as CSSProperties
        }
      >
        <SiteHeader siteContent={siteContent} />
        <div className="max-h-[min(70vh,720px)] overflow-x-hidden overflow-y-auto">
          <SiteHomeView />
        </div>
      </div>
    </SiteContentProvider>
  );
}
