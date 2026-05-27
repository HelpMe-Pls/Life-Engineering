- Yesterday the team aligned on the sprint goals for this week, and I sent them the rollout overview doc with Melbourne as an example.
- Today I'm gonna set up the marketing-related configs in prod based on the items on their Monday board.


> [!warning] Chewsday ping
>Just flagging again: there's a contract violation around SHUI owed since I came on full-time.
>Don't get me wrong, I'm incredibly grateful for this job, but baseline expectations need to be honored.
>I'm not gonna let this slide until we get it resolved, or at least have a date to work toward :-)
---
# EP
## Next
### 128
#### Prompt
Resolve GitHub issue #128 on this repo. Review the proposed @docs\plans\2026-05-26-issue-128-curriculum-foundation.md file to decide if you should follow it. If not, proceed with the instructions below:

Wave 1 — Foundation, second-to-last to land. Runs CONCURRENTLY with #133 on its own ephemeral branch off `resolve-issues`. **Your branch: `refactor/128-curriculum-foundation`. Your worktree: `../platform-128`.** The user has already created both — do NOT recreate them. All commits land on `refactor/128-curriculum-foundation`; do NOT push to `resolve-issues` directly and do NOT open the `staging` PR yourself.

Before any code changes, read these in order:
  1. `.claude/CLAUDE.md` — invariants. Especially: Rule 5 (no relative imports across modules — `~/` alias only), Rule 11 (no `any`/`!`/`as Type` — use Zod parsing / type narrowing / `satisfies`), Rule 13 (`Cloudflare.Env` only — added 2026-05-25 via #137; any new `env:` annotation MUST be `Cloudflare.Env`), the action-envelope helper module at `app/lib/route-helpers.server.ts` (`actionSuccess` / `actionError` / `parseIntent` / `parseJsonBody` / `parseCloudflareResponse`), and the "Before Declaring Done" checklist (run `bun typecheck` THEN `bun run test:run` *sequentially* — never parallel; load-bearing Windows rule).
  2. `CONTEXT.md` — domain glossary. Use `Course`/`Module`/`Lesson`/`Curriculum`/`Enrollment`/`Progress` exactly; never drift to synonyms.
  3. `docs/adr/0001-curriculum-is-data-not-process.md` — locks the "Curriculum is data + invariants, not a process" guarantee. **Do NOT re-author.** If missing from your worktree, halt — branch base is wrong.
  4. `gh issue view 128 --comments` — full issue body including the LOCKED Curriculum surface. **Live GitHub body is canonical**; if anything below diverges from `gh issue view`, the GitHub body wins.
  5. `docs/plans/issues-126-135-handoff.md` — §4 file-overlap matrix, §6 wave ordering, §10.2 live progress. **Wave 1 status as of 2026-05-25:** #126, #132, #137 already merged into `resolve-issues`; #133 dispatching concurrently with you.

Scope reminders (issue body is authoritative; this is emphasis on the easy-to-miss bits):
  - Create the Curriculum module per the locked surface. Branded ID types — `CourseId`, `ModuleId`, `LessonId`, `InstructorId`, `CourseSlug` — with constructors at parse boundaries. NO `as` casts (Rule 11).
  - `PublishedCurriculum` and `FullCurriculum` are DISTINCT types. Passing one where the other is required must be a typecheck error.
  - This slice migrates ONLY the two Student-facing routes: `app/routes/course-overview.tsx` and `app/routes/lesson-detail.tsx`.
  - In `lesson-detail.tsx`: replace `assertLessonMatchesRoute` pattern + the inline `getNextLessonSlug` call. **DO NOT touch the Stream-signing code** (`getStreamSigningKey`, `streamSignedUrl`, `signingKey` threading) — that's #134's territory.
  - **DO NOT delete `app/lib/course-navigation.ts`** in this slice — `enrollments.server.ts` still imports from it; #130 deletes the file after migrating the third importer.
  - Guards (`require*`) throw `Response`; walkers return `| null`.
  - Deletion test MUST pass: removing the new Curriculum module file alone re-emerges the inline patterns across the two migrated routes (proves the module IS the encapsulation, not decoration).
  - Writes stay in the existing query files; do NOT add write functions to the Curriculum surface.

After implementation, run the "Before Declaring Done" checklist sequentially (typecheck → tests, never parallel). Surface completion: report your branch name (`refactor/128-curriculum-foundation`) and the commit range to the user. The user merges your branch into `resolve-issues` with `git merge --no-ff`, deletes the branch + removes the worktree (rename-then-delete workaround on Windows if miniflare locks the `.wrangler/` dir — see handoff §10.2), and batches the wave-carrying `resolve-issues → staging` PR. When that PR merges, `gh issue close 128` (staging-targeted PRs do NOT auto-close — see `project_pr_into_staging_no_autoclose` in project memory).

If you discover a spec gap mid-implementation, do NOT silently deviate. Stop, surface it as a comment on the issue, and wait for guidance. (Precedent: #137 hit a spec gap on `workers/app.ts` — see the GitHub body's 2026-05-25 post-implementation correction at the top.)

Commit format (CLAUDE.md "Commit Messages"): `<type>(<scope>): :gitmoji-text-code: #128 <description>`. Use gitmoji TEXT codes (`:sparkles:`, `:recycle:`, `:memo:`, etc. — see gitmoji.dev), NEVER unicode glyphs. Pick the emoji by intent, not type (e.g., `refactor(curriculum): :sparkles: #128 add Curriculum module` if the slice introduces new functionality, `refactor(curriculum): :recycle: #128 collapse Student-facing curriculum walkers` if it's pure restructure).
#### Clean up
- Check off the AC, update the handoff, then:
```
git merge --no-ff refactor/128-curriculum-foundation -m "Merge refactor/128-curriculum-foundation (Wave 1, issue #128)"
git worktree remove ../platform-128 --force
git branch -d refactor/128-curriculum-foundation
```

### 133
#### Create worktree
```
git worktree add ../platform-133 -b refactor/133-asset-foundation resolve-issues
cd ../platform-133 && bun install ; cd -
```
#### Prompt
Resolve GitHub issue #133 in this repo.

Wave 1 — Foundation, second-to-last to land. Runs CONCURRENTLY with #128 on its own ephemeral branch off `resolve-issues`. **Your branch `refactor/133-asset-foundation`. Your worktree: `../platform-133`.** The user has already created both — do NOT recreate them. All commits land on `refactor/133-asset-foundation`; do NOT push to `resolve-issues` directly and do NOT open the `staging` PR yourself.

Before any code changes, read these in order:
  1. `.claude/CLAUDE.md` — invariants. Especially: Rule 5 (no relative imports across modules), Rule 11 (no `any`/`!`/`as Type`), Rule 13 (`Cloudflare.Env` only — added 2026-05-25 via #137; any new `env:` annotation MUST be `Cloudflare.Env`), the action-envelope helper module at `app/lib/route-helpers.server.ts`, and the "Before Declaring Done" checklist (sequential typecheck → tests on Windows, never parallel).
  2. `CONTEXT.md` — domain glossary. Use `Asset`/`AssetKind`/`AssetRef` exactly per the locked vocabulary.
  3. `docs/adr/0002-assets-as-domain-with-kind-catalog.md` — locks the Asset-as-domain shape with the kind catalog. **Do NOT re-author.** If missing, halt — branch base is wrong. Per `feedback_docs_high_level.md`, fabricated ADR rationale is unacceptable.
  4. `gh issue view 133 --comments` — full issue body including the locked ~25-export surface for `app/lib/assets.server.ts` and the 2026-05-22 amendment adding `getStreamPlaybackToken`. **Live GitHub body is canonical.**
  5. `docs/plans/issues-126-135-handoff.md` — §4 file-overlap matrix, §6 wave ordering, §10.2 live progress. **Wave 1 status as of 2026-05-25:** #126, #132, #137 already merged into `resolve-issues`; #128 dispatching concurrently with you.

Scope reminders (issue body is authoritative; this is emphasis):
  - Create `app/lib/assets.server.ts` with the locked surface (~25 exports including the `getStreamPlaybackToken` from the 2026-05-22 amendment).
  - Co-located test file covering: ASSET_KINDS catalog invariants (every kind has storage; mimes nonempty; maxBytes > 0; every r2 kind has a directory; no two kinds share a directory prefix); `classifyR2Key` 4 happy paths + 1 unknown-prefix → `null`; `storeFile` validation branches (invalid-kind, invalid-mime, too-large, empty-file); `cleanupAssets` mixed pass/fail; `getStreamPlaybackToken` 3-segment JWT structure + base64url segments + expiry math + geo-claim default `["VN"]` + override + `null` on empty inputs.
  - Migrate THREE API routes: `app/routes/api/r2-upload.ts`, `app/routes/api/stream-upload.ts`, `app/routes/api/stream-status.ts`. DELETE inline `ALLOWED_*_TYPES` constants, the 10MB/50MB byte caps, the TUS header construction, and the Cloudflare API URLs from those three route files.
  - **DO NOT TOUCH** in this slice (deferred to #134): `app/routes/dashboard/edit-lesson.tsx`, `app/routes/dashboard/curriculum-builder.tsx`,
  `app/routes/dashboard/course-settings.tsx`, `app/routes/api/r2-serve.$.ts`, `app/routes/lesson-detail.tsx`, `app/lib/asset-urls.server.ts`,
  `app/components/layouts/LessonItem.tsx`. Also do NOT touch `streamSignedUrl` (or `bytesToBase64Url` / `objectToBase64url`) in `app/lib/utils.ts` — your `getStreamPlaybackToken` coexists with the legacy `streamSignedUrl` for this slice; #134 deletes the legacy.
  - `app/lib/content-items.ts` MAY keep an `AssetRef` re-export shim if it makes type imports easier across consumers; #134 removes the shim.
  - The three API routes you touch should access secrets through `context.cloudflare.env` (already typed as `Cloudflare.Env` post-#137 — no manual annotation needed).

After implementation, run the "Before Declaring Done" checklist sequentially (typecheck → tests). Spot-check using the grep commands in the issue body. Surface completion: report your branch name (`refactor/133-asset-foundation`) and the commit range to the user. The user merges into `resolve-issues` with `git merge --no-ff`, deletes the branch + removes the worktree (rename-then-delete workaround on Windows if miniflare locks `.wrangler/` — see handoff §10.2), and batches the wave-carrying staging PR. When that PR merges, `gh issue close 133` (staging-targeted PRs do NOT auto-close — see `project_pr_into_staging_no_autoclose` in project memory).

If you discover a spec gap mid-implementation, do NOT silently deviate. Stop, surface as a comment on the issue, and wait for guidance (Precedent: #137 hit a spec gap on `workers/app.ts` — see the GitHub body's 2026-05-25 post-implementation correction at the top.)

Commit format (CLAUDE.md "Commit Messages"): `<type>(<scope>): :gitmoji-text-code: #133 <description>`. Use gitmoji TEXT codes only (`:sparkles:`, `:recycle:`, etc. — see gitmoji.dev), never unicode glyphs. Pick the emoji by intent, not type.
## Later
- Explore the relevant skills in your repertoire to give me an OPTIMIZED prompt for an agent to grade the overall quality of the codebase. Give me an HONEST assessment. The main criteria it should grade against are enterprise readiness and antifragility.
- Using GPT5.5-xhigh: Perform an exhaustive scan on the codebase and run the /improve-codebase-architecture with its relevant skills to see how you can optimize the codebase for maximum antifragility.
---
# Next big thing

- [ ] Pivot `coffee-finder`
- [ ] Brainstorm with AI for a true `antifragile` & `Fat Tony` business model. Don't fall into the `green lumber fallacy`. Aim for something with limited losses and unlimited potential.
	- Make sure that you're barbelled, whatever that means in your business.
	- Identify & leverage positive Black Swans in this economy.
	- Exploit the convexity effect
---
# 1-1

> [!important] For pay raise
>
> - The things you think you have done well over the last 6 months.
> - The results of your work. What value did it bring to the business.
> - What would you do differently if we could go back and do it again.

## For The Old Infant
>[!danger] Refine with AI before sending
### After the paycheck
 - I just reviewed my paycheck, and the agreed-upon extra pay is missing. You may have forgotten this, but I have not. We had a clear agreement regarding this compensation.
 - I know 10m might sound like a rounding error to you, but for me, I earned some of that money stepping up for K2. I get that the full bonus is already off the table, fair enough. 
 - And I fully understand why you had to pull me from IL, but silently docking my pay for the overtime that I already put in does not sit right with me. I thought the warning letter was supposed to be "the end of it". 
 - At this point, this is just straight up condescending.
 - Pls tell me this just slipped your mind, maybe due to lack of sleep, because I'd hate to think I'm being punished financially for an oversight I *already* owned up to. 
 - I still remember one of the slides you showed me on my onboarding day, mentioning "assume good intentions" somewhere along the lines. That being said, now I'm really struggling to assume positive intent and give you the benefit of the doubt here.
 - If you're still holding out on me for some reason, now's the time to clear the air. How do you plan to make this right so we can keep our relationship strictly professional?
### Escalate
>[!warning] Confirm with Minh Vu to see if his SHUI is covered

 - I expect you to be straight with me moving forward, and not play games with my compensation.
 - I can tolerate mistakes, but between this unannounced pay cut and the company actively breaching my contract by withholding my SHUI contributions for 7 months (that is seven consecutive pay cycles, 7 chances to make it right, just to be clear), this situation has become utterly unacceptable and completely unprofessional. 
 - I'm calling this out because it's obvious that this SHUI debt doesn't just affect me. Even the highest performers on our team (and former team members) are in the same boat. Given that there is clearly still budget to hire new people, leaving this debt unpaid is incredibly hard to justify.
 - Maybe you aren't aware of this, but you've been given far more grace for your own oversights than I ever received for being "inattentive," yet I am the one being penalized. The double standard here is glaring, and I need to know your recourse immediately.
 - **NUKE:** This reminds me of that whole cat food/beef jerky situation that James joked about. Feels like a scam. 
	 - You always claimed you weren't cheap. Turns out you just love to prove me wrong.
---
# EO

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

# Misc
## PAKN
- PAKN.20260516.0256
- PAKN.20260520.0239
- PAKN.20260522.0138
- Quá hạn hoàn thuế TNCN
	- Tôi có nộp Hồ Sơ QTT TNCN từ ngày 21/04/2026 đến nay (đã hơn 14 ngày làm việc so với 6 ngày làm việc như đã cam kết), nhưng tôi vẫn chưa nhận được Quyết Định Hoàn Thuế hay bất cứ thông báo nào liên quan đến tiến độ giải quyết hồ sơ.
- Kính mong các bộ phận liên quan hỗ trợ xử lý Mã Hồ Sơ Dịch Vụ Công: G12.18-260421-00430053
- 18/5: 16 days
## Tracy
- DB pw: `Tracy@InfiniteLeverage2026`
## QLD
- sth
