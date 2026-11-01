---
name: gotrue-invite-does-not-bounce-an-unconfirmed-account
description: "generateLink({type:'invite'}) refuses only a CONFIRMED account; against an unconfirmed one it succeeds, returns THAT user and rotates their emailed token dead"
metadata: 
  node_type: memory
  type: reference
  originSessionId: dd0580fc-e773-4808-aa7c-f4ba9ede96a6
  modified: 2026-09-04T09:41:04.907Z
---

**MEASURED on GoTrue v2.195.0 (local stack, 2026-09-04):** `generateLink({ type: 'invite' })` for an address that already has an account returns **422 `email_exists` only when that account is CONFIRMED**. Against an **UNCONFIRMED** one it returns **200 and hands back that same user** — so "an invite link is rejected for an existing user" is half a fact, and the half that fails is the common case in this repo: **every account the invite flow provisions is unconfirmed until its link is opened** (see [[batch-default-pw-welcome-frame-pr216]]).

Three further measurements from the same run:

- **`options.data` is NOT merged on the second call** — `user_metadata.full_name` keeps the first invite's value. So a second requester cannot rename the account. (This is what stops the re-invite being a takeover.)
- **The first invite's emailed token IS rotated dead** — the old `hashed_token` verifies to `otp_expired`, the new one works. A second invite therefore breaks a link somebody was already sent.
- `created_at` ≠ `updated_at` even on a **fresh** invite, and `invited_at` is stamped *before* `created_at`, at a different precision — they come from two clocks (Go and Postgres). **Do not use any pair of them to decide "did this call create the row?"** — see [[hsl-lightness-is-not-luminance-use-oklch]] for the general shape and [[status-word-is-not-evidence-tie-to-origin]] for why an inference like that keeps getting retired.

**Why it matters:** any code that decides `invited` vs `linked` from a `findUserByEmail` read taken before the mint is holding an inference, not a fact — the read is stale under two overlapping submissions, and `findUserByEmail` returns `null` on a transient `listUsers` error too. The caller then believes it provisioned an account it did not, and anything it writes lands on a stranger. **The only gate that does not go stale is one the database checks in the same statement as the write** — in `global-hubspot` the note carry uses `insert` into `account_notes`, whose `account_id` primary key refuses the account that already has a note. Related: [[emailed-auth-token-must-be-minted-last]], [[locate-by-ordering-is-steerable-mint-the-id]].

**How to apply:** never write "Supabase rejects an invite for an existing user" in a comment — it is wrong for unconfirmed accounts, and it was wrong in three places in this repo before anyone measured it. `website/tests/signup-approve-live.test.ts` pins both directions; run it before trusting any reasoning built on the invite branch.
