# Claude Code Skills Playbook — SDLC around `next-steps.md`

*For contributors who do not code. Pick a recipe, fill its boxes, send them. The agent does the rest.*

*Written for Matt Pocock's skills — `mattpocock/skills`, **v1.3.1** (Oct 4, 2026) and the `main` branch it ships from — on Claude Code 2.1.x. When `npx skills@latest update` reports changed skills, the maintainer re-checks this file against the changelog at aihero.dev/skills.*

## How it works
You describe and decide. The agent codes, tests, reviews and ships. The parts:
- **Claude Code** — the terminal program you type to. One conversation = one **session**.
- **The skills** — Matt Pocock's `/` commands, each a proven way to do one kind of work, typed by their bare name (`/implement`). Nothing else is installed.
- **The tracker** — GitHub Issues. Every piece of work is an **Issue**; specs and detail live there, not in files.
- **The spine** — `docs/plans/next-steps.md` in the repo: the status board and the handoff between sessions, one line per Issue.
- **The records** — `docs/adr/` (one small numbered file per settled call, such as `0001-git-flow.md`), `GLOSSARY.md` (the project's words, one meaning each) and `CODING_STANDARDS.md` (the rules every review checks; Retro grows it). The skills write all three. You never edit them.

One feature's journey: you explain it and answer the questions (recipe 2 — the only time you must stay) → one send builds, reviews and ships it to production (recipe 3). After a rough run, Retro (10) smooths the next one.

The spine is a status board:
- Unchecked ⚡ = waits for an agent (tracker label `ready-for-agent`).
- Checked ⚡ = built and tested; its PR (a package of changes) waits for review and ship.
- 🧑 = waits for **you**: a question, a decision, or a step only a person can do (`ready-for-human`). It stays until you act.

Badges: 🧑 stay and answer · 🚶 send and walk away · 🚶→🧑 runs alone, the last call is yours.

## Once, with the maintainer
You are the **operator**: you describe and decide. The **maintainer** owns the project — your first stop when something is beyond this file. Have them set up with you, one time:
1. **Claude Code** signed in (2.1.139 or newer — the `/goal` command needs it) plus Node.js for the installer.
2. **The repo** — the project's folder, synced with GitHub — on your machine, plus access to it on GitHub.
3. **This file** saved on your machine. Recipe 1 asks for its full path: right-click it holding Option → "Copy … as Pathname" (Windows: Shift+right-click → "Copy as path").
4. **Branch protection on production** that lets the agent merge a release once checks are green: required checks yes, a required approval no. Otherwise every release stops at that gate as a 🧑 line.

Every recipe starts in a terminal **in the repo folder**: open Terminal, type `cd` and a space, drag the folder into the window, press Enter, then type `claude`.

## Pick your recipe

| Group (aihero.dev/skills) | You want to… | Recipe |
|---|---|---|
| Getting Started | Set up a machine or a repo | 1 · Setup 🧑→🚶 |
| Main Flow | Add a feature, or plan a batch of tasks | 2 · Plan 🧑→🚶 |
| Main Flow | Tweak something tiny — text, a label, a color | 2a · Quick change 🚶 |
| Main Flow | Build, review and ship the queue to production in one send | 3 · Run 🚶 |
| Main Flow | Build one item, review a PR, or ship a PR by hand | 3a Build 🚶 · 3b Review 🚶 · 3c Ship 🚶 |
| Shaping | Chart a feature too foggy to describe | 4 · Map the fog 🧑→🚶 |
| Shaping | Settle one design question with a test build | 5 · Design detour 🚶→🧑 |
| Engineering | Sort incoming reports and requests | 6 · Triage 🚶 |
| Engineering | Fix something broken | 7 · Broken 🚶 |
| Engineering | Finish a merge stuck half-way | 8 · Merge mess 🚶 |
| Engineering | Get clean-up ideas | 9 · Survey 🚶 |
| Engineering | Smooth the next run after a hard one | 10 · Retro 🚶→🧑 |

Feature: **2 → 3**, release included. Tiny tweak: **2a → 3c**. No row fits? Send `/ask-matt` and describe your situation — it routes you to the right skills. The Productivity helpers — `/handoff`, `/wait-what`, `/to-questionnaire` — appear where they are needed.

## How to send a recipe
1. New session in the repo folder. One recipe per session.
2. Copy the boxes top to bottom. ✏️ = fill first: replace each `<placeholder>` with your words, brackets gone, nothing else changed. 📋 = send as is.
3. Each box is its own message. Send them without waiting — they queue. One exception: after an interview, send the `/goal` only when the questions end, or it takes the interview over.
4. Badge 🚶? Leave, with the terminal open and the computer awake. Closed it? In the repo folder, `claude --resume`, pick the top session — an unfinished `/goal` resumes with it.

What keeps it safe:
- Box text is written for the agent and looks dense. Copy it exactly. The `/` commands at a box's start stay the first words of the message — Claude Code loads every `/` command stacked there (up to six) and hands the rest of the box to all of them as the instruction.
- The last box of a walk-away recipe is a `/goal`: it defines "done" as evidence the agent must show on screen. After every turn a second model checks the screen and sends the agent back to work until the evidence is there, or stops it when it judges the goal impossible. Always its own message, always last, never edited.
- Your long input goes at the end of the box, after its label line ("The idea:"). Shift+Enter (or Ctrl+J) makes a new line; Enter sends.

## If the agent pauses
It never guesses a call that is hard to undo or that defines the product. It stops, shows options + a recommendation, files the fork as a 🧑 line, and waits. **A paused run is correct behavior.** Answer with ✏️ below, then re-send the recipe's `/goal` unchanged:
```
<your decision, in one or two sentences> — record it where it belongs (an ADR only if it passes the three ADR tests), clear the fork's 🧑 line, continue
```
- **The call is someone else's?** Send `/to-questionnaire` as its own message: it asks who and what, writes a questionnaire file you hand over, and their answers answer the pause.
- **A step only a person can do** (accounts, dashboards, secrets)? The agent writes a **wizard** — a script that walks you through each click and keeps your secrets out of the chat. Run the command it shows.

When you come back, the last message shows one of four states: **goal met** (evidence on screen) · **paused** (answer as above) · **one item blocked** (parked under 🧑 with its blocker named, the rest continued) · **goal judged impossible, or the turn cap reached** (the reason is on screen — ask the maintainer).

## The recipes
### 1. Setup 🧑→🚶
**Part A — once per machine.** In the terminal, before `claude`, run Matt's installer — the route aihero.dev/skills lists first. It writes every skill as plain, editable files for your user account (`-g`), for Claude Code:
```
npx skills@latest add mattpocock/skills -g -a claude-code -s "*" -y
```
Start a **new** session afterwards — skills load at session start. Update with `npx skills@latest update -g -y` (the maintainer may automate it); re-run the install line to pick up skills Matt adds. Every command in this playbook is a **bare name** — `/implement`, `/to-spec`, `/retro` — exactly how the installer registers them.

No `npx`? The plugin route: in a session send `/plugin marketplace add mattpocock/skills`, then `/plugin install mattpocock-skills@mattpocock` (**Install for you**), then `/plugin` → **Marketplaces** → `mattpocock` → **Enable auto-update**. Matt's own marketplace, not Anthropic's listing (still a September build, 1.2.3). Bare names still work there, except `/code-review`: Claude Code bundles a skill of that name, so type `/mattpocock-skills:code-review`. **Never install both routes** — every skill would appear twice. Set permissions once with the maintainer.

**Part B — once per repo.** Skip if `docs/plans/next-steps.md` already exists. New session at the repo root. ✏️ Send the box; the setup skill shows what it found and asks you to confirm — reply `yes` — then 📋 send the `/goal` and walk away:
```
/setup-matt-pocock-skills set up this repo — GitHub as the Issue tracker, default triage labels — then scaffold the spine:
1. Create on GitHub, if missing, the wayfinder labels: wayfinder:map, wayfinder:research, wayfinder:prototype, wayfinder:grilling, wayfinder:task.
2. Create docs/plans/next-steps.md from the spine template in the playbook at <the full path of this playbook file on this machine>, seeding 🔧 with this repo's real bootstrap commands.
3. Seed docs/adr/0001-git-flow.md from the playbook's git-flow ADR, keeping only the calls this repo's own docs, branch protection and merged-PR history leave unanswered.
4. Create CODING_STANDARDS.md from the playbook's template; add the playbook's standing block to the file holding the `## Agent skills` block you wrote (CLAUDE.md if neither existed).
5. All of it on a chore/bootstrap branch with a PR — nothing lands on the default branch directly.
6. A hard-to-reverse or product call → stop: options + your recommendation; wait for me.
```

```
/goal the chore/bootstrap PR open — its URL and file list shown, with docs/agents/, docs/plans/next-steps.md (🔧 seeded), docs/adr/0001-git-flow.md, CODING_STANDARDS.md and the standing block's file — and every wayfinder label shown created or already present; OR stopped on a call for me — options + a recommendation shown; or stop after 10 turns and show where it stands
```

The agent reads the templates it needs from the [reference blocks](#agent-reference) at the bottom of this file. **Next →** Ship the bootstrap PR (3c).

*(Repo set up before October 2026? Have the maintainer run `git mv CONTEXT.md GLOSSARY.md` once — the skills only read the new name. Its git-flow ADR says a human merges into `main`? Have them bring the ADR and the standing block up to the versions below. After any skills update, re-running the first line of the Part B box alone refreshes `docs/agents/` without losing anything.)*

### 2. Plan 🧑 then 🚶 — the only stage that needs you
**When:** the app must do something new, or the change needs real decisions. **Stay** for the interview: every call gets made here, one-way doors included (a migration, a deletion), so the Run (3) never has to stop. *(A tiny tweak? Use 2a.)*

✏️ Send, then answer the agent's questions, one round at a time, until it has none left:
```
/grilling /domain-modeling /codebase-design The idea:
<your idea: what, why, and every limit you already know>
```

*(Fact-check anytime with `/research <question>` as its own message — it runs in the background and leaves a cited file. A question only a working example can answer? Park it for recipe 5 — see "mid-interview" there.)*

📋 When the questions end, send these three in order and walk away:
```
/to-spec publish it without the ready-for-agent label; pin the seams yourself — they count as agreed for tdd; a seam you had to invent gets an OPEN marker in the spec plus a 🧑 line in @docs/plans/next-steps.md, not a question to me
```

```
/to-tickets if the spec stopped on a fork, do nothing; else the spec Issue is the source — skip the quiz, your breakdown is approved; mirror each ticket as one ⚡ line linking it, in build order, in @docs/plans/next-steps.md; a ticket that depends on an OPEN seam or a 🧑-parked question → labelled ready-for-human and filed under 🧑 with it named, never ⚡, until I ratify it as an ADR
```

```
/goal the spec Issue's URL shown without the ready-for-agent label; every ticket's URL shown; the ⚡/🧑 sections of the spine (docs/plans/next-steps.md) shown after the last edit, one line per ticket (OPEN-seam and open-question tickets under 🧑); OR stopped on a fork for me — options + a recommendation shown, its 🧑 line filed; or stop after 10 turns and show where it stands
```

**A batch of your own tasks instead of one idea** — small items with details worth asking about (anything needing a real design interview goes through the idea box above). ✏️ Send, then answer its questions until it has none left:
```
/to-tickets /grilling the batch below — quiz me scaled to each item: none for a tweak, two grilling rounds at most; label each ready-for-agent or ready-for-human and mirror each as one ⚡ line linking it, in build order, in @docs/plans/next-steps.md; an item needing a design decision from me, or that only I can do → 🧑 with the reason (say if it needs the idea interview instead). The batch:
<your tasks, one line each, with any limits you already know>
```

📋 When the questions end:
```
/goal every item in my batch shown as a published Issue URL with its ⚡ line, or parked under 🧑 with its reason; the ⚡/🧑 sections of the spine (docs/plans/next-steps.md) shown after the last edit; OR stopped on a fork for me — options + a recommendation shown, its 🧑 line filed; or stop after 10 turns and show where it stands
```

**Result:** Issues on GitHub, one ⚡ line each; the spec — the written plan — lives on the tracker. **Next →** Run (3).

### 2a. Quick change 🚶
**When:** the whole change fits in one or two sentences and does not change how the product behaves — text, a label, a color, a link, an image. In doubt, use 2 — a tiny idea just makes a short interview. If the "tweak" is bigger than it looks, the agent stops and says so.

✏️ + 📋:
```
/implement the small change below — on its own branch per the git-flow ADR; a regression test only where CODING_STANDARDS.md warrants one; code-review fixed point: the branch's base, no spec; open its PR without asking (body per the pr skill) and log one checked-off ⚡ line linking the PR in @docs/plans/next-steps.md; a new seam, or more than one small slice → stop and say if recipe 2 (Plan) is the route. The change:
<what to change, where exactly, and the exact text or value to use>
```

```
/goal the PR URL and the full suite's passing output shown, and the checked-off ⚡ line linking the PR shown in the spine (docs/plans/next-steps.md) after the edit; OR parked under 🧑 with its blocker named, the 🧑 section shown; OR stopped on a fork for me — options + a recommendation shown, its 🧑 line filed; or stop after 10 turns and show where it stands
```

**Next →** Ship (3c). Unsure about the result, or the diff grew? Review (3b) first.

### 3. Run — Build → Review → Ship to production in one send 🚶
**When:** the ⚡ queue holds Issues (after 2). One session builds the whole spec on its integration branch, reviews the PR with fresh sub-agents and fixes what they find, merges it once green, then releases: it merges the promotion PR into production and watches the deploy. Nothing waits for you.

📋 both:
```
/implement-spec run the whole journey for the parent spec of the top ⚡ ticket in @docs/plans/next-steps.md (no parent spec → the ⚡ tickets are the task graph), stage after stage with no stop between them; a new seam → stop for me.
BUILD: list the spec's ⚡ tickets first and skip any parked under 🧑 or labelled ready-for-human; branch and draft PR per the git-flow ADR (body per the pr skill); merge each landing yourself — no merger subagents; compute the frontier from what has merged into the integration branch, not from the tracker's blocked-by counts (GitHub drops those only on close); a ticket whose tests need untracked local material (.env, a local database) is verified in the main checkout; after the code-review fixes, run only focused checks for the fixed findings; mark the PR ready.
REVIEW: then call code-review once more on the PR — fixed point: its base branch on origin; spec: the spec Issue; in both briefs hunt regressions and gaps and try to refute the build's fixes; sub-agents must not invoke code-review or spawn agents; file only CRITICAL findings — regressions, broken usability, long-term maintainability — as unchecked ⚡ lines tagged review #N (N = the PR's number) in the spine (file:line, failure scenario); fix each test-first and push so the PR holds every fix; re-review the fixes only; a product-intent finding → 🧑 with the reason, and carry on.
SHIP: then verify green and integrate per the git-flow ADR — merge the PR into its base once green; if that base is not production, open or refresh the standing promotion PR into production (reuse one already open) listing every Issue it carries and the worst Merge Danger among them, and merge it once its checks are green — a one-way door no spec or ADR settled → stop for me; delete the shipped lines of the spine and the build's merged branch, never the promotion PR's head; then watch the checks and deploys GitHub reports on production's new head until they finish — a red one → stop for me, the failure shown.
```

```
/goal EITHER released: every ⚡ ticket listed at the start merged into the integration branch with its tests shown green, or parked under 🧑 with its blocker named; the full suite's passing output on the integration branch shown; the build's code-review pass and its fixes shown; the second review's re-review of its fixes (or its clean first pass) found zero new CRITICAL findings, its ⚡ lines tagged review checked off in the spine or parked under 🧑 with their reason, every fix pushed; the PR's merge output shown and its branch deleted; the promotion PR into production merged — its URL and merge output shown (none needed when the PR's base is production); production's new head shown with its checks and deploys green, or none reported; the ⚡/🧑 sections of the spine (docs/plans/next-steps.md) shown after the last edit; implementer worktrees removed, the worktree list shown; OR stopped before production — red checks, a protection gate, or a one-way door no spec or ADR settled — the open PR's URL and what merged shown, the reason parked as a 🧑 line; OR released with a red production check or deploy — the failure shown, its 🧑 line filed; OR every ticket parked under 🧑, zero merges, the 🧑 section shown; OR stopped on a fork for me — options + a recommendation shown, its 🧑 line filed; or stop after 100 turns and show where it stands
```

**When you return:** the feature is live, and its PR on GitHub tells the story: **Summary**, **Evidence**, **Merge Danger**. The run stops short of production only for red checks, a protection gate, or a one-way door (a migration, a deletion, anything that reaches users or other systems) that no spec or ADR settled. A check that turns red after the release stops it too. Each lands as a 🧑 line for you and the maintainer; Broken (7) fixes forward.

Two honest limits. The review runs inside the build's session: its two reviewers start blank, but the agent that files their findings does not — the price of no stop between review and release. And a run that stopped early continues when you re-send its `/goal` after answering; in a new session, re-send both boxes (the build resumes from what has merged), or send 3c if only the release is left.

### 3a. Build one item 🚶
**When:** one Issue at a time — an urgent item, or a queue you steer by hand. The skills' native rhythm: it merges the item into the integration branch itself, and 3c on that PR releases it. Repeat in fresh sessions; the spine hands over between them. 📋 both:
```
/implement take the top ⚡ item in @docs/plans/next-steps.md — on its own branch per the git-flow ADR; code-review fixed point: the branch's base; open its PR without asking (body per the pr skill), merge it once green, close its Issue
```

```
/goal the item's PR URL, its merge output and its Issue-close output shown; its tests and the full suite's passing output shown; the ⚡ section of the spine (docs/plans/next-steps.md) shown after the check-off; OR the item parked under 🧑 with its blocker named, the 🧑 section shown; OR stopped on a fork for me — options + a recommendation shown, its 🧑 line filed; or stop after 15 turns and show where it stands
```

*(One specific item? Replace "the top ⚡ item" with its Issue number.)*

### 3b. Review alone 🚶
**When:** a PR deserves a fresh session's attack — a session reviewing its own code only confirms itself. `<N>` = the last part of the PR URL. *(Plugin route? Type `/mattpocock-skills:code-review` wherever a box says `/code-review`.)*

✏️ (replace `<N>` everywhere it appears) + 📋:
```
/code-review review PR #<N> — gh pr checkout <N>; the fixed point is its base branch on origin (gh pr view <N>); in both briefs hunt regressions and gaps; your sub-agents must not invoke code-review or spawn agents; file only CRITICAL findings — regressions, broken usability, long-term maintainability — as unchecked ⚡ lines tagged review #<N> in @docs/plans/next-steps.md (file:line, failure scenario); fix each test-first and push so #<N> holds every fix; then re-review the fixes only; a product-intent finding → 🧑 with the reason
```

```
/goal the re-review of the fixes (or a clean first pass) found zero new CRITICAL findings; every ⚡ line tagged review #<N> in the spine (docs/plans/next-steps.md) checked off with its regression test shown red then green where behaviour changed, else the suite shown green, or parked under 🧑 with its reason; every fix pushed and the PR head shown; the full suite's passing output shown; OR stopped on a fork for me — options + a recommendation shown, its 🧑 line filed; or stop after 20 turns and show where it stands
```

A big PR, or a pass that found a lot? Send it again in a fresh session until a pass files nothing new. Several PRs? One review each. **Next →** Ship (3c). Found a lot? Also Retro (10).

### 3c. Ship alone 🚶
**When:** a PR passed review (3b), a quick change (2a) is ready, or a one-item build (3a) waits for release. It merges the PR, then releases to production under the Run's rules (3). ✏️ (replace `<N>`) + 📋:
```
Ship PR #<N>: gh pr checkout <N>; verify green; integrate per the git-flow ADR — merge it into its base once green; if that base is not production, open or refresh the standing promotion PR into production (reuse one already open) listing every Issue it carries and the worst Merge Danger among them, and merge it once its checks are green — a one-way door no spec or ADR settled → stop for me; delete the shipped item's spine line and its merged branch, never the promotion PR's head; then watch the checks and deploys GitHub reports on production's new head until they finish — a red one → stop for me, the failure shown
```

```
/goal the PR's merge output shown and its branch deleted; the promotion PR into production merged — its URL and merge output shown (none needed when the PR's base is production); production's new head shown with its checks and deploys green, or none reported; the shipped item's line gone with the ⚡ section of the spine (docs/plans/next-steps.md) shown after the edit; OR stopped before production — red checks, a protection gate, or a one-way door no spec or ADR settled — the open PR's URL and what merged shown, the reason parked as a 🧑 line; OR released with a red production check or deploy — the failure shown, its 🧑 line filed; OR stopped on a fork for me — options + a recommendation shown, its 🧑 line filed; or stop after 15 turns and show where it stands
```

### 4. Map the fog 🧑 (name the destination), then 🚶 (chart), then explore 🧑
**When:** the idea is an epic — too big or too unknown for recipe 2's interview. The map lives on the tracker, so sessions can come and go.

✏️ Send, then answer its first questions — they only pin the **destination**, what "done" looks like for the whole epic — until it says the destination is set:
```
/wayfinder chart a map for the epic below — pin the destination with me in as few rounds as you can, then chart alone; forks become decision tickets, not stops; add a 🧑 line in @docs/plans/next-steps.md linking the map and naming the first frontier ticket (map tickets are explored with me, never ⚡). The epic:
<what you know, what you do not know, and the destination>
```

📋 Once the destination is set, send this and walk away:
```
/goal the map's URL and its decision tickets shown, any research tickets shown fired, and the 🧑 line linking the map shown in the spine (docs/plans/next-steps.md) after the edit; OR no fog — said so, no map made; or stop after 10 turns and show where it stands
```

The map is an Issue; its **decision tickets** are child Issues, one open question each; the **frontier** is the tickets ready now. To explore: new session, 📋 the line below, **stay** (no `/goal`). One ticket per session — the map's own rule:
```
/wayfinder work through the map linked under 🧑 in @docs/plans/next-steps.md with me
```

A region became clear? **Next →** recipe 2 like any idea; the interview starts from the map (`/to-spec #<map Issue>` collapses a fully cleared map straight into a spec).

