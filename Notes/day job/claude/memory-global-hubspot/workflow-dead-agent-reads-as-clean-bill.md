---
name: workflow-dead-agent-reads-as-clean-bill
description: "In a Workflow script agent() returns null when an agent dies, and `v || {verdicts: []}` turns that death into \"nothing found\" — the dangerous direction"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 798f99d2-7365-4317-8034-6187e75f46bb
  modified: 2026-08-29T09:04:29.850Z
---

`agent()` in a Workflow script returns **`null`** when the subagent dies on a terminal API error (529, ENOTFOUND, connection lost mid-response). The idiomatic-looking guard `.then(v => v || { verdicts: [] })` therefore converts **a verifier that never ran** into **a verifier that found nothing**, and the aggregate reports a clean bill of health.

Measured 2026-08-29 on the ticket-readiness fan-out: 3 of 7 agents took network errors. Two were verifiers, so the run returned `confirmed: []` — while nine real, evidence-backed defects sat unjudged in the journal. The findings were only recovered because the journal was read directly rather than trusting the return value.

**Why:** a fan-out's failure mode is silence, and silence and "all clear" are the same shape. The empty array is indistinguishable from a real all-clear at the call site, and it arrives exactly when you are most inclined to stop.

**How to apply:**

- **Never default a dead agent to an empty result.** Use a distinct sentinel — `verdicts: null` plus a `note` — and split the aggregate into `confirmed` **and `unjudged`**, so a death has to be looked at rather than skipped.
- **Read `journal.jsonl` before believing an empty aggregate.** It holds one `{"type":"result",…}` line per completed agent with its full return value, and the task notification's `<failures>` block names which labels died.
- The repo already carries the principle in `docs/plans/next-steps.md` → _Standing traps_: **"A verifier that DIED is unjudged, not refuted"** — this is the concrete scripting shape of it. See also [[verifier-fleet-leaves-source-mutations]] and [[background-workflow-shell-hang]].
- Failed legs are cheap to recover: `Workflow({scriptPath, resumeFromRunId})` replays every unchanged `agent()` call from cache and re-runs only what died.
