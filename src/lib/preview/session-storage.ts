import { SESSION_STORAGE_KEYS } from "@/lib/constants";
import { siteContentSchema } from "@/lib/validation/site-content";
import type { SiteContent } from "@/lib/types/site-content";

export type StoredSitePreview = {
  siteContent: SiteContent;
  previewSiteId: string;
};

export function loadStoredSitePreview(
  expectedSiteId?: string,
): StoredSitePreview | null {
  if (typeof window === "undefined") return null;

  const previewSiteId = sessionStorage.getItem(SESSION_STORAGE_KEYS.previewSiteId);
  const raw = sessionStorage.getItem(SESSION_STORAGE_KEYS.siteContent);

  if (!raw || !previewSiteId) return null;
  if (expectedSiteId && previewSiteId !== expectedSiteId) return null;

  try {
    const parsed = siteContentSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;
    return { siteContent: parsed.data, previewSiteId };
  } catch {
    return null;
  }
}

export function saveStoredSitePreview(
  siteContent: SiteContent,
  previewSiteId: string,
): void {
  sessionStorage.setItem(
    SESSION_STORAGE_KEYS.siteContent,
    JSON.stringify(siteContent),
  );
  sessionStorage.setItem(SESSION_STORAGE_KEYS.previewSiteId, previewSiteId);
}

export function clearStoredSitePreview(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEYS.siteContent);
  sessionStorage.removeItem(SESSION_STORAGE_KEYS.previewSiteId);
}
