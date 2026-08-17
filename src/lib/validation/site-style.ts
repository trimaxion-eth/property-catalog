import { z } from "zod";
import {
  BUTTON_SHAPES,
  CARD_STYLES,
  HERO_LAYOUT_IDS,
  LINK_EMPHASIS_OPTIONS,
  NAV_LAYOUT_IDS,
  OVERLAY_LEVELS,
  SECTION_DENSITIES,
  SITE_ACCENT_PALETTE,
  SURFACE_TOKENS,
  SITE_TONES,
  TYPOGRAPHY_PAIRINGS,
} from "@/lib/constants/site-style";

const hexColorSchema = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);

export const siteToneSchema = z.enum(SITE_TONES);
export const typographyPairingSchema = z.enum(TYPOGRAPHY_PAIRINGS);
export const surfaceTokenSchema = z.enum(SURFACE_TOKENS);
export const cardStyleSchema = z.enum(CARD_STYLES);
export const buttonShapeSchema = z.enum(BUTTON_SHAPES);
export const overlayLevelSchema = z.enum(OVERLAY_LEVELS);
export const sectionDensitySchema = z.enum(SECTION_DENSITIES);
export const linkEmphasisSchema = z.enum(LINK_EMPHASIS_OPTIONS);
export const heroLayoutIdSchema = z.enum(HERO_LAYOUT_IDS);
export const navLayoutIdSchema = z.enum(NAV_LAYOUT_IDS);
export const stylePreferenceSchema = z.enum(["auto", "refined", "bold"]);
export const accentColorSourceSchema = z.enum(["owner", "ai"]);

export const siteStyleComponentsSchema = z.object({
  cardStyle: cardStyleSchema,
  buttonShape: buttonShapeSchema,
  heroOverlay: overlayLevelSchema,
  sectionDensity: sectionDensitySchema,
  linkEmphasis: linkEmphasisSchema,
});

export const siteStyleLayoutsSchema = z.object({
  hero: heroLayoutIdSchema,
  nav: navLayoutIdSchema,
});

export const siteStyleSchema = z.object({
  tone: siteToneSchema,
  typography: typographyPairingSchema,
  surface: surfaceTokenSchema,
  layouts: siteStyleLayoutsSchema,
  components: siteStyleComponentsSchema,
  rationale: z.string().trim().min(1).optional(),
});

/** LLM output — accent optional (only used when owner requests AI color) */
export const llmSiteStyleOutputSchema = z.object({
  tone: siteToneSchema,
  typography: typographyPairingSchema,
  surface: surfaceTokenSchema,
  accentColor: z.enum(SITE_ACCENT_PALETTE).optional(),
  heroLayout: heroLayoutIdSchema,
  navLayout: navLayoutIdSchema,
  cardStyle: cardStyleSchema,
  buttonShape: buttonShapeSchema,
  heroOverlay: overlayLevelSchema,
  sectionDensity: sectionDensitySchema,
  linkEmphasis: linkEmphasisSchema,
  rationale: z.string().trim().min(1),
});

export const paletteAccentSchema = z.enum(SITE_ACCENT_PALETTE);

export type SiteTone = z.infer<typeof siteToneSchema>;
export type TypographyPairing = z.infer<typeof typographyPairingSchema>;
export type SurfaceToken = z.infer<typeof surfaceTokenSchema>;
export type CardStyle = z.infer<typeof cardStyleSchema>;
export type ButtonShape = z.infer<typeof buttonShapeSchema>;
export type OverlayLevel = z.infer<typeof overlayLevelSchema>;
export type SectionDensity = z.infer<typeof sectionDensitySchema>;
export type LinkEmphasis = z.infer<typeof linkEmphasisSchema>;
export type HeroLayoutId = z.infer<typeof heroLayoutIdSchema>;
export type NavLayoutId = z.infer<typeof navLayoutIdSchema>;
export type StylePreference = z.infer<typeof stylePreferenceSchema>;
export type AccentColorSource = z.infer<typeof accentColorSourceSchema>;
export type SiteStyle = z.infer<typeof siteStyleSchema>;
export type LlmSiteStyleOutput = z.infer<typeof llmSiteStyleOutputSchema>;

export function isPaletteAccent(value: string): value is (typeof SITE_ACCENT_PALETTE)[number] {
  return (SITE_ACCENT_PALETTE as readonly string[]).includes(value);
}

export function resolveAccentColor(
  ownerAccent: string,
  accentColorSource: AccentColorSource,
  llmAccent?: string,
): string {
  if (accentColorSource === "ai" && llmAccent && isPaletteAccent(llmAccent)) {
    return llmAccent;
  }
  const parsed = hexColorSchema.safeParse(ownerAccent);
  return parsed.success ? parsed.data : SITE_ACCENT_PALETTE[0];
}

export function llmOutputToSiteStyle(output: LlmSiteStyleOutput): SiteStyle {
  return {
    tone: output.tone,
    typography: output.typography,
    surface: output.surface,
    layouts: {
      hero: output.heroLayout,
      nav: output.navLayout,
    },
    components: {
      cardStyle: output.cardStyle,
      buttonShape: output.buttonShape,
      heroOverlay: output.heroOverlay,
      sectionDensity: output.sectionDensity,
      linkEmphasis: output.linkEmphasis,
    },
    rationale: output.rationale,
  };
}
