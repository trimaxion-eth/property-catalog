# StaySite — Autonomous Loop State

Durable state for the self-improving drive loop. Updated after every iteration and committed to `main`.

## Current phase

- **Phase 1 (Generator): complete.**
- **Phase 2 (Publishing & Accounts): not started.**

## In-flight

- (none)

## Last completed

- Fixed design blockers **B1** (keyboard focus indicators on `BookNowButton`, `ui/Button`, accent links) and **B2** (accent-color contrast guard — `apply-site-style.ts` emits `--site-accent-foreground` / `--site-accent-readable`). Commit `2161912`.
- Merged PR #11 (issue #4): layout-controls toggle moved bottom-right, no longer overlaps header. `pnpm verify` green, no blockers. Commit `b2950e5`.
- Merged PR #10 (issue #2): preview pages render site title/meta as React elements. Commit `9355149`.
- Merged PR #8 (issue #3): bundled Leaflet default marker icons. Commit `90665cb`.
- Merged PR #7 (issue #1): `pnpm verify` passes — home h1 delegated to hero layouts. Commit `0d909b8`.
- Design analysis filed as issues **#12–#23**.

## Open issues (backlog)

Source of truth: `gh issue list --state open`. Priority order:

| # | Title | Type | Priority |
|---|-------|------|----------|
| 9 | Builder Location step: blank "Add highlight" row blocks Generate with no inline error | bug | 1 |
| 17 | Low-contrast disabled Button state and hand-rolled retry button | bug | 2 |
| 18 | Builder shell has no document-level h1 | bug | 3 |
| 19 | Decorative marketing mockups are read by screen readers | bug | 4 |
| 20 | Incomplete ARIA tabs pattern in RotatableSection layout picker | bug | 5 |
| 5 | Missing favicon: /favicon.ico returns 404 | enhancement | 6 |
| 6 | Marketing landing LCP image missing priority property | enhancement | 7 |
| 12–16, 21–23 | Design enhancements (surface/border tokens, template copy, nav dedupe, hero contrast, focus follow-up, radius/color tokens) | enhancement | 8 |

## Next actions

1. Fix **#9** first (blocks Generate), then remaining bugs (#17–#20), then enhancements (#5, #6, #12–#23).
2. When backlog is empty, delegate to `idea` → `product` to propose and scope the next Phase 2 task.

## Drive session id

- (empty — populated when the automated `opencode run --session` loop is enabled)
