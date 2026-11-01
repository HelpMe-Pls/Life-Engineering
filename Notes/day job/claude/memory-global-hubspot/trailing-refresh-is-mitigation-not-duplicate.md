---
name: trailing-refresh-is-mitigation-not-duplicate
description: A trailing router.refresh() next to a server action that ALREADY revalidatePath()s is NOT redundant — it is the mitigation for the ~12% of post-revalidatePath navigations Next drops. Removing it only converts a WEDGE (pending never clears) into STALENESS; measured 4 ways on feedback-close-loop and all four still wait on the dropped navigation
metadata: 
  node_type: memory
  type: project
  originSessionId: c2511ad7-47a0-4233-bc68-92832318278a
  modified: 2026-09-28T09:27:13.759Z
---

Measured 2026-09-22 on `e2e/tests/feedback-close-loop.spec.ts`, `--repeat-each 8` each time. The queue said the trailing `router.refresh()` in the nine Feedback call sites was "a second, droppable transition" because the action already calls `revalidatePath` on the current page. **It is not a duplicate of that payload — it is the backup for it.**

| variant | failed / 8 | how |
|---|---|---|
| baseline — `router.refresh()` inside the runner's transition | 2 | **wedge**: `<button disabled>Save email</button>`, `element is not enabled` |
| drop it at all nine call sites | 0 | — but the same run took `feedback-survey-builder:18` from 3 failures to **5** |
| drop it at ThemeLoopPanel only | 1 | **staleness**: `1 told so far, 0 still to tell` never appears |
| keep it, fire it from a passive effect OUTSIDE the transition | 2 | **staleness**, same assertion |

**The mechanism.** `lib/use-action-runner.ts` deliberately lets `pending` span the trailing refresh, so a dropped refresh strands `disabled={pending}` forever — that is the wedge. But these panels render **server-derived facts** (told / still-to-tell counts; SurveyBuilder's Questions list), so they genuinely need a re-render. Remove the refresh and you trade the wedge for stale numbers; move it out of the transition and you cure the wedge and keep the staleness exactly where it was. Every variant still waits on a navigation Next drops ~1 in 8 (#563, `lib/use-row-overrides.ts`, unchanged through Next 16.2.12).

**The `EventsChapterView` shape is necessary, and NOT enough** (corrected 2026-09-28): the panel holds its live facts in state, seeded once by the server render, and every control reports its OWN result into that state. ⚠ It needs the actions to **return what they changed** (`LoopResult` is `{ ok: true, note? }` and carries no counts), so it is an action-contract change, not a component tidy-up. ⚠ **And it still WEDGED, on PRODUCTION**: Un-park on `/admin/events/[id]` during the 2026-09-28 dry run left every stage button disabled until a reload, while "Un-parked." had rendered. That page calls no `router.refresh()`, but its actions call `revalidatePath`, and ANY revalidation in an action makes Next's `server-action-reducer.js` resolve the result FIRST, then re-navigate the current URL (`RefreshAll`) inside the runner's transition. So `disabled={pending}` must stop waiting on that navigation too. Filed as #1016 (ready-for-agent, brief attached); the fork is closed.

⚠ **Both Feedback specs were ALREADY flaky on an untouched tree** — `feedback-close-loop` 2/8, `feedback-survey-builder:18` 3/8 — and no queue item said so. Check a red against those rates before believing it is yours.

⚠ **n=8 cannot separate 2/8 from 0/8.** The "all nine call sites" row above reads as a fix and is not one; only reading the FAILURE MODE (disabled control vs missing text) told the two apart. See [[red-recipe-is-a-hypothesis]] and [[report-that-names-its-own-fix-must-be-measured]].

Related: [[rsc-navigation-drops-so-server-prop-only-cells-go-stale]], [[async-transition-state-defers-until-settle]].
