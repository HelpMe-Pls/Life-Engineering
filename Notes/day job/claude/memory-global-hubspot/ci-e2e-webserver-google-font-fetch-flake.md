---
name: ci-e2e-webserver-google-font-fetch-flake
description: "CI gate can fail red in the E2E step's WebServer build with a next/font/google Turbopack \"Module not found @vercel/turbopack-next/internal/font/google/font\" — a transient fonts.gstatic.com fetch failure, NOT your diff; re-run the failed job"
metadata: 
  node_type: memory
  type: reference
  originSessionId: bff57f04-15a7-48e3-a4dc-467fa1228444
---

The **CI gate (Chromium, local Supabase)** can fail at the **E2E (Playwright) step** during the `[WebServer]` Turbopack build with:

```
[WebServer] Error while requesting resource
[WebServer] There was an issue requesting https://fonts.gstatic.com/s/plusjakartasans/.../*.woff2
[WebServer] Turbopack build failed with 1 errors:
[WebServer] .../internal/font/google/plus_jakarta_sans_*.module.css:7:8
[WebServer] Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
  Import trace: ... ./website/app/layout.tsx
Error: Process from config.webServer was not able to start. Exit code: 1
```

This is a **transient network flake**: Next's `next/font/google` (PlusJakartaSans in `app/layout.tsx`) fetches the woff2 from `fonts.gstatic.com` **at build time**, and when the runner can't reach it the Turbopack font module fails to resolve → the E2E WebServer never starts → the gate goes red. It is NOT caused by your diff (seen 2026-07-03 on PR #202, whose 3 files were WaveBoard/page.tsx/a test — nothing near `layout.tsx`/fonts).

**How to apply:** when a red CI gate's `--log-failed` shows this `fonts.gstatic.com` / `internal/font/google/font` build error, DON'T hunt your diff — **re-run the failed job** (`gh run rerun <run-id> --failed`). Confirmation tells: a SIBLING PR that uses the same `app/layout.tsx` font passed green at the same time (proves it's transient, not a regression), and your changed-files list doesn't include `layout.tsx`/fonts. #202 went red → `rerun --failed` → green (7m). Distinct from the [[ci-gate-502-edge-runtime-analytics]] (analytics/edge_runtime crash) and [[ci-supabase-start-ecr-pull-rate-limit]] / [[ci-hermetic-supabase-port-flake]] (supabase-start pull/port flakes) — those are setup-step failures; this one is in the E2E WebServer build. Durable fix (if it recurs often): self-host the font (`next/font/local`) so no build-time network fetch. **Reminder: `gh pr view --json mergeable` = git-level MERGEABLE (no conflicts), NOT CI-green — always check `gh pr checks` for the actual gate before calling a PR mergeable.**
