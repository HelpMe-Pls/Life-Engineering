---
name: git-commit-heredoc-hangs-windows
description: "git commit -m \"$(cat <<'EOF' …)\" hangs forever in this repo's Git Bash on Windows — always write the message to a scratchpad file and use git commit -F / gh --body-file. AND: a gh --title starting with a slash is silently rewritten into a Windows path by MSYS."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c59f4c0f-c357-4504-ab72-a8ba06e8cb0c
  modified: 2026-09-11T23:28:31.539Z
---

`git commit -m "$(cat <<'EOF' … EOF)"` hung until the 2-minute Bash timeout (exit 143) in this repo's Git Bash on Windows — the heredoc-inside-command-substitution left the shell waiting on stdin; the staged `git add` in the same compound command never completed either (2026-07-02).

**Why:** heredoc + `$(cat …)` interacts badly with this Windows Git Bash; there is no pre-commit hook in this repo to blame (checked — no .husky, no core.hooksPath).

**How to apply:** for any multi-line commit message or PR body, Write the text to the scratchpad first, then `git commit -F <file>` / `gh pr create|edit --body-file <file>`. Also remember the gh active account can silently flip back to HelpMe-Pls between calls — re-run `env -u GH_TOKEN gh auth switch --user Kh0iLe` before gh commands that fail with "Could not resolve to a Repository" (see [[gh-account-kh0ile-env-token]]).

⚠ **A `--title` that STARTS WITH `/` is rewritten into a Windows path by MSYS, silently and with exit 0.** Creating issues from Git Bash on 2026-08-17, three of eleven titles shipped as `C:/Program Files/Git/kb/critical-rules opens with…` instead of `/kb/critical-rules opens with…`. **It is inconsistent, which is what makes it dangerous**: `/kb/application-flow: lead with…` and `/kb/member-status documents…` came through untouched in the same loop, so a spot-check of one or two titles "proves" the batch is fine. MSYS only converts when the leading token still looks path-shaped to it.

Bodies passed via `--body-file` are never affected — this is argument mangling only. **Use the PowerShell tool for any `gh` call whose argument starts with a slash** (`$env:GH_TOKEN=$null; gh issue create --title '/kb/…'`), and **always list the created items back and read the titles** — `gh issue list --json number,title` — rather than trusting the returned URLs, which look correct either way. Repair with `gh issue edit <n> --title '…'` from PowerShell.

⚠ **(2026-09-12) A plain `cat > file <<'EOF' … EOF` FAILS too, differently: `unexpected EOF while looking for matching `''` (exit 2), nothing written.** No `$(…)`, no git involved — a ~90-line markdown body with apostrophes, backticks and `<placeholders>` fed straight to `cat`. The harness's `bash -c` wrapping is the likely cause (the quoted delimiter did not protect the body), so the whole heredoc family is unreliable here, not just the commit form. **For any multi-line file content, use the Write tool** (auto mode's "prefer Bash" rule explicitly yields when Bash cannot do the job, and this is that case); one-line `sed -i 's/…/…/'` edits on the written file still work fine.
