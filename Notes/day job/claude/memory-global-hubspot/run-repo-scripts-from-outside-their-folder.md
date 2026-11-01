---
name: run-repo-scripts-from-outside-their-folder
description: "How to run website/ and event-sync scripts from another cwd without cd — pinned tsx.cmd by absolute path, --tsconfig for the @/ alias, --env-file forwarded by tsx; npm exec --prefix does NOT change cwd and resolves \"node\" as a registry package; Git Bash eats bare backslashes"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 3c3d1c45-5f61-4659-ac0c-f544df616df2
  modified: 2026-10-28T14:47:12.755Z
---

Verified on 2026-10-28 while writing an unattended prompt (five verifier agents, read-only):

- `website/scripts/events-dry-run.ts` fails from the repo root with `Cannot find module '@/lib/assert-never'`: the `@/` alias resolves only through `website/tsconfig.json`. Working shape from any cwd: `fnm exec --using=24.21.0 -- C:/…/website/node_modules/.bin/tsx.cmd --tsconfig C:/…/website/tsconfig.json C:/…/website/scripts/events-dry-run.ts show "…"`. The script loads `website/.env` relative to its own file, so cwd does not matter for its keys.
- event-sync's CLI from any cwd: `fnm exec --using=24.21.0 -- C:/…/event-sync/node_modules/.bin/tsx.cmd --env-file=C:/…/event-sync/.env.sandbox C:/…/event-sync/src/cli.ts sync --dry-run true` — tsx forwards `--env-file` to the pinned Node; `src/cli.ts` reads its package.json via `import.meta.url`, nothing relative to cwd.
- `npm.cmd --prefix <dir> exec -- node …` does NOT run in `<dir>` (it printed the caller's cwd) and npm resolves `node` as the npm package `node@…` and downloads it. Never use it as a cd substitute for `exec`; `npm --prefix <dir> run <script>` is the form that runs in `<dir>`.
- A bare `--import tsx` from a folder without `node_modules` throws ERR_MODULE_NOT_FOUND.
- In a Git Bash call an unquoted `C:\Users\…` path arrives as `C:Users…`: write forward slashes or quote the path.

**Why:** the cd-deny hook and the no-compound-cd rule leave only absolute-path forms, and the obvious npm-exec substitute silently does the wrong thing (wrong cwd, wrong Node).

**How to apply:** when a prompt or a run needs a repo script from the home repository's cwd, use the repo's own pinned `.bin\tsx.cmd` with absolute forward-slash paths, add `--tsconfig` for anything under `website/`, and keep `env NAME=value` in front for keys. Related: [[pretooluse-deny-hook-kills-cd-prompts]], [[fnm-exec-needs-npm-cmd-on-windows]], [[dont-ask-mode-shell-workarounds]].
