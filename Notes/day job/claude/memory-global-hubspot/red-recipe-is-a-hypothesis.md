---
name: red-recipe-is-a-hypothesis
description: A written "how to make this guard go red" is a hypothesis — run it; and a positive control asserting the failure was POSSIBLE must itself be measured
metadata:
  type: feedback
---

A recorded red recipe — "delete X and this test fails" — is a **claim about the app**, not a
fact, even when the author of the guard wrote it. Measured 2026-09-05 draining the 23-finding
e2e audit (#848): of 23 recipes, **one was wrong** and **one delivered control was false**.

- **`admin-tracker-stage`** — the recipe said delete the table's inline
  `style={{ width: visibleTableWidth(...) }}`. Done exactly: the test **stays green**. The
  table carries `table-fixed`, so its geometry comes from the `<colgroup>`'s per-column
  widths — the table's own specified width decides nothing, and the scroller keeps
  overflowing. What reds it is the recipe's *other* branch: shrink the `TRACKER_COLUMNS`
  defaults below the card.
- **`table-settings`** — the strengthening opened with a control asserting the page *can*
  scroll (`documentElement.scrollHeight > innerHeight`) so that "the page did not scroll"
  would mean something. **False**: `/admin` at 1280×560 is exactly one viewport tall
  (measured 560/560), so the document cannot scroll and the assertion is free. It failed on
  the very first green run — which is the only reason it did not ship as a lie.

**Why:** a guard is only as good as the reason to believe it can fail, and the recipe is that
reason. A wrong one leaves a strengthened-looking test with a stale warrant — worse than the
weak guard it replaced, because the next reader trusts the comment. And a positive control is
the *same shape of claim* as the guard: "the failure was possible here" needs a measurement
too, or you have added a second assertion that cannot go red.

**How to apply:** run every red recipe before you cite it. When one does not red, the finding
is not dead — find the lever that does, and record that the recorded one was wrong (that
correction outlives the finding). Before writing a control of the form "the environment could
have shown the failure", probe the number: a throwaway spec that dumps the geometry beats a
plausible identity. See [[probe-script-can-be-vacuous-print-the-shape-first]] and
[[report-that-names-its-own-fix-must-be-measured]].

**Practical, this repo:** Playwright's `webServer` is not left listening between runs (nothing
on 3100 after a run finishes), so **every `npm run test:e2e` re-runs `next build`** — an
app-source defect is picked up by the next invocation with no manual restart, and
`reuseExistingServer: !isCI` never gets in the way. Batch several app defects into one run,
then check each failure names the assertion its finding predicted: a mutation reds collateral
tests too, and a collateral red is not the finding. See
[[vacuous-guard-shapes-found-by-audit]], [[decoy-must-sit-between-winner-and-boundary]].
