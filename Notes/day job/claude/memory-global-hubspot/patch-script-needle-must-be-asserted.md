---
name: patch-script-needle-must-be-asserted
description: "An exact-string patch script must assert the needle appears exactly once, and normalise CRLF first — a miss is silent"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 798f99d2-7365-4317-8034-6187e75f46bb
  modified: 2026-08-28T16:24:34.552Z
---

When editing files with a Node/Python patch script in this repo, **assert that the needle appears
exactly once before replacing**, and **strip `\r\n` → `\n` before matching, restoring it on write**.
`String.replace` returns the input unchanged on a miss, so a wrong needle produces a file that looks
edited, a script that exits 0, and no error anywhere.

**Why:** both halves bit in one session. Every needle containing a newline failed against
`lib/rollout/types.ts` because the working copy is CRLF (Windows, `core.autocrlf=true`) while the
script's template literals are LF — the single-line needles matched and the multi-line ones did not,
so the failure looked like a bad anchor rather than an encoding one. Later a needle carrying a curly
`’` where `docs/plans/next-steps.md` has a straight `'` silently no-opped; it was caught only because
a `grep -c` afterwards returned `0`. Prettier's `endOfLine: "auto"` means a file must stay
*consistently* CRLF, so writing LF back into a CRLF file also fails `format:check`.

**How to apply:** use the `edit(path, pairs)` helper pattern — read, `split(CR+LF).join(LF)`, throw
unless `s.split(from).length - 1 === 1`, replace, then restore CRLF if the original had it. Build
`CR`/`LF` with `String.fromCharCode(13)`/`(10)`, never as `'\r\n'` literals, because Write/Edit
normalise those escapes into real control characters (see
[[write-edit-normalise-unicode-escapes]]). ⚠ **The same normalisation bites a python
patch script passed through a Bash heredoc** — measured 2026-09-11: a `.split('\n')`
written inside `<<'PY'` arrived as a real line break and esbuild reported "Unterminated
regular expression". Build the separator from a char code, or avoid splitting at all. ⚠ **A DOUBLED backslash collapses the same way, and that one reaches production code**: a needle or replacement written as two backslashes arrives as one, so a JS regex built in a template literal ends up with a real backspace where a word boundary was meant ([[vacuous-guard-shapes-found-by-audit]] shape 16). Build every backslash with `chr(92)` in the script, and grep the written file with `cat -A` to confirm what landed. Related: [[dont-ask-mode-shell-workarounds]],
[[git-commit-heredoc-hangs-windows]].
