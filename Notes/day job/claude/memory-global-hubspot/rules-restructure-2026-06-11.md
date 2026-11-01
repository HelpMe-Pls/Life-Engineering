---
name: rules-restructure-2026-06-11
description: "website/CLAUDE.md guardrails live in .claude/rules/ since 2026-06-11 (path-scoped website/ rules + commit-style.md) — PR #45 squash-merged to dev, loading verified by headless probes"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3fc3dcfe-449a-47c4-9d44-040ba5bbbda6
---

On 2026-06-11 the operator asked for website/CLAUDE.md to be simplified per latest Claude Code conventions. The engineering contract moved to path-scoped rules (`paths:` frontmatter — official key per code.claude.com/docs/en/memory; `globs:` claims in community posts are wrong): `.claude/rules/website/{typescript,architecture,errors-and-state,testing,web-surface}.md` scoped to `website/**/*`, plus always-on `.claude/rules/commit-style.md`. Two repo-wide rules (never read `.env*`; backup before irreversible data ops) were absorbed into `global-engineering.md`. website/CLAUDE.md (314→185 lines) now holds only operating context: precedence, domain language, where-to-look, chapter-rollout runbook.

**Why:** `@`-imports do NOT save context (they load at launch); only `paths:`-scoped rules load conditionally. Subdir CLAUDE.md and path-scoped rules share the same lazy trigger (loads when Claude reads matching files), so the move is context-neutral.

**How to apply:** Landed via PR #45, squash commit `7059ac7` on `dev` (2026-06-11, merge authorized by Kh0iLe in-session): the restructure + the operator's chapter→region task handoff in `docs/plans/next-steps.md` + the source xlsx `resources/[Assoc] Chapters + Region.xlsx` (223 rows; drop "EO UK-London (Wave 6)" → 222 pairs, 11 regions). Loading verified with two headless `claude -p` probes: fresh session loads exactly Global Engineering Rules + Commit Messages; reading any `website/` file injects the five `Website ·` rules. Treat the rule files as the contract's home — edits to engineering guardrails go there, not back into `website/CLAUDE.md` ([[promotion-merge-convention]] still applies when promoting to main).
