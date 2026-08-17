import { SITE_ACCENT_PALETTE } from "@/lib/constants/site-style";
import { buildPropertyContext } from "@/lib/prompts/build-context";
import {
  formatStyleSignalsForPrompt,
  type StyleSignals,
} from "@/lib/site/build-style-signals";
import type { QuestionnaireAnswers } from "@/lib/types/questionnaire";

const PALETTE_LIST = SITE_ACCENT_PALETTE.join(", ");

export function buildStylePrompt(
  answers: QuestionnaireAnswers,
  signals: StyleSignals,
): string {
  const preferenceGuidance =
    signals.stylePreference === "refined"
      ? "Bias toward refined typography, lighter hero overlay, airy section density, and elegant card styling."
      : signals.stylePreference === "bold"
        ? "Bias toward bold photography (full-bleed or centered hero), stronger overlay, elevated cards, and immersive layouts."
        : "Choose a cohesive style that best matches the property context.";

  const accentGuidance =
    signals.accentColorSource === "ai"
      ? `Include accentColor — pick exactly one hex from: ${PALETTE_LIST}`
      : "Do not include accentColor — the owner already chose their brand color.";

  return `Choose a cohesive visual style for this accommodation website.

${preferenceGuidance}

Style signals (use as guidance):
${formatStyleSignalsForPrompt(answers, signals)}

Full property context:
${buildPropertyContext(answers)}

Return JSON only with these keys:
- tone: one of boutique, rustic, modern, coastal, family, luxury
- typography: one of classic-serif, clean-modern, editorial
- surface: one of bright-white, warm-cream, cool-slate
${signals.accentColorSource === "ai" ? "- accentColor: hex from allowed palette" : ""}
- heroLayout: one of full-bleed-bottom, centered-overlay, split-left
- navLayout: one of horizontal-sticky, centered-brand, compact-split
- cardStyle: one of elevated, flat, bordered
- buttonShape: one of rounded, pill
- heroOverlay: one of light, medium, strong
- sectionDensity: one of airy, balanced, compact
- linkEmphasis: one of accent, underline, subtle
- rationale: one friendly sentence explaining the style for the property owner

${accentGuidance}`;
}
