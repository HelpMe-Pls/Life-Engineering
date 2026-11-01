---
name: supabase-ssr-supabasejs-generic-skew
description: "Typed cookie client (createServerClient<Database>) resolves .insert/.update to `never` — @supabase/ssr 0.5.2 vs supabase-js 2.106 generic-arity skew; fix = pin the factory return type (or upgrade ssr)"
metadata: 
  node_type: memory
  type: project
  originSessionId: d8028b9e-70c1-4497-9236-bb9475256487
---

When the Supabase clients are typed with the generated `Database` type (F6, PR #135), the **cookie client** (`@supabase/ssr@0.5.2` → `createServerClient<Database>`) resolves typed `.insert()/.update()` payloads to **`never`** (reads still type correctly). Root cause: ssr 0.5.2 is built against an older supabase-js whose `SupabaseClient` had ONE FEWER generic than the resolved `@supabase/supabase-js@2.106`, so passing `<Database>` lands the schema in the wrong generic slot. The **service-role** client (raw `createClient` from supabase-js, annotated `SupabaseClient<Database>`) is unaffected.

**Fix in lib/supabase/server.ts:** do NOT pass `<Database>` to `createServerClient(...)`; instead pin the factory's RETURN type to `Promise<SupabaseClient<Database>>` (lets `SupabaseClient` default its own schema generic → correct read AND write types). The `__InternalSupabase.PostgrestVersion` marker is a red herring — it only gates postgres-13 SELECT features, not write payloads.

**Why:** lets F6 land generated DB types + a typed client without a risky dep bump.
**How to apply:** the durable fix is to upgrade `@supabase/ssr` to match supabase-js 2.106 (separate, E2E-gated change) — then the return-type pin can be dropped. Related: [[e2e-cicd-local-supabase-prod-safety]], [[supabase-mcp-oauth-broken]].
