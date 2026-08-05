# Claude Code Skill Playbook — SDLC around `next-steps.md`

*Rebuilt 2026-07-30 around the real workflow: a per-repo `docs/plans/next-steps.md` as the spine, a Day-0 bootstrap for fresh repos, a per-phase playbook of two-message fire-and-forget entries with HITL pause valves, Matt Pocock's pack as the process layer. Machine facts: Claude Code 2.1.220, skill stacking active (≤6, leading, consecutive), bare skill names resolve to the Matt/personal copies. Revised 2026-08-01: prompts defer to each target repo's established git hygiene — DEC-GIT-FLOW demoted to a recorded fallback for flow calls the repo leaves unanswered.*

## 1. The spine: `docs/plans/next-steps.md`
One file per repo — **single source of truth for work state + the cross-session handoff surface.** Sections with jobs:
- **🔧 Machine setup** — env bootstrap + the traps that cost an hour. First thing a fresh session runs.
- **⚡ Agent-ready queue** — the *only* place agent-executable work waits. An item = one line: what + link to its spec/issue/PR. Standing context and explicit **"Not a to-do"** guards live here too — they stop re-litigation and are as valuable as the queue itself.
- **🧑 HITL** — operator-only items. An agent never drains these.
- **Reference** — `DEC-*` do-not-reopen decision records (inline ADRs), guardrails, environment facts.

Rules that keep it working: **minimal** (shipped work lives in `git log`, not here); **index, not store** (link the spec/PR, never restate it — prose about code drifts); auto-loaded rules never restated.

### Make the harness maintain it (once per repo, in `CLAUDE.md`)

Stop re-telling every session "keep it up to date" — make it a standing rule the harness auto-loads:

```markdown
## docs/plans/next-steps.md — the work spine
- Read it before starting any work. The ⚡ queue is the only source of agent-ready work; 🧑 items are operator-only.
- Keep it current AS you work, not at the end: check off / delete what ships (git log is the record), add newly surfaced work as one-line ⚡ items linking to their issue/PR/spec, record new traps as lessons and hard decisions as DEC-* lines.
- Keep it minimal: pointers over prose; never restate auto-loaded rules or shipped code.
```

Every session then **starts by reading the spine and ends having left it true** — which is what makes the Build entry in §4 work.

## 2. Day 0 — bootstrap a fresh repo (pack never installed)
**Machine first** (terminal, once per machine — source verified from `~/.agents/.skill-lock.json`):

```bash
npx skills add mattpocock/skills -g -y   # → ~/.agents/skills, junctioned into ~/.claude/skills
npx skills update                        # later, to pull pack updates
```

Start a **new** session afterwards — the skill registry is built at session start.
**The setup prompt** — one message in a fresh session at the new repo's root:
```
/setup-matt-pocock-skills configure GitHub as the tracker, then scaffold the repo spine:
1. Create docs/plans/next-steps.md from the Day-0 spine template in my playbook — read it at C:\Users\leekh\Documents\Repos\Personal\Life-Engineering\AI\Claude Code Skill Playbook.md — seeding 🔧 with this repo's real bootstrap commands. Git flow: read what this repo already establishes — CONTRIBUTING/docs, branch protection, merged-PR history — follow it, and record only the calls it leaves unanswered as the DEC-GIT-FLOW line.
2. Add the three CLAUDE.md standing blocks from that playbook (work spine + git hygiene + testing discipline).
3. Do all of it on a chore/bootstrap branch and open the PR — nothing lands on the default branch directly, including this.
4. Hit a DEC-worthy fork (hard to reverse / product intent)? Pause: options + your recommendation, wait for me — don't guess.
```

