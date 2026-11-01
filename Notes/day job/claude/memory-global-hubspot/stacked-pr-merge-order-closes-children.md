---
name: stacked-pr-merge-order-closes-children
description: Merging a stacked PR with --delete-branch auto-CLOSES its children and a closed PR cannot be retargeted; the CI gate also never runs for a PR based on a feature branch. Retarget children to dev FIRST.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 19790602-4670-4bad-b28c-2a884223ae55
  modified: 2026-07-26T15:51:53.950Z
---

Landing a stack of PRs (each based on the previous one) into `dev` in this repo
has three traps that all fire in the first five minutes.

**1. `gh pr merge --squash --delete-branch` on the parent CLOSES every child.**
GitHub closes any PR whose base ref is deleted, and **a closed PR cannot be
retargeted** (`GraphQL: Cannot change the base branch of a closed pull request`).
Recovery: push the base ref back (`git push origin <parent-tip-sha>:refs/heads/<old-base>`),
`gh pr reopen <child>`, `gh pr edit <child> --base dev`, then delete the ref again.
**Prevention: retarget every child to `dev` BEFORE merging the parent.**

**2. The CI gate never ran on the children.** `.github/workflows/ci.yml` triggers
on `pull_request: branches: [dev, main]`, so a PR based on a feature branch gets
no gate at all. Retargeting fires `pull_request: edited`, which the default type
set ignores — so the PR sits at `mergeStateStatus: BLOCKED` with the required
check missing and nothing pending. Fix: `gh pr close` + `gh pr reopen` (fires
`reopened`, which the workflow does listen for).

**3. Squashing the parent breaks each child's merge base**, so the child's diff
re-shows the parent's changes and can conflict. Force-push is forbidden here, so:
`git merge origin/dev` into the child and resolve with `--ours` for every
conflicted file. That is mechanical, not a judgement call, **provided you first
prove the child is a strict superset**: `git diff origin/dev <parent-tip> -- <file>`
must be empty (dev's squashed content == the parent tip the child descends from).
Sanity check after committing: `git diff HEAD <child-pre-merge-tip> --stat` should
be EMPTY — dev contributed nothing the child lacked.

**Why:** each trap presents as something else — an unexplained closed PR, a
`BLOCKED` PR with no failing check, and a conflict in files you never touched.

**How to apply:** retarget children first; merge parent → `git fetch --prune` →
merge `origin/dev` into the next child → resolve `--ours` → push → close/reopen if
the gate is missing → merge. Verify each with
`gh pr view <N> --json state,mergeCommit` — the merge runs silently.

See [[promotion-merge-convention]] (the per-PR runbook), [[pr-merge-gate-check-by-type]].
