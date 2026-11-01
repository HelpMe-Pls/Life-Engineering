---
name: promotion-merge-convention
description: dev→main promotions use plain merge commits and never delete branches; includes the full per-PR + promotion + docs close-out runbook
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8f8c1093-92a4-42e2-9f9d-33e2ed525f05
---

Kh0iLe (2026-06-10): after any merge, `dev` and `main` must still exist — only feature branches get cleaned up.

**Why:** `gh pr merge --delete-branch` on a dev→main promotion PR deletes the HEAD branch, i.e. `dev` itself — a one-flag footgun.
**How to apply:** feature PR → dev: `--squash --delete-branch` (fine — head is the feature branch). Promotion PR dev → main: `--merge` only, never `--delete-branch` (repo convention is merge commits, like PRs #35/#41/#43). Per-PR merge approval still applies — see [[policy-guardrails-this-repo]].

## Close-out sequence (reviewed + confirmed by Kh0iLe 2026-06-29)

The canonical runbook after a PR's CI goes green. All `gh` via `env -u GH_TOKEN` + `Kh0iLe` account + `--repo EO-Vietnam/global-hubspot` ([[gh-account-kh0ile-env-token]]); gates from `website/` on Node 24.x (`fnm use 24`) to match CI/Vercel.

**⭐ Auto-approval (Kh0iLe, 2026-07-01):** steps A→B→D for any `dev`-targeted PR are AUTO-APPROVED — run them myself without asking (merge + close out). Only step C (`dev`→`main` promotion) needs an explicit per-promotion go-ahead. See the STANDING POLICY box in [[policy-guardrails-this-repo]].

**A. Per-PR merge (feature/docs → `dev`):** (1) verify green BEFORE merge — `gh pr checks <N>` + `gh pr view <N> --json mergeable,mergeStateStatus` must show the `CI gate (Chromium, local Supabase)` pass, Vercel pass, post-deploy smoke `skipping` (prod-only), `MERGEABLE/CLEAN`; if pending, `gh run watch <run-id> --exit-status`; never merge while failing/pending. (2) `--squash --delete-branch`. (3) confirm `MERGED` via `gh pr view <N> --json state,mergeCommit` (merge runs silently — VERIFY, don't trust empty stdout). (4) `git checkout dev && git fetch origin --prune && git pull origin dev`.

**B. Issue close-out (only if a tracked issue is linked):** "Closes #N" does NOT auto-close (feature PRs target `dev`, not the default branch) — tick the issue's acceptance-criteria checkboxes (`- [ ]`→`- [x]`) via `gh issue edit --body-file`, then `gh issue close`. See [[closes-keyword-needs-manual-close-on-dev]] + [[check-off-acceptance-criteria-before-closing]]. If no issue is linked (work came from next-steps.md / a direct request), verify there's nothing to close and say so.

**C. Promotion (`dev` → `main` = ship to prod) — ONLY when the user asks:** (6) `git log --oneline origin/main..origin/dev` to confirm scope; check any migration in the delta is already prod-applied + idempotent. (7) open promotion PR base `main` ← head `dev` (or update an existing one's title/body to current scope). (8) wait for its CI gate green on the combined `dev` head. (9) merge with `--merge` (NEVER squash/`--delete-branch`). ⚠️ triggers prod auto-deploy → needs EXPLICIT per-promotion go-ahead ([[policy-guardrails-this-repo]]). (10) verify prod: Vercel prod deploy `READY` for the merge SHA + verified author, post-deploy smoke green, canonical domain 200. (11) confirm `origin/dev` is an ancestor of `origin/main`.

**D. Docs close-out:** update `docs/plans/next-steps.md` (single source of truth) on a `docs/...` branch → PR → merge to `dev`: refresh status line, record what shipped compactly (git history holds detail), de-noise stale content (drop completed plan blocks), keep the forward "Engineering queue" clean for a fresh session.

## Squash-divergence wrinkle (hit + resolved 2026-06-15 PM)

PR #79 promoted via *squash* (not a merge commit), so `main`'s squash commit wasn't in `dev`'s ancestry → the next promotion PR (#90) showed CONFLICTING across ~5 files even though `dev`'s content was a strict superset (`git diff origin/main..origin/dev` confirmed only the new features differed, nothing unique on main). Fix: branch off `dev`, `git merge -s ours origin/main` (keeps `dev`'s tree exactly — VERIFY `git diff dev..HEAD` is empty), PR that into `dev` and merge it with a **merge commit** (NOT squash, or the `main` parent is dropped and it doesn't help). That clears the divergence so the promotion PR fast-forwards; then merge the promotion with `--merge`. Realigned via PR #91 (reconcile) + PR #90 (promotion, merge commit `43426f0`). Lesson: ALWAYS promote with a merge commit so this never recurs.

## (2026-09-06, promotion #856) Two things that nearly cost a wrong action

**`mergeStateStatus: BEHIND` on a promotion PR is TRANSIENT, and "fixing" it is the wrong action.** `Protect main` really does carry `strict_required_status_checks_policy=true` with no bypass actors, so BEHIND reads like a hard block. It is not: while the required checks were still pending the PR reported `MERGEABLE / BEHIND`, and the moment the aggregate settled it flipped to `MERGEABLE / CLEAN` and merged normally. ⚠ **Do NOT resolve it by merging `main` into `dev` or pressing "Update branch"** — the commits `main` holds that `dev` lacks are the PREVIOUS promotions' own merge commits (measured: 3 of them, and `git diff <merge-base> origin/main` is EMPTY, so they carry no content). Merging them back would pollute the model that makes this repo's promotions fast-forward cleanly. **The check that settles it: `git diff --stat $(git merge-base origin/main origin/dev) origin/main` — blank means BEHIND is structural, not a content gap.**

**Run the BROWSER half locally before a promotion, even though no rule requires it.** Nothing else will: `ci.yml`'s legs are browser-free by design (DEC-LOCAL-GATE) and `.githooks/pre-push` defers `test:e2e` unless `EO_GATE=full`, so a promotion can reach production having never had Playwright run on its content. That is normally fine — except the after-merge full check is ARMED (`FULL_CHECK_AFTER_MERGE=1`) and `revert-red-merge.mjs` reverts production on red **unattended**. ⚠ **A FLAKE IS ENOUGH**: the flake does not repeat on the revert branch, so the revert's own checks go green and the revert merges, silently taking the promotion out of production. Converting that unknown costs ~2.5 minutes:

```
env NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 NEXT_PUBLIC_SUPABASE_ANON_KEY=<local anon> SUPABASE_SERVICE_ROLE_KEY=<local service> fnm exec --using=<.nvmrc> -- npm.cmd --prefix <abs>/website run test:e2e
```

⚠ **Check port 3100 first** — `playwright.config.ts` sets `reuseExistingServer: !isCI`, so a stale server there is silently tested INSTEAD of the new code, and the run passes. `netstat -ano | grep ":3100 "` must be empty. Outbound email is safe by construction: the config forces `RESEND_API_KEY: ''` and the local Supabase URL, overriding `.env.local`. Measured on #856: **134 passed, 0 failed, 0 skipped, 2.4m**.

**And the required check's NAME is not one of the visible legs.** The rollup shows four legs plus Vercel; the required check on `Protect main` is the AGGREGATE, `CI gate (Chromium, local Supabase)` (`ci.yml:131`), which appears only after the legs finish and takes ~4s. Read its own `conclusion` from the jobs API — `gh pr checks` prints "pass" for a SKIPPED check too, and on the same PR `Post-deploy public smoke` legitimately reports `skipping`. Related: [[pr-merge-gate-check-by-type]], [[deployed-smoke-baseurl-and-prod-marker]].
