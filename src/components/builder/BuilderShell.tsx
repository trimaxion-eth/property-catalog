"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateSite } from "@/lib/api/generate-site";
import { handleClientError } from "@/lib/errors";
import { loadLayoutPreferences } from "@/lib/preview/layout-preferences-storage";
import { seedLayoutPreferencesFromStyle } from "@/lib/preview/seed-layout-preferences";
import { syncLayoutPreferences } from "@/lib/preview/sync-layout-preferences";
import { resolveSiteStyle } from "@/lib/site/apply-site-style";
import { toQuestionnaireAnswers } from "@/lib/questionnaire/helpers";
import { BuilderNav } from "@/components/builder/BuilderNav";
import { BuilderPreviewPane } from "@/components/builder/BuilderPreviewPane";
import { QuestionnaireSidebar } from "@/components/builder/QuestionnaireSidebar";
import { useQuestionnaireDraft } from "@/hooks/useQuestionnaireDraft";
import { useStoredSiteContent } from "@/hooks/useStoredSiteContent";
import type { BuilderJourneyStepId } from "@/lib/types/enums";

function resolveBuilderJourneyStep(
  isGenerating: boolean,
  hasGeneratedSite: boolean,
): BuilderJourneyStepId {
  if (isGenerating) return "generate";
  if (hasGeneratedSite) return "customize";
  return "describe";
}

export function BuilderShell() {
  const {
    draft,
    updateDraft,
    activeStepId,
    setActiveStepId,
    hydrated: draftHydrated,
    isComplete,
    isStepComplete,
  } = useQuestionnaireDraft();
  const {
    siteContent,
    previewSiteId,
    persistSiteContent,
    isPreviewHydrated,
  } = useStoredSiteContent();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState<string | null>(null);
  const [isPreviewStale, setIsPreviewStale] = useState(false);
  const generatedDraftSnapshot = useRef<string | null>(null);
  const skipStaleCheck = useRef(true);

  useEffect(() => {
    if (!draftHydrated || !isPreviewHydrated) return;

    if (siteContent && !generatedDraftSnapshot.current) {
      generatedDraftSnapshot.current = JSON.stringify(draft);
      skipStaleCheck.current = true;
    }
  }, [draft, draftHydrated, isPreviewHydrated, siteContent]);

  useEffect(() => {
    if (!siteContent || !generatedDraftSnapshot.current) return;
    if (skipStaleCheck.current) {
      skipStaleCheck.current = false;
      return;
    }

    setIsPreviewStale(JSON.stringify(draft) !== generatedDraftSnapshot.current);
  }, [draft, siteContent]);

  const handleGenerate = useCallback(async () => {
    setGenerationError(null);
    setGenerateSuccess(null);
    setIsGenerating(true);

    try {
      const answers = toQuestionnaireAnswers(draft);
      const siteId = previewSiteId ?? siteContent?.id;
      const layoutPreferences = siteId
        ? loadLayoutPreferences(siteId) ?? undefined
        : undefined;

      const result = await generateSite({
        answers,
        previewSiteId: previewSiteId ?? undefined,
        layoutPreferences,
      });

      persistSiteContent(result.siteContent, result.previewSiteId);

      const mergedLayoutPreferences = seedLayoutPreferencesFromStyle(
        result.previewSiteId,
        resolveSiteStyle(result.siteContent),
        layoutPreferences,
      );
      await syncLayoutPreferences(
        result.previewSiteId,
        mergedLayoutPreferences,
      );

      generatedDraftSnapshot.current = JSON.stringify(draft);
      skipStaleCheck.current = true;
      setIsPreviewStale(false);

      const styleRationale = result.siteContent.style?.rationale;
      setGenerateSuccess(
        styleRationale
          ? `AI copy and styling are ready — ${styleRationale} Open the full site or keep exploring layouts.`
          : "AI copy is ready — your layout picks are saved. Open the full site or keep exploring.",
      );
    } catch (error) {
      setGenerationError(handleClientError(error));
    } finally {
      setIsGenerating(false);
    }
  }, [draft, persistSiteContent, previewSiteId, siteContent?.id]);

  if (!draftHydrated || !isPreviewHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted text-sm text-text-muted">
        Loading your draft…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <BuilderNav
        activeJourneyStep={resolveBuilderJourneyStep(
          isGenerating,
          Boolean(siteContent),
        )}
      />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <QuestionnaireSidebar
          draft={draft}
          onChange={updateDraft}
          activeStepId={activeStepId}
          isStepComplete={isStepComplete}
          isQuestionnaireComplete={isComplete}
          onStepSelect={setActiveStepId}
          onGenerate={() => void handleGenerate()}
          isGenerating={isGenerating}
          generateSuccess={generateSuccess}
        />

        <BuilderPreviewPane
          draft={draft}
          siteContent={siteContent}
          previewSiteId={previewSiteId}
          isQuestionnaireComplete={isComplete}
          isGenerating={isGenerating}
          generationError={generationError}
          isPreviewStale={isPreviewStale}
          onRetryGenerate={() => void handleGenerate()}
        />
      </div>
    </div>
  );
}
