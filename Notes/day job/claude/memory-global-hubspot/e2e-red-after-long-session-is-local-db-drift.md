---
name: e2e-red-after-long-session-is-local-db-drift
description: A Playwright red at the end of a long session is accumulated LOCAL Supabase data until proven otherwise — reset before diagnosing
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a280c6e0-a6a1-46c2-8cbe-613bfc8f6ddf
  modified: 2026-08-30T12:02:17.181Z
---

`npm run test:e2e` went from 121/121 green to two reproducible reds (`e2e/tests/column-pinning.spec.ts`, `e2e/tests/altai-sync.spec.ts`) with **no change to the specs or the app** between the runs. Cause: a session's worth of fixtures had left 8 chapters spread over 4 distinct waves (`[null, 1, 2, 3]`), so the tracker rendered **two** tables and `getByRole('columnheader', { name: /^Name/ })` matched twice — strict-mode violation, not a product defect. `npx supabase db reset` → all 121 pass.

**Why:** reproducible ≠ caused by the branch. These specs assert on a rendered *shape* that depends on how many distinct waves exist, and every earlier spec, seed script and manual browser-verify in the session adds rows. The failure grows monotonically with session length, which is exactly why it shows up at the end — when the branch also happens to be at its most-changed, so the branch is the tempting explanation.

**How to apply:** before diagnosing ANY E2E red at the end of a long session, run `npx supabase db reset` and re-run the failing spec. Only if it still fails is it the branch's. Do not weaken a strict-mode locator to make two tables pass — the second table is the bug in the data, not in the assertion. See [[verify-running-branch-before-diagnosing]] (same class: the environment, not the code) and [[local-browser-verify-recipe]] for the reset-then-seed order.
