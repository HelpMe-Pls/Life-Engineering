---
name: wave-unscheduled-null-not-zero
description: "Wave board — \"Unscheduled\" is stored as chapters.wave = NULL in the DB; 0 is only an in-memory grouping sentinel, never written"
metadata: 
  node_type: memory
  type: project
  originSessionId: 399c9ce6-f2ee-4e89-bf37-44d465f06f37
---

On the /admin Wave board, **"Unscheduled" = `chapters.wave IS NULL` in the database**, never `0`.

`groupByWave` (`website/lib/rollout/group-by-wave.ts`) uses `0` ONLY as an in-memory sentinel key for the null-wave bucket so ad-hoc chapters sort last; no DB row actually has `wave = 0`. The board's `waveOptions` (`WaveBoard.tsx`) lists only non-null waves, and `updateWavePlannedStart` rejects `wave <= 0` (Unscheduled has no shared date).

**How to apply:** any "move a chapter to a wave" path (bulk `moveChaptersToWave`, single `updateChapterWave`, added 2026-07-01 for the Engineering-queue item 3) must map an "Unscheduled" (`0`) selection to a `null` write, and store `null` — not `0`. Storing `0` would create rows the ORDER BY / waveOptions don't expect. The `<select>` uses value `0` for the Unscheduled option (empty-string would collide with "no change"), then the action coerces `0 → null`.

Related: [[wave-board-enhancements-6item]].
