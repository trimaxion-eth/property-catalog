"use client";

import { useSiteContent } from "@/hooks/site-content-context";
import { useSoftPreviewOptional } from "@/hooks/useSoftPreview";
import { getSectionLayoutEntry } from "@/lib/section-layouts/registry";
import { RotatableSection } from "@/components/preview/rotatable/RotatableSection";

export function SiteHeroSection() {
  const siteContent = useSiteContent();
  const softPreview = useSoftPreviewOptional();
  const entry = getSectionLayoutEntry("hero");

  if (!softPreview || !entry) {
    return <>{entry?.render(entry.defaultLayoutId, { siteContent })}</>;
  }

  return (
    <RotatableSection sectionId="hero" renderProps={{ siteContent }} />
  );
}
