---
name: closes-keyword-needs-manual-close-on-dev
description: "\"Closes #N\" in a PR body does NOT auto-close the issue here — feature PRs target dev, but GitHub only auto-closes on merge to the DEFAULT branch (main)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4e9f3df1-e44f-47a0-8979-d31a4ba34af5
  modified: 2026-09-28T16:01:38.537Z
---

In this repo every feature/docs PR merges into `dev` (the default branch is `main`; promotion to `main` is separate). GitHub's `Closes #N` / `Fixes #N` keyword only auto-closes the linked issue when the PR merges into the **default branch** — so a PR to `dev` with "Closes #72" leaves #72 **OPEN** after merge.

⚠ **The REVERSE trap: the keyword fires LATER, at the promotion, from ANY commit in the range — even one that only TALKS about the issue.** 2026-09-28: promotion #1021's merge closed the still-unfixed #1016, because a docs commit's subject read "the review's fixes: #1016 is the objective's named exception" — `fixes: #1016` (colon allowed) is a closing keyword. **After merging a promotion, diff `gh issue list --state open` against the spine's expected set and reopen any false close with the reason**; when writing a commit, never put close/fix/resolve (any tense, `:` included) right before `#N` unless it really closes N.

**How to apply:** after squash-merging a feature PR to `dev`, close its issue **manually** (`gh issue close <n> --comment "…"`) and tick the DoD checkboxes in the body yourself — don't assume the keyword did it. Verify with `gh issue view <n> --json state`. See [[promotion-merge-convention]] (dev→main is a separate plain merge) and [[gh-account-kh0ile-env-token]] (use `env -u GH_TOKEN` + Kh0iLe).
