---
description: Run the full QA loop — start the app, test in browser, verify, and file GitHub issues.
agent: reviewer
---

Run the full QA loop on the current checkout.

1. Start the app: `pnpm dev >/tmp/staysite-dev.log 2>&1 &`, poll `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000` until `200`, then `pkill -f "next dev"` when finished.
2. Test in the browser (Playwright) at `http://localhost:3000`:
   - `/` marketing landing (hero, 4-step journey, trust bar, CTA).
   - `/builder` — complete all 7 questionnaire steps; confirm the Generate CTA enables only when valid.
   - Generate (needs `OPENAI_API_KEY`; if absent, report generation as untestable and test the builder UI shell + landing only).
   - `/preview/[siteId]`, `/rooms`, `/gallery`, `/location`, `/contact` — header nav, booking CTA, images/alt, map, headings.
   - Resize to mobile (~390px) and check responsive stacking.
3. Verify: `pnpm typecheck`, `pnpm lint`, and `pnpm verify` for template/SEO changes.
4. File one GitHub issue per real finding via `gh issue create` (title, repro steps, expected vs actual, `file_path:line_number`, suggested fix; label `bug` or `enhancement` when they exist).

Report a prioritized list of blockers / warnings / notes with issue numbers and file:line references. Never modify code.