**Day-0 spine template** (what step 1 creates):
```markdown
# Next Steps — <project>

Single source of truth + cross-session handoff. **🔧 setup**, then **⚡ queue** + **🧑 HITL**
are the only actionable sections; **Reference** is consult-on-demand. Shipped work lives in
`git log`, not here.

> **Fresh session?** <one line of world-state + the first thing to do>

## 🔧 Machine setup — do this FIRST
<real bootstrap commands + the verification gate: "before declaring done, run X">

## ⚡ Agent-ready queue
**Nothing queued.**

## 🧑 Human-in-the-loop
<operator-only items — an agent never drains these>

## Reference — consult when a task needs it
- **DEC-GIT-FLOW (fallback — the repo's own docs and merged-PR practice win wherever they speak)** — default branch <main>; integration branch <main/dev>; feature branches `<type>/<slug>` off integration, merged by PR only; promotion policy <merge commit / squash>; holds only the calls the repo leaves unanswered.
- <every hard-to-reverse decision gets a DEC-* line here, marked do-not-reopen>
```

**Git-hygiene block for `CLAUDE.md`** (the second standing block — pairs with the spine block in §1):
```markdown
## Git hygiene
- Branch naming, integration branch, and promotion policy come from the repo, not this block — written rules first (CONTRIBUTING/docs, DEC-* lines in the spine), merged-PR practice where they're silent; a call nothing answers → settle it once with the operator, record it as a DEC-* line.
- Nothing lands on the default/integration branch directly — one ⚡ item = one feature branch off the freshest integration branch (fetch first), merged back by PR.
- Commit per green slice with an imperative message; no WIP noise — the branch history should read as the story of the item.
- Merge conflicts (merge OR rebase) → the /resolving-merge-conflicts skill: primary sources per hunk, both intents preserved, checks re-run — never hand-mash a hunk, never --abort and retry blind.
- Finished branch → verify green, open/refresh its PR per the repo's flow; integration happens at Ship, after Review — delete the branch only once merged. Stale branches are debt — prune on sight.
- Never force-push a shared branch; never rewrite main's history.
```

