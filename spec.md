# Technical Brief: StaySite — Accommodation Website Builder

## Product Summary

**StaySite** is a self-hosted SaaS application that generates complete accommodation websites from a questionnaire. Owners describe their property; the system generates a finished, publishable website with AI-written copy, organized media, and proper SEO. Sites are served from the same application via host-header routing with automatic SSL.

**Pitch:** *Answer a few questions. Get a beautiful, booking-ready website in minutes. No coding. No templates. AI builds it — you own it.*

See `promo.png` for visual reference and `overview.md` for product narrative.

---

## Product Design Reference (`promo.png`)

### Owner journey (marketing)

1. **Describe** — answer simple questions about the property
2. **Generate** — AI writes content, lays out pages, organizes photos
3. **Customize** — review and tweak any section
4. **Publish** — connect domain and go live

### Builder dashboard layout

| Area | Content |
| ---- | ------- |
| Top nav | StaySite logo, Sites, Help, user profile |
| Left sidebar | Questionnaire step checklist with completion state |
| Primary CTA | "Generate My Website" (enabled when required steps complete) |
| Main pane | Live preview of generated site (desktop; mobile preview later) |

### Questionnaire steps (v1)

1. Property Details — name, type, tagline inputs
2. Rooms & Accommodation — room types, descriptions, pricing
3. Amenities & Services — facilities, services offered
4. Location — address, map pin, nearby highlights
5. Photos — auto-filled picsum placeholders in Phase 1 (step required; no owner upload)
6. Contact & Branding — contact info, owner brand/accent color
7. Booking Settings — external booking channel (email, WhatsApp, Booking.com URL, etc.)

### Generated site template (v1 — fixed)

| Page | Key sections |
| ---- | -------------- |
| Home | Hero (image + headline + location + CTA), room highlights grid, amenities |
| Rooms | Individual room cards with photo, description, price |
| Gallery | Categorized photo grid |
| Location | Leaflet map (OSM/CARTO tiles, go-krumlov pattern) + address + nearby attractions |
| Contact | Contact details and booking CTA (no inquiry form in Phase 1) |

**Header:** property name, nav (Rooms, Gallery, Location, Contact), "Book Now" button.

**Footer bar (trust signals):** Mobile Responsive, SEO Optimized, Fast Loading, Secure & SSL, Ready for Guests.

**Design tokens:** StaySite blue primary, white/neutral surfaces, rounded corners, large photography, mobile-first stacking.

---

## Architecture

Single Next.js application serving two functions:

1.  **Builder dashboard** — authenticated owner area for creating and editing sites
2.  **Public site renderer** — serves generated customer sites based on incoming Host header

One server, one process, one database file. No microservices, no external runtime dependencies beyond the LLM API.

Copy code

```
Internet → Caddy (reverse proxy + on-demand TLS) → Next.js app
                                                      ├── SQLite (site data)
                                                      └── /data/uploads (images)
```

---

## Tech Stack

