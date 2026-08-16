# Skill Playbook Appendix — maintainer notes

*Extracted 2026-08-14 from `Claude Code Skill Playbook.md` so the playbook stays skim-grade for non-technical contributors. Nothing here is needed to use the recipes.*

## Machine facts (verified 2026-07-30 on Claude Code 2.1.220)

- Skill stacking active: ≤6 leading, consecutive `/commands`; all trailing text becomes ONE shared `$ARGUMENTS`; the first non-skill token ends the stack; an unknown leading token (typo) silently de-stacks everything.
- Hidden skills (most of Matt's pack: `implement`, `to-spec`, `to-tickets`, `wayfinder`, `triage`, `handoff`, `grill-with-docs`, `grill-me`, `improve-codebase-architecture`) never appear in the model's registry; the deterministic trigger is typing them at message start, in colon form (`/mattpocock-skills:implement` …).
- `/goal` (built-in, v2.1.139+) is a command, not a skill: nothing stacks with it; skill names inside a condition are data, never invocations — hidden skills stay invisible to the goal-working model. Pattern: two messages — skills/context first, then `/goal`; goal turns inherit the session. `/goal` is the until-condition looper; `/loop` is the interval/recurring one.
- Every skill is invoked in its plugin's colon form (`/mattpocock-skills:tdd`, `/superpowers:frontend-design`, …); stacking works the same with namespaced names. Bare names belonged to the retired npx-era copies. Note: `frontend-design` is NOT in the mattpocock-skills plugin (v1.2.3) — the playbook's UI-prototype variant uses `/superpowers:frontend-design`. `/compact` only at phase boundaries.
- Pack install (since 2026-08-14): the `mattpocock-skills` plugin from the `claude-plugins-official` marketplace — `/plugin install mattpocock-skills@claude-plugins-official`, updates via `/plugin` → Installed; the skill registry is built at session start. Retired npx era: `npx skills add mattpocock/skills -g -y` → `~/.agents/skills`, junctioned into `~/.claude/skills` (source in `~/.agents/.skill-lock.json`) — remove leftover copies to avoid duplicate menu entries; with colon-form boxes they can no longer be invoked by accident.

## Session-shape rules

- Driver + passengers: exactly one process skill per prompt (`implement`, `grilling`, `wayfinder`, `diagnosing-bugs`, `triage`, `prototype`, `code-review`); passengers are reference layers (`tdd`, `codebase-design`, `domain-modeling`, `frontend-design`, platform packs). Never two drivers. Sole carve-out: recipe 3's map stack `/wayfinder /grilling` — grilling rides as the map's interrogation layer.
- One phase, one context: review in its own session, each implement fresh, grill → spec → Issues unbroken; near the ~120k smart zone, update the spine and `/handoff` if mid-phase. Recipe 5's drain and recipe 6's small-PR loop consciously trade the fresh-context split for walk-away autonomy; big PRs escalate to B1–B3, where termination is a property of the spine file, never one session's say-so.

## Three laws for `/goal` conditions

1. **Displayed evidence only** — the transcript-only Haiku evaluator can check "⚡ section shown after the last edit", "test shown red then green", "PR URL pasted"; it cannot check "all issues resolved". The ⚡ queue is the scoreboard.
2. **Skill names in a condition are data** — load everything in M1; a goal loops ONE accumulating window, so big adversarial work escalates to the fresh-context variants.
3. **Pre-answer the answerable, pause on the strategic** — tactical policy comes from the repo's established git hygiene (written rules — repo docs + the `DEC-*` files in `docs/adr/` — first, merged-PR practice where they're silent; a call nothing answers is itself DEC-worthy; a merely-blocked item → 🧑 note, continue), but a DEC-worthy fork (hard to reverse, product intent, a new seam) pauses the run. Exception: a new seam mid-Requirements never pauses — `/to-spec` files it as an OPEN marker plus a 🧑 line. Every 🚶 goal carries the pause as an OR-arm — a paused run has *met* its goal; the "still unanswered by me" guard keeps a re-armed goal from free-riding on an already-answered pause.

## Enforcement map

The pack skills enforce the three CLAUDE.md blocks at the seams: `/to-spec` pins the test seams before any code; `/tdd` rides every build/fix stack (its tests.md + mocking.md carry the anti-patterns); `/implement` commits per green slice on the current branch; `/superpowers:finishing-a-development-branch` runs the merge/PR/cleanup decision; `/resolving-merge-conflicts` owns conflicts; `/code-review since <integration branch>`'s Standards axis checks conformance back at the branch point.

