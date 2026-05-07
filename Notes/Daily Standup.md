My standup report for the day:
- Yesterday I prepared Queensland for their launch and updated the dashboards for EOVN prod.
- Today I'm gonna pick up where I left off and keep going, then close the remaining gaps for tomorrow's sprint review.

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

## For the record
- I don’t think I’ve gotten any extra updates from EO about the tasks.
- But if I had to sum it up, I’ve realized one of the hardest parts of my job is balancing chapter accessibility with CRM best practices to keep the system maintainable and scalable.

> I'm aware that the outcome is what we're aiming for, but a lot of stuff affects outcomes, whereas if we judge your performance purely based on your output, which is something that you have full control of, then I'm pretty sure that you're the one who's setting the standard for everyone here.
> You too. To be fair, if I were the boss, I'd have doubled your salary by now. You deserve so much more than this; considering all the things you've done for the company so far.

---
# EP
- Review the last commit to verify whether it's safe to close #113
## 113
```
Resolve GitHub issue #113 in this repo. Run `gh issue view 113 --repo HelpMe-Pls/elearning-platform` first — the editor decomposition table and the prop-setter callback table are non-negotiable.

**Pre-flight: commits already on `resolve-issues` from prior sessions:**
   - `getFullUrl` is at module scope in `SortableContentItem.tsx` (was inside the component)
   - `type R2UploadContext = "content-image" | "content-audio" | "content-file"` is at module scope in `SortableContentItem.tsx`
   - `getUploadSaveStatus` is at module scope in `SortableContentItem.tsx`
   - Redundant `if (!file) return` guards removed from `handleFileUpload` / `handleVideoUpload`
   - `alert()` calls replaced with `setUploadError()` in video upload handlers
Do not re-introduce any of the above.

 **Branching strategy:**
 Phase 0 (PR #118, closes #112) is already merged into `staging` before this prompt runs. For Phase 1+2: commit your changes to the current branch (`resolve-issue`) and open a new PR to `staging` with those changes.

Test infrastructure setup (one-time, before any editor extraction):
   1. Install devDependencies: `bun add -d @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom`
   2. Update `vitest.config.ts`: set `test.environment = "jsdom"` and `test.setupFiles = ["./vitest.setup.ts"]`. Preserve the existing `test.include` glob.
   3. Create `vitest.setup.ts` at the repo root containing:
      ```ts
      import "@testing-library/jest-dom";
      import { vi } from "vitest";

      Object.defineProperty(URL, "createObjectURL", {
        writable: true,
        value: vi.fn(() => "blob:test"),
      });
      Object.defineProperty(URL, "revokeObjectURL", {
        writable: true,
        value: vi.fn(),
      });
      ```
   4. Verify with `bun run typecheck` then `bun run test:run`. The pre-existing tests (`app/lib/course-navigation.test.ts`,
 `app/lib/lesson-access.test.ts`) must still pass under the new jsdom environment before you proceed.

**Implementation order:**
   1. Move `getFullUrl` and `type R2UploadContext` from `SortableContentItem.tsx` into `app/lib/content-items.ts` (alongside existing `buildContentItemFormData` and `ContentItemType`). Export both. Update the import in `SortableContentItem.tsx`. Do this BEFORE creating any editor components: the editors you'll create in step 3 need to import `getFullUrl` and `R2UploadContext`, and they MUST import them from `~/lib/content-items` (the neutral utility module). Editors must NEVER import from `~/components/dashboard/SortableContentItem` — that's the parent that already imports the editors, so an editor importing back from the parent would create a circular dependency.
      - `getUploadSaveStatus` STAYS in `SortableContentItem.tsx` — it's shell-internal status derivation, not consumed by editors.

   2. Move `SaveStatusIndicator` (currently lines ~1663–1737 of `SortableContentItem.tsx`) verbatim into `app/components/dashboard/content-editors/SaveStatusIndicator.tsx`. Re-export from `content-editors/index.ts`. Update the shell's import to read from `~/components/dashboard/content-editors`. Preserve the `Readonly<{ status, lastSavedAt, errorMessage, onRetry }>` props and the 3-second `Saved` auto-dismiss exactly.

   3. Extract six per-type editors into `app/components/dashboard/content-editors/`: `TextContentEditor.tsx`, `VideoContentEditor.tsx`, `ImageContentEditor.tsx`, `FileContentEditor.tsx`, `AudioContentEditor.tsx`, `QuizContentEditor.tsx`. Re-export each from `content-editors/index.ts`. The shell stays the orchestration owner — fetchers, TUS upload (preserve the dynamic `await import("tus-js-client")` pattern; do not promote to a top-level import), stream polling, asset cleanup, and all draft/saved state remain in `SortableContentItem.tsx`. Editors are presentational only. Shell cleanup that MUST happen as part of this step:
      - Remove `localImagePreviewUrl` state and its `useEffect` cleanup from the shell; they move into `ImageContentEditor`.
      - Remove all four file-input `useRef`s (`videoInputRef`, `imageInputRef`, `audioInputRef`, `fileInputRef`) from the shell; they move into the respective editor components.
	
	`ImageContentEditor` preview-handoff rule: the editor renders the image from one of two sources during a single user flow:
    - **Before R2 upload completes**: when the user picks a file, the editor calls `URL.createObjectURL(file)` to get a temporary `blob:...`
 URL, stores it in `localImagePreviewUrl` state, and renders `<img src={localImagePreviewUrl}>`. The user sees their image immediately without
 waiting for the upload.
    - **After R2 upload completes**: the shell uploads the file in the background and, on success, sets `draftItem.fileR2Key` to a non-null R2 key. The editor then renders from `getFullUrl(draftItem.fileR2Key)` — the permanent server URL.
	The editor MUST detect the moment of handoff. Use a `useEffect` watching `draftItem.fileR2Key`: when it transitions from `null` to non-null, call `URL.revokeObjectURL(localImagePreviewUrl)` to release the browser's hold on the blob URL, then `setLocalImagePreviewUrl(null)` so the local URL is no longer rendered. If you skip the handoff, the local blob URL and the R2 URL are alive at the same time — the user sees a flicker of two images stacked or rapidly swapping during the transition. Smoke-test step "Image upload local preview → R2 swap" exists specifically to catch this regression.

   3. Replace the exhaustive `switch (draftItem.type)` in the shell with a typed dispatch: one component per case. For the `default` branch, exhaust the type while preserving the existing runtime UX:
    ```ts
      default: {
        const _exhaustive: never = draftItem.type;
        return <div>Unsupported content type: {String(_exhaustive)}</div>;
      }
    ```
    TypeScript narrows `draftItem.type` to `never` after all 6 cases, making the assignment a compile-time exhaustiveness check on top of the runtime fallback.

**Hard rules:**
   - Each editor receives:
     - `draftItem: ContentItem`
     - Disabled flags: `isUploading: boolean`, `isSubmitting: boolean`, `isUploadSaving: boolean` (drive `disabled` on inputs and buttons)
     - ONLY the explicit field-setter callbacks listed in the issue's prop-setter table — NO `Partial<ContentItem>` patches; identity/server fields (`id`, `lessonId`, `priority`, `status`, `createdAt`, `updatedAt`) are not reachable through editor props
   - `ImageContentEditor` owns its `localImagePreviewUrl` state, its `URL.createObjectURL` allocation, and its `URL.revokeObjectURL` cleanup (on unmount AND on R2-swap detection per the rule above); the shell does not see this state
   - File-backed editors import `getFullUrl` from `~/lib/content-items`; never from `~/components/dashboard/SortableContentItem`
   - Editors do NOT call `performUploadSave`, do NOT touch `pendingAssetCleanupRef`, do NOT call `cleanupOrphanedAsset`, do NOT own any fetcher
   - `VideoContentEditor` does NOT import `tus-js-client` in this phase — TUS stays in the shell with its existing dynamic-import pattern
   - Function declarations only, no `React.FC`; prop typing via inline `interface`/`type`
   - Reuse existing primitives from `content-editors/` — `ContentFieldsHeader`, `ContentTypeSelect`, `UploadProgressBar`, and the newly-extracted `SaveStatusIndicator`. Do not duplicate.

 **Render tests required (sibling-co-located, NOT inside a `__tests__/` folder):** 
   - Place each test next to the editor it covers. Vitest's `test.include = ["app/**/*.test.{ts,tsx}"]` already picks them up.
   - `app/components/dashboard/content-editors/ImageContentEditor.test.tsx`: render the editor with a `draftItem` of type `image`. Locate the hidden file input (e.g. `container.querySelector('input[type="file"]')`) and fire a `change` event with a synthetic `File` (or use `@testing-library/user-event`'s `userEvent.upload`). Assert `URL.createObjectURL` was called with that file. Then unmount and assert `URL.revokeObjectURL` was called exactly once with the returned blob URL (`"blob:test"` from the setup mock).
   - `app/components/dashboard/content-editors/FileContentEditor.test.tsx`: simulate a file-input `change` event with a synthetic `File`. Assert `onFileSelected` was called with `(file, "content-file")` exactly — the context arg must be `"content-file"`, not `"content-image"` or `"content-audio"`.
   - `app/components/dashboard/content-editors/AudioContentEditor.test.tsx`: render with a `draftItem` whose `fileR2Key` is a non-null string (e.g. `"audio/test.mp3"`). Assert `<AudioPlayer>` is in the document with `src="/api/r2-serve/audio/test.mp3"` (the value `getFullUrl` produces).

**Verification gates:**
   - `bun run typecheck` passes
   - `bun run test:run` passes (the three new render tests are in the green set)
   - `rg "(function|const)\s+SaveStatusIndicator" app/components/dashboard/SortableContentItem.tsx` returns zero

**When gates pass:**
   1. Invoke `/simplify` against the local diff — this phase is the highest-payoff slimming opportunity, and `/simplify` will catch any "moved code, didn't slim it" regressions.
   2. Push `resolve-issues-phase-1-2` and open a PR against `staging`. PR body must include `Closes #113` and the manual-smoke checklist copied verbatim from issue #113 (do NOT start `bun dev`).
   3. Invoke `/review` on the open PR.

