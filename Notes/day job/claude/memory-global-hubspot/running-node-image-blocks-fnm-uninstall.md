---
name: running-node-image-blocks-fnm-uninstall
description: "On Windows `fnm uninstall <v>` dies with \"Access is denied (os error 5)\" when a live process still maps that version's node.exe — and Get-Process shows the multishell symlink, not the version actually mapped"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 1bd16e29-2985-4823-a18e-dc44185afb26
  modified: 2026-08-23T13:49:18.985Z
---

`fnm uninstall 26.5.0` → `error: Can't delete Node.js version: Access is denied. (os error 5)`.

**It is not fnm, an ACL, or a read-only flag.** Everything else deletes; exactly one file refuses:
`…\fnm\node-versions\v26.5.0\installation\node.exe`. The tell is the pair of results —
**delete → error 5, rename → succeeds.** That combination means *a running process's mapped
executable image*. An ACL problem refuses both; an ordinary file lock is error **32**, not 5.
A scan for locked files and read-only attributes finds **nothing**, so those probes mislead.

⚠ **The two halves of fnm live on different sides of AppData**, which wastes a probe every time:
multishells are under `%LOCALAPPDATA%\fnm_multishells\`, but the versions and aliases are under
**`%APPDATA%\fnm\`** (Roaming) — `%LOCALAPPDATA%\fnm\node-versions` does not exist, and listing it
returns nothing rather than erroring, which reads like "no versions installed".

**Why the holder is invisible.** Long-running node processes launch via
`%LOCALAPPDATA%\fnm_multishells\<pid>_<ts>\node.exe`, a junction to
`%APPDATA%\fnm\aliases\default`. Running `node --version` *through that junction* reports the
version `default` points at **now**, never the image a live process mapped — so it is not evidence
about the holder either.
`Get-Process node | Select Path` reports **that symlink**, so every process looks like it is on
whatever `default` points at *now*. The image each one actually mapped is what `default` resolved
to **when it started**. Repoint `default` and the old processes keep the old version pinned open,
while every tool says otherwise. Correlate **process StartTime against the `default` alias's
LastWriteTime** — that is what proves it.

Here the holders were this Claude Code session's own node processes (MCP servers/hooks), started
before `default` moved to v26.7.0.

**How to finish it anyway:** delete the tree (everything but `node.exe` goes), then **move the
residue out of `fnm\node-versions\`** — a non-semver name is invisible to fnm, so `fnm list` is
clean and the uninstall's goal is met. Delete the residue after the holding processes exit.

Related: [[closeout-recheck-commit-and-node24]] (Node 26 crashes Vitest; `fnm use <partial>`
rewrites the tracked `website/.nvmrc` — set PATH to the installation dir instead).
