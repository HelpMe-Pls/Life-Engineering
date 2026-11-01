---
name: ci-gate-502-edge-runtime-analytics
description: "The CI-gate \"supabase start Error status 502\" was a REAL bug (edge_runtime/analytics), not a flake — fixed by disabling both in config.toml (#194)"
metadata: 
  node_type: memory
  type: project
  originSessionId: b450e11a-386e-46ae-a46c-d158e2a3ca86
---

The CI gate's `supabase start failed after 5 attempts` / **`Error status 502`** at the *Hermetic toolchain + local Supabase* step was **NOT** the ECR/port transient flake that [[ci-supabase-start-ecr-pull-rate-limit]] and [[ci-hermetic-supabase-port-flake]] describe — do not reflexively `gh run rerun` a 502. Distinguish by the log: a rate-limit shows `toomanyrequests`/`denied` **during image pull**; the 502 here appears **after** all images pull fine, at `Waiting for health checks…` → `supabase_edge_runtime_website container logs:` → `Stopping containers…` → `Error status 502`.

**Root cause (diagnosed 2026-07-02 via /diagnosing-bugs, reproduced locally with `docker ps -a`):** the `supabase_vector_website` container (the `[analytics]` Logflare log shipper) **crash-loops** — its `docker_logs` source can't reach the Docker socket on CI/newer Docker (`Listing currently running containers failed … ConnectionRefused`), so it exits and restarts forever. `edge_runtime` depends on that analytics sink, so it never reports `(healthy)`; `supabase start`'s health-check wait times out on it → 502. Timing-dependent, so it looked intermittent (~4% of runs, but hammered the promotion PR).

**Fix (#194, merged to prod):** this app ships **no Edge Functions** (no `supabase/functions` dir, no `functions.invoke`/`/functions/v1` in app code) and needs no local Logflare analytics (prod obs = Sentry). Set `[edge_runtime] enabled = false` and `[analytics] enabled = false` in `website/supabase/config.toml` (both carry a `# NOTE:` explaining why). Verified: `supabase start` clean, `db reset` clean, Vitest 583 pass / **0 skipped** (live RLS/notification suites hit local Supabase), Playwright E2E 22/22, and #194's own CI gate went green (7m6s) + two consecutive green #192 runs after.

**How to apply if it recurs:** first `docker ps -a --filter name=supabase` on a fresh `supabase start` — if `vector`/`edge_runtime` are `Restarting`/never-`(healthy)`, it's this, not a flake. Keep those two disabled unless the app adds an Edge Function or genuinely needs local analytics.
