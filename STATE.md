# StaySite — Autonomous Loop State

Durable state for the self-improving drive loop. Updated after every iteration and committed to `main`.

## Current phase

- **Phase 1 (Generator): complete.**
- **Phase 2 (Publishing & Accounts): not started.**

## Working tree hygiene

The drive loop must only stage/commit files it actually changes — never sweep unrelated dirty files into a commit.

## In-flight

- (none)

## Last completed

- Merged PR #11 (issue #4: floating "Hide layouts" toggle overlapped site header, blocking nav Menu / Book Your Stay clicks). Fix moves the layout-controls toggle wrapper in `src/components/preview/PreviewSiteProvider.tsx` from `fixed right-4 top-4 z-50` (top-right, overlapping the sticky header) to `fixed bottom-4 right-4 z-50` (bottom-right). Reviewer QA confirmed no overlap at 390px (Menu) and 1280px (Book Your Stay), toggle still functional, `pnpm verify` green, NO BLOCKERS. Commit `b2950e5` (squash). Issue #4 auto-closed.

## Open issues (backlog, newest last)

| # | Title | Type | Priority |
|---|-------|------|----------|
| 9 | Builder Location step: blank "Add highlight" row blocks Generate with no inline error | bug | 1 |
| 5 | Missing favicon: `/favicon.ico` returns 404 | enhancement | 2 |
| 6 | Marketing landing LCP image missing `priority` | enhancement | 3 |

## Next actions

1. Fix issue #9 next (Builder Location step: blank highlight row silently blocks Generate), then #5, #6 (enhancements).
2. When backlog is empty, delegate to `idea` → `product` to propose and scope the next Phase 2 task.

## Drive session id

- (empty — populated when the automated `opencode run --session` loop is enabled)
