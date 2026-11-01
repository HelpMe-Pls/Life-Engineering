---
name: stalled-count-two-surfaces-lesson
description: "The /admin \"Stalled\" KPI tile and the per-row Health badge are TWO surfaces that must share one definition; they had two stacked bugs (cache + logic) fixed 2026-06-30"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0153bfc5-5dcb-421d-ad82-a3410c4c9d21
---

The `/admin` Wave board shows "stalled" in **two independent places** that must always agree: the **KPI count tile** (`GlobalSummary`, rendered in `app/admin/layout.tsx`) and the **per-row Health badge** (`WaveBoard`, rendered by `app/admin/page.tsx`). They diverged via two *stacked* bugs (fixed 2026-06-30, PRs #174→#176, promotions #175/#177):

1. **Cache divergence (#174):** the tile lives in the **layout**, the rows in the **page**. The page is `force-dynamic` (always fresh); the layout was not. `updateSettings` called `revalidatePath('/admin')` which defaults to `type:'page'` → never invalidated the layout. Fix: `revalidatePath('/admin', 'layout')` **and** `export const dynamic = 'force-dynamic'` on `app/admin/layout.tsx`. Symptom was "count stale after threshold change + decays on its own" (isStalled is time-relative).

2. **Logic divergence (#176), hidden behind #1:** once the count rendered fresh, it still disagreed — "count 2, zero red rows". The tile counted **bare `isStalled()`** (no account awareness); the badge counts **`deriveHealth()`**, which returns `pending` for an account-less `data_collection` chapter BEFORE `isStalled` runs. So account-less, never-advanced, >threshold-old chapters were counted Stalled but shown Pending. Fix: shared pure helper `lib/rollout/summary-counts.ts` counts `deriveHealth(...)==='stalled'`; `GlobalSummary` now also fetches the `profiles` bound-account set (mirroring the page). Regression: `tests/stalled-count-vs-badge-divergence.test.ts`.

**Lesson / How to apply:** "stalled" has ONE definition — `deriveHealth` (`lib/rollout/health.ts`), which wraps `isStalled` (`lib/stalled.ts`) plus the Pending carve-out. **Never call bare `isStalled` for a user-facing count** — route through `deriveHealth`/`summarizeChapters`. And when a fix "doesn't take," check whether the surface is in the **layout vs the page** (different cache lifecycles) before assuming the logic is wrong — see [[verify-running-branch-before-diagnosing]]. The first fix can unmask a second bug; re-verify the *actual* symptom after shipping, don't assume one fix closed it.
