import { z } from "zod";

export const LAYOUT_PREFERENCES_SCHEMA_VERSION = 1 as const;

export const rotatableSectionIdSchema = z.enum([
  "hero",
  "nav",
  "rooms",
  "gallery",
  "location",
  "footer",
]);

export const sectionLayoutPreferenceSchema = z.object({
  layout: z.string().min(1),
  rank: z.number().int().min(1),
});

export const sectionInteractionSchema = z.object({
  section: rotatableSectionIdSchema,
  viewed: z.array(z.string().min(1)),
  selected: z.string().min(1),
  dwellMs: z.number().int().min(0),
});

export const layoutPreferencesPayloadSchema = z.object({
  version: z.literal(LAYOUT_PREFERENCES_SCHEMA_VERSION),
  preferences: z.record(rotatableSectionIdSchema, sectionLayoutPreferenceSchema),
  interactions: z.array(sectionInteractionSchema),
  updatedAt: z.string().datetime(),
});

export type RotatableSectionId = z.infer<typeof rotatableSectionIdSchema>;
export type SectionLayoutPreference = z.infer<typeof sectionLayoutPreferenceSchema>;
export type SectionInteraction = z.infer<typeof sectionInteractionSchema>;
export type LayoutPreferencesPayload = z.infer<typeof layoutPreferencesPayloadSchema>;
