"use client";

import Link from "next/link";
import type { QuestionnaireDraft } from "@/lib/types/questionnaire";
import type { SiteContent } from "@/lib/types/site-content";
import { previewBasePath } from "@/lib/site/preview-path";
import { BuilderDraftPreview } from "@/components/builder/BuilderDraftPreview";
import { BuilderInlineSitePreview } from "@/components/builder/BuilderInlineSitePreview";
import { GenerationStatusOverlay } from "@/components/builder/GenerationStatusOverlay";

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
  const showGeneratedPreview = siteContent && !isPreviewStale;

  return (
    <aside className="flex min-h-[320px] w-full shrink-0 flex-col border-t border-border bg-surface-muted lg:min-h-0 lg:w-[42%] lg:border-l lg:border-t-0">
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-text">Live preview</h2>
          <p className="text-xs text-text-muted">
            {isGenerating
              ? "Building your site…"
              : showGeneratedPreview
                ? "Generated homepage — open full site to browse all pages."
                : isQuestionnaireComplete
                  ? "Ready to generate your full site."
                  : "Preview updates as you fill in details."}
          </p>
        </div>
        {showGeneratedPreview && previewSiteId ? (
          <Link
            href={previewBasePath(previewSiteId)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            Open full site ↗
          </Link>
        ) : null}
      </div>

      {isPreviewStale && siteContent ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
          Questionnaire changed — generate again to refresh this preview.
        </div>
      ) : null}

      <div className="relative flex flex-1 items-start justify-center overflow-y-auto p-4">
        <div className="relative w-full max-w-lg">
          {showGeneratedPreview ? (
            <BuilderInlineSitePreview siteContent={siteContent} />
          ) : (
            <BuilderDraftPreview draft={draft} />
          )}
          <GenerationStatusOverlay
            isGenerating={isGenerating}
            error={generationError}
            onRetry={onRetryGenerate}
          />
        </div>
      </div>
    </aside>
  );
}
