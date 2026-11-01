---
name: ctas-backup-table-inherits-anon-grant
description: "A `create table … as select` in `public` is granted to anon AT CREATION by 0041's alter default privileges — so an ad-hoc backup table is world-readable AND world-deletable"
metadata: 
  node_type: memory
  type: project
  originSessionId: 798f99d2-7365-4317-8034-6187e75f46bb
  modified: 2026-08-29T11:36:32.887Z
---

`website/supabase/migrations/0041_explicit_api_role_grants.sql` ends with `alter default privileges in schema public grant all privileges on tables to anon, authenticated, service_role`, and **its own comment names the role**: these apply to objects created by `postgres`, *"which is what runs migrations locally and in the dashboard"*. So any table an operator creates in the dashboard SQL editor is granted to `anon` **at the moment it is created** — including a throwaway backup nobody thought of as an API surface.

Three things combine, and none is visible in the statement itself:

1. the default-privileges grant above,
2. `supabase/config.toml` exposes `public` over the Data API and `0041` grants `anon` usage on it, and PostgREST reloads its schema cache on DDL — so it is reachable within seconds,
3. **`create table … as select` never enables RLS.** Grants with no RLS are the whole gate, and there is none.

Net: a `create table public.<x>_backup as select * from <sensitive>` is readable **and deletable** with the public anon key. On a backup that is the exact inversion of its purpose — the rollback is the thing that gets destroyed.

**Why:** the danger is invisible at the point of writing. The statement looks like scratch work, the grant is 200 lines away in another file, and RLS-by-default is not a thing Postgres does. Caught 2026-08-29 in `#763`'s operator SQL, which I had written myself and which had already survived one audit round.

**How to apply:**

- Write it as a **single `do $$ … $$;` block**: CTAS, then `enable row level security`, then `revoke all … from anon, authenticated`. One statement = one implicit transaction = **no window** — and it also sidesteps [[dashboard-sql-editor-reconnects-per-statement]], which means `begin/commit` would not have held anyway.
- `postgres` owns the table and `service_role` carries `bypassrls`, so the operator can still read and restore it.
- **Give the operator a guard receipt to run BEFORE the destructive step**: `relrowsecurity` from `pg_class` plus `has_table_privilege('anon', c.oid, 'select'|'delete')`. Expected `true, false, false`. A backup that is not yet proven closed is not yet a backup.
- ⚠ **No repo guard catches this.** `website/tests/api-role-grants-live.test.ts` derives its table set from `create table` statements in `supabase/migrations/` — an operator-created table is in no migration, so it is invisible to the sweep. See [[supabase-rls-read-path-traps]] and [[audit-row-order-stops-vs-enables]].
