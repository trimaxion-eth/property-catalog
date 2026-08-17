import { z } from "zod";
import { layoutPreferencesPayloadSchema } from "@/lib/validation/layout-preferences";

export const syncLayoutPreferencesRequestSchema = z.object({
  siteId: z.string().min(1),
  preferences: layoutPreferencesPayloadSchema,
});

export type SyncLayoutPreferencesRequest = z.infer<
  typeof syncLayoutPreferencesRequestSchema
>;

export const syncLayoutPreferencesResponseSchema = z.object({
  siteId: z.string().min(1),
  preferences: layoutPreferencesPayloadSchema,
  syncedAt: z.string().datetime(),
});

export type SyncLayoutPreferencesResponse = z.infer<
  typeof syncLayoutPreferencesResponseSchema
>;
