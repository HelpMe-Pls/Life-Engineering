---
role: SETUP
for: "/long-vol-consultant on another machine"
verified: "2026-10-11 on Khoi's Mac — macOS, Claude Code 2.1.296 (native installer), Python 3.9.6"
script: "AI/long-vol-consultant/setup.sh"
---
# /long-vol-consultant — set it up on another machine

> [!info] What this file is
> The steps that make the Sunday read run the same on another machine as on Khoi's Mac. One line per step, in order. The script `AI/long-vol-consultant/setup.sh` checks every line and prints the fix for each FAIL. Words: [[CONTEXT]]. The skill itself: [[long-vol-consultant]].

## The short way (hand it to Claude Code on that machine)
1. You: clone the vault and install Claude Code, then sign in (steps 1–2 below); without both there is nothing to tell and nothing to read.
2. You: start Claude Code in the vault (`cd <vault>/Notes && claude`) and type: `Read AI/long-vol-consultant Setup.md and do its steps 3 to 7.`
3. Claude Code: checks Python, runs `setup.sh`, applies `--fix` and `--claude-md` (which never replaces an existing `~/.claude/CLAUDE.md`), and runs the check again until it prints `0 FAIL`.
4. You, only if Claude Code is denied the edit of `~/.claude/settings.json` (the auto-mode classifier can block it): type `! bash AI/long-vol-consultant/setup.sh --fix` yourself; the `!` prefix runs the command in the session.
5. You: quit Claude Code and start it again (a new skill loads at the next session), then type `/long` and press Tab.

## What the skill needs (each line was checked on the Mac on 2026-10-11)
1. **The vault**, cloned from `https://github.com/HelpMe-Pls/Life-Engineering.git`, at any path: the LAW, the SCHEDULE, the MOVES file, `CONTEXT.md` and the `AI/` folder come with it.
2. **Claude Code 2.1.296 or newer**: the dialog keys in the skill (Enter, ↑/↓, ←/→ or Tab, Space, Esc) were read from that build.
3. **Python 3.9 or newer on PATH as `python3`**: the position script is standard library only.
4. **The skill files where Claude Code loads skills**: `~/.claude/skills/long-vol-consultant/SKILL.md` and `scripts/position.py`; Claude Code reads `~/.claude/skills/*`, nothing else, and a new skill appears at the next session.
5. **The Mac layout** is symlinks: `~/.claude/skills/long-vol-consultant → ../../.agents/skills/long-vol-consultant`, and in there `SKILL.md → <vault>/AI/long-vol-consultant.md` and `scripts/position.py → <vault>/AI/long-vol-consultant/position.py`; an edit in the vault is live at once.
6. **The vault path is found, not typed**: `position.py` takes `--vault`, else `$LONG_VOL_VAULT`, else its own real path (the symlink points into the vault), else the path written in its `DEFAULT_VAULT` line; it prints `Vault: <path>` first.
7. **`~/.claude/settings.json` has no `skillOverrides.long-vol-consultant`**: the value `off` hides the skill from the `/` menu and from `/long` + Tab (this is what broke it on the Mac on 2026-10-11).
8. **`~/.claude/settings.json` has `"askUserQuestionTimeout": "10m"`**: a page idle for 10 minutes then auto-continues with the answers picked so far; unset means never (the dialog waits forever).
9. **`~/.claude/CLAUDE.md` holds the Answer style rule from `AI/Global CLAUDE.md`** (the EXACT rule the skill's wording follows): as the whole file (the Mac), or as a marked block inside a file that has the machine's own rules (the Windows PC). `setup.sh --claude-md` creates the file when there is none; an existing file is never replaced, it gets the block added or refreshed (a file that is a vault copy, current or older, is brought to the current text).
10. **The same model settings as the Mac, if you want the same answers**: `model: opus`, `effortLevel: high`, `permissions.defaultMode: auto`, `tui: fullscreen`; the script reports these as NOTE, never changes them.

## The steps
1. Clone the vault: `git clone https://github.com/HelpMe-Pls/Life-Engineering.git ~/Documents/Personal/Life-Engineering` (any path works; this is the Mac's).
2. Install Claude Code with the native installer: `curl -fsSL https://claude.ai/install.sh | bash`, open a new terminal, run `claude` once and sign in.
3. Check Python: `python3 --version` prints 3.9 or newer; if not, install Python 3 so that `python3` is on PATH.
4. Run the check: `bash ~/Documents/Personal/Life-Engineering/AI/long-vol-consultant/setup.sh`.
5. Apply the fixes: `bash ~/Documents/Personal/Life-Engineering/AI/long-vol-consultant/setup.sh --fix` (creates the symlinks, removes the hiding override, sets the timeout).
6. Install the answer-style rule: `bash ~/Documents/Personal/Life-Engineering/AI/long-vol-consultant/setup.sh --claude-md` (creates `~/.claude/CLAUDE.md` from `AI/Global CLAUDE.md` when there is none; a file that exists keeps every line it has and gets the rule as a marked block, added or refreshed).
7. Run the check again: every line prints `OK` and the last line says `0 FAIL`.
8. Restart Claude Code in the vault: `cd ~/Documents/Personal/Life-Engineering/Notes && claude`.
9. Type `/long` and press Tab: it completes to `/long-vol-consultant`.
10. Run `/long-vol-consultant`: page 1 prints `Vault: <path>` and the position; press Esc on page 2 if it is not Sunday (nothing is written).

## Windows (Git Bash) — verified 2026-10-11 on Khoi's Windows 11 machine (Claude Code 2.1.296, Python 3.14.4)
1. Claude Code on Windows runs its Bash tool in Git Bash, so `date +%H:%M` and `python3 -I …` work there only if Git for Windows and Python 3 (with `python3` on PATH) are installed.
2. Use copies, not symlinks: Git Bash there cannot create symlinks (`ln -s` silently copies the file), so `bash <vault>/AI/long-vol-consultant/setup.sh --copy` copies `SKILL.md` and `position.py` into `~/.claude/skills/long-vol-consultant/`, writes the vault path into the copy's `DEFAULT_VAULT` line, and makes `~/.agents/skills/long-vol-consultant` a directory junction to that folder (the path the skill's Page 1 runs; a junction needs no admin rights).
3. After every edit of the skill or the script in the vault, run `setup.sh --copy` again; a copy does not follow the vault (the check reports a stale copy as FAIL).
4. The script prints its first line as a Windows path (`Vault: C:\Users\…`); `setup.sh` converts it with `cygpath` before the smoke test, and `position.py` switches its own output to UTF-8, because a Windows pipe defaults to cp1252 and `python3 -I` ignores `PYTHONUTF8`.

## Keeping the machines the same
1. Edit the skill only in the vault (`AI/long-vol-consultant.md`, `AI/long-vol-consultant/position.py`) and commit; the other machine gets it with `git pull`.
2. On a symlink install nothing else is needed after `git pull`; on a copy install run `setup.sh --copy`.
3. The gate dates live twice, in `position.py` and in the LAW §C; change both in one edit (the script's header says so).
4. Never set `skillOverrides.long-vol-consultant` on any machine; a `/doctor` cleanup did that once (2026-10-10) and the skill vanished from the `/` menu.
5. If a Claude Code update changes the dialog's keys, the hint line at the bottom of the dialog is the truth; update the key legend in the skill from it.
6. The Answer style rule lives in `AI/Global CLAUDE.md`: edit it there, commit, and run `setup.sh --claude-md` on each machine; a machine whose `~/.claude/CLAUDE.md` is the vault file gets the new text, a machine with its own rules gets its marked block refreshed, and nothing else in that file changes.
