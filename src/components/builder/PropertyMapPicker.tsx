"use client";

import { useEffect, useRef } from "react";
import { getRasterTileLayerConfig } from "@/lib/map/tileLayerConfig";

type PropertyMapPickerProps = {
  latitude: number;
  longitude: number;
  compact?: boolean;
  onChange: (latitude: number, longitude: number) => void;
};

const DEFAULT_CENTER = { lat: 48.8566, lng: 2.3522 };
const DEFAULT_ZOOM = 5;
const PIN_ZOOM = 14;

function hasValidCoordinates(latitude: number, longitude: number): boolean {
  return latitude !== 0 || longitude !== 0;
}

export function PropertyMapPicker({
  latitude,
  longitude,
  compact = false,
  onChange,
}: PropertyMapPickerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return undefined;

    let cancelled = false;

    void (async () => {
      const raw = await import("leaflet");
      const L = ((raw as { default?: unknown }).default ?? raw) as typeof import("leaflet");
      if (cancelled || !hostRef.current) return;

      const tileCfg = getRasterTileLayerConfig();
      const center = hasValidCoordinates(latitude, longitude)
        ? { lat: latitude, lng: longitude }
        : DEFAULT_CENTER;
      const zoom = hasValidCoordinates(latitude, longitude) ? PIN_ZOOM : DEFAULT_ZOOM;

      const map = L.map(el, {
        zoomControl: true,
        attributionControl: true,
      }).setView(center, zoom);

      L.tileLayer(tileCfg.url, { attribution: tileCfg.attribution }).addTo(map);

      if (hasValidCoordinates(latitude, longitude)) {
        const marker = L.marker(center, { draggable: true }).addTo(map);
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          onChangeRef.current(pos.lat, pos.lng);
        });
        markerRef.current = marker;
      }

      map.on("click", (event) => {
        const { lat, lng } = event.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng(event.latlng);
        } else {
          const marker = L.marker(event.latlng, { draggable: true }).addTo(map);
          marker.on("dragend", () => {
            const pos = marker.getLatLng();
            onChangeRef.current(pos.lat, pos.lng);
          });
          markerRef.current = marker;
        }
        onChangeRef.current(lat, lng);
      });

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map init once
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !hasValidCoordinates(latitude, longitude)) return;

    const next = { lat: latitude, lng: longitude };
    markerRef.current?.setLatLng(next);
    map.setView(next, Math.max(map.getZoom(), PIN_ZOOM));
  }, [latitude, longitude]);

  return (
    <div className="space-y-2">
      <div
        className={`w-full overflow-hidden rounded-card border border-border ${
          compact ? "h-48" : "h-64"
        }`}
      >
        <div ref={hostRef} className="h-full w-full" />
      </div>
      <p className="text-xs text-text-muted">
        Click the map to place your property pin, or drag the marker to adjust.
        {hasValidCoordinates(latitude, longitude)
          ? ` (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`
          : " Pin not set yet."}
      </p>
    </div>
  );
}
