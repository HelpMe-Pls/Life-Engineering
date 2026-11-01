---
name: status-word-is-not-evidence-tie-to-origin
description: "A row's status word is only evidence if a stranger cannot cause it — in this app 'approved' is auto-set by an anonymous form, so adopting an approved row let a visitor name someone else's account; tie the adoption to an ordering the adversary cannot invert (the row must PREDATE the account), never to the status"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9147b263-7792-4834-a5f3-05209477702b
  modified: 2026-09-03T05:26:47.758Z
---

#833, PR #837 (2026-09-03). The sign-in display-name fill adopted the name from an **approved** `signup_requests` row for the account's address, on the reasoning that "an approved row was produced by an approval this app ran for that mailbox". That sentence was false in this codebase, and I wrote it into the module's own header as the security argument.

**Why the status word was worthless here.** `submitSignupRequest` **auto-approves instantly with no human review** (D-AA-1, #48 — `actorId: null`, so `reviewed_by` is null on every form approval), and its lost-email path deliberately lets an existing chapter account re-request **its own chapter** (`chapterAccountConflict` returns false for that case) whenever no approved row exists for that (email, chapter) pair yet — which is **every admin-invited account**, i.e. exactly the population the fill targets. So an anonymous visitor who knew an address and its chapter could POST the public form with any name and get an `approved` row carrying it. Cosmetic identity rather than authorization — but the fill made it **permanent**, because the key it writes is never re-filled.

**The fix is an ORIGIN TIE, not a stronger status.** `.lt('created_at', user.created_at)`: a form-provisioned account's own request always predates it, because the row is inserted and the auth user is created *inside* the approval; a row added beside an account that already exists never can be. `reviewed_by is not null` was the tempting alternative and is useless — auto-approval leaves it null on every legitimate row, so the feature would do nothing. **Look for an ordering or a provenance the adversary cannot invert; do not look for a better flag.**

**What the tests got wrong, and it is the reusable part.** Every test written for the first cut modelled a **weaker adversary than the one that exists** — a newer *pending* row. So the suite was green, the E2E was green, and the live suite was green, all against an attacker who cannot do what the real attacker can. **Derive the adversary from the write paths** ([[gate-evidence-set-must-match-write-paths]] is the same discipline for reads): ask "what is the strongest row a stranger can actually cause?", then seed THAT. With the fixture corrected, removing the guard names the account `Stranger Danger` against real Postgres — which is what proved both the hole and the fix.

**⚠ UPDATE 2026-09-03, PR #839: THE ORDERING WAS NOT UNINVERTIBLE EITHER, and the sentence above said it was.** `created_at` is not server-stamped — `0041` grants `all privileges` on `signup_requests` to `anon` and `0008`'s anon-insert `with check` names only `status`/`reviewed_at`/`reviewed_by` — so an anonymous PostgREST POST can carry ANY timestamp. **Measured:** a row inserted with `created_at: 2020-01-01` is stored verbatim; an anon `PATCH status=approved` is refused (positive control: the same PATCH under the service role lands, so the 204 was a zero-row no-op). Worse, `submitSignupRequest` approved *the newest pending row for the address* rather than the one it had just inserted, so a FUTURE-dated plant was adopted wholesale — and since #830/#831 that row's name became the display name and its notes the internal note. **So the real guarantee was TWO writes, and only one of them lived in the module that depended on it.** The generalisation: **when you write "the adversary cannot produce X", go and produce X** — against the actual grants and policies, not against what the app happens to write. See [[locate-by-ordering-is-steerable-mint-the-id]].

Also: the module comment that stated the false invariant is what made the hole reviewable. A wrong security claim written down beats an unstated one, because a reviewer can check a sentence.

Related: [[verified-token-proves-who-not-what-they-may-do]], [[widening-a-set-can-disarm-an-unstated-gate]], [[audit-row-becomes-load-bearing-input]].
