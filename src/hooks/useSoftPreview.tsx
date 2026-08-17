"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ROTATABLE_SECTION_PHASE,
  SOFT_PREVIEW_PHASE,
} from "@/lib/constants";
import {
  loadLayoutPreferences,
  saveLayoutPreferences,
} from "@/lib/preview/layout-preferences-storage";
import { getSectionLayoutEntry } from "@/lib/section-layouts/registry";
import {
  LAYOUT_PREFERENCES_SCHEMA_VERSION,
  type LayoutPreferencesPayload,
  type RotatableSectionId,
  type SectionInteraction,
} from "@/lib/validation/layout-preferences";

type SectionState = {
  selectedLayoutId: string;
  viewedLayoutIds: string[];
  dwellStartedAt: number;
  totalDwellMs: number;
};

type SoftPreviewContextValue = {
  siteId: string;
  showLayoutControls: boolean;
  toggleLayoutControls: () => void;
  isSectionRotatable: (sectionId: RotatableSectionId) => boolean;
  getSelectedLayoutId: (sectionId: RotatableSectionId) => string;
  selectLayout: (sectionId: RotatableSectionId, layoutId: string) => void;
  rotateLayout: (sectionId: RotatableSectionId, direction: "prev" | "next") => void;
  buildPayload: () => LayoutPreferencesPayload;
  syncPreferences: () => Promise<void>;
};

const SoftPreviewContext = createContext<SoftPreviewContextValue | null>(null);

function isSectionEnabledForPhase(sectionId: RotatableSectionId): boolean {
  return ROTATABLE_SECTION_PHASE[sectionId] <= SOFT_PREVIEW_PHASE;
}

function createInitialSectionState(
  sectionId: RotatableSectionId,
  stored?: LayoutPreferencesPayload | null,
): SectionState {
  const entry = getSectionLayoutEntry(sectionId);
  const defaultLayoutId = entry?.defaultLayoutId ?? "";
  const storedLayout = stored?.preferences[sectionId]?.layout;
  const selectedLayoutId =
    entry?.layouts.some((layout) => layout.id === storedLayout)
      ? storedLayout!
      : defaultLayoutId;

  const storedInteraction = stored?.interactions.find(
    (interaction) => interaction.section === sectionId,
  );

  return {
    selectedLayoutId,
    viewedLayoutIds: storedInteraction?.viewed.length
      ? [...new Set([...storedInteraction.viewed, selectedLayoutId])]
      : [selectedLayoutId],
    dwellStartedAt: Date.now(),
    totalDwellMs: storedInteraction?.dwellMs ?? 0,
  };
}

function buildInteraction(
  sectionId: RotatableSectionId,
  state: SectionState,
): SectionInteraction {
  const dwellMs =
    state.totalDwellMs + Math.max(0, Date.now() - state.dwellStartedAt);

  return {
    section: sectionId,
    viewed: [...new Set(state.viewedLayoutIds)],
    selected: state.selectedLayoutId,
    dwellMs,
  };
}

type SoftPreviewProviderProps = {
  siteId: string;
  children: React.ReactNode;
};

