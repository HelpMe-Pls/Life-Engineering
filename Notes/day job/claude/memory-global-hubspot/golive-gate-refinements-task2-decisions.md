---
name: golive-gate-refinements-task2-decisions
description: Operator decisions + review findings for the go-live gate refinements (2a/2b/2c) shipped 2026-07-14
metadata: 
  node_type: memory
  type: project
  originSessionId: 1fec9c94-2714-446c-bd17-86ddab1d87f9
---

2026-07-14: Implemented the `next-steps.md` "Agent-ready queue" Task 2 (go-live gate refinements) on branch `feat/go-live-gate-refinements`. Operator decisions locked:

- **⚠ SUPERSEDED by #273 (2026-07-14) — see below.** The original 2b (transition-guarded coupling, sentinel "Auto: one training complete, one pending…") shipped in #269 but left two INVALID states reachable (both-complete stuck at Not-ready/Exception). It was fully reworked.
- **FINAL go-live coupling model (#273, operator-confirmed table):** go-live **readiness is a PURE FUNCTION of the training-completion COUNT**, re-derived on every training change, overwriting any prior verdict. Table: BOTH complete⇒Ready only (Not-ready+Exception barred); EXACTLY ONE⇒Not-ready|Exception allowed, auto-derives Exception+reason **"Review before go-live."** (Ready barred); ZERO⇒manual (all allowed). Enforced at THREE layers: client greying (`GoLiveReadinessEditor`, `trainingCompleteCount` prop) · server guards in `updateTrainingStatus`/`updateGoLiveReadiness` with **TOCTOU conditional writes** (re-assert the count, 0-rows→retry error) · **DB CHECK `chapters_readiness_matches_training_chk` (migration 0027)** = the atomic backstop. Converged via a **4-round exhaustive adversarial state-space workflow** — each round caught a distinct hole (transition guards → one-complete manual case → asymmetric TOCTOU → unguarded count-lowering write); the DB CHECK closed the last class. **0027 validated on local Postgres (14/14 cells) + ALREADY APPLIED TO PROD by operator 2026-07-14.** Shipped via #273→dev, folded into promotion #271.
- **2c** — blocker blocks ONLY `import→go_live` (go-live only, NOT every advance); the blocker gate sits ABOVE the Exception bypass (a blocker halts go-live even with an audited exception). Added `blocker_status` to `StageGateChapter` + the select in `advanceStageWithNote`, threaded `blockerActive` into `AdvanceForm`+page.
- **2a** — disable "Exception" `<option>` when both trainings complete; kept visible+disabled; "why" surfaced via a visible help line + `aria-describedby` on the `<select>` (NOT the unreliable `<option title>`); never clobbers an already-audited exception current value.

**Review FINDING (fixed):** the 2c gate first checked `typeof blocker_status==='string' && trim>0`, but the client derives `blockerActive` via `asBlockerStatus()` which narrows legacy `'none'→null` → client/server could DISAGREE (button enabled, server rejects). FIX: gate now uses `asBlockerStatus(chapter.blocker_status) !== null` — same read boundary as the client. Regression test pins it. See [[subwave-operating-model-queued-pr225]] (DEC-C) and [[queue-subwave-golive-gate-pr267]] (task origin).

**Task 1 (bulk "Add to subwave"): ✅ SHIPPED.** `/prototype` gate cleared — operator approved Variant A (anchored popover, HealthEditor pattern; chevron-free input suppressed via `.subwave-input` CSS). `setChaptersSubwave` mirrors `moveChaptersToWave`; `BulkSubwavePopover` mirrors `HealthEditor`. Review fix: outside-click ignores mousedown while the input is focused so a native `<datalist>` suggestion click can't close the popover early.

**Both merged to `dev`** (2026-07-14): #269 (go-live gate) + #270 (bulk subwave), each after 3 parallel adversarial reviews. Docs close-out #272. **Promotion PR #271 (`dev`→`main`) is OPEN and left UNMERGED for the operator** — carries #269/#270 + the previously-unpromoted #260 set (Plan C #259, rebrand #261, UI #262, stalled-threshold #263/#264/#265 incl. 0026, docs #267/#268). 0026 already in prod → no prod-DB action owed. Merge with a plain merge commit + HITL #1 deployed-smoke. Close-out state: only main+dev remain (local+remote). See [[promotion-merge-convention]] + [[pr-merge-gate-check-by-type]].
