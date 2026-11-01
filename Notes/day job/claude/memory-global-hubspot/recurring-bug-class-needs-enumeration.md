---
name: recurring-bug-class-needs-enumeration
description: "When the same bug class turns up a third time, stop hunting instances and enumerate the input space in a table — hunting found 3 of 4 and would have missed the worst one"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 41999a4d-6108-4b2a-ba11-eb6c9739c783
  modified: 2026-08-10T17:29:33.698Z
---

**When the same bug CLASS recurs across review rounds, hunting for the next instance is the wrong move — enumerate the input space instead.** Measured on the #477 promotion review (2026-08-10/11): one class, *present-but-empty treated as absent, or asked-for-but-unusable treated as valid, with nothing said*, produced **four** findings in four different places:

- `cc: ['']` passed a `length === 0` check (a one-entry list is not an empty one)
- `--bcc --send` was read as "no copy asked for" and **delivered**
- `--name '   '` passed `if (!name)` because the check read the RAW value and the `.trim()` ran after it
- `--password ''` mailed a note that stated **no password at all** — in the one flag deliberately exempted from the trim rule

**Why:** adversarial hunting found the first three and would have missed the fourth, because the fourth was inside a hand-carved exception *with a comment explaining why it was safe*. Reviewers do not attack the exception they just read a justification for. What found it was a table — all 7 value flags × 11 degenerate forms (absent · empty · whitespace-only · padded · repeated · flag-with-no-value · `--`-leading · comma · HTML metacharacters) driven through the real parser. Six flags were uniform; the table pointed straight at the seventh.

**How to apply:** on the *second* sighting of a class, ask for the table, not another pass. Brief it as "enumerate every input × every degenerate form, drive the real function, then say which cells are uncovered" — and demand the enumeration even when the answer is "none", because *"here is every cell"* is a real stop condition while *"no new findings this round"* is not. Also enumerate **outputs**: every value that reaches a person (each interpolation site, each log line, each field handed to the sender) and which validated copy it uses. See [[test-suite-clean-minimal-standard]] and [[shared-helper-contract-belongs-at-its-own-seam]].

⚠ A hand-carved exception is where this class hides. `--password` was excluded from trimming for a real reason (a space can be part of a credential), and the exclusion was still wrong: `<code>` had no `white-space` rule, so the browser collapsed the padding the exclusion existed to preserve. **A comment can state a protection that CSS quietly undoes.**