You are done when the PR URL is reported and both `/simplify` + `/review` have run.
```
## 114
```
Resolve GitHub issue #114 in HelpMe-Pls/elearning-platform. Run `gh issue view 114` first — the `AssetRef` tagged union, the cleanup-failure semantics, and the unchanged `actionSuccess` payload are non-negotiable.

Approach: TDD-first. Tests before implementation.

Implementation order:
  1. Write `app/lib/content-items.test.ts` covering the seven cases in the issue's "Unit tests" section: draft-only R2 cleanup, draft-only Stream cleanup, draft matches saved (no cleanup), saved asset orphaned by type change, saved asset orphaned by replacement, title/description-only edit (no cleanup), AND the `[]` empty-result case for each helper
  2. Implement `getDraftOnlyAssetsForCleanup(draft, lastSaved)` and `getSavedAssetsOrphanedByUpdate(before, after)` in `app/lib/content-items.ts` as named exports — return type is `AssetRef[]`, returning `[]` when nothing needs cleanup
  3. Extend `handleUpdateContentItem` in `app/routes/dashboard/edit-lesson.tsx`: fetch the existing content item BEFORE the DB update, run the DB update, then iterate the result of `getSavedAssetsOrphanedByUpdate(before, after)` calling `deleteFileFromR2` / `deleteStreamVideo` per `ref.kind`
  4. Remove `pendingAssetCleanupRef` and the saved-asset type-change cleanup queue from `SortableContentItem.tsx`. Keep client cleanup ONLY for unsaved draft uploads on cancel/discard, driven by `getDraftOnlyAssetsForCleanup(...)`

