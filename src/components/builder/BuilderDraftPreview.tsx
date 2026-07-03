"use client";

import Image from "next/image";
import type { QuestionnaireDraft } from "@/lib/types/questionnaire";
import { picsumImageUrl, propertyHeroSeed } from "@/lib/images/picsum";
import { PROPERTY_TYPE_LABELS } from "@/lib/constants";

type BuilderDraftPreviewProps = {
  draft: QuestionnaireDraft;
};

export function BuilderDraftPreview({ draft }: BuilderDraftPreviewProps) {
  const { propertyDetails, rooms, contactBranding } = draft;
  const hasPropertyName = propertyDetails.propertyName.trim().length > 0;
  const heroSeed = hasPropertyName
    ? propertyHeroSeed(propertyDetails.propertyName)
    : "staysite-preview";
  const heroUrl = picsumImageUrl(heroSeed, 800, 500);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="relative aspect-[16/10] w-full bg-surface-muted">
        <Image
          src={heroUrl}
          alt={
            hasPropertyName
              ? `${propertyDetails.propertyName} hero preview`
              : "Property hero placeholder"
          }
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 42vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="font-display text-lg font-semibold">
            {hasPropertyName ? propertyDetails.propertyName : "Your property name"}
          </p>
          <p className="text-sm text-white/90">
            {propertyDetails.tagline.trim() ||
              PROPERTY_TYPE_LABELS[propertyDetails.propertyType]}
          </p>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
          <span>Rooms</span>
          <span>·</span>
          <span>Gallery</span>
          <span>·</span>
          <span>Location</span>
          <span>·</span>
          <span>Contact</span>
        </div>

        {rooms.rooms.some((room) => room.name.trim()) ? (
          <ul className="space-y-2">
            {rooms.rooms
              .filter((room) => room.name.trim())
              .map((room) => (
                <li
                  key={room.id}
                  className="rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span className="font-medium text-text">{room.name}</span>
                  {room.basePrice != null ? (
                    <span className="ml-2 text-text-muted">
                      {rooms.currency} {room.basePrice}
                    </span>
                  ) : null}
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-sm text-text-muted">
            Room cards will appear here once you add room names.
          </p>
        )}

        <div
          className="inline-flex rounded-button px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: contactBranding.accentColor }}
        >
          Book Now
        </div>
      </div>
    </div>
  );
}
