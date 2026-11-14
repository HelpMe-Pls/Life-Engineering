---
share_link: https://share.note.sx/81itz5rx#SqkgrteBBhPUOIpHuC2sbsAlGnDp0s3fGJElIjRPTFc
share_updated: 2026-05-07T20:53:04+07:00
---

How it works:
![[Pasted image 20260401141615.png]]
==**It's all Prompt Engineering**==. This guide focuses on Claude Code CLI (in the terminal).
# Tips
- Append this to your `~/.claude/settings.json` file to use non-Anthropic models:
```json
  "env": {
    "ANTHROPIC_BASE_URL": "https://openrouter.ai/api",
    "ANTHROPIC_AUTH_TOKEN": "sk-or-v1-<key>",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "<your-desired-model>",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "<your-desired-model>",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "<your-desired-model>"
  }
```
## Saving your quota

Paste into any Claude Code session, fresh or mid-session:

````text
Token economy: from this message on, follow the Token economy section at the end of this message in this session. Then make it permanent on this machine, without asking me anything: each new session then starts on Opus at low effort with ultracode off, and /model and /effort still switch inside a session. Steps 2 to 4 give the target. Check the machine against it first and change only what differs. When everything is already in place, change nothing, make no backup, and say so.

1. Version. Run claude --version. The settings in step 2 need 2.1.316 or later. On an older version, run claude update, then carry on: the new version starts at the next launch. If the command is not found, carry on too.

2. Settings. The file is settings.json in the user-level Claude Code config folder: CLAUDE_CONFIG_DIR when it is set, otherwise .claude under my home folder (create the file if it is missing). The target, with every other key left as it is, and with a number that is already lower left as it is:
- env, each value a string: ANTHROPIC_MODEL = opus (it decides the model at launch, whatever the model key says; a value that already names an Opus model, such as opus[1m], stays), CLAUDE_CODE_SUBAGENT_MODEL = sonnet, CLAUDE_CODE_WORKFLOW_SUBAGENT_MODEL = sonnet, CLAUDE_CODE_SUBAGENT_EFFORT = medium, MAX_MCP_OUTPUT_TOKENS = 12000
- env without CLAUDE_CODE_EFFORT_LEVEL: it locks the effort of the whole session. Never add it, DISABLE_PROMPT_CACHING or CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
- effortLevel = low, at the top level and inside the modelSettings entry of each Opus model. The entry of the newest Opus model must be there (claude-opus-5-5 when this was written): Opus 5.5 and later models do not read the top-level one
- autoCompactWindow = 200000, at the top level and inside each modelSettings entry that has its own (a per-model value beats the top-level one)
- bashOutputMaxChars = 16000, workflowSizeGuideline = small, promptSuggestionEnabled = false, awaySummaryEnabled = false
- ultracode: not true (delete the key if it is)

3. Launcher. The settings alone do not hold: /effort saves a new level into them, and a level from my organization or a project outranks them. Only the launch flag beats those. So the claude command of each shell that I use must add --effort low when I do not pass --effort. Skip this step if claude --help does not list --effort. The profiles:
- macOS or Linux: the file that my login shell reads at the start of an interactive session, such as .zshrc or .bashrc (create it if it is missing).
- Windows: the file that $PROFILE names in each PowerShell that is installed (pwsh, powershell), and .bashrc in my home folder if it exists. Create a missing PowerShell profile only where it will load: in the output of Get-ExecutionPolicy -List in that shell, leave out the Process row (a Claude Code session can set that row itself); the first row that is not Undefined must show RemoteSigned, Unrestricted or Bypass. With no such row, or when you cannot read the policy, do not create the file. Never change the policy.
In each profile: if it already defines a claude function or alias, make that one do this, take out of it a --model flag for a model that is not Opus, and add nothing else (leave it alone when it does this already); otherwise add these lines.
PowerShell:
function claude {
  $exe = @(Get-Command claude -CommandType Application, ExternalScript)[0].Source
  $low = if ($args -match '^--effort(=|$)') { @() } else { '--effort', 'low' }
  if ($MyInvocation.ExpectingInput) { $input | & $exe @low @args } else { & $exe @low @args }
}
bash or zsh (another shell: the same behaviour):
claude() { local a; for a in "$@"; do case "$a" in --effort|--effort=*) command claude "$@"; return ;; esac; done; command claude --effort low "$@"; }

4. Rules. CLAUDE.md in the config folder holds the section once, verbatim. If a section with the same heading is there with other text, replace it, from its heading to the next # or ## heading or the end of the file. If there is none, add the section at the end (create the file if it is missing). A difference only in line endings or in blank lines at the end is no difference.

