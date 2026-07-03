"use client";

import { MAX_ROOMS, MIN_ROOMS, SUPPORTED_CURRENCIES } from "@/lib/constants";
import { createRoomEntry } from "@/lib/questionnaire/helpers";
import type { QuestionnaireDraft } from "@/lib/types/questionnaire";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

type StepProps = {
  draft: QuestionnaireDraft;
  onChange: (updater: (current: QuestionnaireDraft) => QuestionnaireDraft) => void;
};

export function RoomsStep({ draft, onChange }: StepProps) {
  const { rooms } = draft;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-text">Rooms &amp; Accommodation</h1>
        <p className="mt-1 text-sm text-text-muted">
          Add up to {MAX_ROOMS} room types. Price is optional.
        </p>
      </div>

      <FormField label="Currency" htmlFor="currency">
        <Select
          id="currency"
          value={rooms.currency}
          onChange={(e) =>
            onChange((current) => ({
              ...current,
              rooms: {
                ...current.rooms,
                currency: e.target.value as QuestionnaireDraft["rooms"]["currency"],
              },
            }))
          }
        >
          {SUPPORTED_CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
      </FormField>

      <div className="space-y-4">
        {rooms.rooms.map((room, index) => (
          <div
            key={room.id}
            className="space-y-3 rounded-card border border-border bg-surface-muted/50 p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">Room {index + 1}</h2>
              {rooms.rooms.length > MIN_ROOMS ? (
                <Button
                  variant="ghost"
                  className="px-2 py-1 text-xs text-red-600"
                  onClick={() =>
                    onChange((current) => ({
                      ...current,
                      rooms: {
                        ...current.rooms,
                        rooms: current.rooms.rooms.filter((r) => r.id !== room.id),
                      },
                    }))
                  }
                >
                  Remove
                </Button>
              ) : null}
            </div>

            <FormField label="Room name" htmlFor={`room-name-${room.id}`}>
              <Input
                id={`room-name-${room.id}`}
                value={room.name}
                onChange={(e) =>
                  onChange((current) => ({
                    ...current,
                    rooms: {
                      ...current.rooms,
                      rooms: current.rooms.rooms.map((r) =>
                        r.id === room.id ? { ...r, name: e.target.value } : r,
                      ),
                    },
                  }))
                }
                placeholder="Deluxe Sea View Suite"
              />
            </FormField>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Capacity (guests)" htmlFor={`room-capacity-${room.id}`}>
                <Input
                  id={`room-capacity-${room.id}`}
                  type="number"
                  min={1}
                  max={20}
                  value={room.capacity ?? ""}
                  onChange={(e) =>
                    onChange((current) => ({
                      ...current,
                      rooms: {
                        ...current.rooms,
                        rooms: current.rooms.rooms.map((r) =>
                          r.id === room.id
                            ? {
                                ...r,
                                capacity: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              }
                            : r,
                        ),
                      },
                    }))
                  }
                  placeholder="2"
                />
              </FormField>

              <FormField
                label={`Price per night (${rooms.currency})`}
                htmlFor={`room-price-${room.id}`}
              >
                <Input
                  id={`room-price-${room.id}`}
                  type="number"
                  min={0}
                  step="0.01"
                  value={room.basePrice ?? ""}
                  onChange={(e) =>
                    onChange((current) => ({
                      ...current,
                      rooms: {
                        ...current.rooms,
                        rooms: current.rooms.rooms.map((r) =>
                          r.id === room.id
                            ? {
                                ...r,
                                basePrice: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              }
                            : r,
                        ),
                      },
                    }))
                  }
                  placeholder="Optional"
                />
              </FormField>
            </div>

            <FormField label="Notes for AI (optional)" htmlFor={`room-notes-${room.id}`}>
              <Textarea
                id={`room-notes-${room.id}`}
                rows={2}
                value={room.notes ?? ""}
                onChange={(e) =>
                  onChange((current) => ({
                    ...current,
                    rooms: {
                      ...current.rooms,
                      rooms: current.rooms.rooms.map((r) =>
                        r.id === room.id ? { ...r, notes: e.target.value } : r,
                      ),
                    },
                  }))
                }
                placeholder="Private balcony, king bed, sea view…"
              />
            </FormField>
          </div>
        ))}
      </div>

      {rooms.rooms.length < MAX_ROOMS ? (
        <Button
          variant="secondary"
          onClick={() =>
            onChange((current) => ({
              ...current,
              rooms: {
                ...current.rooms,
                rooms: [...current.rooms.rooms, createRoomEntry()],
              },
            }))
          }
        >
          Add another room
        </Button>
      ) : null}
    </div>
  );
}
