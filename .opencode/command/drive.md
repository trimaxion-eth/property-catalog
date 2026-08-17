---
description: Run one autonomous iteration of the StaySite loop — pick a task, delegate, verify, and report. Never merges.
agent: lead
---

Run exactly **one** iteration of the StaySite development loop, then stop and report. **Do not merge any PRs.**

1. **Read state** — `STATE.md`, `spec.md`, `implementation-plan.md`, and `gh issue list --state open`.
2. **Pick one task** — the single highest-priority next task:
   - If open issues exist, choose the most impactful one. Anything blocking `pnpm verify` (e.g. issue #1) comes first.
   - If no issues are open, delegate to `idea` → `product` to propose and scope one new task, then create a GitHub issue for it.
3. **Implement** — delegate to `engineer`: implement on a new branch, run `pnpm verify`, and open a PR referencing the issue (`closes #N`).
4. **Review** — delegate to `reviewer`: browser QA + `pnpm verify` + convention checks of the change.
5. **Record** — update `STATE.md` (current phase, in-flight issue, last completed, next actions). If a blocker was found, leave the PR open and file a follow-up issue.
6. **Commit & push** — commit only files this iteration actually changed (STATE.md + docs + the branch work); do **not** sweep unrelated uncommitted files into the commit.

Stop after one task. Report concisely: issue #, branch/PR, verification results, reviewer findings, and the updated `STATE.md` contents.
