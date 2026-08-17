"use client";

import { QUESTIONNAIRE_STEPS } from "@/lib/constants";
import type { QuestionnaireStepId } from "@/lib/types/enums";
import type { QuestionnaireDraft } from "@/lib/types/questionnaire";
import { SparkleIcon } from "@/components/marketing/MarketingIcons";
import { QuestionnaireStepPanel } from "@/components/builder/QuestionnaireStepPanel";
import { Button } from "@/components/ui/Button";

type QuestionnaireSidebarProps = {
  draft: QuestionnaireDraft;
  onChange: (updater: (current: QuestionnaireDraft) => QuestionnaireDraft) => void;
  activeStepId: QuestionnaireStepId;
  isStepComplete: (stepId: QuestionnaireStepId) => boolean;
  isQuestionnaireComplete: boolean;
  onStepSelect: (stepId: QuestionnaireStepId) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generateSuccess: string | null;
};

function CheckIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${
        expanded ? "rotate-180" : ""
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function QuestionnaireSidebar({
  draft,
  onChange,
  activeStepId,
  isStepComplete,
  isQuestionnaireComplete,
  onStepSelect,
  onGenerate,
  isGenerating,
  generateSuccess,
}: QuestionnaireSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-surface lg:w-[38%] lg:max-w-md lg:border-b-0 lg:border-r xl:max-w-lg">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-text">Tell us about your property</h2>
        <p className="mt-1 text-xs text-text-muted">
          Expand each section to add your details.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ol className="divide-y divide-border">
          {QUESTIONNAIRE_STEPS.map((step, index) => {
            const complete = isStepComplete(step.id);
            const expanded = activeStepId === step.id;

            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => onStepSelect(step.id)}
                  aria-expanded={expanded}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                    expanded ? "bg-brand-50/60" : "hover:bg-surface-muted"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                      complete
                        ? "bg-brand-600 text-white"
                        : "border border-border bg-surface text-text-muted"
                    }`}
                  >
                    {complete ? <CheckIcon /> : index + 1}
                  </span>
                  <span
                    className={`min-w-0 flex-1 text-sm font-medium ${
                      expanded ? "text-brand-800" : "text-text"
                    }`}
                  >
                    {step.label}
                  </span>
                  <ChevronIcon expanded={expanded} />
                </button>

                {expanded ? (
                  <div className="border-t border-border bg-surface-muted/30 px-4 py-4">
                    <QuestionnaireStepPanel
                      activeStepId={step.id}
                      draft={draft}
                      onChange={onChange}
                      embedded
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="border-t border-border p-4">
        <Button
          className="w-full gap-2"
          disabled={!isQuestionnaireComplete || isGenerating}
          onClick={onGenerate}
        >
          <SparkleIcon className="h-4 w-4" />
          {isGenerating ? "Generating…" : "Generate My Website"}
        </Button>
        {!isQuestionnaireComplete ? (
          <p className="mt-2 text-center text-xs text-text-muted">
            Complete all sections to enable generation.
          </p>
        ) : null}
        {generateSuccess ? (
          <p
            className="mt-3 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs text-brand-800"
            role="status"
          >
            {generateSuccess}
          </p>
        ) : null}
      </div>
    </aside>
  );
}
