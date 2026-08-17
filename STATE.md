# StaySite — Autonomous Loop State

Durable state for the self-improving drive loop. Updated after every iteration and committed to `main`.

## Current phase

- **Phase 1 (Generator): complete.**
- **Phase 2 (Publishing & Accounts): not started.**

## Working tree hygiene

The drive loop must only stage/commit files it actually changes — never sweep unrelated dirty files into a commit.

## In-flight

- (none — PRs #7 and #8 merged)

## Last completed

- Merged PR #7 (issue #1: `pnpm verify` h1 check) and PR #8 (issue #3: Leaflet marker icons). `pnpm verify` now passes end-to-end: `typecheck` + `lint` + `build` + `scripts/verify-phase1.mjs` all green. Both issues auto-closed. Commits `0d909b8` (#7) and `90665cb` (#8).

## Open issues (backlog, newest last)

| # | Title | Type | Priority |
|---|-------|------|----------|
| 2 | Preview pages show default title instead of site title + duplicate meta description | bug | 1 |
| 4 | Floating "Hide layouts" toggle overlaps site header, blocks nav/Book Now | bug | 2 |
| 5 | Missing favicon: `/favicon.ico` returns 404 | enhancement | 3 |
| 6 | Marketing landing LCP image missing `priority` | enhancement | 4 |
| 9 | Builder Location step: blank "Add highlight" row blocks Generate with no inline error | bug | 5 |

## Next actions

1. Fix issue #2 next (preview title + duplicate meta description), then #4 (bugs), then #5, #6 (enhancements), then #9.
2. When backlog is empty, delegate to `idea` → `product` to propose and scope the next Phase 2 task.

## Drive session id

- (empty — populated when the automated `opencode run --session` loop is enabled)
