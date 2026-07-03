import { QUESTIONNAIRE_STEPS } from "@/lib/constants";
import { ValidationError } from "@/lib/errors";
import type { QuestionnaireStepId } from "@/lib/types/enums";
import type {
  QuestionnaireAnswers,
  QuestionnaireDraft,
} from "@/lib/types/questionnaire";
import {
  amenitiesStepSchema,
  bookingSettingsSchema,
  contactBrandingSchema,
  locationStepSchema,
  photosStepSchema,
  propertyDetailsSchema,
  questionnaireAnswersSchema,
  questionnaireDraftSchema,
  roomsStepSchema,
} from "@/lib/validation/questionnaire";

function newRoomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `room-${Date.now()}`;
}

export function createRoomEntry(): QuestionnaireDraft["rooms"]["rooms"][number] {
  return { id: newRoomId(), name: "" };
}

export function createEmptyQuestionnaireDraft(): QuestionnaireDraft {
  return {
    propertyDetails: {
      propertyName: "",
      propertyType: "boutique_hotel",
      tagline: "",
    },
    rooms: {
      currency: "EUR",
      rooms: [
        createRoomEntry(),
      ],
    },
    amenities: {
      selectedAmenities: [],
      customAmenities: "",
    },
    location: {
      addressLine: "",
      city: "",
      region: "",
      country: "",
      latitude: 0,
      longitude: 0,
      nearbyHighlights: [""],
    },
    photos: {
      placeholdersConfirmed: false,
    },
    contactBranding: {
      email: "",
      phone: "",
      accentColor: "#2563eb",
    },
    bookingSettings: {
      channelType: "url",
      channelTarget: "",
    },
  };
}

const stepSchemas: Record<
  QuestionnaireStepId,
  { safeParse: (value: unknown) => { success: boolean } }
> = {
  "property-details": propertyDetailsSchema,
  rooms: roomsStepSchema,
  amenities: amenitiesStepSchema,
  location: locationStepSchema,
  photos: photosStepSchema,
  "contact-branding": contactBrandingSchema,
  "booking-settings": bookingSettingsSchema,
};

export function getQuestionnaireStepValue(
  answers: QuestionnaireDraft,
  stepId: QuestionnaireStepId,
): unknown {
  switch (stepId) {
    case "property-details":
      return answers.propertyDetails;
    case "rooms":
      return answers.rooms;
    case "amenities":
      return answers.amenities;
    case "location":
      return answers.location;
    case "photos":
      return answers.photos.placeholdersConfirmed
        ? { placeholdersConfirmed: true as const }
        : answers.photos;
    case "contact-branding":
      return answers.contactBranding;
    case "booking-settings":
      return answers.bookingSettings;
  }
}

export function isQuestionnaireStepComplete(
  answers: QuestionnaireDraft,
  stepId: QuestionnaireStepId,
): boolean {
  const schema = stepSchemas[stepId];
  const value = getQuestionnaireStepValue(answers, stepId);
  return schema.safeParse(value).success;
}

export function isQuestionnaireComplete(answers: QuestionnaireDraft): boolean {
  return QUESTIONNAIRE_STEPS.every((step) =>
    isQuestionnaireStepComplete(answers, step.id),
  );
}

export function toQuestionnaireAnswers(
  draft: QuestionnaireDraft,
): QuestionnaireAnswers {
  if (!isQuestionnaireComplete(draft)) {
    throw new ValidationError("Questionnaire is incomplete");
  }
  return questionnaireAnswersSchema.parse({
    ...draft,
    photos: { placeholdersConfirmed: true as const },
  });
}

export function parseQuestionnaireDraftSafe(value: unknown) {
  return questionnaireDraftSchema.safeParse(value);
}

export function parseQuestionnaireAnswers(value: unknown): QuestionnaireAnswers {
  return questionnaireAnswersSchema.parse(value);
}

export function parseQuestionnaireAnswersSafe(value: unknown) {
  return questionnaireAnswersSchema.safeParse(value);
}
