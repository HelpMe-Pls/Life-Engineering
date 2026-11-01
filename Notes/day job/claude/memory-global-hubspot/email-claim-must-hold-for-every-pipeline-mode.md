---
name: email-claim-must-hold-for-every-pipeline-mode
description: Copy that states what happened ("we made you an account") must be true in EVERY mode of the pipeline that sends it; enumerate the modes before writing it
metadata:
  type: feedback
---

#1050 (2026-10-08): I wrote an Events set-password email ("We made you an account… Set a password") for every account the Events apply flow provisioned through `approveSignupRequest`. That pipeline has two modes: `invited` (a new account, `must_set_password` armed) and `linked` (an EXISTING account that held no chapter: a recovery link, no password gate, signed straight in). A side agent caught that the linked half got a false email, and the user asked for a second version for existing accounts (shipped in #1069).

**Why:** the caller's own verdict hid the split. `accountVerdict`'s `'none'` covered both "no account" and "an account with no chapter", so the apply side looked like it only ever made new accounts.

**How to apply:** before writing copy for an email or page that a shared pipeline sends, list every mode or branch that reaches the send (here `mode` and the profile's flags) and check each sentence against each one. That includes the page the link opens: the `/auth/confirm` interstitial said "set your password" for every link. Pin each mode's subject in its own test so a wrong choice fails loudly. Related: [[recurring-bug-class-needs-enumeration]], [[fork-journey-must-be-traced-through-the-real-caller]].
