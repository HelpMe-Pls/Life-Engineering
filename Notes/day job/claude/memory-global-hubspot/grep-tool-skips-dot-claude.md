---
name: grep-tool-skips-dot-claude
description: "The Grep tool skips `.claude/` (hidden dirs), so \"No matches found\" is NOT proof a path is unreferenced — 33 refs in 20 files were invisible"
metadata: 
  node_type: memory
  type: project
  originSessionId: a280c6e0-a6a1-46c2-8cbe-613bfc8f6ddf
  modified: 2026-08-31T13:36:15.754Z
---

The Grep tool is ripgrep-based and honours `.gitignore` plus hidden-file rules, so it **does not search `.claude/`**. `Grep("project-status")` returned **"No matches found"** while an unscoped `grep -rn` found **33 references across 20 files** — 8 `.claude/agents/*.md` and 12 `.claude/skills/*/SKILL.md`, one of them `pm-project-status`, whose whole job is to generate `docs/project-status.html`.

**Cost:** I wrote "Nothing in the tree references it — checked" into a commit message on the strength of that empty result. Caught only because the slow unscoped grep I had already backgrounded finished afterwards and contradicted it.

**The trap's shape:** a false negative that reads as a completed check. Same family as [[git-rev-path-mangled-by-msys]] — the tool answers confidently about a place it never looked.

**Rule:** before claiming a path/symbol is unreferenced, search `.claude/` explicitly — `grep -rn <needle> .claude/` — or pass `path: ".claude"` to Grep. This repo keeps agent and skill definitions there, and they cite repo paths constantly.

⚠ **And scope the unscoped grep**: a plain `grep -rn` from the repo root times out on `node_modules` (it did, at 120 s). Grep `.claude docs website/lib website/app website/tests website/e2e` rather than `.`, and remember `rg` is not on PATH in Git Bash here. Related: [[dont-ask-mode-shell-workarounds]], [[report-that-names-its-own-fix-must-be-measured]].
