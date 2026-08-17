import type { Metadata } from "next";
import { PreviewSiteProvider } from "@/components/preview/PreviewSiteProvider";

// Site-specific `<title>`/`<meta name="description">` come from the generated
// `SiteContent`, which is only available client-side (sessionStorage) and is
// applied by `SitePageMetadata` as React `<head>` elements. Opt out of the root
// layout's static default title/description here so Next.js never emits them
// for preview pages — otherwise the layout defaults would re-appear alongside
// the React-managed tags and the tab title/meta description would be wrong.
export const metadata: Metadata = {
  title: null,
  description: null,
};

type PreviewLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ siteId: string }>;
};

export default async function PreviewLayout({ children, params }: PreviewLayoutProps) {
  const { siteId } = await params;
  return <PreviewSiteProvider siteId={siteId}>{children}</PreviewSiteProvider>;
}
