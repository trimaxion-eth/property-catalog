"use client";

import { useSiteContent } from "@/hooks/site-content-context";
import { formatRoomPrice, splitParagraphs } from "@/lib/site/format-price";
import { SiteImage } from "@/components/site/SiteImage";

export function SiteRoomsView() {
  const siteContent = useSiteContent();
  const { rooms } = siteContent;

  return (
    <section className="site-section mx-auto max-w-6xl px-4 @sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-text">Rooms &amp; Suites</h1>
      <p className="mt-3 max-w-2xl text-text-muted">
        Choose the stay that fits your trip. Every room is designed for comfort and calm.
      </p>

      <div className="mt-12 space-y-16">
        {rooms.map((room, index) => (
          <article
            key={room.id}
            className={`grid gap-8 @lg:grid-cols-2 @lg:items-center ${
              index % 2 === 1 ? "@lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="site-card relative aspect-[4/3]">
              <SiteImage image={room.image} sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-semibold text-text">{room.name}</h2>
              {room.price ? (
                <p className="mt-2 text-lg font-medium text-text">
                  {formatRoomPrice(room.price.amount, room.price.currency)} / night
                </p>
              ) : null}
              {room.capacity ? (
                <p className="mt-1 text-sm text-text-muted">Sleeps {room.capacity} guests</p>
              ) : null}
              <div className="mt-4 space-y-4 text-text-muted">
                {splitParagraphs(room.description).map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
              {room.amenities.length > 0 ? (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
