---
name: wave-board-enhancements-6item
description: "The 6 /admin Wave-board enhancements (next-steps.md queue) — locked decisions, filter-slot model, prop-adopt pattern, Bangkok alias artifact. Shipped 2026-07-01 (PR"
metadata: 
  node_type: memory
  type: project
  originSessionId: 40a0b9aa-346f-45ee-a88a-5877753b9d60
---

The 6 `/admin` Wave-board enhancements from next-steps.md "Engineering queue" — built + browser-verified + shipped 2026-07-01 (PR #179 → dev; then dev→main promotion). Design: `docs/superpowers/specs/2026-06-30-wave-board-enhancements-design.md`.

**Locked stakeholder decisions:**
- **DEC-WB1 (item 1):** editing a Wave header's `starts on <date>` **batch-updates `planned_start` for every chapter in that wave** (`updateWavePlannedStart(wave, date)` in `app/admin/actions.ts`, one audit row `chapter.wave.planned_start.update`). Friendly display preserved exactly; toggle + date are SIBLINGS (a control inside `<button>` is invalid HTML).
- **DEC-WB6 (item 6):** Health editor edits the **signal** (advances stage via existing `advanceStageWithNote`); Health stays derived (`deriveHealth`), **no override column**. Plain-language confirm when advancing an account-less Pending chapter (`lib/rollout/health-edit-guidance.ts`).
- **Both** date columns display **DD-MM-YYYY** (`lib/rollout/format-dmy.ts`, split-on-`-`, never `new Date(iso)`); edit inputs stay ISO. Stakeholder later asked to retrofit Planned Start too.

**Item 3 filter model (the subtle one):** a single XOR `CardFilter = {kind:'stage'} | {kind:'health'} | null` slot (`lib/rollout/card-filter.ts`); the stage `<select>` is the dropdown UI for the stage half of the SAME slot (no parallel stage state). KPI tiles (in the layout, split into client `SummaryTiles`) link `?stage=`/`?health=stalled`; board reads the param. `RowFilters` gained `health`.

**Bangkok alias artifact (verified):** the target-go-live backfill's local dry-run flags `Bangkok Metropolitan` as unmatched, but PROD matched 228/228 — prod's real chapter is `Bangkok Metro` and `CHAPTER_KEY_ALIASES` maps `bangkok metropolitan→bangkok metro`. Local shows the miss because the wave-schedule backfill *inserted* a chapter literally named `Bangkok Metropolitan`. Prod `target_go_live` backfill applied + verified (228/228, `scripts/backfill-target-go-live.ts --apply --allow-remote`). See [[local-browser-verify-recipe]].

Related: [[stalled-count-two-surfaces-lesson]] (deriveHealth is the one source of truth), [[promotion-merge-convention]].
