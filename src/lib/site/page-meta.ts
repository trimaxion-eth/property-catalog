import type { SiteContent } from "@/lib/types/site-content";
import { splitParagraphs } from "@/lib/site/format-price";

export type SitePreviewPage =
  | "home"
  | "rooms"
  | "gallery"
  | "location"
  | "contact";

export type SitePageMetadata = {
  documentTitle: string;
  description: string;
};

function truncateMetaDescription(text: string, maxLength = 160): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function firstParagraph(text: string): string {
  return splitParagraphs(text)[0] ?? text;
}

export function getSitePageMetadata(
  siteContent: SiteContent,
  page: SitePreviewPage,
): SitePageMetadata {
  const propertyName = siteContent.branding.propertyName;
  const baseDescription = siteContent.meta.description;

  switch (page) {
    case "home":
      return {
        documentTitle: siteContent.meta.title,
        description: truncateMetaDescription(baseDescription),
      };
    case "rooms":
      return {
        documentTitle: `Rooms | ${propertyName}`,
        description: truncateMetaDescription(
          `Explore rooms and suites at ${propertyName}. ${baseDescription}`,
        ),
      };
    case "gallery":
      return {
        documentTitle: `Gallery | ${propertyName}`,
        description: truncateMetaDescription(
          `${siteContent.gallery.headline} — photos of ${propertyName}. ${baseDescription}`,
        ),
      };
    case "location":
      return {
        documentTitle: `Location | ${propertyName}`,
        description: truncateMetaDescription(
          `${firstParagraph(siteContent.location.body)} Stay in ${siteContent.location.city}, ${siteContent.location.country}.`,
        ),
      };
    case "contact":
      return {
        documentTitle: `Contact | ${propertyName}`,
        description: truncateMetaDescription(
          `${firstParagraph(siteContent.contactPage.body)} Reach ${propertyName} at ${siteContent.contact.email}.`,
        ),
      };
  }
}
