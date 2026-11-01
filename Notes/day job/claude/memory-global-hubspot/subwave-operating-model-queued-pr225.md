---
name: subwave-operating-model-queued-pr225
description: 2026-07-08 — the SUBWAVE OPERATING MODEL (5 tasks) queued to next-steps.md + plan doc via PR
metadata: 
  node_type: memory
  type: project
  originSessionId: 69dbf090-ad70-47e6-9276-9ba82ee86578
---

2026-07-08: explored `resources/[Plan] EO_Edge8_Chapter_Onboarding_Subwave_Operating_Model.docx` and turned it into agent-ready queue work to optimize /admin. Settled the design with a `/grilling` session BEFORE queueing (user's explicit ask), then wrote it up via **PR #225 (merged to dev)**: a deep plan doc `docs/plans/SUBWAVE-OPERATING-MODEL.md` + 5 queue tasks + **DEC-SUBWAVE-MODEL**.

**The core shift:** tracker becomes a DUAL-TRACK readiness tool (data AND chapter-staff training), grouped in subwaves of ~4 chapters, with owner/blocker/readiness visible on the board — **WITHOUT any stage-enum change**.

**Grilling-pinned forks (DEC-SUBWAVE-MODEL — do NOT re-open):**
- **DEC-A (load-bearing): training is a PARALLEL TRACK, not stages.** Plan literally said "real stages" but current_stage is a single linear Postgres enum (0001) + the plan's own timeline runs training in parallel → two `training_*_status` fields gate go-live instead. Avoids a risky live-DB enum reorder.
- **DEC-C: dual-track go-live HARD-BLOCKS by default + audited EXCEPTION override (+required reason)**, at the existing chokepoint advanceStageWithNote actions.ts:149-158 (import→go_live branch).
- **DEC-D: TRACK-ONLY comms** (EO owns training/office-hours invites per plan RACI); fields shaped for a later notifyTrainingInvite().
- **DEC-B: subwave = new nullable chapters.subwave column + board sub-grouping** (real subdivision: app has ~10 chapters/wave across 23 waves; plan subwave=~4). Mirrors the wave column (0016).
- **DEC-fields: blocker_status + stage-owner(as name+email CONTACT, not org enum) are NEW; primary_contact already exists (0001+0006) → surface only; open-issues REUSES chapter_notes + a resolved_at flag (NO new table).**

**Queue tasks:** P0 = SUBWAVE-DUAL-TRACK-GOLIVE · SUBWAVE-BLOCKER-OWNER-FIELDS · SUBWAVE-BOARD-VISIBILITY; P1 = SUBWAVE-GROUPING · SUBWAVE-OPEN-ISSUES. Field-wiring template = updateTargetGoLive (app/admin/actions.ts:166-208, requireAdmin+writeAudit{previous,next}). Additive nullable migrations + CHECKs (RLS auto-covers; chapter user CAN read own training cols = acceptable). Migration ~0020.

**docx extraction gotcha:** this docx's tables embed nested w:tcPr markup inside w:t runs → naive `<w:t>` regex leaks XML into cell text. Fix: extract, then scrub residual `<...>` tags + `w:*="..."` attrs as a post-pass. Whole doc = ~18k chars clean signal (from 290k raw). Per-section files under scratchpad/plandoc/.

**BRANCH CLEANUP (user asked to close out ALL stale branches):** deleted 6 absorbed local branches; now **only dev + main remain** (local AND remote), zero open PRs. KEY lesson: after a SQUASH merge, `git branch --merged` / `git cherry` / `git merge-base --is-ancestor` all report the branch as NOT merged (the squash commit has a new SHA — no patch-match). Do NOT trust those for squash-merged branches. The authoritative safe-delete proof: confirm the PR is MERGED (gh pr view) AND diff the branch's OWN touched files (vs its merge-base) against dev — identical = absorbed → `git branch -D` (‑d refuses squash-merged). One branch showed 2 "differing" files that were just dev being AHEAD (a later PR touched the same files) — verify direction before worrying. See [[promotion-merge-convention]], [[gh-pr-merge-dirty-worktree]].
