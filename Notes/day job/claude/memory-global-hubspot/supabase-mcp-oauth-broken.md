---
name: supabase-mcp-oauth-broken
description: Supabase MCP OAuth is broken in this env (Unrecognized client_id) — use the Supabase dashboard SQL editor for DDL and a service-role tsx script for data reads
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5785d893-d030-4371-90c8-4e7598c1a967
  modified: 2026-10-08T04:51:20.154Z
---

The Supabase MCP plugin's OAuth fails in this checkout: `authenticate` returns an api.supabase.com authorize URL whose `client_id` the server rejects with `{"message":"Unrecognized client_id"}` (hit 2026-06-14 and again 2026-06-15). Re-running the flow does NOT fix it — it's a stale/broken client registration in the plugin, not a user step.

Fallbacks that work (global-engineering.md allows non-MCP when MCP is unavailable):
- **DDL / migrations:** run the SQL in the **Supabase Dashboard → SQL Editor** (role `postgres`, "Primary Database"). This is how 0011 and 0012/0013 were applied live. Wrap multi-statement destructive migrations in `begin; … commit;`.
- **Data reads / service-role ops:** a `tsx` script under `website/scripts/` that loads `website/.env` via `dotenv` and calls `createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` — mirrors `scripts/preflight-17.ts`. The service role can do REST queries + `auth.admin` (listUsers/deleteUser) but NOT arbitrary DDL. Do NOT import `lib/` modules that pull in `server-only` (throws under tsx) — re-implement inline.
- **One-off read with NO repo file (worked 2026-10-08):** a plain `.mjs` in the session scratchpad, `createRequire('<repo>/website/package.json')` to resolve `dotenv` + `@supabase/supabase-js`, run with `node` (or `node --input-type=module -e`). Print env PRESENCE and the URL host only, never values. `website/.env` points at the shared PROD project, so a read is a prod read.

Project ref: `lcymicrbcsvssgleplml` (prod + dev share ONE database). Related: [[promotion-merge-convention]].
