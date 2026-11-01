---
name: batch-2026-07-05-5tasks-dev-promotion-214-pending
description: The 2026-07-05 5-task queue SHIPPED TO PROD via promotion #214 (merge 4e3f2f9), prod-verified; DEFAULT-PW + WELCOME-EMAIL-TIMING queued next
metadata: 
  node_type: memory
  type: project
  originSessionId: 6441f405-17ad-41ed-a45c-8d1aa9bfb880
---

**✅ 2026-07-07 — PROMOTION #214 DONE + PROD-VERIFIED.** Merged dev→main via **merge commit `4e3f2f9`** (`--merge`, NOT squash, NOT --delete-branch — dev head kept; main↔dev content-equal). Vercel prod deploy `dpl_Hyphcvek4...` = READY / target=production / commit verified (author Kh0iLe mapped fine — the author-mapping gotcha didn't bite). Prod smoke green: canonical domain `/` `/login` `/request-access` = 200, `/admin` = 307-gates anon. No migration this batch. All PRs merged/closed; branches = only dev/main. Queue now holds 2 planning tasks (DEFAULT-PW + WELCOME-EMAIL-TIMING) for a fresh session.

**2026-07-06:** The 5-task Agent-ready queue (queued 2026-07-05) all SHIPPED TO `dev` + CI-green, each squash-merged:
- **AUTH-SAFELINK** #207 (`fix`) — set-password links no longer verify on GET; a shared interstitial (`lib/auth/confirm-interstitial.ts`) renders on GET, explicit user POST triggers `verifyOtp`/`exchangeCodeForSession`. Covers `/auth/confirm` (token_hash) + `/auth/callback` (PKCE `?code`). Emails reworded (AdminInvite + SignupRequestApproved). Browser-verified + auth e2e through the interstitial.
- **ROLE-PARITY** #208 (`refactor`) — `/admin/accounts` is the SOLE master-only surface. `deleteChaptersBulk`/`moveChaptersToWave`/`removeChapterAccount` → `requireAdmin`; `canBulkDelete`→`canBulkManage=isAdminRole(getRole())`, `canManageAccounts=isAdminRole(viewerRole)`. See [[promotion-192-admin-uxperf-batch]] lineage. DEC-ROLE-PARITY.
- **UI-CURSOR** #210 (`fix`) — 37-file cursor-affordance sweep (cursor-pointer on clickables, disabled:cursor-not-allowed on in-flight buttons). Done via a codemod + manual variable-className fixes; MobileDrawer cursor-default + WaveEditor disabled:cursor-wait intentionally kept.
- **CHAP-CAMPAIGNS** #211 (`feat`) — "View email campaigns" link on chapter-detail Status card → https://resend.com/broadcasts; later color-matched to brand-primary (bundled into #212's branch).
- **CHAP-ADD-ACCTS** #212 (`feat`) — "Add accounts" multi-invite modal on chapter detail; new `inviteChapterAccountsBulk` action (requireAdmin, role=chapter+chapter_id set before email, skip-and-report bad rows, new audit action `chapter.account.invite`). Browser-verified: provisioned acct landed role=chapter+chapter_id with audit row. NOTE #212 had to be rebased onto dev (its base branch role-parity was deleted on merge → auto-closed #209; recreated as feat/chap-add-accts-v2 → PR #212).

Docs close-out **#213 MERGED to dev**: cleared the shipped 5 + the Stakeholder-assisted block (PERF sin1 probe + 0018 backfill spot-check — verified), Status now says dev-ahead-of-main.

**STILL OPEN: promotion PR #214 (`dev`→`main`) — do NOT merge without explicit per-promotion go-ahead** (prod deploy). No new migration in this batch (all app-layer; prod already on 0001–0018). Merge via merge-commit, never --delete-branch ([[promotion-merge-convention]]).

**Queued next (DEFAULT-PW, planning-only in next-steps.md):** invited accounts get a known role-based default password (chapter `EOHub$p0t` / admin `EOAdm1n$`) as a **Resend-deliverability fallback** — Resend is NOT reliably delivering the invite/set-password email (observed in prod: jason@kalicube.com "Invited", no email in Resend). Default pw ADDS alongside the set-password link (not replace); change **highly recommended, NOT forced** (lowest friction — a forced reset defeats the fallback for a no-email user). DEC-DEFAULT-PW recorded. Skills to use: brainstorming→tdd→domain-modeling→verification.

**Diagnostic captured (jason@kalicube.com):** `welcome_email_sent_at` NULL while `first_signed_in_at` set is EXPECTED, not corruption — the two columns are written by disjoint paths. `welcome_email_sent_at` is stamped ONLY in `maybeSendWelcome()` at `app/auth/callback/route.ts` (the `/auth/callback` PKCE `?code` door). `first_signed_in_at` is stamped by `markFirstSignIn()` at BOTH `loginWithEmail` (signInWithPassword) and `updatePassword` in `lib/auth/actions.ts`. Invite link (`/auth/confirm`) + plain login never hit `/auth/callback`, so they set first_signed_in_at but never welcome_email_sent_at. (Could not read prod row directly — `.env` service-role key is hard tool-blocked; answer derived from code paths.)

Bash tool got wedged mid-session (auto-backgrounding/hanging) — switched to PowerShell tool for git/gh ops, which worked reliably. gh via PowerShell: `$env:GH_TOKEN=$null; gh ... 2>&1 | Out-String`.

**Close-out INCLUDES clearing ALL stale branches (stakeholder-required 2026-07-06):** after the per-PR merges + doc close-out, delete every merged feature/docs branch — remote AND local — leaving only `dev` + `main`. `gh pr merge --squash --delete-branch` removes the remote head, but: (a) an orphaned branch whose PR auto-closed (e.g. the original stacked `feat/chap-add-accts` whose base was deleted) needs a manual `git push origin --delete <br>`; (b) local branches always linger — `git fetch --prune` then `git branch -D <each>` (squash-merges aren't "fully merged" by SHA so `-d` refuses; `-D` is correct here). Verify with `git branch` + `git branch -r` = only dev/main. See [[promotion-merge-convention]].
