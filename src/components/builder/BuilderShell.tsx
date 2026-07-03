"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateSite } from "@/lib/api/generate-site";
import { handleClientError } from "@/lib/errors";
import { toQuestionnaireAnswers } from "@/lib/questionnaire/helpers";
import { BuilderNav } from "@/components/builder/BuilderNav";
import { BuilderPreviewPane } from "@/components/builder/BuilderPreviewPane";
import { QuestionnaireSidebar } from "@/components/builder/QuestionnaireSidebar";
import { QuestionnaireStepPanel } from "@/components/builder/QuestionnaireStepPanel";
import { useQuestionnaireDraft } from "@/hooks/useQuestionnaireDraft";
import { useStoredSiteContent } from "@/hooks/useStoredSiteContent";

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

      const result = await generateSite({
        answers,
        previewSiteId: previewSiteId ?? undefined,
      });

      persistSiteContent(result.siteContent, result.previewSiteId);
      generatedDraftSnapshot.current = JSON.stringify(draft);
      skipStaleCheck.current = true;
      setIsPreviewStale(false);
      setGenerateSuccess("Your website is ready. Browse the preview or open the full site.");
    } catch (error) {
      setGenerationError(handleClientError(error));
    } finally {
      setIsGenerating(false);
    }
  }, [draft, persistSiteContent, previewSiteId]);

  if (!draftHydrated || !isPreviewHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted text-sm text-text-muted">
        Loading your draft…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <BuilderNav />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <QuestionnaireSidebar
          activeStepId={activeStepId}
          isStepComplete={isStepComplete}
          isQuestionnaireComplete={isComplete}
          onStepSelect={setActiveStepId}
          onGenerate={() => void handleGenerate()}
          isGenerating={isGenerating}
        />

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <section className="min-h-0 flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mx-auto max-w-2xl">
              <QuestionnaireStepPanel
                activeStepId={activeStepId}
                draft={draft}
                onChange={updateDraft}
              />
              {generateSuccess ? (
                <p
                  className="mt-6 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800"
                  role="status"
                >
                  {generateSuccess}
                </p>
              ) : null}
            </div>
          </section>

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
    </div>
  );
}
