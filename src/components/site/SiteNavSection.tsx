"use client";

import { useSoftPreviewOptional } from "@/hooks/useSoftPreview";
import { RotatableSection } from "@/components/preview/rotatable/RotatableSection";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { SiteContent } from "@/lib/types/site-content";

type SiteNavSectionProps = {
  siteContent: SiteContent;
};

export function SiteNavSection({ siteContent }: SiteNavSectionProps) {
  const softPreview = useSoftPreviewOptional();

  if (!softPreview) {
    return <SiteHeader siteContent={siteContent} />;
  }

  return (
    <RotatableSection sectionId="nav" renderProps={{ siteContent }} />
  );
}
