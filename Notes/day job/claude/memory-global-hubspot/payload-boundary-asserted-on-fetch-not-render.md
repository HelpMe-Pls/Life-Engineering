---
name: payload-boundary-asserted-on-fetch-not-render
description: "\"X must never reach this audience\" is a FETCH assertion; a render-only test stays green while X sits in the RSC payload"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dba5abcd-6c10-4cbc-9222-93c24a23d5d8
  modified: 2026-08-27T00:09:30.056Z
---

When the requirement is *"an individual Edge8 address never reaches a chapter
user's browser"* (`DEC-NOTE-BYLINE`), the honest assertion is on **which ids the
address lookup was asked for**, not on what the screen says. A server component
that fetches the address and then renders `Edge8 Team` still ships the address in
the RSC payload — `document.body.textContent` is clean and the boundary is broken.

In #660 the test that carries this asserts `state.requestedUserIds` is `[]`, and
replacing `noteAuthorEmailIds({ rows, viewerId, chapterId })` with the raw
`[latest.uploader_id]` reds it with `expected [ 'admin-1' ] to deeply equal []`.
The screen-text assertion beside it does **not** move.

Two defences, and both are needed because either alone is weak:

1. **Never fetch it** — the caller resolves addresses over an id set that omits
   the forbidden side. What is not fetched is not in the payload.
2. **Check the side BEFORE the email map**, inside the shared seam, so the
   permitted branch is the only door an address can be printed through. A
   boundary that depends on every future caller staying careful is not a
   boundary.

Generalises to any "must not reach" rule: secrets, other tenants' rows, soft-deleted
records. **Ask what the server asked for, not what the DOM shows.**

Related: [[negative-spy-passes-without-the-import]], [[shared-helper-contract-belongs-at-its-own-seam]],
[[supabase-rls-read-path-traps]].
