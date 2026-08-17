import { draftToSoftPreviewSiteContent } from "@/lib/preview/draft-to-site-content";
import type { QuestionnaireDraft } from "@/lib/types/questionnaire";
import type { SiteContent } from "@/lib/types/site-content";

export function resolveBuilderPreviewContent(
  draft: QuestionnaireDraft,
  previewSiteId: string,
  generatedContent: SiteContent | null,
  isPreviewStale: boolean,
): SiteContent {
  if (generatedContent && !isPreviewStale) {
    return generatedContent;
  }

  return draftToSoftPreviewSiteContent(draft, previewSiteId);
}

export function hasGeneratedPreviewContent(
  generatedContent: SiteContent | null,
  isPreviewStale: boolean,
): boolean {
  return Boolean(generatedContent && !isPreviewStale);
}
