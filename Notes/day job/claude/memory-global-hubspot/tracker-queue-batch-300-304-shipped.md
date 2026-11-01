---
name: tracker-queue-batch-300-304-shipped
description: 2026-07-16 tracker-board queue batch
metadata: 
  node_type: memory
  type: project
  originSessionId: 638f6ccb-25ab-4ea8-bf00-3703dd464b28
---

2026-07-16: the whole agent-ready tracker-board queue shipped to `dev` as #300–#304 (hover-star pointer-events fix · last-column grip removal · owner-email truncation · fill-width gap · Owner-popover commit-then-close). **Promotion `dev`→`main` is still pending (HITL go-ahead required; deployed-smoke after deploy while `CI_BILLING_OUTAGE` armed).** Queue now holds ONLY 3 operator-gated (`/prototype`) items: #3 column pinning · **Table config/settings** (NEW — replaces Quick-filters row; quick filters + show/hide columns [Name/Current stage/Health never hideable] + default-opened-wave + drag-n-drop column order, global across waves) · User-config avatar (restored to 2-section design).

**Why:** the batch encodes several non-obvious layout facts that future tracker work (esp. the 3 gated items) must honor.

**How to apply:**
- **Percentage `max-width` cannot bound inside shrink-to-fit ancestors** (intrinsic sizing ignores it) — the queue doc's original "bound the trigger subtree locally" prescription was measured-WRONG in Chromium; the shared chrome (`BoardCellPopover` wrapper div + button) had to carry `max-w-full`. Prototype-measure CSS prescriptions before coding them ([[queue-subwave-golive-gate-pr267]] style guidance can be stale).
- **Fill-absorber trio:** the wave table = `min-w-full` + explicit `width = trackerTableWidth` (scroll threshold); the LAST column (`blocker_readiness`) has NO `<col>` width and absorbs all slack; `parseColumnWidths` DROPS legacy absorber cookie widths. All three are keyed to "the last column" — Table-config's reorder/hide MUST re-derive or pin it.
- **`max-w-7xl` caps the admin card at ~1230px** → default column widths (Σ1388 w/ select) are ALWAYS scroll mode; fill mode needs ≥3 columns narrowed. An E2E asserting no-gap at defaults is VACUOUS (adversarial review caught exactly that).
- **jsdom fires no blur on mousedown** — outside-click commit paths must be tested via the routed callback, and a background-failed save must NOT refocus its input when the user moved on (focus-steal would blur-commit the editor they're typing in now — guarded in `NamedContactEditor`).
