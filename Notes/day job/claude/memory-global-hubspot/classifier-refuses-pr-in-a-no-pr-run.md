---
name: classifier-refuses-pr-in-a-no-pr-run
description: "In a run whose prompt says never open a PR, the auto-mode classifier refused gh pr create for a dev docs PR even after the operator's mid-run yes; push the branch through the gate and hand the PR to the operator"
metadata:
  node_type: memory
  type: feedback
  originSessionId: c6751560-3f7c-454e-970c-2b2c5eeafa10
  modified: 2026-10-30T06:36:11.874Z
---

On 2026-10-30 (the training module prototype run), the run's prompt forbade opening any pull request into dev or main. Mid-run the operator agreed to a side agent's note: add a "keep prototype/training-module until the build ships" line to `docs/plans/next-steps.md`. The commit passed the local gate and pushed (branch `docs/keep-training-prototype-branch`), but `env -u GH_TOKEN gh pr create` was refused as [External System Writes], and the run's own never-list forbids retrying a refusal.

**Why:** the classifier weighs an action against the whole session, the original prompt's never-list included, so a later conversational yes does not lift it.

**How to apply:** in a no-PR run, when the operator asks mid-run for a change that needs a PR, do everything up to the push (branch off origin/dev, the three next-steps tests, the gate, the push with the SSH keepalive), then hand the operator the create command and the literal-number merge in the final message and the report, and name the risk until it merges. Related: [[pr-merge-needs-a-literal-number]], [[gh-account-kh0ile-env-token]], [[long-pre-push-hook-drops-ssh]].
