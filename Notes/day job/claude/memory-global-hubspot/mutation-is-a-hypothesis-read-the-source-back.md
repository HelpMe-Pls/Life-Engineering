---
name: mutation-is-a-hypothesis-read-the-source-back
description: A mutation that silently fails to apply reads exactly like a clause that is inert — verify the mutated source changed before believing the run
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 364ea5de-9188-4e83-bc83-49c70d6df1e8
  modified: 2026-09-11T15:04:03.692Z
---

A scripted mutation is a hypothesis exactly like a RED recipe ([[red-recipe-is-a-hypothesis]]),
and it has one extra failure mode a recipe does not: **it can silently not apply**, and a green
run then reads exactly like "this clause is dead code". Measured 2026-09-11 while
mutation-proofing `closePanel` in `components/uploads/RereadControl.tsx`: the script sliced the
function body out with `s.index("\n  }", i)` and then removed the needle `"    setError(null)\n"`.
The LAST line of a function body has no trailing newline inside that slice, so `str.replace`
matched nothing, wrote the file back unchanged, and the suite passed. I nearly deleted a
load-bearing line as redundant. With the needle written as `"\n    setError(null)"` the same
mutation redded immediately: `expected <p role="alert"> to be null`.

**Why:** a mutation proves a clause is load-bearing only if the source actually changed. "Test
still green" has two causes — the guard cannot fail, or the mutation never happened — and that is
the same two-cause absence this repo keeps finding in vacuous guards
([[vacuous-guard-shapes-found-by-audit]]), now pointed at my own tooling.

**How to apply:** after mutating and before reading the result, print the mutated region back
(`sed -n '/function x/,/^  }/p'`) or `assert` the needle was present *and* the output differs.
Prefer `git diff --stat` on the mutated file — one line, and it cannot lie. Same rule as
[[patch-script-needle-must-be-asserted]]: assert the needle, and here also assert the effect.

Related: [[mutation-proof-my-own-guard-before-committing]].
