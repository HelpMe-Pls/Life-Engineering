# Day job: run the sprint review prompts on another machine

The `# Sprint review prep` and `# After sprint review` prompts in [[Daily Standup]] read files by absolute path under `C:\Users\leekh`. This folder holds copies of those files, taken from the work PC on Sun Nov 1 2026, so another machine can run the same prompts.

## Put each folder back where the prompts look

The prompts expect the Windows user `leekh`. On a machine with another user name, put the files in the same places under that user, then replace `C:\Users\leekh` in both prompts with that machine's home folder.

| In this folder | Copy to | What the prompts use it for |
| --- | --- | --- |
| `Edge8\Sprint review\sprint-42-review.html` | `C:\Users\leekh\Documents\Edge8\Sprint review\` | Layout model for the next review page (the Copy script, the Lark and WhatsApp copies, the presenter clock) |
| `Edge8\Tickets\Sprint Tickets [Y26 Sprint 43].html` | `C:\Users\leekh\Documents\Edge8\Tickets\` | The newest sprint page, the input both prompts parse |
| `Edge8\AFK\Start\…AFK prompt.md` | `C:\Users\leekh\Documents\Edge8\AFK\Start\` | Shape model for the next AFK prompt |
| `Edge8\AFK\End\` (2 reports) | `C:\Users\leekh\Documents\Edge8\AFK\End\` | Model for the AFK Session Report; the Oct 17 report is the model for the Done chip |
| `Edge8\HITL\Start\`, `Edge8\HITL\End\` | `C:\Users\leekh\Documents\Edge8\HITL\Start\` and `\End\` | Models for the HITL Pre-flight page and the HITL Session Report |
| `Edge8\Scopes\Scope [Member renewal].html` | `C:\Users\leekh\Documents\Edge8\Scopes\` | Model for any scope page a card writes |
| `claude\memory-Captures\` (34 notes) | `C:\Users\leekh\.claude\projects\C--Users-leekh-Videos-Captures\memory\` | The sprint-review rules: page layouts, spoken lines, what stays off the call |
| `claude\memory-global-hubspot\` (191 notes) | `C:\Users\leekh\.claude\projects\C--Users-leekh-Documents-Repos-Edge8-global-hubspot\memory\` | The home repo's Claude memory, added with `--add-dir` in the launch command |
| `claude\reader-facing-docs.md` | `C:\Users\leekh\.claude\` | Writing rules for the review page (`setup.sh --claude-md` also installs it) |

## Set up the rest once

These are not copied here because they come from their own source:

- **Repos:** clone `global-hubspot`, `event-sync` and `altai-hubspot-sync` from the EO-Vietnam GitHub org into `C:\Users\leekh\Documents\Repos\Edge8\`, then run `npm install` in `global-hubspot\website` (the prompts load jsdom and Playwright from there).
- **Tools:** `gh` signed in as Kh0iLe, Docker Desktop, and the Claude extension in the browser, signed in to the same claude.ai organization as Claude Code.
- **Skills and global rules:** Matt Pocock's skills (`npx skills@latest add mattpocock/skills -g -a claude-code -s "*" -y`), then `bash AI/long-vol-consultant/setup.sh --claude-md` from the vault.
- **Folders that fill up per sprint:** `C:\Users\leekh\Videos\Captures` (call recordings and transcripts) and the `[PROOF]` folders under `Edge8\Tickets` start empty. The prompts work without old ones, but they lose the previous call transcript.

## Keep it current

These are copies, so they go stale. Before you use another machine for a sprint, copy the newest review page, sprint page and reports again from the work PC. `C:\tmp\day-job\copy.sh` on the work PC does it (update the file names in it to the newest sprint first).
