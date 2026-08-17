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

- Merged PR #10 (issue #2: preview pages showed default title + duplicate meta description). Fix renders `<title>`/`<meta>` as React elements (`SitePageMetadata.tsx`), opts the preview subtree out of the layout defaults (`preview/[siteId]/layout.tsx` `metadata: { title: null, description: null }`), and deletes the now-unused imperative `document-meta.ts`. Verified: one site-specific title + one description per preview page, og/robots intact, no stale meta across client-side nav, landing/builder unaffected. `pnpm verify` green; reviewer reported NO BLOCKERS. Commit `9355149`. Issue #2 auto-closed.

## Open issues (backlog, newest last)

| # | Title | Type | Priority |
|---|-------|------|----------|
| 4 | Floating "Hide layouts" toggle overlaps site header, blocks nav/Book Now | bug | 1 |
| 5 | Missing favicon: `/favicon.ico` returns 404 | enhancement | 2 |
| 6 | Marketing landing LCP image missing `priority` | enhancement | 3 |
| 9 | Builder Location step: blank "Add highlight" row blocks Generate with no inline error | bug | 4 |

## Next actions

1. Fix issue #4 next (Hide layouts toggle overlap — blocks nav/Book Now clicks), then #9 (bug), then #5, #6 (enhancements).
2. When backlog is empty, delegate to `idea` → `product` to propose and scope the next Phase 2 task.

## Drive session id

- (empty — populated when the automated `opencode run --session` loop is enabled)
