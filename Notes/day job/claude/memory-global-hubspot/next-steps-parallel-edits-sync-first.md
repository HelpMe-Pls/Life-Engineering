---
name: next-steps-parallel-edits-sync-first
description: "Before editing docs/plans/next-steps.md, fetch + fast-forward local dev to origin/dev — it's edited in parallel and a stale base causes a CONFLICTING PR"
metadata: 
  node_type: memory
  type: project
  originSessionId: bbde685f-c99b-4ae9-9015-9db835d3ca0e
---

`docs/plans/next-steps.md` (the ⚡ queue / handoff doc) is edited **in parallel** by the operator and other sessions. On 2026-07-16 my local `dev` was 3 commits behind `origin/dev` (#292/#294/#295) despite `git status` = clean, and while I worked the operator's #296 landed ANOTHER `next-steps.md` edit (closing out the same queue) → my PR #297 came back `CONFLICTING`/`DIRTY`.

**Why:** a `clean` working tree says nothing about how far `dev` has drifted from `origin/dev`; the queue doc is the single most contended file in the repo, so a stale base almost always conflicts.

**How to apply:** at session start (and again right before touching `next-steps.md`), `git fetch origin` then `git merge --ff-only origin/dev` on local `dev`; re-read the CURRENT file before writing (the code the queue references may also have shipped — read post-fetch, not from memory). If the PR still conflicts because `dev` moved again, resolve by **merging `origin/dev` into the feature branch and hand-fixing** — NOT rebase (force-push is banned here, see [[policy-guardrails-this-repo]]). Take my side for the new queue items, take origin/dev's side for their close-out/shipped edits. Then finish the standard close-out ([[close-out-branches-only-main-dev]]).
