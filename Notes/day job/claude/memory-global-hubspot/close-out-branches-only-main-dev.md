---
name: close-out-branches-only-main-dev
description: "STANDING close-out preference — after any batch/close-out, git branches must be ONLY main + dev on BOTH remote and local; delete every merged feature/docs branch. A SQUASH-merged branch gets `git branch -D` WITHOUT ASKING once the proof below holds (operator, 2026-10-13)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 69dbf090-ad70-47e6-9276-9ba82ee86578
  modified: 2026-10-13T03:20:49.794Z
---

⚠ **NEVER ASK before force-deleting a squash-merged branch of my own** (operator, 2026-10-13). I asked "may I `git branch -D` these two squash-merged branches?" after #1092 and #1094, and the operator answered "yes for those 2 local branches (write it down to your memory so you don't ask those "squash merge" questions again)". This is the standing confirmation that `global-engineering.md`'s "confirm before `git branch -D`" asks for, for this one case: a branch whose PR is MERGED and that passes the proof in step 4. Delete it as part of the close-out and say so in one line. Still ask for a branch I did not create, or one that fails the proof (it holds work that did not land).

The desired close-out state for git branches in this repo is that **only `main` and `dev` remain — on BOTH the remote AND local** (khoi.le, stated 2026-07-08). Every close-out / batch-completion must end by deleting all merged feature and docs branches from both places, leaving exactly `main` + `dev`.

**Why:** keeps the branch list clean and the convention unambiguous (this repo's working model is: all work on short-lived feature/docs branches → PR → merge → delete; `dev` and `main` are the only durable branches). A pile of stale local branches is noise and hides which branches are live.

**How to apply — the close-out branch sweep:**
1. `git fetch --prune origin` (drops local refs to already-deleted remote branches).
2. `git branch` and `git branch -r` — anything besides `main`/`dev` (and `origin/HEAD`) is stale.
3. **Remote:** merging PRs with `gh pr merge --delete-branch` usually removes the remote branch already; prune cleans the ref. If a remote feature branch lingers, `git push origin --delete <branch>`.
4. **Local:** delete each merged branch. ⚠ SQUASH-MERGE CAVEAT — `git branch --merged dev`, `git cherry dev <b>`, and `git merge-base --is-ancestor <b> dev` all report a squash-merged branch as **NOT merged** (the squash commit has a fresh SHA, so its commits don't patch-match). Do NOT trust them to gate deletion. The authoritative "safe to delete" proof for a squash-merged branch:
   - the PR is **MERGED** (`gh pr view <n> --json state`), AND
   - the branch's OWN touched files (diff vs its `git merge-base` with dev) are **identical in dev** (`git diff --quiet dev <b> -- <file>` for each).
   - Shortcut when `dev` has not moved since the squash: `git diff --stat <b> <squash sha>` prints nothing, so the branch tip IS the merged tree (used 2026-10-13 on #1092 and #1094).
   Then `git branch -D <b>`, without asking (see the top). Plain `-d` REFUSES squash-merged branches.
   - Gotcha: `git diff dev..<b>` shows files where dev is merely AHEAD (a later PR touched the same file) as "differing" — that's dev-ahead, not branch-unique. Check the diff direction/content before worrying; if the only delta is a later change dev gained, the branch is still fully absorbed.
5. Re-verify: `git branch` + `git branch -r` show only `main` + `dev`.

Relates to [[promotion-merge-convention]] (dev→main via merge commit, never --delete-branch on the promotion; only feature branches get deleted) and [[gh-pr-merge-dirty-worktree]].
