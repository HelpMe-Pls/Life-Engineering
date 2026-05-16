My standup report for the day:
- Last Friday I cleaned up the sale pipelines in EO global and fixed the corrupted prospect phone numbers for EOVN prod.
- Today I'm gonna keeping cleaning up the redundant props for EO global.


> [!warning] Chewsday ping
>Just flagging again: there's a contract violation around SHUI owed since I came on full-time.
>Don't get me wrong, I'm incredibly grateful for this job, but baseline expectations need to be honored.
>I'm not gonna let this slide until we get it resolved, or at least have a date to work toward :-)
---

# 1-1

> [!important] For pay raise
>
> - The things you think you have done well over the last 6 months.
> - The results of your work. What value did it bring to the business.
> - What would you do differently if we could go back and do it again.

## For The Old Infant
### On the last 2 weeks before the paycheck
- Still can't this outta my head. 
- I want to know exactly what it takes to get back on track, secure the bonus, and prove that I can bring a lot more to the table.
- If you're still upset about me not being attentive, I truly apologize. I really did try to make it right before we left Sol Kitchen. I get the sense we still haven't fully cleared the air. Understandable. 
- But if the Tracy situation was a dealbreaker, I need to know where I stand. I'm perfectly happy to collect my pay for covering K2 and just keep my head down on EO until my time's up. Keep things strictly business. No more, no less. No hard feelings.
### After the paycheck
 - I just reviewed my paycheck, and the agreed-upon bonus is missing. Maybe you forgot this, but I don't. We had a clear agreement regarding this compensation.
 - We need to have a direct conversation this deduction. Punishing me financially without a word, especially after I stepped up to cover K2's absence, is deeply disrespectful.
 - Between this unannounced pay cut and the fact that the company breaching my contract by withholding 7 months of SHUI contributions, this situation has become utterly unacceptable. I expect this to be resolved immediately. 
 - This reminds me of that cat food - beef jerky situation we had. Feels like a scam. 
 - **NUKE:** I didn't think you were that cheap of a person (especially since you said so yourself). Turns out you just love to prove me wrong.

