---
name: truncate-clips-italic-ink-not-layout
description: "Tailwind `truncate` on ITALIC text shaves the last glyph — overflow:hidden clips to the padding box while italic ink crosses its advance width; measured 1.2–2.6px, and scrollWidth === clientWidth so no layout test can see it"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 305aade5-04bb-4208-b126-4e7a1f184bcc
  modified: 2026-09-01T04:16:27.154Z
---

`truncate` = `overflow: hidden` + `text-overflow: ellipsis` + `white-space: nowrap`. `overflow: hidden` clips to the **padding box**, and a shrink-to-fit element (a flex item, an inline-block) is exactly as wide as the sum of the glyph **advance widths**. An italic face leans right, so its ink crosses that advance near the cap line — and that overhang is outside the box and gets painted away.

**Measured in Chromium, `italic 12px Inter`** (2026-09-01, `main` account-note row), as `TextMetrics.actualBoundingBoxRight - width`:

| string | ink past the box |
|---|---|
| `Oot` | 2.07px |
| `Oo1` | 2.12px |
| `We'll see about that` | 2.07px |
| `This one set its region to LAC` | 1.23px |
| `Wf` | 2.56px |
| same strings **upright** | −0.46px (inside) |

⚠ **It bites hardest on SHORT text that never truncates**, because the box is then exactly the advance width with no ellipsis to absorb the lean. The reported symptom is "the top-right corner of the last letter is cut off".

⚠ **No layout test can find it.** `scrollWidth === clientWidth` the whole time — nothing overflows in the layout sense, only the ink does. A "does it truncate / does it fit" assertion passes.

**How to apply:**
1. Any element carrying both `truncate` (or a hand-rolled `overflow:hidden`) and `italic` needs an inline-end padding *inside the clip*. `pe-1` (4px) covers every measured case. Padding, not margin — margin is outside the clip and buys nothing.
2. Measure rather than guess with `document.createElement('canvas').getContext('2d')`, `c.font` copied from `getComputedStyle`, then `measureText(s).actualBoundingBoxRight - measureText(s).width`. The upright form of the same string is the control.
3. The guard worth writing is the **trio**: clips AND leans AND reserves. A padding assertion alone says nothing; see [[shared-helper-contract-belongs-at-its-own-seam]].
4. When two components draw the same thing with identical class strings, extract one component before fixing — the fix otherwise lands on one of them and looks done. Hold the owner list with a **derived** scan (e.g. "exactly one file under `app/` styles anything italic"), never a hand-kept list.

Related: [[admin-ui-colour-and-chrome-taste-rules]], [[contrast-guard-must-measure-fill-not-only-ink]] (the same lesson one level up — measure what is painted, not what is declared), [[sr-only-loses-its-padding-reset-to-a-bare-utility]].