5. Change. Skip this step when nothing differs. Otherwise first copy each file that you will change into a new folder in the config folder: backups/token-economy- plus today's date (add the time, as in -1430, when that folder is already there). Keep two files with the same name apart there. Then make the changes, and nothing more. If an edit of settings.json is refused because a key is unrecognized (an old version does that), write the file with a script instead: Claude Code ignores a key that it does not know.

6. Report. Finish with these lines and nothing else. When nothing differed, line 1 says so and lines 2 to 6 stay out.
1. What you changed.
2. The path of the backup folder.
3. New sessions start on Opus at low effort with ultracode off. Name the shells that have the launcher: it works from the next terminal window on. Any other way to start Claude Code (another shell, an editor extension, the desktop app) uses the settings alone, which a level from an organization or a level that /effort saved can beat.
4. For a hard task: run /effort, pick a level and press s, so that the level stays in that session.
5. To run in this session now: /autocompact 200 (it reads as 200 thousand), unless the window was already 200000 or less; and /effort low, unless this task is hard.
6. /autocompact 1M raises the window for one big task; /autocompact 200 puts the cap back after it.
7. Only if the version was below 2.1.316 or you could not read it: the settings need a restart of Claude Code on 2.1.316 or later, and an update by hand if claude update failed.

The section is everything from the heading below to the end of this message:

## Token economy

Every turn re-sends the whole context, so context size, turn count and spawned agents are the cost. These rules cut waste, never depth: read, print and spawn only what the task needs.

- Search before you read: grep with a head limit, then read only the lines you need (offset and limit). Never read a whole file over 300 lines without a reason, never re-read a file that is already in context unless it changed since, never read a file back to verify an edit (Edit and Write fail loudly).
- Batch: independent tool calls go in one message, and several shell commands go in one shell call. Ask a command for only what you need (a count, a grep hit, a JSON field, the last 20 lines); send long output to a file in the temp folder and read the lines that matter.
- No subagent, agent team or Workflow unless the work is parallel and independent, or does not fit in one context. At most 5 spawns per session. The settings give each subagent its model and effort (Sonnet, medium): pass a stronger model only to a judge, verify or design stage, and Haiku or the Explore agent to a search. In a Workflow the settings keep every agent on Sonnet whatever the script asks, so there give those stages a higher effort instead (effort: 'high'). Ultracode on or effort max does not change this: a Workflow runs only when my message says workflow or ultracode.
- Long-horizon work: write the plan or spec to a file and hand it to a fresh session (SendMessage between sessions when they must coordinate) instead of growing this session or spawning a fleet.
- Replies: the answer first, short. Between tool calls, say something only when I would need it (a blocker, a choice, a long wait); no restating my question, nothing beyond the result and what I must do next. Code, commands and error text go in a fenced block, never in prose.
- Load a skill only when the task matches its trigger. WebSearch standard mode first, extended only when standard comes back thin. Open the browser tools only for a page that needs a logged-in session.
- When a task is done and the next one is unrelated, say so in one line: a /clear there costs nothing and saves the most, and a /compact is worth it only when the next task needs this context.
````

# Skills
[[validate-biz-idea]]

