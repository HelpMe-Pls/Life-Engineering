---
name: supabase-rls-read-path-traps
description: "Two RLS read paths that LOOK protected and aren't — OR-ed permissive policies, and views without security_invoker. Both shipped here; audit queries included."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0b818aa6-645a-4959-8064-84df187071b4
  modified: 2026-07-26T04:17:04.397Z
---

Two leaks found on 2026-07-26 (PRs #326, migrations `0030`+`0031`), both from confident-but-wrong comments in the code asserting RLS was doing something it wasn't. **Assume neither is a one-off — the same pattern still exists in three portal reads (logged in the ⚡ queue's Opportunistic backlog).**

**1 · Permissive policies OR together, so an unfiltered query is load-bearing.** `in_app_notifications` had `self read` (`user_id = auth.uid()`) *and* `admin read all` (`is_admin()`). Postgres combines PERMISSIVE policies with **OR**, so for an admin the predicate was unconditionally true and `GET /api/notifications` — which had no `.eq('user_id', …)` and a comment saying "RLS scopes the read" — returned every user's rows. ⇒ **Any table with a self-scoped policy ORed against an `is_admin()` one needs the owner filter written explicitly at every call site.**

**2 · A Postgres view runs as its OWNER, not the caller — it BYPASSES RLS.** Unless `security_invoker = true` (PG15+). `sync_health_latest` was owned by `postgres`, so it bypassed `sync_health`'s admin-only policy, and Supabase's default grants gave **`anon`** SELECT. Real member emails were exposed for ~2 days. Note the anon key ships in the site's own JS, so "anon can read it" means the internet can. ⇒ **Every new view needs `security_invoker = on` AND `revoke all … from anon`.**

Audit queries (run against a local stack with all migrations applied — `docker exec -i supabase_db_website psql -U postgres -d postgres`):

```sql
-- OR-ed permissive pairs
select tablename, cmd, count(*), string_agg(policyname,' | ')
from pg_policies where schemaname='public' and permissive='PERMISSIVE'
group by tablename, cmd having count(*) > 1;

-- views missing security_invoker
select c.relname, (select option_value from pg_options_to_table(c.reloptions)
       where option_name='security_invoker') as security_invoker
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind in ('v','m');
```

`anon` holding broad grants on every table is **normal** in Supabase — grants are wide, RLS is the gate. That is exactly why a view bypassing RLS is so dangerous here.

**Testing rule learned:** a "role X cannot read Y" test passes **vacuously** if the session isn't really role X — always include a positive control (e.g. the admin first reads every chapter, an `is_admin()`-only power). And prove the test is non-vacuous by **re-creating the vulnerability and watching it fail**; both suites here were verified that way. See [[test-suite-clean-minimal-standard]].
