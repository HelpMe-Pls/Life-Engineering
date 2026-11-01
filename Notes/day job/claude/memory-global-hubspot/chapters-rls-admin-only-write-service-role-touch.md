---
name: chapters-rls-admin-only-write-service-role-touch
description: chapters RLS is is_admin()-only for writes; any chapter-user code path that must update a chapters row (e.g. the intake finalize activity touch) MUST use the service-role client
metadata: 
  node_type: memory
  type: project
  originSessionId: d66ea549-f2e7-4b4e-942e-04a3a7d4132a
---

2026-07-14: `chapters` RLS (migration 0001) grants a chapter user **SELECT-own only** —
every write policy is `is_admin()`-gated. So a **user-scoped** Supabase client (a chapter
user) UPDATE-ing its own chapters row is **silently filtered to 0 rows** (no error thrown).

**Bite:** the Task-1 `touchChapterActivity` in the intake **finalize route**
(`app/api/intake/finalize/route.ts`) runs as the chapter user — my first pass passed the
user-scoped `supabase` client, so the upload would NEVER bump `last_activity_at`/`updated_at`
(best-effort helper swallowed the 0-row no-op). **Fix:** use the `svc` (service-role) client
the route already creates for the download. App-layer checks (role, own chapter_id,
storagePath prefix) are the security boundary there.

**How to apply:** any code path that must mutate a `chapters` row while running as a
chapter user → service-role client + app-layer ownership checks. The admin call sites
(`requireAdmin` actions: notes, stage advance/regress) are fine on the user-scoped client.
Proven by the live `tests/rls.chapter-isolation.test.ts` (user UPDATE → 0 rows; service-role
UPDATE → writes). Relates to [[e2e-cicd-local-supabase-prod-safety]].
