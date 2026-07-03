import { z } from "zod";
import {
  BOOKING_CHANNEL_TYPES,
  IMAGE_CATEGORIES,
  PROPERTY_TYPES,
  SUPPORTED_CURRENCIES,
} from "@/lib/constants";

function asEnumTuple<T extends string>(
  values: readonly T[],
): [T, ...T[]] {
  if (values.length === 0) {
    throw new Error("Enum values must not be empty");
  }
  return values as [T, ...T[]];
}

export const propertyTypeSchema = z.enum(asEnumTuple(PROPERTY_TYPES));
export const bookingChannelTypeSchema = z.enum(asEnumTuple(BOOKING_CHANNEL_TYPES));
export const currencyCodeSchema = z.enum(asEnumTuple(SUPPORTED_CURRENCIES));
export const imageCategorySchema = z.enum(asEnumTuple(IMAGE_CATEGORIES));
