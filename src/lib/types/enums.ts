export type PropertyType =
  | "hotel"
  | "boutique_hotel"
  | "bnb"
  | "vacation_rental"
  | "cabin"
  | "villa"
  | "apartment";

export type BookingChannelType = "url" | "email" | "whatsapp";

export type CurrencyCode = "EUR" | "USD" | "GBP" | "CZK";

export type SitePage = "home" | "rooms" | "gallery" | "location" | "contact";

export type ImageCategory =
  | "property"
  | "rooms"
  | "amenities"
  | "location"
  | "dining"
  | "other";

export type QuestionnaireStepId =
  | "property-details"
  | "rooms"
  | "amenities"
  | "location"
  | "photos"
  | "contact-branding"
  | "booking-settings";

export type BuilderJourneyStepId =
  | "describe"
  | "generate"
  | "customize"
  | "publish";
