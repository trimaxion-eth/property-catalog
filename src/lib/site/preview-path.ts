export function previewBasePath(siteId: string): string {
  return `/preview/${siteId}`;
}

export function previewPagePath(siteId: string, pagePath: string): string {
  return `${previewBasePath(siteId)}${pagePath}`;
}
