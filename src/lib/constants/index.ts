import type {
  BookingChannelType,
  BuilderJourneyStepId,
  CurrencyCode,
  ImageCategory,
  PropertyType,
  QuestionnaireStepId,
  SitePage,
} from "@/lib/types/enums";
import type { StylePreference } from "@/lib/types/site-style";
import type { RotatableSectionId } from "@/lib/validation/layout-preferences";

export const BUILDER_JOURNEY_STEPS: {
  id: BuilderJourneyStepId;
  label: string;
  detail: string;
}[] = [
  {
    id: "describe",
    label: "Describe",
    detail: "Answer questions about your property",
  },
  {
    id: "generate",
    label: "Generate",
    detail: "AI creates your website in minutes",
  },
  {
    id: "customize",
    label: "Customize",
    detail: "Review and tweak anything you like",
  },
  {
    id: "publish",
    label: "Publish",
    detail: "Connect your domain and go live",
  },
];

export const QUESTIONNAIRE_STEPS: {
  id: QuestionnaireStepId;
  label: string;
}[] = [
  { id: "property-details", label: "Property Details" },
  { id: "rooms", label: "Rooms & Accommodation" },
  { id: "amenities", label: "Amenities & Services" },
  { id: "location", label: "Location" },
  { id: "photos", label: "Photos" },
  { id: "contact-branding", label: "Contact & Branding" },
  { id: "booking-settings", label: "Booking Settings" },
];

export const SITE_PAGES: { id: SitePage; label: string; path: string }[] = [
  { id: "home", label: "Home", path: "" },
  { id: "rooms", label: "Rooms", path: "/rooms" },
  { id: "gallery", label: "Gallery", path: "/gallery" },
  { id: "location", label: "Location", path: "/location" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export const PROPERTY_TYPES: PropertyType[] = [
  "hotel",
  "boutique_hotel",
  "bnb",
  "vacation_rental",
  "cabin",
  "villa",
  "apartment",
];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  hotel: "Hotel",
  boutique_hotel: "Boutique Hotel",
  bnb: "Bed & Breakfast",
  vacation_rental: "Vacation Rental",
  cabin: "Cabin / Lodge",
  villa: "Villa",
  apartment: "Apartment",
};

export const BOOKING_CHANNEL_TYPES: BookingChannelType[] = [
  "url",
  "email",
  "whatsapp",
];

export const BOOKING_CHANNEL_LABELS: Record<BookingChannelType, string> = {
  url: "Booking website (Booking.com, own site, etc.)",
  email: "Email",
  whatsapp: "WhatsApp",
};

export const SUPPORTED_CURRENCIES: CurrencyCode[] = [
  "EUR",
  "USD",
  "GBP",
  "CZK",
];

export const IMAGE_CATEGORIES: ImageCategory[] = [
  "property",
  "rooms",
  "amenities",
  "location",
  "dining",
  "other",
];

export const IMAGE_CATEGORY_LABELS: Record<ImageCategory, string> = {
  property: "Property",
  rooms: "Rooms",
  amenities: "Amenities",
  location: "Location",
  dining: "Dining",
  other: "Other",
};

export const AMENITY_OPTIONS = [
  "Free Wi-Fi",
  "Breakfast included",
  "Parking",
  "Air conditioning",
  "Swimming pool",
  "Spa & wellness",
  "Restaurant",
  "Bar",
  "Pet friendly",
  "Airport shuttle",
  "Room service",
  "Fitness center",
  "Beach access",
  "Garden / terrace",
  "Family rooms",
] as const;

export const MIN_ROOMS = 1;
export const MAX_ROOMS = 6;

export const SESSION_STORAGE_KEYS = {
  questionnaire: "staysite:questionnaire",
  siteContent: "staysite:site-content",
  previewSiteId: "staysite:preview-site-id",
  layoutPreferences: "staysite:layout-preferences",
} as const;

export function localStorageLayoutPreferencesKey(siteId: string): string {
  return `staysite:layout-preferences:${siteId}`;
}

/** Rotatable sections enabled per rollout phase */
export const ROTATABLE_SECTION_PHASE: Record<RotatableSectionId, 1 | 2 | 3> = {
  hero: 1,
  nav: 1,
  rooms: 2,
  gallery: 2,
  location: 3,
  footer: 3,
};

export const SOFT_PREVIEW_PHASE = 1 as const;

export const STYLE_PREFERENCE_OPTIONS: {
  id: StylePreference;
  label: string;
}[] = [
  { id: "auto", label: "Match my property" },
  { id: "refined", label: "Calm & refined" },
  { id: "bold", label: "Bold & immersive" },
];
