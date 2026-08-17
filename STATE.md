# StaySite — Autonomous Loop State

Durable state for the self-improving drive loop. Updated after every iteration and committed to `main`.

## Current phase

- **Phase 1 (Generator): complete.**
- **Phase 2 (Publishing & Accounts): not started.**

## Working tree hygiene

The large Phase 1 changeset (soft-preview, AI site styling, marketing landing) was committed in `6c644b5`. The drive loop must only stage/commit files it actually changes — never sweep unrelated dirty files into a commit. (Currently only an incidental local edit to `.opencode/agents/engineer.md` is uncommitted; leave it alone.)

## In-flight

- **Issue #1** — `pnpm verify` fails on the home-page h1 check. Fixed in PR #7 (`fix/verify-phase1-home-h1`), **open / not merged** (merge held per loop instructions).

## Last completed

- `f700fca` fix(verify): allow home h1 delegated to hero layouts — `pnpm verify` passes end-to-end (PR #7, closes #1).

## Open issues (backlog, newest last)

| # | Title | Type | Priority |
|---|-------|------|----------|
| 1 | `pnpm verify` fails: `verify-phase1.mjs` expects h1 in `SiteHomeView` but hero h1 moved to section layouts | bug | fixed (PR #7, unmerged) |
| 3 | Leaflet map markers broken: `marker-icon.png` / `marker-shadow.png` 404 | bug | 2 |
| 2 | Preview pages show default title instead of site title + duplicate meta description | bug | 3 |
| 4 | Floating "Hide layouts" toggle overlaps site header, blocks nav/Book Now | bug | 4 |
| 5 | Missing favicon: `/favicon.ico` returns 404 | enhancement | 5 |
| 6 | Marketing landing LCP image missing `priority` | enhancement | 6 |

## Next actions

1. Merge PR #7 (issue #1) once merging is allowed.
2. Fix issue #3 next (Leaflet marker icons), then #2, #4 (bugs), then #5, #6 (enhancements).
3. When backlog is empty, delegate to `idea` → `product` to propose and scope the next Phase 2 task.

## Drive session id

- (empty — populated when the automated `opencode run --session` loop is enabled)
