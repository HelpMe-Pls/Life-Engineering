---
name: git-rev-path-mangled-by-msys
description: "In the Bash tool on Windows, `git show origin/main:path` is silently mangled to `origin\\main;path`, so a blob that EXISTS reports as absent"
metadata: 
  node_type: memory
  type: project
  originSessionId: a280c6e0-a6a1-46c2-8cbe-613bfc8f6ddf
  modified: 2026-08-31T10:04:50.984Z
---

In the Bash tool (Git Bash / MSYS on Windows), any argument of the form `<rev>:<path>` gets path-converted: `origin/main:.github/workflows/x.yml` reaches git as `origin\main;.github\workflows\x.yml`. Affects `git show`, `git cat-file`, anything taking `rev:path`.

**The failure mode is a FALSE NEGATIVE that reads as a fact.** `git cat-file -e origin/main:<path>` exits non-zero, which looks exactly like "the file does not exist on that branch". I concluded `main` had no `nightly-cross-browser.yml`, told the operator #718's blocking rationale was therefore wrong, and started writing that into the ticket. `git ls-tree -r --name-only origin/main -- .github/workflows/` showed the file present and never deleted. The blocking rationale was right; my correction was the error.

**Fix:** `env MSYS_NO_PATHCONV=1 git show "<rev>:<path>"`, or use the PowerShell tool (no MSYS conversion).

**Tells:** the git error echoes the mangled string back — look for backslashes and a `;` where you typed `/` and `:`. And `git log <rev> -- <path>` still works (no colon), so "log shows commits touching it" contradicting "cat-file says absent" is this bug, not a deletion.

**Rule:** prove a path's absence on a ref with `git ls-tree`, never with a `rev:path` read. Related: [[git-commit-heredoc-hangs-windows]], [[dont-ask-mode-shell-workarounds]], [[report-that-names-its-own-fix-must-be-measured]].
