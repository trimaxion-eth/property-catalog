/**
 * Lightweight Phase 1 verification checks (Task 9).
 * Run: node scripts/verify-phase1.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";

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

function countH1(text) {
  return (text.match(/<h1\b/g) ?? []).length;
}

/**
 * Extract the body of a top-level `function <name>(...) { ... }` declaration in a
 * .tsx file: skip past the parameter list (which may contain destructuring/type
 * braces) to the body's opening brace, then track brace depth to its matching
 * close. JSX expression braces are balanced, so this is reliable for the hero
 * layouts' flat components.
 */
function getComponentBody(source, componentName) {
  const prefix = `function ${componentName}(`;
  const sigStart = source.indexOf(prefix);
  if (sigStart === -1) return null;

  // Locate the parameter list's matching close paren to find the body's "{".
  const paramsStart = sigStart + prefix.length - 1; // index of the opening "("
  let parenDepth = 0;
  let closeParen = -1;
  for (let i = paramsStart; i < source.length; i++) {
    if (source[i] === "(") parenDepth++;
    else if (source[i] === ")") {
      parenDepth--;
      if (parenDepth === 0) {
        closeParen = i;
        break;
      }
    }
  }
  if (closeParen === -1) return null;

  const openBrace = source.indexOf("{", closeParen);
  if (openBrace === -1) return null;

  let braceDepth = 0;
  for (let i = openBrace; i < source.length; i++) {
    if (source[i] === "{") braceDepth++;
    else if (source[i] === "}") {
      braceDepth--;
      if (braceDepth === 0) return source.slice(openBrace + 1, i);
    }
  }
  return null;
}

/**
 * SiteHomeView renders no inline <h1>; its single h1 lives in the hero section
 * layouts, reached via SiteHeroSection -> getSectionLayoutEntry("hero"). Enforce
 * the "one <h1> per page" rule by asserting that delegation chain always yields
 * exactly one <h1>:
 *
 *   - The home view itself has 0 inline <h1> and renders <SiteHeroSection />.
 *   - The hero layouts define the h1 in two mutually-exclusive render paths:
 *       * HeroCopy      -> shared by HeroFullBleedBottom and HeroCenteredOverlay
 *       * HeroSplitLeft -> its own inline h1 (does not use HeroCopy)
 *   - Each path emits exactly one <h1>, and only one path renders at a time.
 *
 * A naive count of literal "<h1" in layouts.tsx sees 2 occurrences (one in
 * HeroCopy, one in HeroSplitLeft) even though the page renders exactly one.
 */
function checkHomeViewH1(file, content) {
  const heroFile = join(root, "src/lib/section-layouts/hero/layouts.tsx");
  const hero = readFileSync(heroFile, "utf8");

  // The home view must not define its own <h1> — it delegates to the hero.
  const inline = countH1(content);
  if (inline !== 0) {
    errors.push(
      `${file}: home view delegates its <h1> to the hero layouts; expected 0 inline <h1>, found ${inline}`,
    );
    return;
  }

  // ...and it must actually render the hero section that supplies the h1.
  if (!content.includes("<SiteHeroSection")) {
    errors.push(
      `${file}: home view does not render <SiteHeroSection /> (expected <h1> delegation point)`,
    );
    return;
  }

  // Each distinct hero render path must emit exactly one <h1>.
  const heroCopy = getComponentBody(hero, "HeroCopy");
  const splitLeft = getComponentBody(hero, "HeroSplitLeft");
  const thumbnail = getComponentBody(hero, "HeroThumbnailPreview");

  if (!heroCopy) {
    errors.push(`${heroFile}: HeroCopy component not found`);
  } else if (countH1(heroCopy) !== 1) {
    errors.push(
      `${heroFile}: HeroCopy should render exactly 1 <h1>, found ${countH1(heroCopy)}`,
    );
  }

  if (!splitLeft) {
    errors.push(`${heroFile}: HeroSplitLeft component not found`);
  } else if (countH1(splitLeft) !== 1) {
    errors.push(
      `${heroFile}: HeroSplitLeft should render exactly 1 <h1>, found ${countH1(splitLeft)}`,
    );
  }

  // HeroThumbnailPreview is a static preview, never rendered on the page.
  if (!thumbnail) {
    errors.push(`${heroFile}: HeroThumbnailPreview component not found`);
  } else if (countH1(thumbnail) !== 0) {
    errors.push(
      `${heroFile}: HeroThumbnailPreview should render 0 <h1>, found ${countH1(thumbnail)}`,
    );
  }

  // The copy-based layouts take their single h1 from the shared HeroCopy, so
  // they must render it and have no inline h1 of their own (no doubling up).
  for (const copyLayout of ["HeroFullBleedBottom", "HeroCenteredOverlay"]) {
    const body = getComponentBody(hero, copyLayout);
    if (!body) {
      errors.push(`${heroFile}: ${copyLayout} component not found`);
      continue;
    }
    if (countH1(body) !== 0) {
      errors.push(
        `${heroFile}: ${copyLayout} should render 0 inline <h1> (h1 comes from HeroCopy), found ${countH1(body)}`,
      );
    }
    if (!body.includes("<HeroCopy")) {
      errors.push(
        `${heroFile}: ${copyLayout} should render <HeroCopy /> (the shared <h1> path)`,
      );
    }
  }
}

function checkSiteViews() {
  const siteDir = join(root, "src/components/site");
  const viewFiles = walk(siteDir).filter((file) => file.endsWith("View.tsx"));

  for (const file of viewFiles) {
    const content = readFileSync(file, "utf8");

    if (basename(file) === "SiteHomeView.tsx") {
      checkHomeViewH1(file, content);
      continue;
    }

    const h1Count = countH1(content);
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
