"use client";

import { useEffect, useRef } from "react";
import { getRasterTileLayerConfig } from "@/lib/map/tileLayerConfig";

type SitePropertyMapProps = {
  latitude: number;
  longitude: number;
  className?: string;
};

export function SitePropertyMap({
  latitude,
  longitude,
  className = "h-80",
}: SitePropertyMapProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return undefined;

    let cancelled = false;

    void (async () => {
      const raw = await import("leaflet");
      const L = ((raw as { default?: unknown }).default ?? raw) as typeof import("leaflet");
      if (cancelled || !hostRef.current) return;

      const tileCfg = getRasterTileLayerConfig();
      const center = { lat: latitude, lng: longitude };

      const map = L.map(el, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
      }).setView(center, 14);

      L.tileLayer(tileCfg.url, { attribution: tileCfg.attribution }).addTo(map);
      L.marker(center).addTo(map);
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude]);

  return (
    <div
      ref={hostRef}
      className={`w-full overflow-hidden rounded-card border border-border ${className}`}
    />
  );
}