### 5. Design detour — a test build answers one question 🚶→🧑
**When:** one design question blocks progress and only a working example can answer it. The build is a throwaway — it never ships, but stays on its own branch as evidence.

✏️ + 📋:
```
/prototype no Claude Artifacts; run it; write your recommended verdict as a numbered ADR in @docs/adr/ linking the pushed prototype branch and how I open it, plus a 🧑 line in @docs/plans/next-steps.md naming the ADR. The question:
<the decision it must settle and what evidence settles it>
```

```
/goal the prototype ran — its command and output, or the file to open, shown; the proposed ADR shown under docs/adr/ linking the prototype branch; its 🧑 line shown added to the spine (docs/plans/next-steps.md); OR stopped on a fork for me — options + a recommendation shown, its 🧑 line filed; or stop after 10 turns and show where it stands
```

*(A looks/UI question? Say so in the box — `/prototype` then takes its UI branch: several radically different variations of one screen, switchable from a floating bar — and judge with your own eyes.)*

**When you return:** the verdict is only *proposed*. A logic prototype is one HTML file — double-click it and press its buttons; a UI prototype starts with one command the ADR names. Then tell the agent to accept the ADR (status accepted, 🧑 line gone) or to delete it.

**Mid-interview (recipe 2)?** Park it with ✏️ `/handoff design detour: <the question>` — the agent writes a handoff file in your computer's temp folder and shows its path; copy it. Run this recipe in a new session. Then resume the interview in one more new session: ✏️ `Read the handoff file at <the path the old session showed> and continue the interview.`

