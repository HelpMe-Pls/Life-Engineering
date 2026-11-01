---
name: closeout-recheck-commit-and-node24
description: "Two close-out traps — a per-task commit can silently miss a keystone file, and a bare subshell runs Node 26 not the pinned 24 (crashes Vitest). ⚠ But `fnm use <partial>` REWRITES website/.nvmrc, a tracked file: set PATH to the installation dir instead"
metadata:
  node_type: memory
  type: feedback
  originSessionId: d583d455-4840-499f-8014-680c0334e93c
  modified: 2026-08-23T06:52:30.305Z
---

Two process traps caught during the Wave-board build (2026-06-30), both invisible until the final close-out re-check:

1. **A per-task `git commit` can silently NOT include the file you think it did.** During the Wave board build, the Task-11 commit of `app/admin/page.tsx` (the keystone RSC) never landed — `git log dev..HEAD` had no such commit, and `git show HEAD:...page.tsx` still held the OLD content — yet all gates stayed green because `build`/`test`/E2E ran against the **on-disk** (uncommitted) new file. **Why:** the working tree and the committed tree diverged silently. **How to apply:** at close-out, ALWAYS run `git status --short` + `git log --oneline dev..HEAD` and confirm every expected file is actually committed BEFORE pushing — don't trust that each step's `git commit` succeeded just because gates pass (gates test the working tree, not HEAD). See [[promotion-merge-convention]] close-out runbook.

2. **A bare `bash -c` subshell here defaults to Node 26, but the project pins 24.x (`website/.nvmrc`).** Running `npm test` under Node 26 crashed the Vitest worker (`tinypool onUnexpectedExit`) — a flake, NOT a code failure. A tinypool/worker crash or a `Node.js v26` banner = wrong runtime; re-run pinned before believing a test failure.

## ⚠ CORRECTION (2026-08-23): do NOT reach for `fnm use` — it can rewrite a tracked file

The advice here used to be `eval "$(fnm env)" && fnm use`. **`fnm use <partial-version>` REWRITES `website/.nvmrc`.** Measured: `.nvmrc` pinned `24.18.0`, fnm had silently replaced that install with `24.19.0`, so plain `fnm use` failed with *"Requested version v24.18.0 is not currently installed"* — and the obvious recovery, `fnm use 24`, resolved to 24.19.0 **and wrote it into `.nvmrc`**. That is a tracked source file appearing as `M website/.nvmrc` in a diff you did not intend, exactly the [[verifier-fleet-leaves-source-mutations]] shape. It was caught only by reading `git status` before staging.

**Use PATH instead — it writes nothing:**

```bash
N24=/c/Users/leekh/AppData/Roaming/fnm/node-versions/v24.19.0/installation
export PATH="$N24:$PATH"          # then npm test / npm run build / npx vitest
```

`fnm list` shows what is actually installed (the versions drift under you). `eval "$(fnm env)"` alone is harmless; it is `fnm use` that writes.

⚠ **CI is unaffected by fnm's local installs** — `actions/setup-node` with `node-version-file: website/.nvmrc` DOWNLOADS the pinned version. So a locally-missing version is a local problem only; but a rewritten `.nvmrc` would change CI's runtime, which is why the mutation matters.

⚠ **`.nvmrc`'s value moves** (24.17.0 → 24.18.0 → …). Read the file; never carry the number in your head. A shell prompt line reading `Using Node vX` comes from a profile hook and can disagree with what `node -e` actually resolves — check `node -v` in the same command you are about to run.

Related: [[verify-running-branch-before-diagnosing]], [[dont-ask-mode-shell-workarounds]].
