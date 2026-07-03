"use client";

import Link from "next/link";
import { useSiteContent } from "@/hooks/site-content-context";
import { formatFromNightlyPrice, formatRoomPrice, splitParagraphs } from "@/lib/site/format-price";
import { previewPagePath } from "@/lib/site/preview-path";
import { BookNowButton } from "@/components/site/BookNowButton";
import { SiteImage } from "@/components/site/SiteImage";

export function SiteHomeView() {
  const siteContent = useSiteContent();
  const { home, rooms, amenities, branding } = siteContent;
  const highlightRooms = rooms.slice(0, 3);
  const fromPrice = formatFromNightlyPrice(rooms);

  return (
    <>
      <section className="site-hero relative min-h-[70vh]">
        <div className="absolute inset-0">
          <SiteImage image={home.heroImage} priority sizes="100vw" />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        <div className="site-hero-content relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 @sm:px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-white/80">
            {branding.tagline}
          </p>
          <h1 className="site-hero-title font-display mt-3 max-w-3xl text-4xl font-semibold text-white @sm:text-5xl">
            {home.heroHeadline}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">{home.heroSubheadline}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <BookNowButton siteContent={siteContent} size="lg" />
            {fromPrice ? (
              <span className="text-sm font-medium text-white/90">{fromPrice}</span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="site-section mx-auto max-w-6xl px-4 py-16 @sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-text">{home.introTitle}</h2>
        <div className="mt-6 max-w-3xl space-y-4 text-text-muted">
          {splitParagraphs(home.introBody).map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="site-section bg-surface-muted py-16">
        <div className="mx-auto max-w-6xl px-4 @sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-text">
              Elegant rooms. Unforgettable stays.
            </h2>
            {rooms.length > 3 ? (
              <Link
                href={previewPagePath(siteContent.id, "/rooms")}
                className="text-sm font-medium"
                style={{ color: "var(--site-accent)" }}
              >
                View all rooms
              </Link>
            ) : null}
          </div>

          <div className="mt-10 grid gap-6 @md:grid-cols-2 @lg:grid-cols-3">
            {highlightRooms.map((room) => (
              <article
                key={room.id}
                className="overflow-hidden rounded-card border border-border bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3]">
                  <SiteImage image={room.image} sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold text-text">{room.name}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-text-muted">
                    {splitParagraphs(room.description)[0]}
                  </p>
                  {room.price ? (
                    <p className="mt-3 text-sm font-medium text-text">
                      {formatRoomPrice(room.price.amount, room.price.currency)} / night
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section mx-auto max-w-6xl px-4 py-16 @sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-text">{amenities.headline}</h2>
        <div className="mt-8 grid gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
          {amenities.items.map((item) => (
            <div
              key={item.name}
              className="rounded-card border border-border bg-surface-muted/60 p-5"
            >
              <h3 className="font-medium text-text">{item.name}</h3>
              {item.description ? (
                <p className="mt-2 text-sm text-text-muted">{item.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
