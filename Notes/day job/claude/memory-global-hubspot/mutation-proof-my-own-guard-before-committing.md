---
name: mutation-proof-my-own-guard-before-committing
description: "I apply the vacuity memories to OTHER people's guards and not to the one I am writing in the same breath — mutate every new guard, one mutation per clause, before the commit"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 364ea5de-9188-4e83-bc83-49c70d6df1e8
  modified: 2026-09-11T13:18:20.414Z
---

**Measured 2026-09-11 on the #869 review round: I wrote two new guards and BOTH carried a defect I already had a memory for.**

- `source-has-no-nul-byte.test.ts` — walk root narrower than its claim ([[guard-root-narrower-than-surface]]). I had written a comment *in that very file* warning about this shape.
- `reread-file-ownership.test.ts` — a two-clause OR guard whose fixture tripped both clauses, so one was unpinned ([[two-gates-need-two-tests-stronger-masks-weaker]]). That memory's step 3 is literally the procedure that found it.

**Why:** the vacuity memories all read as *review* advice — how to audit a guard somebody else wrote. Writing one puts me in author mode, where the test passes, the reasoning feels sound, and nothing prompts the audit. The memories fire when I am looking for a defect and stay silent when I am producing one.

**How to apply — the loop is not red-then-green, it is red-then-green-then-MUTATE:**

1. A new guard passing on arrival proves nothing. Before committing, break the source it protects and watch it fail.
2. **One mutation per CLAUSE of the invariant, not one per guard.** Delete each half of an `||` separately; the right result is exactly one case red per mutation. Zero red means that clause is unpinned; many red means the cases are coupled and none of them isolates anything.
3. For any guard whose corpus is a walk, **plant the offender OUTSIDE the narrowest root**. A corpus-size floor does not catch a narrow root — 720 files passed a `> 400` control while missing four whole categories.
4. Restore with a byte-exact backup, then `git status --short` to prove the tree is clean. Never hand-retype the original.

**This is cheap.** Both mutations above took under a minute each and each found a real hole. Skipping them is what cost a reviewer round.

Related: [[red-recipe-is-a-hypothesis]], [[vacuous-guard-shapes-found-by-audit]], [[test-suite-clean-minimal-standard]].
