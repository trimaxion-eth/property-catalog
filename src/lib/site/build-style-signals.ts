import { PROPERTY_TYPE_LABELS } from "@/lib/constants";
import type { PropertyType } from "@/lib/types/enums";
import type { QuestionnaireAnswers } from "@/lib/types/questionnaire";
import type { SiteTone, StylePreference } from "@/lib/types/site-style";

export type StyleSignals = {
  suggestedTone: SiteTone;
  settingHint: string;
  priceTier: "budget" | "mid" | "premium" | "unknown";
  scale: "intimate" | "small" | "medium";
  amenityPersonality: string[];
  stylePreference: StylePreference;
  accentColorSource: "owner" | "ai";
  ownerAccentColor: string;
};

const COASTAL_KEYWORDS =
  /\b(beach|bay|coast|sea|ocean|harbor|harbour|marina|island|mediterranean|positano|amalfi)\b/i;
const ALPINE_KEYWORDS =
  /\b(mountain|alpine|ski|hike|trail|forest|lodge|cabin|chalet|woods)\b/i;
const URBAN_KEYWORDS =
  /\b(city|downtown|urban|metro|district|central)\b/i;

const LUXURY_AMENITIES =
  /\b(spa|wellness|concierge|pool|room service|fine dining|valet)\b/i;
const RUSTIC_AMENITIES =
  /\b(fireplace|garden|terrace|hiking|farm|rustic|wood)\b/i;
const FAMILY_AMENITIES =
  /\b(family|kids|playground|crib|children)\b/i;

const ROMANTIC_KEYWORDS =
  /\b(romantic|escape|retreat|intimate|honeymoon|couples)\b/i;
const LUXURY_KEYWORDS =
  /\b(luxury|luxurious|premium|exclusive|bespoke|elegant|five.?star)\b/i;
const RELAXED_KEYWORDS =
  /\b(relaxed|calm|peaceful|serene|tranquil|slow|unwind)\b/i;

const TONE_BY_PROPERTY_TYPE: Record<PropertyType, SiteTone> = {
  boutique_hotel: "boutique",
  hotel: "modern",
  bnb: "family",
  vacation_rental: "family",
  cabin: "rustic",
  villa: "luxury",
  apartment: "modern",
};

function inferSettingHint(answers: QuestionnaireAnswers): string {
  const blob = [
    answers.location.city,
    answers.location.region,
    answers.location.country,
    ...answers.location.nearbyHighlights,
  ]
    .join(" ")
    .toLowerCase();

  if (COASTAL_KEYWORDS.test(blob)) return "coastal-waterfront";
  if (ALPINE_KEYWORDS.test(blob)) return "mountain-rural";
  if (URBAN_KEYWORDS.test(blob)) return "urban";
  return "general-destination";
}

function inferPriceTier(
  answers: QuestionnaireAnswers,
): StyleSignals["priceTier"] {
  const prices = answers.rooms.rooms
    .map((room) => room.basePrice)
    .filter((price): price is number => price != null);

  if (prices.length === 0) return "unknown";

  const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  if (avg >= 250) return "premium";
  if (avg >= 120) return "mid";
  return "budget";
}

function inferScale(answers: QuestionnaireAnswers): StyleSignals["scale"] {
  const count = answers.rooms.rooms.length;
  if (count <= 1) return "intimate";
  if (count <= 3) return "small";
  return "medium";
}

function inferAmenityPersonality(answers: QuestionnaireAnswers): string[] {
  const blob = [
    ...answers.amenities.selectedAmenities,
    answers.amenities.customAmenities ?? "",
  ].join(" ");

  const tags: string[] = [];
  if (LUXURY_AMENITIES.test(blob)) tags.push("luxury-leisure");
  if (RUSTIC_AMENITIES.test(blob)) tags.push("rustic-nature");
  if (FAMILY_AMENITIES.test(blob)) tags.push("family-friendly");
  return tags;
}

function refineToneFromContext(
  baseTone: SiteTone,
  answers: QuestionnaireAnswers,
  settingHint: string,
  priceTier: StyleSignals["priceTier"],
  amenityTags: string[],
): SiteTone {
  const blob = [
    answers.propertyDetails.tagline,
    ...answers.rooms.rooms.map((room) => room.notes ?? ""),
  ].join(" ");

  if (settingHint === "coastal-waterfront" || COASTAL_KEYWORDS.test(blob)) {
    return "coastal";
  }

  if (settingHint === "mountain-rural" || answers.propertyDetails.propertyType === "cabin") {
    return "rustic";
  }

  if (LUXURY_KEYWORDS.test(blob) || priceTier === "premium") return "luxury";
  if (ROMANTIC_KEYWORDS.test(blob) && baseTone !== "rustic") return "boutique";
  if (RELAXED_KEYWORDS.test(blob) && settingHint === "coastal-waterfront") {
    return "coastal";
  }

  if (amenityTags.includes("family-friendly")) return "family";
  if (amenityTags.includes("luxury-leisure")) return "luxury";
  if (amenityTags.includes("rustic-nature")) return "rustic";

  if (answers.propertyDetails.propertyType === "apartment") return "modern";

  return baseTone;
}

export function buildStyleSignals(answers: QuestionnaireAnswers): StyleSignals {
  const baseTone = TONE_BY_PROPERTY_TYPE[answers.propertyDetails.propertyType];
  const settingHint = inferSettingHint(answers);
  const priceTier = inferPriceTier(answers);
  const scale = inferScale(answers);
  const amenityPersonality = inferAmenityPersonality(answers);
  const suggestedTone = refineToneFromContext(
    baseTone,
    answers,
    settingHint,
    priceTier,
    amenityPersonality,
  );

  return {
    suggestedTone,
    settingHint,
    priceTier,
    scale,
    amenityPersonality,
    stylePreference: answers.contactBranding.stylePreference ?? "auto",
    accentColorSource: answers.contactBranding.accentColorSource ?? "owner",
    ownerAccentColor: answers.contactBranding.accentColor,
  };
}

export function formatStyleSignalsForPrompt(
  answers: QuestionnaireAnswers,
  signals: StyleSignals,
): string {
  const { propertyDetails } = answers;

  return [
    `Property type: ${PROPERTY_TYPE_LABELS[propertyDetails.propertyType]}`,
    `Tagline: ${propertyDetails.tagline}`,
    `Suggested tone: ${signals.suggestedTone}`,
    `Setting: ${signals.settingHint}`,
    `Price tier: ${signals.priceTier}`,
    `Scale: ${signals.scale}`,
    signals.amenityPersonality.length > 0
      ? `Amenity personality: ${signals.amenityPersonality.join(", ")}`
      : null,
    `Owner style preference: ${signals.stylePreference}`,
    signals.accentColorSource === "owner"
      ? `Owner accent color (use for harmony; do not change): ${signals.ownerAccentColor}`
      : "Owner requested AI-suggested accent color from palette",
  ]
    .filter(Boolean)
    .join("\n");
}
