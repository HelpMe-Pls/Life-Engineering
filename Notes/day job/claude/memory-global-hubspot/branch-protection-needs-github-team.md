---
name: branch-protection-needs-github-team
description: EO-Vietnam/global-hubspot rulesets are NOW ENFORCED (GitHub Team) — "Protect dev and main" Active, PR required, bypass_actors empty; ⚠ CI IS NO LONGER DARK (disarmed 2026-08-23) so the gate really runs, and strict-up-to-date SERIALISES merges
metadata: 
  node_type: memory
  type: project
  originSessionId: 05cc9d7d-df2e-4fe6-9e40-f3a3528e3c08
  modified: 2026-09-12T04:31:51.890Z
---

**UPDATE 2026-07-17 — rulesets are NOW ENFORCED.** `EO-Vietnam` upgraded to **GitHub Team** (12/12 seats), so the pre-armed ruleset **"Protect dev and main"** (id `17976495`) is **`enforcement: active`** over `refs/heads/{dev,main}`. Verified via `gh api repos/EO-Vietnam/global-hubspot/rulesets/17976495`. Rules: **pull_request required** (`required_approving_review_count: 0` — no human approval needed, merge/squash/rebase all allowed), **required_status_checks** = `CI gate (Chromium, local Supabase)` with `strict_required_status_checks_policy: true`, **non_fast_forward** (no force-push), **deletion** blocked, **`bypass_actors: []`** (nobody bypasses, incl. admins). A second ruleset "Block delete or force push `main` branch" (id `17260218`) is **disabled/redundant** — the active one subsumes it (optional cleanup: delete it).

**Consequences for agents:**
- **No direct push to `dev`/`main`** — you MUST branch → PR → merge. (Feature/docs → dev agent-merges are fine; dev→main promotion needs operator go-ahead.)
- ⚠ **SUPERSEDED 2026-08-23 — CI IS LIVE.** `CI_BILLING_OUTAGE` was deleted after a probe (#610) measured a GitHub-hosted runner starting; the gate now runs for real (~10-12 min: format → typecheck → lint → Vitest incl. live → Chromium E2E) and must actually be GREEN. The paragraph below is history, kept because the skip-reads-as-pass trap returns the moment anyone re-arms the switch.
- **(HISTORY) The skipping `CI gate` check did NOT block merges.** While `CI_BILLING_OUTAGE=1` the job skips via job-level `if:` → the check reports **neutral/skipped**, which GitHub treats as **passing** → PRs show `mergeStateStatus: CLEAN` and merge fine (verified: #315/#317/#318 all merged via PR while dark). A skip still verifies nothing, so the full-local-gate merge discipline stays until the variable is deleted (see next-steps HITL close-out).
- `gh pr merge --squash --delete-branch` succeeds SILENTLY (empty output) — verify via `gh pr view <n> --json state` = MERGED.

Historical (pre-2026-07-17, org on Free): rulesets were created-but-UNenforced (403 on `/rulesets` + `/branches/*/protection`; UI showed the "won't be enforced until you upgrade to GitHub Team" banner); D-PROTECT option (c) accepted per-PR+CI control in the interim.

⚠ **`strict_required_status_checks_policy: true` SERIALISES merges.** Every merge into `dev` puts every other open PR at `mergeStateStatus: BEHIND`, and `gh pr merge` then refuses with *"the head branch is not up to date"*. So merge one at a time: `git merge origin/dev` into the next branch, push, wait ~10-12 min for its gate, merge. Batching several PRs and merging them together does not work.

⚠ **`gh pr checks <n>` can show a STALE `pending` row long after the gate finished** (seen 10 polls in a row on #622 while the run itself was `completed success`). Read `gh pr view <n> --json mergeStateStatus,statusCheckRollup` instead — `CLEAN` + `COMPLETED SUCCESS` is the truth.

Full record: `docs/plans/next-steps.md` → HITL close-out, and `.github/workflows/README.md`. Related: [[policy-guardrails-this-repo]], [[promotion-merge-convention]].

**UPDATE 2026-08-27 — the two escape hatches an operator green light suggests DO NOT EXIST here, verified by trying them on #700:**
- `gh pr merge --admin` → `GraphQL: Repository rule violations found — Required status check "CI gate (Chromium, local Supabase)" is in progress`. Rulesets ignore admin privilege unless the actor is in `bypass_actors`, which is `[]`. **Never offer `--admin` as an option in this repo**; it was offered once and refused, which cost a retraction.
- `gh pr merge --auto` → `Auto merge is not allowed for this repository`. Auto-merge is **disabled at the repo level**; enabling it is a repo-settings write (see [[classifier-denies-repo-settings-writes]]). Until an operator flips it, someone has to come back and click after the ~12 min gate.
- Net: **no promotion into `main` can skip the gate, by anyone.** The only path is: wait for `CI gate (Chromium, local Supabase)` = SUCCESS (read the check's own conclusion, not `gh pr checks`), then `gh pr merge --merge`. The `push: main` run that follows is NOT required by any ruleset — only the `pull_request` run is.
- Measured today: gate ≈ 11.6–12.0 min of work; one run sat **5 min in GitHub's runner queue** first (16.5 min total). Merge → Vercel production live = **59 s**.
- ~~⚠ `.githooks/pre-push` is on `dev` (#650) but **not yet promoted to `main`**~~ — **stale since the 2026-09 promotions; measured 2026-09-12: `git ls-tree origin/main .githooks/pre-push` lists it, so `main`-based clones carry the hook too.** The trap that survives is the one-per-clone `git config core.hooksPath .githooks`, without which no branch is gated and the absence looks like a pass.
