---
name: verified-token-proves-who-not-what-they-may-do
description: "DEC-ADMIN-CLAIMS half-reversed — getClaims() verifies a token whose account was deleted an hour ago, so authorization reads the profiles row; demotion leaked worse than deletion"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0fcbd5aa-c1b1-4a2f-906a-38f5821d6da0
  modified: 2026-08-03T14:43:47.736Z
---

**A locally-verified JWT proves WHO is calling, never WHAT they may do.** `/admin` authorization now always reads the account's current `profiles` row; `getClaims()` supplies identity only. This **partially reverses DEC-ADMIN-CLAIMS** — do not restore the claim fast path (#445, 2026-08-03).

**Why:** `resolveRole()` authorized from the `user_role` claim migration 0019 stamps into the access token. `getClaims()` is *genuine* cryptographic verification (asymmetric ES256, cached JWKS, zero network legs), which is exactly why it was over-trusted: **it happily verifies a token whose account was deleted an hour ago.** `deleteUser()` revokes *refresh* tokens; the *access* token stays valid for its full life — **measured at exactly 60 min**. A removed admin kept full access, service-role writes included, ending only when they chose to log out.

**How to apply:**
- **Demotion leaked identically and is the WORSE case** — the account still exists, so nothing ends the session at all, and a demoted master_admin kept master powers for the same hour. Any fix must cover both; measured verdicts: deleted → no profiles row, demoted → row says `chapter`.
- **Fail closed:** no readable row ⇒ no access, *including a failed read*. The old fallback did `profile?.role ?? 'chapter'`, which silently invented a role.
- **Cost, measured:** one Postgres read per request, ~1.3 ms → ~24 ms local. That is **one of the two legs #199 removed, not both** — `getUser()` stays gone, and the proxy (`lib/supabase/middleware.ts`) is untouched because it only rotates the cookie and authorizes nothing. Request-memoized by `cache()`. Both files now carry a note so nobody "aligns" them back together.
- The hook still stamps the claim; nothing reads it for access. `ROLE_CLAIM_KEY` is retained deliberately as the vocabulary the guard tests use to build a token whose role is **stale** — that is what makes those tests fail if the claim ever becomes authoritative again.
- **Watch for a test that pins the bug.** `tests/auth.guards-claims.test.ts` asserted `expect(selectSpy).not.toHaveBeenCalled()` — "no profiles round-trip" was the *feature* being protected. Inverting it was the fix, not drift.

Related: [[emailed-auth-token-must-be-minted-last]] (shipped together), [[admin-nav-geo-tax-sin1-tradeoff]], [[supabase-getclaims-available-despite-ssr-pin]].
