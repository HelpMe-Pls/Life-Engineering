---
name: rsc-navigation-drops-so-server-prop-only-cells-go-stale
description: "Next's post-revalidatePath navigation intermittently never applies (~12%, UNCHANGED 16.2.6 → 16.2.12), so any cell rendering ONLY a server prop can show stale data forever; the fix belongs on the ROW not the cell, router.refresh() is never the cause, and an upgrade will not save you — ⚠ but EVERY rate here was measured under `next start`, and the same failure is 100% there / 0% on Vercel for /admin/chapters/[id] (#563), so the production rate is UNMEASURED. ALSO holds the corrected `useActionState` finding: a revalidating action defers its own confirmation (load-dependent, 8/8 clean single-worker = CI), and a client-side nav re-renders the PAGE segment but NEVER the shared layout, so dropping the revalidation alone strands a layout tile for the whole session"
metadata: 
  node_type: memory
  type: project
  originSessionId: bbac091b-ad08-472a-880e-af0f04e66d7a
  modified: 2026-09-28T09:27:16.770Z
---

The `park-stalled-chapter.spec.ts` "flake" that four rounds filed as a local
harness artefact. **It was a real app defect.** Round 17 (PR #372) fixed it in the
wrong place; round 21 (#386–#398) measured it again and moved it.

**The mechanism.** A Server Action calling `revalidatePath` makes the client
re-navigate the CURRENT url by itself (`server-action-reducer.js` →
`navigateToKnownRoute`, `FreshnessPolicy.RefreshAll`). That navigation
**intermittently never applies.** The server is innocent — it returns the correct
payload, the client fetches it and never commits it.

⇒ **Any component rendering a server prop straight through, with no local copy,
can display the pre-action value indefinitely.**

**⚠ DO NOT EXPECT A NEXT UPGRADE TO FIX IT.** Measured 11/108 on 16.2.6 and
**13/108 on 16.2.12** — six patch releases, no change. That question is answered;
don't re-run it as an experiment.

**⚠ EVERY RATE ABOVE WAS TAKEN UNDER `next start`, AND THAT MAY BE THE WHOLE
STORY (open, unmeasured — added 2026-08-15).** All of it was Playwright against
`npm run build && npm run start` on :3100. On 2026-08-15 the same family of
failure was found on `/admin/chapters/[id]` at **100%** under `next start` — a
post-action refetch returning 200 that never commits, wedging any control whose
`disabled` binds to the transition — and the operator then drove that route on
**preview and production and both committed cleanly** (global-hubspot #563,
closed as a `next start` artifact, no code fix). So **the ~12% board figure has
never been measured against a deployment** and may be partly or wholly the same
artifact.

⚠ **NOT ZERO ON PRODUCTION (2026-09-28):** the operator's Events dry run on eochapterhubspotrollout.com wedged once in about ten actions (Un-park on `/admin/events/[id]`, every stage button disabled until a reload). One observation: the rate is still unmeasured, but "wholly a `next start` artifact" is refuted. #1016.

⚠ **That is not licence to delete `use-row-overrides`.** The machinery is cheap,
any non-zero production rate still needs it, and one route's result does not
transfer to another. Treat the ~12% as "measured under `next start`", not as a
production number — and if anyone re-opens the figure, measure it on a
deployment first.

**⚠ THE FIX BELONGS ON THE ROW, NOT THE CELL — this is where round 17 went
wrong.** A cell-local copy reached the Health badge but not the `<tr>` tint
(`healthRowClass(r.health)`) or the stage cell (`r.current_stage`), which are raw
props on the *same row*: a parked chapter rendered a grey Pending pill inside a
**red** row. Half-right, not stale. Since `rows` enters the client once (at
`WaveBoard`), the override lives in **`lib/use-row-overrides.ts`**, which returns
rows already patched so cells render `r.*` again and only report what a lever
changed. 108/108 clean after, vs 13/108 with the mechanism off. The action still
does its half: it RETURNS the row as it now reads, derived server-side.

**⚠ The adopt rule is the subtle part, and the obvious version is an ABA trap.**
"Does the server still say what it said when we applied?" resurrects the
override: park (stalled → pending) → server catches up → another admin un-parks
and the server says stalled again, *equal to the pre-lever value*, so the
override re-applies and hides their change indefinitely. Compare each new server
tree against the **previous** one, the way `use-adopt-server-initial.ts` advances
`lastInitial`. A plain sticky `useState` is wrong for the same family of reasons.

**⚠ `useActionState` IS A TRANSITION TOO, so a revalidating action makes a form
unable to report its own success — FIXED 2026-08-17 in #602, and the first filing
of it was wrong twice.** `architecture.md` routes `useTransition` through
`lib/use-action-runner.ts` and never names `useActionState` — but its returned
`state` is a value React defers until the transition settles, and the transition
includes the refetch the action's own `revalidatePath` triggers. `/admin/settings`'
Save button therefore sat on "Saving…" with no "Saved." (failure screenshot
confirms the pending label). **Corrections that only came from measuring again on a
`db reset` database:**

- **It is LOAD-dependent, not a permanent drop.** `review-call-card.spec.ts` passes
  **8/8 at `--workers=1`** — which is what **CI** runs — and failed 4 of 8 at four
  workers. The refetch commits; it is just not something a confirmation may wait
  on. ⚠ The "5 in 8" I filed was **two different bugs added together** (the other
  is [[e2e-restore-cannot-undo-a-killed-run]], worth 8/8 on its own).
- **⚠ REMOVING THE REVALIDATION IS ONLY HALF A FIX, and the other half is a
  framework fact: a client-side `<Link>` navigation re-renders the PAGE segment and
  NOT the shared layout.** Measured with the mechanism switched off: `/admin`'s tile
  read "Stalled (> 14d)" beside a row the *same render* had recounted as **Active**
  — 3 of 3 runs, and for the rest of the session; a hard reload fixes it, a click
  never does. So any fact rendered in a `layout.tsx` goes stale until something
  invalidates it. `router.refresh()` from an effect once the result has committed
  does refresh it (4/4 fresh, exactly ONE RSC re-request counted — `useRouter()` is
  context-stable, so the effect does not loop).

⇒ When a control must confirm something, ask whether its action revalidates; if it
does, the confirmation cannot be a post-`await` state — and if you take the
revalidation out, ask what in the LAYOUT was relying on it. Sibling controls
(`addFileNote`, `markFileProcessed`, `resendChapterSetPasswordLink`) dropped
`revalidatePath` for the same reason. The pairing is now guarded for controls that
do not exist yet: `tests/action-state-confirmation-seam.test.ts` derives every
`useActionState` control from source, resolves the module it dispatches into, and
asserts the whole pair list.

**`router.refresh()` is NOT the cause; adding or removing it changes nothing.**
Identical rates inside the transition, deferred out of it, deleted entirely, and
with same-route `<Link>` prefetches disabled. It is a redundant *second*
navigation to the same url. Don't spend a session there again.

**Three techniques that ended the guessing, reusable:**
- **Read the Playwright trace's own network log** to settle server-vs-client:
  unzip `test-results/**/trace.zip`, walk `0-trace.network` (JSONL,
  `type:'resource-snapshot'`), read each body from
  `resources/<response.content._sha1>`.
- **Never trust one run.** Measure with `--repeat-each=6` and compare RATES. A
  single green run sent this investigation the wrong way once.
- **Make an instrumented measurement non-vacuous, or it proves nothing.** With
  the fix in place the spec passes either way, so the mechanism must be switched
  OFF for the run and restored after. And for N passes, `npm run build` once and
  hold your own server on :3100 (`reuseExistingServer` picks it up) — otherwise
  every playwright invocation rebuilds. ⚠ Playwright's summary line is
  ANSI-coloured *before* its leading spaces, so `grep -E "^\s+[0-9]+ passed"`
  matches nothing; use `grep -oE "[0-9]+ (passed|failed|flaky)"`.

Detail lives in `StageAdvanceResult` + `ParkChapterResult` doc comments
(`website/app/admin/chapters/[id]/actions.ts`), `lib/use-row-overrides.ts`,
`tests/use-row-overrides.test.tsx`,
`tests/health-editor-reports-lever-result.test.tsx`, and
`docs/plans/next-steps.md`'s standing-lessons list. Related:
[[popover-inside-overflow-hidden-card-must-portal]],
[[async-transition-state-defers-until-settle]],
[[test-suite-clean-minimal-standard]],
[[shared-helper-contract-belongs-at-its-own-seam]].
