import { IMAGE_CATEGORY_LABELS } from "@/lib/constants";
import type { ImageCategory } from "@/lib/types/enums";
import type { QuestionnaireAnswers } from "@/lib/types/questionnaire";
import type { SiteContent, SiteImage } from "@/lib/types/site-content";
import type { GenerateSiteResponse } from "@/lib/types/api";
import {
  galleryImageSeed,
  picsumImageUrl,
  propertyHeroSeed,
  roomImageSeed,
} from "@/lib/images/picsum";
import {
  buildAmenitiesPrompt,
  buildContactPrompt,
  buildHomePrompt,
  buildLocationPrompt,
  buildMetaPrompt,
  buildRoomPrompt,
} from "@/lib/prompts/sections";
import { buildStylePrompt } from "@/lib/prompts/style";
import { buildStyleSignals } from "@/lib/site/build-style-signals";
import { callLlmJson } from "@/lib/services/llm-client";
import {
  amenitiesCopySchema,
  contactCopySchema,
  homeCopySchema,
  locationCopySchema,
  metaCopySchema,
  roomCopySchema,
} from "@/lib/validation/llm-outputs";
import {
  llmOutputToSiteStyle,
  llmSiteStyleOutputSchema,
  resolveAccentColor,
} from "@/lib/validation/site-style";
import { siteContentSchema } from "@/lib/validation/site-content";

import { createPreviewSiteId } from "@/lib/preview/preview-site-id";

function buildSiteImage(
  seed: string,
  alt: string,
  category?: ImageCategory,
): SiteImage {
  return {
    url: picsumImageUrl(seed),
    alt,
    seed,
    category,
  };
}

function buildGallery(answers: QuestionnaireAnswers) {
  const propertyName = answers.propertyDetails.propertyName;
  const categories: ImageCategory[] = [
    "property",
    "rooms",
    "amenities",
    "location",
  ];

  return {
    headline: "Gallery",
    categories: categories.map((category) => ({
      id: category,
      name: IMAGE_CATEGORY_LABELS[category],
      images: [0, 1, 2].map((index) =>
        buildSiteImage(
          galleryImageSeed(propertyName, category, index),
          `${IMAGE_CATEGORY_LABELS[category]} at ${propertyName} — photo ${index + 1}`,
          category,
        ),
      ),
    })),
  };
}

export async function generateSiteContent(
  answers: QuestionnaireAnswers,
  previewSiteId?: string,
): Promise<GenerateSiteResponse> {
  const siteId = previewSiteId ?? createPreviewSiteId();
  const propertyName = answers.propertyDetails.propertyName;
  const styleSignals = buildStyleSignals(answers);

  const [homeCopy, amenitiesCopy, locationCopy, metaCopy, contactCopy, styleLlm] =
    await Promise.all([
      callLlmJson({
        prompt: buildHomePrompt(answers),
        schema: homeCopySchema,
        schemaName: "homeCopy",
      }),
      callLlmJson({
        prompt: buildAmenitiesPrompt(answers),
        schema: amenitiesCopySchema,
        schemaName: "amenitiesCopy",
      }),
      callLlmJson({
        prompt: buildLocationPrompt(answers),
        schema: locationCopySchema,
        schemaName: "locationCopy",
      }),
      callLlmJson({
        prompt: buildMetaPrompt(answers),
        schema: metaCopySchema,
        schemaName: "metaCopy",
      }),
      callLlmJson({
        prompt: buildContactPrompt(answers),
        schema: contactCopySchema,
        schemaName: "contactCopy",
      }),
      callLlmJson({
        prompt: buildStylePrompt(answers, styleSignals),
        schema: llmSiteStyleOutputSchema,
        schemaName: "siteStyle",
      }),
    ]);

  const accentColor = resolveAccentColor(
    answers.contactBranding.accentColor,
    styleSignals.accentColorSource,
    styleLlm.accentColor,
  );
  const siteStyle = llmOutputToSiteStyle(styleLlm);

  const roomCopies = await Promise.all(
    answers.rooms.rooms.map((room) =>
      callLlmJson({
        prompt: buildRoomPrompt(answers, room.id),
        schema: roomCopySchema,
        schemaName: `roomCopy:${room.name}`,
      }),
    ),
  );

  const heroSeed = propertyHeroSeed(propertyName);
  const siteContent: SiteContent = {
    id: siteId,
    generatedAt: new Date().toISOString(),
    meta: metaCopy,
    branding: {
      propertyName: answers.propertyDetails.propertyName,
      propertyType: answers.propertyDetails.propertyType,
      tagline: answers.propertyDetails.tagline,
      accentColor,
    },
    booking: {
      channelType: answers.bookingSettings.channelType,
      channelTarget: answers.bookingSettings.channelTarget,
      ctaLabel: contactCopy.ctaLabel,
    },
    contact: {
      email: answers.contactBranding.email,
      phone: answers.contactBranding.phone?.trim() || undefined,
      addressLine: answers.location.addressLine,
      city: answers.location.city,
      region: answers.location.region?.trim() || undefined,
      country: answers.location.country,
    },
    home: {
      ...homeCopy,
      heroImage: buildSiteImage(
        heroSeed,
        `${propertyName} exterior and surroundings`,
        "property",
      ),
    },
    rooms: answers.rooms.rooms.map((room, index) => {
      const copy = roomCopies[index];
      const seed = roomImageSeed(propertyName, room.name);
      return {
        id: room.id,
        name: room.name,
        description: copy.description,
        capacity: room.capacity,
        price:
          room.basePrice != null
            ? { amount: room.basePrice, currency: answers.rooms.currency }
            : undefined,
        image: buildSiteImage(seed, copy.imageAlt, "rooms"),
        amenities: copy.amenities,
      };
    }),
    gallery: buildGallery(answers),
    location: {
      headline: locationCopy.headline,
      body: locationCopy.body,
      addressLine: answers.location.addressLine,
      city: answers.location.city,
      region: answers.location.region?.trim() || undefined,
      country: answers.location.country,
      latitude: answers.location.latitude,
      longitude: answers.location.longitude,
      nearbyHighlights: locationCopy.nearbyHighlights,
    },
    amenities: amenitiesCopy,
    contactPage: {
      headline: contactCopy.headline,
      body: contactCopy.body,
    },
    style: siteStyle,
  };

  const validated = siteContentSchema.parse(siteContent);
  return {
    siteContent: validated,
    previewSiteId: siteId,
  };
}
