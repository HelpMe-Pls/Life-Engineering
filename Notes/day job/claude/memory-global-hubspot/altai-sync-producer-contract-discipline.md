---
name: altai-sync-producer-contract-discipline
description: "STANDING — /admin/altai-sync must always be in sync with the altai-hubspot-sync repo; read the producer, never infer the shape. Agent may open AND merge PRs there."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 19790602-4670-4bad-b28c-2a884223ae55
  modified: 2026-07-28T09:33:15.859Z
---

`/admin/altai-sync` renders `sync_health.summary`, written by a **separate repo**:
`~/Documents/Repos/Edge8/altai-hubspot-sync` (sibling of this repo). The operator
called keeping the two in step **CRITICAL**, twice, and granted **standing
permission to open AND merge PRs in that repo** — use it rather than guessing.

Authority files there: `src/telemetry/health-summary.ts` (the contract),
`src/sync/conflict-report.ts`, `src/telemetry/errors.ts` + `data-quality.ts`,
`src/sync/mappings.ts` + `src/altai/parse.ts` + `source.ts` + `queries.ts` (the
real Altai↔HubSpot field mapping), `src/sync/chapters.ts`.

**Why:** every drift degrades to a dash or a missing section, never an error, so
nothing announces it. It has now happened **four** times — guessed field names that
never matched; a `conflicts.sample` the producer never sent (so "Merge in HubSpot"
could only show a count); `segments[].name` being a machine KEY (`all-members`,
`apac-chapter-officers`) printed verbatim to a non-technical audience; and the
evergreen explanation inventing relationships outright (see the round-14 block
below, which is different in kind — nothing degrades, so nothing hints).

**How to apply:**
- Read the producer before changing that page. Do not infer a shape from the
  sibling field or from what looks plausible.
- `segments[].name` and `conflicts.sample[].segments[]` are `SEGMENT_KEYS` keys →
  always through `segmentLabel()` in `lib/admin/altai-sync-view.ts`.
- `errors.sample[]` is `RecordedError`; its `context` is deliberately never read
  (redacted upstream, but still the one field that could put member data
  on-screen).
- `parseHealthSummary` reports unknown / missing keys to Sentry — a backstop for
  the cross-reference comments being ignored, not a substitute.
- **Watch the fixtures.** The machine-key bug survived because the test fixtures
  seeded pretty names — they performed the renaming the code was supposed to, so
  every assertion passed against a wrong page. Seed what the producer sends.

**⚠ CORRECTED 2026-07-27 — the previous version of this memory said the opposite
and would send you to re-do a reverted change.** Stripping member emails from the
payload was tried (producer #17 + consumer #347) and **REVERSED six hours later by
producer #18, on the operator's decision.** The `sync_health` row **deliberately
carries member email addresses on BOTH worklists**: on a fix-list row the malformed
address IS the fault being reported, and on a merge row it is the collision key —
removing them turned instructions into lookup tasks. Masking is **not planned**;
the operator called the question **settled, not deferred**. So:

- **Do NOT strip or mask those emails**, and do not re-propose it.
- What it buys is a policy obligation: **`sync_health`'s RLS is load-bearing —
  never widen it.** The `0031` incident (two rows `anon`-readable for ≈33h) is what
  happens when it slips.
- Both shapes are in the table (pre-#17 rows have no email), so the consumer reads
  it when present and renders `—` when absent, and the drift detector deliberately
  TOLERATES its absence — flagging it would fire on a known-good row.

**(2026-07-27, round 14) THE EVERGREEN HALF OF THE PAGE DRIFTS TOO, and it is
worse.** Rounds 3–13 only ever checked the run DATA. The "How this works" section —
prose plus an object map, which no run touches — was asserting relationships the
producer does not have: Altai Regions "matched by name" to HubSpot Regions (never
compared; the Altai region the run reads is written NOWHERE), and three of five
segments fed by objects their HubSpot filter never mentions. **Static content has
no dash to degrade to and no failing test, so it rots silently and for longer than
data ever does.** Two more authority files, therefore:
`src/validate/hubspot-counts.ts` (what each of the five segments actually
selects — three count POSITIONS, two count CONTACTS) and `src/sync/regions.ts`
(HubSpot-only; it takes `_altai` and ignores it).

**A trap when re-verifying "chapters are not copied":** the producer has a
`buildChapterProps` in `src/sync/mappings.ts` that assembles
`chapter_name`/`crm_id`/`region` and reads exactly like a chapter writer. It is
**dead** — only its own unit test calls it. Check call sites, not the function.

**And state a cross-repo fact ONCE.** That page had "which segments does this
object feed" written twice (a ledger line and the map's edges); both were wrong the
same way, so they agreed instead of contradicting, and nothing surfaced it.
Duplication only self-checks if something actually compares the copies — derive one
from the other.

**(2026-07-28, round 22) THE PAYLOAD NOW CARRIES THE GATE'S OWN WORKING, and the
consumer CHECKS it** (producer #21 + consumer #400). `HealthSegment` gained
`target` (Altai minus what the run measured it could not copy) and `allowed` (the
per-segment deviation permitted), so `pass === |hubspotCount − target| <= allowed`
is reproducible from the row. `parseHealthSummary` recomputes exactly that and
reports a mismatch as drift — so "judge against one target, report another" is
caught, which is the one way to make that page lie while every number on it still
looks individually fine. Keep it true.

- **⚠ `allowed` could NOT ship alone**, though docs/plans asked for just it. Without
  its target a reader tests it against the RAW `deviation`, and those disagree in a
  reachable case (offset 30, allowance 21 ⇒ "30 short, ±21 allowed, PASS"). Shipping
  one number would have turned a silent page into a self-contradicting one.
- Both keys are **TOLERATED, not READ**, in the drift detector — pre-#21 rows carry
  neither and the page renders the NEWEST row, so flagging absence would fire on a
  known-good row for a whole nightly cycle. Same call as the #17/#18 email.
- Read them with an **optional** number helper, never the 0-fallback one: "0 could
  not be copied" and "allowed to be out by 0" are claims, not silence.
- **A test pinning `pass` against `altaiCount` is VACUOUS on today's numbers** —
  while the offset (11) stays under the allowance (21) it agrees with the correct
  check by luck. Pin the contradiction case at offset 30.

**⚠ The "never trigger with `dry_run=true`" warning was STALE** — corrected in both
repos' `next-steps.md`. A dry run measures 0 rejects but still measures conflicts
(`resolveContacts` runs ahead of the write guard), so its floor falls back to the
declared 5 against a real 11. That 6-record understatement used to fail the flat ±5;
the per-segment allowance of 21 absorbs it, so **it no longer paints All Members
red** — and it re-arms silently past ~22 fix-list rows. The lever is an accurate
declared floor, not code: nothing can invent a measurement a dry run cannot take.

**Not a to-do: the 25-row `DEFAULT_SAMPLE` cap STAYS.** Reachable now, so it is a
decision: raising it grows a PII payload — the thing that contract asks callers to
keep minimal — to buy nothing against worklists of 5 and 6 rows.

See [[test-suite-clean-minimal-standard]], [[policy-guardrails-this-repo]].
