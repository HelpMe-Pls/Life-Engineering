---
name: fnm-exec-needs-npm-cmd-on-windows
description: "On the Windows host, `fnm exec --using=24.21.0 -- npm …` fails 'program not found'; use `npm.cmd`. git.exe works as-is, so a gated push under Node 24 is `env GIT_SSH_COMMAND=… fnm exec --using=24.21.0 -- git -C <wt> push …`"
metadata:
  node_type: memory
  type: reference
  originSessionId: 0b9510c6-539e-4483-960c-f74580574388
  modified: 2026-10-07T07:52:35.540Z
---

The default Node on the operator's Windows machine is v26 (`fnm list`: `v26.9.0 default`), while `website/.nvmrc` pins 24.21.0. To run under the pinned version without `cd` or `fnm use`:

- `fnm exec --using=24.21.0 -- npm.cmd --prefix <abs>/website ci` (or `run test:fast -- …`). Plain `npm` fails with "Can't spawn program: program not found": fnm spawns a real executable, and npm on Windows is a `.cmd` shim. Measured 2026-10-07.
- `env GIT_SSH_COMMAND="ssh -o ServerAliveInterval=30 -o ServerAliveCountMax=120" fnm exec --using=24.21.0 -- git -C <abs-worktree> push -u origin <branch>` runs the pre-push gate under Node 24 with the keepalive from [[long-pre-push-hook-drops-ssh]]. `env` goes OUTSIDE `fnm exec` (fnm cannot spawn `env` either).
- A fresh worktree under `.claude/worktrees/` has no `node_modules`: `npm.cmd ci` first (about 2 minutes), or the gate's `build` fails.
