import { z } from "zod";
import {
  bookingChannelTypeSchema,
  currencyCodeSchema,
  imageCategorySchema,
  propertyTypeSchema,
} from "@/lib/validation/enums";
import { siteStyleSchema } from "@/lib/validation/site-style";

export const siteImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().trim().min(1),
  seed: z.string().optional(),
  category: imageCategorySchema.optional(),
});

export const siteMetaSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

export const siteBrandingSchema = z.object({
  propertyName: z.string().trim().min(1),
  propertyType: propertyTypeSchema,
  tagline: z.string().trim().min(1),
  accentColor: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
});

export const siteBookingSchema = z.object({
  channelType: bookingChannelTypeSchema,
  channelTarget: z.string().trim().min(1),
  ctaLabel: z.string().trim().min(1),
});

export const siteContactSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  addressLine: z.string().trim().min(1),
  city: z.string().trim().min(1),
  region: z.string().optional(),
  country: z.string().trim().min(1),
});

export const siteRoomSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  capacity: z.number().int().positive().optional(),
  price: z
    .object({
      amount: z.number().positive(),
      currency: currencyCodeSchema,
    })
    .optional(),
  image: siteImageSchema,
  amenities: z.array(z.string().trim().min(1)),
});

export const siteHomeSchema = z.object({
  heroHeadline: z.string().trim().min(1),
  heroSubheadline: z.string().trim().min(1),
  introTitle: z.string().trim().min(1),
  introBody: z.string().trim().min(1),
  heroImage: siteImageSchema,
});

export const siteGalleryCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  images: z.array(siteImageSchema).min(1),
});

export const siteGallerySchema = z.object({
  headline: z.string().trim().min(1),
  categories: z.array(siteGalleryCategorySchema).min(1),
});

export const siteLocationHighlightSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

export const siteLocationSchema = z.object({
  headline: z.string().trim().min(1),
  body: z.string().trim().min(1),
  addressLine: z.string().trim().min(1),
  city: z.string().trim().min(1),
  region: z.string().optional(),
  country: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  nearbyHighlights: z.array(siteLocationHighlightSchema).min(1),
});

export const siteAmenitySchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
});

export const siteAmenitiesSchema = z.object({
  headline: z.string().trim().min(1),
  items: z.array(siteAmenitySchema).min(1),
});

export const siteContactPageSchema = z.object({
  headline: z.string().trim().min(1),
  body: z.string().trim().min(1),
});

export const siteContentSchema = z.object({
  id: z.string().min(1),
  generatedAt: z.string().datetime(),
  meta: siteMetaSchema,
  branding: siteBrandingSchema,
  booking: siteBookingSchema,
  contact: siteContactSchema,
  home: siteHomeSchema,
  rooms: z.array(siteRoomSchema).min(1),
  gallery: siteGallerySchema,
  location: siteLocationSchema,
  amenities: siteAmenitiesSchema,
  contactPage: siteContactPageSchema,
  style: siteStyleSchema.optional(),
});

export type SiteImage = z.infer<typeof siteImageSchema>;
export type SiteMeta = z.infer<typeof siteMetaSchema>;
export type SiteBranding = z.infer<typeof siteBrandingSchema>;
export type SiteBooking = z.infer<typeof siteBookingSchema>;
export type SiteContact = z.infer<typeof siteContactSchema>;
export type SiteRoom = z.infer<typeof siteRoomSchema>;
export type SiteHome = z.infer<typeof siteHomeSchema>;
export type SiteGalleryCategory = z.infer<typeof siteGalleryCategorySchema>;
export type SiteGallery = z.infer<typeof siteGallerySchema>;
export type SiteLocationHighlight = z.infer<typeof siteLocationHighlightSchema>;
export type SiteLocation = z.infer<typeof siteLocationSchema>;
export type SiteAmenity = z.infer<typeof siteAmenitySchema>;
export type SiteAmenities = z.infer<typeof siteAmenitiesSchema>;
export type SiteContactPage = z.infer<typeof siteContactPageSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;
