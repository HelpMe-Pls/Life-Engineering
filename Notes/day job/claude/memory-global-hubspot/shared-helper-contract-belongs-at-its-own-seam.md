---
name: shared-helper-contract-belongs-at-its-own-seam
description: "STANDING — when a shared helper owns a behaviour, assert its contract ONCE at the helper's seam; a per-call-site copy pins wiring, breaks on refactors, and still misses the next call site. If nothing varies across the call sites, they were never seams."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: bbac091b-ad08-472a-880e-af0f04e66d7a
  modified: 2026-07-27T11:00:49.985Z
---

Operator, 2026-07-27: *"it's CRITICAL that the ENTIRE test suite is MINIMAL and
correctly **seamed** to avoid bloating the local CI gate."* This is a whole-suite
standing bar, not a rule for new tests only — sweep for violations before any prod
promotion. It is also written into
`.claude/rules/website/testing.md`; this memory is the worked example.

**The worked case (round 14, PR #367).** Nine "burst" suites across seven files each
mounted a different control, fired a native click burst, and asserted its server
action ran exactly once. But "a burst runs the task once, dropping rather than
queueing" is `lib/use-action-runner.ts`'s own contract, already asserted at its
interface in `tests/use-action-runner.test.tsx`. So each of the nine tested the
runner a **second** time through a component, and what it uniquely pinned was only
that *this* component is wired to it.

**Why that is the wrong seam, in the /codebase-design vocabulary:**
- **The interface is the test surface.** Those tests reached *past* the runner's
  interface to re-derive a guarantee that lives behind it.
- **The deletion test.** Delete one: the drop-not-queue guarantee does not vanish
  (it is at the seam). Only a wiring assertion does.
- **One adapter means a hypothetical seam; two means a real one.** There is exactly
  ONE transition owner, so nothing varied across those nine "seams" — they were not
  seams. **This is the question to ask when a per-call-site test feels necessary:
  what varies across these call sites? If nothing, don't write it.**
- They covered 9 of 29 adopters and said nothing about the 30th — which is the one
  that will have the bug.

**How to apply — find the invariant's real seam and assert it once, structurally.**
Here the wiring fact ("every action-firing control routes through the runner")
generalises to "**exactly one module may own a `useTransition`**", which is one
filesystem-scanning test over every file including files that don't exist yet:
`tests/action-runner-seam.test.ts`. Ten tests and ~600 lines became one.

Two details that made it sound rather than clever:
- **Assert the whole owner list (`expect(owners).toEqual([THE_ONE]))`, not "no
  offenders".** An empty-offenders assertion passes vacuously if the helper is
  renamed away or the matcher stops matching anything.
- **Match import specifiers, not the text** — several files *mention* `useTransition`
  in comments describing this very hazard, and one (`ContactsEditor`) had a stale
  mention while not using it.
- Write the rule into `.claude/rules/website/architecture.md` so the test enforces a
  **documented** standard rather than an invented one.

**Keep the half that is genuinely the component's own behaviour.** `AccountsTable`'s
burst suite also asserted *which row* goes busy (`rowBusy` keyed off the runner's
urgent `busyId`, covering every action button in that row). That is AccountsTable's
logic, not the runner's — it survived as `accounts-table-row-busy.test.tsx`.

**Prove every deletion's replacement by reverting it in place** and watching that
specific test go red — the seam test must name the offending file. Net effect:
184 files / 1196 tests → **179 / 1186**, and the gate got faster.

See [[test-suite-clean-minimal-standard]] (the same bar, stated generally),
[[async-transition-state-defers-until-settle]] (why the runner's prepare slot is
urgent, i.e. what the seam actually owns).
