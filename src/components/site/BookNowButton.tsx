"use client";

import type { SiteContent } from "@/lib/types/site-content";
import { resolveBookingHref } from "@/lib/booking/resolve-booking-href";

type BookNowButtonProps = {
  siteContent: SiteContent;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export function BookNowButton({
  siteContent,
  className = "",
  size = "md",
}: BookNowButtonProps) {
  const href = resolveBookingHref(
    siteContent.booking.channelType,
    siteContent.booking.channelTarget,
  );
  const opensNewTab =
    siteContent.booking.channelType === "url" ||
    siteContent.booking.channelType === "whatsapp";

  return (
    <a
      href={href}
      className={`site-cta inline-flex items-center justify-center font-medium text-(color:--site-accent-foreground) transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: "var(--site-accent)" }}
      aria-label={`${siteContent.booking.ctaLabel} — ${siteContent.branding.propertyName}`}
      {...(opensNewTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {siteContent.booking.ctaLabel}
    </a>
  );
}
