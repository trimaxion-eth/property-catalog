import type { CSSProperties } from "react";
import type { SiteContent } from "@/lib/types/site-content";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

type SiteLayoutProps = {
  siteContent: SiteContent;
  children: React.ReactNode;
};

export function SiteLayout({ siteContent, children }: SiteLayoutProps) {
  return (
    <div
      className="site-template flex min-h-screen flex-col bg-white text-text"
      style={
        { "--site-accent": siteContent.branding.accentColor } as CSSProperties
      }
    >
      <a
        href="#site-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-button focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-text focus:shadow-md"
      >
        Skip to main content
      </a>
      <SiteHeader siteContent={siteContent} />
      <main id="site-main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter siteContent={siteContent} />
    </div>
  );
}