Hard rules:
  - Locked tagged union: `type AssetRef = { kind: "r2"; r2Key: string } | { kind: "stream"; streamId: string }` — no optional fields, no
  objects-with-maybe-keys, no other variants
  - Callers iterate via `for (const ref of refs)` + `switch (ref.kind)` — no optional-chaining gymnastics
  - Server cleanup runs ONLY after the DB update succeeds — if the DB update fails, no R2/Stream delete fires
  - Cleanup-failure semantics: `console.warn` only (Worker tail logs). Do NOT add `cleanupWarnings` to the action payload, do NOT fail the action, do NOT retry
  - `actionSuccess("updateContentItem", { contentItem })` contract stays IDENTICAL — no new intent, no new payload fields

Verification gates:
  - `bun run test:run app/lib/content-items.test.ts` passes
  - `bun run typecheck` passes
  - `bun run test:run` passes
  - `rg "pendingAssetCleanupRef" app/components/dashboard/SortableContentItem.tsx` returns zero
  - `rg "export function getDraftOnlyAssetsForCleanup|export function getSavedAssetsOrphanedByUpdate" app/lib/content-items.ts` returns matches
  - `rg "console\.warn" app/routes/dashboard/edit-lesson.tsx` includes the cleanup-failure call site

When gates pass:
  1. Open PR with `Closes #114` in the body, copy the failure-simulation manual-smoke steps from the issue into the PR body (the user runs them — they need a running dev server with network failure simulation)
  2. **Invoke `/security-review` on the open PR** — Phase 3 is the only phase that changes server-side data-deletion behavior. Specifically verify: a forged `contentItemId` in the form data cannot delete another user's R2/Stream assets — the instructor-ownership gate in `requireInstructor` must run BEFORE the orphan-delete loop
  3. Invoke `/review` on the open PR

