import {
  IMAGE_CATEGORY_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/constants";
import type { ImageCategory } from "@/lib/types/enums";
import type { QuestionnaireDraft } from "@/lib/types/questionnaire";
import type { SiteContent, SiteImage } from "@/lib/types/site-content";
import {
  galleryImageSeed,
  picsumImageUrl,
  propertyHeroSeed,
  roomImageSeed,
} from "@/lib/images/picsum";
import { createDefaultSiteStyle } from "@/lib/site/apply-site-style";

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

function resolvePropertyName(draft: QuestionnaireDraft): string {
  const name = draft.propertyDetails.propertyName.trim();
  return name || "Your property";
}

function resolveTagline(draft: QuestionnaireDraft): string {
  const tagline = draft.propertyDetails.tagline.trim();
  if (tagline) return tagline;
  return PROPERTY_TYPE_LABELS[draft.propertyDetails.propertyType];
}

function resolveLocationLine(draft: QuestionnaireDraft): string {
  const { city, country } = draft.location;
  if (city.trim() && country.trim()) {
    return `${city.trim()}, ${country.trim()}`;
  }
  if (city.trim()) return city.trim();
  if (country.trim()) return country.trim();
  return "A destination worth discovering";
}

function buildGallery(propertyName: string) {
  const categories: ImageCategory[] = ["property", "rooms", "amenities", "location"];

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

function buildAmenities(draft: QuestionnaireDraft) {
  const custom = (draft.amenities.customAmenities ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const names = [...draft.amenities.selectedAmenities, ...custom];

  const items =
    names.length > 0
      ? names.map((name) => ({
          name,
          description: "Included for every guest stay.",
        }))
      : [{ name: "Thoughtful comforts", description: "Amenities you add will appear here." }];

  return {
    headline: "Amenities & services",
    items,
  };
}

function buildNearbyHighlights(draft: QuestionnaireDraft) {
  const highlights = draft.location.nearbyHighlights
    .map((item) => item.trim())
    .filter(Boolean);

  if (highlights.length > 0) {
    return highlights.map((title) => ({
      title,
      description: "A local highlight near your property.",
    }));
  }

  return [
    {
      title: "Explore the neighborhood",
      description: "Nearby attractions you list will show on your location page.",
    },
  ];
}

function buildRooms(draft: QuestionnaireDraft, propertyName: string) {
  const namedRooms = draft.rooms.rooms.filter((room) => room.name.trim());

  const source =
    namedRooms.length > 0
      ? namedRooms
      : [{ id: draft.rooms.rooms[0]?.id ?? "room-1", name: "Guest room" }];

  return source.map((room) => ({
    id: room.id,
    name: room.name.trim() || "Guest room",
    description:
      room.notes?.trim() ||
      "Room details and AI-written descriptions will appear after you generate your site.",
    capacity: room.capacity,
    price:
      room.basePrice != null
        ? { amount: room.basePrice, currency: draft.rooms.currency }
        : undefined,
    image: buildSiteImage(
      roomImageSeed(propertyName, room.name || "guest-room"),
      `${room.name || "Guest room"} at ${propertyName}`,
      "rooms",
    ),
    amenities: draft.amenities.selectedAmenities.slice(0, 3),
  }));
}

/**
 * Builds placeholder SiteContent from questionnaire draft for the soft preview
 * before (and between) LLM generation runs.
 */
export function draftToSoftPreviewSiteContent(
  draft: QuestionnaireDraft,
  previewSiteId: string,
): SiteContent {
  const propertyName = resolvePropertyName(draft);
  const tagline = resolveTagline(draft);
  const locationLine = resolveLocationLine(draft);
  const heroSeed = propertyHeroSeed(propertyName);
  const email = draft.contactBranding.email.trim() || "hello@yourproperty.com";
  const addressLine = draft.location.addressLine.trim() || "Your address";
  const city = draft.location.city.trim() || "Your city";
  const country = draft.location.country.trim() || "Your country";

  return {
    id: previewSiteId,
    generatedAt: new Date().toISOString(),
    meta: {
      title: `${propertyName} — ${tagline}`,
      description: `Discover ${propertyName} in ${locationLine}.`,
    },
    branding: {
      propertyName,
      propertyType: draft.propertyDetails.propertyType,
      tagline,
      accentColor: draft.contactBranding.accentColor,
    },
    booking: {
      channelType: draft.bookingSettings.channelType,
      channelTarget: draft.bookingSettings.channelTarget.trim() || "#",
      ctaLabel: "Book Now",
    },
    contact: {
      email,
      phone: draft.contactBranding.phone?.trim() || undefined,
      addressLine,
      city,
      region: draft.location.region?.trim() || undefined,
      country,
    },
    home: {
      heroHeadline: propertyName,
      heroSubheadline: locationLine,
      introTitle: "Welcome to your stay",
      introBody:
        "This is a soft preview — explore layout options on the hero and navigation while you complete the questionnaire. AI-written copy replaces these placeholders when you generate your site.",
      heroImage: buildSiteImage(
        heroSeed,
        `${propertyName} exterior and surroundings`,
        "property",
      ),
    },
    rooms: buildRooms(draft, propertyName),
    gallery: buildGallery(propertyName),
    location: {
      headline: "Find us",
      body: "Your map pin and location story will be refined when you generate your site.",
      addressLine,
      city,
      region: draft.location.region?.trim() || undefined,
      country,
      latitude: draft.location.latitude,
      longitude: draft.location.longitude,
      nearbyHighlights: buildNearbyHighlights(draft),
    },
    amenities: buildAmenities(draft),
    contactPage: {
      headline: "Get in touch",
      body: "Contact details from your questionnaire appear here. Generate your site for polished guest-facing copy.",
    },
    style: createDefaultSiteStyle(draft.contactBranding.accentColor),
  };
}
