import { Fragment, type ComponentType } from "react";
import {
  DocumentIcon,
  PencilSquareIcon,
  RocketIcon,
  WandIcon,
} from "@/components/marketing/MarketingIcons";
import { BUILDER_JOURNEY_STEPS } from "@/lib/constants";
import type { BuilderJourneyStepId } from "@/lib/types/enums";

type IconProps = {
  className?: string;
};

const JOURNEY_STEP_ICONS: Record<
  BuilderJourneyStepId,
  ComponentType<IconProps>
> = {
  describe: DocumentIcon,
  generate: WandIcon,
  customize: PencilSquareIcon,
  publish: RocketIcon,
};

type BuilderJourneyStepBarProps = {
  activeStep: BuilderJourneyStepId;
};

export function BuilderJourneyStepBar({
  activeStep,
}: BuilderJourneyStepBarProps) {
  const activeIndex = BUILDER_JOURNEY_STEPS.findIndex(
    (step) => step.id === activeStep,
  );

  return (
    <div className="border-b border-border bg-surface-muted px-4 py-4 sm:px-6">
      <div
        className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2"
        role="list"
        aria-label="Build progress"
      >
        {BUILDER_JOURNEY_STEPS.map((step, index) => {
          const Icon = JOURNEY_STEP_ICONS[step.id];
          const isActive = step.id === activeStep;
          const isComplete = index < activeIndex;

          return (
            <Fragment key={step.id}>
              {index > 0 ? (
                <span
                  className="hidden shrink-0 self-center text-lg leading-none text-text-muted/35 sm:inline"
                  aria-hidden
                >
                  →
                </span>
              ) : null}
              <div
                className={`flex min-w-0 flex-1 items-start gap-3 ${
                  isActive ? "" : isComplete ? "opacity-90" : "opacity-70"
                }`}
                role="listitem"
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    isActive || isComplete
                      ? "bg-brand-50 text-brand-600"
                      : "bg-white text-text-muted ring-1 ring-border"
                  }`}
                  aria-hidden
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p
                    className={`text-sm font-semibold ${
                      isActive ? "text-text" : "text-text-muted"
                    }`}
                  >
                    {index + 1}. {step.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-text-muted">
                    {step.detail}
                  </p>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
