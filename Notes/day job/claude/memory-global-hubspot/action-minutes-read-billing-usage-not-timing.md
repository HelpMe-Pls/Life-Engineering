---
name: action-minutes-read-billing-usage-not-timing
description: "A run's /timing endpoint reports 0 billable ms even for a real GitHub-hosted job — read the day-scoped billing usage API instead"
metadata: 
  node_type: memory
  type: reference
  originSessionId: dc03cc36-798d-4388-b931-35d2db9bd839
  modified: 2026-09-09T11:59:44.849Z
---

To answer "did this spend Action minutes?", query the **billing usage API** — and use THIS spelling, which is measured working:

`env -u GH_TOKEN gh api "orgs/EO-Vietnam/settings/billing/usage"`

⚠ **Omit the leading slash** — Git Bash rewrites `/orgs/...` into a filesystem path (`C:/Program Files/Git/orgs/...`).

⚠ **IT RETURNS 200 ON THE ORDINARY KEYRING. This memory asserted the opposite and that cost sessions.** Measured 2026-09-09: the call above answers with per-day, per-repo `usageItems` — `global-hubspot` Actions Linux 96 min September-to-date, 1418 in August of which 795 landed on 08-23, the day before `DEC-LOCAL-GATE` — every row `netAmount: 0.0`, i.e. inside the included allowance. No `admin:org` was needed. The two sentences that were wrong: "NEITHER PATH IS AVAILABLE FROM THIS MACHINE" and "both it and the usage API need `admin:org`" — the `admin:org` line is gh's hint **appended to the 410** from the OLD endpoint, not the replacement refusing, and reading it as the replacement's own error is how one dead endpoint condemned a live one.

⚠ **The `organizations/…?year=&month=&day=` form this memory used to prescribe is not the one that works** — prefer the plain `orgs/…/settings/billing/usage` above and filter the rows yourself. What is still genuinely absent is the **allowance ceiling**: the payload carries spend, never the plan's included-minutes figure, so that one number remains an operator question. ⚠ **Do not re-inherit "do not re-attempt the endpoint"** — `docs/plans/next-steps.md` carried that instruction and it was removed on 2026-09-09 for being the line that cost the session.

⚠ **`repos/{o}/{r}/actions/runs/{id}/timing` LIES about cost.** On 2026-08-26 it reported `billable.UBUNTU.total_ms: 0` with `jobs: 1` for the nightly cross-browser run, while `run_duration_ms` was 506000 and the job demonstrably ran 8m23s on a GitHub-hosted `ubuntu-latest` runner (`runner_group_name: "GitHub Actions"`). The billing API billed that same run **9 minutes**. A zero from `timing` is not evidence of a free run.

**Why:** the only cheap way to check `DEC-LOCAL-GATE` is actually holding is to measure spend, and the obvious endpoint reads zero for everything — which confirms whatever you hoped.

**How to apply:** match the usage row's timestamp to a job's `completed_at` to attribute minutes to a specific run. Two things that look expensive and are not: a `deployment_status` run whose jobs all **skip** never provisions a runner (10 of them cost 0 that day), and `netAmount: 0.0` with `discountAmount == grossAmount` means the minutes fell inside the included allowance. Vercel build minutes are a **separate** budget and never appear here. Related: [[policy-guardrails-this-repo]], [[gh-account-kh0ile-env-token]], [[git-commit-heredoc-hangs-windows]].
