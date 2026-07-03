"use client";

import { useCallback, useEffect, useState } from "react";
import { SESSION_STORAGE_KEYS } from "@/lib/constants";
import {
  createEmptyQuestionnaireDraft,
  isQuestionnaireComplete,
  isQuestionnaireStepComplete,
  parseQuestionnaireDraftSafe,
} from "@/lib/questionnaire/helpers";
import type { QuestionnaireStepId } from "@/lib/types/enums";
import type { QuestionnaireDraft } from "@/lib/types/questionnaire";

export function useQuestionnaireDraft() {
  const [draft, setDraft] = useState<QuestionnaireDraft>(
    createEmptyQuestionnaireDraft,
  );
  const [activeStepId, setActiveStepId] =
    useState<QuestionnaireStepId>("property-details");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEYS.questionnaire);
    if (raw) {
      const parsed = parseQuestionnaireDraftSafe(JSON.parse(raw));
      if (parsed.success) {
        setDraft(parsed.data);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(
      SESSION_STORAGE_KEYS.questionnaire,
      JSON.stringify(draft),
    );
  }, [draft, hydrated]);

  const updateDraft = useCallback(
    (updater: (current: QuestionnaireDraft) => QuestionnaireDraft) => {
      setDraft((current) => updater(current));
    },
    [],
  );

  const isComplete = isQuestionnaireComplete(draft);
  const isStepComplete = useCallback(
    (stepId: QuestionnaireStepId) => isQuestionnaireStepComplete(draft, stepId),
    [draft],
  );

  return {
    draft,
    setDraft,
    updateDraft,
    activeStepId,
    setActiveStepId,
    hydrated,
    isComplete,
    isStepComplete,
  };
}
