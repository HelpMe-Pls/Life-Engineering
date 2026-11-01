---
name: pr-merge-gate-check-by-type
description: "Before merging a PR, gate on its type — docs-only can merge straight through; any non-docs PR must have GREEN CI + zero conflicts (mergeable/CLEAN) first; if CONFLICTING, resolve it hunk by hunk from each side's primary source, re-run the checks, then re-gate"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 69dbf090-ad70-47e6-9276-9ba82ee86578
  modified: 2026-07-27T10:59:50.622Z
---

Standing merge discipline (khoi.le, 2026-07-08): **check a PR's gates before merging, scaled to its type.**

- **Docs-only PRs** (only `docs/**`, `*.md`, `next-steps.md`, plan docs, decision records — no `website/` code/migration): safe to **merge straight through** once opened. No need to wait on CI. This session's #224/#225/#226 (all docs) were merged immediately — correct.
- **Any non-docs PR** (touches `website/` code, migrations, config, tests, CI): **do NOT merge until its gates are green:**
  - **CI green** — `env -u GH_TOKEN gh pr checks <n> --repo EO-Vietnam/global-hubspot` shows the **CI gate (Chromium, local Supabase)** = `pass` (not pending/failing). Never merge on red or pending.
  - **Zero conflicts / mergeable** — `gh pr view <n> --json mergeable,mergeStateStatus` = `MERGEABLE` / `CLEAN`. If it's `CONFLICTING`/`DIRTY`, **do NOT merge** — work through the conflict hunk by hunk: read each side's primary source (commit, PR, ticket), keep both intents where they fit, re-run the checks, then re-check the gate. Never force a merge over conflicts, never `--abort` and retry blind, and on a pushed branch merge the base in rather than rebase (a rebase needs a force-push). The mattpocock `/resolving-merge-conflicts` skill that used to do this was removed upstream on 24 Sep 2026 (v1.3.0) with no replacement.
  - Same bar for a **dev→main promotion** (it deploys prod) — CI green + CLEAN + explicit stakeholder go-ahead, merge via **merge commit** ([[promotion-merge-convention]]).

Why: docs can't break the build or prod, so gating them on CI just adds latency. Code PRs can — merging one on red/pending or over conflicts risks shipping a broken `dev` (and thence prod). The classifier normally blocks agent-run `gh pr merge`; when the stakeholder has given a green light to merge, still honor these gates myself before doing it.

**⚠ `gh pr merge` REFUSES while the Vercel preview check is `pending`, and its refusal reads like advice, not an error** (2026-07-27). It prints *"To have the pull request merged after all the requirements have been met, add the `--auto` flag"* and nothing else — no "failed", no obvious non-zero signal in a piped tail — so in a batch of commands it scrolls past as if the merge happened. Two merges in the same session went through only because Vercel had already settled; the third looked identical and did not. **Always verify with `gh pr view <n> --json state,mergedAt` after merging** ([[queue-subwave-golive-gate-pr267]] is the same rule from the opposite direction: a merge that silently *succeeded*). `UNSTABLE` + everything either `pass` or `skipping` except a pending Vercel = nothing is wrong, just wait for the deploy and retry; poll the check state rather than sleeping blind.

Relates to [[close-out-branches-only-main-dev]] (delete the branch after merge → only main+dev remain), [[promotion-merge-convention]], [[ci-e2e-webserver-google-font-fetch-flake]] / [[ci-supabase-start-ecr-pull-rate-limit]] (a RED that's a known flake → `gh run rerun --failed`, not a merge-anyway).
