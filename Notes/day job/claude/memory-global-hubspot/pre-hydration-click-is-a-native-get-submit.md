---
name: pre-hydration-click-is-a-native-get-submit
description: "A submit click before hydration isn't \"discarded\" — it's a native GET submit that REPLACES the query string, so ?next= is destroyed"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0ff22d96-627f-4394-a518-e37b66587c25
  modified: 2026-09-09T23:43:43.099Z
---

A pre-hydration `fill()` being thrown away is the *mild* half of this class — see
[[playwright-fill-lost-to-hydration]]. The severe half: a **click on `type="submit"`**
inside a `<form>` that has no `action` is a **NATIVE GET SUBMIT**, and a GET submit does
not append to the query string — it **replaces** it with the form's own data set. With no
html `name` attributes on the inputs (TanStack `form.Field name=` is NOT one), that set is
empty, so `/login?next=%2Fadmin%2Fsettings` becomes `/login?`.

Found 2026-09-10 diagnosing #868. `remembered-page.spec.ts` had "flaked" three times on
`a bounce destination still beats the remembered page`; it was never a flake. The click
destroyed `?next=`, `signInHere`'s retry faithfully re-submitted the reloaded
destination-less form, **the sign-in succeeded**, and the chain fell to the remembered-page
rung — landing on `/admin/altai-sync` instead of `/admin/settings`.

**Why:** the fix is to name the destination (`<input type="hidden" name="next">`), which
makes the same click lossless — `UpdatePasswordForm` had this all along, `LoginForm` did
not. ⚠ Never name the credential inputs to "match": that would put an email and a
plaintext password in the URL, in history, and in every access log.

**How to apply:**

- **Reproduce this class by HOLDING THE WINDOW OPEN, never by adding load:**
  `page.route('**/_next/static/**', r => r.abort())` makes hydration impossible, turns
  one-in-a-hundred into every time, and stubs nothing about the app. ~500 ms, deterministic.
- **Assert on the navigation request the click causes**, not `page.url()` after it — the URL
  already carries `?next=` beforehand, so `toHaveURL` there is green against a form that
  cannot submit at all. That is [[vacuous-guard-shapes-found-by-audit]] wearing a new hat.
- Two general rules this paid for, both now in 🔧 8: **isolation and `--repeat-each` cannot
  see a race whose LOSING branch succeeds** (nothing errors, so every re-run says "not
  reproducible" to the wrong question — ask what the losing branch *does*); and **a retry
  cannot undo a lost interaction that had a SIDE EFFECT** on the state its caller's
  precondition lives in. Related: [[red-recipe-is-a-hypothesis]].
