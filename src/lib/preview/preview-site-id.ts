import { SESSION_STORAGE_KEYS } from "@/lib/constants";

export function createPreviewSiteId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `site-${Date.now()}`;
}

/** Stable preview session id — created on first builder visit, reused through generate. */
export function getOrCreatePreviewSiteId(): string {
  if (typeof window === "undefined") {
    return "preview-pending";
  }

  const existing = sessionStorage.getItem(SESSION_STORAGE_KEYS.previewSiteId);
  if (existing) return existing;

  const created = createPreviewSiteId();
  sessionStorage.setItem(SESSION_STORAGE_KEYS.previewSiteId, created);
  return created;
}