export function SoftPreviewProvider({ siteId, children }: SoftPreviewProviderProps) {
  const storedRef = useRef(loadLayoutPreferences(siteId));
  const [showLayoutControls, setShowLayoutControls] = useState(true);
  const [sectionStates, setSectionStates] = useState<
    Partial<Record<RotatableSectionId, SectionState>>
  >(() => {
    const initial: Partial<Record<RotatableSectionId, SectionState>> = {};
    for (const sectionId of Object.keys(ROTATABLE_SECTION_PHASE) as RotatableSectionId[]) {
      if (isSectionEnabledForPhase(sectionId)) {
        initial[sectionId] = createInitialSectionState(sectionId, storedRef.current);
      }
    }
    return initial;
  });

  const persistPayload = useCallback(
    (states: Partial<Record<RotatableSectionId, SectionState>>) => {
      const interactions = (Object.keys(states) as RotatableSectionId[])
        .filter(isSectionEnabledForPhase)
        .map((sectionId) => buildInteraction(sectionId, states[sectionId]!));

      const preferences = Object.fromEntries(
        interactions.map((interaction, index) => [
          interaction.section,
          { layout: interaction.selected, rank: index + 1 },
        ]),
      ) as LayoutPreferencesPayload["preferences"];

      const payload: LayoutPreferencesPayload = {
        version: LAYOUT_PREFERENCES_SCHEMA_VERSION,
        preferences,
        interactions,
        updatedAt: new Date().toISOString(),
      };

      saveLayoutPreferences(siteId, payload);
      return payload;
    },
    [siteId],
  );

  useEffect(() => {
    persistPayload(sectionStates);
  }, [sectionStates, persistPayload]);

  const updateSection = useCallback(
    (
      sectionId: RotatableSectionId,
      updater: (current: SectionState) => SectionState,
    ) => {
      setSectionStates((prev) => {
        const current = prev[sectionId];
        if (!current) return prev;
        return { ...prev, [sectionId]: updater(current) };
      });
    },
    [],
  );

  const selectLayout = useCallback(
    (sectionId: RotatableSectionId, layoutId: string) => {
      const entry = getSectionLayoutEntry(sectionId);
      if (!entry?.layouts.some((layout) => layout.id === layoutId)) return;

      updateSection(sectionId, (current) => {
        const dwellMs =
          current.totalDwellMs + Math.max(0, Date.now() - current.dwellStartedAt);

        return {
          selectedLayoutId: layoutId,
          viewedLayoutIds: [...new Set([...current.viewedLayoutIds, layoutId])],
          dwellStartedAt: Date.now(),
          totalDwellMs: dwellMs,
        };
      });
    },
    [updateSection],
  );

  const rotateLayout = useCallback(
    (sectionId: RotatableSectionId, direction: "prev" | "next") => {
      const entry = getSectionLayoutEntry(sectionId);
      if (!entry) return;

      const currentId =
        sectionStates[sectionId]?.selectedLayoutId ?? entry.defaultLayoutId;
      const currentIndex = entry.layouts.findIndex((layout) => layout.id === currentId);
      const nextIndex =
        direction === "next"
          ? (currentIndex + 1) % entry.layouts.length
          : (currentIndex - 1 + entry.layouts.length) % entry.layouts.length;
      const nextLayout = entry.layouts[nextIndex];
      if (nextLayout) selectLayout(sectionId, nextLayout.id);
    },
    [sectionStates, selectLayout],
  );

  const toggleLayoutControls = useCallback(() => {
    setShowLayoutControls((current) => !current);
  }, []);

  const buildPayload = useCallback(
    () => persistPayload(sectionStates),
    [persistPayload, sectionStates],
  );

  const syncPreferences = useCallback(async () => {
    const payload = buildPayload();
    const response = await fetch("/api/layout-preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, preferences: payload }),
    });

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      throw new Error(body.error ?? "Failed to sync layout preferences");
    }
  }, [buildPayload, siteId]);

  const value = useMemo<SoftPreviewContextValue>(
    () => ({
      siteId,
      showLayoutControls,
      toggleLayoutControls,
      isSectionRotatable: isSectionEnabledForPhase,
      getSelectedLayoutId: (sectionId) => {
        const entry = getSectionLayoutEntry(sectionId);
        return (
          sectionStates[sectionId]?.selectedLayoutId ??
          entry?.defaultLayoutId ??
          ""
        );
      },
      selectLayout,
      rotateLayout,
      buildPayload,
      syncPreferences,
    }),
    [siteId, showLayoutControls, toggleLayoutControls, sectionStates, selectLayout, rotateLayout, buildPayload, syncPreferences],
  );

  return (
    <SoftPreviewContext.Provider value={value}>{children}</SoftPreviewContext.Provider>
  );
}

export function useSoftPreview(): SoftPreviewContextValue {
  const value = useContext(SoftPreviewContext);
  if (!value) {
    throw new Error("useSoftPreview must be used within SoftPreviewProvider");
  }
  return value;
}

export function useSoftPreviewOptional(): SoftPreviewContextValue | null {
  return useContext(SoftPreviewContext);
}
