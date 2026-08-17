"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadStoredSitePreview,
  saveStoredSitePreview,
} from "@/lib/preview/session-storage";
import { getOrCreatePreviewSiteId } from "@/lib/preview/preview-site-id";
import type { SiteContent } from "@/lib/types/site-content";

export function useStoredSiteContent() {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [previewSiteId, setPreviewSiteId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadStoredSitePreview();
    if (stored) {
      setSiteContent(stored.siteContent);
      setPreviewSiteId(stored.previewSiteId);
    } else {
      setPreviewSiteId(getOrCreatePreviewSiteId());
    }
    setHydrated(true);
  }, []);

  const persistSiteContent = useCallback(
    (content: SiteContent, siteId: string) => {
      saveStoredSitePreview(content, siteId);
      setSiteContent(content);
      setPreviewSiteId(siteId);
    },
    [],
  );

  return {
    siteContent,
    previewSiteId,
    persistSiteContent,
    hydrated: hydrated,
    isPreviewHydrated: hydrated,
  };
}
