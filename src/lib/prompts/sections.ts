import type { QuestionnaireAnswers } from "@/lib/types/questionnaire";
import { buildPropertyContext } from "@/lib/prompts/build-context";

export function buildHomePrompt(answers: QuestionnaireAnswers): string {
  return `Write homepage hero and introduction copy for this accommodation website.

${buildPropertyContext(answers)}

Return JSON with keys:
- heroHeadline (max 10 words, evocative)
- heroSubheadline (location-led subheading)
- introTitle (section heading above room highlights)
- introBody (2 short paragraphs as a single string, use \\n\\n between paragraphs)`;
}

export function buildRoomPrompt(
  answers: QuestionnaireAnswers,
  roomId: string,
): string {
  const room = answers.rooms.rooms.find((entry) => entry.id === roomId);
  if (!room) {
    throw new Error(`Room not found: ${roomId}`);
  }

  return `Write room page copy for "${room.name}" at ${answers.propertyDetails.propertyName}.

${buildPropertyContext(answers)}

Focus on this room:
- Name: ${room.name}
${room.capacity ? `- Capacity: ${room.capacity} guests` : ""}
${room.basePrice != null ? `- Price: ${answers.rooms.currency} ${room.basePrice}/night` : ""}
${room.notes?.trim() ? `- Owner notes: ${room.notes.trim()}` : ""}

Return JSON with keys:
- description (2 paragraphs as one string, separated by \\n\\n)
- amenities (array of 3-6 short room-specific amenity labels)
- imageAlt (accessible alt text for the room photo)`;
}

export function buildAmenitiesPrompt(answers: QuestionnaireAnswers): string {
  return `Write an amenities section for this accommodation website.

${buildPropertyContext(answers)}

Return JSON with keys:
- headline (section title)
- items (array of { name, description? } for each major amenity; description is one sentence optional)`;
}

export function buildLocationPrompt(answers: QuestionnaireAnswers): string {
  return `Write a location page introduction for this accommodation website.

${buildPropertyContext(answers)}

Return JSON with keys:
- headline
- body (2 short paragraphs, separated by \\n\\n)
- nearbyHighlights (array of { title, description } expanding the owner's highlight list)`;
}

export function buildMetaPrompt(answers: QuestionnaireAnswers): string {
  return `Write SEO metadata for this accommodation website.

${buildPropertyContext(answers)}

Return JSON with keys:
- title (max 60 characters, include property name and location)
- description (max 155 characters, compelling for search results)`;
}

export function buildContactPrompt(answers: QuestionnaireAnswers): string {
  return `Write a contact page introduction and primary booking CTA label.

${buildPropertyContext(answers)}

Return JSON with keys:
- headline
- body (warm invitation to get in touch or book; 1-2 short paragraphs separated by \\n\\n)
- ctaLabel (short button label, e.g. "Book Your Stay")`;
}
