---
name: admin-ui-colour-and-chrome-taste-rules
description: "Operator's design rules for /admin UI — never colour chrome, and lightness alone can't separate two colours on the dark theme"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0b818aa6-645a-4959-8064-84df187071b4
  modified: 2026-07-26T01:29:54.757Z
---

Two rules extracted from six review rounds on the `/admin/altai-sync` prototype (2026-07-25). Both were learned by having attempts **rejected**, so applying them up front saves real cycles.

**1 · Never colour the chrome — colour only the informative element.** A full tinted panel for an error state got "everything doesn't have to be all red"; replacing it with a coloured rail down the card's left edge got **"very AI-esque and gives no taste"**. What was accepted: every card stays the same neutral surface as the rest of the page, and the state is an 8px dot plus the status word in the tone colour — with the only other saturated thing being the *number the reader came for*. Side benefit: a tinted panel forces every word inside it to be tinted too, so dropping it made the copy readable.

**2 · Lightness alone cannot separate two colours on the admin dark theme.** Three separate "these two look the same" reports (two edge kinds, two system node colours, two object chips) had one root cause: a hex that separates cleanly on white collapses on `#121a30`, because dark needs LIGHT values where light needs DARK ones. Worse, making *both* highlighted colours light means both just read as "white-ish" at 1–2px. **A distinguishable pair must differ in hue AND chroma** — e.g. saturated violet `#8b5cf6` against genuinely neutral grey `#9ca3af`.

⇒ The mechanism that works: **one scoped CSS-variable palette** with light values plus `[data-theme="dark"]` and `@media (prefers-color-scheme: dark) [data-theme="system"]` overrides — the same three-selector shape `globals.css` already uses. Needed because `globals.css`'s `[data-theme]` remaps only cover **named Tailwind classes** and cannot reach an SVG `fill` attribute or an inline `style`. See [[admin-dark-theme-alpha-utilities-not-remapped]] for the related trap (alpha utilities are never remapped).

**Also:** a cursor change is not a discoverable affordance — it is invisible until the user already suspects the feature exists. For resizable columns, what was accepted is a stated hint + always-visible ruled dividers + the divider itself thickening on hover. A `⋮` grip glyph per divider was rejected as "horrendous". **The line reacts; no decoration sits beside it.**
