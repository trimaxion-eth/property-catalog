import { loadLayoutPreferences } from "@/lib/preview/layout-preferences-storage";
import type { LayoutPreferencesPayload } from "@/lib/types/layout-preferences";

export async function syncLayoutPreferences(
  siteId: string,
  preferences?: LayoutPreferencesPayload,
): Promise<LayoutPreferencesPayload | null> {
  const payload = preferences ?? loadLayoutPreferences(siteId);
  if (!payload) return null;

  const response = await fetch("/api/layout-preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteId, preferences: payload }),
  });

  if (!response.ok) {
    const body = (await response.json()) as { error?: string };
    throw new Error(body.error ?? "Failed to sync layout preferences");
  }

  return payload;
}
