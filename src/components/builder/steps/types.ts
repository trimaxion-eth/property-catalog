import type { QuestionnaireDraft } from "@/lib/types/questionnaire";

export type StepProps = {
  draft: QuestionnaireDraft;
  onChange: (updater: (current: QuestionnaireDraft) => QuestionnaireDraft) => void;
  embedded?: boolean;
};
