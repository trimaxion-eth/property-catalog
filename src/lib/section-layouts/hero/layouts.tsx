"use client";

import { useSiteContent } from "@/hooks/site-content-context";
import { formatFromNightlyPrice } from "@/lib/site/format-price";
import { BookNowButton } from "@/components/site/BookNowButton";
import { SiteImage } from "@/components/site/SiteImage";

function HeroCopy() {
  const siteContent = useSiteContent();
  const { home, rooms, branding } = siteContent;
  const fromPrice = formatFromNightlyPrice(rooms);

  return (
    <>
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
    </>
  );
}

/** Full-bleed image with bottom-aligned content — default v1 template */
export function HeroFullBleedBottom() {
  const siteContent = useSiteContent();
  const { home } = siteContent;

  return (
    <section className="site-hero relative min-h-[70vh]">
      <div className="absolute inset-0">
        <SiteImage image={home.heroImage} priority sizes="100vw" />
        <div className="site-hero-overlay absolute inset-0" />
      </div>
      <div className="site-hero-content relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 @sm:px-6">
        <HeroCopy />
      </div>
    </section>
  );
}

/** Centered headline over a stronger overlay */
export function HeroCenteredOverlay() {
  const siteContent = useSiteContent();
  const { home } = siteContent;

  return (
    <section className="site-hero relative min-h-[70vh]">
      <div className="absolute inset-0">
        <SiteImage image={home.heroImage} priority sizes="100vw" />
        <div className="site-hero-overlay absolute inset-0" />
      </div>
      <div className="site-hero-content relative mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center @sm:px-6">
        <HeroCopy />
      </div>
    </section>
  );
}

/** Split layout — content panel left, image right */
export function HeroSplitLeft() {
  const siteContent = useSiteContent();
  const { home, branding } = siteContent;

  return (
    <section className="site-hero relative min-h-[70vh] @md:grid @md:min-h-[72vh] @md:grid-cols-2">
      <div className="relative flex min-h-[40vh] flex-col justify-center bg-text px-6 py-12 @md:min-h-0 @md:px-10">
        <div className="text-white">
          <p className="text-sm font-medium uppercase tracking-widest text-white/70">
            {branding.tagline}
          </p>
          <h1 className="site-hero-title font-display mt-3 text-3xl font-semibold @sm:text-4xl">
            {home.heroHeadline}
          </h1>
          <p className="mt-4 text-base text-white/85">{home.heroSubheadline}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <BookNowButton siteContent={siteContent} size="lg" />
          </div>
        </div>
      </div>
      <div className="relative min-h-[40vh] @md:min-h-0">
        <SiteImage image={home.heroImage} priority sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
    </section>
  );
}

/** Minimal hero for thumbnail previews */
export function HeroThumbnailPreview({ variant }: { variant: "bottom" | "center" | "split" }) {
  if (variant === "split") {
    return (
      <div className="flex h-full w-full overflow-hidden rounded-sm">
        <div className="w-2/5 bg-slate-800" />
        <div className="flex-1 bg-slate-400" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-sm bg-slate-400">
      <div className="absolute inset-0 bg-black/30" />
      <div
        className={`absolute left-1 right-1 rounded-sm bg-white/80 ${
          variant === "center" ? "top-1/2 h-2 -translate-y-1/2" : "bottom-1 h-2"
        }`}
      />
    </div>
  );
}
