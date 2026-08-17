"use client";

import type { StepProps } from "@/components/builder/steps/types";

export function PhotosStep({ draft, onChange, embedded = false }: StepProps) {
  const { photos } = draft;

  return (
    <div className={embedded ? "space-y-4" : "space-y-5"}>
      {!embedded ? (
        <div>
          <h1 className="text-xl font-semibold text-text">Photos</h1>
          <p className="mt-1 text-sm text-text-muted">
            Phase 1 uses beautiful placeholder photos so you can preview your site
            immediately. Real uploads arrive in a later release.
          </p>
        </div>
      ) : (
        <p className="text-xs text-text-muted">
          Placeholder photos are used in Phase 1 so you can preview your site right away.
        </p>
      )}

      <div className="rounded-card border border-border bg-surface-muted/60 p-4">
        <ul className="list-disc space-y-2 pl-5 text-xs text-text-muted">
          <li>Hero and room images are generated from your property and room names</li>
          <li>Gallery sections use curated placeholder photography</li>
          <li>After publish, you&apos;ll upload your own photos</li>
        </ul>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition hover:bg-surface-muted">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-500"
          checked={photos.placeholdersConfirmed}
          onChange={(e) =>
            onChange((current) => ({
              ...current,
              photos: { placeholdersConfirmed: e.target.checked },
            }))
          }
        />
        <span className="text-sm text-text">
          I understand placeholder photos will be used for my preview site.
        </span>
      </label>
    </div>
  );
}
