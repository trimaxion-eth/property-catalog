import {
  syncLayoutPreferencesRequestSchema,
  syncLayoutPreferencesResponseSchema,
} from "@/lib/validation/layout-preferences-api";
import { handleApiError, ValidationError } from "@/lib/errors";

/** Phase 1: validate and acknowledge layout preferences (no DB persistence yet). */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = syncLayoutPreferencesRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message ?? "Invalid layout preferences payload",
      );
    }

    const response = syncLayoutPreferencesResponseSchema.parse({
      siteId: parsed.data.siteId,
      preferences: parsed.data.preferences,
      syncedAt: new Date().toISOString(),
    });

    return Response.json({ data: response });
  } catch (error) {
    return handleApiError(error);
  }
}
