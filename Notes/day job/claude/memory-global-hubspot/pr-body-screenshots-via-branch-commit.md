---
name: pr-body-screenshots-via-branch-commit
description: "How to put screenshots in a PR body from the CLI (gh cannot upload images): commit the PNGs on the PR branch, link them by that commit's sha with ?raw=true, remove them in the next commit, SQUASH-merge"
metadata:
  node_type: memory
  type: reference
  originSessionId: 7381459e-92c2-4e16-8a16-796da242106e
  modified: 2026-10-06T04:56:41.612Z
---

`gh` has no image upload, and GitHub's user-attachments upload is browser-only. Used on #1047 (2026-10-06), whose acceptance criteria required a screenshot per stage in the PR body:

1. Capture with Playwright (`locator.screenshot({ path })` to an absolute scratchpad path: `test-results/` is wiped at the start of every run), during a run you are making anyway; remove the capture line before committing the test.
2. Commit the PNGs on the PR branch (one commit), note its sha, then `git rm` them in the next commit.
3. In the body: `![x](https://github.com/EO-Vietnam/global-hubspot/blob/<sha>/<path>.png?raw=true)`. The private repo renders them for anyone with access. Check one exists: `gh api "repos/<repo>/contents/<path>?ref=<sha>" --jq .size`.
4. **Squash-merge**, so `dev`/`main` never hold the binaries; `refs/pull/<N>/head` keeps the commit alive for the links. A merge commit would put them in history for good (a standards reviewer flagged this; the repo's only committed PNGs are a favicon and an apple-icon). Say "squash-merged" in the body, because next-steps' "a body that cites shas takes a merge commit" otherwise argues the other way.

Related: [[local-browser-verify-recipe]], [[issue-bodies-full-width-lines]].
