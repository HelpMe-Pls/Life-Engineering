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
Set up everything a fully unattended Claude Code session needs to close out the newest sprint's cards, whichever repositories under C:\Users\leekh\Documents\Repos\Edge8 they build in, then give me that session's exact execution prompt. This prompt is the same from any repository under that folder: this repository is the one whose root you run from, a repository's GitHub name is the one git remote get-url origin shows in its clone (EO-Vietnam/<name>), and every fact about a repository (its integration branch, its package root, its Node version, its gate, its stack, what a merge arms) comes from its own CLAUDE.md, spine and files, read this session, never from another repository. Implement nothing in this session and change nothing in any repository: you read, classify, grill me on the scope, fix the machine, create what is missing outside the repositories, write the execution prompt, and stop. You can deploy up to 20 subagents per workflow this session.

Start as this repository's spine (docs/plans/next-steps.md) says, three separate commands: git fetch, then git rev-parse --abbrev-ref HEAD, then git log --oneline origin/main..origin/dev in global-hubspot or git status --short --branch elsewhere; be on the integration branch the spine names (dev in global-hubspot, main elsewhere) and fast-forwarded to its origin before reading on. Then read, in this order: this repository's CLAUDE.md whole, and every document it tells a session to read first (the package root's own CLAUDE.md, an onboarding page, a glossary, recorded decisions, standing traps, a playbook, the ADRs, the spec it points at); its spine whole; the newest sprint page, which is the file Sprint Tickets [YNN Sprint NN].html with the highest year and then the highest sprint number in its name in C:\Users\leekh\Documents\Edge8\Tickets, parsed with jsdom from the nearest node_modules that holds it (this repository's, else global-hubspot's website\node_modules), never installed for this and never opened in a browser (a card is an article.ticket, its number is its span.num, its title its h2, its status chip the span.status whose data-card is an internal id and not the card number, its steps the li elements under Acceptance steps with the owner in span.who, and the section Waiting outside the sprint lists what is parked); and every GitHub issue, spec section, plan page, scope and meeting summary the cards cite (gh is always env -u GH_TOKEN gh ... --repo EO-Vietnam/<the repository that holds it>).

Classify every card, and name the repository each card builds in: find the code, pages, migrations or docs its steps and pointers name, with git grep across the clones under C:\Users\leekh\Documents\Repos\Edge8; the issue a card cites belongs to the repository that holds it; the first lines of each clone's CLAUDE.md and README say what that repository is (the Altai to HubSpot sync, the Eventbrite to OneEO connector, the rollout tracker and portal, the EO Vietnam site). Before you settle a card's repository and its pointers, read that repository the way you read this one, through git -C <its clone> and never cd: fetch, fast-forward its integration branch, then its CLAUDE.md whole with the documents it names as read-first, and its spine whole; a repository that is not cloned yet is cloned to C:\Users\leekh\Documents\Repos\Edge8\<name> first. In the execution session: a card assigned to Khôi whose steps are code, tests, migrations, docs or pages in any EO-Vietnam repository, in one that does not exist yet, or a document in C:\Users\leekh\Documents\Edge8\Scopes. A human-only step inside such a card (SQL on production, a message to a person, a click in HubSpot or Eventbrite, a sandbox run that needs a credential) stays in the card as a handover line and never excludes it. Out: a card assigned to anyone else, a card whose every step is human-only, and a WAITING card unless I say it is in. Order: the page's order, the blocking edges the cards state, and any order a recorded decision in a repository sets; two cards in one PR when the second cannot exist without the first and both build in the same repository; document cards last. For each card in, record its repository, its branch name, its pointers (issue, spec sections, plan or scope pages, files), its acceptance steps verbatim, the command that proves each step, and the evidence the execution session must show. The execution session's home repository is this one when it holds a card in, else the repository that holds the most cards in, global-hubspot on a tie or when any card needs its local stack or its tools; every other repository is reached through --add-dir, git -C, npm.cmd --prefix and --repo, never cd. A merge that a production run picks up on its own (a merge into altai-hubspot-sync's main arms the nightly sync into EO's live HubSpot; a merge into eo-vietnam's main deploys eovietnam.org) is a question for me: merge, or leave the PR open for me with a 🧑 line. For a document card, find every source its steps name and record the path, or the HubSpot read that gives it (check that the HubSpot MCP tools are available to you; they read, never write; when they are missing, the HubSpot facts become a pre-flight line); a scope document follows the structure, sections and styles of C:\Users\leekh\Documents\Edge8\Scopes\Scope [Member renewal].html. A source you cannot find, or a card whose repository you cannot settle, is a question for me, never a guess.

Then open a /grilling session (the grilling skill) on the scope, before anything is written or fixed: rounds of numbered questions, each with your recommended answer worded so that yes accepts it, only about what the sprint page and the repositories cannot settle: which WAITING cards are in, the repository of any card you could not settle, the home repository when it is not this one, which of the merges above stay open for me, any card you could not classify, any source you could not find, and any fork in a card's steps that no spec, recorded decision or this prompt settles. A fact you can look up is never a question. When the frontier is empty, show the scope as one line per card in order, each with its repository, its branch and its merge rule, then the home repository on a line of its own, and wait for my confirmation in one word; only then go on. When there is nothing to ask, show that scope and wait the same way.

Verify and fix the machine yourself, never asking, for every repository a card builds in, in this order, and report each check per repository as pass, fixed, failed or not needed here with its command: git config core.hooksPath is .githooks in the clone when the repository has a .githooks folder; env -u GH_TOKEN gh auth status shows an active account that sees EO-Vietnam (env -u GH_TOKEN gh auth switch --user Kh0iLe when it does not); Node is the version in .nvmrc under the package root (the folder that holds package.json: website in global-hubspot, the root elsewhere), run as fnm exec --using=<that version> -- npm.cmd --prefix <absolute package root> (fnm install it when fnm list lacks it), or, with no .nvmrc, the machine's default node -v inside the range package.json's engines gives, run as npm.cmd --prefix <absolute package root>; and npm.cmd ci when node_modules is older than package-lock.json; where the repository's spine or CLAUDE.md says its tests need a local Supabase stack (global-hubspot's own; event-sync's tests run against global-hubspot's), Docker Desktop is running (when docker info fails, Start-Process the exe at C:\Program Files\Docker\Docker\Docker Desktop.exe through PowerShell, then wait with an until loop on docker info, run in the background, never a sleep chained to a command), and that stack is up and reset through the pinned binary of the repository that owns it (global-hubspot's website\node_modules\.bin\supabase.cmd start --workdir <absolute global-hubspot website path>, then db reset, then status -o env kept in a scratchpad file whose name does not end in .env), never npx supabase, which installs a newer CLI and moves the images; where the repository has a Playwright config, its pinned Chromium is installed, nothing listens on the port that config names, and .next\types and .next\dev\types are deleted; and, for the report's render check, playwright with its Chromium and a prettier binary are reachable in the home repository's node_modules or in global-hubspot's website\node_modules, never installed for this. A failed check you cannot fix becomes a pre-flight line for me, with the command.

Create what the cards need outside the repositories. A card that builds in a repository that does not exist yet: create it private with env -u GH_TOKEN gh repo create EO-Vietnam/<name> --private, clone it to C:\Users\leekh\Documents\Repos\Edge8\<name>, and give it only the skeleton no card covers, modelled on C:\Users\leekh\Documents\Repos\Edge8\altai-hubspot-sync: a README with the purpose and the spec's path, package.json with TypeScript, vitest and tsx on the same Node version, tsconfig, .gitignore, a CLAUDE.md that points at the spec and states its rules (what the code may read and write, named; no credential in a log, a fixture or a commit; every secret masked before anything is printed; main as the integration branch, one PR per item, merged by its author on a green check), and, when the spec gives it a schedule, a GitHub Actions workflow on workflow_dispatch only, its cron line written but commented out, because the schedule stays off until a dispatched run has been timed. Push that as the first commit on main. When the creation is refused, hand me the exact command as a pre-flight line to run with the ! prefix. List by name only the secrets the repository will need, as a pre-flight line; never ask me for a value and never read one. A fixture a card names that lives outside the repositories (a saved API reply, an export) goes into the execution prompt with its path, with the rule that a fixture is scrubbed of any credential and any person's name or email before it is committed.

Write the execution prompt as two messages and save both to C:\Users\leekh\Documents\Edge8\AFK\Start\Sprint Tickets [YNN Sprint NN] AFK prompt.md, never overwriting a file already there (add -2 to the name), in the shape of the newest file in that folder: a title, a line that says when the setup session wrote it, the launch command, then the two messages under their own headings. Message 1 starts with the words /tdd /implement and holds, in this order: the scope (each card in, in order, with its repository, its branch, pointers, acceptance steps, proof commands and merge rule) and the home repository; the repository facts, for each repository a card builds in, each verified this session (its clone's path, its GitHub name and the gh form; the integration branch and what a merge into it arms; the package root, the Node version and the npm form; the gate's commands; the migrations folder, or none; the local stack, its keys' file and its port, or none; whether it promotes, with the required checks' names, or none), and the paths of jsdom, Prettier and Playwright for the report; the session start, spelled out in full for the home repository and, through git -C, for every other one (the spine's first commands; Node through fnm exec; Docker Desktop started through PowerShell when docker info fails, with the until loop; the stack up and reset through the pinned binary; the local keys from status -o env); the standing rules below, word for word; and the handover. Message 2 is one /goal line whose evidence is every card's PR, merge and close output or its 🧑 line, each repository's full suite passing, where a repository promotes its promotion PRs merged with production's sha shown, the sprint page flipped, the AFK Session Report saved in C:\Users\leekh\Documents\Edge8\AFK\End with its path, word count and render check shown, the list commands' output for each repository and the 🧑 section of each spine edited; or stopped with every card parked under 🧑, those sections and the AFK Session Report shown; or stop after 150 turns and show where it stands. Every path, command and number in the execution prompt is one you verified in this session. Print, in this order: the environment report; the pre-flight lines for me, if any; the launch command for the execution session, which is claude from the home repository's root with --add-dir for the Tickets folder, for C:\Users\leekh\Documents\Edge8\AFK, for the Scopes folder when a document card is in, for every other repository a card builds in and for global-hubspot when the stack, jsdom, Prettier or Playwright come from it, for every folder outside the repositories that holds a source or a fixture a card names, and for the home repository's Claude memory folder under C:\Users\leekh\.claude\projects when it exists; then both messages as paste-ready text, each under one plain line that names the message and says when I send it. Then stop.

STANDING RULES, carried into every execution prompt word for word (each card builds in the repository its scope line names; in every rule below the repository, its integration branch, its gate, its spine, its stack and its other facts are that repository's, as Message 1 states them, reached through git -C, npm.cmd --prefix, --workdir and --repo when it is not the home repository, never cd):

1. Shape. The session is unattended: it never asks me anything; a fork that no spec, recorded decision or this prompt settles goes under 🧑 in the repository's spine with a recommendation, and the run continues with the next card. Cards run one at a time, in the scope's order; a workflow's subagents review and verify, and never build a second card in parallel. One branch off the integration branch and one PR per card, except the pairs the scope names. The gate is the repository's own: the pre-push hook where one is installed, else the command list its CLAUDE.md names, run as separate commands before every push and before the handover, each output read; the PR body follows the pr skill and quotes what the gate reported. Code-review once per PR before it merges: its two axes, at most 2 agents, never a named teammate; a report that never arrives is read from the agent's transcript on disk under the .claude\projects folder, never assumed clean; CRITICAL findings are fixed test-first and re-reviewed until a pass comes back empty; at most 5 subagents per workflow. Merge into the integration branch with a literal PR number in its own call, env -u GH_TOKEN gh pr merge <N> --repo EO-Vietnam/<repository> --squash --delete-branch, then verify MERGED; a PR whose merge rule in the scope says open stays open with the gate green and a 🧑 line. Tick the issue's acceptance criteria; then close the issue by hand when the integration branch is not the default branch, because Closes fires only there, and elsewhere verify that the merge closed it. Delete the merged local branch with -D without asking; never merge or delete a branch you did not create this session. Keep each repository's spine current as you go: shipped bullets deleted, a 🧑 line per handover, every test that pins the file (git grep -l next-steps in the test folders) run after each edit, each edit landed through its own PR into the integration branch that you merge.

2. Migrations and promotions. In a repository with a migrations folder, list it before choosing a number. A PR that needs a migration is verified against the local stack, where db reset applies it, then left OPEN with the gate green; its body opens with Before merging: run <file> in the dashboard SQL editor on the production project, read the receipt (the file's last statement), then merge and promote; a 🧑 line in the spine says the same. Never merge it. A card that may start once that PR has merged may start once it is open instead; rewrite the spine's sentence that says merged. In a repository whose integration branch is not its default branch (global-hubspot: dev into main), everything else ships: open the promotion PR (reuse one already open) once the first PR without a migration has merged, and again after the last; wait for each required check (global-hubspot's is named CI gate (Chromium, local Supabase)) to report its own conclusion through the jobs API, since gh pr checks reports a skipped check as a pass; merge with --merge, never --delete-branch; then verify that the production deployment record carries the merge sha. Nothing merged into the integration branch is left unpromoted at the end. In a repository whose integration branch is its default branch, a merge is the promotion: what it arms is in Message 1, and the merge rule in the scope decides whether you merge it.

3. Verification. The repository's full test suite, against the local stack where it has one (global-hubspot: Vitest through website\scripts\assert-full-suite.mjs, 0 failed and 0 skipped; event-sync: npm test with global-hubspot's local stack in the environment), with the keys passed as env NAME=value in front of the command, never a shell prefix assignment. global-hubspot and event-sync share global-hubspot's local stack: never run their suites at the same time, and db reset before each repository's full suite. Where the repository has Playwright, it gets the same three local keys, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY, passed the same way, because without them its config refuses to start and it accepts only a local address; Playwright for every UI change, at --repeat-each 8 with the default 4 workers where a card or an issue asks for 8 of 8, reading each failure's mode and not only the count; kill a stale server on the port its config names first; delete .next\types after a branch switch. Vitest has no --repeat-each, and --retry hides the flake you are hunting: when a test fails once, loop the run five times with a bounded until loop in the background, and read each failure's mode. Comments that describe the old behaviour are corrected in the same PR.

4. Never: a write to HubSpot, Altai, Hivebrite, Eventbrite, Lark, email, Vercel, repository settings or production data from a script; a read of any .env file; a cd chained into a compound command (use git -C, npm.cmd --prefix, --workdir, --repo); a shell prefix assignment (use env NAME=value cmd); a sleep chained to a command (use an until loop in the background); bare npx supabase; a heredoc in git commit (write the message to a file and commit -F); a Bash heredoc or a bulk Python edit of a repository file (on this machine a doubled backslash arrives halved, and Python writes CRLF unless it uses read_bytes and write_bytes, which breaks Prettier, so edit with the Edit and Write tools); a retry of anything the auto-mode classifier denied, spelled the same or differently.

5. The sprint page. At the end, in the sprint's page in C:\Users\leekh\Documents\Edge8\Tickets, flip each card whose steps you completed and whose PRs merged to DONE, and each card whose PR is left open for me to WAITING, matching a card by its span.num and never by data-card. Use the page's own patch shape: the status chip's class becomes status done or status waiting and its label DONE or WAITING; the same word is added to the card's article class; the card's Last updated span gets data-updated in the writer's local time with the offset, to the second, and its bold text in the form Wed 14 Oct, 21:40. Edit the file's text in place with a script that asserts each needle exactly once; never open the page in a browser.

6. The AFK Session Report. After the page flips and before the handover, write a report of this session for me to C:\Users\leekh\Documents\Edge8\AFK\End\AFK Session Report [YYYY-MM-DD].html, dated the day the session ends in local time, never overwriting a file already there (add -2 to the name). Copy the structure, sections and whole style block of the newest AFK Session Report in that folder: a title that gives the result; the Date, Author (Khôi Lê, written by Claude Code) and Session lines; a Context callout with what I asked for and where the cards stand; the biggest risk as an alert callout that ends with To stop this:; What to do as an Owner, Action and Due table with a chip in each row, one row per action left for me (each 🧑 line this session added in any spine, each PR left open for me, and each card I must flip later); one section per outcome, each heading giving its answer, with the done cards in a table of the card, what changed and where; and a footer that names the sources and the day each was read. Keep only the load-bearing essentials, every one resting on a read made that day (gh for each repository, the production deployment record where a repository promotes, the sprint page through jsdom). Name a card with its noun (Card 1, the stage buttons), and a pull request or issue as PR 1110 or issue 1016, never with # before the digits. It is a report under the global CLAUDE.md's Reader-facing docs rule, so it reads in 2 minutes and holds no more than 800 words of visible text. Format it with the pinned Prettier binary Message 1 names, called by its absolute path on the file's absolute path, then confirm git status is unchanged in every repository. Render it headless with the Playwright Message 1 names at 375 and 1280 px, and check the word count, no sideways scroll, every text block at the full column width, and no # before a digit, local path or semicolon joining two ideas in the visible text; fix it and render again until every check passes.

7. Handover, the last message: the output of env -u GH_TOKEN gh pr list --repo EO-Vietnam/<repository> --state open, env -u GH_TOKEN gh issue list --repo EO-Vietnam/<repository> --state open and git ls-remote --heads origin, for the home repository and, with git -C, for every other repository you wrote in; each card with its PR, merge and close evidence or its 🧑 line; production's sha after the last promotion, where a repository promotes; what you flipped on the page; the AFK Session Report's path on its own line, with its word count; the 🧑 section of each spine you edited, after its last edit.
```
## Step 2
- Paste this right after step 1 without waiting; when the session stops for a grilling round or for your confirmation of the scope, answer it, then paste this again unchanged:
```
/goal the environment report shown with every check pass, fixed, failed or not needed here, by command and by repository; every outside prerequisite created or its pre-flight line shown; the execution prompt saved under C:\Users\leekh\Documents\Edge8\AFK\Start and both its messages shown as paste-ready text under the launch command; OR stopped in the grilling, on a round of numbered questions each with a recommended answer, or on the scope shown for my confirmation; or stop after 60 turns and show where it stands
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

