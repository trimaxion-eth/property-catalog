import { z } from "zod";
import { questionnaireAnswersSchema } from "@/lib/validation/questionnaire";
import { siteContentSchema } from "@/lib/validation/site-content";
import { layoutPreferencesPayloadSchema } from "@/lib/validation/layout-preferences";

export const apiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
});

export const apiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
  });

export const generateSiteRequestSchema = z.object({
  answers: questionnaireAnswersSchema,
  previewSiteId: z.string().min(1).optional(),
  layoutPreferences: layoutPreferencesPayloadSchema.optional(),
});

export const generateSiteResponseSchema = z.object({
  siteContent: siteContentSchema,
  previewSiteId: z.string().min(1),
});

export type ApiErrorBody = z.infer<typeof apiErrorSchema>;
export type GenerateSiteRequest = z.infer<typeof generateSiteRequestSchema>;
export type GenerateSiteResponse = z.infer<typeof generateSiteResponseSchema>;

export type ApiResponse<T> =
  | { data: T }
  | { error: string; code?: string };
