---
name: mailpit-never-shows-app-email
description: "Mailpit (127.0.0.1:54324) catches only GoTrue SMTP — app mail goes via the Resend HTTP API and NEVER appears there; and the local dev env has a LIVE key, so those sends are real"
metadata: 
  node_type: memory
  type: project
  originSessionId: 00e4b0b7-5fed-48d1-b702-fac87dd6ea00
  modified: 2026-08-16T02:42:48.391Z
---

**Never tell anyone to verify an app email in Mailpit — it structurally cannot be
there.** Measured 2026-08-16 after I gave the operator exactly that instruction
for the #581 resend button and they found an empty mailbox.

Two separate mail paths, and only one of them is SMTP:

| sender | transport | lands in Mailpit? |
|---|---|---|
| **GoTrue / Supabase Auth** (its own signup + recovery mails) | local SMTP | **yes** |
| **This app** — `lib/notifications/send.ts` → every `notifyX`, invites, resends | **Resend HTTP API** | **never** |

`generateLink` only **mints** a token; it does not send. So a flow that mints a
link and hands it to `sendEmail` produces *nothing* for GoTrue to deliver, and an
empty Mailpit is the expected result, not a bug.

⚠ **AND THE LOCAL DEV SERVER HAS A LIVE `RESEND_API_KEY`, so those sends are
REAL.** `CLAUDE.md`'s warning is about the *opposite* failure (a missing key
making `sendEmail` return `{ok:false, skipped:true}`) and reads as though local
is always a no-op. It is not, at least on this machine — clicking Resend twice
against a typo'd address mailed it for real, through Resend, to the outside world.
Assume real delivery when testing locally with real-looking addresses.

**How to tell what actually happened — the audit row, not the inbox:**
`metadata.emailSent` is `emailResult.ok`, and `ok:true` is only reachable after
Resend returns an id (`send.ts:214`). A skip logs
`[notifications/send] RESEND_API_KEY is unset` to the dev server console and
records `emailSent:false`. Both are decisive; neither needs a mailbox.

```sql
select action, metadata, created_at from audit_log
where action = 'chapter.account.invite_resend' order by created_at desc;
```

**To walk an emailed auth journey locally, mint the link and click it directly:**
service-role `POST /auth/v1/admin/generate_link` with `{type:'recovery', email}`,
then build `<origin>/auth/confirm?token_hash=<hashed_token>&type=recovery&next=/update-password`
(the shape `confirmUrl` mints — `lib/auth/account-setup.ts`). ⚠ Each mint
REPLACES the token stored on the `auth.users` row, so doing this invalidates any
link already emailed — see [[emailed-auth-token-must-be-minted-last]].
