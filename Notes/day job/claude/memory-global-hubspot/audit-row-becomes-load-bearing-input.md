---
name: audit-row-becomes-load-bearing-input
description: "Keying 'may this app touch that value?' on the writing action's own audit row turns a LOG into a precondition — pruning it then changes behaviour silently; plus the two conjuncts such a gate needs, the PostgREST jsonb filter that reads it, and the reversal that made an ABSENT row load-bearing too"
metadata: 
  node_type: memory
  type: project
  originSessionId: 71ceca70-f476-4a6e-8934-db1ddafea25d
  modified: 2026-08-25T04:54:32.825Z
---

DEC-OWNER-COMPLETE, shipped 2026-08-24 (PR #639), **reversed 2026-08-25 (PR #648)** — see the correction block below before trusting anything above it.

**The defect it fixes, which is the general shape:** a rule that heals half-written data decided *"may I write here?"* by **value equality** — the recorded email matched the member it would pick, so it wrote the missing name. But an admin who deletes a wrong Owner *name* and keeps the address leaves a row **byte-identical** to one the migration wrote. Value equality cannot tell a human's deliberate edit from the app's own half-finished write, so the name an admin had just removed came back at that chapter's next member sign-in, audited as `actorId: null`. **When two states are indistinguishable by value, provenance is the only thing that separates them.**

**Two conjuncts, not one** — each stops a different forgery, and each needs a test that reddens without it:

1. **Provenance** — the recorded value must be one *this app* wrote (its own `backfill_0040` audit row). Drop it and a human's address becomes the app's to edit.
2. **Identity** — it must *still* be the winner's value. Drop it and deleting the crowned member puts one person's name against another's address. Reachable with no admin edit at all.

⚠ **THE THIRD CONJUNCT, AND THE REVERSAL THAT ADDED IT (operator, 2026-08-25):** *"The app should NEVER 'heal' an actual HUMAN admin edit. The HUMAN admin update ALWAYS WINS."* So the rule gets **exactly one go** at a value: its own completion row is a permanent stop on completing again. Two things this corrects in what I wrote a day earlier:

- **The old accepted cost is withdrawn.** "An admin who clears a name this app filled gets it straight back" was the *documented, deliberate* behaviour. It is now forbidden.
- ⚠ **The stop is NOT implemented by accepting the completion row as provenance**, and that one-liner is the trap. A completion row is NEWER than the crowning row, so accepting it makes the provenance parser answer null — which returns *before* the "should this be cleared?" evidence is consulted, so the record also stops being **clearable** and the UI offers no "set it" affordance (it renders on `name || email`). **Keep excluding the completion row from the provenance read — for the CLEAR's sake — and put the stop in a separate, targeted existence read.**
- ⚠ Also wrong in the earlier version: `first_signin_default` **is** provenance for **clearing** (DEC-OWN-FILL-STRAND). Only *completing* is migration-source-only.

**The consequence worth remembering, because nothing announces it:** ⚠ **that audit row is no longer history — it is an INPUT.** Pruning, archiving or rewriting the log silently changes behaviour, and no error appears anywhere. Say so **in the producer** (the migration header), which is where someone about to delete rows will actually look. ⚠ **And since the reversal, an ABSENT row is load-bearing in the opposite direction** — deleting a completion row does not stop something, it **re-enables** it. That is the shape that makes log pruning change behaviour in whichever direction you were not watching. See [[audit-row-order-stops-vs-enables]] for what that costs at write time, and [[runbook-rollback-sql-must-be-executed]] for the sibling failure — a predicate that narrows silently as data heals.

**Free win:** put the provenance read **before** the expensive read it gates. It turned an unbounded per-login cost (roster read + one GoTrue `getUserById` per member, forever, to conclude "skip") into one indexed read. ⚠ Do **not** gate the second existence read on `provenance.source` to save a round-trip: that hard-codes the completing gate's current membership into a caller that does not own it, so widening the set later silently re-arms the overwrite.

**Mechanics that took probing:**

- `.eq('metadata->>source', 'x')` **typechecks** under postgrest-js 2.110 and **works live** — but prove it live, because a filter matching nothing looks exactly like "no provenance" and fails safe into never healing. `.order('created_at', {ascending: false}).limit(1)` gets the newest (a rollback + re-apply writes a second row). ⚠ `.neq()` on a jsonb path: `NULL <> 'x'` is NULL, so a row with the key **absent** is filtered OUT, not returned-and-rejected.
- Fail **CLOSED** on an unreadable audit row. Best-effort means "never break the sign-in", not "write without evidence".
- The `source` strings live in TypeScript, in SQL that cannot import, and in an operator query in a doc. One constant owns them, and a test reads the other two and fails on disagreement — comment-stripped first, or a 110-line header counts as coverage ([[guard-root-narrower-than-surface]]). ⚠ That test **throws** if the doc's fenced block is deleted, so "this operator query is finished, remove it" is a red build: move it, don't delete it.

⚠ **I twice justified failing closed as "this column is a name chapters see" — it was wrong both times.** `primary_contact_*` is `/admin`-only: no chapter surface, no email template. **Grep the surface before asserting who sees a field**; the real reason was smaller and still sufficient (an unattributable write overwrites what an admin decided).

⚠ **An absolute principle in a comment outruns its code by one case, every time.** "A human's edit is final" shipped as an unqualified sentence while three paths still overwrote a human's value. Write the *scope* into the sentence and file the rest.

**Where those three went (PR #649, 2026-08-25) — the count is now TWO, both accepted:**

1. *a name a HUMAN typed and then deleted* — **CLOSED** by DEC-OWNER-HUMAN-WINS: a second existence read over the audit rows a human's own edit leaves. It needed its own evidence set, not a wider provenance read — [[gate-evidence-set-must-match-write-paths]] is the whole trap, including the two doors and the bulk importer that must stay out of it.
2. *deleting the WHOLE value re-crowns it* — **ACCEPTED**: the `fill` path consults no provenance, and "an active member and no owner" is the population the operator asked the rule to serve.
3. *a human types an address equal to the app's own* — **ACCEPTED**: provenance is value equality and no human edit writes a crowning row.

So the rule is final for the NAME and not for the whole value. ⚠ Do not restore a sentence saying otherwise anywhere in these modules — and note that the fix means a THIRD audit source is now load-bearing by its absence.

Related: [[recurring-bug-class-needs-enumeration]], [[test-suite-clean-minimal-standard]].
