---
name: minimal-gate-is-the-wanted-state
description: "The bare CI gate in global-hubspot is the DESIRED end state, not a gap to be filled — confirmed by the operator 2026-09-22. Never add a step to .githooks/pre-push or ci.yml, and specifically never add the `vitest run --changed origin/dev` step the 2026-09-20 spec asked for; it is WITHDRAWN. Standard checks/guards/QA run only on an explicit contributor command."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c2511ad7-47a0-4233-bc68-92832318278a
  modified: 2026-10-26T05:57:52.361Z
---

**Operator, 2026-09-22, twice in one session:** the checks answer _does this compile, lint and build?_ plus four public assertions after a promotion, and **that is the trade being bought**. Anything in CI/CD that blocks or slows the `dev`→prod duration must be deferred. Tests, guards, QA and QC run **only under an explicit command from a contributor**.

**Why:** the `dhajdu` contributor's time-to-prod is the thing being optimised, deliberately, with a regression reaching production accepted as the cost (`DEC-SHIP-FIRST`). A gate step is paid for on **every push**, by everyone, forever — so "just one cheap step, for safety" is not a small ask, it is a standing tax.

**How to apply:**

- **Do not add a step to `.githooks/pre-push` or `.github/workflows/ci.yml`.** Not for safety, not for a regression you just found, not "only when files change".
- ⚠ **The 2026-09-20 three-part specification is WITHDRAWN, not pending.** It asked for `npx vitest run --config vitest.fast.config.ts --changed origin/dev` in the hook after `npm run build`, a schedule-only full run, and one backlog issue per red. `docs/plans/next-steps.md` invited an agent to implement it for two days; I nearly did. **Part 3 also contradicts the ⚡ queue's zero-open-GitHub-issues objective** — a workflow that auto-files a backlog issue on red is the thing the tracker rule forbids.
- **The after-merge cover was settled on 2026-10-24 (`DEC-NO-REVERT`, #1148/#1149):** the regression run, Mondays and Thursdays (its file is `regression-run.yml` since #1158, 2026-10-26), skipped when `dev` has not changed under `website/`, an issue per red, NO revert. `nightly-cross-browser.yml` and `revert-on-red` are deleted. A scheduled job is not a gate step, so it does not break this rule; changing its cadence is still the operator's call (they picked Mon+Thu over daily and Sunday-only).
- **The operator prefers SKIPPED over RED for a job that cannot run** (2026-10-24: "The Claude credential check can be skipped").
- **The test-suite sweep is NOT in CI any more** (`DEC-SWEEP-ON-DEMAND`, #1158, 2026-10-26): it never had a credential and skipped every Sunday, so the operator moved it to the user-invoked `/test-suite-sweep` skill, run on a person's machine. Never propose putting it back on a schedule or adding a Claude secret to the repo. Its unattended prompt: `C:\Users\leekh\Documents\Edge8\AFK\Start\Sweep [global-hubspot test suite] AFK prompt.md`.
- **The right response to a defect found off-gate is to FIX it and say nothing runs it**, not to make a machine run it.

⚠ **An open `dev`→`main` promotion PR is itself a tax** — `ci.yml` triggers on `pull_request` into `main`, which includes `synchronize`, so every further `dev` push re-runs the gate until it merges. Say so in the promotion body: merging promptly *is* the fast path. See [[open-promotion-pr-taxes-every-dev-push]].

Related: [[gate-speed-vs-action-minutes]], [[policy-guardrails-this-repo]], [[pr-merge-gate-check-by-type]].
