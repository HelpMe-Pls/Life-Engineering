---
name: e2e-restore-cannot-undo-a-killed-run
description: "An E2E test that restores 'whatever the row held when I started' cannot undo a KILLED run — once one interrupted run left the test's own value in a shared singleton, every later run reads it as the original, finds its form clean, and fails 8/8 on a DISABLED BUTTON while blaming the click; it also sent a whole session's diagnosis down the wrong path. Make the fixture dirty BY CONSTRUCTION, and keep every test that drives one form in ONE serial file because fullyParallel is on"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 94e54885-e65f-4adc-98e7-f56d3bda37c6
  modified: 2026-08-17T12:04:13.483Z
---

**The trap.** `e2e/tests/review-call-card.spec.ts` captures
`app_settings.meeting_url`, writes its own `MEETING_URL`, and defers a restore of
what it captured. That is correct for a run that finishes. **A run that is killed
(Ctrl-C, a hung wait, a kill during a `--repeat-each` measurement) never reaches the
teardown**, so the column keeps the test's value — and from then on the restore is
**self-perpetuating**: every later run reads `MEETING_URL` as "the original",
`fill(MEETING_URL)` changes nothing, the repo's SETTINGS-DIRTY rule keeps
`Save settings` disabled, and Playwright fails on `locator.click` with
`element is not enabled`. **Measured 8 of 8, single-worker.** Reset the row and the
same spec passes 8/8.

**⚠ WHY IT MATTERS BEYOND THE FIX: it lies about which line is broken.** The error
points at the click and at the assertion after it, not at the state. That is how
`⚡ 38` came to be filed as a `useActionState`/`revalidatePath` bug worth "5 in 8"
when it was really **two** bugs — see
[[rsc-navigation-drops-so-server-prop-only-cells-go-stale]] for the real (and
load-dependent) half. **Before diagnosing an E2E failure that involves shared state,
READ THE ROW.** `docker ps` healthy is not the same as data clean, and
`npx supabase db reset` is the cheap first move.

**The two fixes, both forward-acting:**

1. **Dirty by construction.** Write a *known-different* value with the service role
   before the page loads (`meeting_url: null`), so the first save is dirty whatever
   the last run left behind. For a numeric field, pick between two fixed constants
   (`original === 21 ? 42 : 21`) rather than `original + n`, which can land on the
   value already there.
2. **One serial file per shared singleton.** `playwright.config.ts` sets
   `fullyParallel: true`, so *every test* is its own unit — two tests in different
   files that drive the same form overwrite each other's columns (the form submits
   ALL its fields). 2 of 4 failures at four workers were exactly that.
   `test.describe.configure({ mode: 'serial' })` **at file scope does group
   sibling describes** (verified via the json reporter: same `workerIndex`,
   non-overlapping start times), and its skip-on-failure only bites in a run that
   is already red.

Related: [[e2e-shared-admin-password-reset-breaks-sessions]] (the other shared-state
trap in this suite), [[verify-running-branch-before-diagnosing]],
[[test-suite-clean-minimal-standard]].
