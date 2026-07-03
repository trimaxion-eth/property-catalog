"use client";

import { createContext, useContext } from "react";
import type { SiteContent } from "@/lib/types/site-content";

const SiteContentContext = createContext<SiteContent | null>(null);

export function useSiteContent(): SiteContent {
  const value = useContext(SiteContentContext);
  if (!value) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return value;
}

export function SiteContentProvider({
  siteContent,
  children,
}: {
  siteContent: SiteContent;
  children: React.ReactNode;
}) {
  return (
    <SiteContentContext.Provider value={siteContent}>
      {children}
    </SiteContentContext.Provider>
  );
}
