# Sprint skills

This folder holds the three Claude Code skills that run a sprint, with everything they need and one installer.

| Skill | What it does | When |
|---|---|---|
| `/sprint-summary-tickets` | Turns the recording of a sprint call into the summary and the Tickets page. | After the call |
| `/sprint-afk-prep` | Asks you each open choice once, then writes the prompt for a session that builds the cards with no one at the keyboard. | Before you leave |
| `/sprint-review-prep` | Checks each card in the real app and writes the review page. | Before the next call |

## Install: one command

```
node "<this folder>/install.mjs"
```

From the root of the vault the command is `node AI/sprint-skills/install.mjs`. It is the same in PowerShell, in Git Bash and in a Mac terminal. It needs Node 18 or newer and no other package.

Run it again after every pull. It writes a file only when the file differs, so a second run changes nothing. Then start Claude Code again.

Run it again after an upgrade of Node too. A hook command names the Node program, and an upgrade can remove that program. The run repairs a hook command when the program or the script it names is gone.

## What the command does

- **The skills.** It copies the three skill folders to `.claude/skills` in your home folder. Two skills name folders of the PC they were written on. The installer writes your folders in their place: your home folder, your sprint pages, your clones and your recordings. The third skill names its places from your home folder. When your sprint pages or your clones are in another folder, the installer adds one paragraph to that skill that says where.
- **Three hook scripts.** It copies them to `.claude/hooks` and names them in `settings.json`. `compact-reread.mjs` sends a long session back to its skill file after Claude Code shortens the conversation. `no-cd-compound.mjs` stops a command that changes folder and reads a file in one step, because such a command stops to ask you. `ensure-chrome.mjs` starts Chrome for the Claude extension (Windows only).
- **Settings, only where a value is missing.** Sub-agents on Sonnet at medium effort, the size limits for tool output, and the six rules that keep `.env` files out of a conversation. It never changes or removes a value that is there. It keeps one copy of the file as it was.
- **The Reader-facing docs note.** The pages follow it. The installer writes it when your `.claude` folder does not have it.
- **Matt Pocock's skills.** `/grilling`, `/tdd`, `/implement`, `pr` and `code-review`. The installer installs them when they are missing, and lets a session call `/implement`, which ships slash-only.
- **The Tickets page helper (Windows).** A Tickets page saves a pick through it from any browser. It serves the pages under `Documents/Edge8` only: with `--edge8` set to another folder, it does not save a pick made there.
- **A check of the machine.** One line for each thing: `PASS`, `DONE`, `TODO` for a thing that is yours to do, `FAIL`.

`node install.mjs --help` lists every option. `--check` changes nothing and says what a run would change.

## What you supply

The installer says which of these the machine lacks.

- **Sign-ins:** Claude Code, `gh auth login`, the Claude in Chrome extension, and the sites a card needs.
- **The clones** under `Documents/Repos/Edge8` (or `--repos <folder>`).
- **The sprint pages** under `Documents/Edge8` (or `--edge8 <folder>`): the folders Tickets, Sprint review, Scopes, AFK and HITL. No repository holds them. Copy only those folders.
- **Tools:** git, fnm, Docker Desktop, and the transcriber that `skills/sprint-summary-tickets/SETUP.md` describes.
- **Permission rules.** The package holds no allow list and no auto-mode rule, because those are personal. `--unattended` turns on auto mode. You write the rules that say where a session may merge. Without them a session leaves each pull request open for you.

## A teammate's machine

The skills speak of Khoi as the owner. Tell the installer who you are, once:

```
node "<this folder>/install.mjs" --owner "<your name on the sprint pages>" --github <your GitHub login> --email <your HubSpot sign-in>
```

The installer then writes your GitHub login in place of Khoi's, and adds one paragraph to each skill that says the owner of the session is you. It remembers this in `.claude/sprint-skills.json`. `--no-owner` undoes it.

Not yet tried on a teammate's machine or on a Mac: the first run there is the test. Send what it prints when a line says `FAIL`.

## A session that stops picks up where it stopped

Start the same skill again. Each one reads what it wrote and skips the finished work.

- `/sprint-summary-tickets` keeps a progress file in its scratch folder. A new launch starts at the first step the file does not record.
- `/sprint-afk-prep` updates its prompt file in place. The session that builds the cards reads each pull request's state and never does merged work again.
- `/sprint-review-prep` keeps a state file with the phase and the step it reached.

## Change a skill

Change the file under `skills/<name>/` in this folder, never the installed copy. Then run the installer. `/sprint-summary-tickets` writes what a call taught it into this folder by itself.

## Share the package

Zip this folder and send it. It holds no key, no password and no sprint page.
