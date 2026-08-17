export const SITE_TONES = [
  "boutique",
  "rustic",
  "modern",
  "coastal",
  "family",
  "luxury",
] as const;

export const TYPOGRAPHY_PAIRINGS = [
  "classic-serif",
  "clean-modern",
  "editorial",
] as const;

export const SURFACE_TOKENS = [
  "bright-white",
  "warm-cream",
  "cool-slate",
] as const;

export const CARD_STYLES = ["elevated", "flat", "bordered"] as const;

export const BUTTON_SHAPES = ["rounded", "pill"] as const;

export const OVERLAY_LEVELS = ["light", "medium", "strong"] as const;

export const SECTION_DENSITIES = ["airy", "balanced", "compact"] as const;

export const LINK_EMPHASIS_OPTIONS = ["accent", "underline", "subtle"] as const;

export const HERO_LAYOUT_IDS = [
  "full-bleed-bottom",
  "centered-overlay",
  "split-left",
] as const;

export const NAV_LAYOUT_IDS = [
  "horizontal-sticky",
  "centered-brand",
  "compact-split",
] as const;

/** Curated accent palette — LLM may only pick from these when accentColorSource is `ai` */
export const SITE_ACCENT_PALETTE = [
  "#2563eb",
  "#0f766e",
  "#b45309",
  "#7c3aed",
  "#be123c",
  "#0369a1",
  "#15803d",
  "#c2410c",
  "#4f46e5",
  "#0d9488",
  "#a16207",
  "#1d4ed8",
] as const;

export const DEFAULT_HERO_LAYOUT = HERO_LAYOUT_IDS[0];
export const DEFAULT_NAV_LAYOUT = NAV_LAYOUT_IDS[0];
