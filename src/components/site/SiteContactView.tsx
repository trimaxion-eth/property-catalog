"use client";

import { useSiteContent } from "@/hooks/site-content-context";
import { splitParagraphs } from "@/lib/site/format-price";
import { BookNowButton } from "@/components/site/BookNowButton";

export function SiteContactView() {
  const siteContent = useSiteContent();
  const { contactPage, contact } = siteContent;

  const addressParts = [
    contact.addressLine,
    contact.city,
    contact.region,
    contact.country,
  ].filter(Boolean);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 @sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-text">
        {contactPage.headline}
      </h1>
      <div className="mt-4 max-w-3xl space-y-4 text-text-muted">
        {splitParagraphs(contactPage.body).map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10 grid gap-8 @lg:grid-cols-2">
        <div className="rounded-card border border-border bg-surface-muted/50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text">
            Contact details
          </h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-text">Email</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-text-muted hover:text-text"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
            {contact.phone ? (
              <div>
                <dt className="font-medium text-text">Phone</dt>
                <dd className="mt-1 text-text-muted">{contact.phone}</dd>
              </div>
            ) : null}
            <div>
              <dt className="font-medium text-text">Address</dt>
              <dd className="mt-1 text-text-muted">{addressParts.join(", ")}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col justify-center rounded-card border border-border p-6">
          <h2 className="font-display text-2xl font-semibold text-text">
            Ready to book your stay?
          </h2>
          <p className="mt-3 text-text-muted">
            Use your preferred booking channel — we look forward to welcoming you.
          </p>
          <div className="mt-6">
            <BookNowButton siteContent={siteContent} size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
