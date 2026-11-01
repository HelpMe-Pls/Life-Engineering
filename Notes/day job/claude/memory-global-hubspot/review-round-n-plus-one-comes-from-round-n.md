---
name: review-round-n-plus-one-comes-from-round-n
description: "An adversarial review loop must run a round PAST its first clean report, and the highest-yield dimension is always what the previous round changed"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 364ea5de-9188-4e83-bc83-49c70d6df1e8
  modified: 2026-09-11T16:32:49.756Z
---

A fix in round N causes the finding of round N+1. Measured over the #869 loop on 2026-09-11,
where it held **four times running**: round 1's last finding was caused by round 1's own earlier
fix; nine of round 2's ten traced to the two `DEC-` forks the operator had just answered; all
three of round 3's were caused by round 2; and round 4 came back empty only because round 3 had
been re-reviewed after it. 23 findings, and the ones that mattered most were all self-inflicted.

**Why:** a fix changes what a predicate ANSWERS, and every sentence and gate downstream of it
goes false **without moving in the diff**. The compiler cannot see it (no type changed), the
reviewer cannot see it (the file is not in the diff), and the tests cannot see it (they were
written for the old answer). So the newly-wrong code is exactly the code nobody is looking at.

**How to apply:**
- Never stop on the first clean report. **Re-review AFTER the last fix, never alongside it**, and
  keep going until a round comes back empty on its own.
- Make "what the previous round changed" an explicit review dimension, quoting the commit SHAs
  and what each one widened or re-owned. It outperformed fresh-eyes-on-the-whole-diff every time.
- When a round's fix widens a predicate, enumerate its CALLERS by hand and ask what each says
  for the newly-admitted shape — see [[widening-a-set-can-disarm-an-unstated-gate]] and
  [[changing-an-invariant-means-grepping-the-sentence]].
- Two opposing skeptics per candidate (one refuting the claim, one tracing reachability and
  cost) killed ~70% of reported findings, including several that were factually true but not
  defects. A finding is evidence, not a verdict — [[refutation-runs-both-ways]].

Related: [[surface-sweep-misses-the-one-that-persists]].
