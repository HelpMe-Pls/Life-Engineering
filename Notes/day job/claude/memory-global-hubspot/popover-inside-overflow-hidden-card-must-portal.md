---
name: popover-inside-overflow-hidden-card-must-portal
description: "An anchored /admin popover must portal out of the card's overflow-hidden — but to the THEMED root's dedicated host div, never <body> (loses dark theme) and never via a context-published ref (races the RSC stream)."
metadata: 
  node_type: memory
  type: project
  originSessionId: 19790602-4670-4bad-b28c-2a884223ae55
  modified: 2026-07-27T02:58:43.370Z
---

`/admin` cards are `overflow-hidden rounded border …` — the `overflow-hidden` is
what keeps a table's square corners inside the rounded border. **Any `absolute`
popover rendered inside one is clipped by it.** Shipped exactly this in the
altai-sync worklists (2026-07-27): 197px of the 340px Table-settings panel gone.

**How to detect clipping — a `boundingBox()` assertion CANNOT.** The box is
reported in full even when the pixels are clipped away, so the element "is
visible" and the screenshot disagrees. Walk the ancestors and intersect:

```ts
const offenders = await panel.evaluate((el) => {
  const own = el.getBoundingClientRect(); const out: string[] = []
  for (let n = el.parentElement; n; n = n.parentElement) {
    const s = getComputedStyle(n)
    if (s.overflow === 'visible' && s.overflowX === 'visible' && s.overflowY === 'visible') continue
    const r = n.getBoundingClientRect()
    if (own.right - r.right > 1 || own.bottom - r.bottom > 1) out.push(n.className)
  }
  return out
})
```

## The fix is `adminPortalTarget()`, and each word of it was earned

`app/admin/components/AdminThemeRoot.tsx` renders a **dedicated empty `<div
id="admin-portal-host" />`** as the last child of the themed div, and exports
`adminPortalTarget()` (`getElementById(...) ?? document.body`). All four admin
popovers use it: `ColumnSettings`, `HealthEditor`, `BoardCellPopover`,
`BulkSubwavePopover`. **Three wrong versions were shipped or tried first:**

1. **`document.body` — loses the theme.** `data-theme` is on a div INSIDE the
   admin layout, so `<body>` is its SIBLING: neither `[data-theme] .bg-white`
   nor the dark token values reach it, and every popover is frozen light inside
   a dark admin. The operator caught it on Table settings.
2. **The themed div itself as the container — DOM corruption.** React reconciles
   a container's children by position and portal children land in the same list.
   Use a child div that React never gives children of its own.
3. **Publishing the host node through context (ref callback → `useState`) —
   races the RSC stream.** That state update re-renders the entire admin tree one
   beat after hydration; `master-admin-accounts.spec.ts` then intermittently saw
   **two of every control** (~1 run in 3), with the duplicate already gone by the
   time the failure snapshot was captured. A `getElementById` lookup from inside
   the `open &&` branch has no such render — and the host is always mounted by
   then, because `open` only becomes true from a click.

Two consequences to keep: outside-click dismissal must check the PANEL ref as
well as the wrapper (portaled, the panel is not a descendant), and every colour
inside a now-themed popover must be a REMAPPED step — `HealthEditor`'s ✓/✕ had
to move off `emerald-600`/`red-500`, which globals.css does not remap.

## A flipped-up anchored panel pins `bottom`, not `top`

Dropping down, the panel's top is known. Flipped ABOVE, its top depends on a
height you do not have at measure time, and the only number on hand is
`maxHeight` — a **cap**, not a height. Using it put a 264px panel **313px** clear
of its own trigger. Set `bottom: innerHeight − anchor.top + GAP` and let CSS
resolve the top; model the two sides as a discriminated union, since they
genuinely anchor different edges.

## Also

A `ColumnResizeHandle` inside a `<th>` joins the header's accessible name
("Email Resize Email column"), so locate headers by **prefix regex**
(`{ name: /^Email/ }`).

**A single E2E run is not evidence about a change.** One clean-tree pass looked
exactly like proof that my change caused the duplication; `--repeat-each=3/4` on
both trees is what separated the real regression from the flake. Same trap as
[[verify-running-branch-before-diagnosing]] and the 7-in-8 #338 race.

See [[admin-ui-colour-and-chrome-taste-rules]], [[admin-dark-theme-alpha-utilities-not-remapped]].
