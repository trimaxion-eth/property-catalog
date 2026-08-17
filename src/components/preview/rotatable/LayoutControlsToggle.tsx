"use client";

import { useSoftPreviewOptional } from "@/hooks/useSoftPreview";

type LayoutControlsToggleProps = {
  className?: string;
};

export function LayoutControlsToggle({ className = "" }: LayoutControlsToggleProps) {
  const softPreview = useSoftPreviewOptional();
  if (!softPreview) return null;

  const { showLayoutControls, toggleLayoutControls } = softPreview;

  return (
    <button
      type="button"
      onClick={toggleLayoutControls}
      aria-pressed={showLayoutControls}
      className={`shrink-0 rounded-button border border-border bg-white px-3 py-1.5 text-xs font-medium text-text transition hover:bg-surface-muted ${className}`}
    >
      {showLayoutControls ? "Hide layouts" : "Show layouts"}
    </button>
  );
}
