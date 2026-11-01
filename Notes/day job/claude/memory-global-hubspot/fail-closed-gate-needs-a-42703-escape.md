---
name: fail-closed-gate-needs-a-42703-escape
description: "When a fail-closed auth gate starts reading a NEW column, hand-applied DDL means the code can ship before the column exists — and failing closed then logs every admin out of prod"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0fcbd5aa-c1b1-4a2f-906a-38f5821d6da0
  modified: 2026-08-03T16:03:32.434Z
---

**Adding a new column to a query that a FAIL-CLOSED auth gate depends on is a prod-outage risk, because DDL here is hand-applied by the operator.** Prod and preview share one Supabase project, so there is necessarily a window where the code is live and the column is not — and a gate that correctly denies access on a read error will deny **every admin** until someone runs the SQL.

**Why:** migration `0035` added `profiles.must_set_password`, read by `resolveRole()` in the same select it already did. Without an escape hatch, deploying #446 before the DDL would have locked every admin out of production.

**How to apply:**
- Retry the read **without** the new column when PostgREST returns Postgres `42703` (`undefined_column`), and `captureError` the specific migration filename as the hint. Any *other* error still fails closed — don't broaden the catch.
- The feature then degrades to **inert** rather than **fatal**, which makes the deploy order genuinely free in both directions instead of merely documented as "DDL first".
- **Verify it by actually dropping the column and running the admin E2E** — the fallback's whole value is a state you can only reach by leaving. 18/18 passed with it absent, and the log showed the hint. A unit test with a fake 42703 is necessary but not sufficient; it can't tell you the app still boots.
- Also verify the migration applies **from a clean database** (`npx supabase db reset`), not just hand-applied via `psql` — those are different code paths and only the former is what CI and the operator run. ⚠ A first `db reset` may die with `error running container: exit 1` and leave the DB EMPTY; just re-run it.
- Regenerate `lib/db/database.types.ts` with `npx supabase gen types typescript --local` and **diff it against the committed file** — expect only the new column's three lines (Row/Insert/Update). Write it back with the repo's CRLF endings. Note Git Bash `/tmp` ≠ Windows-python `/tmp`, so pass an explicit path between the two.

Related: [[layout-is-not-an-auth-chokepoint]], [[verified-token-proves-who-not-what-they-may-do]], [[supabase-mcp-oauth-broken]].
