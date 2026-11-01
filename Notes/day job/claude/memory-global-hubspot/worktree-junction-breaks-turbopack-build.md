---
name: worktree-junction-breaks-turbopack-build
description: "A git worktree whose website/node_modules is a Windows junction to the main clone works for vitest, typecheck and lint, but `next build` (and so the pre-push gate) panics; push from the main clone instead"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 72925ba3-1dc3-424d-bc89-792a3db982aa
  modified: 2026-10-14T22:29:18.900Z
---

Parallel agents in a second git worktree (`git worktree add ../gh-xxxx -b <branch> origin/dev`) with `website/node_modules` as a PowerShell junction to the main clone's (`New-Item -ItemType Junction`) run `test:fast`, `typecheck`, `lint` and `format:check` fine. But the pre-push gate's `next build` fails: Turbopack panics with "Symlink [project]/website/node_modules is invalid, it points out of the filesystem root" (measured 2026-10-15, Next 16.2.12).

**Why:** Turbopack refuses a node_modules that resolves outside the project root; the junction does exactly that.

**How to apply:** let the worktree agent build and unit-test only; commit there, then delete the junction with `[System.IO.Directory]::Delete(<path>, $false)` (link only — never `rm -rf`, which follows into the main clone's node_modules), `git worktree remove`, and `git switch <branch>` in the main clone to push, run Playwright and the full suite there. A branch checked out in a worktree cannot be switched to in the main clone until the worktree is removed. Related: [[pretooluse-deny-hook-kills-cd-prompts]].
