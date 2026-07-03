"use client";

import type { QuestionnaireDraft } from "@/lib/types/questionnaire";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";

type StepProps = {
  draft: QuestionnaireDraft;
  onChange: (updater: (current: QuestionnaireDraft) => QuestionnaireDraft) => void;
};

export function ContactBrandingStep({ draft, onChange }: StepProps) {
  const { contactBranding } = draft;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-text">Contact &amp; Branding</h1>
        <p className="mt-1 text-sm text-text-muted">
          How guests reach you, and the accent color for buttons on your site.
        </p>
      </div>

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

      <FormField
        label="Brand accent color"
        htmlFor="accentColor"
        hint="Used for Book Now buttons and highlights on your generated site."
      >
        <div className="flex items-center gap-3">
          <input
            id="accentColor"
            type="color"
            value={contactBranding.accentColor}
            onChange={(e) =>
              onChange((current) => ({
                ...current,
                contactBranding: {
                  ...current.contactBranding,
                  accentColor: e.target.value,
                },
              }))
            }
            className="h-10 w-14 cursor-pointer rounded border border-border bg-surface"
          />
          <Input
            value={contactBranding.accentColor}
            onChange={(e) =>
              onChange((current) => ({
                ...current,
                contactBranding: {
                  ...current.contactBranding,
                  accentColor: e.target.value,
                },
              }))
            }
            className="font-mono"
          />
        </div>
      </FormField>
    </div>
  );
}
