---
name: verify-running-branch-before-diagnosing
description: "A \"fix doesn't work\" report is often a wrong-branch/not-deployed artifact, not a code defect — verify what's actually running first"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 45c1b516-515f-46c4-b4fd-2d3c0b6751ad
---

Two rounds of "the BUG-1 admin-upload-notification fix is broken" (2026-06-15) were both deployment artifacts, not code defects: (1) the user tested on production / the dev preview, neither of which had the unmerged PR #85; (2) then on localhost — but the agent had left the working tree on `dev`, so `npm run dev` served the unfixed branch.

**Why:** production (`main`), the dev preview (`dev`), and localhost all share ONE Supabase DB but each runs whatever branch is checked out/deployed. "No admin emails" looked identical to a code bug, but `getAdminRecipients()` worked fine against the live DB the whole time.

**How to apply:** before diagnosing a "fix doesn't work" report, prove the fix is actually running. Cheap checks: the source-of-truth DB row that's written *before* the side effect (here `in_app_notifications` kind `upload_received_admin`, written before the email — 0 rows DB-wide = the fan-out never executed anywhere), `git rev-parse --abbrev-ref HEAD`, and which deployment/domain the action hit. When handing off for local testing, tell the user explicitly which branch localhost will serve and switch them to the feature branch. Also: never weaken a test's assertions to "tolerate" new behavior — assert the new behavior, or the suite is falsely green (the live upload test had had its admin assertions dropped, hiding the gap). See [[promotion-merge-convention]].
