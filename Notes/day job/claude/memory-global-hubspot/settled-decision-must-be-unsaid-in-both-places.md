---
name: settled-decision-must-be-unsaid-in-both-places
description: Recording a settled fork in the ISSUE BODY alone leaves the ticket parked — next-steps.md is read first and its stale wording wins
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9b9152dc-7941-4a20-be81-456d46463ba7
  modified: 2026-08-26T05:57:59.720Z
---

When an operator settles a fork, the decision has to be written into **both** the issue body **and** `docs/plans/next-steps.md`. Updating only the body is worse than updating neither, because the two then contradict each other and **the spine wins**.

2026-08-26: I appended `✅ SETTLED 2026-08-26` to #661 and `✅ RATIFIED` to #663, and left the 🧑 section of `next-steps.md` still calling both "an UNANSWERED fork" and "answered by recommendation — ratify or reverse before the relevant agent starts". An audit caught it before the unattended session ran:

> "the spine is the first thing every Build recipe reads — so the two tickets whose bodies say 'SETTLED 2026-08-26' are exactly the two an obedient agent will park."

**Why:** every Build recipe opens `next-steps.md` first. An agent that reads "this is an open operator fork, do not start" has *explicit written grounds* to park, and parking is the correct, obedient behaviour — so the failure is silent and looks like discipline. The body it would have contradicted is read second, or not at all.

**How to apply:** settling a fork is a **two-file edit, always**. Grep the spine for the issue number before declaring a fork closed — `grep -n "#<N>" docs/plans/next-steps.md` — and delete the stale bullet in the same change. The same rule governs the reverse: a ⚡ line promising work an issue no longer contains. Related: [[next-steps-parallel-edits-sync-first]], [[report-that-names-its-own-fix-must-be-measured]].
