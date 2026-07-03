"use client";

import { useEffect, useState } from "react";
import { loadStoredSitePreview } from "@/lib/preview/session-storage";
import type { SiteContent } from "@/lib/types/site-content";

type PreviewSiteState = {
  siteContent: SiteContent | null;
  isLoading: boolean;
  error: string | null;
};

export function usePreviewSiteContent(siteId: string): PreviewSiteState {
  const [state, setState] = useState<PreviewSiteState>({
    siteContent: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const stored = loadStoredSitePreview(siteId);

    if (!stored) {
      setState({
        siteContent: null,
        isLoading: false,
        error:
          "Preview not found in this browser session. Generate your site again from the builder.",
      });
      return;
    }

    setState({
      siteContent: stored.siteContent,
      isLoading: false,
      error: null,
    });
  }, [siteId]);

  return state;
}
