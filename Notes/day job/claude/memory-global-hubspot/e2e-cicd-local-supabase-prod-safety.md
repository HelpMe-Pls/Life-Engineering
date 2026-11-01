---
name: e2e-cicd-local-supabase-prod-safety
description: E2E/CI run ONLY against local Supabase; local runs hit the shared PROD db unless env is overridden — guardrails enforce local-only
metadata: 
  node_type: memory
  type: project
  originSessionId: e7d07c4e-f856-4919-9b6e-1ffab3bb77a5
---

The E2E + CI/CD work (branch `feat/e2e-cicd-pipeline`, issue pending — `gh issue create` was permission-blocked at the gate) runs ONLY against an ephemeral **LOCAL** Supabase (`supabase start` / `supabase db reset`, Docker).

**Why this is load-bearing for prod safety:** prod / the dev preview / localhost all share ONE hosted Supabase project, so any local run of the E2E fixtures (which create+DELETE users/chapters/files via service-role) OR the existing live Vitest suites will MUTATE PRODUCTION unless the Supabase env is overridden to the local instance (`http://127.0.0.1:54321`). See [[verify-running-branch-before-diagnosing]].

**Guardrails in place:**
- `website/e2e/fixtures/env.ts` `assertLocalSupabaseUrl()` — refuses any non-`127.0.0.1`/`localhost` URL (fatal, not a warning).
- Playwright `webServer.env` forces the local Supabase env into `next build` + `next start`, so the app-under-test can't reach prod either.
- NEVER `supabase link` / `supabase db push` / `supabase db reset --linked` / a prod connection string; no Supabase MCP writes.
- Migrations `0012`/`0013` carry "apply to live only" headers referring to PROD; `supabase db reset` replays the 13 existing migrations against the LOCAL DB only — no new migrations are authored and prod schema is untouched.

**How to point a local run at the local DB:** export the LOCAL values from `supabase status -o env` (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY) before `npm run test:e2e` or `npm test`. The user (Kh0iLe) is anxious about prod safety + migrations — checkpoint before the first `supabase` DB command.
