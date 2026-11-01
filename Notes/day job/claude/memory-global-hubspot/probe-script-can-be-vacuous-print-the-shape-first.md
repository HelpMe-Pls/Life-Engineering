---
name: probe-script-can-be-vacuous-print-the-shape-first
description: "An ad-hoc measurement script is a guard too — `a?.user?.id === b?.user?.id` on a response shape you guessed compares undefined to undefined and prints true"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dd0580fc-e773-4808-aa7c-f4ba9ede96a6
  modified: 2026-09-04T10:26:29.060Z
---

**Measured GoTrue's re-invite behaviour with a throwaway probe and nearly believed a vacuous result.** The script asserted `sameUser: b.json?.user?.id === a.json?.user?.id` — but that endpoint returns the user at the TOP level, not under `.user`, so both sides were `undefined`, `undefined === undefined` was `true`, and it printed `sameUser: true` for a reason having nothing to do with the accounts. The neighbouring `confirmed_at` read was empty for the same reason. The conclusion happened to be right, which is worse: a wrong shape and a right answer look identical.

**Why:** every rule in [[vacuous-guard-shapes-found-by-audit]] applies to the scripts used to *find* the facts, not just to the tests that pin them — and a probe gets no review, no red-then-green, and is usually written in a hurry to settle an argument.

**How to apply, in this order:**

1. **Dump the raw shape before asserting on it** — `Object.keys(response)` and one full `JSON.stringify` — then write the assertions against what actually came back.
2. **Optional chaining on both sides of `===` is the tell.** `a?.x?.y === b?.x?.y` cannot distinguish "equal" from "neither exists". Assert the operands are truthy first.
3. **Include the negative case in the same run.** Here, the confirmed-account probe returning 422 is what proved the unconfirmed 200 meant something; either alone would have been unfalsifiable.
4. **Status codes are the trustworthy part** — 200 vs 422 was right even while the body parsing was wrong. Lean on them.
5. Re-run the finding through a real test at the end. What the probe discovered belongs in a suite (`tests/signup-approve-live.test.ts`), or the next session re-argues it from a comment.

Related: [[report-that-names-its-own-fix-must-be-measured]], [[decoy-must-sit-between-winner-and-boundary]].
