---
name: prod-region-topology-iad1-vs-sin
description: "Prod perf ground truth — Supabase project is in Singapore, Vercel fns defaulted to iad1; the ~2s /admin nav was 3 serial auth legs × cross-Pacific RTT; fixed by website/vercel.json regions:[\"sin1\"] (PR"
metadata: 
  node_type: memory
  type: project
  originSessionId: c59f4c0f-c357-4504-ab72-a8ba06e8cb0c
---

Measured 2026-07-02 (PERF-ADMIN-NAV): the Supabase project (`lcymicrbcsvssgleplml.supabase.co`) is served from **Singapore** (cf-ray SIN; ~88ms warm keyless RTT from Vietnam), while Vercel functions ran in **iad1** (US East — the never-overridden default) and the Next 16 proxy runs as **serverless** middleware (same region). Every authed nav = 3 serial Supabase legs (proxy getUser → gate getUser → profiles) × ~220–240ms ≈ the uniform ~2s the stakeholder reported on **every** /admin page — including data-trivial /admin/settings, which is what exonerated the unbounded stage_history/intake_files reads as the dominant cost (they ride one parallel leg; growth insurance stays opportunistic).

**Fix:** `website/vercel.json` `{"regions":["sin1"]}` (config-as-code; PR #197), locked by `tests/vercel-region.test.ts` which carries the full rationale. Pre-fix public baseline for the post-promotion check: /login TTFB from VN = **414ms** (expect <200ms after sin1 is live; authed /admin ~2s → expect ~350–600ms).

**How to apply:** any future "X is slow in prod" here — check region topology FIRST (deployment `regions`, cf-ray POP, keyless RTT probe) before profiling app code; the serial auth legs are the sanctioned Supabase-SSR pattern and must not be trimmed. Note: direct prod-DB reads (even read-only service-role scripts) are classifier-denied — use public keyless probes, Vercel read-only APIs, and DNS instead. Related: [[e2e-cicd-local-supabase-prod-safety]].
