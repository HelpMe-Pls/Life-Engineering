---
name: verifier-fleet-leaves-source-mutations
description: A verifier fleet reads the WORKING TREE, not the ref under review — so it leaves mutations behind AND falsely refutes findings you are mid-way through fixing; pin every agent to an explicit ref
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 00e4b0b7-5fed-48d1-b702-fac87dd6ea00
  modified: 2026-08-23T16:07:33.548Z
---

**A fan-out whose agents prove a test red by MUTATING SOURCE will leave some of
those mutations behind.** Measured 2026-08-16 during the two-repo test-suite audit
([[test-suite-clean-minimal-standard]]): four edits survived across two working
trees — `website/lib/admin/altai-sync-layout.ts`, `website/lib/notifications/index.ts`
(self-labelled **"MUTATION-B (temporary)"**), a stray `website/tests/zz-scratch-probe.test.tsx`,
and `src/validate/counts.ts` **on the producer's `main` branch**.

**Why:** an agent that dies mid-run — a session limit killed 41 of 88 here — never
reaches its revert step, and nothing announces the leftover. It does not show up as
a failure: a mutated tree usually still typechecks and often still passes, because
the mutation was chosen to break exactly ONE assertion. The danger window is the
moment you stage: `git add <file>` on a path an agent touched commits a deliberate
defect wearing a green suite.

**How to apply:**
- After ANY fan-out that mutates source, `git status --porcelain` **and** `git diff`
  every working tree involved — including repos you only READ from — before staging.
  Confirm byte-identical to the remote, not merely "no failures".
- Never `git add -A` after a fan-out (already forbidden here, and this is why).
- Watch the producer clone especially: agents work on whatever branch it sits on,
  and that is `main`, which is production for `altai-hubspot-sync`.
- Treat a partially-dead fleet as *both* incomplete AND dirty — report the unverified
  remainder rather than letting "audited" imply "clean". See
  [[background-workflow-shell-hang]] for the related failure where backgrounded
  agents report nothing at all.

## ⚠ The INVERSE, and it is more dangerous: a fleet FALSELY REFUTES what you are fixing

Measured 2026-08-23 reviewing promotion #630. The fleet mutated nothing this time —
but its refuters read the **working tree** while I was fixing findings in it, so
they "disproved" the very defects they had just found. Verdicts came back
*"REFUTED on the facts: `/admin/altai-sync/erd` is NOT in
INTERNAL_REDIRECT_DESTINATIONS — I read the real file at HEAD"* — true of my
half-finished worktree, false of the reviewed branch. **Four of 27 verdicts were
this artifact.** One refuter caught itself, re-read via `git show origin/dev:<path>`,
and reversed to "could not refute"; the others did not, and would have talked me out
of a real HIGH-severity fix.

**How to apply:**
- **Pin the fleet to a ref, in the prompt:** "read via `git show <ref>:<path>`; the
  working tree is NOT the subject." A review of a PR is a review of a *ref*.
- **Do not fix while a review fleet is in flight** over the same files — or if you
  must (it is a good use of the wait), discount every refutation whose reasoning
  quotes the current file rather than the ref.
- A refutation that says *"I read the real file at HEAD"* about a finding you are
  actively fixing is evidence of nothing. Re-check it against the ref yourself.
- Same run: the session limit killed **63 of 96** agents mid-refutation (41 of 88 the
  previous time), so budget a fan-out to finish, and treat missing verdicts as
  *unjudged*, never as *refuted*.

## ⚠ KNOWING THIS IS NOT ENOUGH — I BROKE IT TWICE MORE, so here is the mechanism

Measured 2026-09-04 on #839. The rule above ("do not fix while a review fleet is in
flight") was already written down, and I violated it twice in one session: round 5's
lenses reviewed a tree that moved under them and **three of their findings were about
text already fixed**, and later I edited a doc that was inside a running lens's search
scope and had to revert it. Good intentions do not hold a tree still. **The mechanism
that does:**

- **Write the fix as a patch SCRIPT in the scratchpad, do not apply it.** Every edit
  becomes `open(path).sub(needle, replacement).save()` in a file outside the repo. The
  work still gets done during the wait — which is the real temptation — but the tree
  does not move. Apply them in one batch when the fleet reports. An asserted needle
  also fails loudly if the tree changed under you ([[patch-script-needle-must-be-asserted]]).
- **Tell the agents the ref AND that it is frozen**, in those words: "the tree is frozen
  and clean at `<sha>`; nothing will edit it while you work." They then say so in their
  notes, which makes a violation visible in the report.
- **If you slip, revert immediately** — `git checkout -- <path>` — rather than reasoning
  that this particular file is probably out of scope. It took ten seconds; deciding
  whether it mattered would have taken longer.
- `git status --porcelain` should be EMPTY for the whole time a fleet is reading. That is
  the one-command check, and it is the same check the mutation half of this memory needs.
