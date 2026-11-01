---
name: supabase-getclaims-available-despite-ssr-pin
description: getClaims() IS available in the installed auth-js (2.106.2) — the ssr 0.5.2 pin does NOT block it; local JWT verify can replace per-nav getUser()
metadata: 
  node_type: memory
  type: reference
  originSessionId: af337776-62e8-4f9e-ac26-268b65c6571d
---

The `@supabase/ssr` 0.5.2 pin (and its cookie-client return-type quirk, see [[supabase-ssr-supabasejs-generic-skew]]) does **NOT** block `getClaims()`. Verified 2026-07-07 against installed `node_modules`:

- `@supabase/ssr` installed 0.5.2, but `@supabase/supabase-js` declared `^2.47.10` **floats up to installed 2.106.2**, and `@supabase/auth-js` (gotrue) 2.106.2 — its `GoTrueClient.js` contains both `getClaims` AND asymmetric-JWT support (`jwks`/`ES256`/`RS256`).

**Why it matters:** `getUser()` makes a network round-trip to Supabase Auth to verify the token on *every* call; the proxy (`proxy.ts` → `updateSession`) runs it on nearly every request (broad matcher). `getClaims()` with **asymmetric signing keys** verifies the JWT signature **locally** (JWKS fetched once + cached) — zero network leg per navigation. This is the primary lever to cut the EU/US geographic tax (see [[admin-nav-geo-tax-sin1-tradeoff]]).

**Precondition — CONFIRMED MET 2026-07-07.** `getClaims()` only avoids the network call when the project uses **asymmetric JWT signing keys**. Verified keylessly against the prod project's public JWKS endpoint `https://lcymicrbcsvssgleplml.supabase.co/auth/v1/.well-known/jwks.json` (project `global-hubspot`, `ref lcymicrbcsvssgleplml`, region `ap-southeast-1` = Singapore): returns **1 key, `alg: ES256`, `kty: EC`**, no symmetric-only fallback. ⇒ the project has already migrated to asymmetric keys, so `getClaims()` verifies locally with zero network leg. **No prod-config change and no dependency upgrade are needed** — Lever A of [[admin-nav-geo-tax-sin1-tradeoff]] is a pure code task. (Technique: the JWKS endpoint is public and definitive — empty `keys[]` ⇒ legacy HS256; non-empty with ES256/RS256 ⇒ asymmetric. MCP `list_projects` worked this session; the app DB is the `global-hubspot` project, NOT `EO Vietnam`.)
