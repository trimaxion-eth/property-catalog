function upsertMetaTag(
  attribute: "name" | "property",
  key: string,
  content: string,
): void {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export function applyDocumentMetadata({
  title,
  description,
  noIndex = true,
}: {
  title: string;
  description: string;
  noIndex?: boolean;
}): void {
  document.title = title;
  upsertMetaTag("name", "description", description);
  upsertMetaTag("property", "og:title", title);
  upsertMetaTag("property", "og:description", description);
  upsertMetaTag("property", "og:type", "website");
  upsertMetaTag(
    "name",
    "robots",
    noIndex ? "noindex, nofollow" : "index, follow",
  );
}

export function resetDocumentMetadata(): void {
  const managedKeys = [
    ['name', 'description'],
    ['property', 'og:title'],
    ['property', 'og:description'],
    ['property', 'og:type'],
    ['name', 'robots'],
  ] as const;

  for (const [attribute, key] of managedKeys) {
    document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
  }
}
