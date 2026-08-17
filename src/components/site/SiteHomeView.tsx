"use client";

import Link from "next/link";
import { useSiteContent } from "@/hooks/site-content-context";
import { siteStyleLinkClass } from "@/lib/site/apply-site-style";
import { formatRoomPrice, splitParagraphs } from "@/lib/site/format-price";
import { previewPagePath } from "@/lib/site/preview-path";
import { SiteHeroSection } from "@/components/site/SiteHeroSection";
import { SiteImage } from "@/components/site/SiteImage";

export function SiteHomeView() {
  const siteContent = useSiteContent();
  const { home, rooms, amenities } = siteContent;
  const highlightRooms = rooms.slice(0, 3);
  const linkClass = siteStyleLinkClass(siteContent);

  return (
    <>
      <SiteHeroSection />

      <section className="site-section mx-auto max-w-6xl px-4 @sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-text">{home.introTitle}</h2>
        <div className="mt-6 max-w-3xl space-y-4 text-text-muted">
          {splitParagraphs(home.introBody).map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="site-section site-surface-muted-bg">
        <div className="mx-auto max-w-6xl px-4 @sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-text">
              Elegant rooms. Unforgettable stays.
            </h2>
            {rooms.length > 3 ? (
              <Link
                href={previewPagePath(siteContent.id, "/rooms")}
                className={`text-sm font-medium ${linkClass}`}
              >
                View all rooms
              </Link>
            ) : null}
          </div>

          <div className="mt-10 grid gap-6 @md:grid-cols-2 @lg:grid-cols-3">
            {highlightRooms.map((room) => (
              <article key={room.id} className="site-card">
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

      <section className="site-section mx-auto max-w-6xl px-4 @sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-text">{amenities.headline}</h2>
        <div className="mt-8 grid gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
          {amenities.items.map((item) => (
            <div key={item.name} className="site-card-muted p-5">
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
