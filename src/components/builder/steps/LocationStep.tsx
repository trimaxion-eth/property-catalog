"use client";

import type { StepProps } from "@/components/builder/steps/types";
import { PropertyMapPicker } from "@/components/builder/PropertyMapPicker";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";

export function LocationStep({ draft, onChange, embedded = false }: StepProps) {
  const { location } = draft;

  function updateHighlight(index: number, value: string) {
    onChange((current) => ({
      ...current,
      location: {
        ...current.location,
        nearbyHighlights: current.location.nearbyHighlights.map((item, i) =>
          i === index ? value : item,
        ),
      },
    }));
  }

  return (
    <div className={embedded ? "space-y-4" : "space-y-5"}>
      {!embedded ? (
        <div>
          <h1 className="text-xl font-semibold text-text">Location</h1>
          <p className="mt-1 text-sm text-text-muted">
            Help guests find you and discover what&apos;s nearby.
          </p>
        </div>
      ) : null}

      <FormField label="Street address" htmlFor="addressLine">
        <Input
          id="addressLine"
          value={location.addressLine}
          onChange={(e) =>
            onChange((current) => ({
              ...current,
              location: { ...current.location, addressLine: e.target.value },
            }))
          }
          placeholder="12 Caldera View Road"
        />
      </FormField>

      <div className={`grid gap-3 ${embedded ? "grid-cols-1" : "sm:grid-cols-2"}`}>
        <FormField label="City" htmlFor="city">
          <Input
            id="city"
            value={location.city}
            onChange={(e) =>
              onChange((current) => ({
                ...current,
                location: { ...current.location, city: e.target.value },
              }))
            }
          />
        </FormField>

        <FormField label="Region / state (optional)" htmlFor="region">
          <Input
            id="region"
            value={location.region ?? ""}
            onChange={(e) =>
              onChange((current) => ({
                ...current,
                location: { ...current.location, region: e.target.value },
              }))
            }
          />
        </FormField>
      </div>

      <FormField label="Country" htmlFor="country">
        <Input
          id="country"
          value={location.country}
          onChange={(e) =>
            onChange((current) => ({
              ...current,
              location: { ...current.location, country: e.target.value },
            }))
          }
        />
      </FormField>

      <PropertyMapPicker
        latitude={location.latitude}
        longitude={location.longitude}
        compact={embedded}
        onChange={(latitude, longitude) =>
          onChange((current) => ({
            ...current,
            location: { ...current.location, latitude, longitude },
          }))
        }
      />

      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-medium text-text">Nearby highlights</h2>
          <p className="text-xs text-text-muted">
            Beaches, landmarks, or experiences within easy reach.
          </p>
        </div>

        {location.nearbyHighlights.map((highlight, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={highlight}
              onChange={(e) => updateHighlight(index, e.target.value)}
              placeholder="Red Beach — 10 min walk"
            />
            {location.nearbyHighlights.length > 1 ? (
              <Button
                variant="ghost"
                className="shrink-0 text-red-600"
                onClick={() =>
                  onChange((current) => ({
                    ...current,
                    location: {
                      ...current.location,
                      nearbyHighlights: current.location.nearbyHighlights.filter(
                        (_, i) => i !== index,
                      ),
                    },
                  }))
                }
              >
                Remove
              </Button>
            ) : null}
          </div>
        ))}

        {location.nearbyHighlights.length < 10 ? (
          <Button
            variant="secondary"
            onClick={() =>
              onChange((current) => ({
                ...current,
                location: {
                  ...current.location,
                  nearbyHighlights: [...current.location.nearbyHighlights, ""],
                },
              }))
            }
          >
            Add highlight
          </Button>
        ) : null}
      </div>
    </div>
  );
}
