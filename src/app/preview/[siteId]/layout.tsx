import { PreviewSiteProvider } from "@/components/preview/PreviewSiteProvider";

type PreviewLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ siteId: string }>;
};

export default async function PreviewLayout({ children, params }: PreviewLayoutProps) {
  const { siteId } = await params;
  return <PreviewSiteProvider siteId={siteId}>{children}</PreviewSiteProvider>;
}
