"use client";

import Link from "next/link";
import type { QuestionnaireDraft } from "@/lib/types/questionnaire";
import type { SiteContent } from "@/lib/types/site-content";
import {
  hasGeneratedPreviewContent,
  resolveBuilderPreviewContent,
} from "@/lib/preview/resolve-preview-content";
import { previewBasePath } from "@/lib/site/preview-path";
import { BuilderSoftPreview } from "@/components/builder/BuilderSoftPreview";
import { GenerationStatusOverlay } from "@/components/builder/GenerationStatusOverlay";
import { LayoutControlsToggle } from "@/components/preview/rotatable/LayoutControlsToggle";
import { SoftPreviewProvider } from "@/hooks/useSoftPreview";

type BuilderPreviewPaneProps = {
  draft: QuestionnaireDraft;
  siteContent: SiteContent | null;
  previewSiteId: string | null;
  isQuestionnaireComplete: boolean;
  isGenerating: boolean;
  generationError: string | null;
  isPreviewStale: boolean;
  onRetryGenerate: () => void;
};

export function BuilderPreviewPane({
  draft,
  siteContent,
  previewSiteId,
  isQuestionnaireComplete,
  isGenerating,
  generationError,
  isPreviewStale,
  onRetryGenerate,
}: BuilderPreviewPaneProps) {
  const hasGeneratedCopy = hasGeneratedPreviewContent(siteContent, isPreviewStale);
  const previewContent =
    previewSiteId != null
      ? resolveBuilderPreviewContent(
          draft,
          previewSiteId,
          siteContent,
          isPreviewStale,
        )
      : null;

  return (
    <aside className="flex min-h-[320px] min-w-0 flex-1 flex-col bg-surface-muted lg:min-h-0">
      {previewContent ? (
        <SoftPreviewProvider siteId={previewContent.id}>
          <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-text">Live preview</h2>
              <p className="text-xs text-text-muted">
                {isGenerating
                  ? "Building your site…"
                  : hasGeneratedCopy
                    ? "Soft preview with generated copy — toggle layouts to explore options."
                    : isQuestionnaireComplete
                      ? "Explore layouts, then generate for AI-written copy."
                      : "Soft preview — toggle layouts to try hero and nav options."}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <LayoutControlsToggle />
              {hasGeneratedCopy && previewSiteId ? (
                <Link
                  href={previewBasePath(previewSiteId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  Open full site ↗
                </Link>
              ) : null}
            </div>
          </div>

          {isPreviewStale && siteContent ? (
            <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
              Questionnaire changed — preview shows your latest answers. Generate again
              to refresh AI copy.
            </div>
          ) : null}

          <div className="relative flex flex-1 items-start justify-center overflow-y-auto p-4 lg:p-6">
            <div className="relative w-full max-w-3xl">
              <BuilderSoftPreview siteContent={previewContent} />
              <GenerationStatusOverlay
                isGenerating={isGenerating}
                error={generationError}
                onRetry={onRetryGenerate}
              />
            </div>
          </div>
        </SoftPreviewProvider>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-text">Live preview</h2>
              <p className="text-xs text-text-muted">Loading preview…</p>
            </div>
          </div>
          <div className="relative flex flex-1 items-start justify-center overflow-y-auto p-4 lg:p-6">
            <GenerationStatusOverlay
              isGenerating={isGenerating}
              error={generationError}
              onRetry={onRetryGenerate}
            />
          </div>
        </>
      )}
    </aside>
  );
}
