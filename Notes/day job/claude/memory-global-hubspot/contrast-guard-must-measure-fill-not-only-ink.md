---
name: contrast-guard-must-measure-fill-not-only-ink
description: A contrast sweep that measures only ink-on-fill reports a healthy surface while a control is invisible against its own field - measure the FILL against what is behind it too
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 305aade5-04bb-4208-b126-4e7a1f184bcc
  modified: 2026-08-31T20:55:00.163Z
---

Every contrast guard in this repo measured **ink against its own fill**. That is the "can I read it" question. It is not the "is this a control" question, and a button can pass one while failing the other completely.

The live case (#791): the admin *Add files* dialog's `::file-selector-button` was filled with `--color-brand-surface-2` — the **inset/hover** surface, `#f1f5f9` — inside a `#ffffff` input carrying near-black ink. **17:1 for the ink, 1.08:1 for the button against its own field.** Legible and invisible at the same time.

⚠ **And the ticket's premise was wrong in the same way.** It said "in the dark admin theme it is fine; light is where it fails". Measured, dark was **1.14:1** — the identical defect. The earlier fix (#721) had celebrated 12.63:1, which was the INK number; only dark had ever been measured, because dark was the bug being chased. Fixing light alone would have left the same bug in the theme the ticket called healthy.

**Why:** a token named for a *surface* role (inset, hover, elevated) is chosen for how it sits UNDER content, not for how it separates FROM content. Using one as a control fill is the recurring shape.

**How to apply:** when a control's affordance is in question, assert two numbers — ink/fill ≥ 4.5:1 **and** fill/field ≥ 3:1 — and drive BOTH themes as equals, since `[data-theme]` remaps named colours only (see [[admin-dark-theme-alpha-utilities-not-remapped]]). `paintedFillContrast` in `website/e2e/fixtures/contrast.ts` is the second measurement; its walk starts at the ELEMENT, not the pseudo, because compositing a pseudo's fill into its own backdrop answers 1:1 for every input. Give it a positive control — a pair that must NOT separate — or a stuck-at-1:1 implementation passes everything. Compute candidate values before painting any of them ([[hsl-lightness-is-not-luminance-use-oklch]]); the model was validated when the predicted 1.14:1 matched Chromium exactly.
