const DEFAULT_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const DEFAULT_FALLBACK_TILE_URL =
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

const DEFAULT_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
  '&copy; <a href="https://carto.com/attributions">CARTO</a>';
const DEFAULT_FALLBACK_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export function getRasterTileLayerConfig(): {
  url: string;
  attribution: string;
  fallbackUrl: string;
  fallbackAttribution: string;
} {
  const url = process.env.NEXT_PUBLIC_MAP_TILE_URL?.trim();
  const attribution = process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION?.trim();
  const fallbackUrl = process.env.NEXT_PUBLIC_MAP_FALLBACK_TILE_URL?.trim();
  const fallbackAttribution =
    process.env.NEXT_PUBLIC_MAP_FALLBACK_TILE_ATTRIBUTION?.trim();

  if (url) {
    return {
      url,
      attribution: attribution ?? DEFAULT_ATTRIBUTION,
      fallbackUrl: fallbackUrl || DEFAULT_FALLBACK_TILE_URL,
      fallbackAttribution:
        fallbackAttribution ?? DEFAULT_FALLBACK_ATTRIBUTION,
    };
  }

  return {
    url: DEFAULT_TILE_URL,
    attribution: DEFAULT_ATTRIBUTION,
    fallbackUrl: fallbackUrl || DEFAULT_FALLBACK_TILE_URL,
    fallbackAttribution: fallbackAttribution ?? DEFAULT_FALLBACK_ATTRIBUTION,
  };
}
