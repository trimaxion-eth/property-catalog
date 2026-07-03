# StaySite — Implementation Plan

This document turns `spec.md`, `overview.md`, and `promo.png` into an executable build plan. **Decisions recorded 2026-07-03** — see [Recorded decisions](#recorded-decisions). Ready for Phase 1 implementation.

**Related docs:** `spec.md` (technical brief), `overview.md` (product narrative), `.cursor/rules/` (coding conventions).

---

## Goals

| Goal | Success criteria (Phase 1) |
| ---- | -------------------------- |
| Owner can describe a property | All 7 questionnaire steps completable without auth |
| System generates a professional site | LLM fills `SiteContent` JSON; template renders 5 pages |
| Owner can review output | Live preview updates after generation |
| Site is guest-ready in preview | Mobile layout, semantic HTML, meta title/description, image alt text |
| Foundation for Phase 2 | `SiteContent` schema stable; folder layout supports auth + DB later |

---

## Architecture (Phase 1 subset)

```
┌─────────────────────────────────────────────────────────┐
│  Next.js App (single process)                           │
│  ┌─────────────────┐  ┌──────────────────────────────┐ │
│  │ Builder routes  │  │ Site template (preview mode) │ │
│  │ /               │  │ /preview/[id] or inline pane │ │
│  │ /builder        │  │                              │ │
│  └────────┬────────┘  └──────────────┬───────────────┘ │
│           │                          │                  │
│           ▼                          ▼                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │ SiteContent JSON (in-memory / sessionStorage v1)   │ │
│  └────────────────────────────────────────────────────┘ │
│           │                                             │
│           ▼                                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │ POST /api/generate → content-generation service    │ │
│  │                    → LLM API (1 call per section)  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

Phase 1 intentionally omits: SQLite, Better Auth, Caddy, Stripe, Sharp uploads, host-header routing.

---

## Repository layout (target)

```
property-catalog/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, global styles
│   │   ├── page.tsx                # Marketing landing (or redirect — see Q2)
│   │   ├── builder/
│   │   │   └── page.tsx            # Questionnaire + preview shell
│   │   ├── preview/
│   │   │   └── [siteId]/           # Full-page preview (if Q8 = separate tab)
│   │   │       ├── page.tsx        # Home
│   │   │       ├── rooms/page.tsx
│   │   │       ├── gallery/page.tsx
│   │   │       ├── location/page.tsx
│   │   │       └── contact/page.tsx
│   │   └── api/
│   │       └── generate/route.ts
│   ├── components/
│   │   ├── builder/                # Sidebar, steps, generate CTA, preview frame
│   │   ├── site/                   # Template: header, hero, room grid, etc.
│   │   └── ui/                     # Buttons, inputs, step indicator
│   ├── hooks/
│   ├── lib/
│   │   ├── config/env.ts
│   │   ├── constants/              # QUESTIONNAIRE_STEPS, query-keys
│   │   ├── types/                  # QuestionnaireAnswers, SiteContent, enums
│   │   ├── services/
│   │   │   └── content-generation.ts
│   │   ├── prompts/                # LLM prompt templates per section
│   │   └── errors.ts
│   └── styles/globals.css
├── public/
├── .cursor/rules/
├── spec.md
├── implementation-plan.md          # This file
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── drizzle.config.ts               # Stub until Phase 2
```

---

## Phase 1 — Detailed tasks

### 1. Project scaffold

- [x] Initialize Next.js 15 (App Router), TypeScript strict, Tailwind CSS, pnpm
- [x] Configure path alias `@/` → `src/`
- [x] Add `src/lib/config/env.ts` with Zod validation (`OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`, etc.)
- [x] Tailwind theme: StaySite brand tokens (`brand` color scale, radii, spacing)
- [x] Base `layout.tsx`, `globals.css`, font choices (Inter sans + Playfair Display serif)
- [x] Marketing landing at `/` and builder shell at `/builder`
- [x] `.env.example`, error helpers, constants/types stubs, map tile config

### 2. Domain types & validation

- [x] `src/lib/types/enums.ts` — property type, booking channel type, image category, questionnaire step id
- [x] `src/lib/types/questionnaire.ts` — `QuestionnaireAnswers`, `QuestionnaireDraft`
- [x] `src/lib/types/site-content.ts` — `SiteContent` (generated + renderable output)
- [x] `src/lib/types/api.ts` — `GenerateSiteRequest`, `GenerateSiteResponse`, `ApiResponse`
- [x] Zod schemas in `src/lib/validation/` mirroring types for API boundary validation
- [x] `src/lib/constants/index.ts` — `QUESTIONNAIRE_STEPS`, `SITE_PAGES`, booking channel options, amenities, room limits
- [x] Helpers: `src/lib/questionnaire/helpers.ts`, `src/lib/images/picsum.ts`, `src/lib/booking/resolve-booking-href.ts`

**Contract rule:** The site template reads only `SiteContent`, never raw questionnaire fields. Generation service maps `QuestionnaireAnswers` → `SiteContent`.

### 3. Marketing landing (`/`)

- [ ] Hero matching `promo.png` pitch (headline, subhead, 4-step journey icons)
- [ ] Trust bar footer: Mobile Responsive, SEO Optimized, Fast Loading, Secure & SSL, Ready for Guests
- [ ] Primary CTA → `/builder`
- [ ] Use resolved product name from Q1 in all copy

### 4. Builder dashboard (`/builder`)

- [x] Top nav: logo, Sites (disabled placeholder), Help placeholder, profile placeholder
- [x] Left sidebar: 7 steps with completion checkmarks; click to navigate steps
- [x] Step forms (one component per step): Property Details, Rooms, Amenities, Location, Photos, Contact & Branding, Booking Settings
- [x] "Generate My Website" button — disabled until all steps valid
- [x] Preview pane — draft summary with hero, rooms, accent color
- [x] `sessionStorage` persistence via `useQuestionnaireDraft`
- [x] Post-generation editing — preview only; re-generate via questionnaire + Generate

### 5. Content generation service

- [x] `src/lib/services/content-generation.ts` — orchestrates LLM calls and assembles `SiteContent`
- [x] `src/lib/services/llm-client.ts` — OpenCode Go (OpenAI-compatible) JSON calls with Zod validation + one retry
- [x] `src/lib/prompts/` — section prompt builders + property context
- [x] `src/lib/validation/llm-outputs.ts` — per-section output schemas
- [x] One LLM call per section: home, amenities, location, meta, contact, and one per room
- [x] Picsum images assembled without LLM; final output validated with `siteContentSchema`
- [x] `POST /api/generate` — accepts `QuestionnaireAnswers`, returns `SiteContent` + `previewSiteId`
- [x] Builder wired to API; stores result in `sessionStorage`; redirects to `/preview/[siteId]`
- [x] Preview status page (full template rendering in Task 6)

### 6. Site template (fixed v1)

- [x] `SiteLayout` — header (property name, nav, Book Now), footer with trust signals
- [x] **Home** — hero, intro, room highlights grid, amenities section
- [x] **Rooms** — alternating room cards with image, description, price, amenities
- [x] **Gallery** — categorized grid from `SiteContent.gallery`
- [x] **Location** — Leaflet map, address, nearby highlights
- [x] **Contact** — contact details + booking CTA (no form)
- [x] Book Now — single channel via `resolveBookingHref` on all CTAs
- [x] Owner `--site-accent` applied on template root
- [x] `next/image` via `SiteImage` on all photos with alt text
- [x] Preview routes: `/preview/[siteId]`, `/rooms`, `/gallery`, `/location`, `/contact`

### 7. Preview & state

- [x] Persist questionnaire draft + generated `SiteContent` in `sessionStorage` (shared `session-storage.ts` helpers)
- [x] Builder inline preview uses `SiteHeader` + `SiteHomeView` (same template components as `/preview/[siteId]`)
- [x] Generation loading overlay (spinner + message) and error state with retry in preview pane
- [x] Stale preview banner when questionnaire changes after generation
- [x] Stay on builder after generate; "Open full site" link to preview routes

### 8. SEO & accessibility (Phase 1 minimum)

- [x] Per-page `<title>` and meta description via `SitePageMetadata` + `getSitePageMetadata`
- [x] Open Graph title/description; `noindex` on preview routes
- [x] Semantic landmarks — `header`, `nav` (labelled), `main` (with skip link), `footer`
- [x] Heading hierarchy — one `h1` per site view (verified in `scripts/verify-phase1.mjs`)
- [x] Image `alt` on every `SiteImage`; gallery `figcaption.sr-only`
- [x] Lazy loading on non-priority images
- [x] JSON-LD deferred to Phase 2 (per Q15)

### 9. Verification

- [x] `pnpm verify` — typecheck, lint, build, and structural checks pass
- [x] Structural checks: one `h1` per page view, booking href logic, metadata on all preview routes
- [x] `spec.md` implementation status updated — Phase 1 complete
- [x] Decision answers recorded in [Recorded decisions](#recorded-decisions)

---

## Phase 2 — Outline (after Phase 1 complete)

1. SQLite + Drizzle schema (`users`, `sites`, `images`)
2. Better Auth (email/password)
3. Save/load sites; owner dashboard listing
4. Section edit + selective LLM regeneration
5. Image upload (Sharp → `/data/uploads/{siteId}/`)
6. Host-header middleware + public publish
7. Caddy on-demand TLS + `domain-check` API
8. Stripe: free preview, pay to publish
9. Sitemap, robots.txt, full JSON-LD
10. Docker Compose (app + caddy + litestream)

---

## Phase 3 — Outline

Availability calendar, booking requests, Stripe Checkout, transactional email, reviews, promo codes.

---

## Phase 4 — Outline

iCal sync, additional templates, multi-property, multi-language generation, analytics.

---

## Dependencies (Phase 1)

| Package | Purpose |
| ------- | ------- |
| `next`, `react`, `react-dom` | Framework |
| `tailwindcss` | Styling |
| `zod` | Validation |
| `openai` | LLM SDK — [OpenCode Go](https://opencode.ai/docs/go/) via `OPENAI_BASE_URL`; default `deepseek-v4-flash`; one call per room (Q6) |
| `leaflet`, `@types/leaflet` | Interactive map — same stack as go-krumlov (Q9) |
| `@tanstack/react-query` | Optional in Phase 1; required Phase 2 |

---

## Risks & mitigations

| Risk | Mitigation |
| ---- | ---------- |
| LLM output shape drift | Zod validate every section; retry once on parse failure |
| Phase 1 scope creep | Strict phase discipline in `.cursor/rules/`; no auth/DB until Phase 2 |
| Promo vs spec nav mismatch | Resolved by Q3 |
| Image handling ambiguity | Resolved by Q4 |
| Generation cost during dev | Real LLM required when key set; no mock mode (Q16). Use fixture data only in tests. |

---

## Recorded decisions

| ID | Question | Decision | Date |
| -- | -------- | -------- | ---- |
| Q1 | Product & brand name | **A** — StaySite | 2026-07-03 |
| Q2 | Entry experience | **A** — Full marketing landing at `/` | 2026-07-03 |
| Q3 | About in navigation | **A** — No About; nav: Rooms, Gallery, Location, Contact | 2026-07-03 |
| Q4 | Phase 1 photos | **A** — Picsum placeholders only (no owner uploads) | 2026-07-03 |
| Q5 | Post-generation editing (Phase 1) | **A** — Preview only; change questionnaire and re-generate | 2026-07-03 |
| Q6 | LLM provider & room calls | **A** — OpenCode Go (OpenAI-compatible); one API call per room; default `deepseek-v4-flash` | 2026-07-03 |
| Q7 | Site page routes | **A** — Path-based `/preview/[siteId]/rooms`, etc. | 2026-07-03 |
| Q8 | Preview & draft persistence | **A** — `sessionStorage` | 2026-07-03 |
| Q9 | Maps in Phase 1 | **go-krumlov pattern** — Leaflet + raster tiles (CARTO Voyager default, OSM fallback); single property pin from questionnaire coordinates | 2026-07-03 |
| Q10 | Typography | **B** — Sans builder UI + serif display headings on generated site | 2026-07-03 |
| Q11 | Rooms & pricing | **D** — 1–6 rooms; price optional; currency selectable (EUR, USD, GBP, CZK) | 2026-07-03 |
| Q12 | Booking channel behavior | **A** — Single channel on all CTAs | 2026-07-03 |
| Q13 | Required vs optional steps | **A** — Strict; all 7 steps required (Photos auto-fills picsum on complete) | 2026-07-03 |
| Q14 | Contact page form | **A** — No form; contact details + booking CTA only | 2026-07-03 |
| Q15 | Structured data in Phase 1 | **A** — Defer JSON-LD to Phase 2 | 2026-07-03 |
| Q16 | Local dev without LLM | **B** — No mock; real LLM when key present, fail loudly when missing | 2026-07-03 |

### Q9 implementation note (go-krumlov parity)

Reuse the go-krumlov map approach, simplified for a single property:

- **Library:** Leaflet (dynamic import, client component)
- **Tiles:** `getRasterTileLayerConfig()` pattern — CARTO Voyager default, OpenStreetMap fallback; optional `NEXT_PUBLIC_MAP_TILE_URL` override
- **Pin:** One marker at property lat/lng from Location step (geocode address server-side or owner enters coordinates)
- **No** custom Krumlov artwork bounds, SVG fallback, or MapLibre vector mode in Phase 1
- Reference: `go-krumlov/frontend/src/lib/map/tileLayerConfig.ts`, `go-krumlov/frontend/src/components/home/KrumlovLeafletMap.tsx`

---

## Decision Questionnaire

Answer by replying with `Q1: A`, `Q2: B, C`, etc. Use **Other** only when none of the options fit; add one sentence of clarification.

---

### Q1 — Product & brand name

**What we're deciding:** The customer-facing name used in the UI, metadata, and repo (logo text, page titles, email footers later).

**Why it matters:** Affects all copy, package name, and domain marketing. `spec.md` and `promo.png` currently say **StaySite**.

| Option | Meaning |
| ------ | ------- |
| **A** | **StaySite** — keep as in promo and spec |
| **B** | **Property Catalog** — align with repository folder name |
| **C** | **Trimaxion Stays** (or other parent brand) — sub-brand under Trimaxion |
| **D** | **Other** — provide exact name and optional tagline |

---

### Q2 — Entry experience

**What we're deciding:** What visitors see at `/` before entering the builder.

**Why it matters:** Determines whether Phase 1 ships a marketing page or goes straight to the tool.

| Option | Meaning |
| ------ | ------- |
| **A** | **Full marketing landing** — promo-style hero, 4-step journey, trust bar, CTA to `/builder` |
| **B** | **Minimal landing** — product name, one sentence, single "Start" button |
| **C** | **Redirect** — `/` immediately redirects to `/builder` (no marketing page in Phase 1) |

---

### Q3 — "About" in site navigation

**What we're deciding:** `promo.png` shows nav item **ABOUT**; `spec.md` lists 5 pages without a separate About page.

**Why it matters:** Changes route count and Home page layout.

| Option | Meaning |
| ------ | ------- |
| **A** | **No About nav item** — nav is Rooms, Gallery, Location, Contact only (match current spec table) |
| **B** | **About section on Home** — nav link `#about` scrolls to a section on the homepage; no extra route |
| **C** | **Dedicated About page** — 6th route `/about` with property story content from LLM |
| **D** | **About label → Home** — nav shows "About" but links to `/` (same page as Home) |

---

### Q4 — Phase 1 photos

**What we're deciding:** How owners supply images before Phase 2 upload infrastructure exists.

**Why it matters:** Affects questionnaire UI, storage, and whether Sharp/Caddy work is pulled into Phase 1.

| Option | Meaning |
| ------ | ------- |
| **A** | **Picsum placeholders only** — no owner photos in Phase 1; seeded placeholders from property/room names |
| **B** | **Image URL inputs** — owner pastes HTTPS URLs per photo slot; no file upload |
| **C** | **URL inputs + picsum fallback** — owner can paste URLs; empty slots use picsum |
| **D** | **Browser file picker without server persistence** — images stored as base64/data URLs in sessionStorage only (lost on clear); no Sharp |

---

### Q5 — Post-generation editing (Phase 1)

**What we're deciding:** After "Generate My Website", can the owner change content before Phase 2 save/edit features?

**Why it matters:** Phase 1 "Customize" step in the promo journey may need inline editing or may be preview-only.

| Option | Meaning |
| ------ | ------- |
| **A** | **Preview only** — no editing after generate; change answers and re-generate |
| **B** | **Edit questionnaire + re-generate** — tweak form fields, click Generate again (no per-field content editor) |
| **C** | **Light inline edits** — edit generated text fields (headlines, descriptions) in UI without calling LLM; stored in client state only |
| **D** | **Per-section regenerate** — button on each section to re-call LLM for that section only (still no DB) |

---

### Q6 — LLM provider & room description calls

**What we're deciding:** Which API to integrate first, and how to batch room copy.

**Why it matters:** SDK dependency, env vars, cost profile, and prompt structure.

| Option | Meaning |
| ------ | ------- |
| **A** | **OpenCode Go** — e.g. `deepseek-v4-flash` via OpenAI-compatible endpoint; one API call per room for descriptions |
| **B** | **OpenCode Go** — one batched call for all rooms in a single request |
| **C** | **Anthropic** — e.g. `claude-sonnet-4`; one call per room |
| **D** | **Anthropic** — one batched call for all rooms |
| **E** | **Provider-agnostic** — abstraction layer; you configure provider via env (implement both before Phase 1 ends) |

---

### Q7 — Site page routes in preview

**What we're deciding:** URL structure for the generated site preview (Phase 1).

**Why it matters:** Affects App Router folder structure and link behavior in the template.

| Option | Meaning |
| ------ | ------- |
| **A** | **Path-based** — `/preview/[siteId]/rooms`, `/gallery`, etc. |
| **B** | **Single preview shell** — `/preview/[siteId]` with client-side tab nav only (no unique URLs per page) |
| **C** | **Inline only** — preview exists only in the builder right pane; no standalone preview URLs |

---

### Q8 — Preview & draft persistence (Phase 1)

**What we're deciding:** Where questionnaire answers and `SiteContent` live between page refreshes.

**Why it matters:** Owner experience if they accidentally close the tab.

| Option | Meaning |
| ------ | ------- |
| **A** | **sessionStorage** — survives refresh in same tab; cleared when tab closes |
| **B** | **In-memory only** — lost on any refresh |
| **C** | **sessionStorage + shareable preview link** — storage plus copyable `/preview/[siteId]` URL with ID in sessionStorage (preview empty for others) |
| **D** | **localStorage** — survives browser restart until cleared |

---

### Q9 — Maps in Phase 1

**What we're deciding:** How the Location page shows a map without mandatory Google Cloud billing setup.

**Why it matters:** Google Maps Embed API may require API key and billing account.

| Option | Meaning |
| ------ | ------- |
| **A** | **Google Maps iframe embed** — requires `GOOGLE_MAPS_EMBED_API_KEY` in env |
| **B** | **Static map image** — OpenStreetMap or similar static tile URL from lat/lng (no Google) |
| **C** | **No map in Phase 1** — address text + nearby highlights list only; map in Phase 2 |
| **D** | **OpenStreetMap embed** — free embed (e.g. iframe to openstreetmap.org) from geocoded address |

---

### Q10 — Typography

**What we're deciding:** Font pairing for builder UI vs generated customer sites.

**Why it matters:** Font files, layout feel, and alignment with promo mockup.

| Option | Meaning |
| ------ | ------- |
| **A** | **Single sans family** — e.g. Inter for both builder and generated site |
| **B** | **Sans builder + serif display on generated site** — matches boutique hotel aesthetic in promo |
| **C** | **System font stack only** — no Google Fonts in Phase 1 |

---

### Q11 — Rooms & pricing

**What we're deciding:** Constraints on the room list and how price displays on the site.

**Why it matters:** Form validation, template layout, and LLM prompts.

| Option | Meaning |
| ------ | ------- |
| **A** | **1–3 rooms** — fixed cap; price shown as "from €X / night" on Home; full price on Rooms page |
| **B** | **1–6 rooms** — same display rules as A |
| **C** | **1–3 rooms** — price optional (hide if empty) |
| **D** | **1–6 rooms** — price optional; currency selectable in questionnaire (EUR, USD, GBP, CZK) |

---

### Q12 — Booking channel behavior

**What we're deciding:** What happens when a guest clicks "Book Now" / "Book Your Stay".

**Why it matters:** Header CTA, hero CTA, and Contact page must behave consistently.

| Option | Meaning |
| ------ | ------- |
| **A** | **Single channel** — one booking setting applies to all CTAs (URL opens new tab, `mailto:`, or `https://wa.me/...`) |
| **B** | **Primary + secondary** — hero uses primary channel; footer/contact shows email/phone as text links |
| **C** | **Modal chooser** — if multiple channels configured, guest picks (e.g. WhatsApp vs Booking.com) |

---

### Q13 — Required vs optional questionnaire steps

**What we're deciding:** Which steps block the Generate button.

**Why it matters:** Validation rules and empty-state handling in template.

| Option | Meaning |
| ------ | ------- |
| **A** | **Strict** — all 7 steps required with minimum fields (name, ≥1 room, ≥1 amenity, location text, contact email, booking channel) |
| **B** | **Photos optional** — everything required except Photos step (placeholders used) |
| **C** | **Loose** — only Property name + ≥1 room required; sensible defaults elsewhere |
| **D** | **Custom** — list which steps are required |

---

### Q14 — Contact page form (Phase 1)

**What we're deciding:** Whether guests can submit an inquiry from the generated site in Phase 1.

**Why it matters:** Needs API route + email transport (Phase 3 spec mentions email later).

| Option | Meaning |
| ------ | ------- |
| **A** | **No form** — display email, phone, address; CTA goes to booking channel only |
| **B** | **Form UI, no submit** — visible form fields but submit shows "Available after publish" toast |
| **C** | **Working form → email** — `POST /api/contact` sends email via SMTP/Resend in Phase 1 |
| **D** | **Working form → mailto** — submit opens visitor's email client with prefilled body |

---

### Q15 — Structured data (JSON-LD) in Phase 1

**What we're deciding:** Whether preview sites include schema.org markup before Phase 2 publish.

**Why it matters:** Small implementation effort; helps validate SEO story early.

| Option | Meaning |
| ------ | ------- |
| **A** | **Defer to Phase 2** — meta title/description only in Phase 1 |
| **B** | **Include LodgingBusiness + Room JSON-LD** in preview pages now |

---

### Q16 — Local development without LLM

**What we're deciding:** How developers run the app without spending API credits on every refresh.

**Why it matters:** DX and CI; fixture data for template work.

| Option | Meaning |
| ------ | ------- |
| **A** | **`MOCK_LLM=true` env** — returns fixture `SiteContent` from `src/lib/fixtures/sample-site.ts` |
| **B** | **No mock** — always call real LLM when key present; fail loudly when missing |
| **C** | **Both** — mock when `MOCK_LLM=true`, real API when false and key set |

---

## Next step

Implementation begins with **Phase 1, Task 1 (scaffold)** unless you request plan changes.