You are done when the PR URL is reported and both `/security-review` + `/review` have run.
```
## 115
```
Resolve GitHub issue #115 in HelpMe-Pls/elearning-platform. Run `gh issue view 115` first — the `ContentItemEditorLifecycle` and `ContentItemEditorEvent` discriminated unions are non-negotiable.

This is HITL. Do NOT write any implementation code until the Option A/B/C decision is recorded in `docs/plans/BACKLOG.md` (and an ADR if Option B). The decision blocks all subsequent work.

PHASE 1 — DECISION (no code):
  1. Invoke `/grill-with-docs` to stress-test Option A vs B vs C. Frame the grilling around: shell line count after #114 lands, whether the reducer
  + dispatch closures are reused outside this component, the `app/hooks/useAutoSave.ts` precedent, and the AFK-vs-HITL impact of choosing extraction
  1. Append a one-line note to the Phase 4 heading in `docs/plans/BACKLOG.md` recording the choice (A, B, or C) and a one-sentence justification — this MUST land before any code change
  2. If Option B was chosen: commit an ADR at `docs/adr/<YYYYMMDD>-content-item-editor-lifecycle.md` capturing the chosen state union, dispatch events, and selector signature
  3. STOP and confirm with the user before proceeding to PHASE 2

PHASE 2 — IMPLEMENTATION (only after decision is recorded and user has confirmed):
  - Reducer location follows the choice: Option A → `app/components/dashboard/SortableContentItem.tsx` as named exports; Option B → `app/hooks/useContentItemSave.ts`; Option C → `app/lib/content-item-editor-lifecycle.ts`
  - Promote `R2UploadContext` to a named export from `app/lib/content-items.ts`
  - Reducer state is EXACTLY the seven-variant locked discriminated union from the issue body — no extras, no `& { ... }` intersections, no superset, no subset
  - Reducer + selector are exported regardless of the chosen option (testable from outside the component)
  - Switch on `state.kind`; the default branch MUST call `assertNever(state)`. Add `export function assertNever(value: never): never { throw new Error(\`Unhandled variant: ${JSON.stringify(value)}\`); }` to `~/lib/utils.ts` if missing
  - Video-processing UI state stays a separate `useState<"processing" | "ready" | "error" | null>` slot — do NOT fold it into the lifecycle reducer (the issue body explains why; do not relitigate)
  - DOM-handle refs (`videoInputRef`, `imageInputRef`, `audioInputRef`, `fileInputRef`) stay as refs
  - `ContentItemEditorState` (parent-facing snapshot through `onEditorStateChange`) is *derived* from reducer state in exactly one selector — not assembled from sibling `useState` slots, not constructed inline in `useEffect`. Cadence and shape match #114 behavior exactly
  - If Option B: the hook owns lifecycle ONLY. It must NOT interpret action results into business decisions, encode auth gates, or own asset-cleanup policy

Tests required:
  - Transition tests for every dispatched event from every reachable state (issue body lists the matrix)
  - Selector tests for `selectContentItemEditorState(state)` — the four-field `ContentItemEditorState` snapshot for every reducer state

Hard rules: no `any`, no `!`, no `as`, no optional-chaining gymnastics, no `unknown`-cast guards.

Verification gates:
  - `bun run typecheck` passes
  - `bun run test:run` passes (transition + selector tests in green set)
  - `rg "pendingCloseRef|pendingBackgroundSaveRef|pendingUploadSaveRef|previousFetcherStateRef|previousArchiveFetcherStateRef" app/components/dashboard/SortableContentItem.tsx` returns zero
  - `rg -c 'kind: "(idle|drafting|uploading|saving-text|saving-upload|type-changing|save-error)"' <reducer-location>` returns at least 7
  - `rg "assertNever\(state\)" <reducer-location>` returns at least one
  - `rg "export function contentItemEditorReducer|export function selectContentItemEditorState" <reducer-location>` returns matches

When gates pass:
  1. Open PR with `Closes #115` in the body, copy the Phase 2 manual-smoke regression sweep into the PR body (the user runs it)
  2. Invoke `/review` on the open PR

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
### Lifecyle Stages map
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
# Misc
## QLD
- sth
## EOVN Prod
