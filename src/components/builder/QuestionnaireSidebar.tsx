"use client";

import { QUESTIONNAIRE_STEPS } from "@/lib/constants";
import type { QuestionnaireStepId } from "@/lib/types/enums";
import { Button } from "@/components/ui/Button";

type QuestionnaireSidebarProps = {
  activeStepId: QuestionnaireStepId;
  isStepComplete: (stepId: QuestionnaireStepId) => boolean;
  isQuestionnaireComplete: boolean;
  onStepSelect: (stepId: QuestionnaireStepId) => void;
  onGenerate: () => void;
  isGenerating: boolean;
};

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4"
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

export function QuestionnaireSidebar({
  activeStepId,
  isStepComplete,
  isQuestionnaireComplete,
  onStepSelect,
  onGenerate,
  isGenerating,
}: QuestionnaireSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-surface lg:w-72 lg:border-b-0 lg:border-r">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-text">Tell us about your property</h2>
        <p className="mt-1 text-xs text-text-muted">
          Complete each step, then generate your site.
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ol className="space-y-1">
          {QUESTIONNAIRE_STEPS.map((step, index) => {
            const complete = isStepComplete(step.id);
            const active = activeStepId === step.id;
            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => onStepSelect(step.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-brand-50 text-brand-800"
                      : "text-text hover:bg-surface-muted"
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
                  <span className="font-medium">{step.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="border-t border-border p-4">
        <Button
          className="w-full"
          disabled={!isQuestionnaireComplete || isGenerating}
          onClick={onGenerate}
        >
          {isGenerating ? "Generating…" : "Generate My Website ✨"}
        </Button>
        {!isQuestionnaireComplete ? (
          <p className="mt-2 text-center text-xs text-text-muted">
            Complete all steps to enable generation.
          </p>
        ) : null}
      </div>
    </aside>
  );
}