---
# EP
- Review #114 and evaluate the current branch to determine if it's ready to open a PR into staging.
- Update the @BACKLOG file to address the unchecked items in #118, #119, #120,
## 115
### Phase 1
```
Resolve PHASE 1 of GitHub issue #115 in HelpMe-Pls/elearning-platform.

The binding spec is `docs/plans/BACKLOG.md` lines 676-753 (Phase 4 section). The GitHub issue body is empty — `gh issue view 115` returns only a
  triage note. READ BACKLOG FIRST; the locked `ContentItemEditorLifecycle` and `ContentItemEditorEvent` discriminated unions at BACKLOG lines
  700-723 are non-negotiable.

This is HITL. Phase 1 produces a recorded decision only. Do NOT write any implementation code in this prompt — Phase 2 is a separate run.

  STEP 1 — Pre-load measured facts before grilling (no editing):
    - Run `wc -l app/components/dashboard/SortableContentItem.tsx` and record the result. The shell was 1298 lines on 2026-05-15 after #114 merged.
    - Confirm `R2UploadContext` is already a named export at `app/lib/content-items.ts:5` (and is already imported at `SortableContentItem.tsx:36`).
   The BACKLOG language about "promoting" it is stale — that work is done.
    - Confirm `assertNever` is currently absent from `app/lib/utils.ts` (it will be added in Phase 2 if so).
    - Confirm #114 (Phase 3) is merged: `gh issue view 114` should show CLOSED.
    - Grep for any external consumer of `contentItemEditorReducer` / `selectContentItemEditorState` (there should be none yet — Phase 4 introduces
  them). This answers "is the reducer reused outside the component?" — relevant for Option A vs B.

  STEP 2 — Invoke `/grill-with-docs` to stress-test Option A vs B vs C. Frame the grilling around:
    - Measured shell line count vs Option A's BACKLOG precondition of "≤400 lines". Option A requires an explicit waiver if the shell is over the
  ceiling; otherwise the grill should focus on B vs C.
    - Whether the reducer + dispatch closures are reused outside `SortableContentItem.tsx` (use the grep result from Step 1).
    - The `app/hooks/useAutoSave.ts` precedent: it only sets the file *location* convention for hooks (`app/hooks/`, not
  `app/components/dashboard/hooks/`). It is a behavior hook (refs + effects), not a state-machine hook — it sets NO precedent for the
  discriminated-union shape. The shape precedent is being established by Phase 4 itself.
    - AFK-vs-HITL impact of choosing extraction (Option B's ADR cost vs Option C's pure-function ergonomics). Option C is the lowest-friction path
  to exporting a testable reducer without committing to a hook contract.

  STEP 3 — Record the decision in `docs/plans/BACKLOG.md`. Append a one-line note directly under the "#### Phase 4 — Collapse the implicit ref state-machine into one explicit state" heading at line 676, formatted as:
    > **Decision (2026-05-15):** Option <A|B|C> — <one-sentence justification grounded in measured facts from Step 1>.

  STEP 4 — If Option B was chosen, commit an ADR at `docs/adr/20260515-content-item-editor-lifecycle.md`. The `docs/adr/` directory does not yet exist — create it. The ADR must capture:
    - Chosen state union (verbatim from BACKLOG lines 700-707)
    - Dispatch events (verbatim from BACKLOG lines 709-723)
    - Selector signature: `selectContentItemEditorState(state: ContentItemEditorLifecycle): ContentItemEditorState` returning the four fields { isDirty, isSaving, hasError, isUploading }
    - Why Option B over A or C (one paragraph, grounded in Step 1 facts)

  STEP 5 — STOP. Do not start implementation. Report back:
    - The recorded decision (with the BACKLOG line where it was added)
    - The ADR commit SHA if Option B
    - The exact prompt text for Phase 2 (Prompt B), so the user can paste it into a new run

Hard rules for Phase 1: zero source code changes outside `docs/plans/BACKLOG.md` and (if Option B)
  `docs/adr/20260515-content-item-editor-lifecycle.md`. No edits to `app/`, no test scaffolding, no `assertNever` helper yet.
```
### Phase 2
```
Resolve PHASE 2 of GitHub issue #115 in HelpMe-Pls/elearning-platform.

PRECONDITION CHECK — fail fast if any of these is not true:
    1. Read `docs/plans/BACKLOG.md` lines 676-690 and locate the line `**Decision (YYYY-MM-DD):** Option <A|B|C> — ...` directly under the Phase 4 heading. If absent, STOP and tell the user to run Phase 1 first.
    2. If the recorded decision is Option B, verify `docs/adr/20260515-content-item-editor-lifecycle.md` exists. If absent, STOP.
    3. Confirm `R2UploadContext` is already exported at `app/lib/content-items.ts:5`. Do NOT redefine, re-export, or "promote" it.
    4. The locked `ContentItemEditorLifecycle` and `ContentItemEditorEvent` discriminated unions live at BACKLOG lines 700-723. They are non-negotiable: exactly seven state variants, exactly the listed event types, no extras, no `& { ... }` intersections, no superset, no subset.

REDUCER LOCATION — follows the recorded decision:
    - Option A → reducer + selector as named exports inside `app/components/dashboard/SortableContentItem.tsx`
    - Option B → `app/hooks/useContentItemSave.ts` (DO NOT create `app/components/dashboard/hooks/` — that subfolder is forbidden by BACKLOG line 685)
    - Option C → `app/lib/content-item-editor-lifecycle.ts`

REQUIRED CODE:
    - `export function contentItemEditorReducer(state: ContentItemEditorLifecycle, event: ContentItemEditorEvent): ContentItemEditorLifecycle` — exhaustive `switch (state.kind)` with the trailing unreachable arm calling `assertNever(<state-parameter-name>)`. Both reducer AND selector exported regardless of which option was chosen — they must be testable without rendering the component.
    - `export function selectContentItemEditorState(state: ContentItemEditorLifecycle): ContentItemEditorState` — derives the four-field snapshot { isDirty, isSaving, hasError, isUploading } from reducer state in exactly one place. The current implementation at `SortableContentItem.tsx:502-536` (which assembles the snapshot from sibling `useState` slots inside `useEffect`) is the anti-pattern being removed.
    - Add to `~/lib/utils.ts` if missing:
      `export function assertNever(value: never): never { throw new Error(\`Unhandled variant: \${JSON.stringify(value)}\`); }`
    - Import `R2UploadContext` from `~/lib/content-items` (already a named export — do not redefine).

ELIMINATE THESE REFS from `app/components/dashboard/SortableContentItem.tsx` (they encode the implicit state machine being collapsed): `pendingCloseRef`, `pendingBackgroundSaveRef`, `pendingUploadSaveRef`, `previousFetcherStateRef`, `previousArchiveFetcherStateRef`.

KEEP THESE AS REFS (legitimate DOM-handle use per CLAUDE.md): `videoInputRef`, `imageInputRef`, `audioInputRef`, `fileInputRef`.

VIDEO-PROCESSING UI STATE stays a separate `useState<"processing" | "ready" | "error" | null>` slot alongside `pendingStreamId: string | null`. Do NOT fold it into the lifecycle reducer. Cloudflare Stream processing is a server-side observable, orthogonal to local editor lifecycle. The user can keep editing text while a video processes. Do not relitigate this — BACKLOG line 726 explains why.

OPTION B SCOPE GUARD (only if Option B was chosen): the hook owns lifecycle ONLY. It MUST NOT interpret action results into business decisions, encode auth gates, or own asset-cleanup policy. The route/action result still gets interpreted in the shell, then converted into reducer events via dispatch.

UNCHANGED BY THIS WORK:
    `app/hooks/useAutoSave.ts` (text auto-save behavior, orthogonal to lifecycle).

TESTS REQUIRED:
    - Transition tests for every dispatched event from every reachable state. The matrix is listed in BACKLOG line 728.
    - Selector tests for `selectContentItemEditorState(state)` returning the four-field snapshot for every reducer state.
    - Place tests adjacent to the reducer file: `<reducer-location>.test.ts`.

HARD RULES (per CLAUDE.md "Before Declaring Done" + Phase 4 constraints):
    No `any`. No non-null assertions (`!`). No `as`-casts unless truly unavoidable. No `unknown`-cast guards. No optional-chaining gymnastics. Use `~/` path alias — no relative `../../`. Function declarations, not `React.FC`. `// INFO:` / `// NOTE:` only — no other comment prefixes.

VERIFICATION GATES (all must pass before opening PR):
    - `bun typecheck` passes (both tsconfigs)
    - `bun run test:run` passes (transition + selector tests in green set)
    - Negative grep: `rg "pendingCloseRef|pendingBackgroundSaveRef|pendingUploadSaveRef|previousFetcherStateRef|previousArchiveFetcherStateRef" app/components/dashboard/SortableContentItem.tsx` returns ZERO matches
    - Positive grep (locked union present, no dropped/invented variants): `rg "kind:
  \"(idle|drafting|uploading|saving-text|saving-upload|type-changing|save-error)\"" <reducer-location>` matches all seven variant strings at least once each
    - Exhaustiveness wired: `rg "assertNever\(" <reducer-location>` returns at least one match (loosened from `assertNever(state)` — the reducer parameter name is the implementor's choice)
    - Reducer + selector are exported: `rg "export function contentItemEditorReducer|export function selectContentItemEditorState" <reducer-location>` returns matches
    - If Option B: `app/components/dashboard/hooks/` does NOT exist; reducer file is `app/hooks/useContentItemSave.ts`; ADR is committed
    - **MANUAL — `LessonContentManager` navigation-guard regression sweep** (audit BOTH stuck-on AND false-positive per CLAUDE.md "Pending UI" and saved memory `feedback_audit_both_directions.md` — this is the highest-leverage regression to miss because the refactor changes how
  `onEditorStateChange` is computed): test the guard fires correctly under (a) dirty text edit, (b) in-flight text auto-save, (c) in-flight upload save, (d) archived item, and that it does NOT false-fire from sibling forms or link navigation.
    - **MANUAL — Phase 2 behavioural regression sweep**: locate the Phase 2 manual-smoke list in `docs/plans/BACKLOG.md` (search for "Verification:" within the Phase 2 H4 section, roughly lines 597-670) and copy that checklist into the PR body for the user to run.

WHEN GATES PASS:
    1. Open PR with `Closes #115` in the body. Paste the Phase 2 manual-smoke regression sweep + the LessonContentManager nav-guard checklist into the PR body (the user runs them).
    2. **If the PR targets `staging` (not `main`)**, `Closes #115` will NOT auto-close the issue — per saved memory `project_pr_into_staging_no_autoclose.md`. Add a note at the bottom of the PR body: "After merge: `gh issue close 115`."
    3. Invoke `/review` on the open PR.

You are done when the PR URL is reported and `/review` has run.
```
## 116
```
Resolve GitHub issue #116 in HelpMe-Pls/elearning-platform. Run `gh issue view 116` first.

This is HITL and intentionally biases toward NO-OP. Do not extract anything by reflex.

PHASE 1 — ASSESSMENT (no code yet):
  1. Confirm Phase 4 (#115) has merged. If not, stop and tell the user — #116 cannot be assessed until #115 lands.
  2. Read the post-#115 `app/components/dashboard/SortableContentItem.tsx` and `app/components/dashboard/content-editors/VideoContentEditor.tsx`
  3. Assess: is the shell readable? Is video TUS upload + stream polling code dominant in the shell, or has the lifecycle reducer made it explicit and tractable?
  4. Default = no extraction. Extract ONLY if video upload/polling is still the dominant chunk after #115's reducer landed.
  5. STOP and report your assessment to the user before proceeding. Wait for explicit go/no-go.

PATH A — IF NOT EXTRACTING (the default):
  6. Append a one-line note to the Phase 5 heading in `docs/plans/BACKLOG.md`: "Decision: kept video upload orchestration in the shell —
  <one-sentence justification>"
  7. Open PR with the BACKLOG edit only and `Closes #116` in the body
  8. Done. No `/review` needed for a single-line BACKLOG edit.

PATH B — IF EXTRACTING (only if shell is still video-dominated and the user has confirmed):
  9. Invoke `/grill-with-docs` to confirm the event contract: `onUploadStarted`, `onUploadProgress`, `onUploadSucceeded({ videoStreamId })`,
  `onUploadFailed(message)`, `onStreamReady`, `onStreamFailed`
  10. The extracted hook lives at `app/hooks/useVideoStreamUpload.ts` ONLY if it encodes its lifecycle as an explicit discriminated union per
  `.claude/CLAUDE.md` → "Custom hooks". Otherwise keep it in the shell. Do NOT move stateful TUS/polling into `VideoContentEditor.tsx` just to shorten the shell.
  11. Hard rules: the extracted code MUST NOT own `performUploadSave`, fetchers, action-result interpretation, asset cleanup, or navigation-guard state. Events out, decisions in the shell.
  12. Add hook lifecycle tests under a separate discriminated union from the editor reducer
  13. Verification gates: `bun run typecheck` passes; `bun run test:run` passes; the manual video flows from the Phase 5 acceptance criteria are listed in the PR body for the user to verify
  14. Open PR with `Closes #116` in the body, invoke `/review`

You are done when the PR URL (or BACKLOG-only commit URL for Path A) is reported.
```

> [!important] Conventions
> - No-dead-code discipline
> - Minimize defensive/unnecessary logical check or type assertions
> - Optimize for readability, maintainability, and scalability (antifragile)


---
# Next big thing

- [ ] Pivot `coffee-finder`
- [ ] Brainstorm with AI for a true `antifragile` & `Fat Tony` business model. Don't fall into the `green lumber fallacy`. Aim for something with limited losses and unlimited potential.
	- Make sure that you're barbelled, whatever that means in your business.
	- Identify & leverage positive Black Swans in this economy.
	- Exploit the convexity effect

---
# HubSpot

> [!info] Intro
>
> - I’m a software engineer over at Edge8, on Dave's team, and I'm the guy who carries out the HubSpot technical implementation for EO chapters.
> - I figure it's a good idea to join the meeting, see what you guys are talking about so I get what I'm about to do for the next couple of months.

## Key metrics
- Chapters are able to track their two levers of growth, member retention and member acquisition with a goal of 8% NET new growth every year.
- The leading indicators of this is <u>data cleanliness</u> and `number of leads` to `number of opportunities` from a deal funnel perspective → more deals → more potential for more money.
- Check [this](https://chatgpt.com/share/e/698078bc-a34c-8009-bd8d-a53183e6de0f) out.
- As we're part of EO Global, ==we'd know we hit the mark when we roll out chapters and they have a high rate of satisfaction.==
- EO renews in June. High success means they hire more and expand.
- We are on track to do 60 chapters by the end of the year.

## For Global
### Lifecycle Stages map
- `Public` → `Lead`
- `Applicant` → `MQL`
- `Participant` → `Opportunity`
### Main goals
- Intake leads and seamlessly run local and global processes that convert them to members (this implies visibility at each level).
- Help chapter managers effectively run local processes related to their members and non-members.
- Help global professionals effectively run global processes related to their members.
### Short term
1. Spin up a brand license for EO Vietnam.
2. Explore how we would move the Member Acquisition funnel into it.
3. Explore how we would connect the local member acquisition funnel to the global.
4. Application form and approval process will be managed in HubSpot for all chapters, with global approval handled via portal or middleware as needed.
5. Update Deal/Contact owners accordingly for EOVN Prod.
#### Normalization
- Track member events with custom `Event` object and API to sync from external services
- `Forum`, `Member Feedback` custom object
- No need for the custom `Application` object
- Figure out what are they're trying to achieve with the [existing workflows](https://docs.google.com/spreadsheets/d/19I0Vu0pmOjyoCbYoy4KAMTr--K9Bkh_4/edit?usp=sharing&ouid=118330895762225798973&rtpof=true&sd=true):
  - See the workflow descriptions and then maybe fill in the missing ones.
- See how the Lifecycle Stages in EOVN can be mapped to EO Global.
  > The big question is: what's the actual cost if we reset EO Global and start over. Build the new objects (and their props) according to our suggested data model and see if data syncing with Altai works with it.
## For Chapters
- Prefer native HubSpot props if they're asking about data. Tell them to refer to the data dictionary before making changes to the props or pipelines.
- See how they're working with their existing stages and propose something [like this](https://docs.google.com/spreadsheets/d/1_fXks4xySVRB8DKgZbvaZ7zFzTglXM6WlxkF1fGb5sg/edit?usp=sharing)
- Ask about the seats and their permission once they accept their invitations and poked around.
- Check out the template and the checklist.
## Altai sync with HubSpot
- [Overview](https://eonetworkorg.sharepoint.com/:w:/r/sites/Hubspot/Shared%20Documents/General/Sharable%20Resources/Standing%20Hubspot%20Dev%20Call%20Transcripts.docx?d=wd4b3171e5bcf4391bc6ccf265fcee3d9&e=4%3a8c8f2b42468e4b798d1f86dc24241131&sharingv2=true&fromShare=true&at=9)
- Altai is the system of record for all EO Global data — members, chapter staff, companies, SAPs, etc.
- Altai syncs this data into HubSpot (new data model) so the marketing team can run campaigns against the full member base. 
- For the 60 rollout chapters, HubSpot manages the pre-membership funnel and non-membership programs — Lead and Prospect tracking — via the external UI used by chapter staff and officers to move applicants through stages and approve members.
- Once a prospect converts to a member in HubSpot, that record syncs back to Altai as the official member record.

> So the flow is: Altai → HubSpot (existing members) and HubSpot → Altai (new members, post-approval).
### Questions
- Which `Current Status` do we need to set a new converted member from HubSpot prospect to? Currently, it's set to `Approved Applicant` by default and we can't find a way to overwrite that.
	- What's the correct API-driven way to transition a new `altai_mbr_participant` from `Approved Applicant` to `Active`? Is there a custom action, or a specific field (like `altai_pipelinemanager`) to set?
## Events syncing between services
- Request Wix & Hivebrite APIs
- Middleware: mainly for global approval, especially for chapters not using HubSpot directly.
# Infinite Leverage
- Set up Claude Code in way that it's easy for the clients to use our design system (and agents) to customize their web app.
	- Maybe build some kind of a workflow (or CLI prompts) to walk them through a series of questions (with the option of `amend`, `No, tell CLaude what to do instead`) so they can personalize their stuff.
## Agents
- Build "agents" as employees in the team, each with their own expertise. Sth like ClaudeKit ?
- P0 & P1: config the setup for the client
- P2: Setup/help the client use the skills/agents that we created

# Misc
## PAKN
- PAKN.20260516.0256
## Tracy
- DB pw: `Tracy@InfiniteLeverage2026`
## QLD
- sth
