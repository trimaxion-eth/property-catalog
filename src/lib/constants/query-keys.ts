/** TanStack Query key factories — extend in Phase 2 when server persistence lands. */
export const queryKeys = {
  generation: {
    all: ["generation"] as const,
  },
  sites: {
    all: ["sites"] as const,
    detail: (siteId: string) => ["sites", siteId] as const,
  },
} as const;
