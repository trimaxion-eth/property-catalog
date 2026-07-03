import { z } from "zod";

export const homeCopySchema = z.object({
  heroHeadline: z.string().trim().min(1),
  heroSubheadline: z.string().trim().min(1),
  introTitle: z.string().trim().min(1),
  introBody: z.string().trim().min(1),
});

export const roomCopySchema = z.object({
  description: z.string().trim().min(1),
  amenities: z.array(z.string().trim().min(1)).min(1).max(8),
  imageAlt: z.string().trim().min(1),
});

export const amenitiesCopySchema = z.object({
  headline: z.string().trim().min(1),
  items: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        description: z.string().trim().optional(),
      }),
    )
    .min(1),
});

export const locationCopySchema = z.object({
  headline: z.string().trim().min(1),
  body: z.string().trim().min(1),
  nearbyHighlights: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
      }),
    )
    .min(1),
});

export const metaCopySchema = z.object({
  title: z.string().trim().min(1).max(70),
  description: z.string().trim().min(1).max(160),
});

export const contactCopySchema = z.object({
  headline: z.string().trim().min(1),
  body: z.string().trim().min(1),
  ctaLabel: z.string().trim().min(1).max(40),
});

export type HomeCopy = z.infer<typeof homeCopySchema>;
export type RoomCopy = z.infer<typeof roomCopySchema>;
export type AmenitiesCopy = z.infer<typeof amenitiesCopySchema>;
export type LocationCopy = z.infer<typeof locationCopySchema>;
export type MetaCopy = z.infer<typeof metaCopySchema>;
export type ContactCopy = z.infer<typeof contactCopySchema>;
