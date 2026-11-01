---
name: gate-evidence-set-must-match-write-paths
description: "A gate that asks 'has a HUMAN decided this?' reads audit rows as evidence — so its action set must enumerate every UI that writes the column, and a BULK writer sharing an action with a per-record editor has to be excluded by metadata, never by action or by neq"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 71ceca70-f476-4a6e-8934-db1ddafea25d
  modified: 2026-08-25T04:54:20.349Z
---

DEC-OWNER-HUMAN-WINS, PR #649 (2026-08-25). Applies to any rule that decides "may I write here?" from the *absence* of somebody else's audit row — see [[audit-row-becomes-load-bearing-input]] for what that absence costs.

**The evidence set is a SURFACE, and it is wider than the obvious one.** Two admin UIs wrote the same two columns under **different audit actions**: the tracker board's inline cell (`chapter.primary_contact.update`) and the chapter detail page's ContactsEditor (`chapter.edit`). A gate reading only the first covers half the surface *while reading as though it covered all of it* — and it fails silently, because "no row" is exactly what an untouched record looks like. Derive the set, then pin it: a structural test that enumerates every file writing the column and reds when a new one appears (`tests/owner-human-edit-doors.test.ts` — `.insert|.update({…})` payload scan over `app/` + `lib/`, asserted against a named writer list).

⚠ **THE MISTAKE WAS MINE AND IT WAS IN THE RECOMMENDATION, NOT THE CODE.** I had written *"one more existence read of the shape already there"*, naming exactly one action — right about the mechanism, wrong about its scope, and the scope is the whole bug. **Measure the write surface before proposing the read**, not after.

**Over-counting is the OTHER failure, and it is worse.** The roster CSV import shares `chapter.edit` with the detail page, writes one row per imported record whether or not the field changed, and carries no before/after to prove it did. Counting it would have retired the rule from **every** record on a single upload — silently, in exactly the population it exists to serve. So:

- exclude a bulk writer by a **positive `eq` on its distinguishing metadata** (`metadata->>source = 'detail_edit'`), never by dropping the action and never by `neq` — `NULL <> 'x'` is NULL, so negating the source also drops the rows that carry no `source` key at all;
- assert the exclusion out loud: a test that reads the importer's own source literal and fails if it ever becomes the included one.

**Placement:** a stop like this goes BESIDE the other completing stops, never above the conjuncts that gate a *different* action. Hoisting it also stops the destructive path, and a record that can be neither completed nor cleared shows no affordance at all. Keep an anti-hoist differential — same flag, opposite outcome.

**Accepted cost, stated rather than tolerated:** ANY human write retires the rule for that record, including one that only fixed a typo in a neighbouring field. It does less on the population it was asked to serve, which is the safe direction.

Related: [[guard-root-narrower-than-surface]], [[widening-a-set-can-disarm-an-unstated-gate]], [[recurring-bug-class-needs-enumeration]].
