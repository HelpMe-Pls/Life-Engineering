---
name: batch-2026-07-02-merged-promotion-200-pending
description: "The 2026-07-02 queue batch (#195 in-flight guard ·"
metadata: 
  node_type: memory
  type: project
  originSessionId: c59f4c0f-c357-4504-ab72-a8ba06e8cb0c
---

State as of 2026-07-03: all four PRs squash-merged to `dev` with the operator's explicit green light (dev head `b7b08cd`; merges `7301ba8` #195 → `e679386` #196 → `142f8ce` #199 → `b7b08cd` #198), integrated dev CI **success**. **Promotion PR #200** (dev→main, merge-commit convention, never delete dev) is **open, not merged** — merging it is the prod deploy and stays with the operator.

**After #200 merges:** post-deploy smoke; confirm the prod deployment reports `regions:["sin1"]`; re-probe `/login` TTFB from VN (pre-fix baseline **414ms**, expect <200ms); stakeholder re-tests `/admin` nav (~2s → ~350–600ms); record both numbers in next-steps.md (now "Step 0" of the queue).

**2026-07-03 update:** the Agent-ready queue holds TWO new stakeholder items (docs PR #201, merged to dev `a3505d3` — this also folded into #200's diff, docs-only): **ACCT-STATUS** (never-signed-in admins can show "Active" — status derives solely from `last_sign_in_at`, which Resend/generateLink can stamp; repro the stamping path FIRST — S255 previously found generateLink alone does NOT stamp; fix roster + chapter-detail card + the removeChapterAccount shell gate at actions.ts:740; backfill via prod-DDL path) and **WB-BULKBAR-UX** (bulk bar below the tracker filters — recommended `bulkBar` slot prop on WaveBoard; Reset filters restyled to the Add-chapter primary look when enabled). Full specs in next-steps.md. #197 was closed superseded (cut from wrong base — see [[async-transition-state-defers-until-settle]]). The WaveEditor double-quote format churn from 2026-07-02 is still in `git stash` (pop needs manual reconcile against #195; ReviewCallCard precedent says the contributor may want it kept). 
