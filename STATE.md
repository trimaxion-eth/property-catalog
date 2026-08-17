# StaySite — Autonomous Loop State

Durable state for the self-improving drive loop. Updated after every iteration and committed to `main`.

## Current phase

- **Phase 1 (Generator): complete.**
- **Phase 2 (Publishing & Accounts): not started.**

## ⚠️ Pre-existing uncommitted work

The working tree contains a large uncommitted changeset (Phase 1 soft-preview, AI site styling, marketing landing) on top of commit `77e8771 initial commit`. The drive loop must **only stage/commit files it actually changes** — never sweep unrelated dirty files into a commit. (Resolve this backlog by committing it separately before deep automation.)

## In-flight

- (none)

## Last completed

- `77e8771` initial commit.

## Open issues (backlog, newest last)

| # | Title | Type | Priority |
|---|-------|------|----------|
| 1 | `pnpm verify` fails: `verify-phase1.mjs` expects h1 in `SiteHomeView` but hero h1 moved to section layouts | bug | 1 (blocks verify) |
| 3 | Leaflet map markers broken: `marker-icon.png` / `marker-shadow.png` 404 | bug | 2 |
| 2 | Preview pages show default title instead of site title + duplicate meta description | bug | 3 |
| 4 | Floating "Hide layouts" toggle overlaps site header, blocks nav/Book Now | bug | 4 |
| 5 | Missing favicon: `/favicon.ico` returns 404 | enhancement | 5 |
| 6 | Marketing landing LCP image missing `priority` | enhancement | 6 |

## Next actions

1. Fix issue #1 first (unblocks `pnpm verify`).
2. Then #3, #2, #4 (bugs), then #5, #6 (enhancements).
3. When backlog is empty, delegate to `idea` → `product` to propose and scope the next Phase 2 task.

## Drive session id

- (empty — populated when the automated `opencode run --session` loop is enabled)
