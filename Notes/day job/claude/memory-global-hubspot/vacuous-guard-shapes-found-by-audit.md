---
name: vacuous-guard-shapes-found-by-audit
description: "The sixteen shapes a guard-that-cannot-fail has taken in this repo — eleven from the 2026-09-03 audit (PR #838) plus five found 2026-09-11 by RED-proving new guards. Check a new test against this list instead of re-deriving it; note that a timezone-dependent regression is invisible in UTC and UTC+7, and that the commonest shape is an ABSENCE with more than one cause"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 9147b263-7792-4834-a5f3-05209477702b
  modified: 2026-09-11T07:30:35.988Z
---

A full read of all 292 test files produced 154 candidates; the 16 that claimed a guard could not go red were the only class fixed (PR #838, 2026-09-03), 11 of them observed RED by re-creating the defect. The shapes, as a checklist for the next audit or review:

1. **The assertion measures the OTHER branch.** "is a no-op for an unknown key" asserted `pinnedCount === 1` — which is what *pinning a known key* does. Deleting the `if (idx < 0) return config` early return left it green. Assert **identity** (`toBe(sameObject)`) for a no-op, and build an input that genuinely reaches the branch.
2. **The fixture satisfies both implementations.** `q: 'viet'` matches `EO Vietnam` and `Vietnam`, so a display-name matcher and a raw-name matcher agree. One extra case (`q: 'eo'` → `[]`) separates them.
3. **The expected value is the parser's own output.** `{ call_held: true }` in → `{ call_held: true }` out, so `{ ...row }` with no parse call passes. Feed input the parser must **change**.
4. **A hand-copied policy number.** `length >= 6` beside the `minimum_password_length = 6` it claims to satisfy: raising the policy leaves the test green while provisioning starts rejecting. Read the number from the source of truth.
5. **A call count instead of a gate.** `expect(requireAdmin).toHaveBeenCalledTimes(1)` passes if the loader calls the guard and then swallows its throw. Assert the refusal **propagates**.
6. **A string that appears somewhere else in the artefact.** The raw-URL fallback was asserted with `toContain(url)`, and the url is in the button's `href` too — deleting the fallback passed. Assert it as visible **text** (`/>url/`), which is also what the fallback is for.
7. **A regex that matches the wrong occurrence.** `/\[TAG\],/` intended for the cache's key part also matches `tags: [TAG],` one argument later. Anchor to the position (`/\},\s*\[TAG\],\s*\{/`).
8. **A timezone-dependent regression, run in the wrong zone.** ⚠ The one worth remembering: `new Date('2026-03-01').getDate()` only shifts in a **negative-offset** zone, and both CI (UTC) and this machine (UTC+7) are not. Pin `process.env.TZ` for the describe (Node re-reads it per Date), add a **control** asserting the zone really disagrees, and cross a calendar boundary so month/day/year all move.
9. **Comparing against a reference built the way the code builds it.** `expect(parts.day).toBe(ref.getDate())` cannot fail. Where the value's *rendering* is locale-dependent, compare the **same locale in a different zone** rather than pinning a formatted string.
10. **Source text that the file's own comment satisfies.** `toContain('process.argv')` over a script whose comment block says `process.argv[2]`: the whole CLI tail could be deleted while the pre-push hook silently stopped judging. **Run it** instead, in both directions.
11. **A literal compared to a literal.** `expect(MODEL.generatedFrom).toBe('…sync-map.ts')` — a fully retyped model still names its source. Make it a differential against the module it claims to derive from.

Two more shapes that are fixes rather than probes: an `if (x.kind === 'y') { expect(…) }` **skips** its assertion instead of failing it (narrow by throwing), and a component handed a sentence as a **prop** and asserted to echo it pins nothing about the wording (pin it where the sentence is produced).

**Five more, found 2026-09-11 by RED-proving new guards rather than by auditing old ones** (#880–#885 batch). They are not part of the 292-file audit above, and the first two are the same mistake in two costumes — *an absence with more than one cause*:

12. **`getByText` returns the DEEPEST match, not the element carrying the class.** A width guard did `expect(getByText(/a format note is not a rejection/i).className).not.toMatch(/max-w-/)` — RTL matched the bold lead-in `<span>`, which has no layout class at all, so it passed with `max-w-prose` still on the `<p>`. Reach the element that owns the property (`closest('p')`), and assert something positive about it (`toMatch(/rounded/)`) as a control that you found the right node.
13. **A collapsed representation is absent while the thing is EXPANDED.** `queryByRole('button', {name: 'Read from somewhere else'}) === null` meant either "the control was gated away" or "its panel is open" — so a test that opens the panel, drives an action, and then asserts the control is gone passed with the gate deleted. Ask whether the control is present **in any of its forms** (button *or* panel).
14. **A sweep so broad it reds on a correct change.** A one-owner check asked whether any importer of the tone module painted *any* `bg-*` class; a later ticket correctly gave a second file that import, and the file's unrelated error-box `bg-red-50` tripped it. A guard that goes red on a right answer gets deleted, so narrow the detector to the thing that actually duplicates (here: a record keyed by the tone union whose values carry fills) — then **re-prove it red** by planting the real duplicate, or you have only weakened it.
15. **A banned phrase that is legitimate outside the scope.** `upload failed` is a refusal about a *verdict* and a plain fact about a storage PUT that genuinely failed. One list for the narrow rendered surface, built from a wider-surface list, beats either one guess.

16. **An escape inside a TEMPLATE LITERAL is not the escape you wrote.** `new RegExp(`${wide.source}|\bupload failed\b`, 'i')` compiles to U+0008 + "upload failed" + U+0008 — a backspace, not a word boundary — so that alternative never matched anything a browser renders, and the ban shipped dead while the case using it stayed green. A banned-phrase regex is the one guard whose failure mode is SILENCE: it goes dead and every surface passes. Double every escape when the pattern is built from a template literal, and assert the PATTERN against a sample in the case that uses it — matching what it must catch, and not matching what the wider list deliberately allows. The same collapse also reaches a test through a Bash heredoc and through Write/Edit, so build backslashes with `chr(92)` in a patch script.

Related: [[test-suite-clean-minimal-standard]], [[shared-helper-contract-belongs-at-its-own-seam]], [[usage-block-makes-flag-assertions-vacuous]], [[recurring-bug-class-needs-enumeration]], [[report-that-names-its-own-fix-must-be-measured]], [[red-recipe-is-a-hypothesis]].
