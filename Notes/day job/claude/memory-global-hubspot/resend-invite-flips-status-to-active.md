---
name: resend-invite-flips-status-to-active
description: "/admin/accounts \"Active\" is derived ONLY from auth.users.last_sign_in_at, and clicking the \"Resend\" button (generateLink recovery) stamps that field server-side without a real login — so never-signed-in invited admins wrongly show Active"
metadata: 
  node_type: memory
  type: project
  originSessionId: ace429a7-2010-4063-991f-f5b067c5ce18
---

The `/admin/accounts` **Active vs Pending** badge is derived from a single field: `status: u?.last_sign_in_at ? 'active' : 'pending'` (`app/admin/accounts/page.tsx:63`). No password/email-confirm signal is involved.

**Bug — DEFINITIVELY PINNED + FIXED 2026-07-03 (ACCT-STATUS, /diagnosing-bugs repro vs local Supabase; supersedes the earlier "generateLink stamps it" guess).** The actual stamping mechanism, proven across a 4-step harness reading `auth.users` after each step:
- `generateLink({type:'invite'})` → does **NOT** stamp `last_sign_in_at`.
- `generateLink({type:'recovery'})` (the roster **Resend** action) → does **NOT** stamp it either (the earlier session's guess was wrong; S255 was right that generating is inert).
- **`verifyOtp({token_hash, type:'recovery'})` → DOES stamp `last_sign_in_at` AND `email_confirmed_at`.** This runs in `/auth/confirm` the instant the admin **OPENS the resent link** — before set-password / any real login. THAT is what flips Status to Active. Path: Resend → recovery email → admin clicks link → `/auth/confirm` verifyOtp → stamped.
- Real `signInWithPassword` also stamps (later ts) — expected.
Corollary proven the same day: NO `auth.users` timestamp distinguishes a link-open from a real login (both set last_sign_in_at + email_confirmed_at). The ONLY historical signal for "genuinely usable" is **`auth.users.encrypted_password <> ''`** — Supabase seeds it to the EMPTY STRING (not NULL) for invited/link-opened users; a real bcrypt hash (len 60) appears only after set-password. `encrypted_password` is NOT exposed by the admin API `getUserById` — read it via direct SQL only.

**Fix shipped (ACCT-STATUS, PR to dev folded into #200):** new set-once app-owned column **`profiles.first_signed_in_at`** (migration 0018), stamped by `markFirstSignIn` (`lib/auth/first-signin.ts`, service-role, best-effort) at exactly two seams — `loginWithEmail` after signInWithPassword, and `updatePassword` after updateUser({password}). Status now derives from it via shared `hasReallySignedIn()` (`lib/admin/chapter-accounts.ts`), adopted by the roster (`accounts/page.tsx`), the chapter-detail card (`load-chapter-accounts.ts`), AND the `removeChapterAccount` shell-removal gate (`chapters/[id]/actions.ts` — was `!last_sign_in_at`, now `first_signed_in_at === null`, so a link-opened inert shell stays removable). Backfill (in migration 0018): stamp where `encrypted_password <> ''` OR authored an audit_log/stage_history/intake_files row. **master_admin password-reset workaround** (owner intercepts the Resend/reset email and completes set-password on a user's behalf) correctly reads Active — it runs `updatePassword` (go-forward) and sets `encrypted_password` (backfill). `last_sign_in_at` is KEPT for the roster's honest "last active" display column, separate from Status.

**Self-serve fact (same investigation):** any account that exists can set/reset its own password via `/forgot-password` → `resetPassword` (`lib/auth/actions.ts:61`, `resetPasswordForEmail`) regardless of `last_sign_in_at` — the recovery email lands on `/auth/callback` (PKCE `exchangeCodeForSession`) → `/update-password`. Existence + a real email address is the only requirement; the Active/Pending label is irrelevant to password-ability. So these admins need NOT wait for a master_admin to Resend.
