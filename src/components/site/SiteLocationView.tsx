"use client";

import { useSiteContent } from "@/hooks/site-content-context";
import { splitParagraphs } from "@/lib/site/format-price";
import { SitePropertyMap } from "@/components/site/SitePropertyMap";

export function SiteLocationView() {
  const siteContent = useSiteContent();
  const { location, contact } = siteContent;

  const addressParts = [
    location.addressLine,
    location.city,
    location.region,
    location.country,
  ].filter(Boolean);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 @sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-text">{location.headline}</h1>
      <div className="mt-4 max-w-3xl space-y-4 text-text-muted">
        {splitParagraphs(location.body).map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10 grid gap-8 @lg:grid-cols-2">
        <SitePropertyMap
          latitude={location.latitude}
          longitude={location.longitude}
        />
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text">
            Address
          </h2>
          <p className="mt-3 text-text-muted">{addressParts.join(", ")}</p>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-text">
            Nearby highlights
          </h2>
          <ul className="mt-4 space-y-4">
            {location.nearbyHighlights.map((highlight) => (
              <li key={highlight.title} className="rounded-card border border-border p-4">
                <h3 className="font-medium text-text">{highlight.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{highlight.description}</p>
              </li>
            ))}
          </ul>

          {contact.phone ? (
            <p className="mt-8 text-sm text-text-muted">
              Questions about getting here? Call {contact.phone}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
