---
name: two-gates-need-two-tests-stronger-masks-weaker
description: "When one defence has two independent gates, every fixture that satisfies the stronger gate silently un-tests the weaker one — delete the weaker gate and the whole suite stays green"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dd0580fc-e773-4808-aa7c-f4ba9ede96a6
  modified: 2026-09-04T17:59:21.761Z
---

**Defence in depth needs a test per gate, and the fixture for one gate is exactly what hides the other.**

Measured in #839 round 11. `carryRequestNotesOntoAccount` is gated twice, and the module header says so: the **branch** (`provisionedByThisApproval` — this approval minted the account) and the **primary key** (`account_notes.account_id` — nobody has written a note yet). Both tests that *named the branch in their title* seeded a note on the victim first, so the 23505 refusal satisfied every assertion they made — mode, note unchanged, zero upserts, zero audits. **Deleting `if (!args.provisionedByThisApproval) return` left the entire repo green**, live suites included, and two independent refuters traced the whole tree before agreeing.

**Why:** the gates are an OR. Any fixture satisfying the cheaper/stronger one short-circuits before the other is ever consulted, so the test's title and its coverage come apart with nothing to announce it. This is a distinct shape from [[vacuous-guard-shapes-found-by-audit]] — each assertion *can* fail, just never for the gate its name claims.

**How to apply:**

1. When a comment or docstring says "two gates" / "belt and braces" / "and the second does not have to be believed", that is the signal — there must be a test per gate.
2. Write the test whose fixture **removes the other gate's precondition**. Here: an account that holds NO note, which is exactly the real-world hazard (an admin-invited account never has one, and a stranger can reach it — `chapterAccountConflict` permits re-requesting the chapter you are already in).
3. Prove it by deleting each gate in turn. The right result is that **exactly one test fails per deletion**. If deleting a gate fails nothing, that gate is unpinned; if it fails many, they are coupled.
4. That one run is also the evidence the *other* tests were the masked ones — they stay green, which is the finding restated.

⚠ **Rank the branch gate below the database one where you can** — a constraint Postgres checks cannot go stale, an inference from a read taken several awaits earlier can ([[gotrue-invite-does-not-bounce-an-unconfirmed-account]]). But "the strong gate covers it" is a reason to keep both, never a reason to leave the weak one untested.

Found by a review pass whose other three findings were all refuted — see [[report-that-names-its-own-fix-must-be-measured]] for why the refutations get verified too: one of them defended a test I had deleted, and neutralising the comparator proved it red before I accepted it.

⚠ **REPEATED 2026-09-11, and this time I authored the masked test myself.** `website/tests/reread-file-ownership.test.ts` covers a two-clause guard — `data.chapter_id !== access.chapterId || !data.storage_path.startsWith(chapterId + '/')`. The obvious fixture (ask as chapter B for a row owned by chapter A) trips BOTH clauses, so deleting the `chapter_id` comparison left all five cases GREEN. Step 3 above is exactly what found it, run after the fact rather than before.

**The generalisation: an OR-guard needs one fixture per clause that satisfies the OTHER clause.** Here: a row owned by another chapter whose `storage_path` prefix MATCHES the caller isolates ownership; a row owned by the caller whose path points elsewhere isolates the prefix. Deleting either clause now reds exactly its own case.

**Do this while writing the guard, not when a reviewer asks.** Reading the test cannot show it — both fixtures look like they test the thing the title names.

