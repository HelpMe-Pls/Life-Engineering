---
name: fix-focused-review-rounds-read-only-the-last-fix
description: "An \"empty\" review round whose reviewers were told the last fix often read ONLY that commit; confirm with a fresh whole-PR round before calling a PR done"
metadata:
  node_type: memory
  type: feedback
  originSessionId: d2365940-f52b-44c7-bc7b-4e6e03f3a51a
  modified: 2026-10-23T21:30:46.617Z
---

On 2026-10-24 (the global-hubspot ⚡ queue, PRs 1142–1144), review rounds briefed with "round N fixed X; focus on what that fix broke" came back empty after ~30 s and ~7 tool calls: the journal showed both reviewers ran only `git show <last fix>`. A fresh round that read the WHOLE diff then found real defects twice on PR 1142 (no `aria-expanded` on a toggle; focus lost when a form closed), and only round 10 was truly empty.

**Why:** the operator's rule is "rounds go on until one comes back empty", and an empty round from reviewers who never read the PR is a false clean bill (compare [[workflow-dead-agent-reads-as-clean-bill]] and [[review-round-n-plus-one-comes-from-round-n]]).

**How to apply:** when a round comes back empty, check its journal for what the reviewers actually read (duration, tool count, commands). If they read only the last fix, run one more round told to read the full `git diff origin/dev...HEAD`, every file, with the known-and-accepted items listed so they are not re-reported. Only that round's empty result ends the PR's rounds.