| Layer         | Decision                                                            |
| ------------- | ------------------------------------------------------------------- |
| Framework     | Next.js (App Router, API routes)                                    |
| Database      | SQLite (WAL mode, busy\\\_timeout 5000ms, local disk)               |
| ORM           | Drizzle or better-sqlite3 directly                                  |
| Auth          | Better Auth (TypeScript library, sessions in SQLite)                |
| Images        | Sharp for processing, local disk storage, Caddy serves static files |
| AI            | [OpenCode Go](https://opencode.ai/docs/go/) via OpenAI-compatible API (one call per section; one call per room) |
| Payments      | Stripe Checkout (hosted page, not custom UI)                        |
| Maps          | Leaflet + OSM/CARTO tiles (go-krumlov pattern)                      |
| Reverse proxy | Caddy with on-demand TLS                                            |
| Backups       | Litestream sidecar → Hetzner Storage Box                            |
| Hosting       | Hetzner cloud server                                                |
| Orchestration | Docker Compose                                                      |

---

## Implementation Phases

### Phase 1: Generator

- Questionnaire: 7 steps; all required (Photos step auto-fills picsum placeholders)
- Single LLM call per content section; **one LLM call per room** for descriptions
- One fixed template matching `promo.png` (Halcyon-style boutique layout)
- Output: 5 pages (Home, Rooms, Gallery, Location, Contact) at `/preview/[siteId]/…`
- Booking: single channel — all "Book Now" CTAs use owner's configured target
- Builder UI: marketing landing at `/`, sidebar checklist + live preview; `sessionStorage` for draft state
- Post-generate: preview only — edit questionnaire and re-generate (no inline content editor)
- Typography: sans builder UI; serif display headings on generated site
- Rooms: 1–6; optional price; currency selectable (EUR, USD, GBP, CZK)
- No auth, no persistence, no LLM mock — real OpenCode Go when `OPENAI_API_KEY` set (default model `deepseek-v4-flash`, endpoint `OPENAI_BASE_URL`)

### Phase 2: Publishing & Accounts

- Better Auth: email/password, sessions in SQLite
- Owner dashboard: save sites, edit individual sections, regenerate content
- Custom domain connection via Caddy on-demand TLS
- Image upload: Sharp generates 3–4 sizes + WebP, writes to `/data/uploads/{siteId}/`
- Caddy serves uploads directory with long cache headers
- Automatic SEO: structured data, sitemap, alt text
- Free preview, pay to publish (Stripe billing)

### Phase 3: Booking & Conversion

- Availability calendar: owner blocks dates manually
- Booking request flow → Stripe Checkout for payment
- Transactional email for confirmations
- Owner-curated reviews section
- Promo code support

### Phase 4: Growth

- iCal sync with Airbnb/Booking.com (calendar import/export, not API integration)
- Additional templates
- Multi-property support for portfolio owners
- Multi-language content generation
- Owner analytics dashboard

---

## Data Model (High Level)

Copy code

```
users
  id, email, password_hash, created_at

sites
  id, user_id, custom_domain, published_at, created_at
  content (JSON: all questionnaire answers + generated content)

rooms
  id, site_id, name, description, price, amenities (JSON)

images
  id, site_id, room_id (nullable), filename, alt_text, category

bookings (Phase 3)
  id, site_id, room_id, check_in, check_out, guest_email, status, stripe_payment_id

blocked_dates (Phase 3)
  id, site_id, room_id, date
```

All site content lives as JSON in the `sites` table. The renderer reads this JSON and produces HTML. Edits update the JSON; regeneration calls the LLM and overwrites specific sections.

---

## Deployment

**docker-compose with three containers:**

| Container    | Responsibility                                                |
| ------------ | ------------------------------------------------------------- |
| `app`        | Next.js — builder dashboard + public site renderer            |
| `caddy`      | Reverse proxy, on-demand TLS, static file serving for uploads |
| `litestream` | SQLite WAL replication to Storage Box                         |

**Volumes:**

- `db-data` — SQLite database file
- `uploads` — generated image variants
- `caddy-data` — certificates and config

**Caddy on-demand TLS flow:**

1.  Customer points DNS at server
2.  Request arrives for unknown domain
3.  Caddy calls `http://app:3000/api/domain-check` to verify domain is registered
4.  If approved, Caddy provisions Let's Encrypt cert automatically
5.  App serves the correct site based on Host header

---

## Operational Concerns

- **Backups:** Litestream streams WAL changes continuously. Images backed up via nightly rclone to Storage Box. Test restoration before launch.
- **Database locks:** WAL mode + busy_timeout handles it. If you see lock errors, investigate long-running transactions, not connection pooling.
- **Image disk usage:** Monitor `/data/uploads` growth. Each site with 20 photos at 4 sizes generates ~80 files. Cheap to store, but back it up.
- **LLM cost:** One site generation = roughly 5–8 API calls (property description, each room, meta tags, CTA copy). OpenCode Go subscription includes usage limits; see [OpenCode Go docs](https://opencode.ai/docs/go/).
- **Scaling:** Single server handles hundreds of sites and thousands of daily visitors. When you outgrow it, the migration path is: add Cloudflare in front (free), then move DB to separate server, then consider Postgres.

---

## Project Conventions

Cursor rules in `.cursor/rules/` adapt patterns from sibling projects (dock, hotel-hero) for this monolithic Next.js + SQLite stack. Key conventions:

- **pnpm**, TypeScript strict, App Router
- Domain types in `src/lib/types/`; repositories for all DB access
- `SiteContent` JSON is the single contract between builder, LLM, and public renderer
- Phase discipline — complete Phase 1 before starting persistence/auth work

---

## Implementation Status

| Phase | Status | Notes |
| ----- | ------ | ----- |
| Phase 1: Generator | **Complete** | All tasks 1–9 done. Run `pnpm verify` before releases. LLM: OpenCode Go. |
| Phase 2: Publishing & Accounts | Not started | — |
| Phase 3: Booking & Conversion | Not started | — |
| Phase 4: Growth | Not started | — |