### 6. Triage 🚶
**When:** bug reports or requests arrived from other people (never recipe 2's own output — those Issues are already agent-ready). Work lands in ⚡; judgment calls land in 🧑 for you.

✏️ + 📋:
```
/triage the batch below — act on your recommendations without waiting for direction, except close, priority and product-intent calls → 🧑 with the reason; mirror the outcome in @docs/plans/next-steps.md: each ready-for-agent Issue → one ⚡ line linking it. The batch:
<issue numbers, a label, "all new GitHub issues", or paste the raw reports>
```

```
/goal every issue in the batch dispositioned — a per-issue list (role + one-line reason) shown, and the ⚡/🧑 sections of the spine (docs/plans/next-steps.md) shown after the last edit with a line for each ready-for-agent or operator-call issue; OR a zero-issue batch — the query and its empty result shown; OR stopped on a fork for me — options + a recommendation shown, its 🧑 line filed; or stop after 10 turns and show where it stands
```

**Next →** Run (3) drains the ⚡ lines.

### 7. Broken 🚶
**When:** an error appears, a page fails, a test is red, behavior is wrong. Copy the **exact** error text first — it matters.

✏️ + 📋:
```
/diagnosing-bugs fix on its own branch per the git-flow ADR; no correct seam for the regression test → say so as a lesson line in the spine; open its PR without asking. The symptom:
<paste the exact error or failure output (screenshots are highly recommended) and where it bites>
```

```
/goal the root cause stated in one sentence; the regression test shown red then green (a perf symptom: the numbers before and after; intermittent: rerun with --repeat-each or equivalent), or the no-seam lesson line shown added to the spine (docs/plans/next-steps.md); the full suite's passing output and the PR URL shown; OR non-reproduction with the attempts logged and parked as a 🧑 line; OR stopped on a fork for me — options + a recommendation shown, its 🧑 line filed; or stop after 20 turns and show where it stands
```

*(Bug only on your machine or account? The agent cannot see it — stay and run what it asks; it may hand you a wizard script for the clicks.)*

**Next →** Review (3b), then Ship (3c). A painful or repeat bug? Retro (10) right after, in the same session.

### 8. Merge mess 🚶
**When:** a merge or rebase stopped half-way with conflicts and no session is on it (inside a running session: do nothing — the agent handles it there). No skill covers this since v1.3; the box carries the rules.

✏️ + 📋:
```
Finish the in-flight git operation: <merge or rebase, which branch into which, and any intent the code will not show>. Resolve each conflicted hunk per the merge-conflict rule in CODING_STANDARDS.md — unless the hunk is a product call: then stop for me; re-run the repo's checks; commit
```

```
/goal the operation completed — git status with no unmerged paths and git log -1 shown — and the repo's checks re-run green; OR completed with failures also shown failing on the target branch, named in a 🧑 line shown added to the spine (docs/plans/next-steps.md); OR stopped on a hunk that carries a product decision — both intents + a recommendation shown, its 🧑 line filed; or stop after 10 turns and show where it stands
```

### 9. Survey 🚶
**When:** spare agent time. Report only — it changes no code. The report is a web page you open later (it needs internet to render).

✏️ + 📋:
```
/improve-codebase-architecture show git status first, then survey <the whole repo, or one subsystem> — don't grill me, just the report; each candidate → one 🧑 idea line in @docs/plans/next-steps.md (what, why, entry file, strength badge, the report's file path) flagged "grill before building"
```

```
/goal every candidate shown as a 🧑 idea line with the report's file path, or a no-candidates verdict with the subsystems examined; git status shown before and after, differing only in the spine (docs/plans/next-steps.md); or stop after 10 turns and show where it stands
```

**Next →** an idea becomes work only through recipe 2. Never straight to Run.

### 10. Retro 🚶→🧑
**When:** a session struggled — a Run that stalled, a review that found a lot, a Broken that took all night. It proposes changes to the agent's **environment** (checks, pointers, the rulebook), never to the code; the maintainer picks. A smooth session has little to teach — skip it then. Best sent in the session that struggled; a new session reads the last session's log.

📋 both:
```
/retro show git status first; look back at the previous session for this repo in this machine's Claude Code session logs, unless the work happened here; trace every candidate to a moment in that session; file each as one 🧑 line flagged "maintainer decides" in @docs/plans/next-steps.md
```

```
/goal every candidate shown with its session moment and filed as a 🧑 line — the 🧑 section of the spine (docs/plans/next-steps.md) shown after the edit; git status shown before and after, differing only in the spine; OR a no-findings verdict naming the session read; or stop after 10 turns and show where it stands
```

**Next →** the maintainer picks. A pick becomes work through 2a (a check, a hook, a rulebook line) or 2 (anything bigger). Never applied straight from the retro.

## Steer a running session
- **Add an instruction:** just type it — a typed message outranks the loaded skills. If it changed what "done" means, restart the recipe fresh (or get a corrected `/goal` from the maintainer).
- **Confused by the last message?** `/wait-what` re-pitches it in plain words, with the context you were missing.
- **Answer a pause:** see "If the agent pauses".
- **Check the goal:** `/goal` alone shows where it stands; `/goal clear` stops it.
- **Wrong recipe, or the session grew long:** ✏️ `/handoff <what the next session must do>` — the agent writes a handoff file in your computer's temp folder and shows its path; copy it. Start the right recipe in a new session, or continue the saved work there with ✏️ `Read the handoff file at <the path the old session showed> and continue.`
- **Something feels wrong and no rule covers it?** Esc stops the agent mid-run; ask the maintainer. Nothing breaks while you wait.

## Agent reference
<details>
<summary>Spine template + git-flow ADR seed + standing block + CODING_STANDARDS.md template — recipe 1's agent reads these. You never copy them.</summary>

Spine template — `docs/plans/next-steps.md`:

```markdown
# Next Steps — <project>

Status board, one line per Issue (⚡ = tracker label `ready-for-agent`, 🧑 = `ready-for-human`); the detail lives on the tracker.

> **Fresh session?** <one line of world-state + the first thing to do>

## 🔧 Machine setup — do this FIRST
<real bootstrap commands + the verification gate: "before declaring done, run X">

## ⚡ Agent-ready queue
**Nothing queued.**

## 🧑 Human-in-the-loop
<operator-only items — an agent never drains these>

## Reference — consult when a task needs it
- **Lessons** — one line per trap, newest first:
- <other pointers a task needs: specs, maps, runbooks>
```

Git-flow ADR seed — `docs/adr/0001-git-flow.md`, in the ADR format the `domain-modeling` skill ships (a numbered file, a title, a few sentences; `status` frontmatter only while a decision is still proposed). Keep only the calls the repo's own docs leave unanswered:

```markdown
# Branch and merge policy

Fallback only: this repo's own docs and its merged-PR practice win wherever they speak. `main` is
production — protected, advanced only by merging the standing promotion PR. `dev` is the
long-lived integration branch: every feature or fix branch (`<type>/<slug>`) is cut from a fresh
`dev` and merges back by PR, squash commit, by the agent once green. A whole-spec build lands on one
integration branch (`feat/<spec-slug>`) with a draft PR into `dev` that waits for Review and Ship.
Promotion is one standing PR from `dev` into `main`, merge commit (so `main` keeps each item's
commit), opened or refreshed by Ship after each merge into `dev` and merged by the agent once its
checks are green, unless it carries a one-way door no spec or ADR settled: that one waits for the
operator. The one exception: an edit to `docs/plans/next-steps.md` alone commits straight to `dev`
and is pushed.
```

Standing block — added to CLAUDE.md (or AGENTS.md) by recipe 1; every session loads it, so no recipe box repeats these rules:

```markdown
## The work spine — `docs/plans/next-steps.md` (work) + `docs/adr/` (decisions)
- Read the spine first and run its 🔧 section before any work. ⚡ = agent-ready work (tracker label `ready-for-agent`); 🧑 = operator-only (`ready-for-human`). The tracker holds each Issue's detail; the spine mirrors it, one line per Issue.
- Keep the spine current as you work, never at the end: check off or delete what ships (git log is the record), add surfaced work as one-line ⚡ items linking their Issue or PR, record traps as one-line lessons under Reference. Keep it minimal; commit it per the git-flow ADR.
- A blocked item → park it under 🧑 with the blocker named and continue with the rest.
- A fork that is ADR-worthy (hard to reverse, surprising without context, a real trade-off) or a product-intent call → if it blocks the whole run, stop: options + a recommendation, filed as a 🧑 line; wait for the operator, never guess it. Otherwise park it under 🧑 with the reason and continue.
- Hard-to-reverse decisions are numbered ADRs in `docs/adr/` (format: the `domain-modeling` skill's ADR-FORMAT), never spine lines; read `docs/adr/` before re-opening a settled call. A decision awaiting the operator keeps `status: proposed` plus its 🧑 line.
- Pointers — git flow: `docs/adr/0001-git-flow.md` · review rules: `CODING_STANDARDS.md` · project words: `GLOSSARY.md`. Read them when the task needs them; never restate them.
- `main` is production: it moves only through the standing promotion PR, merged per the git-flow ADR; never bypass branch protection (no `--admin`), never force-push a shared branch. At most 12 subagents per run, 20 as the hard cap.
```

CODING_STANDARDS.md template — read by the `code-review` Standards axis and by `retro`; the repo's own docs win where they speak:

```markdown
# Coding standards

Read at review and by retro. The repo's own docs win wherever they speak; these rules fill the gaps.

## Git hygiene
- Branch and merge policy: `docs/adr/0001-git-flow.md`.
- Commit per green slice with an imperative message; no WIP noise — the branch history reads as the story of the item.
- A PR body follows the `pr` skill: Summary (the smallest visual that shows the change), Evidence (before/after), Merge Danger (one-way or two-way door, plus blast radius).
- Merge or rebase conflicts: trace each hunk's two sides to their primary sources (commit, PR, Issue), keep both intents where compatible, name the trade-off where not, re-run the checks — never resolve by `--ours`/`--theirs` or `--abort` blind.
- Merged branches are deleted; stale branches are debt — prune on sight, except the long-lived branches the git-flow ADR names and `prototype/*` branches, kept as evidence. Never rewrite `main`'s history.

## Tests
- A test exists to catch a REGRESSION: it locks an observable behavior at a seam, reads like a specification, and survives refactors. If internals can change and the test breaks anyway, it was testing implementation — rewrite it at the seam or delete it.
- Test at the HIGHEST seam that reaches the behavior, preferring existing seams — the interface is the test surface. New seams are agreed in the spec before code; the ideal number of new seams is one.
- Minimal suite: one test per behavior/decision. A shared helper's contract is tested once at its own seam, never re-driven per call site. Assert on the thing, never a proxy for it.
- Noise is a defect: no whole-tree snapshots, no mock-wiring or call-count assertions, no styling/copy checks — unless that exact detail IS a locked decision (then record it as an ADR and say so in the test name). Mocks only at system boundaries (external APIs, time, randomness), never around our own modules.
- Expected values come from an independent source (a known literal, the spec), never recomputed the way the code computes them. Browser/end-to-end tests come after the behavior works, never first.
- Every test earns its place by failing for exactly one reason someone cares about. Before cutting a test, read its name for the decision it locks.
- Intermittent ≠ rare: rerun (--repeat-each or equivalent) before declaring a bug disproved or a fix proven; wait out the product's own debounces instead of retrying lookups.
```

</details>
