---
name: audit-row-order-stops-vs-enables
description: "When a record gates a future action, write it BEFORE the act if it STOPS one and AFTER if it ENABLES one — 'apply the ordering uniformly' is the wrong instinct and mints authority over a human's value"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 71ceca70-f476-4a6e-8934-db1ddafea25d
  modified: 2026-08-25T03:20:03.740Z
---

DEC-AUDIT-ORDER, operator 2026-08-25 (PR #648). Applies wherever a state change and the record that gates the *next* such change are two un-transacted round-trips — audit rows read back as inputs ([[audit-row-becomes-load-bearing-input]]), idempotency keys, "already notified" markers, migration ledgers.

**The rule, which is the whole thing:**

> **A row that STOPS a future act is safe to write before the act. A row that ENABLES one is not.**

- **Stops** (e.g. "this value was cleared", "this name has been filled once") → **write it first**, and abandon the change if it did not land. Losing it *re-arms* the act: in this repo that was an admin's answer destroyed at every sign-in, forever, audited as nobody.
- **Enables** (e.g. "this app created this value", i.e. crowning provenance that later authorises a destructive act) → **write it last**. Written first, a lost race *mints* that authority for a value **a human** wrote, and the app later destroys their answer citing a row it invented.

⚠ **"Apply the fix uniformly to all N cases" was my own recommendation and it was wrong.** Uniformity looks like consistency and reads well in a decision record; here it traded two recoverable, visible wrongs for two irrecoverable, invisible ones. The three plans had *opposite* failure asymmetries and only a case-by-case matrix (each plan × {ok, lost-race, error, record-failed}) showed it. **Build that matrix before choosing an ordering.**

**Why the lost race is not a tail risk:** the window between the deciding reads and the write held several round-trips (including one per member), and the likeliest thing to move the guarded columns inside it is **an admin**. So the failure mode concentrates precisely in the human-edit case the rule exists to respect.

**Costs to state out loud, because a cost nobody can see gets "fixed" back into the loop it was paid to close** — and assert them in tests rather than tolerating them:
- the log can record a change that did not happen;
- such a row **retires the rule from that record for good** (when the race was lost to a human, that is not a cost, it is the rule);
- concurrent actors each leave a row while at most one write lands, so the rows stop being countable as changes;
- a "did it land?" answer derived from an insert with no read-back is a fact about the **response**, not the database — a committed row whose reply was lost reads as lost.

All of those fail toward doing **less**, which is the direction to choose when the alternative destroys.

**Mechanics:** the helper had to gain a return (`Promise<void>` → `Promise<boolean>`). Safe across ~50 call sites because every one of them `await`s it as a statement — check for `return writeX(...)`, `void writeX(...)`, and arrow bodies before assuming. Test-mocked call sites are unaffected: `vi.mock(path, factory)` with a string path infers `unknown`, so the factory's shape is never checked against the real module. ⚠ A mock returning `undefined` reads as "did not land" and silently disables every downstream write — update the mock *before* the source.

Related: [[widening-a-set-can-disarm-an-unstated-gate]], [[verified-token-proves-who-not-what-they-may-do]].
