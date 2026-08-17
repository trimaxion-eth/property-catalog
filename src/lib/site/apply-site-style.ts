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

/**
 * Contrast guard for the owner-chosen accent.
 * Straight `--site-accent` on light surfaces or white text on pale accents is
 * unreadable, so the accent is always paired with a computed foreground:
 * - `--site-accent-foreground`  — text placed ON the accent (CTA buttons)
 * - `--site-accent-readable`    — the accent kept readable as text on the
 *                                 light site surfaces (accent links)
 */
const ACCENT_FOREGROUND_LIGHT = "#ffffff";
const ACCENT_FOREGROUND_DARK = "#0f172a"; // slate-900, matches --color-text

const ACCENT_HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = ACCENT_HEX_RE.exec(hex.trim());
  if (!match) return null;
  if (match[1].length === 3) {
    return {
      r: parseInt(match[1][0] + match[1][0], 16),
      g: parseInt(match[1][1] + match[1][1], 16),
      b: parseInt(match[1][2] + match[1][2], 16),
    };
  }
  return {
    r: parseInt(match[1].slice(0, 2), 16),
    g: parseInt(match[1].slice(2, 4), 16),
    b: parseInt(match[1].slice(4, 6), 16),
  };
}

function toLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** WCAG relative luminance of an sRGB hex color, or null when unparsable. */
function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return (
    0.2126 * toLinear(rgb.r) +
    0.7152 * toLinear(rgb.g) +
    0.0722 * toLinear(rgb.b)
  );
}

function contrastRatio(luminanceA: number, luminanceB: number): number {
  const [lighter, darker] =
    luminanceA >= luminanceB ? [luminanceA, luminanceB] : [luminanceB, luminanceA];
  return (lighter + 0.05) / (darker + 0.05);
}

type AccentContrast = {
  foreground: string;
  readable: string;
};

function resolveAccentContrast(accentColor: string): AccentContrast {
  const accentLuminance = relativeLuminance(accentColor);
  const darkLuminance = relativeLuminance(ACCENT_FOREGROUND_DARK) ?? 0;
  if (accentLuminance === null) {
    // Hex is validated at every boundary; keep today's behavior as a fallback.
    return { foreground: ACCENT_FOREGROUND_LIGHT, readable: accentColor };
  }
  // Compare white text vs dark slate-900 text on the accent background and
  // keep whichever pair yields the higher WCAG contrast ratio.
  const withWhite = contrastRatio(1, accentLuminance);
  const withDark = contrastRatio(accentLuminance, darkLuminance);
  const useDark = withDark > withWhite;
  return {
    foreground: useDark ? ACCENT_FOREGROUND_DARK : ACCENT_FOREGROUND_LIGHT,
    readable: useDark ? ACCENT_FOREGROUND_DARK : accentColor,
  };
}

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
  const accentColor = siteContent.branding.accentColor;
  const accentContrast = resolveAccentContrast(accentColor);

  return {
    "--site-accent": accentColor,
    "--site-accent-foreground": accentContrast.foreground,
    "--site-accent-readable": accentContrast.readable,
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
