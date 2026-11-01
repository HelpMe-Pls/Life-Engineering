---
name: long-pre-push-hook-drops-ssh
description: "A pre-push hook that runs for minutes lets git's already-open SSH connection idle until GitHub closes it — the gate passes and the push silently does not land; fix with a per-command GIT_SSH_COMMAND keepalive, and never trust the push's exit code"
metadata:
  type: reference
---

`git push` opens the SSH connection to `github-edge8` **before** running `.githooks/pre-push`. The gate then runs for 4–9 minutes with the connection idle, and GitHub's sshd closes it. **The gate passes, the hook prints `pre-push: gate passed.`, and nothing is uploaded.**

**The exit code does not tell you.** Measured on 2026-09-03 in one session: the `EO_GATE=full` push (≈9 min) exited **0** with `Connection to github.com closed by remote host` buried mid-log; the plain push (≈4.5 min) exited **141** (SIGPIPE). Both printed `pre-push: gate passed.` and neither moved the ref. This is the same family as 🔧 trap 8 — the status you read belongs to something other than the thing you care about.

**Always verify the ref moved**, never the exit code: `git -C <repo> ls-remote origin refs/heads/<branch>`. A `To github…` line plus `<old>..<new>  <branch> -> <branch>` is the only real receipt.

**The fix, per command, without touching `~/.ssh/config`:**

```
env GIT_SSH_COMMAND="ssh -o ServerAliveInterval=30 -o ServerAliveCountMax=120" git -C <repo> push origin <branch>
```

That pushed a 4.5-minute-gated branch first time after two failures. ⚠ Use `env VAR=x cmd`, not `VAR=x cmd` — the bare prefix form is denied in this environment.

⚠ **Do NOT reach for `EO_GATE=skip` to dodge this.** It means "this branch must not merge", and a push that skipped the gate is indistinguishable afterwards from one that passed it. The keepalive costs nothing and keeps the hook's own record.

## ⚠ AND A "killed" TASK NOTIFICATION IS THE THIRD FALSE SIGNAL (measured 2026-09-04)

A backgrounded push whose harness wrapper is reaped reports **status: killed** while the real process tree — `git push`, `.githooks/pre-push`, `npm test` — **keeps running and completes normally**, still writing to its redirect file. Measured twice in one session: the first "killed" gate ran on to `pre-push: gate passed.` and pushed `7ad4a3d..ca48ae1` by itself; a waiter loop started to watch it was then "killed" too, and also survived.

**So three different signals lied in one session, all in the same direction:** an `exit=0` on a gate that had gone RED (the redirect captured the compound's status, not the push's), and two "killed" notices on processes that were alive.

**Before reacting to a kill, check both:** `Get-CimInstance Win32_Process` filtered to `git.exe`/`node.exe`/`bash.exe` created after the launch time, and whether the log file is still GROWING (stat the size twice, 20 s apart). ⚠ **Never re-launch the push on a kill notice without that check** — two gates racing would share one local Supabase and the same ports, which is the load condition that produces the hydration flakes in the first place. To wait for a survivor, prefer `Monitor` with a filter covering BOTH outcomes (`gate passed|wip -> wip` and `failed|rejected|error:|Timed out`); a plain polling loop in `run_in_background` is itself reapable.

Related: [[policy-guardrails-this-repo]], [[gh-pr-merge-dirty-worktree]], [[closeout-recheck-commit-and-node24]].
