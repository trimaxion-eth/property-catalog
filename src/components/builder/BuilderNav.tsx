import Link from "next/link";
import { BuilderJourneyStepBar } from "@/components/builder/BuilderJourneyStepBar";
import { StaySiteLogo } from "@/components/marketing/StaySiteLogo";
import type { BuilderJourneyStepId } from "@/lib/types/enums";

type BuilderNavProps = {
  activeJourneyStep: BuilderJourneyStepId;
};

export function BuilderNav({ activeJourneyStep }: BuilderNavProps) {
  return (
    <header className="shrink-0 bg-surface">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link href="/" aria-label="StaySite home">
          <StaySiteLogo size="md" />
        </Link>
        <nav className="flex items-center gap-6 text-sm text-text-muted">
          <span className="cursor-not-allowed opacity-50" title="Available after sign-in">
            Sites
          </span>
          <span className="cursor-not-allowed opacity-50">Help</span>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700"
            aria-hidden
          >
            U
          </span>
        </nav>
      </div>
      <BuilderJourneyStepBar activeStep={activeJourneyStep} />
    </header>
  );
}
