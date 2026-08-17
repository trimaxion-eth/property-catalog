"use client";

import Link from "next/link";
import { SiteContentProvider } from "@/hooks/site-content-context";
import { SoftPreviewProvider } from "@/hooks/useSoftPreview";
import { usePreviewSiteContent } from "@/hooks/usePreviewSiteContent";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LayoutControlsToggle } from "@/components/preview/rotatable/LayoutControlsToggle";

type PreviewSiteProviderProps = {
  siteId: string;
  children: React.ReactNode;
};

export function PreviewSiteProvider({ siteId, children }: PreviewSiteProviderProps) {
  const { siteContent, isLoading, error } = usePreviewSiteContent(siteId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted text-sm text-text-muted">
        Loading preview…
      </div>
    );
  }

  if (error || !siteContent) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold text-text">Preview unavailable</h1>
        <p className="mt-3 text-text-muted">{error ?? "Preview not found."}</p>
        <Link
          href="/builder"
          className="mt-6 inline-block text-brand-600 hover:text-brand-700"
        >
          Back to builder
        </Link>
      </div>
    );
  }

  return (
    <SiteContentProvider siteContent={siteContent}>
      <SoftPreviewProvider siteId={siteContent.id}>
        <div className="fixed right-4 top-4 z-50">
          <LayoutControlsToggle className="shadow-sm" />
        </div>
        <SiteLayout siteContent={siteContent}>{children}</SiteLayout>
      </SoftPreviewProvider>
    </SiteContentProvider>
  );
}
