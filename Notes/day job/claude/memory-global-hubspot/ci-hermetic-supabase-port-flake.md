---
name: ci-hermetic-supabase-port-flake
description: "CI 'Hermetic toolchain + local Supabase' step can flake on 'failed to bind host port 0.0.0.0:54324 … address already in use' (Inbucket/Mailpit) during supabase start — transient runner port contention, NOT a code failure. Remedy: gh run rerun <id> --failed, don't assume your diff broke CI."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 02f789e9-4c9c-4d96-9a07-82d5b4e89342
---

The `ci.yml` gate's FIRST step (`setup-hermetic-supabase` composite → `supabase start`) occasionally fails BEFORE any code runs — typecheck / lint / Vitest / build / e2e all show `-` (skipped) — with:

```
failed to start docker container "supabase_inbucket_website": Error response from daemon:
failed to set up container networking: ... failed to bind host port for
0.0.0.0:54324:172.18.0.7:8025/tcp: address already in use
```

Port `54324` = the local Mailpit/Inbucket mail-catcher. This is **transient GitHub-runner port contention** (a leftover/parallel container holding 54324), NOT a code or migration problem.

Proven 2026-06-23 on PR #132 (`audit/30day-hardening`): first attempt failed at setup in **3m47s**; a plain re-run passed the FULL gate in **8m17s** with zero code changes — and the same diff had already passed locally (live RLS 387/0 + Playwright E2E 22/22).

**Remedy:** `env -u GH_TOKEN gh run rerun <run-id> --repo EO-Vietnam/global-hubspot --failed`, then re-watch with `env -u GH_TOKEN gh pr checks <pr> --watch`. When the failed step is "Hermetic toolchain + local Supabase" and NO gate step ran, read the log for the port-bind line FIRST — do not assume the diff broke CI. (Distinct from [[e2e-ci-single-worker-runner-constraint]], which is about worker count during the e2e step itself.)
