---
name: async-transition-state-defers-until-settle
description: React 19 defers state set inside startTransition(async …) until the action settles — busy indicators/optimistic updates must be set urgently BEFORE the transition; useActionRunner has a prepare slot for exactly this
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c59f4c0f-c357-4504-ab72-a8ba06e8cb0c
---

Caught by the adversarial review of PR #195 (2026-07-02): I moved handler bookkeeping (busyId, pendingStep, optimistic flips, reducer submit dispatches) INSIDE `startTransition(async () => {…})` for zero-side-effect duplicate drops — but React 19 defers state set inside an async transition until the action settles, so none of it rendered mid-flight: row busy indicators, the checklist grey-out, WaveEditor's #188 optimistic swap and the modal's "Saving…" all silently vanished. Only `isPending`-driven labels survived. Call-count tests and E2E both passed — nothing asserted mid-flight affordances.

**Why:** that deferral is the documented reason `useOptimistic` exists; the pre-existing code set these urgently before `startTransition` deliberately.

**How to apply:** in this repo, mutation handlers go through `lib/use-action-runner.ts` `run(prepare, task)` — urgent visual/optimistic bookkeeping in `prepare` (runs only when the latch is won), awaits + result handling in `task`. Never fold busy/optimistic state into the task. `tests/use-action-runner.test.tsx` locks the contract (prepare urgency + drop-not-queue asserted after settle). Also from the same review: always cut a feature branch from `dev` explicitly (`git checkout -b X dev`) — #197 was accidentally cut from another feature branch and its squash-merge would have reverted that branch's later fix.
