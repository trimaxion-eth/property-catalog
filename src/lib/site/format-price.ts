import type { CurrencyCode } from "@/lib/types/enums";
import type { SiteRoom } from "@/lib/types/site-content";

export function formatRoomPrice(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getLowestNightlyPrice(
  rooms: SiteRoom[],
): { amount: number; currency: CurrencyCode } | null {
  const priced = rooms.filter((room) => room.price);
  if (!priced.length) return null;

  const lowest = priced.reduce((min, room) =>
    room.price!.amount < min.amount ? room.price! : min,
  priced[0].price!);

  return lowest;
}

export function formatFromNightlyPrice(rooms: SiteRoom[]): string | null {
  const lowest = getLowestNightlyPrice(rooms);
  if (!lowest) return null;
  return `from ${formatRoomPrice(lowest.amount, lowest.currency)} / night`;
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
