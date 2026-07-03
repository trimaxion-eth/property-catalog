import type { BookingChannelType } from "@/lib/types/enums";

export function resolveBookingHref(
  channelType: BookingChannelType,
  channelTarget: string,
): string {
  switch (channelType) {
    case "email":
      return `mailto:${channelTarget}`;
    case "whatsapp": {
      const digits = channelTarget.replace(/\D/g, "");
      return `https://wa.me/${digits}`;
    }
    case "url":
      return channelTarget;
  }
}
