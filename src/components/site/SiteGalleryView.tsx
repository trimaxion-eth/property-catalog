"use client";

import { useSiteContent } from "@/hooks/site-content-context";
import { SiteImage } from "@/components/site/SiteImage";

export function SiteGalleryView() {
  const siteContent = useSiteContent();
  const { gallery } = siteContent;

  return (
    <section className="site-section mx-auto max-w-6xl px-4 @sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-text">{gallery.headline}</h1>
      <p className="mt-3 max-w-2xl text-text-muted">
        A glimpse of the spaces, views, and details that define your stay.
      </p>

      <div className="mt-12 space-y-14">
        {gallery.categories.map((category) => (
          <div key={category.id}>
            <h2 className="font-display text-2xl font-semibold text-text">{category.name}</h2>
            <div className="mt-6 grid gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
              {category.images.map((image) => (
                <figure
                  key={image.url}
                  className="relative aspect-[4/3] overflow-hidden rounded-card"
                >
                  <SiteImage image={image} sizes="(max-width: 768px) 100vw, 33vw" />
                  <figcaption className="sr-only">{image.alt}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