---
# The fundamentals
## Overview
- **LLM constraints**: Every new conversation is a blank slate. This means your codebase quality directly determines how effective Claude Code will be.
- **Sub-agents**: They are a context saving mechanism for the orchestrator agent. This is a delegation mechanism. These sub-agents can be spawned with different system prompts and different models too.
- **Codebase exploration**: use the `explore` key word to ensure your agents *comprehensively analyze* the files.
- **Building features**: occasionally run the `/context` command (or use the plugin below) before executing a complex plan to keep the used token around `[80k; 100k]` (i.e. keep it in *the smart zone*).
- **Context monitoring**: press `Shift + Tab` to cycle between modes. Use [this package](https://www.npmjs.com/package/ccstatusline) to monitor your context .

## Best practices
- **Plan mode**: again, use the `Shift + Tab` combo to enable this. The usual flow is ==*Plan → Execute → Test → Commit*==.
- **The plan-execute-clear loop**: while it's in the `Plan` mode, prompt it to ask clarifying questions so you got edge cases covered, something like:
	- "*Interrogate me about every single design decision inside here so that we both understand what we're trying to build better.*"
	- Once you're out of the smart zone (i.e. spent more than 100k tokens), export the plan (with the current progress) to start over again with a new context window.
- **Compaction**: use the `/compact` command to temporarily extend the smart zone for difficult, long-running task. 
	- Something like: `/compact I've just implemented a feature and I want to do some QA on it.`
	- If you compact more than 2 times then it's time to start over again with a new context window.
# Steering
- **AGENTS.md files**: persistent markdown files give your coding agent the *global* memory of your preferences and coding conventions. These instructions get sent with every prompt, so keep them lean to save your context window. For now, Claude Code uses `CLAUDE.md` instead.
- **Steering with CLAUDE.md**: notice a pattern the agent is using that you don't like. Write a rule in `CLAUDE.md` to steer it toward better behavior with a prompt like `Review your work with the updated @CLAUDE.md in mind`. Verify it worked. Repeat.
- **Progressive disclosure**: structuring instructions so only relevant context loads for each task, keeping the context window lean by having a set of (nested) markdown links inside the `CLAUDE.md` file which linked you to the correct grouping when needed.
- **Agent skills**: are discoverable, [scoped instruction sets](https://skills.sh/vercel-labs/claude-skills) (in markdown format) that extend Claude Code capabilities without polluting global context. Skills are stored in the `./claude/skills/`. 
	- Skills setup: ![[Pasted image 20260404115157.png]]
	-  To manually invoke a skill, just type `/<skill-name>`. Set the `user-invocable` config to `false` in the frontmatter section of a skill to make it only available for the LLM to invoke (i.e. it won't be listed under the `/` command): ![[Pasted image 20260404120816.png]]
- **Writing skills with skills**: using a meta-skill to generate reusable migration skills you can share across your organization. Install that "meta-skill" with this command: `bunx skills add mattpocock/skills/write-a-skill`
	- Example: `Write a "do-work" skill to execute a unit of work end-to-end: plan, implement, validate with typecheck and tests, then commit. Use when user wants to do work, build a feature, fix a bug, or implement a phase from a plan.`
	- Review the skill that it just created to make sure that it's not including any project-specific file paths (because this is a meta-skill).
- **Automatic memory**: Claude Code writes and maintains its own steering documentation over time. Occasionally review its memory with the `/memory` command → `Open auto-memory folder` to see what has been keeping track off and make edits where necessary. Disable it if it's not helping you.
# Plan & Execute
## Product Requirement Doc
- **How to Tackle Massive Tasks**: large features tend to break down in a single context window and we need a strategy for splitting them up with the `PRD.md` file (stands for *Product Requirements Document* — a description of the destination) and the `PLAN.md` file (a description of the journey — `N phases` get to the destination). You're saying `we're going to do phase N`, then you pass in the PRD and you pass in the entire plan.
- **Write Great PRDs with This Skill**: use a PRD-writing skill (`bunx skills add mattpocock/skills/to-prd`) to have Claude Code produce a detailed product requirements document.
- **Split Features Across Multiple Context Windows**: you can lazily turn a PRD into a multi-phase plan that distributes work across multiple sessions with a simple prompt like:
	- "*Turn this into a multi-phase plan and save it as a local Markdown file.*"
	- There's a high chance that the plan produced from this is sub-optimal. See the ***Tracer Bullet pattern*** below to refine your plan.
## Tracer Bullets
- **What Are Tracer Bullets**: the idea behind tracer bullets is that systems have layers (db, api, fe, etc.). By using Tracer Bullets, we can create plans that have phases that actually go through each layer instead of phases that span an entire layer. That way we, as the human, are able to go in and take a look and provide feedback if needed.
- **Use Tracer Bullets in Our Multi Phase Plan**: apply tracer bullets (as a skill) to create vertical-slice phases that wire up the full stack incrementally:
	- Install the skill: `bunx skills add mattpocock/skills/to-issues
	- Use the skill with your PRD file: `Use the /to-issues skill and refer to @<your-prd-file> to build out the plan with proper safeguards against any regression and suboptimal UX.`
	- Review the plan and make necessary adjustments. 
## Execute & Review
- **Executing Our Multi Phase Plan**: implement a multi-phase plan one phase at a time with Claude Code:
	- Mention ***both*** the PRD and the PLAN files in your first prompt & `Shift + Tab` to auto accept its output:
		- `Explore the codebase then refer to the @prd/<your-prd> and @plan/<your-plan> to proceed with Phase 1 of the plan`
	- QA the slop, inject necessary adjustments & commit at the end of each phase:
		- `Now review the @plans/<your-plan> and analyze the latest changes that you've just made to decide if it passes ALL of the acceptance criteria for the current phase, then update the plan accordingly to reflect that state.`
		- Or use [Codex](https://github.com/openai/codex-plugin-cc?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExcnFFM1RORFNIaGJocDdROXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR5hVqqr2q75i4ZHjEQjO6IMCBaK1511auYBJVTCbyN6t3nmDI1tjHSRR2SE2A_aem_DUNUUwq-MG_-9BLN-o7wWw) to review Claude's work instead.
	- Start the new phase with a new context window if you're out of the smart zone.
- **Use a skill the review the slop**: when you have a vague concept that you want to be hardened into something that the LLM can actually produce, use this:
	- `bunx skills add mattpocock/skills/grill-me`
	- Whether you're refining your PRD, PLAN, or just brainstorming a vague idea about a feature/bug/decision, this skill comes in handy.
# Feedback Loops
- **Is Code Cheap**: if your code is easy to change without introducing regression, then it's high quality. But if it's cheap, then it means that your software entropy increases with every iteration.
- **Using The Do Work Skill**: build your own `/do-work` reusable skill that gives Claude Code a repeatable process for planning, implementing, and validating changes. You can use the `/do-work` skill end-to-end by implementing an in-app notifications feature from a PRD. Example:
	- `Use the /do-work skill and refer to @<your-prd> and proceed with Phase 1 of the @<your-plan>`
## Quality Assurance
- **Fixing Agents Broken Formatting with Pre Commit**: add [Git pre-commit hooks](https://www.aihero.dev/essential-ai-coding-feedback-loops-for-type-script-projects) with lint and type checks so every commit is validated automatically.
	- Paste the Markdown text (maybe replace `pnpm` with `bun`) and then prompt: "*implement this in my project*."
- **Red Green Refactor**: the TDD cycle (and its Red-Green-Refactor implementation) creates tight feedback loops for safer AI-driven development. Use the `/test-driven-development` skill (via `bunx skills add https://github.com/obra/superpowers --skill test-driven-development`) or update your `/do-work` skill to use red-green-refactor and the Tracer Bullet pattern for back-end code and direct implementation for front-end:
	- `/write-a-skill add red-green-refactor guidance into the implementation step of the /do-work skill to encourage one test at a time in a tracer-bullet style, and only apply this to backend code, not frontend code`
	- Frontend code changes too fluidly during development for test-first to be practical anyway. The [`agent-browser`](https://agent-browser.dev/) is the closest thing you can get for frontend QA.
	- Review the skill and make sure that if it wants to go through multiple rounds of Red-Green, then the "Refactor" phase is always at the end of the iteration.
# Ralph
- **What Is Ralph**: [Ralph loops](https://ghuntley.com/ralph) let Claude Code work through [multi-phase plans](https://github.com/ai-hero-dev/cohort-003-project/tree/main/ralph) autonomously across multiple context windows
- **HITL Ralph**: you're watching the agent work and can step in if something goes off track:
	- `chmod +x ralph/once.sh`
	- `./ralph/once.sh "plans/<your-plan>.md prd/<your-prd>.md"`
- **Setting Up and Running AFK Ralph**: run Claude Code (in WSL) with the AFK Ralph script within a Docker sandbox for fully autonomous execution:
	- `./ralph/afk.sh "plans/<your-plan>.md prd/<your-prd>.md" <number-of-iterations>`. The `number-of-iterations` can be `5`, `10`, `20`, based on the complexity of your issues/feature.
- **Hooking Up Ralph to Your Backlog**: replace your manual PRD selection by wiring GitHub issues into the Ralph prompt so it reads and closes issues as it works:
	- Install the `gh` CLI (if your haven't), then run `./ralph/afk.sh <number-of-iterations>` to automatically resolve open issues
# HITL Pattern
## Human Judgment
- **HITL and AFK Tasks**: the code implementation can be fully delegated to AI, but the planning, QA, and soul of the product should be judged by a human.
- **Using the Kanban Skill**: break a PRD into vertical slice GitHub issues with AFK and human-in-the-loop designations, then run an autonomous loop:
	- Review the issues created by the `/to-issues` skill, then run `./ralph/afk.sh <number-of-iterations>`
	- Once it's done, you're left with HITL issues for QA
## Prototyping
- **Trying Out Research**: collaborate with AI to evaluate approaches, compare services, and produce a focused research asset so that you can cache expensive explore phases into local research documents to speed up every subsequent AI loop:
	- Start by describing your idea/problem in a new context window. Be creative here and maybe use the `/grill-me` skill to refine & create your "plan" in the `plans/` folder.
- **Trying Out Prototyping**: turn research into a working proof of concept on a dev-only route using the `/do-work` skill:
	- `Use the /do-work skill and refer to @plans/<the-plan-from-your-research> to build a prototype route that is only visible to the developers. The local assets created in this prototype should be available for implementing in the real app once I confirmed that the prototype is good enough.`
## A clean codebase
- **Designing Codebases AI Loves**: structure your code into deep modules with simple interfaces so AI can navigate, test, and modify it effectively by walking through your codebase to find shallow modules and refactor them into deep, testable units:
	- `bunx skills add mattpocock/skills/improve-codebase-architecture`
	- Then give it a prompt like: `Use the /improve-codebase-architecture skill to optimize the repo for readability, maintainability and scalability.