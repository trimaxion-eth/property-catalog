"use client";

import { useCallback, useRef, useState } from "react";
import { useSoftPreview } from "@/hooks/useSoftPreview";
import {
  getSectionLayoutEntry,
  renderLayoutThumbnail,
} from "@/lib/section-layouts/registry";
import type { SectionLayoutRenderProps } from "@/lib/section-layouts/types";
import type { RotatableSectionId } from "@/lib/validation/layout-preferences";

const SWIPE_THRESHOLD_PX = 48;

type RotatableSectionProps = {
  sectionId: RotatableSectionId;
  renderProps: SectionLayoutRenderProps;
};

export function RotatableSection({ sectionId, renderProps }: RotatableSectionProps) {
  const softPreview = useSoftPreview();
  const entry = getSectionLayoutEntry(sectionId);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartX = useRef<number | null>(null);

  const selectedLayoutId = softPreview.getSelectedLayoutId(sectionId);
  const layoutIndex =
    entry?.layouts.findIndex((layout) => layout.id === selectedLayoutId) ?? 0;
  const layoutCount = entry?.layouts.length ?? 0;
  const currentLayout =
    entry?.layouts[layoutIndex] ?? entry?.layouts[0];

  const handleRotate = useCallback(
    (direction: "prev" | "next") => {
      softPreview.rotateLayout(sectionId, direction);
    },
    [sectionId, softPreview],
  );

  const handlePointerDown = (clientX: number) => {
    dragStartX.current = clientX;
  };

  const handlePointerEnd = (clientX: number) => {
    if (dragStartX.current === null) return;
    const delta = clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    handleRotate(delta < 0 ? "next" : "prev");
  };

  if (!entry || !softPreview.isSectionRotatable(sectionId)) {
    return <>{entry?.render(selectedLayoutId, renderProps)}</>;
  }

  if (!softPreview.showLayoutControls) {
    return <>{entry.render(selectedLayoutId, renderProps)}</>;
  }

  return (
    <div
      className="soft-preview-section group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={(event) => handlePointerDown(event.touches[0]?.clientX ?? 0)}
      onTouchEnd={(event) =>
        handlePointerEnd(event.changedTouches[0]?.clientX ?? 0)
      }
      onMouseDown={(event) => handlePointerDown(event.clientX)}
      onMouseUp={(event) => handlePointerEnd(event.clientX)}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-lg ring-2 ring-brand-400/0 transition group-hover:ring-brand-400/40"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full bg-brand-600/90 px-2 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-white opacity-0 shadow-sm transition group-hover:opacity-100"
        aria-hidden
      >
        <LayoutRotateIcon />
        <span>Layouts</span>
      </div>

      {isHovered ? (
        <>
          <button
            type="button"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/70 bg-white/90 p-2 text-text shadow-md transition hover:bg-white"
            aria-label={`Previous ${entry.sectionLabel} layout`}
            onClick={() => handleRotate("prev")}
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/70 bg-white/90 p-2 text-text shadow-md transition hover:bg-white"
            aria-label={`Next ${entry.sectionLabel} layout`}
            onClick={() => handleRotate("next")}
          >
            <ChevronIcon direction="right" />
          </button>
        </>
      ) : null}

      <div className="relative z-0">{entry.render(selectedLayoutId, renderProps)}</div>

      <div className="border-t border-brand-200/60 bg-brand-50/80 px-3 py-2">
        <p className="text-center text-[0.65rem] font-medium text-brand-800">
          {entry.sectionLabel} — Layout {layoutIndex + 1} of {layoutCount}
          {currentLayout ? ` · ${currentLayout.name}` : ""}
        </p>

        <div
          className="mt-2 flex justify-center gap-2"
          role="tablist"
          aria-label={`${entry.sectionLabel} layout options`}
        >
          {entry.layouts.map((layout) => {
            const isSelected = layout.id === selectedLayoutId;
            return (
              <button
                key={layout.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`${layout.name} layout`}
                title={layout.name}
                className={`h-10 w-14 overflow-hidden rounded-md border-2 p-0.5 transition ${
                  isSelected
                    ? "border-brand-600 bg-white shadow-sm"
                    : "border-transparent bg-white/60 hover:border-brand-300"
                }`}
                onClick={() => softPreview.selectLayout(sectionId, layout.id)}
              >
                {renderLayoutThumbnail(sectionId, layout.id)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={direction === "left" ? "" : "rotate-180"}
    >
      <path
        d="M10 3L5 8L10 13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LayoutRotateIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M10 6A4 4 0 1 1 6.5 2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M6.5 1V3.5H9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