**Testing-discipline block for `CLAUDE.md`** (the third standing block — a test suite's one purpose is catching regressions):
```markdown
## Testing discipline
- A test exists to catch a REGRESSION: it locks an observable behavior at a seam, reads like a specification, and survives refactors. If internals can change and the test breaks anyway, it was testing implementation — rewrite it at the seam or delete it.
- Test at the HIGHEST seam that reaches the behavior, preferring existing seams — the interface is the test surface. New seams are proposed in the spec and agreed before code; the ideal number of new seams is one.
- Minimal suite: one test per behavior/decision. A shared helper's contract is tested once at its own seam, never re-driven per call site. Assert on the thing, never a proxy for it.
- Noise is a defect: no whole-tree snapshots, no mock-wiring or call-count assertions, no styling/copy checks — unless that exact detail IS a locked decision (then record it as a DEC-* line and say so in the test name).
- Every test earns its place by failing for exactly one reason someone cares about. Before cutting a test, read its name/header for the decision it locks.
- Intermittent ≠ rare: rerun (--repeat-each or equivalent) before declaring a bug disproved or a fix proven; wait out the product's own debounces instead of retrying lookups.
```
The pack skills enforce all three blocks at the seams: `/to-spec` pins the test seams before any code, `/tdd` rides every build/fix stack (its tests.md + mocking.md carry the anti-patterns), `/implement` commits per green slice on the current branch, `/superpowers:finishing-a-development-branch` runs the merge/PR/cleanup decision, `/resolving-merge-conflicts` owns conflicts, and `/code-review since <integration branch>`'s Standards axis checks conformance back at the branch point.

## 3. Invocation rules (every prompt below obeys these)
1. **Hidden skills** (most of Matt's pack: `implement`, `to-spec`, `to-tickets`, `wayfinder`, `triage`, `handoff`, `grill-with-docs`, `grill-me`, `improve-codebase-architecture`) never appear in the model's registry. The deterministic trigger is typing them at the **start of the message**.
2. **Stacking**: consecutive leading commands — `/skill-a /skill-b <args>`. Up to 6; the trailing text becomes ONE shared `$ARGUMENTS` for all of them; the first non-skill token ends the stack.
3. **⚠ Built-in commands and skills never mix in one message.** `/goal` (built-in, v2.1.139+) is a command, not a skill: nothing stacks with it, and skill names written *inside* a goal condition are data, never invocations — hidden skills stay invisible to the goal-working model. The pattern is **two messages**: load skills/context first, then `/goal <condition>` — goal turns inherit everything already in the session. (An unknown leading token — a typo'd command — still de-stacks everything silently.)
4. **Driver + passengers**: exactly one process skill per prompt (`implement`, `grilling`, `wayfinder`, `diagnosing-bugs`, `triage`, `prototype`, `code-review`); passengers are reference layers (`tdd`, `codebase-design`, `domain-modeling`, `frontend-design`, platform packs). Never two drivers — `/code-review /implement` is two session shapes fighting over one window. Sole carve-out: the §4 Epic-fog map stack `/wayfinder /grilling` — grilling rides as the map's interrogation layer.
5. **One phase, one context**: review in its own session, each implement fresh, grill → spec → tickets unbroken. Near the ~120k smart zone: update the spine, `/handoff` if mid-phase. (The §4 Build drain and small-PR Review loop consciously trade the fresh-context split for walk-away autonomy — both self-pause on DEC-worthy forks; big PRs escalate to B1–B3.)

## 4. Phase playbook — skills first, `/goal` last, walk away
Each entry is a short **sequence of messages you send up front** — usually two: **M1** — leading skill stack + task, your input in `<angle brackets>`; **M2** — `/goal` pinning the finish line, always last, always its own message (a few entries put an extra skill message or two between them). Send them all immediately, one after another, **without waiting for anything to finish**: Claude Code queues them, each slash command still expands (rule 3), the goal turn inherits everything sent before it — and that queue **is** fire-and-forget. Three laws for `/goal` conditions:
1. **Displayed evidence only** — the transcript-only Haiku evaluator can check "⚡ section shown after the last edit", "test shown red then green", "PR URL pasted"; it cannot check "all issues resolved". The ⚡ queue is the scoreboard. (`/goal` is the until-condition looper; `/loop` is the other one — interval/recurring runs.)
2. **Skill names in a condition are data**, never invocations — load everything in M1. And a goal loops ONE accumulating window: big adversarial work escalates to the fresh-context variants instead.
3. **Pre-answer the answerable, pause on the strategic** — tactical policy comes from the repo (integration per its established git hygiene: written rules — repo docs + DEC-* lines — first, merged-PR practice where they're silent, a call nothing answers is itself DEC-worthy; a merely-blocked item → 🧑 note, continue), but a **DEC-worthy fork** (hard to reverse, product intent, a new seam) makes the run **pause**: options + a recommendation shown, the fork filed as a 🧑 line, then it waits for you. (One exception: a new seam mid-Requirements never pauses — `/to-spec` files it as an OPEN marker plus a 🧑 line instead.) Every 🚶 goal below carries the pause as an OR-arm — a paused run has *met* its goal; answer with your call (it becomes a DEC-* line, the fork clears), then re-arm the same `/goal`.

M1 may `@`-attach the spine; conditions name the plain path (a condition is data end to end). **Long input?** Everything after the leading slash stack is one argument blob — newlines, sentences, paragraphs included (the §2 setup prompt relies on this) — so every fat `<slot>` sits **last** in its template: fixed instructions first, a short label ("The idea:"), then paste your input and send. Shift+Enter for manual newlines; the slash stack always stays the message's first line. Badges: 🚶 fire and walk (it pauses itself on DEC-worthy forks); 🧑 stay, it needs your input; 🚶→🧑 fires, but the verdict on return is yours.

### Bootstrap 🚶 — once per repo
Run the §2 recipe verbatim (pack once per machine → fresh session → setup prompt), then send this as the very next message — don't wait for the setup to finish:
```
/goal the chore/bootstrap PR is open — URL shown in this session — with docs/plans/next-steps.md (🔧 seeded, DEC-GIT-FLOW recorded) and the three CLAUDE.md standing blocks in its diff; OR paused on a DEC-worthy fork — options and a recommendation shown, still unanswered by me
```

### Requirements → spec → tickets — it interviews you 🧑, then finishes alone 🚶 (one session)
Open a fresh session with:
```
/grill-with-docs /codebase-design grill me on the idea below — record hard calls as DEC-* lines in @docs/plans/next-steps.md as they settle. The idea:
<what, why, constraints you already know — lines, sentences, paragraphs all fine>
```
No docs in the repo for it to read? Use `/grill-me <idea>` instead.

**What happens:** the session interrogates your idea and you answer, question by question, until every hard call is settled. Stay at the keyboard, and **don't set a `/goal` yet**. Need a fact checked mid-interview? Send `/research <question>` as its own message anytime; it runs in the background while the questions continue.

**When nothing is left to decide**, send these three messages — in this order — and walk away:
```
/to-spec spec everything agreed above — pin the test seams: existing seams preferred, at most one new; a seam you had to invent gets an OPEN marker in the spec plus a 🧑 line, not a question to me
```
```
/to-tickets cut the spec into agent-sized tickets and seed each as a one-line ⚡ item linking its ticket in @docs/plans/next-steps.md; a ticket depending on an OPEN seam or any 🧑-parked question → 🧑 with it named, never ⚡, until I ratify it as a DEC-* line
```
```
/goal the spec file exists and is linked from @docs/plans/next-steps.md, at least one ticket created with every ticket's ID or URL shown in this session, and the ⚡/🧑 sections shown after the last edit holding one line per ticket (OPEN-seam and open-question tickets under 🧑); OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```
Spine: DEC-* lines from grill calls; spec linked; ⚡ gains a line per ticket; research files linked from the item that needed them; open questions and their dependent tickets → 🧑.

### Epic too foggy to spec — map it 🚶, then explore it region by region 🧑
The epic is too big or unknown to cut into tickets yet. First, have a session chart a map of it alone — send both messages, walk away:
```
/wayfinder chart a map for the epic below — chart from the codebase and docs, file unknowns in the map as open questions instead of asking me, link the map from @docs/plans/next-steps.md and add a 🧑 line naming the first frontier (frontiers are explored with the operator, never ⚡); a DEC-worthy fork → pause: options + a recommendation, filed as a 🧑 line, wait for me. The epic:
<the fog, what's known, the destination — as many lines as you need>
```
```
/goal the map file exists and is linked from @docs/plans/next-steps.md with a 🧑 line naming the first frontier — the writes shown in this session; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```
The map splits the epic into regions and marks what's still unknown; a **frontier** is simply the next unexplored region. Each time you want to push the map forward, open a fresh session, type the line below, and stay — it walks that region with you, question by question. No `/goal` in these sessions:
```
/wayfinder /grilling /domain-modeling work the map with me — the next frontier is named under 🧑 in docs/plans/next-steps.md
```
(the one sanctioned two-driver stack — rule 4). When a region becomes clear enough to build, take it through the Requirements entry above like any other idea. Spine: map linked; next frontier named under 🧑.

### Design detour 🚶→🧑 — a prototype answers a question
```
/prototype build a throwaway that settles the design question below — run it, and write the verdict as a DEC-* line marked "proposed — operator confirms" in docs/plans/next-steps.md, linking the prototype dir and its run command; a DEC-worthy fork outside the question → pause: options + a recommendation, filed as a 🧑 line, wait for me. The question:
<the decision it must settle and what evidence settles it — as many lines as you need>
```
```
/goal the prototype ran — command and output (or screenshot) shown in this session — and the proposed DEC-* line shown added to docs/plans/next-steps.md; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```
The goal stops at *ran + proposed verdict*, never "question answered" — when you return: run it, look at it, then confirm or strike the proposed DEC-*. UI question? Stack the design layer (`/prototype /frontend-design <question>`) and judge the look with your own eyes. **If the question surfaced mid-grill:** park the grill first by typing `/handoff design detour: <question>` in that session, run the prototype pair in a fresh session, then open another fresh session and type `/handoff` — it resumes the grill from the parked file. Spine: proposed DEC-* or spec note; prototype linked, never restated.

### Build 🚶 — drain the ⚡ queue
```
/tdd /implement drain the ⚡ queue in @docs/plans/next-steps.md top-down — do 🔧 first; one branch per item following this repo's established git hygiene; a blocked item → 🧑 with the blocker named, then continue; a DEC-worthy fork (hard to reverse / product intent / new seam) → pause: options + a recommendation, filed as a 🧑 line, wait for me; keep the spine current as you go
```
```
/goal every ⚡ item present at session start in @docs/plans/next-steps.md is either checked off or parked under 🧑 with its blocker named — each checked-off item's tests shown green and its PR URL shown, a full-suite pass shown in this session, and the ⚡ section shown after the final edit holding no unchecked items besides those surfaced during the drain; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```
A checked ⚡ item = built, PR open, awaiting Review/Ship — Ship deletes the line once merged (git log is the record). The drain consciously trades rule 5's each-implement-fresh for walk-away autonomy — near the ~120k zone, update the spine and `/handoff`. Variants: name the item (`… the #338 harness defect …`); repo on a platform with its own skill? stack it (`/tdd /implement /supabase:supabase …`); independent items in parallel → a worktree each (`/superpowers:using-git-worktrees`). Tight scope — ***one*** item per session, the spine update at the end IS the handoff to the next:
```
/tdd /implement take the top ⚡ item in @docs/plans/next-steps.md — do 🔧 first; work on its own branch per this repo's established git hygiene — written rules (CONTRIBUTING/CLAUDE.md/DEC-* lines), else merged-PR practice — its PR opened without asking (integration stays with Ship, after Review); blocked → park it under 🧑 with the blocker named; a DEC-worthy fork → pause: options + a recommendation, filed as a 🧑 line, wait for me; keep the spine current as you go
```
```
/goal the item this session took is checked off in docs/plans/next-steps.md — its tests shown green, full suite passing shown, its PR URL shown, ⚡ section shown after the check-off; OR the item parked under 🧑 with its blocker named — the 🧑 section shown; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```
Spine: drains ⚡; traps → lessons; surfaced work → new ⚡ one-liners.

### Review 🚶 — adversarial loop on a PR
```
/tdd /code-review perform a DEEP adversarial review loop on PR <N>. Every finding → unchecked ⚡ item in docs/plans/next-steps.md (file:line, failure scenario, severity); fix each test-first and push after each green fix — the PR must hold every fix; re-review; repeat; a product-intent finding → 🧑 with the reason, never decided solo; a DEC-worthy fork → pause: options + a recommendation, filed as a 🧑 line, wait for me
```
```
/goal the latest /code-review pass in this session reported zero new findings — a clean first pass counts — every review item filed in the ⚡ queue of docs/plans/next-steps.md checked off with its regression test shown red then green or parked under 🧑 with its reason, every fix pushed with the updated PR head shown, and the full suite's passing output shown in this session; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me
```
Right-sized for a small-to-medium PR. **Big PR — the loop's adversarial edge decays in one accumulating window; run three fresh sessions instead, the spine carrying findings between them:**
- **B1 review** (fresh session — `gh pr checkout <N>` first): `/code-review since the PR's base branch on origin — resolve it with gh pr view <N>, never assume — adversarial pass: hunt bugs, gaps, regressions. REPORT ONLY: every finding → unchecked ⚡ item in docs/plans/next-steps.md (file:line, failure scenario, severity); a product-intent finding → 🧑 with the reason, never ⚡; then stop. Fix nothing.` Deeper GitHub-PR panel: `/pr-review-toolkit:review-pr <N>` (silent-failure hunter, test-coverage analyst, type-design), same contract.
- **B2 fix** (fresh session): `/tdd /implement drain the review findings in the ⚡ queue of @docs/plans/next-steps.md top-down — regression test first, check each off as it goes green, push after each green fix; a finding needing a product call or with no testable seam → park under 🧑 with the reason; a DEC-worthy fork → pause: options + a recommendation, filed as a 🧑 line, wait for me` — then, as its own second message: `/goal every review finding in the ⚡ queue of docs/plans/next-steps.md checked off with its regression test shown red then green or parked under 🧑 with its reason, every fix pushed with the updated PR head shown, a full-suite pass shown; OR paused on a DEC-worthy fork — options and a recommendation shown, the fork filed as a 🧑 line and still unanswered by me`
- **B3 refute** (fresh session): `/code-review since the PR's base branch on origin (gh pr view <N> resolves it) — try to REFUTE the checked-off fixes in @docs/plans/next-steps.md and hunt fresh regressions; survivors go back into ⚡ unchecked.`
Repeat B2↔B3 until a pass adds nothing — **termination is a property of the file, never one session's say-so**. Several open PRs: one loop each, worktrees if truly parallel. Spine: findings in/out of ⚡.

### Ship 🚶→🧑
```
/superpowers:finishing-a-development-branch verify green, integrate per this repo's established git hygiene, else merged-PR practice, and a flow call answered nowhere is a DEC-worthy fork — delete the merged branch, delete the shipped item's line from the spine (git log is the record); a DEC-worthy fork → pause: options + a recommendation, filed as a 🧑 line, wait for me
```
```
/goal the branch integrated per the repo's established git hygiene — merge/PR result shown in this session — the merged branch deleted, the shipped item's line deleted with the ⚡ section of docs/plans/next-steps.md shown after the edit, and any production promotion recorded as a 🧑 line, not performed; OR nothing integrated — verification red or the merge gated on me by the repo's flow (protected branch / required review) — the state shown (failing output or the open PR's URL) and the next step parked as a 🧑 line; OR paused on a DEC-worthy fork — options and a recommendation shown, filed as a 🧑 line and still unanswered by me
```
The repo's own hygiene is what turns this interactive skill into a walk-away — written rules and merged-PR practice pre-answer "how do we integrate", the DEC-GIT-FLOW line holding only what they don't; a repo that answers nowhere pauses as a fork, settled once, never re-asked. Repo deploys: queue `/vercel:deploy` (preview — paste the URL) or `/wrangler …` between M1 and the goal; **prod promotion stays 🧑 — you run it**. Spine: shipped line deleted (git log is the record); promotions → 🧑.

### Incoming raw issues 🚶 — triage
```
/triage triage the batch below — raw issues I didn't write only, never /to-tickets output; write an agent-ready brief per issue landing as one ⚡ line linking its issue in @docs/plans/next-steps.md; close/priority/product-intent calls → 🧑 with the reason, never decided solo; a fork blocking the whole batch → pause: options + a recommendation, filed as a 🧑 line, wait for me. The batch:
<issue numbers, a label, "all new GitHub issues", or paste the raw reports — as many lines as you need>
```
```
/goal every issue in the batch dispositioned — a per-issue list (⚡ or 🧑 + one-line reason) shown in this session and the ⚡/🧑 sections of docs/plans/next-steps.md shown after the last edit carrying one line per issue with its link; OR a zero-issue batch — the batch query and its empty result shown, the spine left untouched; OR paused on a fork blocking the batch — options and a recommendation shown, filed as a 🧑 line and still unanswered by me
```
The per-issue list makes silent drops fail the condition. Spine: briefs → ⚡ pointers; judgment calls → 🧑.

### Broken / flaky 🚶
```
/diagnosing-bugs /tdd diagnose the symptom below — fix on its own branch per this repo's established git hygiene; a DEC-worthy fix → pause: options + a recommendation, filed as a 🧑 line, wait for me. The symptom:
<paste the exact error/failure output and where it bites — as many lines as you need>
```
```
/goal EITHER the root cause stated in one sentence, a regression test shown failing before and passing after the fix — for a perf symptom, the measured numbers shown before and after — rerun (--repeat-each or equivalent) if intermittent, the full suite's passing output shown, the fix's PR URL shown, and the post-mortem lesson line shown added to docs/plans/next-steps.md; OR paused — non-reproduction with the attempts logged, or a DEC-worthy fix laid out with options and a recommendation — filed as a 🧑 item and still unanswered by me
```
A bug that only fires in an environment the agent can't reach makes *you* the repro hardware — stay 🧑. Spine: lesson; a "no good seam" finding → 🧑 architecture idea.

### Mid-merge mess 🚶
```
/resolving-merge-conflicts <what's mid-flight — merge or rebase, which branch into which, any intent the hunks won't show>
```
```
/goal EITHER the merge/rebase concluded — git status shown with no unmerged paths and the repo's checks re-run green in this session; OR concluded with only pre-existing failures — git status shown with no unmerged paths and the failing checks named in a 🧑 line shown added to docs/plans/next-steps.md; OR paused on a hunk carrying a product decision — the operation left un-mashed, both intents laid out with a recommendation, a 🧑 line naming them shown added to docs/plans/next-steps.md, still unanswered by me
```
(Conflicts inside a running Build/Review session need nothing — the git-hygiene block routes them here automatically.)

### Spare cycles 🚶 — architecture survey
```
/improve-codebase-architecture /codebase-design survey <scope — the repo, or one subsystem> for the highest-leverage structural improvements — show git status before touching anything; REPORT ONLY: each pick lands as one 🧑 idea line (what, why, entry file) flagged "grill before building" in @docs/plans/next-steps.md — ideas are operator work, never ⚡; change no source code
```
```
/goal every pick shown as a 🧑 idea line after the last edit — or a no-picks verdict shown with the subsystems examined listed — and closing git status shown identical to the opening one except docs/plans/next-steps.md; OR paused on a DEC-worthy fork — options and a recommendation shown, filed as a 🧑 line and still unanswered by me
```
The status-delta clause makes REPORT ONLY enforceable rather than polite. Spine: picks → 🧑 ideas that enter through Requirements — never ⚡, never straight to Build.

### Steering a running session 🧑 — rule, not a phase
- **Nudge** (same session shape): just type it — typed messages outrank loaded skills; a queued `/research <question>` expands and fires properly mid-run. Steer changed what "done" means? Re-arm: `/goal <corrected condition>`.
- **Pause** (the run asks *you*): every 🚶 entry above stops on a DEC-worthy fork — options + a recommendation shown, the fork filed under 🧑. Answer with your call + "record it as a DEC-* line and clear the fork", then re-arm the same `/goal` — its pause arm requires the fork *still unanswered*, so a re-armed goal can't free-ride on the old pause.
- **Shape change** (session should become a different phase): don't fight momentum — `/handoff <what the next session is for>`, open fresh at the right entry above. If the steer changed the work itself, update the spine first.

## 5. Notes
- `/handoff` bridges a **conversation** (temp file, mid-phase); the spine bridges **work** (repo file, between items). Session minutiae never go into the spine.
- Bare `/tdd`, `/code-review`, `/frontend-design`, `/research`, `/prototype` = Matt's copies; plugin twins need the colon form. `/compact` only at phase boundaries.
- From superpowers keep four: `using-git-worktrees`, `finishing-a-development-branch`, `dispatching-parallel-agents`, `verification-before-completion`. The rest duplicates Matt's flow — prefer the typed commands.
