"use client";

import {
  BOOKING_CHANNEL_LABELS,
  BOOKING_CHANNEL_TYPES,
} from "@/lib/constants";
import type { BookingChannelType } from "@/lib/types/enums";
import type { StepProps } from "@/components/builder/steps/types";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const channelPlaceholders: Record<BookingChannelType, string> = {
  url: "https://booking.com/hotel/your-property",
  email: "reservations@yourhotel.com",
  whatsapp: "+30 2286 000000",
};

const channelLabels: Record<BookingChannelType, string> = {
  url: "Booking URL",
  email: "Booking email",
  whatsapp: "WhatsApp number",
};

export function BookingSettingsStep({ draft, onChange, embedded = false }: StepProps) {
  const { bookingSettings } = draft;

  return (
    <div className={embedded ? "space-y-4" : "space-y-5"}>
      {!embedded ? (
        <div>
          <h1 className="text-xl font-semibold text-text">Booking Settings</h1>
          <p className="mt-1 text-sm text-text-muted">
            Every &quot;Book Now&quot; button on your site will use this single channel.
          </p>
        </div>
      ) : null}

      <FormField label="Booking channel" htmlFor="channelType">
        <Select
          id="channelType"
          value={bookingSettings.channelType}
          onChange={(e) =>
            onChange((current) => ({
              ...current,
              bookingSettings: {
                ...current.bookingSettings,
                channelType: e.target.value as BookingChannelType,
              },
            }))
          }
        >
          {BOOKING_CHANNEL_TYPES.map((type) => (
            <option key={type} value={type}>
              {BOOKING_CHANNEL_LABELS[type]}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label={channelLabels[bookingSettings.channelType]}
        htmlFor="channelTarget"
      >
        <Input
          id="channelTarget"
          value={bookingSettings.channelTarget}
          onChange={(e) =>
            onChange((current) => ({
              ...current,
              bookingSettings: {
                ...current.bookingSettings,
                channelTarget: e.target.value,
              },
            }))
          }
          placeholder={channelPlaceholders[bookingSettings.channelType]}
        />
      </FormField>
    </div>
  );
}
