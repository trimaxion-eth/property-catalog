import { saveLayoutPreferences } from "@/lib/preview/layout-preferences-storage";
import type { SiteStyle } from "@/lib/types/site-style";
import {
  LAYOUT_PREFERENCES_SCHEMA_VERSION,
  type LayoutPreferencesPayload,
} from "@/lib/validation/layout-preferences";

export function seedLayoutPreferencesFromStyle(
  siteId: string,
  style: SiteStyle,
  existing?: LayoutPreferencesPayload | null,
): LayoutPreferencesPayload {
  const heroLayout = existing?.preferences.hero?.layout ?? style.layouts.hero;
  const navLayout = existing?.preferences.nav?.layout ?? style.layouts.nav;

  const interactions = [
    {
      section: "hero" as const,
      viewed: [heroLayout],
      selected: heroLayout,
      dwellMs: existing?.interactions.find((item) => item.section === "hero")
        ?.dwellMs ?? 0,
    },
    {
      section: "nav" as const,
      viewed: [navLayout],
      selected: navLayout,
      dwellMs: existing?.interactions.find((item) => item.section === "nav")
        ?.dwellMs ?? 0,
    },
  ];

  const payload: LayoutPreferencesPayload = {
    version: LAYOUT_PREFERENCES_SCHEMA_VERSION,
    preferences: {
      ...(existing?.preferences ?? {}),
      hero: { layout: heroLayout, rank: 1 },
      nav: { layout: navLayout, rank: 2 },
    },
    interactions: [
      ...(existing?.interactions.filter(
        (item) => item.section !== "hero" && item.section !== "nav",
      ) ?? []),
      ...interactions,
    ],
    updatedAt: new Date().toISOString(),
  };

  saveLayoutPreferences(siteId, payload);
  return payload;
}
