import { generateSiteRequestSchema } from "@/lib/validation/api";
import { generateSiteContent } from "@/lib/services/content-generation";
import { handleApiError, ValidationError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = generateSiteRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message ?? "Invalid request body",
      );
    }

    const result = await generateSiteContent(
      parsed.data.answers,
      parsed.data.previewSiteId,
    );

    return Response.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
