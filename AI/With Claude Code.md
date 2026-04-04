How it works:
![[Pasted image 20260401141615.png]]
==**It's all Prompt Engineering**==. This guide focuses on Claude Code CLI (in the terminal).

---
# The fundamentals
- **LLM constraints**: Every new conversation is a blank slate. This means your codebase quality directly determines how effective Claude Code will be.
- **Sub-agents**: They are a context saving mechanism for the orchestrator agent. This is a delegation mechanism. These sub-agents can be spawned with different system prompts and different models too.
- **Codebase exploration**: use the `explore` key word to ensure your agents *comprehensively analyze* the files.
- **Building features**: occasionally run the `/context` command (or use the plugin below) before executing a complex plan to keep the used token around `[80k; 100k]` (i.e. keep it in *the smart zone*).
- **Context monitoring**: press `Shift + Tab` to cycle between modes. Go to [this page](https://www.aihero.dev/workshops/day-1-claude-code-fundamentals-ju4au/showing-context-in-the-status-line~fe28c), under the bottom left of the video, click on `Use with AI → Copy as Markdown`, paste that into a clean Claude Code session and let it cook. 
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
- **Agent skills**: are discoverable, scoped instruction sets (in markdown format) that extend Claude Code capabilities without polluting global context. Skills are stored in the `./claude/skills/`. 
	- Skills setup: ![[Pasted image 20260404114933.png]]
	-  To manually invoke a skill, just type `/<skill-name>`. Set the `user-invocable` config to `false` in the frontmatter section of a skill to make it only available for the LLM to invoke (i.e. it won't be listed under the `/` command): ![[Pasted image 20260404120816.png]]
- **Writing skills with skills**: using a meta-skill to generate reusable migration skills you can share across your organization. Install that "meta-skill" with this command: `bunx skills add mattpocock/skills/write-a-skill`
- **Automatic memory**: Claude Code writes and maintains its own steering documentation over time. Occasionally review its memory with the `/memory` command → `Open auto-memory folder` to see what has been keeping track off and make edits where necessary. Disable it if it's not helping you.
# Planning
- **How to Tackle Massive Tasks**: large features tend to break down in a single context window and we need a strategy for splitting them up with the `PRD.md` file (stands for *Product Requirements Document* — a description of the destination) and the `PLAN.md` file (a description of the journey — `N phases` get to the destination). You're saying `we're going to do phase N`, then you pass in the PRD and you pass in the entire plan.
- **Write Great PRDs with This Skill**: use a PRD-writing skill (`bunx skills add mattpocock/skills/write-a-prd`) to have Claude Code interview you and produce a detailed product requirements document.
- **Split Features Across Multiple Context Windows**: you can lazily turn a PRD into a multi-phase plan that distributes work across multiple sessions with a simple prompt like:
	- "*Turn this into a multi-phase plan and save it as a local Markdown file.*"
	- There's a high chance that the plan produced from this is sub-optimal. See the ***Tracer Bullet pattern*** below to refine your plan.
- **What Are Tracer Bullets**: the idea behind tracer bullets is that systems have layers (db, api, fe, etc.). By using Tracer Bullets, we can create plans that have phases that actually go through each layer instead of phases that span an entire layer. That way we, as the human, are able to go in and take a look and provide feedback if needed.
- **Use Tracer Bullets in Our Multi Phase Plan**: apply tracer bullets (as a skill) to create vertical-slice phases that wire up the full stack incrementally:
	- Install the skill: `bunx skills add mattpocock/skills/prd-to-plan
	- Use the skill with your PRD file: `/prd-to-plan @<your-prd-file>`
	- Review the plan and make necessary adjustments. 
- **Executing Our Multi Phase Plan**: implement a multi-phase plan one phase at a time with Claude Code:
	- Mention ***both*** the PRD and the PLAN files in your first prompt & `Shift + Tab` to auto accept its output:
		- `@prd/<your-prd> @plan/<your-plan> Proceed with Phase 1`
	- QA the slop, inject necessary adjustments & commit at the end of each phase.
	- Start the new phase with a new context window if you're out of the smart zone.
- **Use a skill the review the slop**: when you have a vague concept that you want to be hardened into something that the LLM can actually produce, use this:
	- `bunx skills add mattpocock/skills/grill-me`
	- Whether you're refining your PRD, PLAN, or just brainstorming a vague idea about a feature/bug/decision, this skill comes in handy.
# Feedback Loops
- **Is Code Cheap** — Why treating code as disposable leads to software entropy and why quality still matters in the AI age
- **Steering Agents to Use Feedback Loops with Skills** — How to deterministically enforce code quality using skills instead of hoping the agent gets it right
- **Building a Do Work Skill** — Create a reusable skill that gives Claude Code a repeatable process for planning, implementing, and validating changes
- **Using Our Do Work Skill** — Test the do-work skill end-to-end by implementing an in-app notifications feature from a PRD
- **Fixing Agents Broken Formatting with Pre Commit** — Add Git pre-commit hooks with lint and type checks so every commit is validated automatically
- **What Is Red Green Refactor** — Understand the TDD cycle and how it creates tight feedback loops for safer AI-driven development
- **Red Green Refactor** — Update the do-work skill to use red-green-refactor for back-end code and direct implementation for front-end