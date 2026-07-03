"use client";

import type { QuestionnaireStepId } from "@/lib/types/enums";
import type { QuestionnaireDraft } from "@/lib/types/questionnaire";
import { AmenitiesStep } from "@/components/builder/steps/AmenitiesStep";
import { BookingSettingsStep } from "@/components/builder/steps/BookingSettingsStep";
import { ContactBrandingStep } from "@/components/builder/steps/ContactBrandingStep";
import { LocationStep } from "@/components/builder/steps/LocationStep";
import { PhotosStep } from "@/components/builder/steps/PhotosStep";
import { PropertyDetailsStep } from "@/components/builder/steps/PropertyDetailsStep";
import { RoomsStep } from "@/components/builder/steps/RoomsStep";

type QuestionnaireStepPanelProps = {
  activeStepId: QuestionnaireStepId;
  draft: QuestionnaireDraft;
  onChange: (updater: (current: QuestionnaireDraft) => QuestionnaireDraft) => void;
};

export function QuestionnaireStepPanel({
  activeStepId,
  draft,
  onChange,
}: QuestionnaireStepPanelProps) {
  const stepProps = { draft, onChange };

  switch (activeStepId) {
    case "property-details":
      return <PropertyDetailsStep {...stepProps} />;
    case "rooms":
      return <RoomsStep {...stepProps} />;
    case "amenities":
      return <AmenitiesStep {...stepProps} />;
    case "location":
      return <LocationStep {...stepProps} />;
    case "photos":
      return <PhotosStep {...stepProps} />;
    case "contact-branding":
      return <ContactBrandingStep {...stepProps} />;
    case "booking-settings":
      return <BookingSettingsStep {...stepProps} />;
  }
}
