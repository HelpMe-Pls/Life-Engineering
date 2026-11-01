---
name: issue-bodies-full-width-lines
description: "GitHub issue/PR bodies must be written as long unwrapped lines, never hard-wrapped at ~100 chars"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 798f99d2-7365-4317-8034-6187e75f46bb
  modified: 2026-08-28T13:53:17.360Z
---

Write GitHub issue and PR bodies with **each paragraph on ONE long line** and let GitHub soft-wrap it
to the reader's window. Do not hard-wrap prose at ~100 characters the way the repo's source comments
and markdown docs are wrapped.

**Why:** the operator showed a screenshot of #728 rendered on github.com — hard-wrapped prose renders
"bunched up" in a narrow ragged column down the left of a wide screen, wasting the row width and
making the ticket harder to read. Markdown joins the lines anyway, so the wrapping buys nothing and
costs legibility.

**How to apply:** when writing `--body-file` content for `gh issue create` / `gh issue edit` /
`gh pr create` / `gh pr edit`, keep headings, list items and fenced blocks as-is, but emit each
paragraph and each bullet as a single unbroken line. This is about GitHub-rendered bodies only —
`docs/plans/next-steps.md` and source comments keep the repo's existing wrapping. Related:
[[check-off-acceptance-criteria-before-closing]], [[closes-keyword-needs-manual-close-on-dev]].
