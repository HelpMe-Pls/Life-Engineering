- Last Friday I fixed the association between the Contact and Company objects for Membership Application Form submissions and cleaned up the rest of the residue from the Legacy sync flows.
- Today I'm gonna update the Altai → HubSpot sync with those new marketing props that Suchita sent over. Once it works, I'll migrate the flow to prod.


> [!warning] Chewsday ping
>Just flagging again: there's a contract violation around SHUI owed since I came on full-time.
>Don't get me wrong, I'm incredibly grateful for this job, but baseline expectations need to be honored.
>I'm not gonna let this slide until we get it resolved, or at least have a date to work toward :-)
---
# EP
## Next
Resume Wave 1 issue resolution on this repo. Working tree: `C:\Users\leekh\Documents\Repos\Personal\elearning-platform`.
Current branch: `resolve-issues` (Windows; PowerShell + Bash both available).

**Orient in this order before touching code:**
  1. `git log --oneline -10` — confirm branch state, then `git status --short --branch` to confirm ahead/behind vs `origin/resolve-issues`.
  2. Read `.claude/CLAUDE.md` top-to-bottom — Critical Safety Rules (especially Rule 11 — no `any`/`!`/`as Type`), the **Commit Messages** section (conventional commits with gitmoji TEXT codes like `:sparkles:`, never unicode glyphs; emoji goes AFTER `type(scope):`), and the **Before Declaring Done** checklist (Windows: run `bun typecheck` then `bun run test:run` **sequentially** — never parallel; jsdom pool causes false 5s timeouts).
  3. Read `docs/plans/issues-126-135-handoff.md` — §4 file-overlap matrix + the #137 caveat, §6 Wave 1 table, §7 per-issue paste-ready AFK prompts, §10.1 worktree dispatch recipe, §10.2 live progress.

**Wave 1 status as of 2026-05-24:**
  | # | Title | State |
  |---|---|---|
  | #126 | Checkout scaffold + `Checkout.start` | ✅ merged (`ee37473` + `15fb6bb`, merge `bfe16fe`) |
  | #132 | `reorderWithTempPhase` + `assertWithinScope` | ✅ merged (`2112ad2` + `b84644a`, merge `4bbb0e7`) |
  | #137 | Collapse `Env` onto `Cloudflare.Env` | NEW (2026-05-24), follow-up to #126; **recommended next** — smallest diff if it lands before
  #128/#133 per §4 caveat |
  | #128 | Curriculum foundation + Student-facing migration | not dispatched |
  | #133 | Asset module foundation + 3 API route migrations | not dispatched |

`resolve-issues` *may* be ahead of `origin/resolve-issues`. **DO NOT `git push` and DO NOT open a `resolve-issues → staging` PR without explicit  user authorization** — the user batches PRs at deliverable boundaries (typically wave boundaries).

**Open with exactly this question, no preamble:**

  > "Wave 1 is half done. Three valid next moves: (a) dispatch #137 via the §10.1 worktree recipe — recommended per §10.2 since it's the smallest diff before #128/#133; (b) open the `resolve-issues → staging` PR now for the merged work (#126 + #132 + the docs); (c) something else. Which?"

**Non-negotiable rules (violating any of these has a high cost):**
  - Commit format: `<type>(<scope>): :gitmoji-text-code: <subject>` — gitmoji.dev codes only, no unicode glyphs. Pick the emoji by intent, not type (e.g. `chore(deps): :arrow_up: bump X`, `chore: :fire: delete dead code`).
  - After a `resolve-issues → staging` PR merges, run `gh issue close <N>` **manually** for every issue carried — `Closes #N` does NOT fire on staging-targeted PRs (see `project_pr_into_staging_no_autoclose.md` in user memory).
  - Worktree-removal gotcha: `git worktree remove --force` may leave a residual `.wrangler/` dir locked by miniflare. Workaround in handoff §10.2: `Move-Item ../platform-N ../platform-N.deleted; Remove-Item -Recurse -Force ../platform-N.deleted` (rename bypasses Windows' phantom directory-level lock).
  - Cross-cutting infra fixes discovered mid-feature → carve into their own `chore(types|infra):` commit; do NOT bundle with the feature diff. See #126's `chore(types) ee37473` split-off as the canonical example.
  - Auth gates throw Response; fallible helpers return `{ data } | { error: Response }`; configuration failures throw Error. The decision tree is in `.claude/CLAUDE.md`.
  - Sandbox is denied from reading `.env` and `.dev.vars` — never attempt.

**Skills to invoke proactively (don't re-derive):**
  - `react-router-framework-mode` — anything routing/loader/action/form
  - `tdd` — red-green-refactor inside each issue
  - `diagnose` — test or typecheck failure investigation
  - `using-git-worktrees` — Wave 1 dispatch + cleanup
  - `verification-before-completion` — before marking any AC done
  - `diagnose` — test or typecheck failure investigation
  - `using-git-worktrees` — Wave 1 dispatch + cleanup
  - `verification-before-completion` — before marking any AC done

**If anything in the live state contradicts what this prompt says,** trust the live state and the canonical docs (CLAUDE.md, the handoff doc, the GitHub issue body — in that order of authority).
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
 - Pls tell me this just slipped your mind, maybe due to lack of sleep, because I'd hate to think I'm being punished financially for an oversight I *already* owned up to. I'm really struggling to assume positive intent and give you the benefit of the doubt here.
 - If you're still holding out on me for some reason, now's the time to clear the air. How do you plan to make this right so we can keep our relationship strictly professional?
### Escalate
>[!warning] Confirm with Minh Vu to see if his SHUI is covered

 - I expect you to be straight with me moving forward, and not play games with my compensation.
 - I can tolerate mistakes, but between this unannounced pay cut and the company actively breaching my contract by withholding my SHUI contributions for 7 months (that is seven consecutive pay cycles, 7 chances to make it right, just to be clear), this situation has become utterly unacceptable and completely unprofessional. 
 - I'm calling this out because it's obvious that this SHUI debt doesn't just affect me. Even the highest performers on our team (and former team members) are in the same boat. Given that there is clearly still budget to hire new people, leaving this debt unpaid is incredibly hard to justify.
 - Maybe you aren't aware of this, but you've been given far more grace for your own oversights than I ever received for being "inattentive," yet I am the one being penalized. The double standard here is glaring, and we need to resolve it immediately.
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
