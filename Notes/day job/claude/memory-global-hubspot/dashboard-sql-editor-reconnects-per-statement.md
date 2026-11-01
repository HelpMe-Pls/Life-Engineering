---
name: dashboard-sql-editor-reconnects-per-statement
description: The Supabase dashboard SQL editor opens a NEW backend connection per request, so a temp table dies between statements and begin/commit buys nothing — a migration can pass every local check and still fail on prod with 42P01
metadata:
  type: project
---

Migration `0040` staged its winners in `create temporary table … on commit drop`, passed
`supabase db reset`, psql, and a local pg-meta run, and then **failed on production**:

```
ERROR: 42P01: relation "backfill_chapter_owner_winner" does not exist
```

**Cause, measured not guessed.** The dashboard SQL editor runs through **postgres-meta**, which
**opens a different backend connection per request** and delivers a script's statements
separately. `pg_backend_pid()` returned `25745, 25746, 25747, 25748` on four consecutive calls. A
temp table is connection-scoped, so the statement after the `create` cannot see it.

**Two instincts are wrong, both tested:**
- Dropping `on commit drop` → **still 42P01**. That clause was never the cause.
- A `begin; … commit;` wrapper → **a transaction cannot span two connections.** The wrapper is
  what makes the shape *look* safe. It buys nothing there.

**Why local always passes:** sending the whole file as ONE request is ONE connection. `psql`,
`supabase db reset`, and a single pg-meta call all do that. "Proven locally" is therefore not
evidence about the dashboard at all.

**Write operator-run DML as ONE statement** — stage in CTEs, and take audit rows from the
`UPDATE`'s own `RETURNING` (strictly stronger: they then cannot describe a row the UPDATE did not
write). A single statement is already atomic, so drop the transaction wrapper too.

**The loop that reproduces it** (the local stack, Kong proxies pg-meta with no auth):
`POST http://127.0.0.1:54321/pg/query` with `{"query": "…"}`. Send the file **once** → passes.
Send **one request per statement** → reproduces prod down to the failing line. Use both modes on
any multi-statement migration before handing it to an operator.

`website/tests/migration-statement-independence.test.ts` now fails on any temp table in any
migration. Related: [[supabase-mcp-oauth-broken]] (why DDL is operator-run here at all),
[[recurring-bug-class-needs-enumeration]].
