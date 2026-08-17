import type { SectionLayoutRegistryEntry } from "@/lib/section-layouts/types";
import {
  HeroCenteredOverlay,
  HeroFullBleedBottom,
  HeroSplitLeft,
  HeroThumbnailPreview,
} from "@/lib/section-layouts/hero/layouts";
import {
  NavCenteredBrand,
  NavCompactSplit,
  NavHorizontalSticky,
  NavThumbnailPreview,
} from "@/lib/section-layouts/nav/layouts";

const HERO_LAYOUTS = [
  {
    id: "full-bleed-bottom",
    name: "Full bleed",
    semantics: ["hero.full-bleed", "hero.bottom-aligned"],
    thumbnailClassName: "hero-thumb-bottom",
    component: HeroFullBleedBottom,
    thumbVariant: "bottom" as const,
  },
  {
    id: "centered-overlay",
    name: "Centered overlay",
    semantics: ["hero.centered", "hero.overlay"],
    thumbnailClassName: "hero-thumb-center",
    component: HeroCenteredOverlay,
    thumbVariant: "center" as const,
  },
  {
    id: "split-left",
    name: "Split left",
    semantics: ["hero.split", "hero.left-content"],
    thumbnailClassName: "hero-thumb-split",
    component: HeroSplitLeft,
    thumbVariant: "split" as const,
  },
] as const;

const NAV_LAYOUTS = [
  {
    id: "horizontal-sticky",
    name: "Horizontal sticky",
    semantics: ["nav.horizontal", "nav.sticky"],
    thumbnailClassName: "nav-thumb-sticky",
    component: NavHorizontalSticky,
    thumbVariant: "sticky" as const,
  },
  {
    id: "centered-brand",
    name: "Centered brand",
    semantics: ["nav.centered", "nav.stacked"],
    thumbnailClassName: "nav-thumb-centered",
    component: NavCenteredBrand,
    thumbVariant: "centered" as const,
  },
  {
    id: "compact-split",
    name: "Compact split",
    semantics: ["nav.compact", "nav.inline-cta"],
    thumbnailClassName: "nav-thumb-compact",
    component: NavCompactSplit,
    thumbVariant: "compact" as const,
  },
] as const;

export const heroSectionEntry: SectionLayoutRegistryEntry = {
  sectionId: "hero",
  sectionLabel: "Hero",
  defaultLayoutId: "full-bleed-bottom",
  layouts: HERO_LAYOUTS.map(
    ({ id, name, semantics, thumbnailClassName }) => ({
      id,
      name,
      semantics,
      thumbnailClassName,
    }),
  ),
  render(layoutId) {
    const match = HERO_LAYOUTS.find((layout) => layout.id === layoutId);
    const Layout = match?.component ?? HeroFullBleedBottom;
    return <Layout />;
  },
};

export const navSectionEntry: SectionLayoutRegistryEntry = {
  sectionId: "nav",
  sectionLabel: "Nav bar",
  defaultLayoutId: "horizontal-sticky",
  layouts: NAV_LAYOUTS.map(
    ({ id, name, semantics, thumbnailClassName }) => ({
      id,
      name,
      semantics,
      thumbnailClassName,
    }),
  ),
  render(layoutId, { siteContent }) {
    const match = NAV_LAYOUTS.find((layout) => layout.id === layoutId);
    const Layout = match?.component ?? NavHorizontalSticky;
    return <Layout siteContent={siteContent} />;
  },
};

/** Single registry — add section entries here as rollout phases expand */
export const SECTION_LAYOUT_REGISTRY: SectionLayoutRegistryEntry[] = [
  heroSectionEntry,
  navSectionEntry,
];

export function getSectionLayoutEntry(
  sectionId: string,
): SectionLayoutRegistryEntry | undefined {
  return SECTION_LAYOUT_REGISTRY.find((entry) => entry.sectionId === sectionId);
}

export function renderLayoutThumbnail(
  sectionId: string,
  layoutId: string,
): React.ReactNode {
  if (sectionId === "hero") {
    const match = HERO_LAYOUTS.find((layout) => layout.id === layoutId);
    return (
      <HeroThumbnailPreview variant={match?.thumbVariant ?? "bottom"} />
    );
  }

  if (sectionId === "nav") {
    const match = NAV_LAYOUTS.find((layout) => layout.id === layoutId);
    return <NavThumbnailPreview variant={match?.thumbVariant ?? "sticky"} />;
  }

  return null;
}
