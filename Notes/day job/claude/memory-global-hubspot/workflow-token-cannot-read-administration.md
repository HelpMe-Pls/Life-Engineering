---
name: workflow-token-cannot-read-administration
description: "`administration` is not a grantable workflow permission, so GITHUB_TOKEN 403s on the Actions settings API — read such a setting by ATTEMPTING the write"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 52df529f-f6ac-49e0-bce4-3505f1052d0a
  modified: 2026-08-27T12:51:34.220Z
---

A workflow's `permissions:` block can only name: `actions`, `attestations`, `checks`, `contents`, `deployments`, `discussions`, `id-token`, `issues`, `models`, `packages`, `pages`, `pull-requests`, `security-events`, `statuses`. **`administration` is not on that list.**

So `GET /repos/{owner}/{repo}/actions/permissions/workflow` — the endpoint that answers *"may Actions create and approve pull requests?"* — is **unreadable by the built-in token**. Measured 2026-08-27 in the #708 dry run (`33071538772`): `gh: Resource not accessible by integration (HTTP 403)`. From a PAT the same call returns `{"default_workflow_permissions":"read","can_approve_pull_request_reviews":false}`.

**How to apply:** when a workflow needs to branch on a permission-shaped setting, **do not read the setting — attempt the operation and branch on whether it succeeded.** `try { gh pr create … } catch { degrade }`. **Why it is not a workaround but the better design:** the attempt is true at the moment it matters, and it also catches every *other* reason the operation could be refused (org policy, ruleset, a revoked app) — none of which the settings API reports. Keep the API read as a logged diagnostic; its 403 is itself informative.

⚠ Do **not** mirror the setting into a repo variable an operator ticks separately. That is two copies of one fact, and the copy is the one that goes stale — the failure mode this repo keeps re-learning ([[settled-decision-must-be-unsaid-in-both-places]]).

The org-level read (`GET /orgs/{org}/actions/permissions/workflow`) needs `admin:org` and 403s even for a repo-admin PAT, so an agent cannot verify the org half at all — that stays an operator handoff ([[classifier-denies-repo-settings-writes]]).

Related: [[gate-speed-vs-action-minutes]], [[gh-account-kh0ile-env-token]].
