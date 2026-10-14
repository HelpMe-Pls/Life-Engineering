> [!important] A friendly reminder
> As long as you're still getting paid each month + have access to AI & your business is still being built, you're still winning. EVERYTHING ELSE is noise.

- /goal /wayfinder read @docs/plans/next-steps.md to /implement its instructions with /codebase-design and /tdd to close-out the `Agent-ready queue` by opening a corresponding PR for each task and fold them all into `dev`
- /goal perform a DEEP adversarial code review loop by utilizing the /code-review skill on the open PR (#404) and self-iterate with /tdd to
  /implement your fixes until ALL issues/gaps/regressions are FULLY resolved. You're granted FULL ACCESS to the producer's repo (`altai-hubspot-sync` under the same parent as this repo) to fact-check and verify your work as you go. It is CRITICAL to keep the ENTIRE test suite in BOTH repos MINIMAL and OPTIMIZED based on the standards of /codebase-design
# Prompt
- Read @A03.pdf and watch this video:https://www.youtube.com/watch?v=VmaA2p1Mg9E for your context before we start the next challenge. Tell me when you're ready.
- Transcribe the LATEST video then add its summary and tickets accordingly.
- You're allowed to gratuitously write/check/access...
- /wait-what surface the HITL actions from this run so I can make the decision
- Feel free to fan out as many workflows/subagents as needed to get to the bottom of this
- It is CRITICAL that you keep the @docs/plans/next-steps.md file MINIMAL and up-to-date and feel free to surface any concerns that require HITL as you go
- /compact you're closing open issues
- An ABSOLUTE HARD rule for this session: deploy NO MORE THAN 5 subagents for a workflow, if you need one
- Keep it up, you're FAR from done. Feel free to resume/respawn/fan out your in-flight workflows/subagents/scripts as needed. Don't forget that the ENTIRE test suite in this repo MUST stays MINIMAL and OPTIMIZED based on the standards of /codebase-design, and the @docs/plans/next-steps.md spine is CURRENT and kept to its ABSOLUTE MINIMUM.
### `/long-vol-consultant`
On a normal Sunday:
```
/long-vol-consultant

Run this Sunday's read and keep the file current as we go. Walk the steps with me — load the contract, check the governor, resolve every signal against the runbook firewall tables, tell me whether money or evidence moved, hold me inside the invariants, and call out the green-lumber trap if my notes drift into analysis. As I give you each step's input, write it straight into Weekly Tasks.md — tick the boxes, append this week's scoreboard row, adjust next week's blocks, update my notes accordingly. Write what I dictate; ask only if a target's ambiguous. Leave the three runbooks untouched. End with the paste-back block.
```

When shit hits the fan:
```
/long-vol-consultant I'm tempted to pour next week into the cert idea because buyers keep asking — pressure-test that against the firewall before we touch the schedule, and if it holds, write the change in.
```
# Fix Claude update
```
bun remove -g @anthropic-ai/claude-code

Remove-Item -Recurse -Force C:\Users\leekh\.bun\install\global\node_modules\@anthropic-ai\claude-code*

Remove-Item C:\Users\leekh\.bun\bin\claude.exe -ErrorAction Ignore

bun add -g @anthropic-ai/claude-code

claude -v
```
# After sprint review
## Step 1
```
Set up everything a fully unattended Claude Code session needs to close out the newest sprint's tickets, then give me that session's exact execution prompt. Implement nothing in this session and change nothing in this repository: you read, verify, fix the machine, create what is missing outside this repository, write the execution prompt, and stop. You may ask me one round of questions, only about what the sprint page and the repository cannot settle.

Start as docs/plans/next-steps.md says, three separate commands: git fetch, then git rev-parse --abbrev-ref HEAD, then git log --oneline origin/main..origin/dev; be on dev and fast-forwarded to origin/dev before reading on. Then read, in this order: the spine whole; the newest sprint page, which is the file Sprint Tickets [Y26 Sprint NN].html with the highest NN in C:\Users\leekh\Documents\Edge8\Tickets, parsed with jsdom from website\node_modules and never opened in a browser (a card is an article.ticket, its number is its span.num, its title its h2, its status chip the span.status whose data-card is an internal id and not the card number, its steps the li elements under Acceptance steps with the owner in span.who, and the section Waiting outside the sprint lists what is parked); every GitHub issue, spec section, plan page, scope and meeting summary the cards cite (gh is always env -u GH_TOKEN gh ... --repo EO-Vietnam/global-hubspot); docs/engineering/recorded-decisions.md and docs/engineering/standing-traps.md; and docs/agents/playbook.md.

Classify every card. In the execution session: a card assigned to Khôi whose steps are code, tests, migrations, docs or pages in this repository, work in another EO-Vietnam repository, or a document in C:\Users\leekh\Documents\Edge8\Scopes. A human-only step inside such a card (SQL on production, a message to a person, a click in HubSpot or Eventbrite, a sandbox run that needs a credential) stays in the card as a handover line and never excludes it. Out: a card assigned to anyone else, a card whose every step is human-only, and a WAITING card unless I say it is in. Order: the page's order and the blocking edges the cards state, the connector ahead of the chapter page redesign while DEC-CONNECTOR-CODE-COMPLETE stands, two cards in one PR when the second cannot exist without the first, document cards last. For each card in, record its branch name, its pointers (issue, spec sections, plan or scope pages, files), its acceptance steps verbatim, the command that proves each step, and the evidence the execution session must show. For a document card, find every source its steps name and record the path, or the HubSpot read that gives it (check that the HubSpot MCP tools are available to you; they read, never write; when they are missing, the HubSpot facts become a pre-flight line); a scope document follows the structure, sections and styles of C:\Users\leekh\Documents\Edge8\Scopes\Scope [Member renewal].html. A source you cannot find is a question for me, never a guess.

Then ask me one round, numbered, each question with your recommended answer: which WAITING cards are in, any card you could not classify, any source you could not find. Nothing else. When there is nothing to ask, say so and continue.

Verify and fix the machine yourself, never asking, in this order, and report each check as pass, fixed or failed with its command: git config core.hooksPath is .githooks in this clone; env -u GH_TOKEN gh auth status shows an active account that sees EO-Vietnam (env -u GH_TOKEN gh auth switch --user Kh0iLe when it does not); Node is the version in website\.nvmrc, run as fnm exec --using=<that version> -- npm.cmd --prefix <absolute website path> (fnm install it when fnm list lacks it), and npm.cmd ci when node_modules is older than package-lock.json; Docker Desktop is running (when docker info fails, Start-Process the exe at C:\Program Files\Docker\Docker\Docker Desktop.exe through PowerShell, then wait with an until loop on docker info, run in the background, never a sleep chained to a command); the local Supabase stack is up and reset through the website's pinned binary (website\node_modules\.bin\supabase.cmd start --workdir <absolute website path>, then db reset, then status -o env kept in a scratchpad file whose name does not end in .env), never npx supabase, which installs a newer CLI and moves the images; Playwright's pinned Chromium is installed; nothing listens on port 3100; .next\types and .next\dev\types are deleted. A failed check you cannot fix becomes a pre-flight line for me, with the command.

Create what the cards need outside this repository. A card that builds in a repository that does not exist yet: create it private with env -u GH_TOKEN gh repo create EO-Vietnam/<name> --private, clone it to C:\Users\leekh\Documents\Repos\Edge8\<name>, and give it only the skeleton no card covers, modelled on C:\Users\leekh\Documents\Repos\Edge8\altai-hubspot-sync: a README with the purpose and the spec's path, package.json with TypeScript, vitest and tsx on the same Node version, tsconfig, .gitignore, a CLAUDE.md that points at the spec and states its rules (the boundary of spec (a); no credential in a log, a fixture or a commit; the runner's add-mask on every token before anything else; writes only to the tables the spec names), and a GitHub Actions workflow on workflow_dispatch only, its cron line written but commented out, because the schedule stays off until a dispatched run has been timed. Push that as the first commit on main. The Eventbrite to OneEO connector's repository is EO-Vietnam/event-sync; the spec and the spine still say eventbrite-1el-sync, so the execution prompt tells the session to correct both in its docs PR. When the creation is refused, hand me the exact command as a pre-flight line to run with the ! prefix. List by name only the secrets the repository will need, as a pre-flight line; never ask me for a value and never read one. The 5 Oct self-check replies in C:\tmp\eo-connector-check are the connector's test fixtures; say so in the execution prompt, with the rule that a fixture is scrubbed of any credential before it is committed.

Write the execution prompt as two messages and save both to C:\Users\leekh\Documents\Edge8\Tickets\Sprint Tickets [Y26 Sprint NN] AFK prompt.md. Message 1 starts with the words /tdd /implement and holds, in this order: the scope (each card in, in order, with its branch, pointers, acceptance steps and proof commands); the session start, spelled out in full (the spine's first commands; Node through fnm exec; Docker Desktop started through PowerShell when docker info fails, with the until loop; the stack up and reset through the pinned binary; the local keys from status -o env); the standing rules below, word for word; and the handover. Message 2 is one /goal line whose evidence is every card's PR, merge and close output or its 🧑 line, the full suite's passing output, the promotion PRs merged with production's sha shown, the sprint page flipped, the three list commands' output and the 🧑 section of the spine; or stopped with every card parked under 🧑, the section shown; or stop after 150 turns and show where it stands. Every path, command and number in the execution prompt is one you verified in this session. Print, in this order: the environment report; the pre-flight lines for me, if any; the launch command for the execution session, which is claude from this repository's root with --add-dir for the Tickets folder, for the Scopes folder when a document card is in, for every other repository a card builds in, and for C:\tmp\eo-connector-check when a connector card is in; then both messages as paste-ready text, each under one plain line that names the message and says when I send it. Then stop.

STANDING RULES, carried into every execution prompt word for word:

1. Shape. The session is unattended: it never asks me anything; a fork that no spec, recorded decision or this prompt settles goes under 🧑 in the spine with a recommendation, and the run continues with the next card. One branch off dev and one PR per card, except the pairs the scope names. The pre-push hook is the gate (format:check, typecheck, lint, build) and runs on every push; the PR body follows the pr skill and quotes what the gate reported. Code-review once per PR before it merges: its two axes, at most 2 agents, never a named teammate; a report that never arrives is read from the agent's transcript on disk under the .claude\projects folder, never assumed clean; CRITICAL findings are fixed test-first and re-reviewed until a pass comes back empty; at most 5 subagents per workflow. Merge into dev with a literal PR number in its own call, env -u GH_TOKEN gh pr merge <N> --repo EO-Vietnam/global-hubspot --squash --delete-branch, then verify MERGED. Tick the issue's acceptance criteria, then close it by hand, because Closes never fires on dev. Delete the merged local branch with -D without asking. Keep docs/plans/next-steps.md current as you go: shipped bullets deleted, a 🧑 line per handover, the three spine tests run after each edit, each edit landed through its own dev PR that you merge. The prototype branch is never merged and never deleted.

2. Migrations and promotions. List website\supabase\migrations before choosing a number. A PR that needs a migration is verified against the local stack, where db reset applies it, then left OPEN with the gate green; its body opens with Before merging: run <file> in the dashboard SQL editor on the production project, read the receipt (the file's last statement), then merge and promote; a 🧑 line in the spine says the same. Never merge it. A card that may start once that PR has merged may start once it is open instead; rewrite the spine's sentence that says merged. Everything else ships: open the dev into main promotion PR (reuse one already open) once the first PR without a migration has merged, and again after the last; wait for the required check named CI gate (Chromium, local Supabase) to report its own conclusion through the jobs API, since gh pr checks reports a skipped check as a pass; merge with --merge, never --delete-branch; then verify that the production deployment record carries the merge sha. Nothing merged into dev is left unpromoted at the end.

3. Verification. Vitest's full run against the local stack through scripts\assert-full-suite.mjs, 0 failed and 0 skipped, with the keys passed as env NAME=value in front of the command, never a shell prefix assignment. Playwright gets the same three local keys, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY, passed the same way, because without them its config refuses to start and it accepts only a local address. Playwright for every UI change, at --repeat-each 8 with the default 4 workers where a card or an issue asks for 8 of 8, reading each failure's mode and not only the count; kill a stale server on port 3100 first; delete .next\types after a branch switch. Comments that describe the old behaviour are corrected in the same PR.

4. Never: a write to HubSpot, Lark, email, Vercel, repository settings or production data from a script; a read of any .env file; a cd chained into a compound command (use git -C, npm.cmd --prefix, --workdir, --repo); a shell prefix assignment (use env NAME=value cmd); a sleep chained to a command (use an until loop in the background); bare npx supabase; a heredoc in git commit (write the message to a file and commit -F); a retry of anything the auto-mode classifier denied, spelled the same or differently.

5. The sprint page. At the end, in the sprint's page in C:\Users\leekh\Documents\Edge8\Tickets, flip each card whose steps you completed and whose PRs merged to DONE, and each card whose PR is left open for me to WAITING, matching a card by its span.num and never by data-card. Use the page's own patch shape: the status chip's class becomes status done or status waiting and its label DONE or WAITING; the same word is added to the card's article class; the card's Last updated span gets data-updated in the writer's local time with the offset, to the second, and its bold text in the form Wed 14 Oct, 21:40. Edit the file's text in place with a script that asserts each needle exactly once; never open the page in a browser.

6. Handover, the last message: the output of env -u GH_TOKEN gh pr list --repo EO-Vietnam/global-hubspot --state open, env -u GH_TOKEN gh issue list --repo EO-Vietnam/global-hubspot --state open and git ls-remote --heads origin; each card with its PR, merge and close evidence or its 🧑 line; production's sha after the last promotion; what you flipped on the page; the 🧑 section of the spine after the last edit.
```
## Step 2
- Paste this right after step 1 without waiting; when the session stops to ask you questions, answer them and paste it again unchanged:
```
/goal the environment report shown with every check pass, fixed or failed by command; every outside prerequisite created or its pre-flight line shown; the execution prompt saved under the Tickets folder and both its messages shown as paste-ready text under the launch command; OR stopped on one round of questions for me, numbered with a recommended answer each; or stop after 60 turns and show where it stands
```
# EP
> [!important] For prompts
> - Remove line clamps so that every bullet/paragraph is one logical line, and the text reflows correctly in any input box
> - To update skills globally: 
> 	- `bunx -y skills@latest add mattpocock/skills -g`
> 	- `bunx -y skills@latest update -g -y`
## Next
- /goal Help me complete these 2 tasks:
  1. Walk me through the HITL #1 (PayOS setup) and #3 (Email, I already set up my Resend account). I haven't bought the domain yet, so pls assume the Cloudflare-generated one for prod.
  2. Minimize the @docs/plans/next-steps.md file to de-noise it and only keep the essentials.
## Later
- Explore the relevant skills in your repertoire to give me an OPTIMIZED prompt for an agent to grade the overall quality of the codebase. I want the prompt's output to give me an HONEST assessment. The main criteria it should grade against are enterprise readiness and antifragility.
- Using GPT5.5-xhigh: Perform an exhaustive scan on the codebase and run the /improve-codebase-architecture with its relevant skills to see how you can optimize the codebase for maximum antifragility.
### The scoring prompt
```
You are a brutally honest principal engineer auditing this repository for overall codebase quality.

Your primary grading criteria are:

1. **Enterprise readiness**: Can this codebase support a real production SaaS with multiple contributors, incidents, migrations, paid users, security concerns, operational pressure, and long-term maintenance?
2. **Antifragility**: Does the codebase get stronger when stressed by bugs, new features, incidents, audits, onboarding, scale, and changing requirements?

Do not optimize for politeness. Optimize for truth, evidence, and useful prioritization.

## Required Context First

Before judging, read:

- `CONTEXT.md`
- `.claude/CLAUDE.md`
- `docs/agents/domain.md`
- all files in `docs/adr/`
- `package.json`
- `app/routes.ts`
- representative files under:
  - `app/routes/`
  - `app/lib/queries/`
  - `app/lib/curriculum/`
  - `app/lib/checkout/`
  - `app/database/`
  - `app/test/`

Use the domain vocabulary from `CONTEXT.md`. If you discuss Course, Module, Lesson, Curriculum, Checkout, Payment, Enrollment, Asset, Bundle, Waitlist, Certificate, or Progress, use those terms exactly.

Respect ADRs. If you think the codebase should violate or revisit an ADR, say so explicitly and explain why.

## Method

Do a real audit, not a vibe check.

1. Map the codebase at a high level:
   - main domain modules
   - route/load/action flow
   - database and query structure
   - external integrations
   - test structure
   - deployment/runtime assumptions

2. Look for evidence of enterprise readiness:
   - auth and authorization correctness
   - validation at boundaries
   - data integrity and transactionality
   - migration safety
   - idempotency and auditability
   - error handling
   - observability/loggability
   - secret/config isolation
   - CI/build/typecheck discipline
   - dependency and runtime risk
   - security posture
   - operational rollback/recovery paths

3. Look for evidence of antifragility:
   - fast deterministic feedback loops
   - tests at the right seams
   - regression tests for risky behavior
   - deep modules with small interfaces
   - localized change surfaces
   - explicit state machines or discriminated unions
   - documented decisions and domain language
   - ability to debug incidents from stored events/logs
   - low coupling between domain concepts
   - whether fixes naturally improve tests/docs/contracts

4. Apply the architecture lens:
   - Identify shallow modules using the deletion test.
   - Identify modules with real depth, leverage, and locality.
   - Note seams that are real because they have multiple adapters.
   - Note hypothetical seams that add abstraction without payoff.
   - Call out places where understanding one behavior requires bouncing through too many files.

5. Run available verification commands if practical:
   - `bun run typecheck`
   - `bun test`
   - relevant focused tests
   - static searches with `rg`

If you cannot run a command, say so. Do not pretend.

## Scoring

Give separate scores from 0-10:

- Overall codebase quality
- Enterprise readiness
- Antifragility
- Domain modeling
- Architecture/module depth
- Test strategy
- Type safety
- Data integrity
- Security/auth posture
- Operational maturity
- Frontend robustness
- Maintainability/onboarding

Use this calibration:

- 10: production-grade, resilient under real organizational and operational stress
- 8: strong, with manageable gaps
- 6: promising but not yet enterprise-ready
- 4: fragile; quality depends heavily on current maintainers
- 2: structurally risky
- 0: unsafe or incoherent

Penalize unknowns. If an area lacks evidence, score it lower or mark confidence as low.

## Output Format

Return this structure:

### 1. Executive Verdict

One blunt paragraph with:
- overall grade
- enterprise readiness grade
- antifragility grade
- confidence level
- whether you would trust this for paid production users today

### 2. Scorecard

A table:

| Area | Score / 10 | Confidence | Evidence | Main Risk |
|---|---:|---|---|---|

### 3. What Is Strong

List only strengths backed by concrete file references or observed patterns.

### 4. Top Risks

Rank findings by severity.

For each finding include:

- **Severity**: Blocker / High / Medium / Low
- **Area**
- **Evidence**: file paths and line references where possible
- **Why it matters**
- **Enterprise readiness impact**
- **Antifragility impact**
- **Recommended fix**
- **How to verify the fix**

### 5. Architectural Deepening Opportunities

List deepening opportunities using this format:

- **Files/modules involved**
- **Problem**
- **Deletion test result**
- **Proposed direction**
- **Benefit to locality**
- **Benefit to leverage**
- **Testing improvement**

Do not propose huge rewrites. Prefer focused changes that reduce future fragility.

### 6. Enterprise Readiness Gap Analysis

Cover:
- security/auth
- data integrity
- migrations/backups
- observability
- incident recovery
- CI/CD
- operational runbooks
- dependency/runtime risk

### 7. Antifragility Gap Analysis

Cover:
- feedback loops
- test seams
- regression capture
- state modeling
- domain language
- ADR discipline
- blast-radius containment
- debugging/replay ability

### 8. 30/60/90-Day Improvement Plan

Give a pragmatic plan:
- first 30 days: highest-risk fixes
- next 60 days: structural improvements
- next 90 days: hardening and operational maturity

Each item should be actionable and verifiable.

### 9. Unknowns And Audit Limits

State what you could not determine, what commands failed, what areas need deeper inspection, and how that affects the grade.

## Honesty Rules

- Do not give credit for intentions. Give credit for working code, tests, docs, or enforceable contracts.
- Do not average away critical risks. A serious data integrity, auth, migration, or payment risk should cap the enterprise-readiness score.
- Do not praise abstractions unless they provide locality or leverage.
- Do not call something antifragile merely because it is documented. It must improve behavior under stress.
- Prefer direct, specific criticism over generic advice.
- If the codebase is good, say why. If it is fragile, say exactly where.
```
---

# 1-1

> [!important] For pay raise
>
> - The things you think you have done well over the last 6 months.
> - The results of your work. What value did it bring to the business.
> - What would you do differently if we could go back and do it again.

# EO

> [!info] Intro
>
> - I’m a software engineer over at Edge8, on Dave's team, and I'm the guy who carries out the HubSpot technical implementation for EO chapters.
> - I figure it's a good idea to join the meeting, see what you guys are talking about so I get what I'm about to do for the next couple of months.

## Prompts
- Pls make sure to utilize the /code-review skill to help you with the DEEP adversarial review loop once you're done with the implementation and self-iterate to /diagnosing-bugs and fix ALL gaps/regressions/issues that the loop exposes before promoting to prod.
- Generate a meeting summary based on `this transcript`. Refer to `Sample` for the desired output.
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
## Run the app locally
### `global-hubspot`
```
cd /c/Users/leekh/Documents/Repos/Edge8/global-hubspot/website

npx supabase start

cd /c/Users/leekh/Documents/Repos/Edge8/global-hubspot/website

eval "$(npx supabase status -o env | sed -n 's/^API_URL=/export NEXT_PUBLIC_SUPABASE_URL=/p; s/^ANON_KEY=/export NEXT_PUBLIC_SUPABASE_ANON_KEY=/p; s/^SERVICE_ROLE_KEY=/export SUPABASE_SERVICE_ROLE_KEY=/p')"

echo "$NEXT_PUBLIC_SUPABASE_URL"

npm run dev
```
# Misc
## Altai
- Sync mkt lists to prod

