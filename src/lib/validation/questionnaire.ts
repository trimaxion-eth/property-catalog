import { z } from "zod";
import { MAX_ROOMS, MIN_ROOMS } from "@/lib/constants";
import {
  bookingChannelTypeSchema,
  currencyCodeSchema,
  propertyTypeSchema,
} from "@/lib/validation/enums";

const hexColorSchema = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Must be a valid hex color");

export const questionnaireRoomSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Room name is required"),
  capacity: z.number().int().min(1).max(20).optional(),
  basePrice: z.number().positive().optional(),
  notes: z.string().trim().max(500).optional(),
});

export const questionnaireRoomDraftSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  capacity: z.number().int().min(1).max(20).optional(),
  basePrice: z.number().positive().optional(),
  notes: z.string().trim().max(500).optional(),
});

export const propertyDetailsSchema = z.object({
  propertyName: z.string().trim().min(1, "Property name is required").max(120),
  propertyType: propertyTypeSchema,
  tagline: z.string().trim().min(1, "Tagline is required").max(160),
});

export const roomsStepSchema = z.object({
  currency: currencyCodeSchema,
  rooms: z
    .array(questionnaireRoomSchema)
    .min(MIN_ROOMS, `Add at least ${MIN_ROOMS} room`)
    .max(MAX_ROOMS, `Maximum ${MAX_ROOMS} rooms`),
});

export const roomsStepDraftSchema = z.object({
  currency: currencyCodeSchema,
  rooms: z
    .array(questionnaireRoomDraftSchema)
    .min(MIN_ROOMS)
    .max(MAX_ROOMS),
});

export const amenitiesStepSchema = z.object({
  selectedAmenities: z
    .array(z.string().trim().min(1))
    .min(1, "Select at least one amenity"),
  customAmenities: z.string().trim().max(500).optional(),
});

export const amenitiesStepDraftSchema = z.object({
  selectedAmenities: z.array(z.string()),
  customAmenities: z.string().max(500).optional(),
});

export const locationStepSchema = z
  .object({
    addressLine: z.string().trim().min(1, "Address is required").max(200),
    city: z.string().trim().min(1, "City is required").max(100),
    region: z.string().trim().max(100).optional(),
    country: z.string().trim().min(1, "Country is required").max(100),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    nearbyHighlights: z
      .array(z.string().trim().min(1))
      .min(1, "Add at least one nearby highlight")
      .max(10),
  })
  .superRefine((value, ctx) => {
    if (value.latitude === 0 && value.longitude === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Place your property on the map",
        path: ["latitude"],
      });
    }
  });

export const locationStepDraftSchema = z.object({
  addressLine: z.string().max(200),
  city: z.string().max(100),
  region: z.string().max(100).optional(),
  country: z.string().max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  nearbyHighlights: z.array(z.string()).max(10),
});

export const photosStepSchema = z.object({
  placeholdersConfirmed: z.literal(true, {
    errorMap: () => ({
      message: "Confirm placeholder photos for preview",
    }),
  }),
});

export const photosStepDraftSchema = z.object({
  placeholdersConfirmed: z.boolean(),
});

export const contactBrandingSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().max(40).optional(),
  accentColor: hexColorSchema,
  stylePreference: z.enum(["auto", "refined", "bold"]).optional(),
  accentColorSource: z.enum(["owner", "ai"]).optional(),
});

export const contactBrandingDraftSchema = z.object({
  email: z.string().max(200),
  phone: z.string().max(40).optional(),
  accentColor: hexColorSchema,
  stylePreference: z.enum(["auto", "refined", "bold"]).optional(),
  accentColorSource: z.enum(["owner", "ai"]).optional(),
});

export const bookingSettingsSchema = z
  .object({
    channelType: bookingChannelTypeSchema,
    channelTarget: z.string().trim().min(1, "Booking target is required"),
  })
  .superRefine((value, ctx) => {
    if (value.channelType === "email") {
      const emailResult = z.string().email().safeParse(value.channelTarget);
      if (!emailResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid email address",
          path: ["channelTarget"],
        });
      }
      return;
    }

    if (value.channelType === "url") {
      const urlResult = z.string().url().safeParse(value.channelTarget);
      if (!urlResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid URL (include https://)",
          path: ["channelTarget"],
        });
      }
      return;
    }

    const digits = value.channelTarget.replace(/\D/g, "");
    if (digits.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid phone number for WhatsApp",
        path: ["channelTarget"],
      });
    }
  });

export const bookingSettingsDraftSchema = z.object({
  channelType: bookingChannelTypeSchema,
  channelTarget: z.string(),
});

export const questionnaireAnswersSchema = z.object({
  propertyDetails: propertyDetailsSchema,
  rooms: roomsStepSchema,
  amenities: amenitiesStepSchema,
  location: locationStepSchema,
  photos: photosStepSchema,
  contactBranding: contactBrandingSchema,
  bookingSettings: bookingSettingsSchema,
});

export const questionnaireDraftSchema = z.object({
  propertyDetails: z.object({
    propertyName: z.string(),
    propertyType: propertyTypeSchema,
    tagline: z.string(),
  }),
  rooms: roomsStepDraftSchema,
  amenities: amenitiesStepDraftSchema,
  location: locationStepDraftSchema,
  photos: photosStepDraftSchema,
  contactBranding: contactBrandingDraftSchema,
  bookingSettings: bookingSettingsDraftSchema,
});

export type QuestionnaireRoomInput = z.infer<typeof questionnaireRoomSchema>;
export type PropertyDetailsInput = z.infer<typeof propertyDetailsSchema>;
export type RoomsStepInput = z.infer<typeof roomsStepSchema>;
export type AmenitiesStepInput = z.infer<typeof amenitiesStepSchema>;
export type LocationStepInput = z.infer<typeof locationStepSchema>;
export type PhotosStepInput = z.infer<typeof photosStepSchema>;
export type ContactBrandingInput = z.infer<typeof contactBrandingSchema>;
export type BookingSettingsInput = z.infer<typeof bookingSettingsSchema>;
export type QuestionnaireAnswers = z.infer<typeof questionnaireAnswersSchema>;
export type QuestionnaireDraft = z.infer<typeof questionnaireDraftSchema>;
