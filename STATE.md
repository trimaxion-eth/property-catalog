# StaySite — Autonomous Loop State

Durable state for the self-improving drive loop. Updated after every iteration and committed to `main`.

## Current phase

- **Phase 1 (Generator): complete.**
- **Phase 2 (Publishing & Accounts): not started.**

## Working tree hygiene

The large Phase 1 changeset (soft-preview, AI site styling, marketing landing) was committed in `6c644b5`. The drive loop must only stage/commit files it actually changes — never sweep unrelated dirty files into a commit. (Currently only an incidental local edit to `.opencode/agents/engineer.md` is uncommitted; leave it alone.)

## In-flight

- **Issue #1** — `pnpm verify` fails on the home-page h1 check. Fixed in PR #7 (`fix/verify-phase1-home-h1`), **open / not merged** (merge held per loop instructions).
- **Issue #3** — Leaflet default marker icons 404. Fixed in PR #8 (`fix/leaflet-marker-icons`), **open / not merged** (merge held per loop instructions).

## Last completed

- Issue #3 fix (PR #8, commit `da06150`, closes #3): bundled Leaflet default marker icons (`marker-icon.png`, `marker-icon-2x.png`, `marker-shadow.png`) via static imports + `L.Icon.Default.mergeOptions(...)` in `src/components/builder/PropertyMapPicker.tsx` and `src/components/site/SitePropertyMap.tsx`. Reviewed end-to-end: builder map picker and generated-site Location page both render the marker + shadow with no 404; `typecheck`/`lint`/`build` green; `pnpm verify` fails only at the pre-existing issue #1 h1 check (fixed in PR #7).

## Open issues (backlog, newest last)

| # | Title | Type | Priority |
|---|-------|------|----------|
| 1 | `pnpm verify` fails: `verify-phase1.mjs` expects h1 in `SiteHomeView` but hero h1 moved to section layouts | bug | fixed (PR #7, unmerged) |
| 3 | Leaflet map markers broken: `marker-icon.png` / `marker-shadow.png` 404 | bug | fixed (PR #8, unmerged) |
| 2 | Preview pages show default title instead of site title + duplicate meta description | bug | 3 |
| 4 | Floating "Hide layouts" toggle overlaps site header, blocks nav/Book Now | bug | 4 |
| 5 | Missing favicon: `/favicon.ico` returns 404 | enhancement | 5 |
| 6 | Marketing landing LCP image missing `priority` | enhancement | 6 |
| 9 | Builder Location step: blank "Add highlight" row blocks Generate with no inline error | bug | 7 |

## Next actions

1. Merge PR #7 (issue #1) and PR #8 (issue #3) once merging is allowed.
2. Fix issue #2 next (preview title + duplicate meta description), then #4 (bugs), then #5, #6 (enhancements), then #9.
3. When backlog is empty, delegate to `idea` → `product` to propose and scope the next Phase 2 task.

## Drive session id

- (empty — populated when the automated `opencode run --session` loop is enabled)
