import { localStorageLayoutPreferencesKey } from "@/lib/constants";
import { layoutPreferencesPayloadSchema } from "@/lib/validation/layout-preferences";
import type { LayoutPreferencesPayload } from "@/lib/types/layout-preferences";

export function loadLayoutPreferences(
  siteId: string,
): LayoutPreferencesPayload | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(localStorageLayoutPreferencesKey(siteId));
  if (!raw) return null;

  try {
    const parsed = layoutPreferencesPayloadSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveLayoutPreferences(
  siteId: string,
  payload: LayoutPreferencesPayload,
): void {
  localStorage.setItem(
    localStorageLayoutPreferencesKey(siteId),
    JSON.stringify(payload),
  );
}

export function clearLayoutPreferences(siteId: string): void {
  localStorage.removeItem(localStorageLayoutPreferencesKey(siteId));
}
