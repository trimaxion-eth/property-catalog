import type { SiteContent } from "@/lib/types/site-content";

const TRUST_SIGNALS = [
  "Mobile Responsive",
  "SEO Optimized",
  "Fast Loading",
  "Secure & SSL",
  "Ready for Guests",
] as const;

type SiteFooterProps = {
  siteContent: SiteContent;
};

export function SiteFooter({ siteContent }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4 py-4 text-xs text-text-muted @sm:gap-6 @sm:px-6">
        {TRUST_SIGNALS.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>
      <div className="border-t border-border px-4 py-6 text-center text-sm text-text-muted @sm:px-6">
        © {year} {siteContent.branding.propertyName}. All rights reserved.
      </div>
    </footer>
  );
}
