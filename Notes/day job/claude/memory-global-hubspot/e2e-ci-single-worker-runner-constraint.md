---
name: e2e-ci-single-worker-runner-constraint
description: "The Playwright E2E suite must run single-worker on GitHub-hosted CI — the ~2-vCPU runner also hosts local Supabase + the prod Next server, so workers>1 starves it and the heavy journeys flake"
metadata: 
  node_type: memory
  type: project
  originSessionId: d3e375b5-ca14-4087-8ca3-f787e0830d08
---

`website/playwright.config.ts` uses `workers: isCI ? 1 : 4` (+ `expect.timeout` 15s and test `timeout` 60s on CI). 4 workers is flake-free on a dev box, but a GitHub-hosted `ubuntu-latest` runner (~2 vCPU on a private repo) ALSO runs the full local Supabase stack (Postgres/GoTrue/Kong/Storage/…) **and** the prod `next start` server in the same box. At `workers:4` the upload-heavy, data-creating journeys (per-test UI login, chapter upload, admin tracker stage advance/regress) **time out** — timeout-based assertion failures, NO server errors, one flaky-then-green — while anonymous/shared-`storageState` tests pass. Throttling CI to single-worker is the **D-FLAKE-sanctioned** fix: it's a resource throttle, NOT an isolation substitute (isolation stays the per-run nonce, never the worker count).

Confirmed 2026-06-22: the gate `CI gate (Chromium, local Supabase)` failed **7/22** at `workers:4`, then went **fully green** at `workers:1`. When CI E2E flakes, check the worker count / runner size FIRST — do NOT weaken assertions. Part of Phase 2 CI/CD (issue #124, PR #125). See [[e2e-cicd-local-supabase-prod-safety]], [[vitest-live-suites-run-in-ci-loadenv]].
