---
name: stalled-queue1-varianta-pr319
description: "2026-07-21: PR #319 bundles QUEUE-1 (training/readiness edits stamp last_activity_at) + Variant A Stalled explainer popover; full local gate green; dev-merge + dev→main promotion PR pending operator prod review"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3e8dc29e-1241-4d4c-aff3-c73f832c45e2
  modified: 2026-07-21T04:35:36.429Z
---

2026-07-21 session. Closed out the Agent-ready queue (QUEUE-1) and shipped the approved Stalled-UX enhancement, bundled into **PR #319 → `dev`** (branch `fix/queue-1-stalled-clock-activity-signal`, commits `a0d94da` QUEUE-1 · `78ae045` Variant A · `9d7399d` docs).

**QUEUE-1** — `updateTrainingStatus` + `updateGoLiveReadiness` (`website/app/admin/actions.ts`) now stamp `chapters.last_activity_at` in the SAME `.update()` write as their columns (mirrors stage-move `chapters/[id]/actions.ts:162,248`); no-op guards return before the write so an unchanged edit never bumps. Date-only edits stay excluded (inverse guard `scheduling-date-edits-no-activity.test.ts`). Tests strengthened in `training-readiness-update.test.ts` (`stamped()` helper). PM decision was default YES.

**Variant A** (operator-approved `/prototype`, **no badge day-count**) — the health-badge popover (`HealthEditor.tsx`, board-only; detail page has no HealthEditor) now explains a stalled row: definition + "No activity for N days" + days past threshold + what-counts-as-activity list + Advance lever. Design: `activityAgeDays()` extracted in `lib/stalled.ts` (shared by isStalled + popover); pure `stalledExplanation()` + `ACTIVITY_THAT_COUNTS`/`ACTIVITY_EXCLUDED` in `lib/rollout/stalled-explanation.ts`; `TrackerRow.stalledDetail` optional/nullable, computed server-side in `app/admin/page.tsx` only for stalled rows. Prototype artifact: https://claude.ai/code/artifact/a9cdc629-27ef-4055-8fd8-bc1c473a079a

**Gate (green, Node 24, `CI_BILLING_OUTAGE` still set so full local gate carried):** typecheck · lint · 1096 Vitest incl. live suites vs local Supabase (127.0.0.1) · build · 33 Chromium E2E. No migration (`0001`–`0028` unchanged).

**Status / next:** operator green-lit folding into `dev` + a `dev`→`main` promotion PR that WAITS for their prod review. DONE: #319 squash-merged to dev (`d2a04d1`); 3-agent adversarial review (correctness/tests/failures, both commits) came back **CLEAN/SOLID, zero defects** — folded the 2 optional LOW-sev strengthenings via **#321** (`50dd3a4`: `expectFreshActivityStamp` asserts the QUEUE-1 stamp is ≈now not just parseable; softened an overselling taxonomy-guard comment; scoped the popover render test to the dialog role). **Promotion #320 (dev→main, merge `a1f9296`) MERGED + DEPLOYED to prod 2026-07-21 — deployed smoke 4/4** (`BASE_URL=https://eochapterhubspotrollout.com npm run test:e2e:deployed`). Docs close-out #322 (`236f65f`) on dev trimmed Status to minimal; dev ahead of main only by that docs commit (normal). Fully shipped. Related: [[promotion-merge-convention]] (dev→main = plain merge commit, never --delete-branch; post-promotion run `BASE_URL=https://eochapterhubspotrollout.com npm run test:e2e:deployed`), [[branch-protection-needs-github-team]], [[deployed-smoke-baseurl-and-prod-marker]].
