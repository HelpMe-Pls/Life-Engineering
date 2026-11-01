---
name: emailed-auth-token-must-be-minted-last
description: "generateLink stores the emailed OTP token ON the auth.users row, and a later password or confirm write clears it — a metadata-only write (admin or own-session) does NOT, measured 2026-09-03 — so an emailed token must be minted after every password/confirm write to that user"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0fcbd5aa-c1b1-4a2f-906a-38f5821d6da0
  modified: 2026-08-03T14:43:23.525Z
---

**`supabase.auth.admin.generateLink()` stores the token on the `auth.users` row (`confirmation_token` for `invite`, `recovery_token` for `recovery`), and a subsequent `auth.admin.updateUserById()` that sets the password or confirms the email CLEARS it.** So the token you actually email must be minted **after every password or confirm write to that user** — otherwise you mail a dead link. ⚠ **Narrowed 2026-09-03 (#833):** a METADATA-ONLY write — `updateUserById({ user_metadata })` or the person's own `auth.updateUser({ data })` — leaves the token ALIVE, measured with a positive control (the same fixture's token dies on a password write) in `tests/display-name-fill-live.test.ts`. "ANY later write" was too wide.

**Why:** `inviteAdmin` mailed a broken "Set your password" link for weeks (recipient hit `/auth/error`, "Email link is invalid or has expired"; only a Resend worked). It minted the invite token, then did DEC-DEFAULT-PW's `updateUserById({ password, email_confirm: true })`, then emailed the already-dead token. The operator reported it as "we've tried to fix this exact bug multiple times and it never goes away COMPLETELY" — because each earlier attempt fixed a *different* real problem (the Safe-Links scanner burning the token → the `/auth/confirm` interstitial; the unconfirmed email → `email_confirm: true`, which *is* the write that kills it). Fixed in #445 (2026-08-03).

**How to apply:**
- **Measured, do not re-derive:** it is NOT specific to `email_confirm`. A **password-only** write clears the token too; a **metadata-only** write does not. Dropping a field is never the fix; **ordering** is.
- Correct shape: use `generateLink({type:'invite'})` only to CREATE the account, then do all writes, then mint a **`recovery`** link last and email that. `/auth/confirm` verifies both types, and this is exactly what `resendInvite` always did — which is why Resend worked and the first email never did.
- **A mocked test cannot catch this class of bug at all** — a fake `updateUserById` leaves a fake token valid. `tests/admin-invite-default-pw.test.ts` stayed green throughout *while asserting the password write*, so it looked like coverage. The guard has to be live: `tests/admin-invite-link-live.test.ts` runs the real action against real GoTrue, asserts BOTH promises the email makes (link verifies AND the stated temp password signs in), and **refuses to run unless the Supabase URL is local**, because it provisions an admin.
- Check the blast radius by asking *does this door email the token?* The chapter door does the same write but deliberately emails nothing, so its cleared token is harmless; `lib/signup-requests/decide.ts` has no post-mint write.

Related: [[batch-default-pw-welcome-frame-pr216]] (the entry that recorded the causing change as a win), [[verified-token-proves-who-not-what-they-may-do]].
