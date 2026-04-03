How it works:
![[Pasted image 20260401141615.png]]
It's All Prompt Engineering. This guide focuses on Claude Code CLI (in the terminal).

---
# The fundamentals
- **LLM constraints**: Every new conversation is a blank slate. This means your codebase quality directly determines how effective Claude Code will be.
- **Sub-agents**: They are a context saving mechanism for the orchestrator agent. This is a delegation mechanism. These sub-agents can be spawned with different system prompts and different models too.
- **Codebase exploration**: use the `explore` key word to ensure your agents *comprehensively analyze* the files.
- **Building features**: occasionally run the `/context` command (or use the plugin below) before executing a complex plan to keep the used token around `[80k; 100k]` (i.e. keep it in the smart zone).
- **Context monitoring**: press `Shift + Tab` to cycle between modes. Go to [this page](https://www.aihero.dev/workshops/day-1-claude-code-fundamentals-ju4au/showing-context-in-the-status-line~fe28c), under the bottom left of the video, click on `Use with AI → Copy as Markdown`, paste that into a clean Claude Code session and let it cook. 
- **Plan mode**: again, use the `Shift + Tab` combo to enable this. The usual flow is ==*Plan → Execute → Test → Commit*==.
- **The plan-execute-clear loop**: while it's in the `Plan` mode, prompt it to ask clarifying questions so you got edge cases covered, something like:
	- "*Interrogate me about every single design decision inside here so that we both understand what we're trying to build better.*"
	- Once you're out of the smart zone (i.e. spent more than 100k tokens), export the plan (with the current progress) to start over again with a new context window.
- **Compaction**: use the `/compact` command to temporarily extend the smart zone for difficult, long-running task. 
	- Something like: `/compact I've just implemented a feature and I want to do some QA on it.`
	- If you compact more than 2 times then it's time to start over again with a new context window.
# Steering
- **AGENTS.md files** — how persistent markdown files give Claude Code memory of your preferences and coding conventions
- **Steering with CLAUDE.md** — using configuration rules to enforce patterns like object parameters over positional parameters
- **Progressive disclosure** — structuring instructions so only relevant context loads for each task, keeping the context window lean
- **Agent skills** — discoverable, scoped instruction sets that extend Claude Code capabilities without polluting global context
- **Writing skills with skills** — using a meta-skill to generate reusable migration skills you can share across your organization
- **Automatic memory** — how Claude Code writes and maintains its own steering documentation over time