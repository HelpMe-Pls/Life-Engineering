---
name: migration-receipt-is-the-last-statement
description: "\"Does the first object exist?\" reports a HALF-APPLIED migration as applied — verify by reading the `comment on …` each file places LAST, which only exists if every statement above it ran"
metadata: 
  node_type: memory
  type: project
  originSessionId: c2511ad7-47a0-4233-bc68-92832318278a
  modified: 2026-09-22T10:33:29.149Z
---

**Measured on production 2026-09-22.** An existence sweep over `0049`–`0055` answered `true` on
all seven. The receipt sweep over the same files answered `false` on `0055`:

```sql
-- what LIES
to_regclass('public.events_api_keys') is not null
exists (select 1 from pg_policy where polname='feedback_signals admin delete')

-- what TELLS THE TRUTH
obj_description(to_regclass('public.feedback_surveys'), 'pg_class') is not null
(select obj_description(oid,'pg_policy') from pg_policy
   where polname='feedback_signals admin delete') is not null
```

`0055` is three statements: `drop policy if exists` → `create policy` → `comment on policy`. The
first two had run and hard-delete genuinely worked; **the third never did.** The file was
half-applied and every existence check called it applied.

**Why it happens here specifically:** the dashboard SQL editor commits each statement on its own
connection ([[dashboard-sql-editor-reconnects-per-statement]]), so a paste that stops short — or a
file that errors partway — leaves the statements before it already committed. There is no
all-or-nothing, so "the table is there" says nothing about the rest of the file.

**The design that makes a file checkable: put a `comment on` LAST, deliberately, and say so in the
file.** `0055` does exactly that — `-- LAST, so it doubles as the receipt that the policy above
ran.` Every `0043`–`0055` follows it. The comment is free, it is idempotent, and it cannot exist
unless everything above it committed.

**Verifying is not the same as checking existence — and the difference is invisible until it
isn't.** Both forms return `true` on a healthy database, so a receipt query that is never RED-proved
is indistinguishable from an existence query. Prove it: strip the comment on a local table and
re-run. Measured — `step1_says_applied = t` while `receipt_says_complete = f`, which is the whole
value of the form ([[mutation-is-a-hypothesis-read-the-source-back]]).

**Traps in writing the query itself:**
- A **policy** comment needs `obj_description(oid, 'pg_policy')`. The `pg_class` form returns null
  for a policy and silently degrades the check to policy-existence — byte-identical to the thing it
  was supposed to improve on.
- Two files commenting the **same object** share one receipt, and the later one overwrites. `0044`
  and `0046` both comment `account_notes`; separate them by matching `0046`'s own wording.
- `obj_description(…) like '%x%'` is **NULL, not false**, when the comment is absent. `coalesce(…,
  false)` or the row renders blank and reads as neither.
- `0041` and `0042` write no comment at all — pure `grant` / one `revoke` — so they are
  **unverifiable this way.** Say so rather than leaving them out silently.
- Prefer the null-safe `to_regclass` / `obj_description` family over `has_table_privilege` and
  `has_function_privilege`, which **throw** on a missing object and take the whole query down.

**A catalog query proves the objects and never the GRANTS or RLS.** Pair it with opening the real
screen on the canonical domain — `/admin/feedback` rendered real rows the same day, which is the
half SQL cannot answer. Related: [[supabase-rls-read-path-traps]],
[[runbook-rollback-sql-must-be-executed]].
