---
name: reset-link-is-spent-by-the-first-get
description: "FIXED in #476 — resetPasswordForEmail's link pointed at GoTrue's /auth/v1/verify GET, which SPENDS the token upstream of the /auth/confirm interstitial, so any pre-fetching inbox broke self-serve reset permanently; the app now mints and sends its own link"
metadata: 
  node_type: memory
  type: project
  originSessionId: 87e2729e-dd39-4c24-86c4-4bab78b7c394
  modified: 2026-08-10T11:39:33.056Z
---

Diagnosed + fixed 2026-08-10. Filed as options in **#473**, built as option 1 in **#476** (merged to `dev`; promotion **#477** opened, operator to merge). Local GoTrue, real emails read from the mail catcher, links followed with `redirect: manual`.

**The bug:** `lib/auth/actions.ts` → `resetPassword` used `supabase.auth.resetPasswordForEmail`, which lets Supabase mint AND send — so the recipient's link was GoTrue's `…/auth/v1/verify`, **a GET that spends the token**, sitting UPSTREAM of the interstitial #207 added to `/auth/confirm` + `/auth/callback`. One automatic fetch (M365 Safe Links, mail scanner, browser preload) made the human's click the second visit → `otp_expired`. **AUTH-SAFELINK is not "add an interstitial", it is "own the first hop".** See also [[emailed-auth-token-must-be-minted-last]].

**⚠ The mechanism is PKCE, and that detail decides whether the DB evidence makes sense.** `resetPasswordForEmail` runs on an `@supabase/ssr` client, which defaults to **PKCE**, so the burning GET yields `?code=` — exchangeable only by the browser holding the `code_verifier`. A scanner never exchanges it, so **NO session is created and `last_sign_in_at` stays NULL**. Measured 2026-08-10 (local, prod row reproduced column-for-column): burned via `generateLink` (implicit flow) instead and `last_sign_in_at` IS stamped — which made the victim's row look impossible and briefly sent me hunting a manual admin action. Reproduce with `resetPasswordForEmail` on a `flowType:'pkce'` client, never with `generateLink`.

**The fix:** mint via `generateLink({type:'recovery'})` → `confirmUrl(...)` → `sendEmail` (the shape `resendInvite` already used). Taking the job back from GoTrue means inheriting its guardrails:
- **Throttle clock = `auth.users.recovery_sent_at`**, which `generateLink` stamps and advances (measured) — no new table, no serverless-forgotten counter. `lib/auth/reset-throttle.ts` is the pure policy. It also stops a double submit replacing the link already in an inbox (minting invalidates the previous token — same column).
- **Neutral result on EVERY path** (unknown address, throttled, mint or send failure) so the public form is non-enumerable. The old code leaked existence through GoTrue's rate-limit message.
- `generateLink` sends no email itself (measured 0) — no double-send.

**Falsified — do not re-investigate:** the `Add accounts` door and the default passwords (`EOHub$p0t` / `EOAdm1n$`) are innocent. An `inviteChapterAccountsBulk` account and a plain `createUser` account behaved *identically*. An address that "worked" used the **approval** email, i.e. the protected `/auth/confirm` link, never the reset flow.

**Why:** the failure looks like mail delivery or bad provisioning (Resend says Delivered; "the account was made the wrong way"), so the instinct is to re-provision the person — which cannot help, because the defect is in the link's first hop for every account.

**Why only ONE person was hit (asked 2026-08-10; the population answer, measured over all 24 prod accounts):**
- **`confirmation_sent_at` still set == the invite was NEVER redeemed** (measured: redeeming CLEARS it). Exactly **1 of 24** accounts had that — the victim. Everyone else redeemed the approval link within 2 min–1.5 h, and that link is *our* `/auth/confirm` interstitial, so they never touched the reset door at all.
- `approveSignupRequest` sets **no password**, so an unredeemed invite leaves `/forgot-password` as the ONLY door — and the approval email's own copy sends expired-link users straight to it.
- 2 other accounts did use `/forgot-password` (Jun 29, Jul 23) and show nothing: their `email_confirmed_at` was **already set**, so a burned link moves no column, and they had working sessions, so it was an annoyance not a lockout. **"Only one person" was partly a visibility artifact — that row was the only one where the bug could leave a mark.** Don't read a clean row as a working door.
- Ruled out by data, not argument: no code delta (victim and the next success ran byte-identical prod `7a11cc2`), no `chapter.account.invite` audit row ever (the `Add accounts` door is innocent — again), identical `signup_request.approve` metadata (`mode:invited, auto:true, emailSent:true`) to the accounts that worked.
- **`recovery_sent_at` is NOT proof of a Forgot-password request** — `inviteAdmin`/`resendInvite` mint `type:'recovery'` too, so an admin invite stamps it at creation. Separate them by whether the stamp equals `created_at`, and cross-check `audit_log`.

**How to apply:**
- **A repro that opens the link ONCE cannot see this** — fetch the emailed URL **twice**. A single-visit live test passes, and a mocked one always will (`tests/reset-password-origin.test.ts` passed throughout). The guard is `tests/reset-link-live.test.ts`.
- **Only a differential retires a handed-to-you hypothesis** — provision through both doors and show identical behaviour. Reproducing the symptom alone doesn't.
- `approveSignupRequest` sets **no password and does not confirm the email**, so an approved-but-never-clicked account has no way in but the link. `Add accounts` skips an email already in that chapter as `duplicate` (sets no password) — delete first if you need the default set.
- `Resend` on the roster is `role === 'admin' && status === 'pending'` only; chapter users have no such button. The portal header now has **Change password**, and `/update-password` needs only a session — that is the no-email escape.
- **E2E trap:** a first-time chapter user meets the aria-modal first-run overlay, which intercepts clicks — call `dismissFirstRunIntro(page)` (`e2e/fixtures/portal.ts`). Its interception surfaced first as a bogus `context.close()` timeout, so don't trust that attribution. Prefer `test.use({ storageState: { cookies: [], origins: [] } })` over hand-rolled `browser.newContext()`.
