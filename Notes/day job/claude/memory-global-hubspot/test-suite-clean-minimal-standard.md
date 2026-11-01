---
name: test-suite-clean-minimal-standard
description: "Operator standing requirement — test suite must be clean & minimal (no noisy/implementation-detail/duplicate tests), enforced before any prod promotion"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d66ea549-f2e7-4b4e-942e-04a3a7d4132a
  modified: 2026-10-18T04:49:17.598Z
---

STANDING preference (khoi.le, 2026-07-14): the test suite must stay **clean and
minimal** — no noisy tests, no tests for implementation details, no redundant
duplicate coverage of the same behavior. When a shared helper exists, test its
CONTRACT once at the helper seam; do NOT re-assert "action X calls the helper" at
every call site (that's wiring/impl-detail noise). Prefer strengthening an
existing test (e.g. add a no-op guard) over adding a whole new test case.

**Why:** duplicated per-call-site assertions test wiring not behavior, and a bloated
suite hides real signal + slows the gate.

**How to apply:** apply this standard to YOUR new tests AND run a whole-suite
clean+minimal sweep BEFORE merging any prod promotion (e.g. #271) — not only to
the session's own additions. Pairs with the no-regression gate ([[pr-merge-gate-check-by-type]]).

**(2026-07-28) Re-stated as CRITICAL for BOTH repos, and audited — #402.** Frame it
with `/codebase-design`: *the interface is the test surface*, so a test belongs at
the seam of the module whose behaviour it pins, and **each seam wants exactly one
owner**. Consumer went 182→179 files / 1215→1213 tests with no coverage lost;
producer had **no** violations.

**The mechanical scan that found everything** — for each test file, list the
non-mocked modules it imports, then group by module. A module imported by many test
files is a candidate split seam; combine with a `<=2 tests` list to find files that
exist for one assertion. (In the producer the same signal is mostly harness
dependencies — `RunContext`, clients, `domain/types` — not split seams.)

**⚠ THREE THINGS LOOKED LIKE VIOLATIONS AND WERE NOT. Read the file's own header
before cutting; twice it was the only thing that saved a load-bearing test:**
- A **delegating shim's** tests may be legitimate if they cover only what the shim
  ADDS (`column-widths`: numeric-scope coercion, a FALSY `0` sentinel, its own
  column set) rather than re-asserting the generic model.
- A test that reads like **styling** may be a named DECISION lock (`auth-forms-ui` =
  AUTH-UI-1/2, one contract asserted once while enumerating its three subjects).
- N files sharing a **big mount** is fine when the big thing IS the surface the
  decisions live on (six `wave-board-*` files, each a named decision or a
  browser-specific regression).

**(2026-07-30) Picking the owner for a NEW guard: read candidate headers, and do NOT
trust next-steps.md's file suggestion.** Its backlog bullet said to guard the object
map's plain-text list in `tests/altai-sync-graph-layout.test.ts` "which already owns
GRAPH_NODES/GRAPH_EDGES" — but that file's own header scopes it to **drag physics**
asserted against `stepLayout`, and it imports GRAPH_NODES only as layout INPUT. The
real owner is `tests/altai-sync-view.test.ts`, whose header is "the rules that make
this page honest… each describes a way the page could LIE" and which already carries
structural `OBJECT_MAPPINGS` assertions. **Importing the same constant is not
ownership; the property being asserted decides the seam.** A duplicated rendered line
is an honesty property, not a physics one. (Tests may import `@/app/...` components
and server actions directly — well-established here, so a `.tsx`-only helper is never
the reason to pick a different home.)

**And the discriminating-fixture test:** a call-site copy is only redundant if it
discriminates nothing extra. `load-chapter-accounts` had two invited-status cases —
one with `first_signed_in_at`/`last_sign_in_at` both null (they AGREE ⇒ proves
nothing the pure test doesn't) and one where they DISAGREE (the loader's own field
choice, which the pure seam cannot see). Delete the agreeing one, keep the other.

**(2026-08-16) THE QUESTION IS "CAN THIS ASSERTION FAIL?", NOT "IS THIS A
DUPLICATE?" — and #402's "producer had no violations" above is now FALSE.** A
second two-repo audit (consumer PR #578, producer PR #181) confirmed **nine**
findings and **not one was a duplicate** in the ordinary sense — each was an
assertion with no reachable red state: a `typeof x === 'function'` roll-call over
eight symbols the import statement already proves · a `not.toBe` against a value
the code cannot produce · a layout test pinning `max - min === 660` where 660 is
its own input restated · a class-**ORDER** assertion on `cn()` output · and a whole
file (`tests/landing-redirect.test.ts`) whose name promised a landing redirect and
never imported the page. **Ask what edit to the SOURCE turns this red; if you
cannot name one, it is scenery.**

- **The fix is often NOT deletion.** Both producer findings became **differentials**
  — run the call with and without the field, assert the two answers DIFFER — which
  is the same assertion made falsifiable. ⚠ A *measured zero* is not an *absent*
  measurement, and only a differential separates them.
- **Ask it in reverse on every cut:** *what was this the only thing watching?* Two
  consumer cuts exposed real holes and needed a compensating addition.
- **Prove every change RED by mutating source first**, then revert — see
  [[verifier-fleet-leaves-source-mutations]].
- Scale, so a future sweep knows what it is looking at: 75 candidates → 35 judged
  (26 REFUTED, 9 confirmed). **Most minimality suspicions do not survive contact
  with the code.** Coverage was partial (40 never verified), so "audited" ≠ "clean".

**(2026-10-18) NOW WRITTEN INTO THE REPO, so never ask again:** the operator repeated the same sentence ("so I won't have to remind you again"), so the standard is the first bullet block of `.claude/rules/website/testing.md` (auto-loaded under `website/`) plus a pointer line in the root `CLAUDE.md` Map. Sweep shape reused: 5 read-only reviewers by area, reading files changed since the last sweep IN FULL and scanning the rest; 24 proposals, 23 applied, D2 refused (`auth-forms-ui` is a decision lock). ⚠ **A security-flavoured cut gets refused even when "owned elsewhere":** the classifier flagged an edit helper for deleting `login-destination`'s external-URL case ([Security Test Removal]); the resolver owns the rule, but it was the only check AT THE ACTION, so it was restored. Keep call-site security checks unless the operator says otherwise. `vitest list` prints nothing on Vitest 2.1 here; count from a full run instead.

**(2026-10-12, #1090) The whole-suite sweep that worked, before promotion #1091.**
Operator: _"the ENTIRE test suite ... MUST stays MINIMAL and OPTIMIZED based on the
standards of /codebase-design"_. Shape: 5 unnamed read-only reviewers (Read/Grep/Glob
only) over a FROZEN `git worktree` of the commit, one area each, all 421 files, a
JSON report with the owner's file:line per cut; then 4 edit helpers on DISJOINT file
lists in the main tree (no Bash; an Edit-only helper cannot delete a file, so `git rm`
yourself); then the parent reviews diffs, mutation-proves each repaired guard, runs the
full suite plus the changed Playwright specs. 121 proposals, 117 applied:
3,958 → 3,823 tests, 0 skipped, 58 s → 47 s wall.
- **New "looked like a violation and was not":** a LIVE GoTrue check that an unknown
  address answers like a real one (a mock cannot prove GoTrue's own answer); a
  hard-nav vs clicked-nav revoked-session pair (layout guard and page guard are two
  gates, [[two-gates-need-two-tests-stronger-masks-weaker]]); a header that names a
  cross-surface claim ("the ONE CLAIM NEITHER SIBLING FILE CAN MAKE") is a decision
  lock even when the title is not quoted; the only case pinning "no warnings" on an
  unreadable file.
- **Speed trap worth grepping for:** `import\s+([^;]*?)\s+from` in a codebase with no
  semicolons rescans the rest of the file from every `import` — 4.4 s vs 5 ms bounded
  by braces. Also: a scan helper called per `it.each` row re-walks the same tree; cache
  it per describe.
