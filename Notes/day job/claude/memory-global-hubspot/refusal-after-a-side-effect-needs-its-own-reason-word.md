---
name: refusal-after-a-side-effect-needs-its-own-reason-word
description: "A guard added AFTER a side-effecting call must never reuse the pre-call skip's reason word — that word means 'nothing happened' and the operator acts on it; filed three separate times in one review of #855 before the class was seen"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e48b8a2d-313d-42d7-8114-e49a6d880a43
  modified: 2026-09-05T23:18:53.533Z
---

**The rule: at a door where the create/invite has already run, a refusal is never a no-op — because the call itself is the side effect. A new post-call refusal needs its OWN reason word, always.**

Cost of not having this: rounds 17, 18 and 20 of the #855 review each filed the **same defect** in the **same file** (`website/app/admin/chapters/[id]/account-actions.ts`), and I fixed each one individually as a one-off before seeing they were one class:

| round | reported as | the word means | should have been |
|---|---|---|---|
| 17 | `error` — "try again" | nothing happened | `created_unchecked` |
| 18 | `admin` — "already an admin account" | nothing happened | `admin_link_reset` |
| 20 | `other_chapter` — "belongs to another chapter" | nothing happened | `other_chapter_link_reset` |

Round 20's instance was **inside round 19's own fix** — I wrote the third copy of the bug while fixing the second.

**Why the reuse is so tempting, and why it is wrong.** The pre-create skip already has a perfectly-worded reason for the same *condition* (`other_chapter` — "she belongs to another chapter"), so the post-create guard reaches for it. But the two arms differ in what they LEFT BEHIND, not in what they detected. Here `generateLink({ type: 'invite' })` does not bounce off an unconfirmed account (measured — see [[gotrue-invite-does-not-bounce-an-unconfirmed-account]]): it hands that account back and **rotates its pending token dead**. So the refusal is correct and the person is still locked out, with the operator reading a word that says nothing needs doing.

**How to apply.** When adding a guard, first ask *what has already run above me?* If anything did, enumerate every exit below it as a table — reason word → the sentence the operator reads → what actually happened — and check each row. Two extra tells that this class is present:

- **A sibling arm a few lines away already discloses the same consequence.** Round 20's `admin_link_reset` sat eleven lines above and said "its pending sign-in link was just reset"; the same click's same consequence was disclosed for one tier and hidden for the next.
- **The label names a SCREEN the operator cannot reach.** "Use Resend on its row" is only actionable on the page that renders it — see [[fork-journey-must-be-traced-through-the-real-caller]]. Name a **person** ("an admin on that chapter must resend it"), never a screen, whenever the door's own operator cannot act.

Generalises past this repo: a refund that failed after the charge, a rollback after a partial write, any compensating path. Reusing the "we didn't do anything" word there is a lie the operator acts on.

Related: [[status-word-is-not-evidence-tie-to-origin]], [[audit-row-order-stops-vs-enables]], [[recurring-bug-class-needs-enumeration]], [[changing-an-invariant-means-grepping-the-sentence]].
