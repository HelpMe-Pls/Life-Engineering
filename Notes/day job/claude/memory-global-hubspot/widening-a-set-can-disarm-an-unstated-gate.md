---
name: widening-a-set-can-disarm-an-unstated-gate
description: "Adding a member to an allowlist can silently switch OFF a gate the change never mentions — every existing member was quietly supplying an invariant nobody wrote down. Ask what all the CURRENT members have in common before adding one that doesn't. It fails as a broken JOURNEY, never a broken gate, so guard tests stay green."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 71ceca70-f476-4a6e-8934-db1ddafea25d
  modified: 2026-08-24T06:57:28.059Z
---

**The shape.** A set has N members. Some *other* code depends on a property that happens to hold for all N — but nothing states it, nobody tested it, and the property is not what the set is *about*. Add member N+1 without that property and the dependent code silently stops working. The change looks unrelated to the thing it broke.

**The sighting (2026-08-24, PR #641 → #643).** `INTERNAL_REDIRECT_DESTINATIONS` is the allowlist of pages sign-in may return you to. Every entry sat under `/admin` or `/portal` — segments where **each route's own guard bounces `must_set_password` to the password form**. So sign-in never had to know about that flag; the guards always caught it downstream. Nothing recorded that dependency.

Adding `/kb`, `/kb/<slug>` and `/tutorial` — which are public and **guard nobody** — meant an invitee whose device remembered an article landed on it and was **never asked to choose a credential**, leaving a shared, known default password live. The allowlist change and the password gate are in different files and read as unrelated.

**Why it evades tests.** It is not a privilege hole — `/admin` still refused them — so every guard/auth test stayed green. What broke was the *journey* (this app's "request access → set a password → upload" SLA), and journeys are only asserted end-to-end. A unit test of the gate passes; a unit test of the allowlist passes; only an E2E that signs in a flagged user *with a remembered public page* sees it.

**How to apply:**
1. Before adding a member to any set (allowlist, enum, route table, feature list), ask: **what is true of every member today that is not part of the definition?** Grep for code that consumes the set and check whether it leans on that.
2. Prefer to state the recovered invariant in the set's own header, so the next addition trips over it.
3. Test the *journey*, not just the new member — the failing assertion has to be about the user's outcome.
4. Prove it by mutation: remove the fix and watch the E2E land on the new member's URL. Mine printed `unexpected value "http://localhost:3100/kb/lifecycle-stage"`, which is the whole bug in one line.

**Sibling failure in the same fix, worth pairing:** an enforcement expressed as an **absent parameter** is defeated by a *different* parameter. `resolvePostPasswordDestination` refuses the remembered-page cookie by having no field to pass one in — the record calls that signature "the enforcement". Carrying the sign-in chain's answer into the form's `?next=` handed the cookie through the front instead. **When a rule is enforced by a type rather than a check, list what else reaches the same place.**

And: **count the DOORS, not only the gates.** The same session, the fix went onto two of three call sites — the missed one was `/login`, which redirects an **already signed-in** visitor and so decides a landing with no sign-in happening. Both fixes read as done. The cure was one composed owner plus a structural test asserting the whole list of callers, so a fourth door has to be added deliberately.

Relates to [[guard-root-narrower-than-surface]] (a guard whose root is narrower than the surface it claims), [[recurring-bug-class-needs-enumeration]] (enumerate the class, don't hunt again) and [[shared-helper-contract-belongs-at-its-own-seam]].

**⭐ THE MIRROR IMAGE, AND IT COST A ROUND: REMOVING A FILTER DOES THE SAME THING (2026-08-25, #648 round 4).** A query read a chapter's newest audit row with `.eq('metadata->>source','backfill_0040')`. That filter was a real bug — it asked "was this chapter EVER backfilled" instead of "is that still the last thing this rule did", so it hid a newer `…_stranded_cleared` row and the clear fired forever. Removing it was correct **and incomplete**: a `first_signin_name_fill` row is *also* newer than the crowning row, and it records a COMPLETION — nothing about whose address this is. So the unfiltered read returned the completion, the provenance check answered null, and a chapter whose app-filled name an admin had blanked kept an address with **no name, no `+ Set owner` prompt** (the cell renders `name || email`) and **no way to be cleared** either.

That silently reversed an **accepted cost the decision record already stated**: DEC-OWNER-COMPLETE said both *"an admin who clears the name of an Owner this app backfilled still sees it return"* AND *"`first_signin_name_fill` is not provenance"*. Both hold **only if the read looks past a completion row** — and nobody had written that down, so a one-line query change broke one of them with every guard green.

**How to apply, on top of the rules above:**
- A filter, like a set, encodes an invariant. **Before deleting one, name what it was buying** — not what it was breaking. Both can be true, and here both were.
- The right question was neither "the newest row" nor "the newest backfill row" but **"the newest row that changed WHO the owner is"**. When a predicate is wrong, the fix is usually a *different* predicate, not *no* predicate.
- **Exclude rather than allow-list** when a judge downstream whitelists: `.neq(source, nameFill)` lets a source added later reach the judge and fail closed there, where `.in([...])` makes it vanish at the query.
- When a decision's two clauses only coexist under a specific mechanism, **write that mechanism into the decision** — that sentence is the whole defence.
- Pin the request SHAPE by name at the mock seam (no `eq` on the column, and a `neq` on exactly one value), so re-breaking it means overruling a named assertion in writing rather than updating an anonymous array diff.

**⚠ AND THE THIRD ACT: FIXING THE CODE LEFT THE DECISION RECORD STILL ORDERING THE BUG (same day, round 5).** After the `.neq` fix landed, `DEC-STRANDED-OWNER` still read *"⚠ The provenance read must NOT filter on `metadata->>'source'`"* — a blanket imperative, two paragraphs from the `DEC-OWNER-COMPLETE` entry that had just been amended to say the read must look past a completion row. Two decision records one page apart, opposite instructions, one line of code. In a repo that treats the record as the source of truth and re-derives from it, that is a scheduled regression: the next person deletes the fix, reds two pins whose messages now read as stale, and finds the argument for deleting them written in the spine. The commit that caused the original reversal said it happened because *"nobody had written that down"* — while the sentence saying the reverse was still written down, untouched.

**The rule: when you amend a decision, grep every OTHER decision for the imperative you just inverted.** An amendment is only half the edit. Same pass, check the code comments — `ownerProvenance`'s docstring still claimed "the caller's query is deliberately unfiltered, so this is the only place the source is judged", in the docstring whose entire job is to say where the source is judged. Both were found by a review round aimed at the previous round's FIXES, which is why that round exists.