## Recipe 2a design notes

"Add a line of text" is a feature to a vibecoder, but grill → spec → Issues is disproportionate for it, so 2a goes straight to `/tdd /implement` (journey 2a → 7). Its guards: the standard pause valve plus an explicit outgrew-a-tweak trigger (product call / new seam / more than one small slice — the agent classifies size, never the vibecoder), a blocked → 🧑 arm, and it logs a **checked-off** ⚡ line linking the PR so recipe 7's Ship goal ("the shipped item's line deleted") stays satisfiable verbatim. `/tdd` stays in the stack for tweaks that do touch behavior; the testing-discipline block licenses zero tests for pure copy/styling. Review (6) is optional by design — the PR, the green suite, and the repo's branch protection are the net.

## Advanced variants (cut from the recipes for skimmability)

- Build on a platform with its own skill: stack it — `/tdd /implement /supabase:supabase …`.
- Independent ⚡ items in parallel: one session per item, each in its own worktree (`/superpowers:using-git-worktrees`).
- Deeper GitHub-PR review panel for B1: `/pr-review-toolkit:review-pr <N>` (silent-failure hunter, test-coverage analyst, type-design), same REPORT-ONLY contract.

## Housekeeping

- From superpowers keep four: `using-git-worktrees`, `finishing-a-development-branch`, `dispatching-parallel-agents`, `verification-before-completion`. The rest duplicates Matt's flow — prefer the typed commands.
- `/handoff` bridges a **conversation** (temp file, mid-phase); the spine bridges **work** (repo file, between items). Session minutiae never go into the spine.
- Ubiquitous language source: the pack's `CONTEXT.md` (in the plugin cache) — **Issue tracker**, **Issue**, **Decision ticket**, **Triage role**; "ticket" and "backlog" are retired terms. Playbook prose stays in ASD-STE100 Simplified Technical English; template boxes are machine-facing and never simplified.

## Revision history

- 2026-07-30 — rebuilt around the spine: Day-0 bootstrap, per-phase fire-and-forget entries with HITL pause valves, Matt Pocock's pack as the process layer.
- 2026-08-01 — prompts defer to each target repo's established git hygiene; DEC-GIT-FLOW demoted to a recorded fallback.
- 2026-08-14 — rewritten in ASD-STE100 for zero-code contributors: intent chooser table, explicit `<placeholders>`, HITL promise (start + end, pause as the exception), terms aligned to the pack's `CONTEXT.md` (Issue, never ticket), B1's PR checkout folded into its message, the setup prompt's playbook path made a placeholder.
- 2026-08-14 (later) — minimized for skimming: glossary dissolved into inline glosses, ✏️ fill / 📋 send-as-is box markers, recipes renumbered 1–11, agent-only reference blocks collapsed under `<details>`, maintainer content extracted to this appendix.
- 2026-08-14 (later still) — recipe 2a Quick change added: tweak-sized fast path (2a → 7) with an outgrew-a-tweak escape valve back to recipe 2; recipe 2 no longer claims "any size".
- 2026-08-14 (plugin switch) — install and invocation moved from the npx global pack to the `mattpocock-skills` plugin (claude-plugins-official marketplace, v1.2.3): every box uses `/mattpocock-skills:<skill>`; the UI-prototype variant uses `/superpowers:frontend-design`.
- 2026-08-14 (decisions split out) — `DEC-*` records left the spine's Reference section for `docs/adr/`, one file per call named for its ID (`docs/adr/DEC-GIT-FLOW.md`), per the pack's own ADR convention in `domain-modeling/ADR-FORMAT.md`. The pack's sequential `0001-slug.md` numbering is deliberately overridden — the `DEC-*` ID is the file name, so `/goal` conditions and prose can name a decision without a lookup. The spine now points at the folder and keeps only *un-ratified* decisions visible, as 🧑 lines; recipe 4's proposed verdict became `status: proposed` frontmatter plus a 🧑 line, which is what keeps its operator-confirms loop transcript-observable. Recipe 3's frontier box carries the naming clause explicitly — `domain-modeling` rides that stack and is the one skill that writes ADRs on its own, so its sequential default must be overridden in the box, not just in CLAUDE.md.
