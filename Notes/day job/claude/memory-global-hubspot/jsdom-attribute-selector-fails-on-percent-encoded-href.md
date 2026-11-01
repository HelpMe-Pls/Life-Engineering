---
name: jsdom-attribute-selector-fails-on-percent-encoded-href
description: "In jsdom, querySelector('a[href=\"...%5B...\"]') returns null against the very node whose getAttribute returns that exact string — match on the property instead"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7384e693-8f86-4dfd-837a-8994feb5ae49
  modified: 2026-09-10T10:58:18.707Z
---

`container.querySelector(\`a[href="${HREF}"]\`)` returns **null** in jsdom when `HREF` is
percent-encoded, even though `node.getAttribute('href')` on the matching element returns
that byte-identical string. Measured 2026-09-10 with
`TEMPLATE_DOWNLOAD_HREF = '/templates/%5BSample%5D%20Contacts-data.xlsx'` (from
`website/lib/schema/contact-fields.ts`): `querySelectorAll('a')` found the anchor and its
`getAttribute('href')` compared equal, while the attribute-selector form found nothing.

Match on the property instead:

```ts
[...container.querySelectorAll('a')].find((a) => a.getAttribute('href') === HREF)
```

**Why it matters more than an ordinary quirk:** it fails in the SAFE-LOOKING direction. The
test that hit this was comparing a callout's `<code>` label against the real control's label,
so the null selector surfaced as *an empty label*, not as *a missing link* — it would have
read as "the two labels differ" rather than "the query is broken". Only the positive control
(`expect(control).not.toBe('')`) said what had actually happened. See
[[probe-script-can-be-vacuous-print-the-shape-first]]: printing the anchor count, its raw
`getAttribute` value and the selector string side by side is what identified it in one pass.

Identifying a control by WHAT IT DOES (its href points at the template) rather than by what
it says is still the right shape for a label-drift guard — see
[[report-that-names-its-own-fix-must-be-measured]]. Just do the matching in JS.
