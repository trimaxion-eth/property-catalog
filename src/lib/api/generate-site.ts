import type { GenerateSiteRequest, GenerateSiteResponse } from "@/lib/types/api";
import { handleClientError } from "@/lib/errors";

export async function generateSite(
  request: GenerateSiteRequest,
): Promise<GenerateSiteResponse> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const payload = (await response.json()) as
    | { data: GenerateSiteResponse }
    | { error: string };

  if (!response.ok) {
    throw new Error(
      "error" in payload ? payload.error : "Failed to generate site",
    );
  }

  if (!("data" in payload)) {
    throw new Error("Invalid response from server");
  }

  return payload.data;
}

export async function generateSiteSafe(request: GenerateSiteRequest) {
  try {
    const data = await generateSite(request);
    return { data, error: null as string | null };
  } catch (error) {
    return { data: null, error: handleClientError(error) };
  }
}
