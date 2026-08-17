"use client";

import {
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPES,
} from "@/lib/constants";
import type { QuestionnaireDraft } from "@/lib/types/questionnaire";
import type { StepProps } from "@/components/builder/steps/types";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export function PropertyDetailsStep({ draft, onChange, embedded = false }: StepProps) {
  const { propertyDetails } = draft;

  return (
    <div className={embedded ? "space-y-4" : "space-y-5"}>
      {!embedded ? (
        <div>
          <h1 className="text-xl font-semibold text-text">Property Details</h1>
          <p className="mt-1 text-sm text-text-muted">
            Name your property and set the tone for your website.
          </p>
        </div>
      ) : null}

      <FormField label="Property name" htmlFor="propertyName">
        <Input
          id="propertyName"
          value={propertyDetails.propertyName}
          onChange={(e) =>
            onChange((current) => ({
              ...current,
              propertyDetails: {
                ...current.propertyDetails,
                propertyName: e.target.value,
              },
            }))
          }
          placeholder="Halcyon Boutique Hotel"
        />
      </FormField>

      <FormField label="Property type" htmlFor="propertyType">
        <Select
          id="propertyType"
          value={propertyDetails.propertyType}
          onChange={(e) =>
            onChange((current) => ({
              ...current,
              propertyDetails: {
                ...current.propertyDetails,
                propertyType: e.target.value as QuestionnaireDraft["propertyDetails"]["propertyType"],
              },
            }))
          }
        >
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {PROPERTY_TYPE_LABELS[type]}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label="Tagline"
        htmlFor="tagline"
        hint="A short line shown under your property name, e.g. “Boutique hotel in Santorini, Greece”"
      >
        <Input
          id="tagline"
          value={propertyDetails.tagline}
          onChange={(e) =>
            onChange((current) => ({
              ...current,
              propertyDetails: {
                ...current.propertyDetails,
                tagline: e.target.value,
              },
            }))
          }
          placeholder="Boutique hotel in Santorini, Greece"
        />
      </FormField>
    </div>
  );
}
