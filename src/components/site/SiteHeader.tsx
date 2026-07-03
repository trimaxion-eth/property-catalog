"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_PAGES } from "@/lib/constants";
import { previewBasePath, previewPagePath } from "@/lib/site/preview-path";
import type { SiteContent } from "@/lib/types/site-content";
import { BookNowButton } from "@/components/site/BookNowButton";

const NAV_PAGES = SITE_PAGES.filter((page) => page.id !== "home");

type SiteHeaderProps = {
  siteContent: SiteContent;
};

export function SiteHeader({ siteContent }: SiteHeaderProps) {
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
