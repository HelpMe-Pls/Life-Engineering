---
name: runbook-rollback-sql-must-be-executed
description: "A rollback keyed on a NULL column narrows SILENTLY as the data heals, and a \"swap this line to preview it\" instruction ships broken — execute both variants, with a fixture control"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1bd16e29-2985-4823-a18e-dc44185afb26
  modified: 2026-08-23T12:18:59.979Z
---

Operator SQL in `docs/plans/next-steps.md` must be **executed**, not reviewed — including its
*preview* variant. Two defects shipped in one rollback block and both were invisible on the page:

1. **A predicate keyed on a column the app later fills narrows silently.** The `0040` rollback
   ended `and c.primary_contact_name is null`. Once #611 started completing those rows, each healed
   chapter stopped matching — the statement still succeeded, just over fewer rows every week. That
   is the failure a `count(*)` cannot show you. Fix: check the value against **the writing action's
   own audit row** (`metadata->>'source' = 'first_signin_name_fill'`), so a value the app wrote is
   reverted and a value a human typed is not.
2. **"To preview it, swap the `update … set` line for `select …`" was impossible.** It leaves
   `from audit_log a` with no `from chapters c`, so Postgres answers
   `42P01: missing FROM-clause entry for table "c"`. A preview needs BOTH swaps named. This one had
   been wrong since the block was written, because nobody ran it.

**How to verify:** POST the fence to `http://127.0.0.1:54321/pg/query` (`{"query": …}`, no auth) —
the same postgres-meta the dashboard editor uses. Seed the *histories that differ* (backfilled /
healed-since / admin-renamed) and assert which rows cleared.

⚠ **Add a fixture control or the probe is vacuous.** My first one reported all-null BEFORE and
"passed" two of three checks: a **data-modifying CTE cannot see rows another CTE inserted in the
same statement**, so the seeding `update … from made` matched nothing. Seed as separate statements
(each pg-meta request autocommits) and abort unless the seed actually took. Same family as
[[dashboard-sql-editor-reconnects-per-statement]], different mechanism — that one is connections
between statements, this is snapshot visibility inside one.

**Why:** a rollback is used exactly once, under pressure, by someone who cannot debug it.

**How to apply:** before committing any operator SQL, run the statement AND its preview against
local Postgres with a differential fixture; never let a rollback's reach depend on a column another
code path is going to fill.
