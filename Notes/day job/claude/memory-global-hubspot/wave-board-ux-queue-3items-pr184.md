---
name: wave-board-ux-queue-3items-pr184
description: "The 3 /admin Wave-board UX queue items (whole-header toggle, unclipped Health popover, move-chapter-to-wave) shipped to dev via PR"
metadata: 
  node_type: memory
  type: project
  originSessionId: 399c9ce6-f2ee-4e89-bf37-44d465f06f37
---

The **3 `/admin` Wave-board UX items** from the Engineering queue in `docs/plans/next-steps.md` shipped via PR #184 → `dev`, then **promoted to prod** via promotion #185 (merge `0f20685`, 2026-07-01) — bundled with the DEC-TERM prospect copy reword (#182). Prod deploy `dpl_73viKzGj…` READY (verified author), post-deploy smoke **success**, canonical domain 200. Docs close-out = PR #186 (`14d512a`) → `dev`. This **emptied the Engineering queue**; `dev`≈`main` (only the docs close-out commit differs, intentionally not promoted — a docs-only prod rebuild has no user benefit).

1. **Whole-header toggle** (`WaveBoard.tsx`): chevron+lead stays a real `<button>` (keyboard, owns `aria-expanded`); a **row-level `onClick`** covers the former dead zones (flex gap + `N chapters` count). The chevron button + `WaveDateEditor` both `stopPropagation` so the date edits without toggling and the row handler never double-fires. Unscheduled group stays a `/Unscheduled/` button (E2E `admin-tracker-stage` contract).
2. **Health popover un-clipped** (`HealthEditor.tsx`): portaled to `document.body`, `position:fixed`, positioned from the trigger rect (escapes the wave card's `overflow-hidden`). **Flips above** the trigger near the viewport bottom; outside-click check treats the portaled node as "inside"; Escape + two-step confirm still work.
3. **Move chapter to wave** (bulk + single): `moveChaptersToWave(ids, wave)` in `chapter-bulk-actions.ts` (mirrors `deleteChaptersBulk` — master_admin, ≤50, per-chapter audit), selection-bar "Move to wave…" control; `updateChapterWave(chapterId, wave)` in `actions.ts` + `<WaveEditor>` on chapter detail above Target go-live. See [[wave-unscheduled-null-not-zero]] (DEC-WAVE-NULL): 0-selection → NULL write via `lib/rollout/wave-selection.ts` (sync helper — a `'use server'` file may only export async). Audit action `chapter.wave.update`.

**Verification done:** typecheck/lint/test (570 pass, 11 env-skip)/build all green; 17 new unit tests; **live browser-verified against a local Supabase stack** — all 3 items persisted rows + `audit_log` confirmed. DB backstop `chapters_wave_range` = wave NULL or 1..23 (migration 0016).

Related: [[wave-board-enhancements-6item]], [[promotion-merge-convention]], [[local-browser-verify-recipe]].
