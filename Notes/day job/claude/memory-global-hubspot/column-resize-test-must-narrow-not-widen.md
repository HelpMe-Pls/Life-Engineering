---
name: column-resize-test-must-narrow-not-widen
description: "A column-resize test that only WIDENS is vacuous — auto table layout honours a widen too, so it passes on the very layout `table-fixed` was added to rule out; narrowing below min-content is the only direction that discriminates"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0fcbd5aa-c1b1-4a2f-906a-38f5821d6da0
  modified: 2026-08-03T23:50:26.760Z
---

Proving a resizable admin table works, the obvious test — drag/keyboard a column
wider, measure the laid-out `<th>`, assert it moved by the step — **cannot fail
for the reason you think.** Measured on `/admin/altai-sync` (#448): with
`table-fixed` REMOVED, a widen still landed within 1px of the target, because
auto table layout honours a `<col style="width">` hint whenever it exceeds the
column's min-content width. The test passed on the exact layout it was written
to rule out, and the code comment asserting "`table-fixed` is load-bearing here"
was wrong in the widen direction.

**Narrowing is the discriminator.** Auto layout stops dead at min-content and
silently ignores the rest of the drag, while the grip goes on announcing the
width the reader asked for. Same column, `Home` (the grip's 96px floor, under
the min-content width of "Accelerator Participants"): **96px with `table-fixed`,
147.58px without.**

**Why:** the user-visible defect is a reader dragging a column narrower and
watching it refuse — an `aria-valuenow` assertion is blind to it, and so is any
widen-only measurement. This is the same family as the vacuity traps in
[[test-suite-clean-minimal-standard]]: an assertion that holds under both the
fixed and the broken configuration.

**`table-fixed` NEEDS A NON-AUTO WIDTH.** Fixed layout only engages when the
table has an explicit width — drop `w-full` and the browser silently reverts to
auto layout with no warning of any kind. That is how the narrowing guard above
paid off six revisions later: an unrelated change removed `w-full`, and the
guard failed at 111.77px against the 96px the grip was announcing.

**⚠ THE TRADE, SETTLED THE OTHER WAY ON 2026-08-04.** `table-fixed` buys exact
narrowing and COSTS a horizontal scrollbar: authoritative widths cannot be fitted
to a card, so four columns asking 1392px inside ~1230px overflowed by 258px and
hid the segment names. The operator chose no-scroll, so the segment table is auto
layout like the worklists — widening now takes pixels from the neighbours, and
the 96px floor is advisory (a column stops at ~111.77px while the grip announces
96). **A resizable admin table here defaults to auto + `w-full`.** The narrowing
guard was replaced by an overflow guard: drive the grip to its ceiling, assert
`scrollWidth - clientWidth <= 1`, AND assert the column grew — an ignored drag
also produces no scrollbar.

**How to apply:** any table gaining drag-resize (four here now — tracker board,
both altai-sync worklists, the ledger's field maps, and the segment parity
table) gets a guard that **narrows past the content** and measures
`getBoundingClientRect()`, not just one that widens. And revert `table-fixed`
once to watch it go red — that is what caught this. Pair it with `break-words`
on any text cell, or a hand-narrowed column spills its content instead of
wrapping it. Related: [[table-config-pinning-design-gate-checkpoint]].
