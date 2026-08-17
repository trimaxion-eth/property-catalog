"use client";

import { AMENITY_OPTIONS } from "@/lib/constants";
import type { StepProps } from "@/components/builder/steps/types";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/Textarea";

export function AmenitiesStep({ draft, onChange, embedded = false }: StepProps) {
  const { amenities } = draft;

  function toggleAmenity(name: string) {
    onChange((current) => {
      const selected = new Set(current.amenities.selectedAmenities);
      if (selected.has(name)) {
        selected.delete(name);
      } else {
        selected.add(name);
      }
      return {
        ...current,
        amenities: {
          ...current.amenities,
          selectedAmenities: Array.from(selected),
        },
      };
    });
  }

  return (
    <div className={embedded ? "space-y-4" : "space-y-5"}>
      {!embedded ? (
        <div>
          <h1 className="text-xl font-semibold text-text">Amenities &amp; Services</h1>
          <p className="mt-1 text-sm text-text-muted">
            Select everything you offer — we&apos;ll weave it into your site copy.
          </p>
        </div>
      ) : null}

      <div className={`grid gap-2 ${embedded ? "grid-cols-1" : "sm:grid-cols-2"}`}>
        {AMENITY_OPTIONS.map((amenity) => {
          const checked = amenities.selectedAmenities.includes(amenity);
          return (
            <label
              key={amenity}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                checked
                  ? "border-brand-300 bg-brand-50 text-brand-900"
                  : "border-border hover:bg-surface-muted"
              }`}
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-500"
                checked={checked}
                onChange={() => toggleAmenity(amenity)}
              />
              <span>{amenity}</span>
            </label>
          );
        })}
      </div>

      <FormField
        label="Additional amenities (optional)"
        htmlFor="customAmenities"
        hint="Comma-separated or free text — e.g. wine cellar, cooking classes"
      >
        <Textarea
          id="customAmenities"
          rows={3}
          value={amenities.customAmenities ?? ""}
          onChange={(e) =>
            onChange((current) => ({
              ...current,
              amenities: {
                ...current.amenities,
                customAmenities: e.target.value,
              },
            }))
          }
        />
      </FormField>
    </div>
  );
}
