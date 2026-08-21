# Claude Code Skills Playbook — SDLC around `next-steps.md`

*For contributors who do not code. Find your recipe, use the prompt templates, send them. The agent does the rest.*

## How it works
You describe and decide. The agent codes, tests, and reviews. Five parts:
- **Claude Code** — the terminal program you type to. One conversation = one **session**.
- **The skills pack** — the `mattpocock-skills` plugin (by Matt Pocock, official plugin list): `/` commands that each load a proven way to do one type of work.
- **The Issue tracker** — GitHub Issues. Every piece of work is an **Issue** there; specs and work detail live on the tracker, not in files.
- **The spine** — `docs/plans/next-steps.md` in your repo: your status board and the handoff between sessions. One line per Issue; the detail stays on the tracker.
- **The decision docs** — `docs/adr/` (one small file per settled call, named for its ID: `DEC-GIT-FLOW.md`) and `CONTEXT.md` (the project's words, one meaning each). The skills write both as calls settle; the spine only points there. You never edit them.

One feature's journey: you explain it (recipe 2) → the agent specs it, builds it (5), reviews it (6) → you approve and ship it (7). **When all goes well, you are needed only at the start and at the end.**

Read the spine as a status board:
- Unchecked ⚡ line = work that waits for an agent (tracker label `ready-for-agent`).
- Checked ⚡ line = built and tested; its PR (a package of changes) waits for review and ship.
- 🧑 line = waits for **you**: a question, a decision, or an operator-only task (tracker label `ready-for-human`). A decision that waits for your word keeps its 🧑 line until you give it.

**Badges**:
- 🚶 send and walk away 
- 🧑 stay and answer 
- 🚶→🧑 runs alone, final call is yours.

## Before your first recipe — once, with the maintainer
This file is all you receive; two people make it work. **You** are the **operator**: you describe and decide. The **maintainer** is the technical teammate who owns the project — your first stop whenever something is beyond this file.

Have the maintainer set up with you, one time:
1. **Claude Code** installed on your machine and signed in.
2. **The repo** — the project's folder of files, synced with GitHub — on your machine, plus access to it on GitHub.
3. **This playbook file** saved on your machine. Remember where: recipe 1 asks for its full path. To copy the path: right-click the file in Finder and hold Option → "Copy … as Pathname" (Windows: Shift+right-click → "Copy as path").

To open a terminal **in the repo folder** (every recipe starts this way): open the Terminal app, type `cd` and a space, drag the repo folder into the window, press Enter. Then type `claude`.

## Pick your recipe

| Stage | You want to… | Recipe |
|---|---|---|
| Set up | Set up a new machine or repo | 1 · One-time setup 🚶 |
| Decide | Add a feature | 2 · New feature 🧑→🚶 |
| Decide | Tweak something tiny — a line of text, a label, a color | 2a · Quick change 🚶 |
| Decide | Add a feature too foggy to describe | 3 · Map the fog 🚶→🧑 |
| Decide | Answer one design question with a test build | 4 · Design detour 🚶→🧑 |
| Build | Build the queued work | 5 · Build 🚶 |
| Build | Tell the agent your task list; it asks, then opens the Issues | 5 · Build, queue filled by interview 🧑→🚶 |
| Check | Review a PR, hunt bugs, harden code | 6 · Review 🚶 |
| Ship | Ship finished work | 7 · Ship 🚶→🧑 |
| Maintain | Sort incoming reports and requests | 8 · Triage 🚶 |
| Maintain | Fix something broken | 9 · Broken 🚶 |
| Maintain | Fix a merge stuck half-way | 10 · Merge mess 🚶 |
| Improve | Get optimization / clean-up ideas | 11 · Survey 🚶 |

Normal feature journey: **2 → 5 → 6 → 7**. Tiny tweak: **2a → 7**. No row fits? Type `/mattpocock-skills:ask-matt` and describe your situation — it routes you to the right skills for the job.

## How to send a recipe
1. Start a new session in the repo folder (type `claude` in the terminal). One recipe per session.
2. Copy the recipe's boxes, top to bottom:
   - ✏️ = **fill first**: replace each `<placeholder>` with your words, remove the brackets, change nothing else.
   - 📋 = **send as is**: never change these.
3. Send the boxes one after another, each as its own message. **Do not wait between them** — they queue.
4. Badge 🚶? Leave — but keep the terminal window open and the computer awake. Come back later. Closed it by accident? Open a terminal in the repo folder, type `claude --resume`, and pick the top session.

Rules that keep it safe:
- Box text is written for the agent. It looks dense. Copy it exactly.
- The last box of a walk-away recipe is a `/goal`. It defines "done" as visible evidence and keeps the agent going until then. Always its own message, always last, never edited.
- The `/` commands (e.g. `/goal`, `/mattpocock...`) at a box's start must stay the first words of the message (some never show in the typing menu — they work anyway).
- Your long input goes at the end of the box, after its label line ("The idea:"). Ctrl+Enter makes new lines.

## If the agent pauses
The agent does not guess choices that are hard to undo or that define the product. It stops, shows options + a recommendation, files the fork as a 🧑 line, and waits. **A paused run is correct behavior.** To answer:

✏️
```
<your decision, in one or two sentences> — record it as a DEC-* file in docs/adr/ and clear the fork's 🧑 line, then continue
```

Then re-send the recipe's `/goal`, unchanged.

- **The call belongs to someone else?** Send `/mattpocock-skills:to-questionnaire` as its own message. It writes a questionnaire file you hand to that person; answer the pause with what comes back.
- **A step only a person can do** (accounts, dashboards, secrets)? The agent writes a **wizard** — a script that walks you through each click. Run the command it shows.

When you come back, the session's last message shows one of three states:
- **goal met** (evidence on screen: green tests, PR URL, spine sections) 
- **paused** (answer as above) 
- **one item blocked** (parked under 🧑 with its blocker named; the rest continued).

## The recipes
### 1. One-time setup 🚶
**Part A — once per machine.** In any Claude Code session, type:

```
/plugin install mattpocock-skills@claude-plugins-official
```

```
/plugin install superpowers@claude-plugins-official
```

(Or type `/plugin`, open **Discover**, and install each.) The first is the skills pack; the second carries the Ship and UI-prototype skills. Then start a **new** session — skills load at session start. The plugins update themselves. Set permissions once with the maintainer; if something fails, ask them.

**Part B — once per repo.** Skip if `docs/plans/next-steps.md` already exists. New session at the repo root:

✏️
```
/mattpocock-skills:setup-matt-pocock-skills set up this repo — GitHub as the Issue tracker, default triage labels, single-context domain docs — then scaffold the repo spine:
1. Create docs/plans/next-steps.md from the Day-0 spine template in the playbook — read it at <the full path of this playbook file on this machine> — seeding 🔧 with this repo's real bootstrap commands.
2. Git flow: read what this repo already establishes — CONTRIBUTING/docs, branch protection, merged-PR history — follow it, and record only the calls it leaves unanswered as docs/adr/DEC-GIT-FLOW.md, written to the DEC-* file template in that playbook. Decisions live in docs/adr/, one file each, never inline in the spine.
3. Add the three CLAUDE.md standing blocks from that playbook (work spine + git hygiene + testing discipline).
4. Do all of it on a chore/bootstrap branch and open the PR — nothing lands on the default branch directly, including this.
5. Hit a DEC-worthy fork (hard to reverse / product intent)? Pause: options + your recommendation, wait for me — don't guess.
```

📋
```
/goal the chore/bootstrap PR is open — URL shown in this session — with docs/agents/ (issue tracker, triage labels, domain docs), docs/plans/next-steps.md (🔧 seeded), docs/adr/DEC-GIT-FLOW.md, and the three CLAUDE.md standing blocks in its diff; OR paused on a DEC-worthy fork — options and a recommendation shown, still unanswered by me
```

The agent reads the templates it needs from the [reference blocks](#agent-reference) at the bottom of this file. **Next →** Ship the bootstrap PR (recipe 7).

### 2. New feature 🧑 then 🚶
**When:** your app must do something new, or the change needs real decisions. This is the start of the journey — **stay** for the interview. *(Just a tiny tweak? Use 2a.)*

✏️ Send, then answer the agent's questions, one round at a time, until it has none left:
```
/mattpocock-skills:grill-with-docs /mattpocock-skills:codebase-design grill me on the idea below — record hard calls as DEC-* files in docs/adr/ as they settle, one file per decision, named for the decision, never a sequential number. The idea:
<your idea: what, why, and every limit you already know>
```

*(Repo has no docs to read? Use `/mattpocock-skills:grill-me` instead of the two skill words. Fact-check anytime with `/mattpocock-skills:research <question>` as its own message — it runs in the background.)*

📋 When the questions end, send these three in order and walk away:
```
/mattpocock-skills:to-spec spec everything agreed above — pin the seams yourself, existing preferred, at most one new; a seam you had to invent gets an OPEN marker in the spec plus a 🧑 line in @docs/plans/next-steps.md, not a question to me
```

```
/mattpocock-skills:to-tickets skip the quiz — cut the spec into agent-sized Issues from what's agreed, and mirror each as a one-line ⚡ item linking its Issue in @docs/plans/next-steps.md; an Issue depending on an OPEN seam or any 🧑-parked question → 🧑 with it named, never ⚡, until I ratify it as a DEC-* file in docs/adr/
```

```
/goal the spec is published on the Issue tracker — its URL or ID shown in this session — and linked from @docs/plans/next-steps.md, at least one Issue created with every Issue's ID or URL shown, and the ⚡/🧑 sections shown after the last edit holding one line per Issue (OPEN-seam and open-question Issues under 🧑); OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```

**Result:** your idea is now Issues (tracked units of work on GitHub), one ⚡ line each. The spec — the written plan — lives on the tracker too. **Next →** Build (recipe 5).

### 2a. Quick change 🚶
**When:** you can say the whole change in one or two sentences, and it does not change how the product behaves — text, a label, a color, a link, an image. In doubt? Use recipe 2 — a tiny idea just makes a short interview. If the "tweak" is bigger than it looks, the agent pauses and tells you.

✏️ + 📋:
```
/mattpocock-skills:tdd /mattpocock-skills:implement make the small change below — do 🔧 first; work on its own branch per this repo's established git hygiene with proper seams, its PR opened without asking, and log it as one checked-off ⚡ line linking the PR in @docs/plans/next-steps.md; add a regression test only where the testing discipline warrants one — a pure copy/styling tweak warrants none; the change needs a product call, a new seam, or outgrows one small slice → pause: options + a recommendation (say if the New feature recipe is the right route), filed as a 🧑 line, wait for me; blocked → park it under 🧑 with the blocker named. The change:
<what to change, where exactly, and the exact text or value to use>
```

```
/goal the quick change's PR URL shown, the full suite's passing output shown in this session, and its checked-off ⚡ line linking the PR shown in @docs/plans/next-steps.md after the edit; OR the change parked under 🧑 with its blocker named — the 🧑 section shown; OR paused — a product call, a new seam, or the change outgrew one small slice — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```

**Next →** Ship (recipe 7). Unsure about the result, or the diff grew? Run Review (recipe 6) first.

### 3. Map the fog 🚶, then explore it 🧑
**When:** the idea is an epic — too big or too unknown for recipe 2's interview.

✏️ + 📋, then walk away:
```
/mattpocock-skills:wayfinder chart a map for the epic below — chart from the codebase and docs; unknowns become decision tickets on the map, never questions to me; then add a 🧑 line in @docs/plans/next-steps.md linking the map and naming the first frontier ticket (map tickets are explored with the operator, never ⚡); a DEC-worthy fork → pause: options + a recommendation, filed as a 🧑 line, wait for me. The epic:
<what you know, what you do not know, and the destination>
```

```
/goal the wayfinder map exists on the Issue tracker — the map's URL or ID and its decision tickets shown in this session — and the 🧑 line linking it shown in @docs/plans/next-steps.md after the edit; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```

The map is an Issue on the tracker; its **decision tickets** are child Issues, each one open question. The **frontier** is the tickets ready to work now. To explore it: new session, 📋 the line below, **stay** (no `/goal` here):
```
/mattpocock-skills:wayfinder /mattpocock-skills:grilling /mattpocock-skills:domain-modeling work through the map with me — it is linked under 🧑 in @docs/plans/next-steps.md; when a call settles, write it as its own DEC-* file in docs/adr/, named for the decision, not a sequential number and not a line in the spine
```

A region became clear? **Next →** take it through recipe 2 like any idea.

### 4. Design detour — a test build answers one question 🚶→🧑
**When:** one design question blocks progress and only a working example can answer it. The build is a throwaway; it never ships.

✏️ + 📋:
```
/mattpocock-skills:prototype build a throwaway that settles the design question below — run it, and write the verdict as its own DEC-* file in @docs/adr/ — named for the decision, frontmatter "status: proposed — operator confirms", linking the prototype's branch and exactly how I open it (a file to double-click, or one command) — plus a 🧑 line in @docs/plans/next-steps.md naming that file so I see it waits for me; a DEC-worthy fork outside the question → pause: options + a recommendation, filed as a 🧑 line, wait for me. The prototype MUST live locally and built based on the existing UI unless explicitly told to build a completely new UI. DO NOT create Claude Artifacts. The question:
<the decision it must settle and what evidence settles it>
```

```
/goal the prototype ran — command and output (or the file to open) shown in this session — the proposed DEC-* file shown written under @docs/adr/ linking the prototype's branch, and its 🧑 line shown added to @docs/plans/next-steps.md; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```

*(Question about looks/UI? Start the first box with `/mattpocock-skills:prototype /superpowers:frontend-design` and judge with your own eyes.)*

**When you return:** the verdict is only *proposed*. A logic prototype is one HTML file — double-click it and press its buttons; a UI prototype starts with one command the DEC-* file names. Then tell the agent to accept the DEC-* file — its status becomes accepted and its 🧑 line goes — or to delete it.

**Question appeared mid-interview (recipe 2)?** Park it there with ✏️ `/mattpocock-skills:handoff design detour: <the question>` — the agent writes a handoff file and shows its path. Run this recipe in a new session. Then resume the interview: one more new session, ✏️ `Read the handoff file at <the path the old session showed> and continue the interview.`

### 5. Build 🚶
**When:** the ⚡ queue holds Issues (after recipe 2) — or you filled it by interview (below). Tests first, then code, one branch and one PR per item; the agent reviews its own work before each item's PR. Review (6) is the deeper second pass.

**Fill the queue by interview** (optional, 🧑 then 🚶): the agent asks scope-scaled questions, opens the Issues, and fills the queues for you — for a batch of your own tasks that still have details worth asking about. Anything needing a real design interview goes through recipe 2 instead. Send this, then answer its questions, one round at a time, until it has none left:

```
/mattpocock-skills:to-tickets turn the batch below into agent-sized Issues — quiz me first, scaled to each item's scope: a tweak-sized item gets no questions, an item with real choices gets numbered questions with your recommended answer, one or two rounds at most; then publish the Issues (label `ready-for-agent` OR `ready-for-human` accordingly, with blocking edges declared) and mirror each as one ⚡ line linking its Issue, in build order, in @docs/plans/next-steps.md; an item that needs a design decision from me, or that only I can do → 🧑 with the reason (say if the New feature recipe is its route), never ⚡; a DEC-worthy fork → pause: options + a recommendation, filed as a 🧑 line, wait for me. The batch:
<your tasks, one line each, with any limits you already know>
```

📋 Send this one right after:
```
/goal every item in my batch is either published as an Issue — each Issue's ID or URL shown in this session — with its one-line ⚡ mirror shown in @docs/plans/next-steps.md after the last edit with those changes pushed by following the existing git hygiene (no other diffs other than the file itself), or parked under 🧑 with its reason shown; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me.
```

**Then drain:** fresh session, prefer Variant A below.  If it's a long list, use Variant B.

**Variant A — drain the whole queue** (short queue, 2–3 small items). 📋 both:
```
/mattpocock-skills:tdd /mattpocock-skills:implement drain the ⚡ queue in @docs/plans/next-steps.md following this repo's established git hygiene — do 🔧 first; one branch and one PR per item, opened without asking; a blocked item → 🧑 with the blocker named, then continue; a DEC-worthy fork (hard to reverse / product intent / new seam) → pause: options + a recommendation, filed as a 🧑 line, wait for me; keep the spine current as you go
```

```
/goal every ⚡ item present at session start in @docs/plans/next-steps.md is either checked off or parked under 🧑 with its blocker named — each checked-off item's tests shown green and its PR URL shown, a full-suite pass shown in this session, and the ⚡ section shown after the final edit holding no unchecked items besides those surfaced during the drain; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```

**Variant B — one item per session** (the skills' native rhythm: each Issue fits one fresh session; repeat in fresh sessions, the spine hands over between them). 📋 both:
```
/mattpocock-skills:tdd /mattpocock-skills:implement take the top ⚡ item in @docs/plans/next-steps.md — do 🔧 first; work on its own branch per this repo's established git hygiene — written rules (CONTRIBUTING/CLAUDE.md/DEC-* files in docs/adr/), else merged-PR practice — its PR opened without asking (integration stays with Ship, after Review); blocked → park it under 🧑 with the blocker named; a DEC-worthy fork → pause: options + a recommendation, filed as a 🧑 line, wait for me; keep the spine current as you go
```

```
/goal the item this session took is checked off in @docs/plans/next-steps.md — its tests shown green, full suite passing shown, its PR URL shown, ⚡ section shown after the check-off; OR the item parked under 🧑 with its blocker named — the 🧑 section shown; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```

*(For one specific item, replace "the top ⚡ item" with its name.)*

**Next →** Review (recipe 6).

### 6. Review — the agent attacks its own work 🚶
**When:** a PR is open (after recipe 5), or any PR needs a bug-hunt / hardening pass. The PR number is the last part of the PR URL shown by Build.

**Small or medium PR — one session.** ✏️ (replace `<N>` with the PR number) + 📋:
```
/mattpocock-skills:tdd /mattpocock-skills:code-review perform a DEEP adversarial review loop on PR <N>. Every finding → unchecked ⚡ item in @docs/plans/next-steps.md (file:line, failure scenario, severity); fix each test-first and push after each green fix — #<N> must hold every fix; re-review; repeat; a product-intent finding → 🧑 with the reason, never decided solo; a DEC-worthy fork → pause: options + a recommendation, filed as a 🧑 line, wait for me
```

```
/goal the latest /mattpocock-skills:code-review pass in this session reported zero new findings — a clean first pass counts — every review item filed in the ⚡ queue of @docs/plans/next-steps.md checked off with its regression test shown red then green or parked under 🧑 with its reason, every fix pushed with the updated PR head shown, and the full suite's passing output shown in this session; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```

**Big PR — three fresh sessions** (the spine carries findings between them):

**B1 · find** — new session, ✏️ one message (replace `<N>` twice):

```
/mattpocock-skills:code-review since the PR's base branch on origin — run gh pr checkout <N> first and resolve the base with gh pr view <N>, never assume — adversarial pass: hunt bugs, gaps, regressions. REPORT ONLY: every finding → unchecked ⚡ item in docs/plans/next-steps.md (file:line, failure scenario, severity); a product-intent finding → 🧑 with the reason, never ⚡; then stop. Fix nothing.
```

**B2 · fix** — new session, 📋 both:

```
/mattpocock-skills:tdd /mattpocock-skills:implement drain the review findings in the ⚡ queue of @docs/plans/next-steps.md top-down — regression test first, check each off as it goes green, push after each green fix; a finding needing a product call or with no testable seam → park under 🧑 with the reason; a DEC-worthy fork → pause: options + a recommendation, filed as a 🧑 line, wait for me
```

```
/goal every review finding in the ⚡ queue of @docs/plans/next-steps.md checked off with its regression test shown red then green or parked under 🧑 with its reason, every fix pushed with the updated PR head shown, a full-suite pass shown; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```

**B3 · refute** — new session, ✏️ one message:

```
/mattpocock-skills:code-review since the PR's base branch on origin (gh pr view <N> resolves it) — try to REFUTE the checked-off fixes in @docs/plans/next-steps.md and hunt fresh regressions; survivors go back into ⚡ unchecked.
```

Repeat B2 → B3 until B3 adds nothing new to the spine. Several PRs? One review each. **Next →** Ship (recipe 7).

### 7. Ship 🚶→🧑 — the end of the journey
**When:** a PR passed Review. Look first: open the PR on GitHub, read it, try the preview. Satisfied? 📋 both:
```
/superpowers:finishing-a-development-branch verify green, integrate per this repo's established git hygiene, else merged-PR practice, and a flow call answered nowhere is a DEC-worthy fork — delete the merged branch, delete the shipped item's line from the spine (git log is the record); a DEC-worthy fork → pause: options + a recommendation, filed as a 🧑 line, wait for me
```

```
/goal the branch integrated per the repo's established git hygiene — merge/PR result shown in this session — the merged branch deleted, the shipped item's line deleted with the ⚡ section of @docs/plans/next-steps.md shown after the edit, and any production promotion recorded as a 🧑 line, not performed; OR nothing integrated — verification red or the merge gated on me by the repo's flow (protected branch / required review) — the state shown (failing output or the open PR's URL) and the next step parked as a 🧑 line; OR paused on a DEC-worthy fork — options and a recommendation shown, filed as a 🧑 line and still unanswered by me
```

*(Previews: if the maintainer set one up, send their preview command — often `/vercel:deploy` — as its own message between the two boxes.)*

**The agent never releases to production alone.** A production release always lands as a 🧑 line: you run it, with the maintainer if needed — often via a wizard script the agent writes for you.

### 8. Triage — sort incoming reports 🚶
**When:** bug reports or requests arrived from other people (never recipe 2's own output — those Issues are already agent-ready). Work lands in ⚡; judgment calls land in 🧑 for you.

✏️ + 📋:
```
/mattpocock-skills:triage triage the batch below — raw issues I didn't write only, never /mattpocock-skills:to-tickets output; move each through the triage roles with an agent-ready brief where it earns one; mirror the outcome in @docs/plans/next-steps.md: each ready-for-agent Issue → one ⚡ line linking it; close/priority/product-intent calls → 🧑 with the reason, never decided solo; a fork blocking the whole batch → pause: options + a recommendation, filed as a 🧑 line, wait for me. The batch:
<issue numbers, a label, "all new GitHub issues", or paste the raw reports>
```

```
/goal every issue in the batch dispositioned — a per-issue list (role + one-line reason) shown in this session and the ⚡/🧑 sections of @docs/plans/next-steps.md shown after the last edit carrying one line per issue with its link; OR a zero-issue batch — the batch query and its empty result shown, the spine left untouched; OR paused on a fork blocking the batch — options and a recommendation shown, filed as a 🧑 line and still unanswered by me
```

### 9. Broken 🚶
**When:** an error appears, a page fails, a test is red, behavior is wrong. Copy the **exact** error text first — it matters.

✏️ + 📋:
```
/mattpocock-skills:diagnosing-bugs /mattpocock-skills:tdd diagnose the symptom below — fix on its own branch per this repo's established git hygiene; a DEC-worthy fix → pause: options + a recommendation, filed as a 🧑 line, wait for me. The symptom:
<paste the exact error or failure output (screenshots are highly recommended) and where it bites>
```

```
/goal EITHER the root cause stated in one sentence, a regression test shown failing before and passing after the fix — for a perf symptom, the measured numbers shown before and after — rerun (--repeat-each or equivalent) if intermittent, the full suite's passing output shown, the fix's PR URL shown, and the post-mortem lesson line shown added to @docs/plans/next-steps.md; OR paused — non-reproduction with the attempts logged, or a DEC-worthy fix laid out with options and a recommendation — filed as a 🧑 item and still unanswered by me
```

*(Bug only appears on your machine or account? The agent cannot see it — stay and run what it asks. It may hand you a wizard script for the clicks.)*

**Next →** Review (6), then Ship (7).

### 10. Merge mess 🚶
**When:** a merge or rebase stopped half-way with conflicts and no session is on it. (Inside a running Build/Review session: do nothing — the agent routes itself here.)

✏️ + 📋:
```
/mattpocock-skills:resolving-merge-conflicts <what is in flight: merge or rebase, which branch goes into which, and any intent the code will not show>
```

```
/goal EITHER the merge/rebase concluded — git status shown with no unmerged paths and the repo's checks re-run green in this session; OR concluded with only pre-existing failures — git status shown with no unmerged paths and the failing checks named in a 🧑 line shown added to docs/plans/next-steps.md; OR paused on a hunk carrying a product decision — the operation left un-mashed, both intents laid out with a recommendation, a 🧑 line naming them shown added to docs/plans/next-steps.md, still unanswered by me
```

### 11. Survey — optimization ideas 🚶
**When:** spare agent time. Report only — it changes no code. The report is a visual web page you can open later.

✏️ + 📋:
```
/mattpocock-skills:improve-codebase-architecture /mattpocock-skills:codebase-design survey <the whole repo, or one subsystem> for the highest-leverage structural improvements — show git status before touching anything; REPORT ONLY: stop after the HTML report; each pick lands as one 🧑 idea line (what, why, entry file, the report's file path) flagged "grill before building" in @docs/plans/next-steps.md — ideas are operator work, never ⚡; change no source code
```

```
/goal every pick shown as a 🧑 idea line after the last edit with the report's file path shown in this session — or a no-picks verdict shown with the subsystems examined listed — and closing git status shown identical to the opening one except @docs/plans/next-steps.md; OR paused on a DEC-worthy fork — options and a recommendation shown, filed as a 🧑 line and still unanswered by me
```

**Next →** an idea becomes work only through recipe 2. Never straight to Build.

## Steer a running session
- **Add an instruction:** just type it — a typed message outranks the loaded skills. If it changed what "done" means, restart the recipe fresh (or get a corrected `/goal` from the maintainer).
- **Confused by the agent's last message?** Type `/mattpocock-skills:wait-what` — it re-pitches in plain words, with the context you were missing.
- **Answer a pause:** see "If the agent pauses" above.
- **Wrong recipe, or session grew long:** ✏️ `/mattpocock-skills:handoff <what the next session must do>` — the agent writes a handoff file and shows its path. Open a new session and start the right recipe there; to continue saved work instead, send ✏️ `Read the handoff file at <the path the old session showed> and continue.`
- **Something feels wrong and no rule here covers it?** Press Esc to stop the agent mid-run, and ask the maintainer. Nothing breaks while you wait.

## Agent reference
<details>
<summary>Day-0 spine template + DEC-* decision file template + three CLAUDE.md standing blocks — recipe 1's agent reads these. You never copy them.</summary>

Day-0 spine template:

```markdown
# Next Steps — <project>

Status board + cross-session handoff. The Issue tracker holds each Issue's detail; this file
mirrors status, one line per Issue (⚡ = tracker label `ready-for-agent`, 🧑 = `ready-for-human`).
**🔧 setup**, then **⚡ queue** + **🧑 human-in-the-loop** are the only actionable sections; **Reference** is
consult-on-demand. Shipped work lives in `git log`; settled decisions in `docs/adr/` — not here.

> **Fresh session?** <one line of world-state + the first thing to do>

## 🔧 Machine setup — do this FIRST
<real bootstrap commands + the verification gate: "before declaring done, run X">

## ⚡ Agent-ready queue
**Nothing queued.**

## 🧑 Human-in-the-loop
<operator-only items — an agent never drains these>

## Reference — consult when a task needs it
- **Decisions → `docs/adr/`** — one `DEC-*.md` file per hard-to-reverse call, do-not-reopen. Read that folder before you re-open a settled call; a new decision gets a new file there, never a line here. Project vocabulary → `CONTEXT.md`.
- `docs/adr/DEC-GIT-FLOW.md` — branch, merge, and promotion policy (fallback — the repo's own docs and merged-PR practice win wherever they speak).
- **Lessons** — one line per trap, newest first:
- <other pointers a task needs: specs, maps, runbooks>
```

DEC-* decision file template — `docs/adr/DEC-<SLUG>.md`, one file per decision. The `DEC-*` ID is
the file name — named for the decision, never a sequential number, never two decisions in one
file. Frontmatter only when the status matters — `proposed` until the operator accepts it
(recipe 4), then `accepted`.

```markdown
---
status: accepted
---

# DEC-<SLUG> — <the call in a few words>

<1-3 sentences: the context, what was decided, and why — plus the alternative rejected, if a
reader would otherwise suggest it again. Link the spec, Issue, PR, or prototype that settled it.>
```

Seed `docs/adr/DEC-GIT-FLOW.md` on Day 0 with the calls the repo leaves unanswered:

```markdown
# DEC-GIT-FLOW — branch and merge policy

Fallback only: this repo's own docs and its merged-PR practice win wherever they speak. Default
branch <main>; integration branch <main/dev>; feature branches `<type>/<slug>` off integration,
merged by PR only; promotion policy <merge commit / squash>.
```

CLAUDE.md standing block 1 — the work spine:

```markdown
## The work spine — `docs/plans/next-steps.md` (work) + `docs/adr/` (decisions)
- Read the spine before starting any work. The ⚡ queue is the only source of agent-ready work; 🧑 items are operator-only. The Issue tracker holds each Issue's detail — the spine only mirrors it, one line per Issue.
- Keep it current AS you work, not at the end: check off / delete what ships (git log is the record), add newly surfaced work as one-line ⚡ items linking to their issue/PR/spec, record new traps as one-line lessons under Reference.
- Hard-to-reverse decisions never live here: each one is its own `docs/adr/DEC-<SLUG>.md` — named for the decision, never a sequential number. Read `docs/adr/` before you re-open a settled call; the spine only points at the folder. A decision still waiting on the operator keeps `status: proposed` plus a 🧑 line naming its file.
- Keep it minimal: pointers over prose; never restate auto-loaded rules or shipped code.
```

CLAUDE.md standing block 2 — git hygiene:

```markdown
## Git hygiene
- Branch naming, integration branch, and promotion policy come from the repo, not this block — written rules first (CONTRIBUTING/docs, DEC-* files in `docs/adr/`), merged-PR practice where they're silent; a call nothing answers → settle it once with the operator, record it as a DEC-* file in `docs/adr/`.
- Nothing lands on the default/integration branch directly — one ⚡ item = one feature branch off the freshest integration branch (fetch first), merged back by PR.
- Commit per green slice with an imperative message; no WIP noise — the branch history should read as the story of the item.
- Merge conflicts (merge OR rebase) → the /mattpocock-skills:resolving-merge-conflicts skill: primary sources per hunk, both intents preserved, checks re-run — never hand-mash a hunk, never --abort and retry blind.
- Finished branch → verify green, open/refresh its PR per the repo's flow; integration happens at Ship, after Review — delete the branch only once merged. Stale branches are debt — prune on sight.
- Never force-push a shared branch; never rewrite main's history.
```

CLAUDE.md standing block 3 — testing discipline:

```markdown
## Testing discipline
- A test exists to catch a REGRESSION: it locks an observable behavior at a seam, reads like a specification, and survives refactors. If internals can change and the test breaks anyway, it was testing implementation — rewrite it at the seam or delete it.
- Test at the HIGHEST seam that reaches the behavior, preferring existing seams — the interface is the test surface. New seams are proposed in the spec and agreed before code; the ideal number of new seams is one.
- Minimal suite: one test per behavior/decision. A shared helper's contract is tested once at its own seam, never re-driven per call site. Assert on the thing, never a proxy for it.
- Noise is a defect: no whole-tree snapshots, no mock-wiring or call-count assertions, no styling/copy checks — unless that exact detail IS a locked decision (then record it as a DEC-* file in `docs/adr/` and say so in the test name).
- Every test earns its place by failing for exactly one reason someone cares about. Before cutting a test, read its name/header for the decision it locks.
- Intermittent ≠ rare: rerun (--repeat-each or equivalent) before declaring a bug disproved or a fix proven; wait out the product's own debounces instead of retrying lookups.
```

</details>
