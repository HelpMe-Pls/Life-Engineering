---
name: admin-dark-theme-alpha-utilities-not-remapped
description: /admin dark theme remaps NAMED Tailwind colours only — text-black/50 & friends go invisible on dark tints
metadata: 
  node_type: memory
  type: project
  originSessionId: 0b818aa6-645a-4959-8064-84df187071b4
  modified: 2026-07-28T11:56:16.425Z
---

`website/app/globals.css`'s `[data-theme]` block remaps **named** Tailwind literals for the admin dark theme (`bg-white`, and the slate / red / emerald / amber / blue / indigo families). It does **not** remap black/white **alpha** utilities — `text-black/50`, `text-white/60`, `border-black/5`. So any of those sitting inside a tinted panel (e.g. `bg-red-50`, which becomes a semi-transparent dark rgba tint) renders near-black on dark: unreadable.

Also absent from the remap list, so avoid them on `/admin` surfaces: `text-slate-800`, `border-slate-200`, and the whole **cyan / violet / sky / rose** families.

**(2026-07-27) `divide-*` IS THE SAME TRAP, and it bit.** The remap block is a list of literal utility selectors — `.border-slate-100 { … }` — so `divide-slate-100` is untouched and keeps Tailwind's near-white light value in dark mode. It renders as a harsh white rule between rows: the operator's words were "too popped out… disorienting", and **light mode looks perfect**, which is what makes it easy to ship. Two files had it (the altai-sync verdict key and the technical-error list); every other admin surface already used `divide-[var(--color-brand-border)]` — a CSS var redefined per theme (`#E2E8F0` light, `#29324f` dark) and therefore immune. **Use `divide-[var(--color-brand-border)]`, never `divide-<named>`.** Same reasoning applies to any utility family the block does not list by name.

**Why:** shipped exactly this bug into the `/admin/altai-sync` prototype on 2026-07-25 — the verdict banner's fact labels used `text-black/50` on `bg-red-50` and the operator caught it in dark mode on first look. globals.css documents what IS remapped but never warns that alpha utilities are not, so reading it is not enough to avoid this.

**How to apply:** inside a tinted panel, use only remapped named colour classes, threaded through a `tone` prop (`Record<Tone, string>` lookups) so the pass/fail/warn paths can't drift apart. To catch it mechanically, render the component to static markup and grep for `text-(black|white)/\d+` — that assertion is what stopped it recurring here. Related: [[table-config-pinning-design-gate-checkpoint]] (the dark theme's tints are semi-transparent rgba, which is why pinned cells composite health tints over the theme surface).

**⚠ (2026-07-28) TWO MEASURED EXTENSIONS — an `opacity-*` utility is the same trap in the LIGHT theme, and `--color-brand-muted` is not safe on a tinted row at all.** Both found reviewing PR #404, both computed rather than eyeballed (WCAG 2.1, alpha composited against the real background):

- **`opacity-80` on muted text fails AA everywhere in light mode**: 3.24:1 on white, 3.06:1 on `bg-red-50`, 3.17:1 on `bg-amber-50`, 3.04:1 on `brand-surface-2` — against 4.5:1 for 12px. It even fails on dark `surface-2` (4.37:1). The mechanism is the same as the named/alpha split: the utility composites the colour toward whatever is behind it, and nothing in globals.css reviews that. **Let SIZE carry a text hierarchy, never opacity.**
- **`--color-brand-muted` (#64748B) over `bg-red-50` is 4.35:1 — an AA FAIL at full opacity.** It is 4.76:1 on white and 4.59:1 on amber, so it passes on every untinted row and fails on exactly the red one. Fix: `--color-brand-fg` on a bracketed/failing row (16.32:1 light, 13.05:1 dark) and keep muted elsewhere — a failing row reading heavier is correct emphasis. Dark mode passes either way (muted is 6.18:1 on the dark red tint), so this fork is light-theme-driven.

**How to apply:** don't trust a hex-vs-hex calculation for anything with alpha or a theme fork — assert it in the browser with `paintedContrast` (`website/e2e/fixtures/contrast.ts`), which composites every layer down to the first opaque ancestor. And **prove the assertion RED**: reverting the fork failed at `4.350302791773487`, matching the hand computation to four figures, which is what makes both trustworthy.
