import type { CSSProperties } from "react";
import {
  DEFAULT_HERO_LAYOUT,
  DEFAULT_NAV_LAYOUT,
} from "@/lib/constants/site-style";
import type { SiteContent } from "@/lib/types/site-content";
import type { SiteStyle } from "@/lib/types/site-style";

const SURFACE_VALUES = {
  "bright-white": { surface: "#ffffff", muted: "#f8fafc", border: "#e2e8f0" },
  "warm-cream": { surface: "#fffbf5", muted: "#f5f0e8", border: "#e8dfd0" },
  "cool-slate": { surface: "#ffffff", muted: "#f1f5f9", border: "#e2e8f0" },
} as const;

const OVERLAY_OPACITY = {
  light: 0.35,
  medium: 0.45,
  strong: 0.55,
} as const;

const SECTION_PADDING = {
  airy: "5rem",
  balanced: "4rem",
  compact: "3rem",
} as const;

const BUTTON_RADIUS = {
  rounded: "0.5rem",
  pill: "9999px",
} as const;

const CARD_RADIUS = "0.75rem";

const TYPOGRAPHY_DISPLAY = {
  "classic-serif": "var(--font-playfair), ui-serif, Georgia, serif",
  "clean-modern": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  editorial:
    "var(--font-playfair), ui-serif, Georgia, serif",
} as const;

export function createDefaultSiteStyle(accentColor: string): SiteStyle {
  return {
    tone: "boutique",
    typography: "classic-serif",
    surface: "bright-white",
    layouts: {
      hero: DEFAULT_HERO_LAYOUT,
      nav: DEFAULT_NAV_LAYOUT,
    },
    components: {
      cardStyle: "elevated",
      buttonShape: "rounded",
      heroOverlay: "medium",
      sectionDensity: "balanced",
      linkEmphasis: "accent",
    },
    rationale: `Polished boutique styling with your brand color ${accentColor}.`,
  };
}

export function resolveSiteStyle(siteContent: SiteContent): SiteStyle {
  return siteContent.style ?? createDefaultSiteStyle(siteContent.branding.accentColor);
}

export function siteStyleToCssProperties(
  siteContent: SiteContent,
): CSSProperties {
  const style = resolveSiteStyle(siteContent);
  const surfaces = SURFACE_VALUES[style.surface];
  const { components } = style;

  return {
    "--site-accent": siteContent.branding.accentColor,
    "--site-surface": surfaces.surface,
    "--site-surface-muted": surfaces.muted,
    "--site-border": surfaces.border,
    "--site-hero-overlay": String(OVERLAY_OPACITY[components.heroOverlay]),
    "--site-section-padding-y": SECTION_PADDING[components.sectionDensity],
    "--site-radius-card": CARD_RADIUS,
    "--site-radius-button": BUTTON_RADIUS[components.buttonShape],
    "--site-font-display": TYPOGRAPHY_DISPLAY[style.typography],
    "--site-card-shadow":
      components.cardStyle === "elevated"
        ? "0 1px 3px 0 rgb(0 0 0 / 0.08)"
        : "none",
    "--site-card-border-width":
      components.cardStyle === "flat" ? "0" : "1px",
  } as CSSProperties;
}

export function siteStyleLinkClass(siteContent: SiteContent): string {
  const emphasis = resolveSiteStyle(siteContent).components.linkEmphasis;
  if (emphasis === "underline") return "site-link site-link--underline";
  if (emphasis === "subtle") return "site-link site-link--subtle";
  return "site-link site-link--accent";
}

export function siteCardClass(): string {
  return "site-card";
}
