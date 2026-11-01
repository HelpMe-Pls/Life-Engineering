---
name: gh-account-kh0ile-env-token
description: How to make gh CLI reach EO-Vietnam/global-hubspot — GH_TOKEN env var pins the wrong account and must be bypassed per command
metadata: 
  node_type: memory
  type: project
  originSessionId: f20247e1-2f38-4d0c-b4c3-442b3ecbfdf9
  modified: 2026-07-26T15:51:36.228Z
---

In this environment, `GH_TOKEN` is set in the shell environment and pins `gh` to the `HelpMe-Pls` account, which cannot see `EO-Vietnam/global-hubspot` (404 on every call). `gh auth switch` alone is not enough — the env var overrides the keyring.

**Why:** gh prioritizes `GH_TOKEN` over keyring accounts; the keyring holds a working `Kh0iLe` token.

**How to apply:** once per session run `env -u GH_TOKEN gh auth switch --user Kh0iLe`, then prefix every gh call with `env -u GH_TOKEN`, e.g. `env -u GH_TOKEN gh issue view 18 --repo EO-Vietnam/global-hubspot`. Never print tokens. (Repo-level context lives in next-steps.md "GitHub Access Note"; this memory adds the env-var bypass detail verified 2026-06-05.)

**(2026-06-11) The active keyring account can silently flip back to `HelpMe-Pls` MID-SESSION** (observed right after a `git push`/`gh pr merge` sequence — likely a credential-helper side effect). Symptom: `GraphQL: Could not resolve to a Repository with the name 'EO-Vietnam/global-hubspot'` on a command pattern that worked minutes earlier. Fix: `env -u GH_TOKEN gh auth switch -u Kh0iLe` and retry — don't debug the command itself.

**(2026-07-26) `git` needs the same bypass in the SIBLING repo, `altai-hubspot-sync`.** Its remote is **HTTPS** (this repo's is the `github-edge8` SSH alias, so plain `git` works here). The credential helper feeds `GH_TOKEN` to it, so `git fetch/pull/push` there fails with **`remote: Repository not found`** — which reads like a missing repo, not an auth problem. Fix: `env -u GH_TOKEN git fetch|pull|push …`. Verified on PRs #15–#17.

**(2026-06-19) It reverts to `HelpMe-Pls` on essentially EVERY fresh Bash invocation** (each tool call is a new shell; the switch from a prior call does not stick). Robust pattern: **chain the switch into the SAME shell call as the gh command** — `env -u GH_TOKEN gh auth switch --hostname github.com --user Kh0iLe >/dev/null 2>&1 && env -u GH_TOKEN gh <cmd> …`. Did this for `gh pr create`/`gh pr checks` on PR #118 and it worked first try. A one-time switch at session start is NOT reliable.
