/**
 * Stable picsum.photos URLs for Phase 1 placeholder images.
 * @see https://picsum.photos/
 */
export function picsumImageUrl(seed: string, width = 1200, height = 800): string {
  const encoded = encodeURIComponent(seed);
  return `https://picsum.photos/seed/${encoded}/${width}/${height}`;
}

export function propertyHeroSeed(propertyName: string): string {
  return `hero-${slugify(propertyName)}`;
}

export function roomImageSeed(propertyName: string, roomName: string): string {
  return `room-${slugify(propertyName)}-${slugify(roomName)}`;
}

export function galleryImageSeed(
  propertyName: string,
  category: string,
  index: number,
): string {
  return `gallery-${slugify(propertyName)}-${slugify(category)}-${index}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
