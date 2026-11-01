---
name: global-hubspot-shared-checkout
description: "Several Claude sessions share the global-hubspot repo checkout; never switch its branch, commit from it or push from it while it is on another session's branch - use a separate git worktree with its own npm ci (a node_modules junction breaks the pre-push build)"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 945e47a4-0e18-40ca-8f0a-16155c614090
  modified: 2026-10-17T17:17:10.622Z
---

C:\Users\leekh\Documents\Repos\Edge8\global-hubspot is used by more than one Claude session at a time (17 Oct 2026: the Altai sync sessions held it on feat/altai-sync-partial-weeknight-lists, PR 1123, while the Member Renewal AFK run needed to push its live-copy PR 1122).

**Why:** at M2 of that run, a file agent switched the shared checkout off the other session's branch to commit, and the main session had to switch it back and warn both Altai sessions. Moving another session's branch under it can lose or mix its work.

**How to apply:**
- Before any git write, run git -C <repo> branch --show-current. If it is not your branch or dev, do not switch, commit or push in that checkout.
- Do the work in a separate worktree instead: git -C <repo> worktree add <dir> <your branch>, then npm --prefix <dir>/website ci (about a minute). A junction from the worktree's website/node_modules to the main checkout's fails the pre-push gate's build: Turbopack says "Symlink [project]/website/node_modules is invalid, it points out of the filesystem root" (format:check, typecheck and lint pass first). CI builds with no env file, so the worktree needs none.
- Remove the worktree when done (git -C <repo> worktree remove <dir>). If a junction is still inside it, delete the junction first with cmd /c rmdir, so the removal cannot reach into the main checkout's node_modules.

Related: [[afk-prompts-keep-files-current]], [[claude-in-chrome-afk-facts]].
