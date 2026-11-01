---
name: automode-profile-described-the-wrong-repo
description: "Auto mode judges commands against `~/.claude/settings.json` → autoMode.environment, which described the SIBLING repo (altai-hubspot-sync) — asserting `no dev branch` and `altai … only` — so routine dev merges/pushes in global-hubspot read as touching an untrusted repo's protected default branch and got denied; the durable fix is a PreToolUse hook that resolves the PR's BASE BRANCH, because a `Bash(...)` prefix rule cannot see it"
metadata: 
  node_type: memory
  type: project
  originSessionId: 71ceca70-f476-4a6e-8934-db1ddafea25d
  modified: 2026-08-25T09:31:01.523Z
---

Diagnosed 2026-08-25 when `gh pr merge` into `dev` started coming back "Blocked by
classifier" and the branch → PR → merge loop stopped being AFK-able.

**Two independent causes, neither in this repo's code:**

1. **The classifier was judging this repo against ANOTHER repo's profile.**
   `~/.claude/settings.json` → `autoMode.environment` is prose the classifier reasons
   against, and it described `EO-Vietnam/altai-hubspot-sync`: *"main (default and
   integration branch; **no dev branch in this repo**)"*, *"Trusted repo:
   EO-Vietnam/altai-hubspot-sync"*, *"This repo … and its origin remote **only**"*.
   Against that, a merge into `dev` here is a merge into the protected default branch
   of an untrusted repo — a correct answer to the wrong question. ⚠ **It is GLOBAL, so
   it governs every repo**, and writing to it is classifier-denied even with a project
   green light (that grant covers the PROJECT `.claude/settings.json`, a different file).
2. **No static allow rule could ever match.** `Bash(gh:*)` is allowed globally, but every
   `gh` call here must be written `env -u GH_TOKEN gh …` ([[gh-account-kh0ile-env-token]]),
   and `Bash(...)` rules match a command **PREFIX** — which is `env`. So every gh command
   fell through to the classifier: it allowed `create`/`view`, denied `merge`, and the
   whole thing read as intermittent rather than broken.

**The fix does not argue with the classifier.** `website/scripts/pr-merge-gate.mjs` is a
`PreToolUse` hook that resolves the PR's **base branch** and answers `allow` (non-promotion)
/ `ask` (main, master, or unresolvable). ⚠ **A permission rule could not do this** —
`gh pr merge 651 … --squash` and `gh pr merge 630 … --merge` are the same shape and the
base appears nowhere in the command text, so a prefix rule is all-or-nothing and "all"
hands an unattended agent the production promotion.

⚠ **DELIBERATELY NO MERGE ALLOW-RULE IN `.claude/settings.json` — it must FAIL CLOSED.**
The first draft paired the hook with `Bash(env -u GH_TOKEN gh pr merge:*)` as belt-and-braces.
That is backwards: if the hook ever fails to run, the RULE is what survives, and it would
wave a promotion through. With no rule, a dead hook leaves merges as gated as before.

**To prove the hook is live in a session** (settings/hooks are otherwise snapshot at start),
run `git push --force <nonexistent-remote> dev`: a live hook answers with its OWN message,
`pr-merge-gate: force-push is forbidden by …`, which is distinguishable from a classifier
denial. It was live immediately — no restart needed.

Related: [[classifier-denies-repo-settings-writes]], [[policy-guardrails-this-repo]],
[[pr-merge-gate-check-by-type]], [[gh-pr-merge-dirty-worktree]].
