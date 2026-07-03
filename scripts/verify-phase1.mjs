/**
 * Lightweight Phase 1 verification checks (Task 9).
 * Run: node scripts/verify-phase1.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const errors = [];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      walk(path, files);
    } else if (entry.endsWith(".tsx")) {
      files.push(path);
    }
  }
  return files;
}

function checkSiteViews() {
  const siteDir = join(root, "src/components/site");
  const viewFiles = walk(siteDir).filter((file) => file.endsWith("View.tsx"));

  for (const file of viewFiles) {
    const content = readFileSync(file, "utf8");
    const h1Count = (content.match(/<h1\b/g) ?? []).length;
    if (h1Count !== 1) {
      errors.push(`${file}: expected 1 <h1>, found ${h1Count}`);
    }
  }
}

function checkBookingHref() {
  const cases = [
    { type: "url", target: "https://booking.example/hotel", expect: "https://booking.example/hotel" },
    { type: "email", target: "stay@hotel.com", expect: "mailto:stay@hotel.com" },
    { type: "whatsapp", target: "+30 2286 000000", expect: "https://wa.me/302286000000" },
  ];

  for (const { type, target, expect } of cases) {
    let href;
    if (type === "email") href = `mailto:${target}`;
    else if (type === "whatsapp") {
      href = `https://wa.me/${target.replace(/\D/g, "")}`;
    } else href = target;

    if (href !== expect) {
      errors.push(`booking href ${type}: expected ${expect}, got ${href}`);
    }
  }
}

function checkPreviewPagesUseMetadata() {
  const previewDir = join(root, "src/app/preview/[siteId]");
  const pages = ["page.tsx", "rooms/page.tsx", "gallery/page.tsx", "location/page.tsx", "contact/page.tsx"];

  for (const page of pages) {
    const content = readFileSync(join(previewDir, page), "utf8");
    if (!content.includes("SitePageMetadata")) {
      errors.push(`${page}: missing SitePageMetadata`);
    }
  }
}

checkSiteViews();
checkBookingHref();
checkPreviewPagesUseMetadata();

if (errors.length > 0) {
  console.error("Phase 1 verification failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Phase 1 verification passed.");
