---
name: next16-build-beside-dev-but-one-dev-per-folder
description: "On Next 16, `next build` (the pre-push gate) runs beside a live `next dev` without killing it, but a SECOND `next dev` in the same folder is refused by a lockfile"
metadata:
  node_type: memory
  type: reference
  originSessionId: d720e5c1-639b-4661-9daf-7ea2914666d7
  modified: 2026-10-26T11:08:48.914Z
---

Measured 2026-10-26 (PR #1160): a `next dev` someone else started at 4:03 PM on :3000 (PID 42376) survived two pre-push `next build` runs from the same `website/` folder. Next 16 writes dev output to `.next/dev`, so build and dev no longer collide (`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` → "Concurrent `dev` and `build`"). The spine's 🔧 trap 2 line "`npm run build` and E2E kill a live `next dev`" is stale for build (E2E not re-checked).

The other half: a second `next dev` in the same folder starts on :3001, prints Ready, then exits with "Another next dev server is already running" plus the PID. So a screenshot run against a LOCAL Supabase is blocked while anyone's dev server holds the folder, and that server's env is unknown (likely `website/.env` = PRODUCTION), so never drive it with e2e credentials or seed through it.

**How to apply:** don't stop a dev server you did not start; check its start time and command line first (`Get-CimInstance Win32_Process -Filter "ProcessId = <pid>"`). Either ask the operator to stop it, or skip the screenshot and say so. Related: [[local-browser-verify-recipe]], [[backgrounded-server-epipe-kills-render-worker]].
