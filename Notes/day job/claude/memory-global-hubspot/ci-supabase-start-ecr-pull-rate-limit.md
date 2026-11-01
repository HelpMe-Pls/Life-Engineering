---
name: ci-supabase-start-ecr-pull-rate-limit
description: "hermetic-supabase CI step can fail at `supabase start` with ECR Public `toomanyrequests` (anonymous per-IP pull limit); fixed by a retry wrapper"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c898330-2d17-4ea8-8211-b609b6331da5
---

`npx supabase start` in `.github/actions/setup-hermetic-supabase/action.yml` pulls every service image from `public.ecr.aws` (AWS ECR Public) **anonymously**. ECR Public rate-limits anonymous pulls per source IP, and GitHub's shared runner egress IPs trip it (`toomanyrequests: Rate exceeded`) — worst on the nightly cron (`17 8 * * *`) when many scheduled jobs pull at the same instant. The Supabase CLI's own retry (~4s + 8s, 2 tries) is too shallow to outlast the throttle window, so the whole setup aborts.

Fixed 2026-06-23 (PR #134, squash commit `b7ab16a` on `dev`): wrapped `supabase start` in a 5-attempt exponential backoff (20/40/80/160s) with `supabase stop --no-backup` between tries, in the **shared** composite action so both the PR gate (`ci.yml`) and the nightly are hardened. Cached images persist across attempts, so each retry pulls fewer images. Zero secrets added — authenticating to ECR Public would need AWS creds and break the action's zero-secret design.

This is a SECOND, distinct flake class at the same step as [[ci-hermetic-supabase-port-flake]] (port 54324 Inbucket bind). The same retry+stop wrapper also covers that one (`stop` frees ports between tries). For a red run from either cause: it's transient infra, not your diff — the wrapper now auto-retries; a manual `gh run rerun <id> --failed` (use the [[gh-account-kh0ile-env-token]] account) clears a pre-fix red.
