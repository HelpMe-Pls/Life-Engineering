---
name: prettier-scope-is-website-only
description: "docs/ is OUTSIDE Prettier's scope here — next-steps.md FAILING `prettier --check` is expected, and 'fixing' it silently destroys padded code spans"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 798f99d2-7365-4317-8034-6187e75f46bb
  modified: 2026-08-28T23:59:45.385Z
---

`website/.prettierignore` states it in its own header: **"Prettier's scope is the APP: everything Prettier
touches lives under `website/`."** Both scripts are `prettier --write .` / `--check .` run **from
`website/`**, so `docs/`, `.claude/` and the repo root are never checked by the gate.

⚠ **Therefore `docs/plans/next-steps.md` FAILS `prettier --check` today, and that is CORRECT.** Its
`HEAD` version fails too — measured 2026-08-29. The trap is that the failure looks like drift worth
fixing, and running `npx prettier --write ../docs/plans/next-steps.md` to "clean it up" **rewrites lines
you never touched**. It turned `` ` Name ` `` into `` `Name` `` on the regex-backslash trap line —
CommonMark strips one leading and trailing space inside a code span — and the padding was the entire
point of that sentence (the regex MISSED `Full Name` and ` Name `). Typecheck, lint and the suite all
still pass, so nothing catches it; only reading the diff does.

**Why:** the gate's scope and Prettier's scope are the same, and both stop at `website/`. A file outside
that boundary has no formatter contract at all, so "make `--check` green" is not a goal there — it is a
content change wearing a formatting costume.

**How to apply:** never run Prettier on anything outside `website/`. Edit `docs/` files with an asserting
patch script instead ([[patch-script-needle-must-be-asserted]]), and after any bulk edit to
`next-steps.md` diff the **hunk line numbers** (`git diff --unified=0 | grep '^@@'`) and confirm every
one is a line you meant to change. Related: [[write-edit-normalise-unicode-escapes]],
[[next-steps-parallel-edits-sync-first]].
