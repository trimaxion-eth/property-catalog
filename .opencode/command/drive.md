---
description: Run one autonomous iteration of the StaySite loop — pick a task, delegate, verify, merge if green, and report.
agent: lead
---

Run exactly **one** iteration of the StaySite development loop, then stop and report.

1. **Read state** — `STATE.md`, `spec.md`, `implementation-plan.md`, and `gh issue list --state open`.
2. **Pick one task** — the single highest-priority next task:
   - If open issues exist, choose the most impactful one. Anything blocking `pnpm verify` (e.g. issue #1) comes first.
   - If no issues are open, delegate to `idea` → `product` to propose and scope one new task, then create a GitHub issue for it.
3. **Implement** — delegate to `engineer`: implement on a new branch, run `pnpm verify`, and open a PR referencing the issue (`closes #N`).
4. **Review** — delegate to `reviewer`: browser QA + `pnpm verify` + convention checks of the change.
5. **Merge if green** — merge only when both hold: `pnpm verify` passed **and** `reviewer` reported no blockers.
   - Green → `gh pr merge <pr> --squash --delete-branch`, then close the linked issue.
   - Not green → leave the PR open and file a follow-up issue per blocker.
   - **Never merge** a PR that touches `.opencode/`, `.cursor/`, or `opencode.json` — leave those for the user.
6. **Record** — update `STATE.md` (current phase, in-flight issue, last completed, next actions).
7. **Commit & push** — commit only files this iteration actually changed (STATE.md + docs); do **not** sweep unrelated uncommitted files into the commit.

Stop after one task. Report concisely: issue #, branch/PR, merge result, verification results, reviewer findings, and the updated `STATE.md` contents.
