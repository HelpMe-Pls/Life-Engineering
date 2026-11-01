---
name: pr-merge-needs-a-literal-number
description: "STANDING (operator, 2026-10-05: never show that prompt again): open a PR in ONE Bash call, then `gh pr merge <LITERAL NUMBER>` in a SEPARATE call — a variable, `$(...)`, URL or create+merge chain makes pr-merge-gate ASK the operator"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 7381459e-92c2-4e16-8a16-796da242106e
  modified: 2026-10-05T13:43:32.781Z
---

Merge every PR in this repo with exactly this shape, in its own Bash call, after the `gh pr create` call has returned and printed the URL:

`env -u GH_TOKEN gh pr merge 1044 --repo EO-Vietnam/global-hubspot --merge`

Never `n=$(gh pr create …); gh pr merge "${n##*/}"`, never `gh pr merge "$n"`, a URL, a flag before the number, or a bare `gh pr merge` chained after the create.

**Why:** the repo's PreToolUse hook `website/scripts/pr-merge-gate.mjs` allows an unattended merge only when it RESOLVES the PR's base branch, and it reads the PR number off the command TEXT before the command runs. With an expansion it has no number. It then falls back to the current branch's PR, which does not exist yet when the same command creates it, so it fails closed and prompts the operator ("could not resolve the base branch of this PR"). On 2026-10-05 I chained create and merge through `${n##*/}` on #1043 and #1044. The operator answered: "update your own configs so these kind of messages never show up again. You're explicitly granted permissions for PRs." `docs/plans/next-steps.md` → 🔧 4 has said "Merge with a LITERAL number" since 2026-09-27, so this was a rule I had read and not applied.

**How to apply:** two calls, always. Call 1: `gh pr create … --body-file <file>`, which prints the URL. Call 2: the merge with the number typed in. The operator's explicit PR grant does not remove the prompt, because a hook's `ask` overrides allow rules. Only the shape does. A deny guard in `~/.claude/hooks/` that would block the wrong shape was proposed and refused by auto mode as [Self-Modification], so this memory is the only guard: the operator installs a hook themselves, or nothing does. Related: [[pretooluse-deny-hook-kills-cd-prompts]], [[gh-account-kh0ile-env-token]], [[git-commit-heredoc-hangs-windows]].
