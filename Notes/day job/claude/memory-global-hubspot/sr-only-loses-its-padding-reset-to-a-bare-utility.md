---
name: sr-only-loses-its-padding-reset-to-a-bare-utility
description: "`sr-only` next to a bare `px-1` yields an 8px box, not 1px — same specificity, later utility wins the padding reset; put spacing on `focus:` so the resting box is measurable as hidden"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 305aade5-04bb-4208-b126-4e7a1f184bcc
  modified: 2026-09-01T04:16:43.951Z
---

Tailwind's `sr-only` is `position:absolute; width:1px; height:1px; padding:0; overflow:hidden; clip:rect(0,0,0,0); …`. It is a **single class**, so a sibling `px-1` on the same element has equal specificity and the later rule in the generated sheet wins the padding. Under `box-sizing: border-box` that turns `width:1px` into a **used width of 8px**.

Measured 2026-09-01 on `ChapterDetailTitle`'s rename button: `getComputedStyle(el).width === '8px'` with `class="sr-only … px-1 … focus:not-sr-only"`. Moving it to `focus:px-1` gave `1px`.

Nothing was visibly broken — `clip` still hides it — but the element is then an 8px absolutely-positioned box, and any assertion of the form "at rest it is clipped to nothing" fails or, worse, gets softened to match.

**How to apply:**
1. On an `sr-only` + `focus:not-sr-only` control (the skip-link pattern), put **every spacing utility on the `focus:` variant**. Only colour/typography belong on the resting class list.
2. `sr-only` is the right tool when a control must leave the visual page but keep a keyboard and screen-reader route — deleting the element removes the route, because a node not in the DOM cannot be tabbed to. Pair it with `focus:not-sr-only`: WCAG 2.4.7 needs a focused control visible, and an invisible focus stop is worse than none.
3. Prefer `focus:` over `focus-visible:` here — the resting box is 1px so there is no pointer route to focus, and `:focus-visible` does not match programmatic focus in Chromium, which is how AT often arrives.
4. **Playwright calls an `sr-only` element visible** (non-empty box + not `visibility:hidden`), exactly as it calls `opacity: 0` visible. Measure `toHaveCSS('width','1px')` at rest and `getBoundingClientRect().width > 1` after Tab; `toBeVisible()` proves nothing. `.click()` on the 1px box is unreliable — use `.press('Enter')`, which focuses first.

Related: [[truncate-clips-italic-ink-not-layout]], [[admin-ui-colour-and-chrome-taste-rules]].
