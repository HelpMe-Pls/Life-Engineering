---
name: builtin-skills-live-inside-claude-exe
description: "Unprefixed skills like dataviz/artifact-design/simplify are first-party built-ins compiled into claude.exe — nothing on disk to read, and they carry no author metadata"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 27c93d16-d310-43f0-b601-2260a238e5c8
  modified: 2026-07-28T13:54:34.658Z
---

A skill listed with **no plugin prefix and no path prefix** (`dataviz`, `artifact-design`,
`artifact-capabilities`, `simplify`, `run`, `review`, `security-review`, `claude-api`, …) is a
**first-party Claude Code built-in compiled into the binary**, not a file anywhere on disk.
Do not waste calls searching `~/.claude/skills`, `~/.agents/skills`, `~/.claude/plugins`, npm/bun
global `node_modules`, or the VS Code extension — none of them contain it. A whole-filesystem
`find` for a bundled reference file (e.g. `references/palette.md`) returns nothing and times out.

**How to actually read one** — grep the shipped binary:
`/c/Users/leekh/.bun/install/global/node_modules/@anthropic-ai/claude-code-win32-x64/claude.exe`
(~265 MB). Read it with node, `indexOf` the skill name, and dump ±KB around the hits. Two useful
landmarks: the built-in **registry** (`var xUe="artifact-design",…,Tvo="dataviz",…` — the full list
of built-in skill ids) and the **registration call** (`ou({name:Tvo, menuDescription:…,
userInvocable:!0, files:()=>…SKILL_FILES …})`), whose `SKILL_FILES` map literally names every
bundled reference/script. The verbatim `SKILL.md` (YAML frontmatter and all) sits nearby as a JS
template literal. Extract the region to the scratchpad and `grep -n '^#'` it rather than dumping.

**Two conclusions that follow, both non-obvious:**
- **There is no author to name.** Built-in frontmatter carries only `name:` and `description:` —
  no author/credit/copyright/license field, and no "Anthropic" string near the skill body. Nearby
  `author` grep hits belong to *other* skills' prose (the `/design` skill). The honest answer to
  "who wrote it" is "Anthropic ships it in Claude Code"; anything more specific is invented.
- **Bundled scripts are not on disk until the skill is invoked.** `files:` is a lazy provider, so
  you cannot `cat`/`node` a built-in's script (e.g. `scripts/validate_palette.js`) ahead of time —
  invoke the skill and use the base directory it gives you.

Feature-flag names appear as `tengu_*` (`tengu_cobalt_plinth_dataviz` gates the dataviz
cross-reference callout *inside* artifact-design, NOT the dataviz skill itself) — don't read a flag
as evidence a skill is disabled.

Related: [[pocock-skills-installation]] (which *symlinked* skills are typed-only),
[[skills-churn-is-local-windows-artifact]].
