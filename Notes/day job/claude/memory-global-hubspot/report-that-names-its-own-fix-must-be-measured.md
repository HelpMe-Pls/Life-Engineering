---
name: report-that-names-its-own-fix-must-be-measured
description: "A bug report that prescribes its own fix (\"widen the acceptance criteria\") — run that fix against the reported inputs BEFORE scoping a ticket to it"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9b9152dc-7941-4a20-be81-456d46463ba7
  modified: 2026-08-25T16:00:08.058Z
---

When a report arrives with its own remedy attached, the remedy is a hypothesis, not a finding. **Measure it against the actual reported inputs first.**

2026-08-25, the three "chapter can't upload these" workbooks: the ask was *"widen/relax the file acceptance criteria if you have to."* Parsing all three files through the real validator showed **alias-widening fixes ZERO of them** — file 1's real header row already says `First Name`, `Last Name`, `Email` verbatim (row 0 is a colour legend with merged cells); file 2's first sheet is a 4-cell KPI tab while five other sheets have clean headers; file 3 has one combined `Name` column, which no alias can express. The real defects were `SheetNames[0]` and `aoa[0]` — and **duplicated in `csv-export.ts`**, so fixing only the validator would have shipped a blank-column CSV.

**Why:** a prescribed fix silently sets the ticket's scope, its tests, and its "done". Three tickets scoped to aliases would each have gone green and the chapter would still be blocked — the worst failure shape, because it looks like delivery.

**How to apply:** before writing the ticket, run the proposed fix against the reported input and state the per-input result in the body. Where the premise is false, say so in the ticket ("⚠ this fixes zero of the three") and keep the prescribed work as its own independent slice if it still has value for the *next* input. See [[recurring-bug-class-needs-enumeration]] for the same instinct one level up. Related: [[widening-a-set-can-disarm-an-unstated-gate]].
