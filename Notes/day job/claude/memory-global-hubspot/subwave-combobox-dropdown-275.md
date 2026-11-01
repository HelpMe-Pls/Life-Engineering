---
name: subwave-combobox-dropdown-275
description: "Shared open-on-focus SubwaveCombobox (existing-subwaves dropdown) on both bulk popover + inline editor, shipped 2026-07-14 via"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1fec9c94-2714-446c-bd17-86ddab1d87f9
---

2026-07-14 (#275, `/prototype`-gated Variant A): replaced the native `<datalist>` subwave inputs with a **shared `SubwaveCombobox`** (`website/app/admin/components/SubwaveCombobox.tsx`) — an open-on-focus dropdown listing existing subwaves + filter-as-you-type + an inline "＋ Create '<name>'" row. Used by BOTH `BulkSubwavePopover` (bulk bar) and the single-chapter inline `SubwaveEditor` (one birthplace, no drift). The old datalist couldn't open on focus, which is what the operator wanted.

Component contract: controlled (`value`/`onChange` + `onCommit`); optional `onBlur` (inline editor saves on blur), `onCancel` (inline Escape exits edit mode), `inputId` (label association), `ariaInvalid`. Arrow-key nav, `role=combobox/listbox` + `aria-activedescendant`. The dropdown list is an in-flow absolute `<ul>` INSIDE the component DOM (NOT a portal/datalist), so a wrapping popover's outside-click treats list clicks as "inside".

**Two adversarial-review fixes (both pinned by tests):**
1. **Escape layering** — `SubwaveCombobox` must use `e.nativeEvent.stopImmediatePropagation()` (NOT React `stopPropagation`) when it handles Escape, because `BulkSubwavePopover` listens for Escape via a NATIVE `document` keydown listener; React's stopPropagation wouldn't stop it, so one Escape closed both the list AND the popover. With `onCancel` absent (bulk popover) the list-closed Escape bubbles so the popover closes; with `onCancel` present (inline editor) both Escapes are swallowed.
2. `SubwaveEditor.saveDraft` sent `raw` to `updateChapterSubwave` while computing its optimistic value from cleaned `next` → now sends `next` (one birthplace).

Removed the now-dead `.subwave-input` chevron-suppression CSS from globals.css. Shipped to `dev`, folded into promotion **#271**. See [[golive-gate-refinements-task2-decisions]] (sibling go-live work) and [[queue-subwave-golive-gate-pr267]] (task origin).
