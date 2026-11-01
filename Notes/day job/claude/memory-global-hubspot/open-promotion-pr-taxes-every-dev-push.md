---
name: open-promotion-pr-taxes-every-dev-push
description: "An OPEN dev→main PR bills a full gate run on every push to dev, because pull_request includes synchronize — opening a PR is free, merging into dev is not"
metadata: 
  node_type: memory
  type: project
  originSessionId: 52df529f-f6ac-49e0-bce4-3505f1052d0a
  modified: 2026-08-27T12:51:20.589Z
---

`ci.yml` triggers on `pull_request` into `main`, and **`pull_request` includes `synchronize`** — not just `opened`. So while a `dev`→`main` PR is open, **every push to `dev` re-runs the whole gate on it**: ~9 billed minutes each, in a repo where minutes are the constraint ([[gate-speed-vs-action-minutes]]).

**The asymmetry to hold onto:**

- **Opening** a PR whose base is `dev` or `wip` costs **zero**. The trigger filters on the PR's *base*, so it never matches; the only run an open PR produces is `Post-deploy smoke` via `deployment_status` from Vercel's preview, whose job is skipped by `environment == 'Production'`, and a skipped job never allocates a runner. Measured 2026-08-27: seven PRs opened into `wip` produced **zero** `pull_request` runs.
- **Merging into `dev`** is the act that bills — via the *other*, already-open PR.

⚠ **Worse when the promotion PR is `BEHIND`.** *Protect main* is strict-up-to-date, so a gate run on a `BEHIND` PR unlocks nothing; fixing `BEHIND` is another push to `dev`, which bills again. #691 sat `BEHIND` because `main` carried merges (`sow` #700/#701) that `dev` did not.

**How to apply:** before merging anything into `dev`, run `gh pr list --state open --json baseRefName`. If a `dev`→`main` PR is open, the cheap order is **close it → make every `dev` push → re-open once**: one gate run on final content instead of one per push. Closing loses nothing, because the head branch is `dev` itself. ⚠ Re-opening the promotion is an operator act — `dev`→`main` needs a per-promotion go-ahead ([[policy-guardrails-this-repo]]).

Related: [[promotion-merge-convention]], [[branch-protection-needs-github-team]], [[pr-merge-gate-check-by-type]].
