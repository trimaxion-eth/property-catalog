import { PROPERTY_TYPE_LABELS } from "@/lib/constants";
import type { QuestionnaireAnswers } from "@/lib/types/questionnaire";

export function buildPropertyContext(answers: QuestionnaireAnswers): string {
  const { propertyDetails, rooms, amenities, location, contactBranding } =
    answers;

  const amenityList = [
    ...amenities.selectedAmenities,
    ...(amenities.customAmenities
      ? amenities.customAmenities
          .split(/[,;\n]/)
          .map((item) => item.trim())
          .filter(Boolean)
      : []),
  ];

  const roomLines = rooms.rooms
    .map((room) => {
      const parts = [`- ${room.name}`];
      if (room.capacity) parts.push(`sleeps ${room.capacity}`);
      if (room.basePrice != null) {
        parts.push(`${rooms.currency} ${room.basePrice}/night`);
      }
      if (room.notes?.trim()) parts.push(`notes: ${room.notes.trim()}`);
      return parts.join(" | ");
    })
    .join("\n");

  return [
    `Property: ${propertyDetails.propertyName}`,
    `Type: ${PROPERTY_TYPE_LABELS[propertyDetails.propertyType]}`,
    `Tagline: ${propertyDetails.tagline}`,
    `Location: ${location.addressLine}, ${location.city}${location.region ? `, ${location.region}` : ""}, ${location.country}`,
    `Nearby highlights provided by owner:\n${location.nearbyHighlights.map((item) => `- ${item}`).join("\n")}`,
    `Rooms:\n${roomLines}`,
    `Amenities: ${amenityList.join(", ")}`,
    `Contact email: ${contactBranding.email}`,
    contactBranding.phone ? `Contact phone: ${contactBranding.phone}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
