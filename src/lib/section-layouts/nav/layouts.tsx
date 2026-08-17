"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_PAGES } from "@/lib/constants";
import { previewBasePath, previewPagePath } from "@/lib/site/preview-path";
import type { SiteContent } from "@/lib/types/site-content";
import { BookNowButton } from "@/components/site/BookNowButton";

const NAV_PAGES = SITE_PAGES.filter((page) => page.id !== "home");

type NavLayoutProps = {
  siteContent: SiteContent;
};

/** Sticky horizontal bar — default v1 template */
export function NavHorizontalSticky({ siteContent }: NavLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const basePath = previewBasePath(siteContent.id);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 @sm:px-6">
        <Link
          href={basePath}
          className="font-display text-lg font-semibold tracking-tight text-text @sm:text-xl"
        >
          {siteContent.branding.propertyName}
        </Link>

        <nav className="hidden items-center gap-6 @md:flex" aria-label="Site">
          {NAV_PAGES.map((page) => (
            <Link
              key={page.id}
              href={previewPagePath(siteContent.id, page.path)}
              className="text-xs font-medium uppercase tracking-wider text-text-muted transition hover:text-text"
            >
              {page.label}
            </Link>
          ))}
        </nav>

        <div className="hidden @md:block">
          <BookNowButton siteContent={siteContent} size="sm" />
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-button border border-border px-3 py-2 text-sm @md:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-border bg-white px-4 py-4 @md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Site">
            {NAV_PAGES.map((page) => (
              <Link
                key={page.id}
                href={previewPagePath(siteContent.id, page.path)}
                className="text-sm font-medium uppercase tracking-wide text-text"
                onClick={() => setMenuOpen(false)}
              >
                {page.label}
              </Link>
            ))}
            <BookNowButton siteContent={siteContent} size="sm" className="mt-2 w-full" />
          </nav>
        </div>
      ) : null}
    </header>
  );
}

/** Centered property name with nav row beneath */
export function NavCenteredBrand({ siteContent }: NavLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const basePath = previewBasePath(siteContent.id);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 @sm:px-6">
        <div className="flex items-center justify-between @md:justify-center">
          <Link
            href={basePath}
            className="font-display text-lg font-semibold tracking-tight text-text @md:text-center @sm:text-xl"
          >
            {siteContent.branding.propertyName}
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-button border border-border px-3 py-2 text-sm @md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
        </div>

        <div className="mt-3 hidden items-center justify-center gap-6 @md:flex">
          <nav className="flex items-center gap-5" aria-label="Site">
            {NAV_PAGES.map((page) => (
              <Link
                key={page.id}
                href={previewPagePath(siteContent.id, page.path)}
                className="text-xs font-medium uppercase tracking-wider text-text-muted transition hover:text-text"
              >
                {page.label}
              </Link>
            ))}
          </nav>
          <BookNowButton siteContent={siteContent} size="sm" />
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-border bg-white px-4 py-4 @md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Site">
            {NAV_PAGES.map((page) => (
              <Link
                key={page.id}
                href={previewPagePath(siteContent.id, page.path)}
                className="text-sm font-medium uppercase tracking-wide text-text"
                onClick={() => setMenuOpen(false)}
              >
                {page.label}
              </Link>
            ))}
            <BookNowButton siteContent={siteContent} size="sm" className="mt-2 w-full" />
          </nav>
        </div>
      ) : null}
    </header>
  );
}

/** Compact bar — logo left, inline links + CTA right */
export function NavCompactSplit({ siteContent }: NavLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const basePath = previewBasePath(siteContent.id);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface-muted/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 @sm:px-6">
        <Link
          href={basePath}
          className="font-display shrink-0 text-base font-semibold tracking-tight text-text @sm:text-lg"
        >
          {siteContent.branding.propertyName}
        </Link>

        <nav
          className="ml-auto hidden flex-wrap items-center justify-end gap-4 @md:flex"
          aria-label="Site"
        >
          {NAV_PAGES.map((page) => (
            <Link
              key={page.id}
              href={previewPagePath(siteContent.id, page.path)}
              className="text-[0.65rem] font-semibold uppercase tracking-widest text-text-muted transition hover:text-text"
            >
              {page.label}
            </Link>
          ))}
          <BookNowButton siteContent={siteContent} size="sm" />
        </nav>

        <button
          type="button"
          className="ml-auto inline-flex items-center justify-center rounded-button border border-border bg-white px-3 py-1.5 text-xs @md:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-border bg-white px-4 py-3 @md:hidden">
          <nav className="flex flex-col gap-2" aria-label="Site">
            {NAV_PAGES.map((page) => (
              <Link
                key={page.id}
                href={previewPagePath(siteContent.id, page.path)}
                className="text-sm font-medium text-text"
                onClick={() => setMenuOpen(false)}
              >
                {page.label}
              </Link>
            ))}
            <BookNowButton siteContent={siteContent} size="sm" className="mt-2 w-full" />
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function NavThumbnailPreview({
  variant,
}: {
  variant: "sticky" | "centered" | "compact";
}) {
  if (variant === "centered") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-sm bg-white p-1">
        <div className="h-1.5 w-2/3 rounded-sm bg-slate-700" />
        <div className="flex gap-0.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-1 w-2 rounded-sm bg-slate-300" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex h-full w-full items-center gap-1 rounded-sm bg-slate-100 px-1">
        <div className="h-1.5 w-1/4 rounded-sm bg-slate-700" />
        <div className="ml-auto flex gap-0.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-1 w-1.5 rounded-sm bg-slate-400" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center gap-1 rounded-sm bg-white px-1">
      <div className="h-1.5 w-1/4 rounded-sm bg-slate-700" />
      <div className="mx-auto flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-1 w-1.5 rounded-sm bg-slate-300" />
        ))}
      </div>
      <div className="h-1.5 w-1/6 rounded-sm bg-brand-600" />
    </div>
  );
}
