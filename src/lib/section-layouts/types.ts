import type { ReactNode } from "react";
import type { SiteContent } from "@/lib/types/site-content";
import type { RotatableSectionId } from "@/lib/validation/layout-preferences";

export type SectionLayoutRenderProps = {
  siteContent: SiteContent;
};

export type SoftLayoutDefinition = {
  id: string;
  name: string;
  semantics: readonly string[];
  /** Schematic thumbnail for the layout strip */
  thumbnailClassName: string;
};

export type SectionLayoutRegistryEntry = {
  sectionId: RotatableSectionId;
  sectionLabel: string;
  defaultLayoutId: string;
  layouts: SoftLayoutDefinition[];
  render: (layoutId: string, props: SectionLayoutRenderProps) => ReactNode;
};
