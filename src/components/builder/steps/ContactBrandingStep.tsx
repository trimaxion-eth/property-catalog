"use client";

import type { StepProps } from "@/components/builder/steps/types";
import { STYLE_PREFERENCE_OPTIONS } from "@/lib/constants";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";

export function ContactBrandingStep({ draft, onChange, embedded = false }: StepProps) {
  const { contactBranding } = draft;
  const stylePreference = contactBranding.stylePreference ?? "auto";
  const accentColorSource = contactBranding.accentColorSource ?? "owner";

  return (
    <div className={embedded ? "space-y-4" : "space-y-5"}>
      {!embedded ? (
        <div>
          <h1 className="text-xl font-semibold text-text">Contact &amp; Branding</h1>
          <p className="mt-1 text-sm text-text-muted">
            How guests reach you. We style the rest of your site to match your property
            and brand color.
          </p>
        </div>
      ) : null}

      <FormField label="Contact email" htmlFor="contactEmail">
        <Input
          id="contactEmail"
          type="email"
          value={contactBranding.email}
          onChange={(e) =>
            onChange((current) => ({
              ...current,
              contactBranding: {
                ...current.contactBranding,
                email: e.target.value,
              },
            }))
          }
          placeholder="hello@yourhotel.com"
        />
      </FormField>

      <FormField label="Phone (optional)" htmlFor="contactPhone">
        <Input
          id="contactPhone"
          type="tel"
          value={contactBranding.phone ?? ""}
          onChange={(e) =>
            onChange((current) => ({
              ...current,
              contactBranding: {
                ...current.contactBranding,
                phone: e.target.value,
              },
            }))
          }
          placeholder="+30 2286 000000"
        />
      </FormField>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-text">
          How should your site look? <span className="font-normal text-text-muted">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {STYLE_PREFERENCE_OPTIONS.map((option) => {
            const isSelected = stylePreference === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  onChange((current) => ({
                    ...current,
                    contactBranding: {
                      ...current.contactBranding,
                      stylePreference: option.id,
                    },
                  }))
                }
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  isSelected
                    ? "border-brand-600 bg-brand-50 text-brand-800"
                    : "border-border bg-surface text-text-muted hover:border-brand-300"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <FormField
        label="Brand color"
        htmlFor="accentColor"
        hint="Used for buttons and links. We harmonize surfaces and layouts around it when you generate."
      >
        <div className="mb-3 flex items-center gap-2">
          <input
            id="suggestAccentColor"
            type="checkbox"
            checked={accentColorSource === "ai"}
            onChange={(e) =>
              onChange((current) => ({
                ...current,
                contactBranding: {
                  ...current.contactBranding,
                  accentColorSource: e.target.checked ? "ai" : "owner",
                },
              }))
            }
            className="h-4 w-4 rounded border-border text-brand-600"
          />
          <label htmlFor="suggestAccentColor" className="text-sm text-text-muted">
            Suggest a color for me at generate time
          </label>
        </div>

        <div className={`flex items-center gap-3 ${embedded ? "flex-wrap" : ""}`}>
          <input
            id="accentColor"
            type="color"
            value={contactBranding.accentColor}
            disabled={accentColorSource === "ai"}
            onChange={(e) =>
              onChange((current) => ({
                ...current,
                contactBranding: {
                  ...current.contactBranding,
                  accentColor: e.target.value,
                  accentColorSource: "owner",
                },
              }))
            }
            className="h-10 w-14 cursor-pointer rounded border border-border bg-surface disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Input
            value={contactBranding.accentColor}
            disabled={accentColorSource === "ai"}
            onChange={(e) =>
              onChange((current) => ({
                ...current,
                contactBranding: {
                  ...current.contactBranding,
                  accentColor: e.target.value,
                  accentColorSource: "owner",
                },
              }))
            }
            className="min-w-0 flex-1 font-mono disabled:opacity-50"
          />
        </div>
      </FormField>
    </div>
  );
}
